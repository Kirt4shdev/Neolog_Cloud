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
