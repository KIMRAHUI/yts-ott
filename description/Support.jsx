//  고객지원 페이지 (검색 + FAQ + 문의 카드)
import { useState } from 'react';
import '../styles/Support.css'; //  스타일 분리

function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: '구독 후 언제부터 이용 가능한가요?', answer: '결제 완료 후 즉시 이용 가능합니다.' },
    { question: '결제 수단은 무엇이 있나요?', answer: '신용카드, 카카오페이, 계좌이체 등이 가능합니다.' },
    { question: '영상 화질이 낮게 나와요.', answer: '설정에서 화질 수동 조절이 가능합니다.' },
    { question: '시청 중 끊김이 있어요.', answer: '인터넷 연결 상태를 점검해주세요.' },
   {
  question: '결제 수단을 변경하고 싶어요.',
  answer: '마이페이지 > 멤버십 탭에서 카드나 계좌 정보를 수정하실 수 있어요.'
},
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="support-container">
      <h1 className="support-title">📞 고객지원</h1>

      {/* 🔍 검색창 */}
      <div className="support-search-box">
        <input
          type="text"
          placeholder="궁금한 내용을 입력하세요 (예: 구독, 결제)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="support-input"
        />
        <button className="support-button">검색</button>
      </div>

      {/* 📋 FAQ 리스트 */}
      <div className="faq-list">
        {filteredFaqs.map((faq, index) => (
          <div key={index} className="faq-box">
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.question}
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {/*  문의 카드 (FAQ 아래로 이동) */}
      <div className="support-card">
        <h3>📩 문의 이메일: support@ytsott.com</h3>
        <p>📞 대표전화: 1600-0000</p>
        <p>🕒 상담 가능 시간: 평일 오전 10시 ~ 오후 5시</p>
        <p>🏢 주소: 서울특별시 강남구 테헤란로 123, YTS빌딩</p>
      </div>
    </div>
  );
}

export default Support;
