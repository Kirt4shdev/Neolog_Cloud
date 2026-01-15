import { z } from "zod";
import { USER_CARD } from "@shared/constants/user-card";

/**
 * UpdateUserCardContract - Contrato para actualizar una tarjeta de usuario
 *
 * @property userCardId - ID de la tarjeta a actualizar
 * @property phoneNumber - Número de teléfono (opcional)
 * @property phonePrefix - Prefijo telefónico (opcional)
 * @property country - País (opcional)
 * @property city - Ciudad (opcional)
 * @property address1 - Dirección principal (opcional)
 * @property address2 - Dirección secundaria (opcional)
 * @property description - Descripción adicional (opcional)
 * @property updatedBy - ID del usuario que realiza la actualización (opcional)
 */
export const UpdateUserCardContract = z.object({
  userId: z
    .string({ message: "userId is required" })
    .trim()
    .uuid({ message: "Invalid userId format" }),
  phoneNumber: z
    .string()
    .trim()
    .min(USER_CARD.PHONE_NUMBER_MIN_LENGTH, {
      message: `phoneNumber must be at least ${USER_CARD.PHONE_NUMBER_MIN_LENGTH} characters`,
    })
    .max(USER_CARD.PHONE_NUMBER_MAX_LENGTH, {
      message: `phoneNumber must be at most ${USER_CARD.PHONE_NUMBER_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .default(null),
  phonePrefix: z
    .string()
    .trim()
    .min(USER_CARD.PHONE_PREFIX_MIN_LENGTH, {
      message: `phonePrefix must be at least ${USER_CARD.PHONE_PREFIX_MIN_LENGTH} character`,
    })
    .max(USER_CARD.PHONE_PREFIX_MAX_LENGTH, {
      message: `phonePrefix must be at most ${USER_CARD.PHONE_PREFIX_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .default(null),
  country: z
    .string()
    .trim()
    .min(USER_CARD.COUNTRY_MIN_LENGTH, {
      message: `country must be at least ${USER_CARD.COUNTRY_MIN_LENGTH} characters`,
    })
    .max(USER_CARD.COUNTRY_MAX_LENGTH, {
      message: `country must be at most ${USER_CARD.COUNTRY_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .default(null),
  city: z
    .string()
    .trim()
    .min(USER_CARD.CITY_MIN_LENGTH, {
      message: `city must be at least ${USER_CARD.CITY_MIN_LENGTH} characters`,
    })
    .max(USER_CARD.CITY_MAX_LENGTH, {
      message: `city must be at most ${USER_CARD.CITY_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .default(null),
  address1: z
    .string()
    .trim()
    .min(USER_CARD.ADDRESS1_MIN_LENGTH, {
      message: `address1 must be at least ${USER_CARD.ADDRESS1_MIN_LENGTH} characters`,
    })
    .max(USER_CARD.ADDRESS1_MAX_LENGTH, {
      message: `address1 must be at most ${USER_CARD.ADDRESS1_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .default(null),
  address2: z
    .string()
    .trim()
    .min(USER_CARD.ADDRESS2_MIN_LENGTH, {
      message: `address2 must be at least ${USER_CARD.ADDRESS2_MIN_LENGTH} characters`,
    })
    .max(USER_CARD.ADDRESS2_MAX_LENGTH, {
      message: `address2 must be at most ${USER_CARD.ADDRESS2_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .default(null),
  description: z
    .string()
    .trim()
    .min(USER_CARD.DESCRIPTION_MIN_LENGTH, {
      message: `description must be at least ${USER_CARD.DESCRIPTION_MIN_LENGTH} characters`,
    })
    .max(USER_CARD.DESCRIPTION_MAX_LENGTH, {
      message: `description must be at most ${USER_CARD.DESCRIPTION_MAX_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .default(null),
});

export type UpdateUserCardContract = z.infer<typeof UpdateUserCardContract>;
