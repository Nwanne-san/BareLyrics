export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string | null;
  genre?: string | null;
  year?: number | null;
  cover?: string | null;
  lyrics: string;
  submitter_name?: string | null;
  submitter_email?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Mock database - fallback when Supabase is not available
export const mockSongs: Song[] = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    genre: "Rock",
    year: 1975,
    cover: "/placeholder.svg?height=300&width=300",
    lyrics: `Is this the real life?
Is this just fantasy?
Caught in a landslide
No escape from reality
Open your eyes, look up to the skies and see
I'm just a poor boy, I need no sympathy
Because I'm easy come, easy go, little high, little low
Any way the wind blows doesn't really matter to me, to me

Mama, just killed a man
Put a gun against his head, pulled my trigger, now he's dead
Mama, life had just begun
But now I've gone and thrown it all away

Mama, ooh, didn't mean to make you cry
If I'm not back again this time tomorrow
Carry on, carry on as if nothing really matters

Too late, my time has come
Sends shivers down my spine, body's aching all the time
Goodbye, everybody, I've got to go
Gotta leave you all behind and face the truth

Mama, ooh (any way the wind blows)
I don't wanna die
I sometimes wish I'd never been born at all

[Guitar Solo]

I see a little silhouetto of a man
Scaramouche, Scaramouche, will you do the Fandango?
Thunderbolt and lightning very, very frightening me
(Galileo) Galileo, (Galileo) Galileo, Galileo Figaro
Magnifico-o-o-o-o

I'm just a poor boy, nobody loves me
He's just a poor boy from a poor family
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
Oh, baby, can't do this to me, baby!
Just gotta get out, just gotta get right outta here!

[Outro]

Nothing really matters, anyone can see
Nothing really matters
Nothing really matters to me

Any way the wind blows...`,
  },
  {
    id: 2,
    title: "We Will Rock You",
    artist: "Queen",
    album: "News of the World",
    genre: "Rock",
    year: 1977,
    cover: "/placeholder.svg?height=300&width=300",
    lyrics: `Buddy, you're a boy, make a big noise
Playing in the street, gonna be a big man someday
You got mud on your face, you big disgrace
Kicking your can all over the place, singin'

We will, we will rock you
We will, we will rock you

Buddy, you're a young man, hard man
Shouting in the street, gonna take on the world someday
You got blood on your face, you big disgrace
Waving your banner all over the place

We will, we will rock you, sing it!
We will, we will rock you, yeah

Buddy, you're an old man, poor man
Pleading with your eyes, gonna get you some peace someday
You got mud on your face, big disgrace
Somebody better put you back into your place, do it!

We will, we will rock you, yeah, yeah, come on
We will, we will rock you, alright, louder!
We will, we will rock you, one more time
We will, we will rock you
Yeah`,
  },
  {
    id: 3,
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    genre: "Pop",
    year: 1971,
    cover: "/placeholder.svg?height=300&width=300",
    lyrics: `Imagine there's no heaven
It's easy if you try
No hell below us
Above us only sky
Imagine all the people living for today

Imagine there's no countries
It isn't hard to do
Nothing to kill or die for
And no religion too
Imagine all the people living life in peace

You may say I'm a dreamer
But I'm not the only one
I hope someday you'll join us
And the world will be as one

Imagine no possessions
I wonder if you can
No need for greed or hunger
A brotherhood of man
Imagine all the people sharing all the world

You may say I'm a dreamer
But I'm not the only one
I hope someday you'll join us
And the world will live as one`,
  },
  {
    id: 4,
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    genre: "Rock",
    year: 1976,
    cover: "/placeholder.svg?height=300&width=300",
    lyrics: `On a dark desert highway, cool wind in my hair
Warm smell of colitas, rising up through the air
Up ahead in the distance, I saw a shimmering light
My head grew heavy and my sight grew dim
I had to stop for the night

There she stood in the doorway
I heard the mission bell
And I was thinking to myself
"This could be Heaven or this could be Hell"
Then she lit up a candle and she showed me the way
There were voices down the corridor
I thought I heard them say

Welcome to the Hotel California
Such a lovely place (Such a lovely place)
Such a lovely face
Plenty of room at the Hotel California
Any time of year (Any time of year)
You can find it here

Her mind is Tiffany-twisted, she got the Mercedes bends
She got a lot of pretty, pretty boys she calls friends
How they dance in the courtyard, sweet summer sweat
Some dance to remember, some dance to forget

So I called up the Captain
"Please bring me my wine"
He said, "We haven't had that spirit here since 1969"
And still those voices are calling from far away
Wake you up in the middle of the night
Just to hear them say

Welcome to the Hotel California
Such a lovely place (Such a lovely place)
Such a lovely face
They livin' it up at the Hotel California
What a nice surprise (What a nice surprise)
Bring your alibis

Mirrors on the ceiling
The pink champagne on ice
And she said, "We are all just prisoners here, of our own device"
And in the master's chambers
They gathered for the feast
They stab it with their steely knives
But they just can't kill the beast

Last thing I remember, I was
Running for the door
I had to find the passage back
To the place I was before
"Relax," said the night man
"We are programmed to receive
You can check out any time you like
But you can never leave"`,
  },
  {
    id: 5,
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    genre: "Pop",
    year: 1982,
    cover: "/placeholder.svg?height=300&width=300",
    lyrics: `She was more like a beauty queen from a movie scene
I said don't mind, but what do you mean, I am the one
Who will dance on the floor in the round
She said I am the one, who will dance on the floor in the round

She told me her name was Billie Jean, as she caused a scene
Then every head turned with eyes that dreamed of being the one
Who will dance on the floor in the round

People always told me be careful what you do
And don't go around breaking young girls' hearts
And mother always told me be careful who you love
And be careful what you do 'cause the lie becomes the truth

Billie Jean is not my lover
She's just a girl who claims that I am the one
But the kid is not my son
She says I am the one, but the kid is not my son

For forty days and forty nights
The law was on her side
But who can stand when she's in demand
Her schemes and plans
'Cause we danced on the floor in the round
So take my strong advice, just remember to always think twice
(Don't think twice, don't think twice)

She told my baby we'd danced till three, then she looked at me
Then showed a photo my baby cried his eyes were like mine (oh, no!)
'Cause we danced on the floor in the round, baby

People always told me be careful what you do
And don't go around breaking young girls' hearts
She came and stood right by me
Just the smell of sweet perfume
This happened much too soon
She called me to her room

Billie Jean is not my lover
She's just a girl who claims that I am the one
But the kid is not my son
She says I am the one, but the kid is not my son

Billie Jean is not my lover
She's just a girl who claims that I am the one
But the kid is not my son
She says I am the one, but the kid is not my son
She says I am the one, but the kid is not my son`,
  },
];