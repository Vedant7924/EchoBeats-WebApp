const songs = [
    // Rap (10 Songs)
    {
        title: 'Through the Wire',
        artist: 'Kanye West',
        album: 'College Dropout',
        duration: 221,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80' // Rapper with mic
    },
    {
        title: 'N.Y. State of Mind',
        artist: 'Nas',
        album: 'Illmatic',
        duration: 294,
        mood: 'focus',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80' // Graffiti/Urban
    },
    {
        title: 'Alright',
        artist: 'Kendrick Lamar',
        album: 'TPAB',
        duration: 219,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1621625979509-f62663989c9e?w=800&q=80' // Street vibe
    },
    {
        title: 'Juicy',
        artist: 'The Notorious B.I.G.',
        album: 'Ready to Die',
        duration: 302,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1583795316447-b20392095f36?w=800&q=80' // Old school mood
    },
    {
        title: 'Lose Yourself',
        artist: 'Eminem',
        album: '8 Mile',
        duration: 326,
        mood: 'workout',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1546708773-e57fa527ac0f?w=800&q=80' // Hooded figure/intense
    },
    {
        title: 'Ms. Jackson',
        artist: 'Outkast',
        album: 'Stankonia',
        duration: 270,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1596700688623-1d4411604312?w=800&q=80' // Cool aesthetic
    },
    {
        title: 'Stronger',
        artist: 'Kanye West',
        album: 'Graduation',
        duration: 312,
        mood: 'workout',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' // Gym/Workout
    },
    {
        title: 'SICKO MODE',
        artist: 'Travis Scott',
        album: 'Astroworld',
        duration: 312,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80' // Concert/Psychadelic
    },
    {
        title: 'HUMBLE.',
        artist: 'Kendrick Lamar',
        album: 'DAMN.',
        duration: 177,
        mood: 'workout',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1621360841013-c768371e93cf?w=800&q=80' // Intense
    },
    {
        title: 'Gods Plan',
        artist: 'Drake',
        album: 'Scorpion',
        duration: 198,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&q=80' // Rich vibes
    },

    // Romantic (10 Songs)
    {
        title: 'All of Me',
        artist: 'John Legend',
        album: 'Love in the Future',
        duration: 269,
        mood: 'romantic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80' // Couple holding hands
    },
    {
        title: 'Perfect',
        artist: 'Ed Sheeran',
        album: 'Divide',
        duration: 263,
        mood: 'romantic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80' // Heart/Love
    },
    {
        title: 'Just the Way You Are',
        artist: 'Bruno Mars',
        album: 'Doo-Wops',
        duration: 220,
        mood: 'romantic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80' // Sunset couple
    },
    {
        title: 'Thinking Out Loud',
        artist: 'Ed Sheeran',
        album: 'Multiply',
        duration: 281,
        mood: 'romantic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&q=80' // Soft light
    },
    {
        title: 'At Last',
        artist: 'Etta James',
        album: 'At Last!',
        duration: 180,
        mood: 'romantic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1507676184212-d0370baf27db?w=800&q=80' // Vintage mic
    },
    {
        title: 'Make You Feel My Love',
        artist: 'Adele',
        album: '19',
        duration: 212,
        mood: 'romantic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80' // Piano
    },
    {
        title: 'Your Song',
        artist: 'Elton John',
        album: 'Elton John',
        duration: 240,
        mood: 'romantic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1459749411177-d4a428947856?w=800&q=80' // Sheet music
    },
    {
        title: 'Can’t Help Falling in Love',
        artist: 'Elvis Presley',
        album: 'Blue Hawaii',
        duration: 180,
        mood: 'romantic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1522855593889-11ba188448eb?w=800&q=80' // Romantic vibes
    },
    {
        title: 'Lover',
        artist: 'Taylor Swift',
        album: 'Lover',
        duration: 221,
        mood: 'romantic',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=80' // Pastel sky
    },
    {
        title: 'I Will Always Love You',
        artist: 'Whitney Houston',
        album: 'Bodyguard',
        duration: 271,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80' // Emotional
    },

    // Party (10 Songs)
    {
        title: 'Uptown Funk',
        artist: 'Mark Ronson ft. Bruno Mars',
        album: 'Uptown Special',
        duration: 270,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80' // Club dj
    },
    {
        title: 'Happy',
        artist: 'Pharrell Williams',
        album: 'G I R L',
        duration: 233,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&q=80' // Bright colors
    },
    {
        title: 'Can’t Stop the Feeling!',
        artist: 'Justin Timberlake',
        album: 'Trolls',
        duration: 236,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' // Dancing crowd
    },
    {
        title: 'I Gotta Feeling',
        artist: 'The Black Eyed Peas',
        album: 'The E.N.D.',
        duration: 289,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80' // Party lights
    },
    {
        title: 'Shake It Off',
        artist: 'Taylor Swift',
        album: '1989',
        duration: 219,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80' // Festival
    },
    {
        title: 'Dynamite',
        artist: 'BTS',
        album: 'BE',
        duration: 199,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800&q=80' // Fireworks
    },
    {
        title: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        duration: 203,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80' // Disco ball
    },
    {
        title: 'Party Rock Anthem',
        artist: 'LMFAO',
        album: 'Sorry for Party Rocking',
        duration: 262,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80' // Party people
    },
    {
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: 200,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1550985543-f4bd9c13b944?w=800&q=80' // Neon city
    },
    {
        title: 'Hey Ya!',
        artist: 'Outkast',
        album: 'Speakerboxxx',
        duration: 235,
        mood: 'party',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80' // Concert stage
    },

    // Sad (10 Songs)
    {
        title: 'Someone Like You',
        artist: 'Adele',
        album: '21',
        duration: 285,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1516575543555-0f8c3609471d?w=800&q=80' // Rainy window
    },
    {
        title: 'Fix You',
        artist: 'Coldplay',
        album: 'X&Y',
        duration: 295,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1483086431908-1f10e6bc8331?w=800&q=80' // Lonely road
    },
    {
        title: 'Yesterday',
        artist: 'The Beatles',
        album: 'Help!',
        duration: 125,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1534068590799-09895a701d3e?w=800&q=80' // Black and white portrait
    },
    {
        title: 'Hurt',
        artist: 'Johnny Cash',
        album: 'American IV',
        duration: 218,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=80' // Withered flower
    },
    {
        title: 'All I Want',
        artist: 'Kodaline',
        album: 'In A Perfect World',
        duration: 305,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1519688497677-9a00b080824b?w=800&q=80' // Sad person
    },
    {
        title: 'Skinny Love',
        artist: 'Bon Iver',
        album: 'For Emma',
        duration: 239,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80' // Winter forest
    },
    {
        title: 'Say Something',
        artist: 'A Great Big World',
        album: 'Is There Anybody Out There?',
        duration: 229,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1505533542167-8c89838bb19e?w=800&q=80' // Empty chair
    },
    {
        title: 'The Scientist',
        artist: 'Coldplay',
        album: 'Rush of Blood',
        duration: 309,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1504937564700-1c3132e01df2?w=800&q=80' // Scientist/Lab (abstract)
    },
    {
        title: 'Let Her Go',
        artist: 'Passenger',
        album: 'All the Little Lights',
        duration: 252,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1515536765-9b2a74047f8f?w=800&q=80' // Silhouette
    },
    {
        title: 'Drivers License',
        artist: 'Olivia Rodrigo',
        album: 'SOUR',
        duration: 242,
        mood: 'sad',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1449824913929-2b6a3e6a18fa?w=800&q=80' // Driving at night
    },

    // Chill (10 Songs)
    {
        title: 'Weightless',
        artist: 'Marconi Union',
        album: 'Weightless',
        duration: 480,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' // Beach
    },
    {
        title: 'Sunset Lover',
        artist: 'Petit Biscuit',
        album: 'Presence',
        duration: 237,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80' // Sunset
    },
    {
        title: 'Banana Pancakes',
        artist: 'Jack Johnson',
        album: 'In Between Dreams',
        duration: 192,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=800&q=80' // Breakfast
    },
    {
        title: 'Put Your Records On',
        artist: 'Corinne Bailey Rae',
        album: 'Corinne Bailey Rae',
        duration: 215,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af671694?w=800&q=80' // Meadow
    },
    {
        title: 'Three Little Birds',
        artist: 'Bob Marley',
        album: 'Exodus',
        duration: 180,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1605367098495-263a45c38260?w=800&q=80' // Birds
    },
    {
        title: 'Location',
        artist: 'Khalid',
        album: 'American Teen',
        duration: 219,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?w=800&q=80' // Desert road
    },
    {
        title: 'Slow Dancing in a Burning Room',
        artist: 'John Mayer',
        album: 'Continuum',
        duration: 242,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80' // Slow dance
    },
    {
        title: 'Sunday Morning',
        artist: 'Maroon 5',
        album: 'Songs About Jane',
        duration: 244,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1549488352-7d0637174db9?w=800&q=80' // Coffee rain
    },
    {
        title: 'Landslide',
        artist: 'Fleetwood Mac',
        album: 'Fleetwood Mac',
        duration: 199,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800&q=80' // Mountains
    },
    {
        title: 'Here Comes The Sun',
        artist: 'The Beatles',
        album: 'Abbey Road',
        duration: 185,
        mood: 'chill',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverImage: 'https://images.unsplash.com/photo-1500058429222-6c9909564d0d?w=800&q=80' // Sun rays
    }
];

module.exports = songs;
