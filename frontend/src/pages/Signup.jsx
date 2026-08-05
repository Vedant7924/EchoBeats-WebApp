import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Sparkles, User, Mail, Lock, UserPlus } from 'lucide-react';

const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
    </svg>
);

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setSubmitting(true);
            await signup(username, email, password);
            toast.success('Account created successfully! 🎵');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create account');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleAuth = () => {
        toast.info('Please fill in the form below to create your account.');
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full space-y-8">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center shadow-xl shadow-accent/20 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-6 h-6 text-black" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Echo<span className="text-primary">Beats</span>
                    </h1>
                </div>

                <div className="glass-panel border border-white/10 rounded-3xl p-8 w-full shadow-2xl space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-extrabold text-white">Create Your Account</h2>
                        <p className="text-xs text-accent/90 font-semibold tracking-wide mt-1">Join the vibe. Unlock your Mood DNA.</p>
                    </div>

                    {/* Google Auth Button */}
                    <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-3 shadow-md group"
                    >
                        <GoogleIcon />
                        <span>Sign up with Google</span>
                    </button>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-white/10 w-full" />
                        <span className="bg-[#0f0f18] px-3 text-[10px] uppercase font-bold text-gray-500 tracking-widest absolute">
                            or email
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-white/10 text-white text-sm outline-none focus:border-accent transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-white/10 text-white text-sm outline-none focus:border-accent transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-white/10 text-white text-sm outline-none focus:border-accent transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 rounded-2xl bg-accent text-black font-extrabold text-sm hover:scale-102 transition-all shadow-xl shadow-accent/25 flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" /> {submitting ? 'Creating Account...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    <p className="text-xs text-center text-gray-400 pt-2">
                        Already registered?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-accent font-bold cursor-pointer hover:underline"
                        >
                            Log in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
