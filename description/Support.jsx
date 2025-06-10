// 📞 고객지원 페이지 - FAQ 검색 및 기본 문의 정보 제공
import { useState } from 'react';
import '../styles/Support.css'; // 🔧 스타일 분리하여 적용

function Support() {
  // 🔍 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');
  // 🔼 열려있는 FAQ 인덱스
  const [activeIndex, setActiveIndex] = useState(null);

  // 📋 자주 묻는 질문 목록
  const faqs = [
    { question: '구독 후 언제부터 이용 가능한가요?', answer: '결제 완료 후 즉시 이용 가능합니다.' },
    { question: '결제 수단은 무엇이 있나요?', answer: '신용카드, 카카오페이, 계좌이체 등이 가능합니다.' },
    { question: '영상 화질이 낮게 나와요.', answer: '설정에서 화질 수동 조절이 가능합니다.' },
    { question: '시청 중 끊김이 있어요.', answer: '인터넷 연결 상태를 점검해주세요.' },
    { question: '구독을 취소하고 싶어요.', answer: '마이페이지 → 멤버십 정보에서 해지 가능합니다.' },
  ];

  // 🔍 검색어에 따른 FAQ 필터링
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔄 FAQ 열고 닫기 토글
  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="support-container">
      <h1 className="support-title">📞 고객지원</h1>

      {/* 🔍 실시간 FAQ 검색창 */}
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

      {/* 📋 필터링된 FAQ 목록 */}
      <div className="faq-list">
        {filteredFaqs.map((faq, index) => (
          <div key={index} className="faq-box">
            {/* ❓ 질문 클릭 시 토글 */}
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.question}
            </div>
            {/* ✅ 클릭된 질문에 대한 답변 표시 */}
            {activeIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {/* 💌 문의 및 고객센터 정보 카드 */}
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
