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
