import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Explore.css';

function Explore() {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('year');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userBirth = localStorage.getItem('birthYear');
  const currentYear = new Date().getFullYear();
  const age = userBirth ? currentYear - parseInt(userBirth) : null;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const params = {
          limit: 20,
          page,
          sort_by: sortBy,
          genre,
          query_term: query,
        };
        const res = await axios.get('https://yts.mx/api/v2/list_movies.json', { params });
        const movieData = res.data.data.movies || [];
        const movieCount = res.data.data.movie_count;

        const filtered = movieData.filter((movie) => {
          const rating = movie.mpa_rating;
          if (!age) return true;
          if (rating === 'R' && age < 19) return false;
          if (rating === 'PG' && age < 7) return false;
          return true;
        });

        setMovies(filtered);
        setTotalPages(Math.ceil(movieCount / 15));
      } catch (err) {
        console.error('API 오류:', err);
      }
    };

    fetchMovies();
  }, [page, sortBy, genre, query, age]);

  return (
    <div className="explore-container">
      <div className="explore-filters">
        <input
          type="text"
          placeholder="영화 제목 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">전체 장르</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="horror">Horror</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="animation">Animation</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date_added">최신순</option>
          <option value="year">연도순</option>
          <option value="rating">평점순</option>
          <option value="download_count">다운로드순</option>
          <option value="like_count">좋아요순</option>
          <option value="title">제목순</option>
        </select>
      </div>

      <div className="movie-list card-row">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
            <img src={movie.medium_cover_image} alt={movie.title} />
            <p>{movie.title}</p>
            <span className="badge">등급: {movie.mpa_rating || '정보 없음'}</span>
          </Link>
        ))}
      </div>

      <div className="pagination">
        {[...Array(Math.min(totalPages, 8)).keys()].map((i) => (
          <button
            key={i + 1}
            className={page === i + 1 ? 'active' : ''}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        {totalPages > 8 && page < totalPages && (
          <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Explore;
