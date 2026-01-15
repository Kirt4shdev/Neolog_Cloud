-- ============================================================================
-- DATABASE FILE - AUTO-GENERATED
-- Generated at: 2026-01-14T15:42:10.305Z
-- ============================================================================


-- ============================================================================
-- ENUMS.SQL
-- ============================================================================

DROP TYPE IF EXISTS METHOD_TYPE CASCADE;
CREATE TYPE METHOD_TYPE AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD');


-- ============================================================================
-- EXTENSIONS.SQL
-- ============================================================================

DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP EXTENSION IF EXISTS pgcrypto CASCADE;
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================================
-- FUNCTIONS.SQL
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp() 
RETURNS TRIGGER 
AS 
$$ 
BEGIN 
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ 
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION prevent_update_on_deleted()
RETURNS TRIGGER AS $$
DECLARE
    pk_name text;
    pk_value uuid;
BEGIN
    -- Si el registro ya está marcado como eliminado, bloqueamos el UPDATE
    IF OLD.deleted_at IS NOT NULL THEN
        -- Obtener nombre de la primera columna (asumimos que es la PK)
        SELECT a.attname
        INTO pk_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid
                           AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = TG_RELID
          AND i.indisprimary
        LIMIT 1;

        -- Obtener valor de esa PK dinámicamente
        EXECUTE format('SELECT ($1).%I', pk_name)
        INTO pk_value
        USING OLD;

        -- Lanzar el error con nombre y valor
        RAISE EXCEPTION 'No se puede modificar un registro eliminado (%: %)', pk_name, pk_value;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SCHEMA.SQL
-- ============================================================================

-- USERS:
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users(
    user_id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL CHECK (LENGTH(name) >= 2),
    email VARCHAR(100) NOT NULL UNIQUE CHECK (LENGTH(email) >= 5),
    password VARCHAR(250) NOT NULL CHECK (LENGTH(password) >= 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id)
);

-- ADMINS:
DROP TABLE IF EXISTS admins CASCADE;

CREATE TABLE IF NOT EXISTS admins(
    admin_id uuid DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID,
    PRIMARY KEY (admin_id),
    CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Agregar created_by y constraint de deleted_by después (necesita que admins exista primero para auto-referencia)
ALTER TABLE admins ADD COLUMN created_by UUID NOT NULL;
ALTER TABLE admins ADD CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES admins(admin_id) ON DELETE SET NULL;
ALTER TABLE admins ADD CONSTRAINT fk_deleted_by FOREIGN KEY(deleted_by) REFERENCES admins(admin_id) ON DELETE SET NULL;

-- USER CARDS:
DROP TABLE IF EXISTS user_cards CASCADE;

CREATE TABLE IF NOT EXISTS user_cards(
	user_card_id uuid DEFAULT uuid_generate_v4(),
	user_id uuid NOT NULL,
	phone_number VARCHAR(9),
	phone_prefix VARCHAR(3),
	country VARCHAR(100),
	city VARCHAR(100),
	address1 VARCHAR(255),
	address2 VARCHAR(255),
	description VARCHAR(255),

	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	PRIMARY KEY (user_card_id),

	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- CREAR ADMIN POR DEFECTO:
DELETE FROM users WHERE user_id = '122b71f0-24af-4f24-a8e9-658e4284a5ef';

-- 1. Insertar usuario admin
INSERT INTO users(user_id, name, email, password, created_at)
VALUES
	('122b71f0-24af-4f24-a8e9-658e4284a5ef', 'admin', 'admin@email.com', crypt('Password123*', gen_salt('bf')), NOW());

-- 2. Temporalmente deshabilitar la constraint para insertar el primer admin
ALTER TABLE admins DROP CONSTRAINT IF EXISTS fk_created_by;

-- 3. Insertar admin que se crea a sí mismo
INSERT INTO admins(admin_id, user_id, created_by)
VALUES
	('122b71f0-24af-4f24-a8e9-658e4284a5ef', '122b71f0-24af-4f24-a8e9-658e4284a5ef', '122b71f0-24af-4f24-a8e9-658e4284a5ef');

-- 4. Re-agregar la constraint
ALTER TABLE admins ADD CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES admins(admin_id) ON DELETE SET NULL;

-- CLIENTS:
DROP TABLE IF EXISTS clients CASCADE;

CREATE TABLE IF NOT EXISTS clients(
	client_id uuid DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	created_by uuid NOT NULL,
	deleted_at TIMESTAMPTZ,
	deleted_by UUID,
	PRIMARY KEY (client_id),
	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
	CONSTRAINT fk_deleted_by FOREIGN KEY(deleted_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- BLACKLIST:
DROP TABLE IF EXISTS blacklist CASCADE;

CREATE TABLE IF NOT EXISTS blacklist (
	blacklist_id  uuid DEFAULT uuid_generate_v4(),
	
	blocker_id UUID NOT NULL,
	blocked_id UUID NOT NULL,

	reason VARCHAR(255),

	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	created_by UUID NOT NULL,

	PRIMARY KEY(blacklist_id),

	CONSTRAINT fk_blocker_id FOREIGN KEY(blocker_id) REFERENCES admins(admin_id) ON DELETE SET NULL,
	CONSTRAINT fk_blocked_id FOREIGN KEY(blocked_id) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- PASSWORD RECOVERY:
DROP TABLE IF EXISTS password_recovery CASCADE;

CREATE TABLE IF NOT EXISTS password_recovery(
	password_recovery_id uuid DEFAULT uuid_generate_v4(),
	user_id uuid NOT NULL UNIQUE,
	token VARCHAR(250) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY(password_recovery_id),
	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- TASKS:
DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE IF NOT EXISTS tasks(
	task_id uuid DEFAULT uuid_generate_v4(),
	task_name VARCHAR(255) NOT NULL,
	interval VARCHAR(50) NOT NULL,
	executed_at TIMESTAMPTZ,	
	execute_status BOOLEAN,
	error VARCHAR(500) DEFAULT NULL,

	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	created_by UUID NOT NULL,
	updated_by UUID,

	deleted_at TIMESTAMPTZ,
	deleted_by UUID,

	PRIMARY KEY (task_id),
	
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
	CONSTRAINT fk_updated_by FOREIGN KEY(updated_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
	CONSTRAINT fk_deleted_by FOREIGN KEY(deleted_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- EVENTS:
DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE IF NOT EXISTS events(
	event_id uuid DEFAULT uuid_generate_v4(),
	action VARCHAR(50) NOT NULL,
	endpoint VARCHAR(255) NOT NULL,
	occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	is_successful BOOLEAN,
	failure_reason VARCHAR(255) NULL,
	required_role VARCHAR(50),
	location VARCHAR(255) NULL,
	ip VARCHAR(50) NULL,
	table_name VARCHAR(100) NULL,
	user_id UUID NULL,
	resource_id UUID NULL,
	metadata JSONB NULL,
	method METHOD_TYPE NULL,
	is_exploit BOOLEAN NULL,

	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

	deleted_at TIMESTAMPTZ,
	deleted_by UUID,

	PRIMARY KEY (event_id),

	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE SET NULL,
	CONSTRAINT fk_deleted_by FOREIGN KEY(deleted_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- SESSIONS:
DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE IF NOT EXISTS sessions(
	session_id uuid DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL,
	jwt VARCHAR(250) NOT NULL,

	user_agent TEXT NOT NULL,
	browser VARCHAR(100) NOT NULL,
	browser_version VARCHAR(50) NOT NULL,
	browser_major VARCHAR(10) NOT NULL,
	os VARCHAR(50) NOT NULL,
	os_version VARCHAR(50) NOT NULL,
	platform VARCHAR(100) NOT NULL,
	device_type VARCHAR(20) NOT NULL,
	device_vendor VARCHAR(100) NOT NULL,
	device_model VARCHAR(100) NOT NULL,
	device VARCHAR(150) NOT NULL,
	cpu_architecture VARCHAR(50) NOT NULL,
	engine VARCHAR(50) NOT NULL,
	engine_version VARCHAR(50) NOT NULL,
	language VARCHAR(10) NOT NULL,
	languages VARCHAR(255) NOT NULL,
	ip VARCHAR(45) NOT NULL,
	is_mobile BOOLEAN NOT NULL DEFAULT FALSE,
	is_tablet BOOLEAN NOT NULL DEFAULT FALSE,
	is_desktop BOOLEAN NOT NULL DEFAULT TRUE,
	is_bot BOOLEAN NOT NULL DEFAULT FALSE,

	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	
	PRIMARY KEY(session_id),
	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- TODOS:
DROP TABLE IF EXISTS todos CASCADE;

CREATE TABLE IF NOT EXISTS todos(
	todo_id uuid DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL,
	title VARCHAR(255) NOT NULL CHECK (LENGTH(title) >= 1),
	description TEXT,
	is_completed BOOLEAN NOT NULL DEFAULT FALSE,
	priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
	due_date TIMESTAMPTZ,

	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	deleted_at TIMESTAMPTZ,
	deleted_by UUID,

	PRIMARY KEY(todo_id),
	CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	CONSTRAINT fk_deleted_by FOREIGN KEY(deleted_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- ============================================================================
-- NEOLOGG CLOUD TABLES
-- ============================================================================

-- PROVISIONING_CONFIG:
-- Tabla de configuración global para provisioning
DROP TABLE IF EXISTS provisioning_config CASCADE;

CREATE TABLE IF NOT EXISTS provisioning_config(
	config_id uuid DEFAULT uuid_generate_v4(),
	is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_by UUID,
	PRIMARY KEY (config_id),
	CONSTRAINT fk_updated_by FOREIGN KEY(updated_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- Insertar configuración inicial (provisioning habilitado por defecto)
INSERT INTO provisioning_config(is_enabled)
VALUES (TRUE);

-- DEVICES:
-- Tabla de dispositivos Neologg registrados
DROP TABLE IF EXISTS devices CASCADE;

CREATE TABLE IF NOT EXISTS devices(
	device_id uuid DEFAULT uuid_generate_v4(),
	
	-- Identificadores del dispositivo
	serial_number VARCHAR(50) NOT NULL UNIQUE,
	mac_address VARCHAR(17) NOT NULL,
	imei VARCHAR(15) NOT NULL,
	
	-- Credenciales generadas
	license VARCHAR(64) NOT NULL,
	root_password VARCHAR(50) NOT NULL,
	mqtt_username VARCHAR(50) NOT NULL,
	mqtt_password VARCHAR(100) NOT NULL,
	
	-- Estado del dispositivo
	status VARCHAR(20) NOT NULL DEFAULT 'unknown' CHECK (status IN ('online', 'offline', 'unknown')),
	last_seen_at TIMESTAMPTZ,
	
	-- Metadatos
	firmware_version VARCHAR(50),
	hardware_version VARCHAR(50),
	
	-- Localización (opcional, se actualiza desde datos GPS si existen)
	latitude DECIMAL(10, 8),
	longitude DECIMAL(11, 8),
	location_updated_at TIMESTAMPTZ,
	
	-- Auditoría
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	
	PRIMARY KEY (device_id)
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_devices_serial_number ON devices(serial_number);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_last_seen_at ON devices(last_seen_at);

-- DEVICE_TRANSMISSIONS:
-- Log de todas las transmisiones MQTT recibidas de los dispositivos
DROP TABLE IF EXISTS device_transmissions CASCADE;

CREATE TABLE IF NOT EXISTS device_transmissions(
	transmission_id uuid DEFAULT uuid_generate_v4(),
	device_id UUID NOT NULL,
	
	-- Información de la transmisión
	topic VARCHAR(255) NOT NULL,
	payload TEXT,
	
	-- Clasificación de mensaje
	message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('heartbeat', 'data', 'license', 'unknown')),
	
	-- Auditoría
	received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	
	PRIMARY KEY (transmission_id),
	CONSTRAINT fk_device_id FOREIGN KEY(device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- Índices para consultas de logs
CREATE INDEX idx_transmissions_device_id ON device_transmissions(device_id);
CREATE INDEX idx_transmissions_received_at ON device_transmissions(received_at DESC);
CREATE INDEX idx_transmissions_message_type ON device_transmissions(message_type);

-- DEVICE_ACTIONS:
-- Log de acciones enviadas a los dispositivos
DROP TABLE IF EXISTS device_actions CASCADE;

CREATE TABLE IF NOT EXISTS device_actions(
	action_id uuid DEFAULT uuid_generate_v4(),
	device_id UUID NOT NULL,
	
	-- Información de la acción
	action VARCHAR(50) NOT NULL CHECK (action IN ('restart', 'sync_time', 'rotate_logs', 'request_status')),
	payload TEXT,
	
	-- Usuario que solicitó la acción
	requested_by UUID NOT NULL,
	
	-- Auditoría
	requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	
	PRIMARY KEY (action_id),
	CONSTRAINT fk_device_id FOREIGN KEY(device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
	CONSTRAINT fk_requested_by FOREIGN KEY(requested_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- Índices para auditoría de acciones
CREATE INDEX idx_actions_device_id ON device_actions(device_id);
CREATE INDEX idx_actions_requested_at ON device_actions(requested_at DESC);
CREATE INDEX idx_actions_requested_by ON device_actions(requested_by);


-- ============================================================================
-- INDEX.SQL
-- ============================================================================

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


-- ============================================================================
-- TRIGGERS.SQL
-- ============================================================================

-- USER CARDS:
CREATE OR REPLACE TRIGGER set_timestamp_user_card BEFORE
UPDATE
  ON user_cards FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- TASKS:
CREATE OR REPLACE TRIGGER set_timestamp_tasks BEFORE
UPDATE
  ON tasks FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE OR REPLACE TRIGGER prevent_update_on_deleted_tasks BEFORE
UPDATE
  ON tasks FOR EACH ROW EXECUTE PROCEDURE prevent_update_on_deleted();

-- EVENTS:
CREATE OR REPLACE TRIGGER set_timestamp_events BEFORE
UPDATE
  ON events FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE OR REPLACE TRIGGER prevent_update_on_deleted_events BEFORE
UPDATE
  ON events FOR EACH ROW EXECUTE PROCEDURE prevent_update_on_deleted();


-- ############################################################################
-- AUTH PROCEDURES
-- ############################################################################


-- ============================================================================
-- AUTH\LOGIN.SQL
-- ============================================================================

-- LOGIN
DROP FUNCTION IF EXISTS login(VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION login(
    _email VARCHAR,
    _userPassword VARCHAR
)
RETURNS TABLE (
    "userId" UUID,
    name VARCHAR,
    email VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id AS "userId", u.name, u.email
    FROM users u
    WHERE u.email = _email
      AND u.password = crypt(_userPassword, u.password);
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- AUTH\REGISTER.SQL
-- ============================================================================

-- REGISTER
DROP FUNCTION IF EXISTS register(VARCHAR, VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION register(
    _name VARCHAR,
    _email VARCHAR,
    _userPassword VARCHAR
)
RETURNS TABLE (
    "userId" UUID,
    name VARCHAR,
    email VARCHAR
)
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO users AS u(name, email, password)
    VALUES (_name, _email, crypt(_userPassword, gen_salt('bf')))
    RETURNING u.user_id AS "userId", u.name, u.email;
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- BLACKLIST PROCEDURES
-- ############################################################################


-- ============================================================================
-- BLACKLIST\ADD_USER_TO_BLACKLIST.SQL
-- ============================================================================

-- ADD USER TO BLACKLIST
DROP FUNCTION IF EXISTS add_user_to_blacklist(UUID, UUID, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION add_user_to_blacklist(
    _blocked_id UUID,
    _blocker_id UUID,
    _reason VARCHAR
)
RETURNS TABLE (
    "blacklistId" UUID,
    "blockerId" UUID,
    "blockedId" UUID,
    reason VARCHAR,
    "createdAt" TIMESTAMPTZ,
    "createdBy" UUID
)
AS $$
DECLARE
    _admin_id UUID;
BEGIN
    -- Obtener el admin_id del blocker (solo admins activos)
    SELECT admins.admin_id INTO _admin_id
    FROM admins
    WHERE admins.user_id = _blocker_id AND admins.deleted_at IS NULL;

    -- Si no es admin activo, lanzar error
    IF _admin_id IS NULL THEN
        RAISE EXCEPTION 'Only active admins can add users to blacklist';
    END IF;

    -- Evitar que un usuario se añada a sí mismo a la blacklist
    IF _blocker_id = _blocked_id THEN
        RAISE EXCEPTION 'You cannot add yourself to the blacklist';
    END IF;

    -- Verificar que el usuario bloqueado existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE users.user_id = _blocked_id) THEN
        RAISE EXCEPTION 'Blocked user not found';
    END IF;

    -- Evitar que un admin pueda añadir a otro admin activo a la blacklist
    IF EXISTS (SELECT 1 FROM admins WHERE admins.user_id = _blocked_id AND admins.deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Cannot add an active admin to the blacklist';
    END IF;

    -- Verificar si ya está en la blacklist
    IF EXISTS (SELECT 1 FROM blacklist WHERE blacklist.blocked_id = _blocked_id) THEN
        RAISE EXCEPTION 'User is already in the blacklist'
            USING ERRCODE = '23505';
    END IF;

    -- Insertar en blacklist (blocker_id ahora es admin_id, no user_id)
    RETURN QUERY
    INSERT INTO blacklist (blocker_id, blocked_id, reason, created_by)
    VALUES (_admin_id, _blocked_id, _reason, _admin_id)
    RETURNING 
        blacklist.blacklist_id AS "blacklistId",
        blacklist.blocker_id AS "blockerId",
        blacklist.blocked_id AS "blockedId",
        blacklist.reason,
        blacklist.created_at AS "createdAt",
        blacklist.created_by AS "createdBy";
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- BLACKLIST\GET_BLACKLISTED_USERS.SQL
-- ============================================================================

-- GET BLACKLISTED USERS
DROP FUNCTION IF EXISTS get_blacklisted_users(INT, INT) CASCADE;

CREATE OR REPLACE FUNCTION get_blacklisted_users(
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    "blacklistId" UUID,
    "blockerId" UUID,
    "blockedId" UUID,
    reason VARCHAR,
    "createdAt" TIMESTAMPTZ,
    "createdBy" UUID
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        blacklist.blacklist_id AS "blacklistId",
        blacklist.blocker_id AS "blockerId",
        blacklist.blocked_id AS "blockedId",
        blacklist.reason,
        blacklist.created_at AS "createdAt",
        blacklist.created_by AS "createdBy"
    FROM 
        blacklist
    ORDER BY 
        blacklist.created_at DESC
    LIMIT 
        _limit
    OFFSET 
        _offset;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- BLACKLIST\IS_USER_IN_BLACKLIST.SQL
-- ============================================================================

-- IS USER IN BLACKLIST
DROP FUNCTION IF EXISTS is_user_in_blacklist(UUID) CASCADE;

CREATE OR REPLACE FUNCTION is_user_in_blacklist(_user_id UUID)
RETURNS TABLE (
    "isBlacklisted" BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT EXISTS(
        SELECT 1 
        FROM blacklist 
        WHERE blacklist.blocked_id = _user_id
    ) AS "isBlacklisted";
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- BLACKLIST\REMOVE_USER_FROM_BLACKLIST.SQL
-- ============================================================================

-- REMOVE USER FROM BLACKLIST (HARD DELETE)
DROP FUNCTION IF EXISTS remove_user_from_blacklist(UUID, UUID) CASCADE;

CREATE OR REPLACE FUNCTION remove_user_from_blacklist(
    _blocked_id UUID,
    _remover_id UUID
)
RETURNS TABLE (
    "blacklistId" UUID,
    "blockerId" UUID,
    "blockedId" UUID,
    reason VARCHAR,
    "createdAt" TIMESTAMPTZ,
    "createdBy" UUID
)
AS $$
DECLARE
    _admin_id UUID;
    _result RECORD;
BEGIN
    -- Obtener el admin_id del remover (solo admins activos)
    SELECT admins.admin_id INTO _admin_id
    FROM admins
    WHERE admins.user_id = _remover_id AND admins.deleted_at IS NULL;

    -- Si no es admin activo, lanzar error
    IF _admin_id IS NULL THEN
        RAISE EXCEPTION 'Only active admins can remove users from blacklist';
    END IF;

    -- Evitar que un usuario se elimine a sí mismo de la blacklist
    IF _remover_id = _blocked_id THEN
        RAISE EXCEPTION 'You cannot remove yourself from the blacklist';
    END IF;

    -- Verificar si el usuario está en la blacklist y obtener el registro antes de eliminarlo
    SELECT 
        blacklist.blacklist_id,
        blacklist.blocker_id,
        blacklist.blocked_id,
        blacklist.reason,
        blacklist.created_at,
        blacklist.created_by
    INTO _result
    FROM blacklist
    WHERE blacklist.blocked_id = _blocked_id;

    -- Si no existe, lanzar error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User is not in the blacklist';
    END IF;

    -- Hard delete (eliminar registro)
    DELETE FROM blacklist
    WHERE blacklist.blocked_id = _blocked_id;

    -- Retornar el registro que fue eliminado
    RETURN QUERY
    SELECT 
        _result.blacklist_id AS "blacklistId",
        _result.blocker_id AS "blockerId",
        _result.blocked_id AS "blockedId",
        _result.reason,
        _result.created_at AS "createdAt",
        _result.created_by AS "createdBy";
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- CARD PROCEDURES
-- ############################################################################


-- ============================================================================
-- CARD\CREATE_USER_CARD.SQL
-- ============================================================================

-- CREATE USER CARD:
DROP FUNCTION IF EXISTS create_user_card(
    UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR
) CASCADE;

CREATE OR REPLACE FUNCTION create_user_card(
    _userId UUID,
    _phoneNumber VARCHAR(9) DEFAULT NULL,
    _phonePrefix VARCHAR(3) DEFAULT NULL,
    _country VARCHAR(100) DEFAULT NULL,
    _city VARCHAR(100) DEFAULT NULL,
    _address1 VARCHAR(255) DEFAULT NULL,
    _address2 VARCHAR(255) DEFAULT NULL,
    _description VARCHAR(255) DEFAULT NULL
)
RETURNS TABLE (
    "userCardId" UUID,
    "userId" UUID,
    "phoneNumber" VARCHAR,
    "phonePrefix" VARCHAR,
    "country" VARCHAR,
    "city" VARCHAR,
    "address1" VARCHAR,
    "address2" VARCHAR,
    "description" VARCHAR,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ
)
AS $$
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Verificar que el usuario no tenga ya una tarjeta
    IF EXISTS (SELECT 1 FROM user_cards WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User already has a card';
    END IF;

    -- Insertar y retornar la tarjeta
    RETURN QUERY
    INSERT INTO user_cards (
        user_id, 
        phone_number, 
        phone_prefix, 
        country, 
        city, 
        address1, 
        address2, 
        description
    )
    VALUES (
        _userId, 
        _phoneNumber, 
        _phonePrefix, 
        _country, 
        _city, 
        _address1, 
        _address2, 
        _description
    )
    RETURNING 
        user_cards.user_card_id AS "userCardId",
        user_cards.user_id AS "userId",
        user_cards.phone_number AS "phoneNumber",
        user_cards.phone_prefix AS "phonePrefix",
        user_cards.country AS "country",
        user_cards.city AS "city",
        user_cards.address1 AS "address1",
        user_cards.address2 AS "address2",
        user_cards.description AS "description",
        user_cards.created_at AS "createdAt",
        user_cards.updated_at AS "updatedAt";
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- CARD\UPDATE_USER_CARD.SQL
-- ============================================================================

-- UPDATE USER CARD:
DROP FUNCTION IF EXISTS update_user_card CASCADE;

CREATE OR REPLACE FUNCTION update_user_card(
    _userId UUID,
    _phoneNumber VARCHAR(9) DEFAULT NULL,
    _phonePrefix VARCHAR(3) DEFAULT NULL,
    _country VARCHAR(100) DEFAULT NULL,
    _city VARCHAR(100) DEFAULT NULL,
    _address1 VARCHAR(255) DEFAULT NULL,
    _address2 VARCHAR(255) DEFAULT NULL,
    _description VARCHAR(255) DEFAULT NULL
)
RETURNS TABLE (
    "userCardId" UUID,
    "userId" UUID,
    "phoneNumber" VARCHAR,
    "phonePrefix" VARCHAR,
    "country" VARCHAR,
    "city" VARCHAR,
    "address1" VARCHAR,
    "address2" VARCHAR,
    "description" VARCHAR,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ
)
AS $$
BEGIN
    -- Verificar que la tarjeta existe
    IF NOT EXISTS (SELECT 1 FROM user_cards WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User card not found';
    END IF;

    -- Actualizar solo los campos que no son NULL y retornar
    RETURN QUERY
    UPDATE user_cards
    SET
        phone_number = COALESCE(_phoneNumber, user_cards.phone_number),
        phone_prefix = COALESCE(_phonePrefix, user_cards.phone_prefix),
        country = COALESCE(_country, user_cards.country),
        city = COALESCE(_city, user_cards.city),
        address1 = COALESCE(_address1, user_cards.address1),
        address2 = COALESCE(_address2, user_cards.address2),
        description = COALESCE(_description, user_cards.description),
        updated_at = NOW()
    WHERE
        user_cards.user_id = _userId
    RETURNING 
        user_cards.user_card_id AS "userCardId",
        user_cards.user_id AS "userId",
        user_cards.phone_number AS "phoneNumber",
        user_cards.phone_prefix AS "phonePrefix",
        user_cards.country AS "country",
        user_cards.city AS "city",
        user_cards.address1 AS "address1",
        user_cards.address2 AS "address2",
        user_cards.description AS "description",
        user_cards.created_at AS "createdAt",
        user_cards.updated_at AS "updatedAt";
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- DEVICE PROCEDURES
-- ############################################################################


-- ============================================================================
-- DEVICE\GET_DEVICE_BY_SERIAL_NUMBER.SQL
-- ============================================================================

-- GET_DEVICE_BY_SERIAL_NUMBER
DROP FUNCTION IF EXISTS get_device_by_serial_number(VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION get_device_by_serial_number(
    _serialNumber VARCHAR
)
RETURNS TABLE (
    "deviceId" UUID
)
AS $$
BEGIN
    RETURN QUERY
    SELECT device_id AS "deviceId"
    FROM devices
    WHERE serial_number = _serialNumber;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DEVICE\GET_DEVICE_DETAIL.SQL
-- ============================================================================

-- GET_DEVICE_DETAIL
DROP FUNCTION IF EXISTS get_device_detail(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_device_detail(
    _deviceId UUID
)
RETURNS TABLE (
    "deviceId" UUID,
    "serialNumber" VARCHAR,
    "macAddress" VARCHAR,
    imei VARCHAR,
    license VARCHAR,
    "rootPassword" VARCHAR,
    "mqttUsername" VARCHAR,
    "mqttPassword" VARCHAR,
    status VARCHAR,
    "lastSeenAt" TIMESTAMPTZ,
    "firmwareVersion" VARCHAR,
    "hardwareVersion" VARCHAR,
    latitude DECIMAL,
    longitude DECIMAL,
    "locationUpdatedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.device_id AS "deviceId",
        d.serial_number AS "serialNumber",
        d.mac_address AS "macAddress",
        d.imei,
        d.license,
        d.root_password AS "rootPassword",
        d.mqtt_username AS "mqttUsername",
        d.mqtt_password AS "mqttPassword",
        d.status,
        d.last_seen_at AS "lastSeenAt",
        d.firmware_version AS "firmwareVersion",
        d.hardware_version AS "hardwareVersion",
        d.latitude,
        d.longitude,
        d.location_updated_at AS "locationUpdatedAt",
        d.created_at AS "createdAt",
        d.updated_at AS "updatedAt"
    FROM devices d
    WHERE d.device_id = _deviceId;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DEVICE\GET_DEVICE_LIST.SQL
-- ============================================================================

-- GET_DEVICE_LIST
DROP FUNCTION IF EXISTS get_device_list() CASCADE;

CREATE OR REPLACE FUNCTION get_device_list()
RETURNS TABLE (
    "deviceId" UUID,
    "serialNumber" VARCHAR,
    status VARCHAR,
    "lastSeenAt" TIMESTAMPTZ,
    "firmwareVersion" VARCHAR,
    "createdAt" TIMESTAMPTZ
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.device_id AS "deviceId",
        d.serial_number AS "serialNumber",
        d.status,
        d.last_seen_at AS "lastSeenAt",
        d.firmware_version AS "firmwareVersion",
        d.created_at AS "createdAt"
    FROM devices d
    ORDER BY d.created_at DESC;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DEVICE\GET_DEVICE_TRANSMISSIONS.SQL
-- ============================================================================

-- GET_DEVICE_TRANSMISSIONS
DROP FUNCTION IF EXISTS get_device_transmissions(UUID, INTEGER) CASCADE;

CREATE OR REPLACE FUNCTION get_device_transmissions(
    _deviceId UUID,
    _limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    "transmissionId" UUID,
    "deviceId" UUID,
    topic VARCHAR,
    payload TEXT,
    "messageType" VARCHAR,
    "receivedAt" TIMESTAMPTZ
)
AS $$
BEGIN
    -- Verificar que el dispositivo existe
    IF NOT EXISTS (SELECT 1 FROM devices WHERE device_id = _deviceId) THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
    
    RETURN QUERY
    SELECT 
        dt.transmission_id AS "transmissionId",
        dt.device_id AS "deviceId",
        dt.topic,
        dt.payload,
        dt.message_type AS "messageType",
        dt.received_at AS "receivedAt"
    FROM device_transmissions dt
    WHERE dt.device_id = _deviceId
    ORDER BY dt.received_at DESC
    LIMIT _limit;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DEVICE\LOG_ACTION.SQL
-- ============================================================================

-- LOG_ACTION
DROP FUNCTION IF EXISTS log_action(UUID, VARCHAR, TEXT, UUID) CASCADE;

CREATE OR REPLACE FUNCTION log_action(
    _deviceId UUID,
    _action VARCHAR,
    _payload TEXT,
    _requestedBy UUID
)
RETURNS TABLE (
    "actionId" UUID,
    "deviceId" UUID,
    action VARCHAR,
    payload TEXT,
    "requestedBy" UUID,
    "requestedAt" TIMESTAMPTZ
)
AS $$
BEGIN
    -- Verificar que el dispositivo existe
    IF NOT EXISTS (SELECT 1 FROM devices WHERE device_id = _deviceId) THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
    
    -- Validar que la acción sea válida
    IF _action NOT IN ('restart', 'sync_time', 'rotate_logs', 'request_status') THEN
        RAISE EXCEPTION 'Invalid action. Must be restart, sync_time, rotate_logs or request_status';
    END IF;
    
    -- Verificar que el admin existe
    IF NOT EXISTS (SELECT 1 FROM admins WHERE admin_id = _requestedBy AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Only active admins can send actions';
    END IF;
    
    -- Insertar la acción
    RETURN QUERY
    INSERT INTO device_actions(
        device_id,
        action,
        payload,
        requested_by
    )
    VALUES (
        _deviceId,
        _action,
        _payload,
        _requestedBy
    )
    RETURNING 
        action_id AS "actionId",
        device_id AS "deviceId",
        action,
        payload,
        requested_by AS "requestedBy",
        requested_at AS "requestedAt";
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DEVICE\LOG_TRANSMISSION.SQL
-- ============================================================================

-- LOG_TRANSMISSION
DROP FUNCTION IF EXISTS log_transmission(VARCHAR, VARCHAR, TEXT, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION log_transmission(
    _serialNumber VARCHAR,
    _topic VARCHAR,
    _payload TEXT,
    _messageType VARCHAR
)
RETURNS TABLE (
    "transmissionId" UUID,
    "deviceId" UUID,
    topic VARCHAR,
    payload TEXT,
    "messageType" VARCHAR,
    "receivedAt" TIMESTAMPTZ
)
AS $$
DECLARE
    _deviceId UUID;
BEGIN
    -- Obtener el device_id del serial number
    SELECT device_id INTO _deviceId
    FROM devices
    WHERE serial_number = _serialNumber;
    
    IF _deviceId IS NULL THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
    
    -- Validar que el messageType sea válido
    IF _messageType NOT IN ('heartbeat', 'data', 'license', 'unknown') THEN
        RAISE EXCEPTION 'Invalid message type. Must be heartbeat, data, license or unknown';
    END IF;
    
    -- Insertar la transmisión
    RETURN QUERY
    INSERT INTO device_transmissions(
        device_id,
        topic,
        payload,
        message_type
    )
    VALUES (
        _deviceId,
        _topic,
        _payload,
        _messageType
    )
    RETURNING 
        transmission_id AS "transmissionId",
        device_id AS "deviceId",
        topic,
        payload,
        message_type AS "messageType",
        received_at AS "receivedAt";
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DEVICE\PROVISION_DEVICE.SQL
-- ============================================================================

-- PROVISION_DEVICE
DROP FUNCTION IF EXISTS provision_device(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION provision_device(
    _serialNumber VARCHAR,
    _macAddress VARCHAR,
    _imei VARCHAR,
    _license VARCHAR,
    _rootPassword VARCHAR,
    _mqttUsername VARCHAR,
    _mqttPassword VARCHAR
)
RETURNS TABLE (
    "deviceId" UUID,
    "serialNumber" VARCHAR,
    license VARCHAR,
    "rootPassword" VARCHAR,
    "mqttUsername" VARCHAR,
    "mqttPassword" VARCHAR
)
AS $$
BEGIN
    -- Verificar que no exista un dispositivo con el mismo serial number
    IF EXISTS (SELECT 1 FROM devices WHERE serial_number = _serialNumber) THEN
        RAISE EXCEPTION 'Device with this serial number already exists';
    END IF;

    -- Insertar el nuevo dispositivo
    RETURN QUERY
    INSERT INTO devices(
        serial_number,
        mac_address,
        imei,
        license,
        root_password,
        mqtt_username,
        mqtt_password,
        status
    )
    VALUES (
        _serialNumber,
        _macAddress,
        _imei,
        _license,
        _rootPassword,
        _mqttUsername,
        _mqttPassword,
        'unknown'
    )
    RETURNING 
        device_id AS "deviceId",
        serial_number AS "serialNumber",
        license,
        root_password AS "rootPassword",
        mqtt_username AS "mqttUsername",
        mqtt_password AS "mqttPassword";
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DEVICE\UPDATE_DEVICE_STATUS.SQL
-- ============================================================================

-- UPDATE_DEVICE_STATUS
DROP FUNCTION IF EXISTS update_device_status(VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION update_device_status(
    _serialNumber VARCHAR,
    _status VARCHAR
)
RETURNS VOID
AS $$
BEGIN
    -- Validar que el status sea válido
    IF _status NOT IN ('online', 'offline', 'unknown') THEN
        RAISE EXCEPTION 'Invalid status. Must be online, offline or unknown';
    END IF;
    
    UPDATE devices
    SET status = _status,
        updated_at = NOW()
    WHERE serial_number = _serialNumber;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DEVICE\UPDATE_LAST_SEEN.SQL
-- ============================================================================

-- UPDATE_LAST_SEEN
DROP FUNCTION IF EXISTS update_last_seen(VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION update_last_seen(
    _serialNumber VARCHAR
)
RETURNS VOID
AS $$
BEGIN
    UPDATE devices
    SET last_seen_at = NOW(),
        updated_at = NOW()
    WHERE serial_number = _serialNumber;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Device not found';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- EVENTS PROCEDURES
-- ############################################################################


-- ============================================================================
-- EVENTS\EMIT_EVENT.SQL
-- ============================================================================

-- EMIT EVENT
DROP FUNCTION IF EXISTS emit_event(
    _action VARCHAR,
    _endpoint VARCHAR,
    _occurredAt TIMESTAMPTZ,
    _requiredRole VARCHAR,
    _isSuccessful BOOLEAN,
    _failureReason VARCHAR,
    _location VARCHAR,
    _ip VARCHAR,
    _tableName VARCHAR,
    _userId UUID,
    _resourceId UUID,
    _metadata JSONB,
    _method VARCHAR,
    _isExploit BOOLEAN
) CASCADE;

CREATE OR REPLACE FUNCTION emit_event(
    _action VARCHAR,
    _endpoint VARCHAR,
    _occurredAt TIMESTAMPTZ,
    _requiredRole VARCHAR,
    _isSuccessful BOOLEAN,
    _failureReason VARCHAR,
    _location VARCHAR,
    _ip VARCHAR,
    _tableName VARCHAR,
    _userId UUID,
    _resourceId UUID,
    _metadata JSONB,
    _method VARCHAR,
    _isExploit BOOLEAN
) RETURNS VOID
AS $$
BEGIN
    INSERT INTO events (
        action,
        endpoint,
        occurred_at,
        required_role,
        is_successful,
        failure_reason,
        location,
        ip,
        table_name,
        user_id,
        resource_id,
        metadata,
        method,
        is_exploit
    ) VALUES (
        _action,
        _endpoint,
        _occurredAt,
        _requiredRole,
        _isSuccessful,
        _failureReason,
        _location,
        _ip,
        _tableName,
        _userId,
        _resourceId,
        _metadata,
        _method::METHOD_TYPE,
        _isExploit
    );
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- PASSWORD PROCEDURES
-- ############################################################################


-- ============================================================================
-- PASSWORD\FORGOT_PASSWORD.SQL
-- ============================================================================

-- FORGOT PASSWORD
DROP FUNCTION IF EXISTS forgot_password(VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION forgot_password(_email VARCHAR)
RETURNS TABLE (
    email VARCHAR,
    token VARCHAR
)
AS $$
DECLARE
    _user_id UUID;
    _token VARCHAR;
BEGIN
    -- Buscar el usuario por email
    SELECT users.user_id INTO _user_id
    FROM users
    WHERE users.email = _email;

    -- Si no se encuentra el usuario, lanzar error
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'Email not found';
    END IF;

    -- Verificar si ya existe una petición de recuperación de contraseña activa
    IF EXISTS (SELECT 1 FROM password_recovery WHERE password_recovery.user_id = _user_id) THEN
        RAISE EXCEPTION 'There is already a password recovery request for this user'
            USING ERRCODE = '23505';
    END IF;

    -- Generar token aleatorio (120 caracteres)
    _token := encode(gen_random_bytes(90), 'hex');

    -- Insertar la petición de recuperación de contraseña y devolver email y token
    INSERT INTO password_recovery (user_id, token)
    VALUES (_user_id, _token);
    
    -- Retornar el email y el token generado
    RETURN QUERY
    SELECT _email, _token;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- PASSWORD\RESET_PASSWORD.SQL
-- ============================================================================

-- RESET PASSWORD
DROP FUNCTION IF EXISTS reset_password(VARCHAR, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION reset_password(_token VARCHAR, _new_password VARCHAR)
RETURNS TABLE (
    email VARCHAR
)
AS $$
DECLARE
    _user_id UUID;
    _user_email VARCHAR;
BEGIN
    -- Buscar el user_id asociado al token
    SELECT password_recovery.user_id INTO _user_id
    FROM password_recovery
    WHERE password_recovery.token = _token;

    -- Si no se encuentra el token, lanzar error
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'Invalid token';
    END IF;

    -- Obtener el email del usuario
    SELECT users.email INTO _user_email
    FROM users
    WHERE users.user_id = _user_id;

    -- Actualizar la contraseña del usuario
    UPDATE users
    SET password = crypt(_new_password, gen_salt('bf'))
    WHERE user_id = _user_id;

    -- Eliminar la petición de recuperación de contraseña (hard delete)
    DELETE FROM password_recovery WHERE password_recovery.user_id = _user_id;
    
    -- Retornar el email del usuario
    RETURN QUERY
    SELECT _user_email;
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- PROVISIONING PROCEDURES
-- ############################################################################


-- ============================================================================
-- PROVISIONING\GET_PROVISIONING_STATUS.SQL
-- ============================================================================

-- GET_PROVISIONING_STATUS
DROP FUNCTION IF EXISTS get_provisioning_status() CASCADE;

CREATE OR REPLACE FUNCTION get_provisioning_status()
RETURNS TABLE (
    "configId" UUID,
    "isEnabled" BOOLEAN,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,
    "updatedBy" UUID
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pc.config_id AS "configId",
        pc.is_enabled AS "isEnabled",
        pc.created_at AS "createdAt",
        pc.updated_at AS "updatedAt",
        pc.updated_by AS "updatedBy"
    FROM provisioning_config pc
    ORDER BY pc.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- PROVISIONING\TOGGLE_PROVISIONING.SQL
-- ============================================================================

-- TOGGLE_PROVISIONING
DROP FUNCTION IF EXISTS toggle_provisioning(BOOLEAN, UUID) CASCADE;

CREATE OR REPLACE FUNCTION toggle_provisioning(
    _isEnabled BOOLEAN,
    _updatedBy UUID
)
RETURNS TABLE (
    "configId" UUID,
    "isEnabled" BOOLEAN,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,
    "updatedBy" UUID
)
AS $$
DECLARE
    _configId UUID;
BEGIN
    -- Verificar que el admin existe
    IF NOT EXISTS (SELECT 1 FROM admins WHERE admin_id = _updatedBy AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Only active admins can toggle provisioning';
    END IF;
    
    -- Obtener el config_id actual
    SELECT config_id INTO _configId
    FROM provisioning_config
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Actualizar la configuración
    UPDATE provisioning_config
    SET is_enabled = _isEnabled,
        updated_at = NOW(),
        updated_by = _updatedBy
    WHERE config_id = _configId;
    
    -- Devolver la configuración actualizada
    RETURN QUERY
    SELECT 
        pc.config_id AS "configId",
        pc.is_enabled AS "isEnabled",
        pc.created_at AS "createdAt",
        pc.updated_at AS "updatedAt",
        pc.updated_by AS "updatedBy"
    FROM provisioning_config pc
    WHERE pc.config_id = _configId;
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- ROLE PROCEDURES
-- ############################################################################


-- ============================================================================
-- ROLE\ASSIGN_ROLE.SQL
-- ============================================================================

-- ASSIGN ROLE:
DROP FUNCTION IF EXISTS assign_role(UUID, UUID, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION assign_role(
    _userId UUID,
    _createdBy UUID,
    _role VARCHAR
)
RETURNS TABLE (
    "userId" UUID,
    roles TEXT[],
    "createdAt" TIMESTAMPTZ,
    "createdBy" UUID,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" UUID
)
AS $$
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Verificar que el rol es válido
    IF _role NOT IN ('admin', 'client') THEN
        RAISE EXCEPTION 'Invalid role. Must be admin or client';
    END IF;

    -- Verificar que el creador es un admin activo
    IF NOT EXISTS (SELECT 1 FROM admins WHERE admin_id = _createdBy AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Only active admins can assign roles';
    END IF;

    -- Asignar el rol correspondiente
    IF _role = 'admin' THEN
        -- Verificar si ya tiene el rol activo
        IF EXISTS (SELECT 1 FROM admins WHERE user_id = _userId AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'User already has admin role';
        END IF;

        -- Siempre insertar nuevo registro para mantener historial completo
        INSERT INTO admins(user_id, created_by)
        VALUES (_userId, _createdBy);

    ELSIF _role = 'client' THEN
        -- Verificar si ya tiene el rol activo
        IF EXISTS (SELECT 1 FROM clients WHERE user_id = _userId AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'User already has client role';
        END IF;

        -- Siempre insertar nuevo registro para mantener historial completo
        INSERT INTO clients(user_id, created_by)
        VALUES (_userId, _createdBy);
    END IF;

    -- Devolver el estado actual de los roles del usuario (solo activos)
    RETURN QUERY
    SELECT 
        u.user_id AS "userId",
        ARRAY_REMOVE(ARRAY[
            CASE WHEN a.admin_id IS NOT NULL AND a.deleted_at IS NULL THEN 'admin'::TEXT END,
            CASE WHEN c.client_id IS NOT NULL AND c.deleted_at IS NULL THEN 'client'::TEXT END
        ], NULL) AS roles,
        COALESCE(a.created_at, c.created_at) AS "createdAt",
        CASE WHEN _role = 'admin' THEN a.created_by ELSE c.created_by END AS "createdBy",
        NULL::TIMESTAMPTZ AS "deletedAt",
        NULL::UUID AS "deletedBy"
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
    LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- ROLE\GET_ROLES_BY_USER_ID.SQL
-- ============================================================================

-- GET ROLES BY USER ID:
DROP FUNCTION IF EXISTS get_roles_by_user_id(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_roles_by_user_id(
    _userId UUID
)
RETURNS TABLE (
    "userId" UUID,
    "adminId" UUID,
    "clientId" UUID
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.user_id AS "userId",
        a.admin_id AS "adminId",
        c.client_id AS "clientId"
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
    LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- ROLE\REMOVE_ROLE.SQL
-- ============================================================================

-- REMOVE ROLE (SOFT DELETE):
DROP FUNCTION IF EXISTS remove_role(UUID, UUID, VARCHAR) CASCADE;

CREATE OR REPLACE FUNCTION remove_role(
    _userId UUID,
    _deletedBy UUID,
    _role VARCHAR
)
RETURNS TABLE (
    "userId" UUID,
    roles TEXT[],
    "createdAt" TIMESTAMPTZ,
    "createdBy" UUID,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" UUID
)
AS $$
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Verificar que el rol es válido
    IF _role NOT IN ('admin', 'client') THEN
        RAISE EXCEPTION 'Invalid role. Must be admin or client';
    END IF;

    -- Verificar que el deletedBy es un admin activo
    IF NOT EXISTS (SELECT 1 FROM admins WHERE admin_id = _deletedBy AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Only active admins can remove roles';
    END IF;

    -- Soft delete del rol correspondiente
    IF _role = 'admin' THEN
        -- Verificar si tiene el rol activo
        IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = _userId AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'User does not have admin role';
        END IF;

        -- Verificar que un admin no se quite el rol a sí mismo
        IF EXISTS (SELECT 1 FROM admins WHERE admin_id = _deletedBy AND user_id = _userId) THEN
            RAISE EXCEPTION 'Admins cannot remove their own admin role';
        END IF;

        -- Soft delete del admin
        UPDATE admins 
        SET deleted_at = NOW(), deleted_by = _deletedBy
        WHERE user_id = _userId AND deleted_at IS NULL;

    ELSIF _role = 'client' THEN
        -- Verificar si tiene el rol activo
        IF NOT EXISTS (SELECT 1 FROM clients WHERE user_id = _userId AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'User does not have client role';
        END IF;

        -- Soft delete del client
        UPDATE clients 
        SET deleted_at = NOW(), deleted_by = _deletedBy
        WHERE user_id = _userId AND deleted_at IS NULL;
    END IF;

    -- Devolver el estado actual de los roles del usuario (roles activos restantes)
    RETURN QUERY
    SELECT 
        u.user_id AS "userId",
        ARRAY_REMOVE(ARRAY[
            CASE WHEN a.admin_id IS NOT NULL AND a.deleted_at IS NULL THEN 'admin'::TEXT END,
            CASE WHEN c.client_id IS NOT NULL AND c.deleted_at IS NULL THEN 'client'::TEXT END
        ], NULL) AS roles,
        COALESCE(a.created_at, c.created_at) AS "createdAt",
        COALESCE(a.created_by, c.created_by) AS "createdBy",
        NULL::TIMESTAMPTZ AS "deletedAt",
        NULL::UUID AS "deletedBy"
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.user_id
    LEFT JOIN clients c ON u.user_id = c.user_id
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- SESSION PROCEDURES
-- ############################################################################


-- ============================================================================
-- SESSION\CREATE_SESSION.SQL
-- ============================================================================

-- CREATE SESSION:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS create_session CASCADE;

CREATE OR REPLACE FUNCTION create_session(
    _userId UUID,
    _jwt VARCHAR,
    _userAgent TEXT,
    _browser VARCHAR,
    _browserVersion VARCHAR,
    _browserMajor VARCHAR,
    _os VARCHAR,
    _osVersion VARCHAR,
    _platform VARCHAR,
    _deviceType VARCHAR,
    _deviceVendor VARCHAR,
    _deviceModel VARCHAR,
    _device VARCHAR,
    _cpuArchitecture VARCHAR,
    _engine VARCHAR,
    _engineVersion VARCHAR,
    _language VARCHAR,
    _languages VARCHAR,
    _ip VARCHAR,
    _isMobile BOOLEAN,
    _isTablet BOOLEAN,
    _isDesktop BOOLEAN,
    _isBot BOOLEAN
)
RETURNS TABLE (
    "sessionId" UUID,
    "userId" UUID,
    jwt VARCHAR,
    "userAgent" TEXT,
    browser VARCHAR,
    "browserVersion" VARCHAR,
    "browserMajor" VARCHAR,
    os VARCHAR,
    "osVersion" VARCHAR,
    platform VARCHAR,
    "deviceType" VARCHAR,
    "deviceVendor" VARCHAR,
    "deviceModel" VARCHAR,
    device VARCHAR,
    "cpuArchitecture" VARCHAR,
    engine VARCHAR,
    "engineVersion" VARCHAR,
    language VARCHAR,
    languages VARCHAR,
    ip VARCHAR,
    "isMobile" BOOLEAN,
    "isTablet" BOOLEAN,
    "isDesktop" BOOLEAN,
    "isBot" BOOLEAN,
    "createdAt" TIMESTAMPTZ,
    "lastUsedAt" TIMESTAMPTZ
)
AS $$
DECLARE
    _sessionId UUID;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Validar deviceType
    IF _deviceType NOT IN ('mobile', 'tablet', 'desktop', 'smarttv', 'wearable', 'console') THEN
        RAISE EXCEPTION 'Invalid device type';
    END IF;

    -- Insertar la nueva sesión
    INSERT INTO sessions(
        user_id,
        jwt,
        user_agent,
        browser,
        browser_version,
        browser_major,
        os,
        os_version,
        platform,
        device_type,
        device_vendor,
        device_model,
        device,
        cpu_architecture,
        engine,
        engine_version,
        language,
        languages,
        ip,
        is_mobile,
        is_tablet,
        is_desktop,
        is_bot,
        last_used_at
    )
    VALUES (
        _userId,
        _jwt,
        _userAgent,
        _browser,
        _browserVersion,
        _browserMajor,
        _os,
        _osVersion,
        _platform,
        _deviceType,
        _deviceVendor,
        _deviceModel,
        _device,
        _cpuArchitecture,
        _engine,
        _engineVersion,
        _language,
        _languages,
        _ip,
        _isMobile,
        _isTablet,
        _isDesktop,
        _isBot,
        NOW()
    )
    RETURNING session_id INTO _sessionId;

    -- Devolver la sesión creada
    RETURN QUERY
    SELECT 
        s.session_id AS "sessionId",
        s.user_id AS "userId",
        s.jwt,
        s.user_agent AS "userAgent",
        s.browser,
        s.browser_version AS "browserVersion",
        s.browser_major AS "browserMajor",
        s.os,
        s.os_version AS "osVersion",
        s.platform,
        s.device_type AS "deviceType",
        s.device_vendor AS "deviceVendor",
        s.device_model AS "deviceModel",
        s.device,
        s.cpu_architecture AS "cpuArchitecture",
        s.engine,
        s.engine_version AS "engineVersion",
        s.language,
        s.languages,
        s.ip,
        s.is_mobile AS "isMobile",
        s.is_tablet AS "isTablet",
        s.is_desktop AS "isDesktop",
        s.is_bot AS "isBot",
        s.created_at AS "createdAt",
        s.last_used_at AS "lastUsedAt"
    FROM sessions s
    WHERE s.session_id = _sessionId;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SESSION\DELETE_ALL_USER_SESSIONS.SQL
-- ============================================================================

-- DELETE ALL USER SESSIONS:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS delete_all_user_sessions CASCADE;

CREATE OR REPLACE FUNCTION delete_all_user_sessions(
    _userId UUID
)
RETURNS VOID
AS $$
DECLARE
    _deletedCount INT;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Eliminar todas las sesiones del usuario
    DELETE FROM sessions
    WHERE user_id = _userId;

    -- Obtener el número de sesiones eliminadas
    GET DIAGNOSTICS _deletedCount = ROW_COUNT;

    -- Si no se eliminó ninguna sesión, lanzar error
    IF _deletedCount = 0 THEN
        RAISE EXCEPTION 'No sessions found for this user';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SESSION\DELETE_SESSION.SQL
-- ============================================================================

-- DELETE SESSION:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS delete_session CASCADE;

CREATE OR REPLACE FUNCTION delete_session(
    _sessionId UUID
)
RETURNS TABLE (
    "sessionId" UUID,
    "userId" UUID,
    jwt VARCHAR,
    "userAgent" TEXT,
    browser VARCHAR,
    "browserVersion" VARCHAR,
    "browserMajor" VARCHAR,
    os VARCHAR,
    "osVersion" VARCHAR,
    platform VARCHAR,
    "deviceType" VARCHAR,
    "deviceVendor" VARCHAR,
    "deviceModel" VARCHAR,
    device VARCHAR,
    "cpuArchitecture" VARCHAR,
    engine VARCHAR,
    "engineVersion" VARCHAR,
    language VARCHAR,
    languages VARCHAR,
    ip VARCHAR,
    "isMobile" BOOLEAN,
    "isTablet" BOOLEAN,
    "isDesktop" BOOLEAN,
    "isBot" BOOLEAN,
    "createdAt" TIMESTAMPTZ,
    "lastUsedAt" TIMESTAMPTZ
)
AS $$
DECLARE
    _deletedSession RECORD;
BEGIN
    -- Eliminar la sesión y guardar los datos
    DELETE FROM sessions s
    WHERE s.session_id = _sessionId
    RETURNING 
        s.session_id,
        s.user_id,
        s.jwt,
        s.user_agent,
        s.browser,
        s.browser_version,
        s.browser_major,
        s.os,
        s.os_version,
        s.platform,
        s.device_type,
        s.device_vendor,
        s.device_model,
        s.device,
        s.cpu_architecture,
        s.engine,
        s.engine_version,
        s.language,
        s.languages,
        s.ip,
        s.is_mobile,
        s.is_tablet,
        s.is_desktop,
        s.is_bot,
        s.created_at,
        s.last_used_at
    INTO _deletedSession;

    -- Si no se encontró la sesión, lanzar error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session not found';
    END IF;

    -- Devolver la sesión eliminada
    RETURN QUERY
    SELECT 
        _deletedSession.session_id AS "sessionId",
        _deletedSession.user_id AS "userId",
        _deletedSession.jwt,
        _deletedSession.user_agent AS "userAgent",
        _deletedSession.browser,
        _deletedSession.browser_version AS "browserVersion",
        _deletedSession.browser_major AS "browserMajor",
        _deletedSession.os,
        _deletedSession.os_version AS "osVersion",
        _deletedSession.platform,
        _deletedSession.device_type AS "deviceType",
        _deletedSession.device_vendor AS "deviceVendor",
        _deletedSession.device_model AS "deviceModel",
        _deletedSession.device,
        _deletedSession.cpu_architecture AS "cpuArchitecture",
        _deletedSession.engine,
        _deletedSession.engine_version AS "engineVersion",
        _deletedSession.language,
        _deletedSession.languages,
        _deletedSession.ip,
        _deletedSession.is_mobile AS "isMobile",
        _deletedSession.is_tablet AS "isTablet",
        _deletedSession.is_desktop AS "isDesktop",
        _deletedSession.is_bot AS "isBot",
        _deletedSession.created_at AS "createdAt",
        _deletedSession.last_used_at AS "lastUsedAt";
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SESSION\GET_SESSIONS_BY_USER_ID.SQL
-- ============================================================================

-- GET SESSIONS BY USER ID:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS get_sessions_by_user_id CASCADE;

CREATE OR REPLACE FUNCTION get_sessions_by_user_id(
    _userId UUID
)
RETURNS TABLE (
    "sessionId" UUID,
    "userId" UUID,
    jwt VARCHAR,
    "userAgent" TEXT,
    browser VARCHAR,
    "browserVersion" VARCHAR,
    "browserMajor" VARCHAR,
    os VARCHAR,
    "osVersion" VARCHAR,
    platform VARCHAR,
    "deviceType" VARCHAR,
    "deviceVendor" VARCHAR,
    "deviceModel" VARCHAR,
    device VARCHAR,
    "cpuArchitecture" VARCHAR,
    engine VARCHAR,
    "engineVersion" VARCHAR,
    language VARCHAR,
    languages VARCHAR,
    ip VARCHAR,
    "isMobile" BOOLEAN,
    "isTablet" BOOLEAN,
    "isDesktop" BOOLEAN,
    "isBot" BOOLEAN,
    "createdAt" TIMESTAMPTZ,
    "lastUsedAt" TIMESTAMPTZ
)
AS $$
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Devolver todas las sesiones del usuario
    RETURN QUERY
    SELECT 
        s.session_id AS "sessionId",
        s.user_id AS "userId",
        s.jwt,
        s.user_agent AS "userAgent",
        s.browser,
        s.browser_version AS "browserVersion",
        s.browser_major AS "browserMajor",
        s.os,
        s.os_version AS "osVersion",
        s.platform,
        s.device_type AS "deviceType",
        s.device_vendor AS "deviceVendor",
        s.device_model AS "deviceModel",
        s.device,
        s.cpu_architecture AS "cpuArchitecture",
        s.engine,
        s.engine_version AS "engineVersion",
        s.language,
        s.languages,
        s.ip,
        s.is_mobile AS "isMobile",
        s.is_tablet AS "isTablet",
        s.is_desktop AS "isDesktop",
        s.is_bot AS "isBot",
        s.created_at AS "createdAt",
        s.last_used_at AS "lastUsedAt"
    FROM sessions s
    WHERE s.user_id = _userId
    ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SESSION\UPDATE_LAST_USED_AT_SESSION.SQL
-- ============================================================================

-- UPDATE LAST USED AT SESSION:
-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS update_last_used_at_session CASCADE;

CREATE OR REPLACE FUNCTION update_last_used_at_session(
    _sessionId UUID
)
RETURNS VOID
AS $$
DECLARE
    _rowCount INT;
BEGIN
    -- Actualizar el campo last_used_at de la sesión
    UPDATE sessions
    SET last_used_at = NOW()
    WHERE session_id = _sessionId;

    -- Obtener el número de filas actualizadas
    GET DIAGNOSTICS _rowCount = ROW_COUNT;

    -- Si no se actualizó ninguna fila, lanzar error
    IF _rowCount = 0 THEN
        RAISE EXCEPTION 'Session not found';
    END IF;
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- TODO PROCEDURES
-- ############################################################################


-- ============================================================================
-- TODO\CREATE_TODO.SQL
-- ============================================================================

-- CREATE TODO:
DROP FUNCTION IF EXISTS create_todo CASCADE;

CREATE OR REPLACE FUNCTION create_todo(
    _userId UUID,
    _title VARCHAR,
    _description TEXT DEFAULT NULL,
    _priority VARCHAR DEFAULT NULL,
    _dueDate TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    "todoId" UUID,
    "userId" UUID,
    title VARCHAR,
    description TEXT,
    "isCompleted" BOOLEAN,
    priority VARCHAR,
    "dueDate" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" UUID
)
AS $$
DECLARE
    _todoId UUID;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Validar priority si se proporciona
    IF _priority IS NOT NULL AND _priority NOT IN ('low', 'medium', 'high') THEN
        RAISE EXCEPTION 'Invalid priority. Must be low, medium or high';
    END IF;

    -- Insertar el nuevo ToDo
    INSERT INTO todos(
        user_id,
        title,
        description,
        priority,
        due_date
    )
    VALUES (
        _userId,
        _title,
        _description,
        _priority,
        _dueDate
    )
    RETURNING todo_id INTO _todoId;

    -- Devolver el ToDo creado
    RETURN QUERY
    SELECT 
        t.todo_id AS "todoId",
        t.user_id AS "userId",
        t.title,
        t.description,
        t.is_completed AS "isCompleted",
        t.priority,
        t.due_date AS "dueDate",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",
        t.deleted_at AS "deletedAt",
        t.deleted_by AS "deletedBy"
    FROM todos t
    WHERE t.todo_id = _todoId;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TODO\DELETE_TODO.SQL
-- ============================================================================

-- DELETE TODO (SOFT DELETE):
DROP FUNCTION IF EXISTS delete_todo CASCADE;

CREATE OR REPLACE FUNCTION delete_todo(
    _todoId UUID,
    _deletedBy UUID
)
RETURNS TABLE (
    "todoId" UUID,
    "userId" UUID,
    title VARCHAR,
    description TEXT,
    "isCompleted" BOOLEAN,
    priority VARCHAR,
    "dueDate" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" UUID
)
AS $$
BEGIN
    -- Verificar que el ToDo existe y no está eliminado
    IF NOT EXISTS (SELECT 1 FROM todos WHERE todo_id = _todoId AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Todo not found';
    END IF;

    -- Soft delete del ToDo
    UPDATE todos
    SET 
        deleted_at = NOW(),
        deleted_by = _deletedBy
    WHERE todo_id = _todoId;

    -- Devolver el ToDo eliminado
    RETURN QUERY
    SELECT 
        t.todo_id AS "todoId",
        t.user_id AS "userId",
        t.title,
        t.description,
        t.is_completed AS "isCompleted",
        t.priority,
        t.due_date AS "dueDate",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",
        t.deleted_at AS "deletedAt",
        t.deleted_by AS "deletedBy"
    FROM todos t
    WHERE t.todo_id = _todoId;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TODO\GET_TODO_BY_ID.SQL
-- ============================================================================

-- GET TODO BY ID:
DROP FUNCTION IF EXISTS get_todo_by_id CASCADE;

CREATE OR REPLACE FUNCTION get_todo_by_id(
    _todoId UUID
)
RETURNS TABLE (
    "todoId" UUID,
    "userId" UUID,
    title VARCHAR,
    description TEXT,
    "isCompleted" BOOLEAN,
    priority VARCHAR,
    "dueDate" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" UUID
)
AS $$
BEGIN
    -- Devolver el ToDo (incluyendo los eliminados para manejar el error en el use case)
    RETURN QUERY
    SELECT 
        t.todo_id AS "todoId",
        t.user_id AS "userId",
        t.title,
        t.description,
        t.is_completed AS "isCompleted",
        t.priority,
        t.due_date AS "dueDate",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",
        t.deleted_at AS "deletedAt",
        t.deleted_by AS "deletedBy"
    FROM todos t
    WHERE t.todo_id = _todoId;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TODO\GET_TODOS_WITH_PAGINATION.SQL
-- ============================================================================

-- GET TODOS WITH PAGINATION:
DROP FUNCTION IF EXISTS get_todos_with_pagination CASCADE;

CREATE OR REPLACE FUNCTION get_todos_with_pagination(
    _userId UUID,
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    "todoId" UUID,
    "userId" UUID,
    title VARCHAR,
    description TEXT,
    "isCompleted" BOOLEAN,
    priority VARCHAR,
    "dueDate" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" UUID
)
AS $$
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = _userId) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Devolver los ToDo's del usuario (solo activos, no eliminados)
    RETURN QUERY
    SELECT 
        t.todo_id AS "todoId",
        t.user_id AS "userId",
        t.title,
        t.description,
        t.is_completed AS "isCompleted",
        t.priority,
        t.due_date AS "dueDate",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",
        t.deleted_at AS "deletedAt",
        t.deleted_by AS "deletedBy"
    FROM todos t
    WHERE t.user_id = _userId
      AND t.deleted_at IS NULL
    ORDER BY t.created_at DESC
    LIMIT _limit
    OFFSET _offset;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- TODO\UPDATE_TODO.SQL
-- ============================================================================

-- UPDATE TODO:
DROP FUNCTION IF EXISTS update_todo CASCADE;

CREATE OR REPLACE FUNCTION update_todo(
    _todoId UUID,
    _title VARCHAR DEFAULT NULL,
    _description TEXT DEFAULT NULL,
    _isCompleted BOOLEAN DEFAULT NULL,
    _priority VARCHAR DEFAULT NULL,
    _dueDate TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    "todoId" UUID,
    "userId" UUID,
    title VARCHAR,
    description TEXT,
    "isCompleted" BOOLEAN,
    priority VARCHAR,
    "dueDate" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ,
    "deletedBy" UUID
)
AS $$
BEGIN
    -- Verificar que el ToDo existe y no está eliminado
    IF NOT EXISTS (SELECT 1 FROM todos WHERE todo_id = _todoId AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Todo not found';
    END IF;

    -- Validar priority si se proporciona
    IF _priority IS NOT NULL AND _priority NOT IN ('low', 'medium', 'high') THEN
        RAISE EXCEPTION 'Invalid priority. Must be low, medium or high';
    END IF;

    -- Actualizar el ToDo (solo los campos que no son NULL)
    UPDATE todos
    SET
        title = COALESCE(_title, todos.title),
        description = COALESCE(_description, todos.description),
        is_completed = COALESCE(_isCompleted, todos.is_completed),
        priority = COALESCE(_priority, todos.priority),
        due_date = COALESCE(_dueDate, todos.due_date),
        updated_at = NOW()
    WHERE todo_id = _todoId;

    -- Devolver el ToDo actualizado
    RETURN QUERY
    SELECT 
        t.todo_id AS "todoId",
        t.user_id AS "userId",
        t.title,
        t.description,
        t.is_completed AS "isCompleted",
        t.priority,
        t.due_date AS "dueDate",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",
        t.deleted_at AS "deletedAt",
        t.deleted_by AS "deletedBy"
    FROM todos t
    WHERE t.todo_id = _todoId;
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- USER PROCEDURES
-- ############################################################################


-- ============================================================================
-- USER\GET_USER_BY_USER_ID.SQL
-- ============================================================================

-- GET USER BY USER ID:
DROP FUNCTION IF EXISTS get_user_by_user_id(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_user_by_user_id(
    _userId UUID
)
RETURNS TABLE (
    "userId" UUID,
    "name" VARCHAR,
    "email" VARCHAR,
    "createdAt" TIMESTAMPTZ
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.user_id AS "userId",
        u.name,
        u.email,
        u.created_at AS "createdAt"
    FROM users u
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- USER\GET_USERS_WITH_PAGINATION.SQL
-- ============================================================================

-- GET USERS WITH PAGINATION:
DROP FUNCTION IF EXISTS get_users_with_pagination(INT, INT) CASCADE;

CREATE OR REPLACE FUNCTION get_users_with_pagination(
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    "userId" UUID,
    "name" VARCHAR,
    "email" VARCHAR,
    "createdAt" TIMESTAMPTZ
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.user_id AS "userId",
        u.name,
        u.email,
        u.created_at AS "createdAt"
    FROM users u
    ORDER BY u.created_at DESC
    LIMIT _limit
    OFFSET _offset;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- USER\IS_VALID_USER_ID.SQL
-- ============================================================================

-- IS VALID USER ID:
DROP FUNCTION IF EXISTS is_valid_user_id(UUID) CASCADE;

CREATE OR REPLACE FUNCTION is_valid_user_id(
    _userId UUID
)   
RETURNS TABLE (
    "isValid" BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT EXISTS(
        SELECT 1 
        FROM users 
        WHERE user_id = _userId
    ) AS "isValid";
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- USER-PROFILE PROCEDURES
-- ############################################################################


-- ============================================================================
-- USER-PROFILE\GET_USER_PROFILE_BY_USER_ID.SQL
-- ============================================================================

-- GET USER PROFILE BY USER ID:
DROP FUNCTION IF EXISTS get_user_profile_by_user_id(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_user_profile_by_user_id(
    _userId UUID
)
RETURNS TABLE (
    "user" JSONB,
    "card" JSONB,
    "roles" TEXT[],
    "sessions" JSONB[],
    "isBlacklisted" BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jsonb_build_object(
            'userId', u.user_id,
            'name', u.name,
            'email', u.email,
            'createdAt', u.created_at
        ) AS "user",
        CASE 
            WHEN uc.user_card_id IS NOT NULL THEN
                jsonb_build_object(
                    'userCardId', uc.user_card_id,
                    'userId', uc.user_id,
                    'phoneNumber', uc.phone_number,
                    'phonePrefix', uc.phone_prefix,
                    'country', uc.country,
                    'city', uc.city,
                    'address1', uc.address1,
                    'address2', uc.address2,
                    'description', uc.description,
                    'createdAt', uc.created_at,
                    'updatedAt', uc.updated_at
                )
            ELSE NULL
        END AS "card",
        ARRAY_REMOVE(ARRAY[
            CASE WHEN a.admin_id IS NOT NULL AND a.deleted_at IS NULL THEN 'admin'::TEXT END,
            CASE WHEN c.client_id IS NOT NULL AND c.deleted_at IS NULL THEN 'client'::TEXT END
        ], NULL) AS "roles",
        COALESCE(
            ARRAY(
                SELECT jsonb_build_object(
                    'sessionId', s.session_id,
                    'userId', s.user_id,
                    'jwt', s.jwt,
                    'userAgent', s.user_agent,
                    'browser', s.browser,
                    'browserVersion', s.browser_version,
                    'browserMajor', s.browser_major,
                    'os', s.os,
                    'osVersion', s.os_version,
                    'platform', s.platform,
                    'deviceType', s.device_type,
                    'deviceVendor', s.device_vendor,
                    'deviceModel', s.device_model,
                    'device', s.device,
                    'cpuArchitecture', s.cpu_architecture,
                    'engine', s.engine,
                    'engineVersion', s.engine_version,
                    'language', s.language,
                    'languages', s.languages,
                    'ip', s.ip,
                    'isMobile', s.is_mobile,
                    'isTablet', s.is_tablet,
                    'isDesktop', s.is_desktop,
                    'isBot', s.is_bot,
                    'createdAt', s.created_at,
                    'lastUsedAt', s.last_used_at
                )
                FROM sessions s
                WHERE s.user_id = u.user_id
                ORDER BY s.created_at DESC
            ),
            ARRAY[]::JSONB[]
        ) AS "sessions",
        CASE WHEN b.blacklist_id IS NOT NULL THEN TRUE ELSE FALSE END AS "isBlacklisted"
    FROM users u
    LEFT JOIN user_cards uc ON u.user_id = uc.user_id
    LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
    LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL
    LEFT JOIN blacklist b ON u.user_id = b.blocked_id
    WHERE u.user_id = _userId;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- USER-PROFILE\GET_USERS_PROFILES_WITH_PAGINATION.SQL
-- ============================================================================

-- GET USERS PROFILES WITH PAGINATION:
DROP FUNCTION IF EXISTS get_users_profiles_with_pagination(INT, INT) CASCADE;

CREATE OR REPLACE FUNCTION get_users_profiles_with_pagination(
    _limit INT DEFAULT 10,
    _offset INT DEFAULT 0
)
RETURNS TABLE (
    "user" JSONB,
    "card" JSONB,
    "roles" TEXT[],
    "sessions" JSONB[],
    "isBlacklisted" BOOLEAN
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jsonb_build_object(
            'userId', u.user_id,
            'name', u.name,
            'email', u.email,
            'createdAt', u.created_at
        ) AS "user",
        CASE 
            WHEN uc.user_card_id IS NOT NULL THEN
                jsonb_build_object(
                    'userCardId', uc.user_card_id,
                    'userId', uc.user_id,
                    'phoneNumber', uc.phone_number,
                    'phonePrefix', uc.phone_prefix,
                    'country', uc.country,
                    'city', uc.city,
                    'address1', uc.address1,
                    'address2', uc.address2,
                    'description', uc.description,
                    'createdAt', uc.created_at,
                    'updatedAt', uc.updated_at
                )
            ELSE NULL
        END AS "card",
        ARRAY_REMOVE(ARRAY[
            CASE WHEN a.admin_id IS NOT NULL AND a.deleted_at IS NULL THEN 'admin'::TEXT END,
            CASE WHEN c.client_id IS NOT NULL AND c.deleted_at IS NULL THEN 'client'::TEXT END
        ], NULL) AS "roles",
        COALESCE(
            ARRAY(
                SELECT jsonb_build_object(
                    'sessionId', s.session_id,
                    'userId', s.user_id,
                    'jwt', s.jwt,
                    'userAgent', s.user_agent,
                    'browser', s.browser,
                    'browserVersion', s.browser_version,
                    'browserMajor', s.browser_major,
                    'os', s.os,
                    'osVersion', s.os_version,
                    'platform', s.platform,
                    'deviceType', s.device_type,
                    'deviceVendor', s.device_vendor,
                    'deviceModel', s.device_model,
                    'device', s.device,
                    'cpuArchitecture', s.cpu_architecture,
                    'engine', s.engine,
                    'engineVersion', s.engine_version,
                    'language', s.language,
                    'languages', s.languages,
                    'ip', s.ip,
                    'isMobile', s.is_mobile,
                    'isTablet', s.is_tablet,
                    'isDesktop', s.is_desktop,
                    'isBot', s.is_bot,
                    'createdAt', s.created_at,
                    'lastUsedAt', s.last_used_at
                )
                FROM sessions s
                WHERE s.user_id = u.user_id
                ORDER BY s.created_at DESC
            ),
            ARRAY[]::JSONB[]
        ) AS "sessions",
        CASE WHEN b.blacklist_id IS NOT NULL THEN TRUE ELSE FALSE END AS "isBlacklisted"
    FROM users u
    LEFT JOIN user_cards uc ON u.user_id = uc.user_id
    LEFT JOIN admins a ON u.user_id = a.user_id AND a.deleted_at IS NULL
    LEFT JOIN clients c ON u.user_id = c.user_id AND c.deleted_at IS NULL
    LEFT JOIN blacklist b ON u.user_id = b.blocked_id
    ORDER BY u.created_at DESC
    LIMIT _limit
    OFFSET _offset;
END;
$$ LANGUAGE plpgsql;

