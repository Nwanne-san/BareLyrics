-- Create the songs table
CREATE TABLE IF NOT EXISTS songs (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs USING GIN (to_tsvector('english', title));

CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs USING GIN (
    to_tsvector('english', artist)
);

CREATE INDEX IF NOT EXISTS idx_songs_album ON songs USING GIN (to_tsvector('english', album));

CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs (genre);

CREATE INDEX IF NOT EXISTS idx_songs_year ON songs (year);

CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs (created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_songs_updated_at 
    BEFORE UPDATE ON songs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only for anonymous users)
CREATE POLICY "Allow public read access" ON songs FOR
SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow public insert access" ON songs FOR INSERT
WITH
    CHECK (true);

-- Insert some sample data
INSERT INTO
    songs (
        title,
        artist,
        album,
        genre,
        year,
        lyrics
    )
VALUES (
        'Bohemian Rhapsody',
        'Queen',
        'A Night at the Opera',
        'Rock',
        1975,
        'Is this the real life?
Is this just fantasy?
Caught in a landslide
No escape from reality
Open your eyes, look up to the skies and see
I''m just a poor boy, I need no sympathy
Because I''m easy come, easy go, little high, little low
Any way the wind blows doesn''t really matter to me, to me

Mama, just killed a man
Put a gun against his head, pulled my trigger, now he''s dead
Mama, life had just begun
But now I''ve gone and thrown it all away

Mama, ooh, didn''t mean to make you cry
If I''m not back again this time tomorrow
Carry on, carry on as if nothing really matters

Too late, my time has come
Sends shivers down my spine, body''s aching all the time
Goodbye, everybody, I''ve got to go
Gotta leave you all behind and face the truth

Mama, ooh (any way the wind blows)
I don''t wanna die
I sometimes wish I''d never been born at all

[Guitar Solo]

I see a little silhouetto of a man
Scaramouche, Scaramouche, will you do the Fandango?
Thunderbolt and lightning very, very frightening me
(Galileo) Galileo, (Galileo) Galileo, Galileo Figaro
Magnifico-o-o-o-o

I''m just a poor boy, nobody loves me
He''s just a poor boy from a poor family
Spare him his life from this monstrosity
Easy come, easy go, will you let me go?
Bismillah! No, we will not let you go
(Let him go!) Bismillah! We will not let you go
(Let him go!) Bismillah! We will not let you go
(Let me go!) Will not let you go
(Let me go!) Will not let you go
(Let me go!) Ah
No, no, no, no, no, no, no
Oh, mama mia, mama mia
Mama mia, let me go
Beelzebub has a devil put aside for me, for me, for me!

[Rock section]

So you think you can stone me and spit in my eye?
So you think you can love me and leave me to die?
Oh, baby, can''t do this to me, baby!
Just gotta get out, just gotta get right outta here!

[Outro]

Nothing really matters, anyone can see
Nothing really matters
Nothing really matters to me

Any way the wind blows...'
    ),
    (
        'We Will Rock You',
        'Queen',
        'News of the World',
        'Rock',
        1977,
        'Buddy, you''re a boy, make a big noise
Playing in the street, gonna be a big man someday
You got mud on your face, you big disgrace
Kicking your can all over the place, singin''

We will, we will rock you
We will, we will rock you

Buddy, you''re a young man, hard man
Shouting in the street, gonna take on the world someday
You got blood on your face, you big disgrace
Waving your banner all over the place

We will, we will rock you, sing it!
We will, we will rock you, yeah

Buddy, you''re an old man, poor man
Pleading with your eyes, gonna get you some peace someday
You got mud on your face, big disgrace
Somebody better put you back into your place, do it!

We will, we will rock you, yeah, yeah, come on
We will, we will rock you, alright, louder!
We will, we will rock you, one more time
We will, we will rock you
Yeah'
    ),
    (
        'Imagine',
        'John Lennon',
        'Imagine',
        'Pop',
        1971,
        'Imagine there''s no heaven
It''s easy if you try
No hell below us
Above us only sky
Imagine all the people living for today

Imagine there''s no countries
It isn''t hard to do
Nothing to kill or die for
And no religion too
Imagine all the people living life in peace

You may say I''m a dreamer
But I''m not the only one
I hope someday you''ll join us
And the world will be as one

Imagine no possessions
I wonder if you can
No need for greed or hunger
A brotherhood of man
Imagine all the people sharing all the world

You may say I''m a dreamer
But I''m not the only one
I hope someday you''ll join us
And the world will live as one'
    );