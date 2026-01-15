import { exec } from "child_process";

/**
 * Ejecuta un comando de shell de forma asíncrona
 * @param command - Comando a ejecutar
 * @returns Promise<Result<string>> - Result con stdout o error
 */
export async function execAsync(
  command: string
): Promise<Result<string>> {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        resolve({
          error: {
            message: `exec error: ${error.message}`,
            type: "internalServer",
          },
        });
      } else if (stderr && !stderr.includes("Trying to pull")) {
        console.error(`stderr: ${stderr}`);
        resolve({
          error: {
            message: `stderr: ${stderr}`,
            type: "internalServer",
          },
        });
      } else {
        resolve({ result: stdout.trim() });
      }
    });
  });
}
