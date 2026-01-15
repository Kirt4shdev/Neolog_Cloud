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
