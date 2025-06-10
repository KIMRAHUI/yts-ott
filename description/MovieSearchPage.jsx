import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/MovieSearchPage.css';

// 선택 가능한 장르 및 정렬 옵션 배열
const genres = ['all', 'action', 'comedy', 'animation', 'drama', 'horror', 'romance'];
const sortOptions = ['download_count', 'rating', 'like_count'];

function MovieSearchPage() {
  // URL 쿼리스트링에서 genre 파라미터 추출
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get('genre') || 'all';

  // 상태 초기화
  const [keyword, setKeyword] = useState('');             // 검색어
  const [genre, setGenre] = useState(initialGenre);       // 장르
  const [sortBy, setSortBy] = useState('download_count'); // 정렬기준
  const [movies, setMovies] = useState([]);               // 영화 목록
  const [page, setPage] = useState(1);                    // 현재 페이지
  const [totalCount, setTotalCount] = useState(0);        // 전체 결과 수
  const moviesPerPage = 15;                               // 페이지당 영화 수

  const navigate = useNavigate();

  // 필터값 변경 시 영화 목록 다시 불러오기
  useEffect(() => {
    fetchMovies();
  }, [keyword, genre, sortBy, page]);

  // 영화 API 호출
  const fetchMovies = async () => {
    try {
      const url =
        `https://yts.mx/api/v2/list_movies.json?limit=${moviesPerPage}&page=${page}` +
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

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalCount / moviesPerPage);

  return (
    <div className="search-container">
      <h1 className="search-title">영화 검색</h1>

      {/* 필터 영역 */}
      <div className="filter-bar">
        {/* 키워드 입력 */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="영화 제목을 입력하세요"
          className="search-input"
        />

        {/* 장르 선택 */}
        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setPage(1); // 장르 변경 시 페이지 초기화
          }}
          className="search-select"
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g === 'all' ? '모든 장르' : g}
            </option>
          ))}
        </select>

        {/* 정렬 기준 선택 */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1); // 정렬 변경 시 페이지 초기화
          }}
          className="search-select"
        >
          <option value="download_count">다운로드순</option>
          <option value="rating">평점순</option>
          <option value="like_count">좋아요순</option>
        </select>
      </div>

      {/* 영화 목록 */}
      {movies.length > 0 ? (
        <div className="movie-grid card-row">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/movie/${movie.id}`)} // 상세 페이지 이동
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

      {/* 페이지네이션 */}
      <div className="pagination">
        {[...Array(Math.min(totalPages, 8)).keys()].map((i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? 'page-btn active' : 'page-btn'}
          >
            {i + 1}
          </button>
        ))}
        {/* 페이지가 많을 경우 다음 페이지 버튼 */}
        {page < totalPages && totalPages > 8 && (
          <button onClick={() => setPage((prev) => prev + 1)} className="page-btn">
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieSearchPage;
