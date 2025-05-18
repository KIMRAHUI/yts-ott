import '../styles/Home.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const GENRES = ['action', 'comedy', 'animation', 'drama', 'sci-fi'];

function Home() {
  const [genreMovies, setGenreMovies] = useState({});
  const [genreSearchInputs, setGenreSearchInputs] = useState({});
  const [genreSearchResults, setGenreSearchResults] = useState({});


  useEffect(() => {
    const fetchByGenre = async (genre) => {
      try {
        const res = await axios.get(
          `https://yts.mx/api/v2/list_movies.json?genre=${genre}&sort_by=year&limit=10`
        );
        return res.data.data.movies;
      } catch (error) {
        console.error(`${genre} 영화 불러오기 실패:`, error);
        return [];
      }
    };

    const fetchAllGenres = async () => {
      const results = {};
      for (const genre of GENRES) {
        results[genre] = await fetchByGenre(genre);
      }
      setGenreMovies(results);
    };

    fetchAllGenres();
  }, []);

  const handleGenreSearchChange = (genre, value) => {
    setGenreSearchInputs((prev) => ({ ...prev, [genre]: value }));
  };

  const handleGenreSearch = async (genre) => {
    const term = genreSearchInputs[genre]?.trim();
    if (!term) return;

    try {
      const res = await axios.get(
        `https://yts.mx/api/v2/list_movies.json?genre=${genre}&query_term=${term}&limit=10&sort_by=year`
      );
      setGenreSearchResults((prev) => ({ ...prev, [genre]: res.data.data.movies || [] }));
    } catch (error) {
      console.error(`${genre} 검색 실패:`, error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 4 }},
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 3 }},
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 }}
    ]
  };

  return (
    <div className="retro-window">
      {GENRES.map((genre) => (
        <section key={genre} className={`retro-section ${genre.replace('-', '')}`}>
          <div className="genre-header">
            <h2 className="genre-title">{genre.toUpperCase()}</h2>
            <input
              className="retro-input"
              type="text"
              value={genreSearchInputs[genre] || ''}
              onChange={(e) => handleGenreSearchChange(genre, e.target.value)}
              placeholder={`${genre} 영화 검색`}
            />
            <button className="retro-button" onClick={() => handleGenreSearch(genre)}>검색</button>
          </div>

          <Slider {...settings}>
            {(genreSearchResults[genre] || genreMovies[genre] || []).map((movie) => (
              <div key={movie.id} className="retro-movie-card">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={movie.medium_cover_image || '/assets/images/default-poster.png'}
                    alt={movie.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/default-poster.png';
                    }}
                  />
                  <p style={{ color: 'black', fontWeight: 'bold' }}>{movie.title}</p>
                </Link>
              </div>
            ))}
          </Slider>
        </section>
      ))}
    </div>
  );
}

export default Home;
