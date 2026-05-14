-- Update staff_id column to fit new format LBS 001 (needs more characters)
ALTER TABLE profiles ALTER COLUMN staff_id TYPE VARCHAR(12);

-- Replace the old random-based function with a sequential one
CREATE OR REPLACE FUNCTION generate_staff_id()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INT;
  new_id  VARCHAR(12);
BEGIN
  -- Count existing staff to determine next sequential number
  SELECT COUNT(*) + 1 INTO seq_num
  FROM profiles
  WHERE role = 'staff';

  new_id := 'LBS ' || LPAD(seq_num::TEXT, 3, '0');

  -- Ensure uniqueness in case of race conditions
  WHILE EXISTS (SELECT 1 FROM profiles WHERE staff_id = new_id) LOOP
    seq_num := seq_num + 1;
    new_id := 'LBS ' || LPAD(seq_num::TEXT, 3, '0');
  END LOOP;

  NEW.staff_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate triggers to pick up the new function
DROP TRIGGER IF EXISTS assign_staff_id_insert ON profiles;
DROP TRIGGER IF EXISTS assign_staff_id_update ON profiles;

CREATE TRIGGER assign_staff_id_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.role = 'staff' AND NEW.staff_id IS NULL)
  EXECUTE FUNCTION generate_staff_id();

CREATE TRIGGER assign_staff_id_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (NEW.role = 'staff' AND OLD.role != 'staff' AND NEW.staff_id IS NULL)
  EXECUTE FUNCTION generate_staff_id();
