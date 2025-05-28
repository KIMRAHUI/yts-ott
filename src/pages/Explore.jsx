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
        setTotalPages(Math.ceil(movieCount / 20));
      } catch (err) {
        console.error('API 오류:', err);
      }
    };

    fetchMovies();
  }, [page, sortBy, genre, query, age]);

  const renderPagination = () => {
    const pages = [];
    const delta = 2;
    const range = [];
    const total = totalPages;

    for (let i = Math.max(2, page - delta); i <= Math.min(total - 1, page + delta); i++) {
      range.push(i);
    }

    const hasLeftGap = page - delta > 2;
    const hasRightGap = page + delta < total - 1;

    if (page > 1) {
      pages.push(<button key="first" onClick={() => setPage(1)}>« First</button>);
      pages.push(<button key="prev" onClick={() => setPage(page - 1)}>« Previous</button>);
    }

    pages.push(
      <button key={1} className={page === 1 ? 'active' : ''} onClick={() => setPage(1)}>
        1
      </button>
    );

    if (hasLeftGap) pages.push(<span key="left-ellipsis">...</span>);

    range.forEach((p) => {
      pages.push(
        <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>
          {p}
        </button>
      );
    });

    if (hasRightGap) pages.push(<span key="right-ellipsis">...</span>);

    if (total > 1)
      pages.push(
        <button
          key={total}
          className={page === total ? 'active' : ''}
          onClick={() => setPage(total)}
        >
          {total}
        </button>
      );

    if (page < total) {
      pages.push(<button key="next" onClick={() => setPage(page + 1)}>Next »</button>);
      pages.push(<button key="last" onClick={() => setPage(total)}>Last »</button>);
    }

    return pages;
  };

  return (
    <div className="explore-wrapper">
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

        <div className="movie-list">
          {movies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
              <div className="movie-thumbnail">
                <img src={movie.medium_cover_image} alt={movie.title} />
                <div className="movie-hover">
                  <p>{movie.summary?.slice(0, 100) || '줄거리 정보 없음'}</p>
                  <small>상세보기를 원하시면 클릭해주세요</small>
                </div>
              </div>
              <p>{movie.title}</p>
              <span className="badge">등급: {movie.mpa_rating || '정보 없음'}</span>
            </Link>
          ))}
        </div>

        <div className="pagination">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}

export default Explore;
