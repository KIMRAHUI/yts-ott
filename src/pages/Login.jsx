// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!userId || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 1. localStorage에서 회원 정보 불러오기
    const storedString = localStorage.getItem('userInfo');
    if (!storedString) {
      alert('회원가입 정보가 없습니다. 먼저 가입해주세요.');
      return;
    }

    let storedUser = null;
    try {
      storedUser = JSON.parse(storedString);
      console.log('✅ 불러온 userInfo:', storedUser);
    } catch (e) {
      console.error('❌ userInfo 파싱 오류:', e);
      alert('저장된 회원 정보가 손상되었습니다. 다시 가입해주세요.');
      return;
    }

    // 2. 아이디/비밀번호 일치 확인
    if (userId !== storedUser.username || password !== storedUser.password) {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 3. 로그인 성공 처리
    localStorage.setItem('username', userId);
    localStorage.setItem('isLoggedIn', 'true');

    if (onLogin) onLogin(); // App.jsx로 로그인 상태 전달

    alert(`환영합니다, ${userId}님!`);
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>

        <button
          className="signup-button"
          onClick={() => navigate('/signup')}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
