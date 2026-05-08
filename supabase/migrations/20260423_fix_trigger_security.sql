-- Recreate the trigger function as SECURITY DEFINER
-- This ensures the internal SELECT (uniqueness check) runs as postgres,
-- bypassing RLS entirely and avoiding any permission issues inside the trigger.
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
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
