-- Create the song_submissions table for review system
CREATE TABLE IF NOT EXISTS song_submissions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    album VARCHAR(200),
    genre VARCHAR(50),
    year INTEGER CHECK (
        year >= 1900
        AND year <= EXTRACT(
            YEAR
            FROM CURRENT_DATE
        ) + 1
    ),
    cover TEXT,
    lyrics TEXT NOT NULL,
    submitter_name VARCHAR(100),
    submitter_email VARCHAR(255),
    submission_type VARCHAR(20) NOT NULL CHECK (
        submission_type IN ('new', 'correction')
    ),
    original_song_id BIGINT REFERENCES songs (id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'approved',
            'rejected'
        )
    ),
    admin_notes TEXT,
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (
        role IN ('admin', 'moderator')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_status ON song_submissions (status);

CREATE INDEX IF NOT EXISTS idx_submissions_type ON song_submissions (submission_type);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON song_submissions (created_at);

CREATE INDEX IF NOT EXISTS idx_submissions_artist ON song_submissions USING GIN (
    to_tsvector('english', artist)
);

CREATE INDEX IF NOT EXISTS idx_submissions_title ON song_submissions USING GIN (to_tsvector('english', title));

-- Create trigger for updated_at on song_submissions
CREATE TRIGGER update_song_submissions_updated_at 
    BEFORE UPDATE ON song_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for updated_at on admin_users
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE song_submissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for song_submissions (public can insert, admins can manage)
CREATE POLICY "Allow public insert access" ON song_submissions FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Allow public read access" ON song_submissions FOR
SELECT USING (true);

-- Create policies for admin_users (restricted access)
CREATE POLICY "Allow admin read access" ON admin_users FOR
SELECT USING (true);

-- Insert default admin user
INSERT INTO
    admin_users (email, name, role)
VALUES (
        'admin@barelyrics.com',
        'Admin User',
        'admin'
    )
ON CONFLICT (email) DO NOTHING;