import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

function Signup() {
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

    localStorage.setItem('username', userId);
    localStorage.setItem('birthYear', birthYear);       // (기존) 입력 확인용으로 쓰는 경우
    localStorage.setItem('birth', birthYear);           //  MyPage에서 표시할 생년월일
    localStorage.setItem('password', password);         //  로그인 검증용
    localStorage.setItem('recoveryEmail', recoveryEmail); //추후 복구용

    alert(`${userId}님, 가입이 완료되었습니다.`);
    navigate('/subscribe'); // 구독 페이지로 이동
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
