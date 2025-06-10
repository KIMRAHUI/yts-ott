// ✅ 홈 화면: 장르별 추천 영화 슬라이드 및 검색 기능 포함
import '../styles/Home.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick'; // 영화 슬라이더
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import homeBanner from '../assets/home-banner.png';

// ✅ 표시할 장르 목록
const GENRES = ['action', 'comedy', 'animation'];

function Home() {
  // ✅ 상태 정의
  const [genreMovies, setGenreMovies] = useState({});           // 장르별 기본 영화 목록
  const [genreSearchInputs, setGenreSearchInputs] = useState({}); // 장르별 검색 입력값
  const [genreSearchResults, setGenreSearchResults] = useState({}); // 장르별 검색 결과
  const [hoveredMovieId, setHoveredMovieId] = useState(null);   // hover된 영화 ID

  // ✅ 컴포넌트 마운트 시 각 장르별 영화 데이터를 YTS API에서 fetch
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
      setGenreMovies(results); // 모든 장르별 영화 상태 저장
    };

    fetchAllGenres();
  }, []);

  // ✅ 장르별 검색 입력값 처리
  const handleGenreSearchChange = (genre, value) => {
    setGenreSearchInputs((prev) => ({ ...prev, [genre]: value }));
  };

  // ✅ 장르별 영화 검색 요청
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

  // ✅ react-slick 슬라이더 설정 (반응형 포함)
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } }
    ]
  };

  return (
    <div className="home-container">
      {/* ✅ 상단 배너 이미지 */}
      <div className="home-hero">
        <img src={homeBanner} alt="Main Banner" className="home-banner" />
      </div>

      {/* ✅ 장르별 섹션 */}
      {GENRES.map((genre) => (
        <section key={genre} className={`retro-section ${genre}`}>
          {/* 장르 제목 + 검색창 */}
          <div className="genre-header">
            <h2 className="genre-title">{genre.toUpperCase()}</h2>

            {/* 검색창 */}
            <div className="search-row">
              <input
                className="retro-input"
                type="text"
                value={genreSearchInputs[genre] || ''}
                onChange={(e) => handleGenreSearchChange(genre, e.target.value)}
                placeholder={`${genre} 영화 검색`}
              />
              <button className="retro-button" onClick={() => handleGenreSearch(genre)}>
                검색
              </button>
            </div>
          </div>

          {/* ✅ 장르별 영화 슬라이더 */}
          <Slider {...settings}>
            {(genreSearchResults[genre] || genreMovies[genre] || []).map((movie) => (
              <div
                key={movie.id}
                className="retro-movie-card"
                onMouseEnter={() => setHoveredMovieId(movie.id)}
                onMouseLeave={() => setHoveredMovieId(null)}
              >
                <Link to={`/movie/${movie.id}`}>
                  <div className="movie-thumbnail" style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={movie.medium_cover_image || '/assets/images/default-poster.png'}
                      alt={movie.title}
                      onError={(e) => {
                        // 이미지 로딩 실패 시 기본 포스터 대체
                        e.target.onerror = null;
                        e.target.src = '/assets/images/default-poster.png';
                      }}
                    />

                    {/* ✅ 마우스 hover 시 줄거리 미리보기 */}
                    {hoveredMovieId === movie.id && (
                      <div className="movie-hover">
                        <p>{movie.summary?.slice(0, 100) || '줄거리 정보 없음'}</p>
                        <small>상세보기를 원하시면 클릭해주세요</small>
                      </div>
                    )}
                  </div>
                  <p style={{ color: 'black', fontWeight: 'bold' }}>{movie.title}</p>
                </Link>
              </div>
            ))}
          </Slider>
        </section>
      ))}

      {/* ✅ 하단 푸터 정보 */}
      <footer className="retro-footer">
        <div className="footer-line">
          📧 support@ytsott.com &nbsp;&nbsp;|&nbsp;&nbsp; 📞 1600-0000 &nbsp;&nbsp;|&nbsp;&nbsp; 🕒 평일 10시 ~ 17시
        </div>
        <div className="footer-line">
          🏢 서울특별시 강남구 테헤란로 123, YTS빌딩
        </div>
        <p className="footer-copy">Ⓜ 2025 YTS OTT Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
