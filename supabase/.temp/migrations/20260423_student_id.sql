-- Add the student_id column (unique 4-char string like "1042")
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_id VARCHAR(4) UNIQUE;

-- Function that picks a random 4-digit number not already in use
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TRIGGER AS $$
DECLARE
  new_id VARCHAR(4);
  done   BOOLEAN := FALSE;
BEGIN
  WHILE NOT done LOOP
    new_id := LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
    IF NOT EXISTS (SELECT 1 FROM students WHERE student_id = new_id) THEN
      done := TRUE;
    END IF;
  END LOOP;
  NEW.student_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger fires automatically on every INSERT
CREATE OR REPLACE TRIGGER assign_student_id
  BEFORE INSERT ON students
  FOR EACH ROW
  WHEN (NEW.student_id IS NULL)
  EXECUTE FUNCTION generate_student_id();

-- Backfill IDs for any existing students without one
DO $$
DECLARE
  rec RECORD;
  new_id VARCHAR(4);
BEGIN
  FOR rec IN SELECT id FROM students WHERE student_id IS NULL LOOP
    LOOP
      new_id := LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM students WHERE student_id = new_id);
    END LOOP;
    UPDATE students SET student_id = new_id WHERE id = rec.id;
  END LOOP;
END;
$$;
