-- =============================================================
-- FIX: Infinite recursion in profiles RLS + full admin role support
-- Root cause: inline subquery (SELECT role FROM profiles ...) inside
-- a profiles policy causes infinite recursion. Fix: use get_my_role()
-- which is SECURITY DEFINER and bypasses RLS on profiles.
-- =============================================================

-- ─── STUDENTS TABLE ──────────────────────────────────────────

DROP POLICY IF EXISTS "Admins and Staff can read all students" ON students;
DROP POLICY IF EXISTS "All admins and staff can read students" ON students;
DROP POLICY IF EXISTS "Admins can manage students" ON students;
DROP POLICY IF EXISTS "Admins can select students" ON students;
DROP POLICY IF EXISTS "Admins can insert students" ON students;
DROP POLICY IF EXISTS "Admins can update students" ON students;
DROP POLICY IF EXISTS "Admins can delete students" ON students;
DROP POLICY IF EXISTS "All admins can insert students" ON students;
DROP POLICY IF EXISTS "All admins can update students" ON students;
DROP POLICY IF EXISTS "All admins can delete students" ON students;
DROP POLICY IF EXISTS "Parents can read linked students" ON students;

CREATE POLICY "All admins and staff can read students" ON students
  FOR SELECT TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3', 'staff'));

CREATE POLICY "Parents can read linked students" ON students
  FOR SELECT TO authenticated
  USING (
    id IN (SELECT student_id FROM parent_student_link WHERE parent_id = auth.uid())
  );

CREATE POLICY "All admins can insert students" ON students
  FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can update students" ON students
  FOR UPDATE TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'))
  WITH CHECK (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can delete students" ON students
  FOR DELETE TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

-- ─── PARENT_STUDENT_LINK TABLE ───────────────────────────────

DROP POLICY IF EXISTS "Admins can read all links" ON parent_student_link;
DROP POLICY IF EXISTS "All admins can read all links" ON parent_student_link;
DROP POLICY IF EXISTS "Admins can manage links" ON parent_student_link;
DROP POLICY IF EXISTS "All admins can manage links" ON parent_student_link;

CREATE POLICY "All admins can read all links" ON parent_student_link
  FOR SELECT TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can manage links" ON parent_student_link
  FOR ALL TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'))
  WITH CHECK (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

-- ─── RESULTS TABLE ───────────────────────────────────────────

DROP POLICY IF EXISTS "Admins can view all results" ON results;
DROP POLICY IF EXISTS "All admins can view all results" ON results;
DROP POLICY IF EXISTS "Admins can insert results directly" ON results;
DROP POLICY IF EXISTS "All admins can insert results" ON results;
DROP POLICY IF EXISTS "Admins can update all results" ON results;
DROP POLICY IF EXISTS "All admins can update all results" ON results;
DROP POLICY IF EXISTS "Admins can delete all results" ON results;
DROP POLICY IF EXISTS "All admins can delete all results" ON results;

CREATE POLICY "All admins can view all results" ON results
  FOR SELECT TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can insert results" ON results
  FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can update all results" ON results
  FOR UPDATE TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can delete all results" ON results
  FOR DELETE TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

-- ─── VIDEOS TABLE ────────────────────────────────────────────

DROP POLICY IF EXISTS "Admins can view all videos" ON videos;
DROP POLICY IF EXISTS "All admins can view all videos" ON videos;
DROP POLICY IF EXISTS "Admins can insert videos directly" ON videos;
DROP POLICY IF EXISTS "All admins can insert videos" ON videos;
DROP POLICY IF EXISTS "Admins can update all videos" ON videos;
DROP POLICY IF EXISTS "All admins can update all videos" ON videos;
DROP POLICY IF EXISTS "Admins can delete all videos" ON videos;
DROP POLICY IF EXISTS "All admins can delete all videos" ON videos;

CREATE POLICY "All admins can view all videos" ON videos
  FOR SELECT TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can insert videos" ON videos
  FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can update all videos" ON videos
  FOR UPDATE TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can delete all videos" ON videos
  FOR DELETE TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

-- ─── PROFILES TABLE ──────────────────────────────────────────
-- IMPORTANT: Use get_my_role() here (SECURITY DEFINER) to avoid
-- infinite recursion. Never use inline (SELECT role FROM profiles ...)
-- inside a profiles policy.

DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "All admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "All admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "All admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "All admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;

CREATE POLICY "All admins can read all profiles" ON profiles
  FOR SELECT TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can insert profiles" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can update profiles" ON profiles
  FOR UPDATE TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));

CREATE POLICY "All admins can delete profiles" ON profiles
  FOR DELETE TO authenticated
  USING (get_my_role() IN ('admin', 'super_admin', 'admin_2', 'admin_3'));
