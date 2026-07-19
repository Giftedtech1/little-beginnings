-- Fix: Recreate the admin students policy with an explicit WITH CHECK clause
-- This ensures INSERT operations are also allowed for admin users
DROP POLICY IF EXISTS "Admins can manage students" ON students;

CREATE POLICY "Admins can manage students" ON students
  FOR ALL
  TO authenticated
  USING (get_my_role() = 'admin'::user_role)
  WITH CHECK (get_my_role() = 'admin'::user_role);
