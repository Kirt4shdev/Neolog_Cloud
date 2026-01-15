-- USER:
CREATE INDEX IF NOT EXISTS idx_user_id ON users(user_id);

-- USER CARD:
CREATE INDEX IF NOT EXISTS idx_user_card_user_id ON user_cards(user_id);

-- BLOCKED_USERS:
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON blacklist(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON blacklist(blocked_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_combined ON blacklist(blocker_id, blocked_id);

-- CLIENTS:
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

-- ADMINS:
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- Crear índice único parcial: solo un client activo por usuario
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_client_per_user 
ON clients(user_id) WHERE deleted_at IS NULL;

-- Crear índice único parcial: solo un admin activo por usuario
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_admin_per_user 
ON admins(user_id) WHERE deleted_at IS NULL;
