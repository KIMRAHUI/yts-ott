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
      // Supabase 백엔드에 회원 등록 요청
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

      // localStorage에 로그인 상태 저장 (MyPage 호환용)
      localStorage.setItem('user_id', id);
      localStorage.setItem('username', userId);
      localStorage.setItem('birth', birthYear);
      localStorage.setItem('membership', 'Basic');
      localStorage.setItem('isLoggedIn', 'true');

      if (onSignup) onSignup();

      alert(`${userId}님, 가입이 완료되었습니다.`);
      setTimeout(() => navigate('/subscribe'), 100);

    } catch (error) {
      console.error('❌ 회원가입 실패:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      if (status === 400) {
        alert(serverMessage || '잘못된 요청입니다.');
      } else if (status === 409) {
        alert(serverMessage || '이미 존재하는 계정입니다.');
      } else if (status === 500) {
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      } else {
        alert('회원가입 중 알 수 없는 오류가 발생했습니다.');
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
