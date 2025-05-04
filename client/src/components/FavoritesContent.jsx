import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../api/tmdb';
import { Heart } from 'lucide-react';
import MovieGrid from './MovieGrid';

const FavoritesContent = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;

            try {
                const response = await fetch(`http://localhost:5100/api/users/${user._id}/favorites`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                
                // Fetch movie details for each ID
                const moviesData = await Promise.all(
                    data.favorites.map(id => fetchMovieDetails(id))
                );
                setFavorites(moviesData);
            } catch (error) {
                console.error('Error loading favorites:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
    }, []);

    if (isLoading) {
        return <div className="py-8 text-center">Loading your favorite movies...</div>;
    }

    if (favorites.length === 0) {
        return (
            <div className="py-12 text-center">
                <Heart className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground">Movies you mark as favorites will appear here</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">My Favorites</h2>
            <MovieGrid 
                movies={favorites} 
                onRemove={id => setFavorites(favorites.filter(movie => movie.id !== id))}
                showRemoveButton={true}
            />
        </div>
    );
};

export default FavoritesContent;
