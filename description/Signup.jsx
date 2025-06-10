import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import axios from 'axios';

// 🔐 회원가입 컴포넌트
function Signup({ onSignup }) {
  const navigate = useNavigate();

  // ✅ 입력 필드 상태 관리
  const [userId, setUserId] = useState('');               // 사용자 ID (로그인용)
  const [password, setPassword] = useState('');           // 비밀번호
  const [birthYear, setBirthYear] = useState('');         // 출생연도
  const [recoveryEmail, setRecoveryEmail] = useState(''); // 복구용 이메일

  // ✅ 회원가입 처리
  const handleSignup = async () => {
    // 입력값 검증
    if (!userId || !password || !birthYear || !recoveryEmail) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    try {
      // Supabase 연동: 백엔드로 회원가입 요청
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        {
          username: userId,               // ID
          password,                       // 비밀번호
          birth_year: birthYear,          // 출생연도
          recovery_email: recoveryEmail,  // 복구 이메일
        }
      );

      const { id } = response.data; // Supabase에서 생성된 UUID

      // 🗂️ localStorage에 로그인 상태 저장 (MyPage 등에서 사용)
      localStorage.setItem('user_id', id);           // Supabase UUID
      localStorage.setItem('username', userId);      // 사용자 이름
      localStorage.setItem('birth', birthYear);      // 출생 연도
      localStorage.setItem('membership', 'Basic');   // 기본 멤버십으로 초기화
      localStorage.setItem('isLoggedIn', 'true');    // 로그인 상태 표시

      if (onSignup) onSignup(); // 상위 컴포넌트에서 상태 동기화 처리

      // 가입 완료 안내 후 구독 페이지로 이동
      alert(`${userId}님, 가입이 완료되었습니다.`);
      setTimeout(() => navigate('/subscribe'), 100);

    } catch (error) {
      // ❌ 오류 처리
      console.error('❌ 회원가입 실패:', error);
      if (error.response?.status === 400) {
        alert(error.response.data.message); // 중복 ID 등 사용자 입력 오류
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>회원가입</h2>

        {/* 아이디 입력 */}
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 복구용 이메일 입력 */}
        <input
          type="email"
          placeholder="복구용 이메일"
          value={recoveryEmail}
          onChange={(e) => setRecoveryEmail(e.target.value)}
        />

        {/* 출생 연도 입력 */}
        <input
          type="number"
          placeholder="출생 연도 (예: 2001)"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
        />

        {/* 가입 버튼 */}
        <button onClick={handleSignup}>가입하기</button>
      </div>
    </div>
  );
}

export default Signup;
