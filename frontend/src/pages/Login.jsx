import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';

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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        try {
            setSubmitting(true);
            await login(email, password);
            toast.success('Logged in successfully! 🎵');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleAuth = () => {
        toast.info('Google Sign-In integration pending. Redirecting to standard registration...');
        navigate('/signup');
    };

    const handleQuickLogin = (demoEmail) => {
        setEmail(demoEmail);
        setPassword('password123');
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full space-y-8">
                {/* Brand Header */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-6 h-6 text-black" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Echo<span className="text-primary">Beats</span>
                    </h1>
                </div>

                {/* Login Form Card */}
                <div className="glass-panel border border-white/10 rounded-3xl p-8 w-full shadow-2xl space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-extrabold text-white">Welcome Back</h2>
                        <p className="text-xs text-primary/90 font-semibold tracking-wide mt-1">Log in to feel every beat, truly.</p>
                    </div>

                    {/* Google Auth Button */}
                    <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-3 shadow-md group"
                    >
                        <GoogleIcon />
                        <span>Continue with Google</span>
                    </button>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-white/10 w-full" />
                        <span className="bg-[#0f0f18] px-3 text-[10px] uppercase font-bold text-gray-500 tracking-widest absolute">
                            or email
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-white/10 text-white text-sm outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface border border-white/10 text-white text-sm outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 rounded-2xl bg-primary text-black font-extrabold text-sm hover:scale-102 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-4 h-4" /> {submitting ? 'Authenticating...' : 'LOG IN'}
                        </button>
                    </form>

                    {/* Quick Demo Credentials Bar */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block text-center">
                            Test Accounts (Password: password123)
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleQuickLogin('john@example.com')}
                                className="flex-1 py-2 rounded-xl glass-card text-xs font-semibold text-gray-300 hover:text-white border border-white/5"
                            >
                                User: john@example.com
                            </button>
                            <button
                                onClick={() => handleQuickLogin('admin@example.com')}
                                className="flex-1 py-2 rounded-xl glass-card text-xs font-semibold text-primary hover:text-primary/80 border border-primary/20"
                            >
                                Admin: admin@example.com
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-center text-gray-400 pt-2">
                        Don't have an account?{' '}
                        <span
                            onClick={() => navigate('/signup')}
                            className="text-primary font-bold cursor-pointer hover:underline"
                        >
                            Sign up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
