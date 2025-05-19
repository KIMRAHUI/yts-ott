import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/MyPage.css';

function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [username] = useState(localStorage.getItem('username') || '');
  const [profile, setProfile] = useState({ password: '', email: '' });
  const [profileSaved, setProfileSaved] = useState(false);
  const [birth, setBirth] = useState('');
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('paymentInfo');
    return saved ? [JSON.parse(saved)] : [{ type: 'card', bank: '', info: '', date: '' }];
  });

  const [membership, setMembership] = useState(localStorage.getItem('membership') || 'Basic');
  const [wishlist, setWishlist] = useState([{ title: '존 윅 4', id: 36334, date: '2025.05.10' }]);
  const [history, setHistory] = useState([{ title: '매트릭스', id: 108, date: '2025.05.09' }]);
  const [sortOrder, setSortOrder] = useState('latest');
  const [request, setRequest] = useState({ title: '', content: '' });
  const [authMethod, setAuthMethod] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [wishlistPosters, setWishlistPosters] = useState({});
  const [historyPosters, setHistoryPosters] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('confirm') === '1') setShowConfirmation(true);
  }, [location]);

  useEffect(() => {
    const storedBirth = localStorage.getItem('birth');
    if (storedBirth) setBirth(storedBirth);
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
  }, []);

  const tabs = [
    { id: 'profile', label: '프로필', icon: '👤' },
    { id: 'payment', label: '결제수단', icon: '💳' },
    { id: 'membership', label: '멤버십', icon: '🎟' },
    { id: 'wishlist', label: '찜목록', icon: '❤️' },
    { id: 'history', label: '시청기록', icon: '📺' },
    { id: 'request', label: '요청하기', icon: '📩' }
  ];

  const formatCardOrAccount = (value, type) => {
    const onlyNums = value.replace(/\D/g, '');
    if (type === 'card') {
      return onlyNums.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1-');
    } else {
      return onlyNums;
    }
  };

  const handleSendCode = () => {
    if (!authMethod || !payments[0].info) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setAuthCode(code);
    alert(`인증번호 전송: ${code}`);
  };

  const verifyCode = () => {
    if (userInputCode === authCode) {
      setVerified(true);
      alert('✅ 인증이 완료되었습니다.');
    } else {
      alert('❌ 인증번호가 일치하지 않습니다.');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  const renderContent = () => {
    if (showConfirmation) {
      return (
        <div className="mypage-section">
          <h2>✅ 결제가 완료되었습니다</h2>
          <p>가입해주셔서 감사합니다.</p>
          <p><strong>{membership}</strong> 멤버십을 즐겨보세요.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <div className="mypage-section">
            <h3>프로필</h3>
            {!profileSaved ? (
              <>
                <p>아이디: {username}</p>
                <input
                  className="mypage-input"
                  placeholder="비밀번호"
                  type="password"
                  value={profile.password}
                  onChange={e => setProfile({ ...profile, password: e.target.value })}
                />
                <input
                  className="mypage-input"
                  placeholder="이메일"
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                />
                <button className="mypage-button" onClick={() => setProfileSaved(true)}>저장</button>
              </>
            ) : (
              <div className="profile-box">
                <p><strong>아이디:</strong> {username}</p>
                <p><strong>이메일:</strong> {profile.email}</p>
                <p><strong>멤버십:</strong> {membership}</p>
                <p><strong>결제일:</strong> {payments[0].date || '입력 안 됨'}</p>
                <p>
                  <strong>결제수단:</strong>{' '}
                  {payments[0].type === 'card' ? '카드' : '계좌'}
                  {payments[0].bank ? ` (${payments[0].bank})` : ' (선택 안 됨)'}
                </p>
                <p><strong>출생연도:</strong> {birth || '미입력'}</p>
                <button className="mypage-button" onClick={() => setProfileSaved(false)}>수정</button>
              </div>

            )}
          </div>
        );


      case 'payment':
        return (
          <div className="mypage-section">
            <h3>결제수단 인증</h3>
            <div className="payment-section">
              <label>인증 방식 선택</label>
              <select className="mypage-input" value={authMethod} onChange={e => setAuthMethod(e.target.value)}>
                <option value="">선택</option>
                <option value="card">카드</option>
                <option value="account">계좌</option>
                <option value="phone">전화</option>
              </select>

              {authMethod && (
                <>
                  <select
                    className="mypage-input"
                    value={payments[0].bank}
                    onChange={(e) => setPayments([{ ...payments[0], bank: e.target.value }])}
                  >
                    <option value="">
                      {payments[0].type === 'card' ? '카드사 선택' : '은행 선택'}
                    </option>
                    {(payments[0].type === 'card'
                      ? ['신한', '롯데', '국민', '삼성', '현대', '카카오']
                      : ['신한', '우리', '국민', '카카오', 'IMG']
                    ).map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>

                  <input
                    className="mypage-input"
                    placeholder={authMethod === 'card' ? '카드 번호' : '계좌 번호'}
                    value={payments[0].info}
                    onChange={e => setPayments([{ ...payments[0], info: formatCardOrAccount(e.target.value, authMethod) }])}
                  />
                  {!verified && (
                    <button className="mypage-button" onClick={handleSendCode}>인증번호 전송</button>
                  )}
                  {authCode && !verified && (
                    <>
                      <input className="mypage-input" placeholder="인증번호 입력" value={userInputCode} onChange={e => setUserInputCode(e.target.value)} />
                      <button className="mypage-button" onClick={verifyCode}>확인</button>
                    </>
                  )}
                  {verified && (
                    <>
                      <input className="mypage-input" placeholder="결제일 (숫자)" value={payments[0].date} onChange={e => setPayments([{ ...payments[0], date: e.target.value }])} />
                      <input className="mypage-input" placeholder="영수증 이메일" value={receiptEmail} onChange={e => setReceiptEmail(e.target.value)} />
                      <button
                        className="mypage-button"
                        onClick={() => {
                          localStorage.setItem('paymentInfo', JSON.stringify(payments[0])); 
                          setShowConfirmation(true);
                        }}
                      >
                        결제 완료
                      </button>

                    </>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'membership':
        return (
          <div className="mypage-section">
            <h3>멤버십 종류</h3>
            <div className="card-row membership-row">
              {['Basic', 'Standard', 'Premium'].map(type => (
                <div
                  key={type}
                  className={`membership-card ${membership === type ? 'selected' : ''}`}
                  onClick={() => setMembership(type)}
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
        );


      case 'wishlist':
        return (
          <div className="mypage-section">
            <h3>찜목록</h3>
            {wishlist.map((item, idx) => (
              <div key={idx} className="mypage-card">
                <img src={wishlistPosters[item.id]} alt={item.title} onClick={() => navigate(`/movie/${item.id}`)} />
                <div className="mypage-card-info">
                  <p>{item.title}</p>
                  <p className="small-text">{item.date}</p>
                </div>
                <button className="mypage-button danger" onClick={() => {
                  const updated = [...wishlist]; updated.splice(idx, 1); setWishlist(updated);
                }}>삭제</button>
              </div>
            ))}
          </div>
        );

      case 'history':
        const sorted = [...history].sort((a, b) => sortOrder === 'latest' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));
        return (
          <div className="mypage-section">
            <h3>시청기록</h3>
            <button className="mypage-button" onClick={toggleSortOrder}>{sortOrder === 'latest' ? '과거순 보기' : '최신순 보기'}</button>
            {sorted.map((item, idx) => (
              <div key={idx} className="mypage-card">
                <img src={historyPosters[item.id]} alt={item.title} onClick={() => navigate(`/movie/${item.id}`)} />
                <div className="mypage-card-info">
                  <p>{item.title}</p>
                  <p className="small-text">{item.date}</p>
                </div>
                <button className="mypage-button danger" onClick={() => {
                  const updated = [...history]; updated.splice(idx, 1); setHistory(updated);
                }}>삭제</button>
              </div>
            ))}
          </div>
        );

      case 'request':
        return (
          <div className="mypage-section">
            <h3>요청하기</h3>
            <input className="mypage-input" placeholder="제목" value={request.title} onChange={e => setRequest({ ...request, title: e.target.value })} />
            <textarea className="mypage-textarea" placeholder="내용" value={request.content} onChange={e => setRequest({ ...request, content: e.target.value })} />
            <button className="mypage-button" onClick={() => alert('요청이 전달되었습니다!')}>요청하기</button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>
      <div className="mypage-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => { setShowConfirmation(false); setActiveTab(tab.id); }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
}

export default MyPage;
