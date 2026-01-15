import { Debug } from "@shared/utils/Debug";
import { envs } from "@shared/envs";
import { execAsync } from "@shared/utils/execAsync";
import { promises as fs } from "fs";

/**
 * MosquittoService - Servicio para gestionar usuarios y ACL de Mosquitto
 *
 * Este servicio NO usa la API de Mosquitto (que no existe).
 * En su lugar, ejecuta comandos del sistema para:
 * - Crear/actualizar usuarios con mosquitto_passwd
 * - Actualizar el archivo ACL manualmente
 * - Recargar Mosquitto enviando SIGHUP al contenedor Docker
 */
class MosquittoService {
  private readonly passwdFile: string;
  private readonly aclFile: string;
  private readonly containerName: string;

  constructor() {
    this.passwdFile = envs.MOSQUITTO_PASSWD_FILE;
    this.aclFile = envs.MOSQUITTO_ACL_FILE;
    this.containerName = envs.MOSQUITTO_CONTAINER_NAME;
  }

  /**
   * Crea o actualiza un usuario MQTT en Mosquitto
   * @param username - Nombre de usuario (Serial Number del dispositivo)
   * @param password - Contraseña MQTT generada
   */
  public async createOrUpdateUser(
    username: string,
    password: string
  ): Promise<Result<void>> {
    try {
      Debug.info(`Creating/updating MQTT user: ${username}`);

      // Ejecutar mosquitto_passwd dentro del contenedor Docker
      // -b: modo batch (no interactivo)
      // Si el usuario existe, se actualiza la contraseña
      const command = `docker exec ${this.containerName} mosquitto_passwd -b ${this.passwdFile} ${username} ${password}`;

      const { error, result } = await execAsync(command);

      // mosquitto_passwd puede devolver warnings en stderr pero aún así funcionar correctamente
      // Solo fallamos si hay un error real (no warnings de permisos)
      if (error && !error.message.includes("Warning:")) {
        Debug.error(`Failed to create/update MQTT user: ${error.message}`);
        return {
          error: {
            message: `Failed to create MQTT user: ${error.message}`,
            type: "internalServer",
          },
        };
      }

      Debug.success(`MQTT user created/updated: ${username}`);
      return { result: undefined };
    } catch (error: any) {
      Debug.error(`Exception creating MQTT user: ${error.message}`);
      return {
        error: {
          message: `Exception creating MQTT user: ${error.message}`,
          type: "internalServer",
        },
      };
    }
  }

  /**
   * Añade permisos ACL para un dispositivo específico
   * @param username - Nombre de usuario (Serial Number del dispositivo)
   */
  public async addAclForDevice(username: string): Promise<Result<void>> {
    try {
      Debug.info(`Adding ACL for device: ${username}`);

      // Leer el archivo ACL actual desde el contenedor
      const readCommand = `docker exec ${this.containerName} cat ${this.aclFile}`;
      const { result: currentAcl } = await execAsync(readCommand);

      // Verificar si el usuario ya tiene ACL
      if (currentAcl && currentAcl.includes(`user ${username}`)) {
        Debug.warning(`ACL for device ${username} already exists`);
        return { result: undefined };
      }

      // Construir la nueva regla ACL
      const aclRule = `\n# Device: ${username}\nuser ${username}\ntopic readwrite production/neologg/${username}/#\n`;

      // Escribir la nueva ACL (append)
      const writeCommand = `docker exec ${this.containerName} sh -c 'echo "${aclRule}" >> ${this.aclFile}'`;
      const { error } = await execAsync(writeCommand);

      if (error) {
        Debug.error(`Failed to add ACL: ${error}`);
        return {
          error: {
            message: `Failed to add ACL: ${error}`,
            type: "internalServer",
          },
        };
      }

      Debug.success(`ACL added for device: ${username}`);
      return { result: undefined };
    } catch (error: any) {
      Debug.error(`Exception adding ACL: ${error.message}`);
      return {
        error: {
          message: `Exception adding ACL: ${error.message}`,
          type: "internalServer",
        },
      };
    }
  }

  /**
   * Recarga la configuración de Mosquitto enviando SIGHUP al contenedor
   * Esto hace que Mosquitto relea los archivos de passwd y ACL sin reiniciar
   */
  public async reloadMosquitto(): Promise<Result<void>> {
    try {
      Debug.info("Reloading Mosquitto configuration...");

      // Enviar SIGHUP al proceso mosquitto dentro del contenedor
      const command = `docker exec ${this.containerName} killall -HUP mosquitto`;
      const { error } = await execAsync(command);

      if (error) {
        Debug.error(`Failed to reload Mosquitto: ${error}`);
        return {
          error: {
            message: `Failed to reload Mosquitto: ${error}`,
            type: "internalServer",
          },
        };
      }

      Debug.success("Mosquitto reloaded successfully");
      return { result: undefined };
    } catch (error: any) {
      Debug.error(`Exception reloading Mosquitto: ${error.message}`);
      return {
        error: {
          message: `Exception reloading Mosquitto: ${error.message}`,
          type: "internalServer",
        },
      };
    }
  }

  /**
   * Provisiona un dispositivo en Mosquitto (usuario + ACL + reload)
   * @param username - Serial Number del dispositivo
   * @param password - Password MQTT generado
   */
  public async provisionDevice(
    username: string,
    password: string
  ): Promise<Result<void>> {
    // 1. Crear/actualizar usuario
    const userResult = await this.createOrUpdateUser(username, password);
    if (userResult.error) {
      return userResult;
    }

    // 2. Añadir ACL
    const aclResult = await this.addAclForDevice(username);
    if (aclResult.error) {
      return aclResult;
    }

    // 3. Recargar Mosquitto
    const reloadResult = await this.reloadMosquitto();
    if (reloadResult.error) {
      return reloadResult;
    }

    Debug.success(`Device ${username} provisioned successfully in Mosquitto`);
    return { result: undefined };
  }

  /**
   * Elimina un dispositivo de Mosquitto (passwd y ACL)
   */
  public async deleteDevice(serialNumber: string): Promise<Result<void>> {
    try {
      Debug.info(`Deleting device ${serialNumber} from Mosquitto...`);

      // 1. Eliminar usuario del archivo passwd
      const deleteUserCommand = `docker exec ${this.containerName} mosquitto_passwd -D ${this.passwdFile} ${serialNumber}`;
      const deleteUserResult = await execAsync(deleteUserCommand);

      if (deleteUserResult.error) {
        // Si el error es que el usuario no existe, lo ignoramos
        if (
          deleteUserResult.error.message.includes("not found") ||
          deleteUserResult.error.message.includes("does not exist")
        ) {
          Debug.warning(`User ${serialNumber} not found in passwd file, skipping`);
        } else {
          Debug.error(`Failed to delete user from passwd: ${deleteUserResult.error.message}`);
          return {
            error: {
              message: `Failed to delete user from passwd: ${deleteUserResult.error.message}`,
              type: "internalServer",
            },
          };
        }
      }

      // 2. Eliminar ACL del dispositivo
      // Leer el archivo ACL actual
      const readAclCommand = `docker exec ${this.containerName} cat ${this.aclFile}`;
      const readAclResult = await execAsync(readAclCommand);

      if (readAclResult.error) {
        Debug.error(`Failed to read ACL file: ${readAclResult.error.message}`);
        return {
          error: {
            message: `Failed to read ACL file: ${readAclResult.error.message}`,
            type: "internalServer",
          },
        };
      }

      // Filtrar las líneas que NO corresponden a este dispositivo
      const aclLines = readAclResult.result.split("\n");
      const filteredLines: string[] = [];
      let skipUntilNextUser = false;

      for (let i = 0; i < aclLines.length; i++) {
        const line = aclLines[i].trim();

        // Si encontramos el comentario del dispositivo a eliminar
        if (line.includes(`# Device: ${serialNumber}`)) {
          skipUntilNextUser = true;
          continue;
        }

        // Si encontramos otro "user" o comentario de dispositivo, dejamos de skip
        if (skipUntilNextUser && (line.startsWith("user ") || line.startsWith("# Device:"))) {
          skipUntilNextUser = false;
        }

        // Si no estamos en modo skip, agregamos la línea
        if (!skipUntilNextUser) {
          filteredLines.push(aclLines[i]);
        }
      }

      // Escribir el ACL filtrado
      const newAclContent = filteredLines.join("\n");
      const writeAclCommand = `docker exec ${this.containerName} sh -c "cat > ${this.aclFile} << 'EOFACL'\n${newAclContent}\nEOFACL"`;
      const writeAclResult = await execAsync(writeAclCommand);

      if (writeAclResult.error) {
        Debug.error(`Failed to write ACL file: ${writeAclResult.error.message}`);
        return {
          error: {
            message: `Failed to write ACL file: ${writeAclResult.error.message}`,
            type: "internalServer",
          },
        };
      }

      // 3. Recargar Mosquitto
      const reloadResult = await this.reloadMosquitto();
      if (reloadResult.error) {
        return reloadResult;
      }

      Debug.success(`Device ${serialNumber} deleted successfully from Mosquitto`);
      return { result: undefined };
    } catch (error: any) {
      Debug.error(`Failed to delete device from Mosquitto: ${error.message}`);
      return {
        error: {
          message: error.message,
          type: "internalServer",
        },
      };
    }
  }
}

export const mosquittoService = new MosquittoService();
