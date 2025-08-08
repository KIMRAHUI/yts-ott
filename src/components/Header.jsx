// 메뉴 + 로그인
// 상단 고정 헤더 컴포넌트
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Header.css'; // 스타일 외부 분리

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(location.pathname);

  // 로그인 상태 동기화
  useEffect(() => {
    const syncUsername = () => {
      const name = localStorage.getItem('username');
      setUsername(name);
    };

    syncUsername(); // 최초 1회
    const interval = setInterval(syncUsername, 500); // 주기적 동기화

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="retro-header">
      {/* 로고 */}
      <div className="retro-logo">
        <Link to="/" className="retro-logo-link">
          <img src="/flimdreams-logo.png" alt="FlimDreams 로고" className="retro-logo-image" />
        </Link>
      </div>


      {/* 메뉴 + 로그인/로그아웃 묶는 오른쪽 박스 */}
      <div className="retro-right-box">
        {/* 상단 네비게이션 */}
        <nav className="retro-nav">
          <Link
            to="/"
            onClick={() => setSelectedMenu('/')}
            className={selectedMenu === '/' ? 'active' : ''}
          >
            홈
          </Link>

          <Link
            to="/explore"
            onClick={() => setSelectedMenu('/explore')}
            className={selectedMenu === '/explore' ? 'active' : ''}
          >
            장르별
          </Link>

          <Link
            to="/support"
            onClick={() => setSelectedMenu('/support')}
            className={selectedMenu === '/support' ? 'active' : ''}
          >
            고객지원
          </Link>

          {/* 로그인 시에만 마이페이지 표시 */}
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

        {/* 로그인 or 로그아웃 상태 */}
        {username ? (
          <div className="retro-user-box">
            <span className="retro-username">👤 {username}님</span>
            <button className="retro-button success" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
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
