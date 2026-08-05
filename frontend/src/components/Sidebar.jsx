import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import {
    Home,
    Search,
    Library,
    Smile,
    Heart,
    History,
    Hourglass,
    User,
    LogOut,
    Sparkles,
    Keyboard
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [showShortcuts, setShowShortcuts] = useState(false);

    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Search', path: '/search', icon: Search },
        { label: 'Library', path: '/library', icon: Library },
        { label: 'Mood Station', path: '/mood', icon: Smile },
        { label: 'Liked Songs', path: '/liked', icon: Heart },
        { label: 'History', path: '/history', icon: History },
        { label: 'Time Capsule', path: '/timecapsule', icon: Hourglass },
        { label: 'Profile & DNA', path: '/profile', icon: User },
    ];

    return (
        <>
            <aside className="w-64 h-screen bg-surface/80 backdrop-blur-xl border-r border-white/10 p-5 flex flex-col justify-between fixed top-0 left-0 z-30 select-none">
                <div className="space-y-6">
                    {/* Brand Logo Header */}
                    <div className="flex items-center gap-3 px-2 py-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                                Echo<span className="text-primary">Beats</span>
                            </h1>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Feel Every Beat</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                                            isActive
                                                ? 'bg-primary/15 text-primary border border-primary/20 shadow-md shadow-primary/5'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`
                                    }
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}

                        {/* Shortcuts Trigger */}
                        <button
                            onClick={() => setShowShortcuts(true)}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
                        >
                            <Keyboard className="w-5 h-5 text-accent" />
                            <span>Hotkeys (<kbd className="text-[10px] font-mono text-primary font-bold">?</kbd>)</span>
                        </button>
                    </nav>
                </div>

                {/* Bottom Profile Footer */}
                {user && (
                    <div className="pt-3 border-t border-white/10">
                        <div className="glass-card rounded-2xl p-3 flex items-center justify-between gap-2 border border-white/5 hover:border-primary/30 transition-all">
                            <div className="truncate min-w-0 pr-1">
                                <p className="text-xs font-bold text-white truncate">{user.username}</p>
                                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* Keyboard Shortcuts Modal */}
            <KeyboardShortcutsModal
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
        </>
    );
};

export default Sidebar;
