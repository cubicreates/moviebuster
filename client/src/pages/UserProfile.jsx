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
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = localStorage.getItem('token');
                
                if (!user || !token) {
                    navigate('/not-logged-in');
                    return;
                }

                setUserData(user);
                setLoading(false);
            } catch (error) {
                console.error('Error loading user data:', error);
                navigate('/not-logged-in');
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileContent 
                    username={userData.username} 
                    email={userData.email}
                />;
            case 'favorites':
                return <FavoritesContent userId={userData.id} />;
            case 'watchlist':
                return <WatchlistContent userId={userData.id} />;
            default:
                return <ProfileContent 
                    username={userData.username}
                    email={userData.email}
                />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1">
                <UserBanner username={userData.username} />

                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-6">Hi, {userData.username}! 👋</h1>

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