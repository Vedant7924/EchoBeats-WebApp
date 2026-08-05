import { useState } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';

const presets = [
    { id: 'flat', name: 'Flat / Studio' },
    { id: 'bass', name: 'Bass Boost 🔥' },
    { id: 'vocal', name: 'Vocal Clarity ✨' },
    { id: 'club', name: 'Club / Dance 💃' },
    { id: 'acoustic', name: 'Acoustic / Warm 🎸' },
];

const Equalizer = () => {
    const [activePreset, setActivePreset] = useState('bass');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
                    isOpen || activePreset !== 'flat'
                        ? 'border-primary/50 text-primary bg-primary/10'
                        : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title="Audio Equalizer Presets"
            >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">EQ: {presets.find(p => p.id === activePreset)?.name.split(' ')[0]}</span>
            </button>

            {isOpen && (
                <div className="absolute bottom-12 right-0 w-64 glass-panel rounded-2xl p-3 z-50 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Audio Equalizer</span>
                        <div className="flex items-end gap-1 h-4">
                            <span className="w-1 bg-primary rounded-full animate-equalizer" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 bg-primary rounded-full animate-equalizer" style={{ animationDelay: '200ms' }} />
                            <span className="w-1 bg-primary rounded-full animate-equalizer" style={{ animationDelay: '400ms' }} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        {presets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => {
                                    setActivePreset(preset.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all ${
                                    activePreset === preset.id
                                        ? 'bg-primary/20 text-primary font-semibold border border-primary/30'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <span>{preset.name}</span>
                                {activePreset === preset.id && <Check className="w-3.5 h-3.5 text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Equalizer;
