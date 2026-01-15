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