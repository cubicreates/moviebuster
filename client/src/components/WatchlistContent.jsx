import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../api/tmdb';
import { List } from 'lucide-react';
import MovieGrid from './MovieGrid';

const WatchlistContent = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadWatchlist = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;

            try {
                const response = await fetch(`http://localhost:5100/api/users/${user._id}/watchlist`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                
                // Fetch movie details for each ID
                const moviesData = await Promise.all(
                    data.watchlist.map(id => fetchMovieDetails(id))
                );
                setWatchlist(moviesData);
            } catch (error) {
                console.error('Error loading watchlist:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWatchlist();
    }, []);

    const removeFromWatchlist = (id) => {
        setWatchlist(watchlist.filter(item => item.id !== id));
    };

    if (isLoading) {
        return <div className="py-8 text-center">Loading your watchlist...</div>;
    }

    if (watchlist.length === 0) {
        return (
            <div className="py-12 text-center">
                <List className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
                <p className="text-muted-foreground">Movies and TV shows you want to watch later will appear here</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">My Watchlist</h2>
            <MovieGrid 
                movies={watchlist} 
                onRemove={removeFromWatchlist}
                showRemoveButton={true}
            />
        </div>
    );
};

export default WatchlistContent;