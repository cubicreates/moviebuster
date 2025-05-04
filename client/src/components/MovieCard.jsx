import React, { useState } from 'react';
import { Play, Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../api/tmdb';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const title = movie.title || movie.name || 'Unknown Title';
  const posterPath = movie.poster_path;
  const overview = movie.overview || 'No description available';

  const handlePlayClick = () => {
    const movieSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${movieSlug}`, { state: { movieId: movie.id } });
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/not-logged-in');
      return;
    }

    try {
      const response = await fetch('http://localhost:5100/api/users/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user._id,
          movieId: movie.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add to favorites');
    }
  };

  const handleAddToList = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/not-logged-in');
      return;
    }

    try {
      const response = await fetch('http://localhost:5100/api/users/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user._id,
          movieId: movie.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to watchlist');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add to watchlist');
    }
  };

  return (
    <div 
      className="movie-card w-[180px] sm:w-[220px] md:w-[260px] h-[270px] sm:h-[330px] md:h-[390px] flex-shrink-0 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <img 
        src={getImageUrl(posterPath)} 
        alt={title} 
        className="w-full h-full object-cover rounded-lg shadow-md"
      />
      
      {/* Overlay with Information */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{title}</h3>
          {isHovered && (
            <p className="text-white/80 text-sm mb-3 line-clamp-3 overflow-hidden">
              {overview}
            </p>
          )}
          <div className="flex items-center space-x-3 mb-2">
            <button 
              onClick={handlePlayClick}
              className="p-2 bg-moviebuster-red rounded-full hover:bg-white/90 hover:text-moviebuster-red transition"
            >
              <Play className="w-4 h-4 text-moviebuster-darkblue" />
            </button>
            <button 
              onClick={handleAddToList}
              className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
            <button 
              onClick={handleFavorite}
              className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition"
            >
              <Heart className="w-4 h-4 text-white" />
            </button>
          </div>
          {movie.vote_average && (
            <div className="text-sm text-white/90">
              <span className="text-moviebuster-yellow font-bold">{movie.vote_average.toFixed(1)}</span>/10
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
