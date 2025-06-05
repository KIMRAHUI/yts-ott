import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import axios from 'axios';

function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSignup = async () => {
    if (!userId || !password || !birthYear || !recoveryEmail) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      // ✅ Supabase 백엔드에 회원 등록 요청
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        {
          username: userId,
          password,
          birth_year: birthYear,
          recovery_email: recoveryEmail,
        }
      );

      const { id } = response.data;

      // ✅ localStorage에 로그인 상태 저장
      localStorage.setItem('userId', id); // Supabase UUID
      localStorage.setItem('username', userId);
      localStorage.setItem('birthYear', birthYear);
      localStorage.setItem('isLoggedIn', 'true');

      if (onSignup) onSignup();

      alert(`${userId}님, 가입이 완료되었습니다.`);
      setTimeout(() => navigate('/subscribe'), 100);

    } catch (error) {
      console.error('❌ 회원가입 실패:', error);
      if (error.response?.status === 400) {
        alert(error.response.data.message); // 예: 중복 아이디
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>회원가입</h2>
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
        <input
          type="email"
          placeholder="복구용 이메일"
          value={recoveryEmail}
          onChange={(e) => setRecoveryEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="출생 연도 (예: 2001)"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
        />
        <button onClick={handleSignup}>가입하기</button>
      </div>
    </div>
  );
}

export default Signup;
