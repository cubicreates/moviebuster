import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieBackground from '../components/MovieBackground';

const Login = () => {
    const navigate = useNavigate(); // Add this
    const [activeView, setActiveView] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('ad@email.com'); // Set default email
    const [password, setPassword] = useState('123'); // Set default password
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (activeView === 'login') {
            try {
                console.log('Attempting login with:', { email, password }); // Debug log

                const response = await fetch('http://localhost:5100/api/auth/login', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                console.log('Login response:', data); // Debug log

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('isAuthenticated', 'true');
                    navigate('/profile');
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please check your credentials and try again.');
            }
        } else if (activeView === 'register') {
            try {
                const response = await fetch('http://localhost:5100/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        username: name,
                        email, 
                        password 
                    })
                });
                
                const data = await response.json();
                if (response.ok) {
                    setActiveView('login');
                    alert('Registration successful! Please login.');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative min-h-screen">
            <MovieBackground />
            
            <div className="relative z-10">
                <Navbar />

                <main className="container mx-auto pt-24 pb-12 px-4 flex-col flex items-center justify-center">
                    <div className="w-full max-w-md bg-black/50 backdrop-blur-sm rounded-lg p-8 
                        border border-white/20 
                        shadow-[0_0_15px_rgba(255,255,255,0.07)]
                        transition-all duration-300 hover:bg-black/60">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            {activeView === 'login' && 'Sign In'}
                            {activeView === 'register' && 'Create Account'}
                            {activeView === 'forgot' && 'Reset Password'}
                        </h2>

                        {/* Login Form */}
                        {activeView === 'login' && (
                            <>
                                <form onSubmit={handleSubmit} >
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-2 rounded-md border border-input bg-background"
                                            required
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full p-2 rounded-md border border-input bg-background pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-moviebuster-red text-white font-medium py-2 rounded-md hover:bg-white/90 hover:text-moviebuster-red transition mb-4"
                                    >
                                        Sign In
                                    </button>
                                </form>
                                <div className="text-center space-y-2">
                                    <button
                                        onClick={() => setActiveView('forgot')}
                                        className="text-sm text-moviebuster-red hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                    <p className="text-sm text-muted-foreground">
                                        Don't have an account?{' '}
                                        <button
                                            onClick={() => setActiveView('register')}
                                            className="text-moviebuster-red hover:underline"
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Register Form */}
                        {activeView === 'register' && (
                            <>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium mb-1">UserName</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full p-2 rounded-md border border-input bg-background"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="register-email" className="block text-sm font-medium mb-1">Email</label>
                                        <input
                                            id="register-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-2 rounded-md border border-input bg-background"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="register-password" className="block text-sm font-medium mb-1">Password</label>
                                        <div className="relative">
                                            <input
                                                id="register-password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full p-2 rounded-md border border-input bg-background pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                id="confirm-password"
                                                type={showPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full p-2 rounded-md border border-input bg-background pr-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-moviebuster-red text-white font-medium py-2 rounded-md hover:bg-white/90 hover:text-moviebuster-red transition mb-4"
                                    >
                                        Create Account
                                    </button>
                                </form>
                                <p className="text-sm text-center text-muted-foreground">
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => setActiveView('login')}
                                        className="text-moviebuster-red hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </>
                        )}

                        {/* Forgot Password Form */}
                        {activeView === 'forgot' && !resetSent && (
                            <>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <p className="text-sm text-muted-foreground mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                                        <label htmlFor="reset-email" className="block text-sm font-medium mb-1">Email</label>
                                        <input
                                            id="reset-email"
                                            type="email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="w-full p-2 rounded-md border border-input bg-background"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-moviebuster-red text-white font-medium py-2 rounded-md hover:bg-white/90 hover:text-moviebuster-red transition mb-4"
                                    >
                                        Send Reset Link
                                    </button>
                                </form>
                                <p className="text-sm text-center text-muted-foreground">
                                    Remember your password?{' '}
                                    <button
                                        onClick={() => setActiveView('login')}
                                        className="text-moviebuster-red hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </p>
                                <p className="text-sm text-center text-muted-foreground mt-2">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => setActiveView('register')}
                                        className="text-moviebuster-red hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </>
                        )}

                        {/* Reset Sent Confirmation */}
                        {activeView === 'forgot' && resetSent && (
                            <div className="text-center py-4">
                                <p className="mb-4">Reset link sent to your email!</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Check your inbox and follow the instructions to reset your password.
                                </p>
                                <button
                                    onClick={() => {
                                        setActiveView('login');
                                        setResetSent(false);
                                    }}
                                    className="text-moviebuster-red hover:underline"
                                >
                                    Return to Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Login;