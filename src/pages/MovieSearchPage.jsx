import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/MovieSearchPage.css';

const genres = ['all', 'action', 'comedy', 'animation', 'drama', 'horror', 'romance'];
const sortOptions = ['download_count', 'rating', 'like_count'];

function MovieSearchPage() {
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get('genre') || 'all';

  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState('download_count');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const moviesPerPage = 15;

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, [keyword, genre, sortBy, page]);

  const fetchMovies = async () => {
    try {
      const url = `https://yts.mx/api/v2/list_movies.json?limit=${moviesPerPage}&page=${page}` +
        (keyword ? `&query_term=${keyword}` : '') +
        (genre !== 'all' ? `&genre=${genre}` : '') +
        `&sort_by=${sortBy}`;

      const res = await axios.get(url);
      setMovies(res.data.data.movies || []);
      setTotalCount(res.data.data.movie_count || 0);
    } catch (err) {
      console.error('영화 검색 실패:', err);
    }
  };

  const totalPages = Math.ceil(totalCount / moviesPerPage);

  return (
    <div className="search-container">
      <h1 className="search-title">영화 검색</h1>

      <div className="filter-bar">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="영화 제목을 입력하세요"
          className="search-input"
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="search-select">
          {genres.map((g) => (
            <option key={g} value={g}>{g === 'all' ? '모든 장르' : g}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="search-select">
          <option value="download_count">다운로드순</option>
          <option value="rating">평점순</option>
          <option value="like_count">좋아요순</option>
        </select>
      </div>

      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img src={movie.medium_cover_image} alt={movie.title} />
              <h4>{movie.title}</h4>
              <p>⭐ {movie.rating}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-result">검색 결과가 없습니다.</p>
      )}

      <div className="pagination">
        {[...Array(Math.min(totalPages, 8)).keys()].map((i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'page-btn active' : 'page-btn'}>
            {i + 1}
          </button>
        ))}
        {page < totalPages && totalPages > 8 && (
          <button onClick={() => setPage((prev) => prev + 1)} className="page-btn">Next →</button>
        )}
      </div>
    </div>
  );
}

export default MovieSearchPage;
