import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieHero from '../components/MovieHero';
import MovieInfo from '../components/MovieInfo';
import MovieMeta from '../components/MovieMeta';
import ShareButtons from '../components/ShareButtons';
import NotFound from './NotFound';
import { 
  getImageUrl, 
  fetchMovieDetails, 
  fetchRecommendedMovies, 
  fetchTopRatedMovies 
} from '../api/tmdb';

const MovieDetails = () => {
  const { movieSlug } = useParams();
  const location = useLocation();
  const movieId = location.state?.movieId;
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    const loadMovieData = async () => {
      if (!movieId) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        const [movieData, recommended, topRated] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchRecommendedMovies(movieId),
          fetchTopRatedMovies()
        ]);
        
        if (!movieData) {
          setError(true);
          return;
        }

        setMovie(movieData);
        setRecommendedMovies(recommended.results || []);
        setTopRatedMovies(topRated.results || []);
      } catch (error) {
        console.error('Error loading movie data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [movieId]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  if (error) return <NotFound />;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-moviebuster-dark">
      <div className="text-moviebuster-yellow text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onSearchResults={handleSearchResults} />
      
      <main className="flex-grow mt-16">
        <MovieHero movie={movie} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Movie Info */}
            <div className="flex-grow">
              <MovieInfo 
                movie={movie} 
                recommendedMovies={recommendedMovies}
                topRatedMovies={topRatedMovies}
              />
              <ShareButtons />
            </div>
            
            {/* Right Column - Meta Info */}
            <div className="w-full md:w-[300px]">
              <MovieMeta movie={movie} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;