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