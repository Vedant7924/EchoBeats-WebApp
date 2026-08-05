const songs = [
    // --- CHILL (10 songs) ---
    {
        title: "Midnight City Lights",
        artist: "Neon Echoes",
        album: "Nocturnal Vibe",
        duration: 210,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
        mood: "Chill"
    },
    {
        title: "Lo-Fi Raindrops",
        artist: "Coffee & Code",
        album: "Study Session Vol. 1",
        duration: 180,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        coverArt: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
        mood: "Chill"
    },
    {
        title: "Cosmic Drift",
        artist: "Starlight Collective",
        album: "Orbital",
        duration: 240,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        coverArt: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80",
        mood: "Chill"
    },
    {
        title: "Subtle Waves",
        artist: "Oceanic Soundscapes",
        album: "Tidal",
        duration: 195,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        coverArt: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
        mood: "Chill"
    },
    {
        title: "Golden Hour Glow",
        artist: "Solar Wind",
        album: "Sunset Horizons",
        duration: 205,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        coverArt: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=500&q=80",
        mood: "Chill"
    },
    {
        title: "Velvet Lounge",
        artist: "Silk Ensemble",
        album: "Smooth Nights",
        duration: 225,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        coverArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
        mood: "Chill"
    },
    {
        title: "Floating Cloud",
        artist: "Aura",
        album: "Breathe",
        duration: 175,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        coverArt: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=500&q=80",
        mood: "Chill"
    },
    {
        title: "Soft Shadows",
        artist: "Dusk Beats",
        album: "Twilight Serenade",
        duration: 215,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        coverArt: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80",
        mood: "Chill"
    },
    {
        title: "Luminous",
        artist: "Ethereal Echo",
        album: "Prism",
        duration: 230,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        coverArt: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80",
        mood: "Chill"
    },
    {
        title: "Slow Motion",
        artist: "Tempo Low",
        album: "Unwind",
        duration: 200,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        coverArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&q=80",
        mood: "Chill"
    },

    // --- PARTY (9 songs) ---
    {
        title: "Electric Pulse",
        artist: "Cyber Groove",
        album: "Neon Revolution",
        duration: 210,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        coverArt: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80",
        mood: "Party"
    },
    {
        title: "Bass Drop Dynamite",
        artist: "DJ Volt",
        album: "Peak Hour",
        duration: 190,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        coverArt: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80",
        mood: "Party"
    },
    {
        title: "Strobe Light Madness",
        artist: "Hyperdrive",
        album: "Clubland",
        duration: 220,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
        mood: "Party"
    },
    {
        title: "Dance Floor Craze",
        artist: "Tempo Syndicate",
        album: "Rhythm Nation",
        duration: 205,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        coverArt: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&q=80",
        mood: "Party"
    },
    {
        title: "Midnight Carnival",
        artist: "Fiesta Kings",
        album: "Rio Electro",
        duration: 215,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
        mood: "Party"
    },
    {
        title: "Vivid Dreams",
        artist: "Synthwave 84",
        album: "Outrun",
        duration: 195,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
        coverArt: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80",
        mood: "Party"
    },
    {
        title: "Laser Beam",
        artist: "Photon",
        album: "Speed of Light",
        duration: 225,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        coverArt: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80",
        mood: "Party"
    },
    {
        title: "Non-Stop Rave",
        artist: "Underground Beat",
        album: "Warehouse Project",
        duration: 240,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        coverArt: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80",
        mood: "Party"
    },
    {
        title: "High Octane",
        artist: "Nitrous",
        album: "Burnout",
        duration: 185,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
        mood: "Party"
    },

    // --- WORKOUT (9 songs) ---
    {
        title: "Iron Core",
        artist: "Heavy Hitters",
        album: "Maximum Effort",
        duration: 190,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        coverArt: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80",
        mood: "Workout"
    },
    {
        title: "Adrenaline Rush",
        artist: "Apex Predator",
        album: "Beast Mode",
        duration: 200,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        coverArt: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
        mood: "Workout"
    },
    {
        title: "Sprint Finish",
        artist: "Cardio Crew",
        album: "180 BPM",
        duration: 180,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        coverArt: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
        mood: "Workout"
    },
    {
        title: "Power Surge",
        artist: "Dynamo",
        album: "Voltage",
        duration: 210,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        coverArt: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80",
        mood: "Workout"
    },
    {
        title: "Unstoppable Force",
        artist: "Titan Beats",
        album: "Olympus",
        duration: 220,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        coverArt: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
        mood: "Workout"
    },
    {
        title: "Sweat & Rhythm",
        artist: "Pulse Athletic",
        album: "HIIT Session",
        duration: 195,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        coverArt: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
        mood: "Workout"
    },
    {
        title: "Heavy Lifting",
        artist: "Barbell Junkies",
        album: "Iron Paradise",
        duration: 205,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        coverArt: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80",
        mood: "Workout"
    },
    {
        title: "Full Throttle",
        artist: "Velocity",
        album: "Redline",
        duration: 175,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        coverArt: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
        mood: "Workout"
    },
    {
        title: "Champion Mindset",
        artist: "Victor",
        album: "Gold Medal",
        duration: 230,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        coverArt: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
        mood: "Workout"
    },

    // --- FOCUS (9 songs) ---
    {
        title: "Deep Concentration",
        artist: "Mindwave",
        album: "Alpha Waves",
        duration: 300,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        coverArt: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&q=80",
        mood: "Focus"
    },
    {
        title: "Flow State",
        artist: "NeuroBeats",
        album: "Productivity Boost",
        duration: 280,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        coverArt: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&q=80",
        mood: "Focus"
    },
    {
        title: "Binary Logic",
        artist: "Algorithmic",
        album: "Syntax",
        duration: 260,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        coverArt: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80",
        mood: "Focus"
    },
    {
        title: "Silent Horizon",
        artist: "Quietude",
        album: "Zenith",
        duration: 270,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
        coverArt: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&q=80",
        mood: "Focus"
    },
    {
        title: "Minimalist Thought",
        artist: "Clean Slate",
        album: "Simplicity",
        duration: 250,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        coverArt: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&q=80",
        mood: "Focus"
    },
    {
        title: "Binaural Meditation",
        artist: "Theta State",
        album: "Mind Alignment",
        duration: 310,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        coverArt: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80",
        mood: "Focus"
    },
    {
        title: "Architectural Symmetry",
        artist: "Structure",
        album: "Design Principles",
        duration: 240,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        coverArt: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&q=80",
        mood: "Focus"
    },
    {
        title: "Subtle Frequency",
        artist: "Harmonic Lab",
        album: "Resonance",
        duration: 290,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        coverArt: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&q=80",
        mood: "Focus"
    },
    {
        title: "Midnight Coding",
        artist: "Terminal 0x",
        album: "Kernel Loop",
        duration: 275,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        coverArt: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80",
        mood: "Focus"
    },

    // --- ROMANTIC (9 songs) ---
    {
        title: "Moonlit Stroll",
        artist: "Serenade Strings",
        album: "Amour",
        duration: 210,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        coverArt: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80",
        mood: "Romantic"
    },
    {
        title: "Heartbeat Harmony",
        artist: "Acoustic Duo",
        album: "Two of Us",
        duration: 195,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        coverArt: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80",
        mood: "Romantic"
    },
    {
        title: "Whispers in the Dark",
        artist: "Velvet Voice",
        album: "Intimate Notes",
        duration: 225,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        coverArt: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80",
        mood: "Romantic"
    },
    {
        title: "Eternal Promise",
        artist: "Symphony of Love",
        album: "Forever",
        duration: 240,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        coverArt: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80",
        mood: "Romantic"
    },
    {
        title: "Candlelight Waltz",
        artist: "Parisian Jazz Trio",
        album: "Café de Paris",
        duration: 200,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        coverArt: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80",
        mood: "Romantic"
    },
    {
        title: "Sweet Devotion",
        artist: "Soulful Breeze",
        album: "Warmth",
        duration: 215,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        coverArt: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80",
        mood: "Romantic"
    },
    {
        title: "Rose Petals",
        artist: "Piano Dreams",
        album: "Solitude",
        duration: 190,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        coverArt: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80",
        mood: "Romantic"
    },
    {
        title: "Starry Night Confession",
        artist: "Celesta",
        album: "Starlight",
        duration: 230,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        coverArt: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80",
        mood: "Romantic"
    },
    {
        title: "Soft Touch",
        artist: "Gentle Touch",
        album: "Embrace",
        duration: 205,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        coverArt: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80",
        mood: "Romantic"
    },

    // --- HAPPY (8 songs) ---
    {
        title: "Sunshine Avenue",
        artist: "Good Vibe Tribe",
        album: "Bright Side",
        duration: 190,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        coverArt: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=500&q=80",
        mood: "Happy"
    },
    {
        title: "Joyful Journey",
        artist: "Sunny Days",
        album: "Clear Skies",
        duration: 185,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
        coverArt: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
        mood: "Happy"
    },
    {
        title: "Carefree Smile",
        artist: "Whistle & Pop",
        album: "Upbeat",
        duration: 175,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        coverArt: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=500&q=80",
        mood: "Happy"
    },
    {
        title: "Golden Morning",
        artist: "Radiant",
        album: "Daybreak",
        duration: 200,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        coverArt: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
        mood: "Happy"
    },
    {
        title: "Dancing in the Rain",
        artist: "Puddle Jumpers",
        album: "Splash",
        duration: 195,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        coverArt: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=500&q=80",
        mood: "Happy"
    },
    {
        title: "High Five",
        artist: "Celebration Crew",
        album: "Party Pop",
        duration: 180,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        coverArt: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
        mood: "Happy"
    },
    {
        title: "Feel Good Groove",
        artist: "Funk Supreme",
        album: "Disco Soul",
        duration: 210,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        coverArt: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=500&q=80",
        mood: "Happy"
    },
    {
        title: "Optimist",
        artist: "Bright Future",
        album: "Hope",
        duration: 205,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        coverArt: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
        mood: "Happy"
    },

    // --- SAD (8 songs) ---
    {
        title: "Tears in the Rain",
        artist: "Echoes of Silence",
        album: "Heartbreak Notes",
        duration: 240,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        coverArt: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
        mood: "Sad"
    },
    {
        title: "Fading Memories",
        artist: "Nostalgia",
        album: "Left Behind",
        duration: 230,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        coverArt: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80",
        mood: "Sad"
    },
    {
        title: "Empty Room",
        artist: "Solitary Piano",
        album: "Silence Speaks",
        duration: 220,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        coverArt: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
        mood: "Sad"
    },
    {
        title: "Gray Clouds",
        artist: "Overcast",
        album: "Storm Approaching",
        duration: 250,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        coverArt: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80",
        mood: "Sad"
    },
    {
        title: "Broken Strings",
        artist: "Melancholia",
        album: "Despair",
        duration: 215,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        coverArt: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
        mood: "Sad"
    },
    {
        title: "Distant Echo",
        artist: "Lost Signal",
        album: "Drifting Away",
        duration: 235,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        coverArt: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80",
        mood: "Sad"
    },
    {
        title: "Winter Solitude",
        artist: "Frostbite",
        album: "Cold December",
        duration: 245,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        coverArt: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
        mood: "Sad"
    },
    {
        title: "Unanswered Calls",
        artist: "Dial Tone",
        album: "Waiting",
        duration: 210,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        coverArt: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80",
        mood: "Sad"
    }
];

module.exports = songs;
