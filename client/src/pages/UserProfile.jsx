import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserBanner from '../components/UserBanner';
import UserDashboard from '../components/UserDashboard';
import ProfileContent from '../components/ProfileContent';
import FavoritesContent from '../components/FavoritesContent';
import WatchlistContent from '../components/WatchlistContent';

const UserProfile = ({ activeTab: initialTab }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(initialTab || 'profile');
    const [username, setUsername] = useState('User');
    const [email, setEmail] = useState('user@example.com');

    useEffect(() => {
        try {
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            if (!isAuthenticated) {
                navigate('/not-logged-in');
                return;
            }

            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            setUsername(userData.name || 'User');
            setEmail(userData.email || 'user@example.com');
        } catch (error) {
            console.error('Error loading user data:', error);
            navigate('/not-logged-in');
        }
    }, [navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileContent username={username} setUsername={setUsername} email={email} setEmail={setEmail} />;
            case 'favorites':
                return <FavoritesContent />;
            case 'watchlist':
                return <WatchlistContent />;
            default:
                return <ProfileContent username={username} setUsername={setUsername} email={email} setEmail={setEmail} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1">
                <UserBanner username={username} />

                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-6">Hi, {username}! 👋</h1>

                    <UserDashboard activeTab={activeTab} setActiveTab={setActiveTab} />

                    <div className="mt-6 bg-card rounded-lg shadow-md p-6">
                        {renderContent()}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserProfile;