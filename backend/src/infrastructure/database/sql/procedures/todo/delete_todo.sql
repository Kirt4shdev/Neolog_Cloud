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
