import { useEffect } from 'react';
import { X, Command, Keyboard } from 'lucide-react';

const shortcuts = [
    { key: 'Spacebar', action: 'Toggle Play / Pause audio' },
    { key: 'Shift + Right Arrow', action: 'Skip to Next Track' },
    { key: 'Shift + Left Arrow', action: 'Skip to Previous Track' },
    { key: 'Click Artwork', action: 'Open Full-Screen EchoWave Visualizer' },
    { key: 'EQ Selector', action: 'Toggle Bass Boost & EQ Presets' },
    { key: 'Question Mark (?)', action: 'Open / Close Keyboard Shortcuts' },
];

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            if (e.key === '?') {
                e.preventDefault();
                if (isOpen) onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="glass-panel border border-white/10 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Keyboard className="w-4 h-4 text-primary" /> Keyboard Shortcuts
                    </h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-2">
                    {shortcuts.map((sc) => (
                        <div key={sc.key} className="flex items-center justify-between p-2.5 rounded-2xl glass-card text-xs">
                            <span className="text-gray-300 font-medium">{sc.action}</span>
                            <kbd className="px-2.5 py-1 rounded-lg bg-surface border border-white/10 font-mono text-[11px] font-bold text-primary">
                                {sc.key}
                            </kbd>
                        </div>
                    ))}
                </div>

                <p className="text-[11px] text-gray-500 text-center">
                    Press <kbd className="text-primary font-bold">?</kbd> anytime to toggle shortcuts.
                </p>
            </div>
        </div>
    );
};

export default KeyboardShortcutsModal;
