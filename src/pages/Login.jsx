import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!userId || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    // 회원가입 정보가 전혀 없을 경우
    if (!storedUsername || !storedPassword) {
      alert('회원가입이 필요합니다. 먼저 가입해주세요.');
      return;
    }

    // 아이디/비밀번호가 일치하지 않을 경우
    if (userId !== storedUsername || password !== storedPassword) {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 로그인 성공
    localStorage.setItem('username', userId);
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

        {/* 회원가입 안내 버튼 */}
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
