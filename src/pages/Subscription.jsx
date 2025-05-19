import { useState } from 'react';
import '../styles/Subscription.css';

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [authMethod, setAuthMethod] = useState('');
  const [authValue, setAuthValue] = useState('');
  const [authSent, setAuthSent] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isAuthConfirmed, setIsAuthConfirmed] = useState(false);
  const [cardBank, setCardBank] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentDay, setPaymentDay] = useState('');
  const [receiptEmail, setReceiptEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1-').replace(/-$/, '');
  };

  const formatAccountNumber = (value) => {
    const clean = value.replace(/\D/g, '');
    return clean.replace(/(\d{3})(\d{3})(\d{0,6})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join('-')
    );
  };

  const handleSendAuth = () => {
    if (!authValue) return alert('인증 대상을 입력해주세요.');
    setAuthSent(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setAuthCode(code);
    alert(`인증번호가 전송되었습니다: ${code}`);
  };

  const handleConfirmCode = () => {
    if (enteredCode === authCode) {
      setIsAuthConfirmed(true);
      alert('인증이 완료되었습니다.');
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const handleSubmit = () => {
    if (
      selectedPlan &&
      isAuthConfirmed &&
      authMethod &&
      authValue &&
      paymentType &&
      cardBank &&
      paymentDay &&
      receiptEmail
    ) {
      // 결제 정보 저장
      localStorage.setItem('membership', selectedPlan);
      localStorage.setItem('paymentInfo', JSON.stringify({
        type: paymentType,
        bank: cardBank,
        date: paymentDay
      }));
      setIsSubmitted(true);
    } else {
      alert('모든 항목을 입력해주세요.');
    }
  };

  return (
    <div className="subscription-container">
      {!isSubmitted ? (
        <>
          <h1 className="subscription-title">멤버십 구독</h1>

          <div className="plan-list card-row">
            {['Basic', 'Standard', 'Premium'].map((plan) => (
              <div
                key={plan}
                className={`plan-card ${selectedPlan === plan ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                <h3>{plan}</h3>
                <p>{plan} 멤버십에 대한 설명입니다.</p>
                <p className="price">
                  {plan === 'Basic' ? '₩9,900' : plan === 'Standard' ? '₩13,900' : '₩17,900'}
                </p>
              </div>
            ))}
          </div>

          <div className="auth-section">
            <label>인증 방법 선택</label>
            <select value={authMethod} onChange={(e) => setAuthMethod(e.target.value)}>
              <option value="">선택</option>
              <option value="card">카드</option>
              <option value="account">계좌</option>
              <option value="phone">전화번호</option>
            </select>

            {authMethod && (
              <>
                {['card', 'account'].includes(authMethod) && (
                  <select value={cardBank} onChange={(e) => setCardBank(e.target.value)}>
                    <option value="">{authMethod === 'card' ? '카드사 선택' : '은행 선택'}</option>
                    {(authMethod === 'card'
                      ? ['신한', '롯데', '국민', '삼성', '현대', '카카오']
                      : ['신한', '우리', '국민', '카카오', 'IMG']
                    ).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                )}

                <input
                  type="text"
                  placeholder={
                    authMethod === 'card'
                      ? '카드 번호 입력'
                      : authMethod === 'account'
                        ? '계좌 번호 입력'
                        : '전화번호 입력'
                  }
                  value={authValue}
                  onChange={(e) =>
                    setAuthValue(
                      authMethod === 'card'
                        ? formatCardNumber(e.target.value)
                        : authMethod === 'account'
                          ? formatAccountNumber(e.target.value)
                          : e.target.value
                    )
                  }
                />
              </>
            )}

            {!isAuthConfirmed && authValue && !authSent && (
              <button className="send-auth-button" onClick={handleSendAuth}>
                인증번호 전송
              </button>
            )}

            {authSent && !isAuthConfirmed && (
              <>
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                />
                <button className="confirm-auth-button" onClick={handleConfirmCode}>
                  인증번호 확인
                </button>
                <button className="send-auth-button" onClick={handleSendAuth}>
                  인증번호 재전송
                </button>
              </>
            )}
          </div>

          <div className="payment-info">
            <label>결제 수단 선택</label>
            <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option value="">선택</option>
              <option value="card">카드</option>
              <option value="account">계좌</option>
            </select>

            {paymentType && (
              <>
                <select value={cardBank} onChange={(e) => setCardBank(e.target.value)}>
                  <option value="">{paymentType === 'card' ? '카드사 선택' : '은행 선택'}</option>
                  {(paymentType === 'card'
                    ? ['신한', '롯데', '현대', '삼성']
                    : ['국민', '농협', '신한', '우리', '카카오']
                  ).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder={paymentType === 'card' ? '카드 번호 입력' : '계좌 번호 입력'}
                  value={authValue}
                  onChange={(e) =>
                    setAuthValue(
                      paymentType === 'card'
                        ? formatCardNumber(e.target.value)
                        : formatAccountNumber(e.target.value)
                    )
                  }
                />
              </>
            )}

            <label>결제일 입력</label>
            <input
              type="text"
              placeholder="예: 25일"
              value={paymentDay}
              onChange={(e) => setPaymentDay(e.target.value)}
            />

            <label>영수증 이메일</label>
            <input
              type="email"
              placeholder="example@example.com"
              value={receiptEmail}
              onChange={(e) => setReceiptEmail(e.target.value)}
            />
          </div>

          <button className="submit-button" onClick={handleSubmit}>
            결제하기
          </button>
        </>
      ) : (
        <div className="confirmation-box">
          <h2>✅ 감사합니다.</h2>
          <p>📅 결제가 완료되었습니다.</p>
          <p>🎉 {selectedPlan}의 경험을 시작해보세요!</p>
          <p>결제일: {paymentDay}</p>
        </div>
      )}
    </div>
  );
}

export default Subscription;
