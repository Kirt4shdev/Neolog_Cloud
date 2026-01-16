-- Migration: Revertir constraint a valores originales (offlinelwt se guarda como 'offline')
-- Created: 2026-01-16

-- Eliminar el constraint anterior
ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_status_check;

-- Crear el constraint con valores originales (online, offline, unknown)
ALTER TABLE devices ADD CONSTRAINT devices_status_check CHECK (status IN ('online', 'offline', 'unknown'));
