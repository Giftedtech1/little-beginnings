-- Add the staff_id column (unique 8-char string like "STF-1042")
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS staff_id VARCHAR(8) UNIQUE;

-- Function that picks a random STF-XXXX number not already in use
CREATE OR REPLACE FUNCTION generate_staff_id()
RETURNS TRIGGER AS $$
DECLARE
  new_id VARCHAR(8);
  done   BOOLEAN := FALSE;
BEGIN
  WHILE NOT done LOOP
    new_id := 'STF-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE staff_id = new_id) THEN
      done := TRUE;
    END IF;
  END LOOP;
  NEW.staff_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger fires automatically on every INSERT for staff
CREATE OR REPLACE TRIGGER assign_staff_id_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.role = 'staff' AND NEW.staff_id IS NULL)
  EXECUTE FUNCTION generate_staff_id();

-- Trigger fires automatically on UPDATE if promoted to staff
CREATE OR REPLACE TRIGGER assign_staff_id_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (NEW.role = 'staff' AND OLD.role != 'staff' AND NEW.staff_id IS NULL)
  EXECUTE FUNCTION generate_staff_id();

-- Backfill IDs for any existing staff members without one
DO $$
DECLARE
  rec RECORD;
  new_id VARCHAR(8);
BEGIN
  FOR rec IN SELECT id FROM profiles WHERE role = 'staff' AND staff_id IS NULL LOOP
    LOOP
      new_id := 'STF-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE staff_id = new_id);
    END LOOP;
    UPDATE profiles SET staff_id = new_id WHERE id = rec.id;
  END LOOP;
END;
$$;
