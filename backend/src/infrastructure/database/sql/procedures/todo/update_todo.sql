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
