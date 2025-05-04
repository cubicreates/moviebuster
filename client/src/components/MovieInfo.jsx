import React, { useState } from 'react';
import { Play, Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../api/tmdb';

const MovieInfo = ({ movie, recommendedMovies = [], topRatedMovies = [] }) => {
  const navigate = useNavigate();

  const handleMovieClick = (selectedMovie) => {
    const movieSlug = selectedMovie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${movieSlug}`, { state: { movieId: selectedMovie.id } });
  };

  return (
    <div className="space-y-8">
      {/* Recommended Movies Grid */}
      <div className="bg-moviebuster-darkblue/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Recommended Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendedMovies.slice(0, 20).map((movie) => (
            <MovieGridItem 
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie)}
            />
          ))}
        </div>
      </div>

      {/* Top Rated Movies List */}
      <div className="bg-moviebuster-darkblue/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Top Rated</h2>
        <div className="space-y-3">
          {topRatedMovies.slice(0, 5).map((movie) => (
            <MovieListItem 
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MovieGridItem = ({ movie, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const title = movie.title || movie.name || 'Unknown Title';
  const overview = movie.overview || 'No description available';

  return (
    <div 
      className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img 
        src={getImageUrl(movie.poster_path)}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-white font-semibold text-base mb-2 truncate">{title}</h3>
          {isHovered && (
            <p className="text-white/80 text-sm mb-3 line-clamp-3 overflow-hidden">
              {overview}
            </p>
          )}
          <div className="flex items-center space-x-3 mb-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="p-2 bg-moviebuster-red rounded-full hover:bg-white/90 hover:text-moviebuster-red transition"
            >
              <Play className="w-4 h-4 text-moviebuster-darkblue" />
            </button>
            <button className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition">
              <Plus className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition">
              <Heart className="w-4 h-4 text-white" />
            </button>
          </div>
          {movie.vote_average && (
            <div className="text-sm text-white/90">
              <span className="text-moviebuster-yellow font-bold">
                {movie.vote_average.toFixed(1)}
              </span>/10
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MovieListItem = ({ movie, onClick }) => (
  <div 
    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
      <img 
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-grow min-w-0">
      <h3 className="font-medium text-white/90 truncate">{movie.title}</h3>
      <div className="flex items-center gap-2 text-sm text-white/60">
        <span>{movie.release_date?.split('-')[0]}</span>
        <span>•</span>
        <span>{movie.vote_average?.toFixed(1)} Rating</span>
      </div>
    </div>
    <button 
      className="p-2 bg-moviebuster-red/80 rounded-full hover:bg-white/90 hover:text-moviebuster-red transition-colors flex-shrink-0"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Play className="w-4 h-4" />
    </button>
  </div>
);

export default MovieInfo;