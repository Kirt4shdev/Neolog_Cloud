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
