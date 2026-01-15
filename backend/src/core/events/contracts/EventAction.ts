import { z } from "zod";

/**
 * EventAction - Schema de acciones de evento con validación
 *
 * Acciones disponibles:
 * - get: Obtener
 * - create: Crear
 * - update: Actualizar
 * - delete: Eliminar
 * - login: Iniciar sesión
 * - logout: Cerrar sesión
 * - register: Registrar
 * - create-session: Crear sesión
 * - end-session: Cerrar sesión
 * - refresh-session: Actualizar sesión
 * - forgot-password: Solicitar cambio de contraseña
 * - reset-password: Cambiar contraseña
 * - block: Bloquear
 * - unblock: Desbloquear
 * - role-added: Agregar rol
 * - role-removed: Eliminar rol
 * - assign-role: Asignar rol
 * - remove-role: Remover rol
 * - ip-blocked: Bloquear IP
 * - ip-unblocked: Desbloquear IP
 * - ip-already-banned: IP ya bloqueada
 * - too-many-requests: Demasiadas solicitudes
 * 
 * Acciones Neologg Cloud:
 * - provision_device: Provisionar dispositivo
 * - get_device_list: Obtener lista de dispositivos
 * - get_device_detail: Obtener detalle de dispositivo
 * - send_device_action: Enviar acción a dispositivo
 * - delete_device: Eliminar dispositivo
 * - process_heartbeat: Procesar heartbeat MQTT
 * - process_data: Procesar datos MQTT
 * - process_license: Procesar validación de licencia
 * - get_provisioning_status: Obtener estado de provisioning
 * - toggle_provisioning: Activar/desactivar provisioning
 */
export const EventAction = z.enum([
  "get",
  "create",
  "update",
  "delete",
  "login",
  "logout",
  "register",
  "create-session",
  "delete-session",
  "delete-all-user-sessions",
  "forgot-password",
  "reset-password",
  "block",
  "unblock",
  "role-added",
  "role-removed",
  "assign-role",
  "remove-role",
  "ip-blocked",
  "ip-unblocked",
  "ip-already-banned",
  "too-many-requests",
  // Neologg Cloud Actions
  "provision_device",
  "get_device_list",
  "get_device_detail",
  "send_device_action",
  "delete_device",
  "process_heartbeat",
  "process_data",
  "process_license",
  "get_provisioning_status",
  "toggle_provisioning",
]);

export type EventAction = z.infer<typeof EventAction>;
