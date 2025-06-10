// ✅ Explore 페이지: 장르별 영화 탐색 및 통계 시각화 기능 포함
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StatisticsModal from '../components/Statistics/StatisticsModal';
import '../styles/Explore.css';

function Explore() {
  // 상태 변수 정의
  const [movies, setMovies] = useState([]);         // 영화 리스트
  const [genre, setGenre] = useState('');           // 선택한 장르
  const [sortBy, setSortBy] = useState('year');     // 정렬 기준
  const [query, setQuery] = useState('');           // 검색어
  const [page, setPage] = useState(1);              // 현재 페이지
  const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수
  const [showStats, setShowStats] = useState(false); // 📊 통계 모달 표시 여부

  // 유저 나이 계산 (localStorage에서 생년 읽음)
  const userBirth = localStorage.getItem('birthYear');
  const currentYear = new Date().getFullYear();
  const age = userBirth ? currentYear - parseInt(userBirth) : null;

  // ✅ 영화 데이터 가져오기 (장르, 정렬, 검색어, 페이지 변경 시마다 실행)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // API 요청 파라미터
        const params = {
          limit: 20,
          page,
          sort_by: sortBy,
          genre,
          query_term: query,
        };

        // YTS API 호출
        const res = await axios.get('https://yts.mx/api/v2/list_movies.json', { params });
        const movieData = res.data.data.movies || [];
        const movieCount = res.data.data.movie_count;

        // ✅ 연령 제한 필터링 (예: R등급 → 19세 미만 제외)
        const filtered = movieData.filter((movie) => {
          const rating = movie.mpa_rating;
          if (!age) return true; // 나이 정보 없으면 모두 표시
          if (rating === 'R' && age < 19) return false;
          if (rating === 'PG' && age < 7) return false;
          return true;
        });

        // 상태 업데이트
        setMovies(filtered);
        setTotalPages(Math.ceil(movieCount / 20)); // 페이지 수 계산
      } catch (err) {
        console.error('API 오류:', err);
      }
    };

    fetchMovies(); // 비동기 fetch 실행
  }, [page, sortBy, genre, query, age]);

  // ✅ 페이지네이션 버튼 렌더링 함수
  const renderPagination = () => {
    const pages = [];
    const delta = 2; // 현재 페이지 기준 앞뒤 페이지 수
    const range = [];
    const total = totalPages;

    // 현재 페이지 기준 앞뒤 페이지 범위 설정
    for (let i = Math.max(2, page - delta); i <= Math.min(total - 1, page + delta); i++) {
      range.push(i);
    }

    const hasLeftGap = page - delta > 2;
    const hasRightGap = page + delta < total - 1;

    // 처음 / 이전 페이지 버튼
    if (page > 1) {
      pages.push(<button key="first" onClick={() => setPage(1)}>« First</button>);
      pages.push(<button key="prev" onClick={() => setPage(page - 1)}>« Previous</button>);
    }

    // 첫 페이지
    pages.push(
      <button key={1} className={page === 1 ? 'active' : ''} onClick={() => setPage(1)}>
        1
      </button>
    );

    if (hasLeftGap) pages.push(<span key="left-ellipsis">...</span>);

    // 범위 내 페이지 버튼
    range.forEach((p) => {
      pages.push(
        <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>
          {p}
        </button>
      );
    });

    if (hasRightGap) pages.push(<span key="right-ellipsis">...</span>);

    // 마지막 페이지
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

    // 다음 / 마지막 페이지 버튼
    if (page < total) {
      pages.push(<button key="next" onClick={() => setPage(page + 1)}>Next »</button>);
      pages.push(<button key="last" onClick={() => setPage(total)}>Last »</button>);
    }

    return pages;
  };

  return (
    <div className="explore-wrapper">
      <div className="explore-container">
        {/* ✅ 필터 & 검색 UI */}
        <div className="explore-filters">
          {/* 영화 제목 검색 */}
          <input
            type="text"
            placeholder="영화 제목 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* 장르 선택 */}
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">전체 장르</option>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="horror">Horror</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="animation">Animation</option>
          </select>

          {/* 정렬 기준 선택 */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_added">최신순</option>
            <option value="year">연도순</option>
            <option value="rating">평점순</option>
            <option value="download_count">다운로드순</option>
            <option value="like_count">좋아요순</option>
            <option value="title">제목순</option>
          </select>

          {/* 통계 보기 버튼 */}
          <button className="stats-btn" onClick={() => setShowStats(true)}>📊 통계 보기</button>
        </div>

        {/* 📊 통계 모달 표시 */}
        {showStats && <StatisticsModal onClose={() => setShowStats(false)} />}

        {/* ✅ 영화 카드 리스트 */}
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

        {/* ✅ 페이지네이션 */}
        <div className="pagination">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}

export default Explore;
