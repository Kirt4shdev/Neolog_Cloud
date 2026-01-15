import { z } from "zod";
import { BaseEntity } from "./BaseEntity";
import { AuditableEntity } from "./AuditableEntity";
import { UpdateableEntity } from "./UpdateableEntity";
import { SoftDeletableEntity } from "./SoftDeletableEntity";

/**
 * TraceableEntity - Entidad con trazabilidad completa
 *
 * Composición de todas las entidades base:
 * - BaseEntity: createdAt
 * - AuditableEntity: createdBy
 * - UpdateableEntity: updatedAt, updatedBy
 * - SoftDeletableEntity: deletedAt, deletedBy
 *
 * Se utiliza para entidades que necesitan auditoría completa de creación, actualización y eliminación.
 * Incluye información sobre quién y cuándo realizó cada operación.
 */
export const TraceableEntity = BaseEntity.extend(AuditableEntity.shape)
  .extend(UpdateableEntity.shape)
  .extend(SoftDeletableEntity.shape);

export type TraceableEntity = z.infer<typeof TraceableEntity>;
