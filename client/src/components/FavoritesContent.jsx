import React, { useEffect, useState } from 'react';
import { fetchTopRated } from '../api/tmdb';
import { Heart } from 'lucide-react';
import MovieGrid from './MovieGrid';

const FavoritesContent = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                setIsLoading(true);
                const movies = await fetchTopRated();
                setFavorites(movies.slice(0, 6));
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
