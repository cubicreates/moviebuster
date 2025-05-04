import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Heart, List, LogOut } from 'lucide-react';

const UserDropdown = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userData.name || 'User';
    const email = userData.email || 'user@example.com';

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div
                className="absolute right-4 top-16 w-64 rounded-lg bg-black/80 backdrop-blur-sm 
                shadow-lg border border-white/10 animate-in fade-in"
                onClick={e => e.stopPropagation()}
            >
                {/* User info */}
                <div className="p-4 flex flex-col items-center border-b border-white/10">
                    <div className="w-12 h-12 rounded-full bg-moviebuster-red flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                            {username.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h3 className="mt-2 font-medium text-lg text-white">{username}</h3>
                    <p className="text-sm text-white/60">{email}</p>
                </div>

                {/* Menu items */}
                <div className="py-2">
                    <MenuItem to="/profile" icon={<User />} label="Profile" onClick={onClose} />
                    <MenuItem to="/favorites" icon={<Heart />} label="Favorites" onClick={onClose} />
                    <MenuItem to="/watchlist" icon={<List />} label="Watchlist" onClick={onClose} />
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                        text-white/80 hover:text-moviebuster-red hover:bg-white/5 rounded-md transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const MenuItem = ({ to, icon, label, onClick }) => (
    <Link
        to={to}
        className="flex items-center px-4 py-2 text-white/80 hover:text-moviebuster-red 
        hover:bg-white/5 transition-colors"
        onClick={onClick}
    >
        <span className="mr-3">{React.cloneElement(icon, { size: 18 })}</span>
        <span>{label}</span>
    </Link>
);

export default UserDropdown;