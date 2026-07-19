-- 1. Drop the trigger first because Postgres won't let us alter the column type while it is attached
DROP TRIGGER IF EXISTS assign_student_id ON students;

-- 2. Update student_id column to fit new format LBC-YY-XXX (needs 10 characters)
ALTER TABLE students ALTER COLUMN student_id TYPE VARCHAR(12);

-- 3. Recreate the trigger function to match the sequential LBC-YY-XXX format
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id         VARCHAR(12);
  seq_num        INT;
  two_digit_year VARCHAR(2);
BEGIN
  -- Extract last 2 digits of the registration year
  two_digit_year := RIGHT(NEW.registration_year::TEXT, 2);

  -- Count existing students for that registration year to determine next sequential number
  SELECT COUNT(*) + 1 INTO seq_num
  FROM students
  WHERE registration_year = NEW.registration_year;

  new_id := 'LBC-' || two_digit_year || '-' || LPAD(seq_num::TEXT, 3, '0');

  -- Ensure uniqueness in case of race conditions
  WHILE EXISTS (SELECT 1 FROM students WHERE student_id = new_id) LOOP
    seq_num := seq_num + 1;
    new_id := 'LBC-' || two_digit_year || '-' || LPAD(seq_num::TEXT, 3, '0');
  END LOOP;

  NEW.student_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Recreate the trigger on students table
CREATE TRIGGER assign_student_id
  BEFORE INSERT ON students
  FOR EACH ROW
  WHEN (NEW.student_id IS NULL)
  EXECUTE FUNCTION generate_student_id();
