-- Drop the existing ALL policy
DROP POLICY IF EXISTS "Admins can manage students" ON students;

-- Create separate, explicit policies using a direct subquery instead of get_my_role()
-- This is more reliable and avoids any function caching edge cases

CREATE POLICY "Admins can select students" ON students
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
  );

CREATE POLICY "Admins can insert students" ON students
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
  );

CREATE POLICY "Admins can update students" ON students
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
  );

CREATE POLICY "Admins can delete students" ON students
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'::user_role
  );
