import { z } from "zod";
import { BaseEntity } from "./BaseEntity";
import { AuditableEntity } from "./AuditableEntity";

/**
 * CreatableEntity - Entidad con auditoría de creación
 *
 * Composición de:
 * - BaseEntity: createdAt
 * - AuditableEntity: createdBy
 *
 * Se utiliza para entidades que solo necesitan saber cuándo y quién las creó,
 * sin necesidad de tracking de actualizaciones o soft delete.
 * Ideal para relaciones simples como roles, donde los eventos ya auditan los cambios.
 */
export const CreatableEntity = BaseEntity.extend(AuditableEntity.shape);

export type CreatableEntity = z.infer<typeof CreatableEntity>;
