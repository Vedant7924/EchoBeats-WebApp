import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(username, email, password);
        if (result.success) {
            toast.success('Wait for login!');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="bg-neutral-900 p-8 rounded-lg w-96 text-white text-center">
                <h2 className="text-3xl font-bold mb-6 text-primary">Sign up</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-3 rounded bg-dark-gray text-white outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 rounded bg-dark-gray text-white outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 rounded bg-dark-gray text-white outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" className="bg-primary text-black font-bold py-3 rounded-full hover:scale-105 transition-transform">
                        SIGN UP
                    </button>
                    <p className="mt-4 text-gray-400">
                        Already have an account? <span className="text-white cursor-pointer underline" onClick={() => navigate('/login')}>Log In</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
