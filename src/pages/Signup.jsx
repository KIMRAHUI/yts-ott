// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSignup = () => {
    if (!userId || !password || !birthYear || !recoveryEmail) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const existing = localStorage.getItem('userInfo');
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.username === userId) {
        alert('이미 존재하는 아이디입니다.');
        return;
      }
    }

    const userInfo = {
      username: userId,
      password: password,
      birth: birthYear,
      recoveryEmail: recoveryEmail,
    };

    console.log('1. 저장 전 userInfo:', userInfo);

    try {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('birth', birthYear);
      localStorage.setItem('username', userId);
      localStorage.setItem('isLoggedIn', 'true');

      console.log('2. 저장 후 userInfo:', localStorage.getItem('userInfo'));

      // ✅ App에 로그인 상태 알려주기
      if (onSignup) onSignup();

      alert(`${userId}님, 가입이 완료되었습니다.`);

      setTimeout(() => {
        navigate('/subscribe');
      }, 100);

    } catch (e) {
      console.error('❌ localStorage 저장 실패:', e);
      alert('회원정보 저장 중 오류가 발생했습니다.');
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
