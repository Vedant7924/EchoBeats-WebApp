import { usePlayer } from '../context/PlayerContext';
import { useLiked } from '../hooks/useLiked';
import { Play, Pause, Heart, Plus } from 'lucide-react';

const SongCard = ({ song, songList = null, onAddToPlaylist }) => {
    const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
    const { isLiked, toggleLike } = useLiked();

    const isCurrent = currentSong && currentSong._id === song._id;
    const liked = isLiked(song._id);

    const handlePlayClick = (e) => {
        e.stopPropagation();
        if (isCurrent) {
            togglePlay();
        } else {
            playSong(song, songList);
        }
    };

    return (
        <div className="group glass-card rounded-2xl p-4 transition-all duration-300 relative flex flex-col justify-between">
            {/* Artwork Container */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-white/5 border border-white/5">
                <img
                    src={song.coverArt}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay Play Button */}
                <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
                    isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                    <button
                        onClick={handlePlayClick}
                        className="p-4 rounded-full bg-primary text-black hover:scale-110 transition-transform shadow-xl shadow-primary/30"
                    >
                        {isCurrent && isPlaying ? (
                            <Pause className="w-6 h-6 fill-current" />
                        ) : (
                            <Play className="w-6 h-6 fill-current translate-x-0.5" />
                        )}
                    </button>
                </div>

                {/* Mood Tag */}
                {song.mood && (
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-primary border border-primary/20 uppercase tracking-wider">
                        {song.mood}
                    </span>
                )}
            </div>

            {/* Song Meta Info */}
            <div className="flex items-start justify-between gap-2">
                <div className="truncate min-w-0">
                    <h3 className={`text-sm font-bold truncate ${isCurrent ? 'text-primary' : 'text-white'}`}>
                        {song.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{song.artist}</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                    {onAddToPlaylist && (
                        <button
                            onClick={() => onAddToPlaylist(song)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Add to Playlist"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => toggleLike(song)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            liked ? 'text-rose-500' : 'text-gray-400 hover:text-white'
                        }`}
                        title="Like Song"
                    >
                        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SongCard;
