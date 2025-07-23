-- Disable RLS temporarily to fix issues, then re-enable with proper policies
ALTER TABLE songs DISABLE ROW LEVEL SECURITY;

ALTER TABLE song_submissions DISABLE ROW LEVEL SECURITY;

ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

ALTER TABLE song_submissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for songs table
CREATE POLICY "Public can read songs" ON songs FOR
SELECT USING (true);

CREATE POLICY "Authenticated users can insert songs" ON songs FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Authenticated users can update songs" ON songs
FOR UPDATE
    USING (true);

CREATE POLICY "Authenticated users can delete songs" ON songs FOR DELETE USING (true);

-- Create policies for song_submissions table
CREATE POLICY "Public can read submissions" ON song_submissions FOR
SELECT USING (true);

CREATE POLICY "Anyone can insert submissions" ON song_submissions FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Authenticated users can update submissions" ON song_submissions
FOR UPDATE
    USING (true);

CREATE POLICY "Authenticated users can delete submissions" ON song_submissions FOR DELETE USING (true);

-- Create policies for admin_users table
CREATE POLICY "Authenticated users can read admin_users" ON admin_users FOR
SELECT USING (true);

CREATE POLICY "Authenticated users can insert admin_users" ON admin_users FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Authenticated users can update admin_users" ON admin_users
FOR UPDATE
    USING (true);