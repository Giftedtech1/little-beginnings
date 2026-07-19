-- Add extended medical & contact fields to the students table
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS sex TEXT,
  ADD COLUMN IF NOT EXISTS blood_group TEXT,
  ADD COLUMN IF NOT EXISTS genotype TEXT,
  ADD COLUMN IF NOT EXISTS program TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- Allow staff to update student records (admins already have full access)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'students' AND policyname = 'Staff can update students'
  ) THEN
    EXECUTE 'CREATE POLICY "Staff can update students" ON students FOR UPDATE USING (get_my_role() IN (''admin'', ''staff''))';
  END IF;
END $$;
