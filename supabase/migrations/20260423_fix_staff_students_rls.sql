-- Drop the old policy that used the problematic get_my_role() function
DROP POLICY IF EXISTS "Admins and Staff can read all students" ON students;

-- Recreate it using the more reliable subquery method
CREATE POLICY "Staff can select students" ON students
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('staff'::user_role, 'admin'::user_role)
  );
