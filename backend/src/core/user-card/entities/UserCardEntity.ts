import { z } from "zod";
import { TimestampedEntity } from "@core/shared/base/TimestampedEntity";
import { USER_CARD } from "@shared/constants/user-card";

/**
 * UserCardEntity - Entidad de tarjeta de usuario
 *
 * Información adicional del perfil de usuario (teléfono, dirección, etc.)
 *
 * @property userCardId - ID de la tarjeta
 * @property userId - ID del usuario propietario
 * @property phoneNumber - Número de teléfono
 * @property phonePrefix - Prefijo telefónico
 * @property country - País
 * @property city - Ciudad
 * @property address1 - Dirección principal
 * @property address2 - Dirección secundaria
 * @property description - Descripción adicional
 *
 * Hereda de TimestampedEntity:
 * - createdAt: Fecha de creación
 * - updatedAt: Fecha de actualización
 */
export const UserCardEntity = z
  .object({
    userCardId: z.uuid().trim(),
    userId: z.uuid().trim(),
    phoneNumber: z
      .string()
      .min(USER_CARD.PHONE_NUMBER_MIN_LENGTH)
      .max(USER_CARD.PHONE_NUMBER_MAX_LENGTH)
      .optional()
      .nullable()
      .default(null),
    phonePrefix: z
      .string()
      .min(USER_CARD.PHONE_PREFIX_MIN_LENGTH)
      .max(USER_CARD.PHONE_PREFIX_MAX_LENGTH)
      .optional()
      .nullable()
      .default(null),
    country: z
      .string()
      .min(USER_CARD.COUNTRY_MIN_LENGTH)
      .max(USER_CARD.COUNTRY_MAX_LENGTH)
      .optional()
      .nullable()
      .default(null),
    city: z
      .string()
      .min(USER_CARD.CITY_MIN_LENGTH)
      .max(USER_CARD.CITY_MAX_LENGTH)
      .optional()
      .nullable()
      .default(null),
    address1: z
      .string()
      .min(USER_CARD.ADDRESS1_MIN_LENGTH)
      .max(USER_CARD.ADDRESS1_MAX_LENGTH)
      .optional()
      .nullable()
      .default(null),
    address2: z
      .string()
      .min(USER_CARD.ADDRESS2_MIN_LENGTH)
      .max(USER_CARD.ADDRESS2_MAX_LENGTH)
      .optional()
      .nullable()
      .default(null),
    description: z
      .string()
      .min(USER_CARD.DESCRIPTION_MIN_LENGTH)
      .max(USER_CARD.DESCRIPTION_MAX_LENGTH)
      .optional()
      .nullable()
      .default(null),
  })
  .extend(TimestampedEntity.shape);

export type UserCardEntity = z.infer<typeof UserCardEntity>;
