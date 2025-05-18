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
