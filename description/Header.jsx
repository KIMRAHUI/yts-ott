// ✅ 상단 고정 헤더 컴포넌트
// 메뉴 + 로그인 상태를 표시하는 레이아웃 전반을 담당
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Header.css'; // 스타일 분리

function Header() {
  const location = useLocation();   // 현재 URL 경로 추적
  const navigate = useNavigate();   // 프로그래밍 방식 라우팅

  const [username, setUsername] = useState('');             // 로그인된 유저명
  const [selectedMenu, setSelectedMenu] = useState(location.pathname); // 현재 선택된 메뉴 항목

  // ✅ 로그인 상태 동기화
  // 로컬스토리지에 저장된 username을 주기적으로 가져옴
  useEffect(() => {
    const syncUsername = () => {
      const name = localStorage.getItem('username');
      setUsername(name);
    };

    syncUsername(); // 컴포넌트 첫 마운트 시 초기화
    const interval = setInterval(syncUsername, 500); // 주기적으로 로컬스토리지 감지

    return () => clearInterval(interval); // 언마운트 시 인터벌 제거
  }, []);

  // ✅ 로그아웃 처리
  // 로컬스토리지 초기화 → 홈으로 이동 → 페이지 새로고침
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="retro-header">
      {/* 좌측 로고 영역 */}
      <div className="retro-logo">
        <Link to="/" className="retro-logo-text">
          📽️ FilmDreams
        </Link>
      </div>

      {/* 오른쪽: 메뉴 + 로그인/로그아웃 박스 */}
      <div className="retro-right-box">
        {/* ✅ 상단 네비게이션 메뉴 */}
        <nav className="retro-nav">
          {/* 홈 메뉴 */}
          <Link
            to="/"
            onClick={() => setSelectedMenu('/')}
            className={selectedMenu === '/' ? 'active' : ''}
          >
            홈
          </Link>

          {/* 장르별 탐색 */}
          <Link
            to="/explore"
            onClick={() => setSelectedMenu('/explore')}
            className={selectedMenu === '/explore' ? 'active' : ''}
          >
            장르별
          </Link>

          {/* 고객지원 페이지 */}
          <Link
            to="/support"
            onClick={() => setSelectedMenu('/support')}
            className={selectedMenu === '/support' ? 'active' : ''}
          >
            고객지원
          </Link>

          {/* 로그인한 경우에만 마이페이지 표시 */}
          {username && (
            <Link
              to="/mypage"
              onClick={() => setSelectedMenu('/mypage')}
              className={selectedMenu === '/mypage' ? 'active' : ''}
            >
              마이페이지
            </Link>
          )}
        </nav>

        {/* ✅ 로그인 상태에 따라 버튼 분기 */}
        {username ? (
          // 로그인된 상태
          <div className="retro-user-box">
            <span className="retro-username">👤 {username}님</span>
            <button className="retro-button success" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          // 로그아웃 상태
          <button
            className="retro-button danger"
            onClick={() => navigate('/login')}
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
