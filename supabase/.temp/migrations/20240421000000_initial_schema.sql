-- Enums
CREATE TYPE user_role AS ENUM ('parent', 'staff', 'admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  enrollment_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Parent Student Link
CREATE TABLE parent_student_link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE(parent_id, student_id)
);
ALTER TABLE parent_student_link ENABLE ROW LEVEL SECURITY;

-- Results
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_rejection CHECK (status != 'rejected' OR rejection_message IS NOT NULL),
  CONSTRAINT check_approval CHECK (status = 'pending' OR approved_by IS NOT NULL)
);
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_rejection CHECK (status != 'rejected' OR rejection_message IS NOT NULL),
  CONSTRAINT check_approval CHECK (status = 'pending' OR approved_by IS NOT NULL)
);
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Functions
-- Helper to get current user role. 
-- SECURITY DEFINER ensures it bypasses RLS and prevents infinite recursion when used within profiles' own RLS.
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- RLS POLICIES

-- Profiles Policies
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (get_my_role() = 'admin');

CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (get_my_role() = 'admin');

-- Parent Student Link Policies
CREATE POLICY "Parents can read own links" ON parent_student_link
  FOR SELECT USING (parent_id = auth.uid());

CREATE POLICY "Admins can read all links" ON parent_student_link
  FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "Admins can manage links" ON parent_student_link
  FOR ALL USING (get_my_role() = 'admin');

-- Students Policies
CREATE POLICY "Admins and Staff can read all students" ON students
  FOR SELECT USING (get_my_role() IN ('admin', 'staff'));

CREATE POLICY "Parents can read linked students" ON students
  FOR SELECT USING (
    id IN (SELECT student_id FROM parent_student_link WHERE parent_id = auth.uid())
  );

CREATE POLICY "Admins can manage students" ON students
  FOR ALL USING (get_my_role() = 'admin');

-- Results Policies
CREATE POLICY "Admins can view all results" ON results
  FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "Staff can view own results" ON results
  FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY "Parents can view approved linked results" ON results
  FOR SELECT USING (
    status = 'approved' AND
    student_id IN (SELECT student_id FROM parent_student_link WHERE parent_id = auth.uid())
  );

CREATE POLICY "Staff can insert pending results" ON results
  FOR INSERT WITH CHECK (
    get_my_role() = 'staff' AND
    uploaded_by = auth.uid() AND
    status = 'pending' AND
    approved_by IS NULL AND
    rejection_message IS NULL
  );

CREATE POLICY "Admins can insert results directly" ON results
  FOR INSERT WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Staff can update own pending/rejected results" ON results
  FOR UPDATE USING (
    uploaded_by = auth.uid() AND
    (status = 'pending' OR status = 'rejected')
  ) WITH CHECK (
    status = 'pending' -- Force them back to pending upon edit
  );

CREATE POLICY "Admins can update all results" ON results
  FOR UPDATE USING (get_my_role() = 'admin');

CREATE POLICY "Staff can delete own unapproved results" ON results
  FOR DELETE USING (
    uploaded_by = auth.uid() AND
    status != 'approved'
  );

CREATE POLICY "Admins can delete all results" ON results
  FOR DELETE USING (get_my_role() = 'admin');

-- Videos Policies (Identical logic to results)
CREATE POLICY "Admins can view all videos" ON videos
  FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "Staff can view own videos" ON videos
  FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY "Parents can view approved linked videos" ON videos
  FOR SELECT USING (
    status = 'approved' AND
    student_id IN (SELECT student_id FROM parent_student_link WHERE parent_id = auth.uid())
  );

CREATE POLICY "Staff can insert pending videos" ON videos
  FOR INSERT WITH CHECK (
    get_my_role() = 'staff' AND
    uploaded_by = auth.uid() AND
    status = 'pending' AND
    approved_by IS NULL AND
    rejection_message IS NULL
  );

CREATE POLICY "Admins can insert videos directly" ON videos
  FOR INSERT WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Staff can update own pending/rejected videos" ON videos
  FOR UPDATE USING (
    uploaded_by = auth.uid() AND
    (status = 'pending' OR status = 'rejected')
  ) WITH CHECK (
    status = 'pending' -- Force them back to pending upon edit
  );

CREATE POLICY "Admins can update all videos" ON videos
  FOR UPDATE USING (get_my_role() = 'admin');

CREATE POLICY "Staff can delete own unapproved videos" ON videos
  FOR DELETE USING (
    uploaded_by = auth.uid() AND
    status != 'approved'
  );

CREATE POLICY "Admins can delete all videos" ON videos
  FOR DELETE USING (get_my_role() = 'admin');


-- Trigger for profile creation on Auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_name, last_name, email)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'parent'::user_role),
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
