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
