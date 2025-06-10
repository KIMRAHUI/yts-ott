// ✅ 사용자 로그인 컴포넌트
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();

  // ✅ 입력 필드 상태 정의
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // ✅ 로그인 처리 함수
  const handleLogin = async () => {
    // 필수 입력값 확인
    if (!userId || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // 백엔드 로그인 API 호출 (POST /api/auth/login)
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        username: userId,
        password: password,
      });

      // 응답에서 필요한 사용자 정보 추출
      const { id, username, birth_year, membership } = res.data;

      // ✅ 로그인 성공 시 → localStorage에 사용자 정보 저장
      localStorage.setItem('user_id', id);                 // Supabase UUID
      localStorage.setItem('username', username);          // 사용자명
      localStorage.setItem('birth', birth_year || '');     // 생년 정보 (통계용)
      localStorage.setItem('membership', membership || 'Basic'); // 멤버십 정보
      localStorage.setItem('isLoggedIn', 'true');          // 로그인 상태 표시

      // onLogin 콜백 호출 (App 또는 Header 상태 반영용)
      if (onLogin) onLogin();

      // 홈으로 이동
      alert(`환영합니다, ${username}님!`);
      navigate('/');
    } catch (err) {
      // ❌ 로그인 실패 시 오류 처리
      console.error('❌ 로그인 실패:', err);
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>로그인</h2>

        {/* ✅ 아이디 입력 필드 */}
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        {/* ✅ 비밀번호 입력 필드 */}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ 로그인 버튼 */}
        <button onClick={handleLogin}>로그인</button>

        {/* ✅ 회원가입 페이지로 이동 */}
        <button className="signup-button" onClick={() => navigate('/signup')}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
