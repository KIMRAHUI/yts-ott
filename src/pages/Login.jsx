import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!userId || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        username: userId,
        password: password,
      });

      const { id, username, birth_year } = res.data;

      // 로그인 성공 → localStorage에 저장
      localStorage.setItem('userId', id);
      localStorage.setItem('username', username);
      localStorage.setItem('birthYear', birth_year);
      localStorage.setItem('isLoggedIn', 'true');

      if (onLogin) onLogin();

      alert(`환영합니다, ${username}님!`);
      navigate('/');
    } catch (err) {
      console.error('❌ 로그인 실패:', err);
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
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
        <button className="signup-button" onClick={() => navigate('/signup')}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
