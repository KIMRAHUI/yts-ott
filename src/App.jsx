// src/App.jsx
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import ExplorePage from './pages/Explore';
import Support from './pages/Support';
import MyPage from './pages/MyPage';
import MovieDetail from './pages/MovieDetail';
import Subscription from './pages/Subscription';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const navigate = useNavigate();

  // 페이지 진입 시 localStorage로 로그인 상태 복원
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  // 로그인 성공 시 호출되는 함수
  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  // 로그아웃 시 호출되는 함수
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/subscribe" element={<Subscription />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleLogin} />} />

        {/* 로그인한 사용자만 마이페이지 접근 가능 */}
        <Route
          path="/mypage"
          element={isLoggedIn ? <MyPage /> : <Login onLogin={handleLogin} />}
        />
      </Routes>
    </>
  );
}

export default App;
