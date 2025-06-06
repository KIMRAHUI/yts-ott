import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MyPage.css';

function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [username] = useState(localStorage.getItem('username') || '');
  const [birth, setBirth] = useState('');
  const [membership, setMembership] = useState('');
  const [payments, setPayments] = useState([{ type: '', bank: '', info: '', date: '' }]);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [profile, setProfile] = useState({ email: '' });
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('yts_favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [history, setHistory] = useState([]);
  const [wishlistPosters, setWishlistPosters] = useState({});
  const [historyPosters, setHistoryPosters] = useState({});
  const [sortOrder, setSortOrder] = useState('latest');
  const [request, setRequest] = useState({ title: '', content: '' });
  const [authCode, setAuthCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // 서버에서 유저 정보 받아오기
  useEffect(() => {
    const uuid = localStorage.getItem('uuid') || localStorage.getItem('user_id');
    if (!uuid) return;
    axios.get(`/api/auth/user/${uuid}`).then(res => {
      const user = res.data;
      setMembership(user.membership);
      setPayments([{
        type: user.payment_type,
        bank: user.payment_bank,
        info: user.payment_info,
        date: user.payment_date
      }]);
      setReceiptEmail(user.receipt_email || '');
      setProfile(prev => ({
        ...prev,
        email: user.recovery_email || ''
      }));
    });
  }, []);

  useEffect(() => {
    const storedBirth = localStorage.getItem('birth');
    if (storedBirth) setBirth(storedBirth);
    const stored = localStorage.getItem('yts_history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    wishlist.forEach(({ id }) => {
      axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then(res => setWishlistPosters(prev => ({ ...prev, [id]: res.data.data.movie.medium_cover_image })));
    });
    history.forEach(({ id }) => {
      axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then(res => setHistoryPosters(prev => ({ ...prev, [id]: res.data.data.movie.medium_cover_image })));
    });
  }, [wishlist, history]);

  const formatCardOrAccount = (value, type) => {
    const onlyNums = value.replace(/\D/g, '');
    return type === 'card' ? onlyNums.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1-') : onlyNums;
  };

  // 인증번호 전송 (변경된 부분)
  const handleSendCode = () => {
    if (!receiptEmail) return alert('이메일을 입력해주세요.');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setAuthCode(code);
    alert(`인증번호가 이메일로 전송되었습니다: ${code}`);
    console.log('[개발용] 인증번호가 이메일로 전송되었습니다. (번호는 보안상 표시하지 않음)');
  };

  // 인증번호 확인
  const verifyCode = async () => {
    if (userInputCode === authCode) {
      setVerified(true);
      alert('✅ 인증이 완료되었습니다.');

      // 인증 성공 시 자동으로 결제 완료 처리 호출
      await saveToDB();
    } else {
      alert('❌ 인증번호가 일치하지 않습니다.');
    }
  };



  // DB 저장 + 결제 완료 처리
  const saveToDB = async () => {
    const uuid = localStorage.getItem('uuid') || localStorage.getItem('user_id');
    if (!uuid) return alert('로그인이 필요합니다.');
    try {
      await axios.patch('/api/auth/update-payment', {
        id: uuid,
        membership,
        payment_type: payments[0].type,
        payment_bank: payments[0].bank,
        payment_info: payments[0].info,
        payment_date: payments[0].date,
        receipt_email: receiptEmail
      });
      localStorage.setItem('membership', membership);
      localStorage.setItem('paymentInfo', JSON.stringify(payments[0]));
      localStorage.setItem('receiptEmail', receiptEmail);

      setPaymentComplete(true);  // 결제 완료 화면 표시
      setShowConfirmation(false); // 기존 확인 메시지 숨김
      setActiveTab('');           // 탭 초기화
    } catch (err) {
      console.error('❌ 저장 실패:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>
      <div className="mypage-tabs">
        {['profile', 'payment', 'membership', 'wishlist', 'history', 'request'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => {
              setShowConfirmation(false);
              setActiveTab(tab);
              setVerified(false);
              setAuthCode('');
              setUserInputCode('');
              setPaymentComplete(false);
            }}
          >
            {tab === 'profile' && '👤 프로필'}
            {tab === 'payment' && '💳 결제수단'}
            {tab === 'membership' && '🎟 멤버십'}
            {tab === 'wishlist' && '❤️ 찜목록'}
            {tab === 'history' && '📺 시청기록'}
            {tab === 'request' && '📩 요청하기'}
          </button>
        ))}
      </div>

      {paymentComplete ? (
        <div className="mypage-section confirmation-box">
          <h2>✅ 감사합니다.</h2>
          <p>📅 결제가 완료되었습니다.</p>
          <p>🎉 <strong>{membership}</strong> 경험을 시작해보세요!</p>
          <button
            className="mypage-button"
            onClick={() => {
              setPaymentComplete(false);
              setActiveTab('profile');
            }}
          >
            홈으로
          </button>
        </div>
      ) : (
        <>
          {showConfirmation && (
            <div className="mypage-section">
              <h2>✅ 결제가 완료되었습니다</h2>
              <p>가입해주셔서 감사합니다.</p>
              <p><strong>{membership}</strong> 멤버십을 즐겨보세요.</p>
            </div>
          )}

          {!showConfirmation && activeTab === 'profile' && (
            <div className="mypage-section profile-box">  {/* 여기 profile-box 추가 */}
              <h3>프로필</h3>
              <p><strong>아이디:</strong> {username}</p>
              <p><strong>이메일:</strong> {profile.email}</p>
              <p><strong>멤버십:</strong> {membership}</p>
              <p><strong>결제일:</strong> {payments[0].date}</p>
              <p><strong>결제수단:</strong> {payments[0].type} ({payments[0].bank})</p>
              <p><strong>출생연도:</strong> {birth || '미입력'}</p>
            </div>
          )}


          {!showConfirmation && activeTab === 'payment' && (
            <div className="mypage-section">
              <h3>결제수단 인증</h3>

              <label>결제 방식</label>
              <select
                className="mypage-input"
                value={payments[0].type}
                onChange={e => setPayments([{ ...payments[0], type: e.target.value }])}
              >
                <option value="">선택</option>
                <option value="card">카드</option>
                <option value="account">계좌</option>
              </select>

              <label>은행/카드사</label>
              <input
                className="mypage-input"
                value={payments[0].bank}
                onChange={e => setPayments([{ ...payments[0], bank: e.target.value }])}
                placeholder="신한, 국민, 카카오 등"
              />

              <label>정보 입력</label>
              <input
                className="mypage-input"
                value={payments[0].info}
                onChange={e =>
                  setPayments([{ ...payments[0], info: formatCardOrAccount(e.target.value, payments[0].type) }])
                }
                placeholder="카드/계좌 번호 입력"
              />

              {!verified && (
                <>
                  <button className="mypage-button" onClick={handleSendCode}>인증번호 전송</button>
                  {authCode && (
                    <>
                      <input
                        className="mypage-input"
                        placeholder="인증번호 입력"
                        value={userInputCode}
                        onChange={e => setUserInputCode(e.target.value)}
                      />
                      <button className="mypage-button" onClick={verifyCode}>인증번호 확인</button>
                    </>
                  )}
                </>
              )}

              {verified && (
                <>
                  <input
                    className="mypage-input"
                    placeholder="결제일 (예: 25일)"
                    value={payments[0].date}
                    onChange={e => setPayments([{ ...payments[0], date: e.target.value }])}
                  />
                  <input
                    className="mypage-input"
                    placeholder="영수증 이메일"
                    value={receiptEmail}
                    onChange={e => setReceiptEmail(e.target.value)}
                  />
                  <button className="mypage-button" onClick={saveToDB}>결제 완료</button>
                </>
              )}
            </div>
          )}

          {!showConfirmation && activeTab === 'membership' && (
            <div className="mypage-section">
              <h3>멤버십 종류</h3>
              <div className="card-row membership-row">
                {['Basic', 'Standard', 'Premium'].map(type => (
                  <div
                    key={type}
                    className={`membership-card ${membership === type ? 'selected' : ''}`}
                    onClick={() => {
                      setMembership(type);
                      setActiveTab('payment');
                      setVerified(false);
                      setAuthCode('');
                      setUserInputCode('');
                    }}
                  >
                    <h4>{type}</h4>
                    <p>{type} 멤버십에 대한 설명입니다.</p>
                    <p>
                      <strong>
                        {type === 'Basic'
                          ? '₩9,900'
                          : type === 'Standard'
                            ? '₩13,900'
                            : '₩17,900'}
                      </strong>
                    </p>
                    <button
                      className="mypage-button"
                      onClick={() => setActiveTab('payment')}
                    >
                      결제하기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showConfirmation && activeTab === 'wishlist' && (
            <div className="mypage-section">
              <h3>찜목록</h3>
              {wishlist.map((item, idx) => (
                <div key={idx} className="mypage-card">
                  <img
                    src={wishlistPosters[item.id]}
                    alt={item.title}
                    onClick={() => navigate(`/movie/${item.id}`)}
                  />
                  <div className="mypage-card-info">
                    <p>{item.title}</p>
                    <p className="small-text">{item.date}</p>
                    <button
                      className="mypage-button danger"
                      onClick={() => {
                        const updated = [...wishlist];
                        updated.splice(idx, 1);
                        setWishlist(updated);
                        localStorage.setItem('yts_favorites', JSON.stringify(updated));
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showConfirmation && activeTab === 'history' && (
            <div className="mypage-section">
              <h3>시청기록</h3>
              <button className="mypage-button" onClick={toggleSortOrder}>
                {sortOrder === 'latest' ? '과거순 보기' : '최신순 보기'}
              </button>
              {[...history]
                .sort((a, b) =>
                  sortOrder === 'latest'
                    ? new Date(b.date) - new Date(a.date)
                    : new Date(a.date) - new Date(b.date)
                )
                .map((item, idx) => (
                  <div key={idx} className="mypage-card">
                    <img
                      src={historyPosters[item.id]}
                      alt={item.title}
                      onClick={() => navigate(`/movie/${item.id}`)}
                    />
                    <div className="mypage-card-info">
                      <p>{item.title}</p>
                      <p className="small-text">{item.date}</p>
                    </div>
                    <button
                      className="mypage-button danger"
                      onClick={() => {
                        const updated = [...history];
                        updated.splice(idx, 1);
                        setHistory(updated);
                        localStorage.setItem('yts_history', JSON.stringify(updated));
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ))}
            </div>
          )}

          {!showConfirmation && activeTab === 'request' && (
            <div className="mypage-section">
              <h3>요청하기</h3>
              <input
                className="mypage-input"
                placeholder="제목"
                value={request.title}
                onChange={e => setRequest({ ...request, title: e.target.value })}
              />
              <textarea
                className="mypage-textarea"
                placeholder="내용"
                value={request.content}
                onChange={e => setRequest({ ...request, content: e.target.value })}
              />
              <button className="mypage-button" onClick={() => alert('요청이 전달되었습니다!')}>
                요청하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyPage;
