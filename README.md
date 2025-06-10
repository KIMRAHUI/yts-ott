# 🎬 YTS 영화 플랫폼 (Frontend)

YTS API 기반 영화 탐색 및 리뷰 플랫폼입니다.  
회원가입, 찜, 시청기록, 댓글 및 통계 기능 등을 포함한 사용자 중심의 OTT 클론 프로젝트입니다.

## 📌 개요

- YTS API를 활용한 실시간 영화 정보 검색 및 탐색
- 사용자 리뷰 기반 별점 시스템과 통계 시각화
- Supabase + Express 연동으로 로그인/회원가입 및 댓글 기능 구현
- localStorage를 활용한 찜/시청기록/검색어 유지
- 반응형 디자인 적용 (PC/모바일)

---

## 🛠 기술스택

### Frontend
- React (Vite)
- React Router
- Axios
- Chart.js (react-chartjs-2)
- CSS 모듈 분리 및 반응형 스타일링

### Backend (연동용)
- Express.js
- Supabase (PostgreSQL)
- JWT 기반 로그인 상태 관리

---

## ✨ 주요 기능

| 기능 구분           | 설명 |
|--------------------|------|
| 🔍 영화 검색/탐색       | YTS API 기반 최신/장르별 영화 리스트 탐색 |
| ❤️ 찜 기능              | 영화 상세에서 찜하면 localStorage에 저장 및 마이페이지 연동 |
| 📽 시청 기록 관리       | 상세페이지 접속 시 기록 자동 저장 (최신순 정렬) |
| 💬 리뷰 작성/수정/삭제 | 로그인 시 댓글 작성 가능 (Supabase 저장) |
| 📊 통계 시각화         | 성별/연령 기반 리뷰 통계 (Chart.js 활용) |
| 🧑 마이페이지          | 찜 목록, 시청기록, 회원 정보, 멤버십 결제 정보 확인 가능 |
| 💳 멤버십 구독         | 결제 방식 선택 및 인증번호 → 구독 정보 저장 |
| 🙋 고객센터            | 실시간 FAQ 검색 + 대표 문의 정보 제공 |

---

## 📁 프로젝트 구조
```
yts-frontend/
│
├── public/
│ └── index.html
│
├── src/
│ ├── assets/ # 이미지 및 공용 리소스
│ ├── components/ # 재사용 컴포넌트 (Chart, Card 등)
│ ├── pages/ # 주요 페이지 (Home, Explore, MyPage 등)
│ ├── styles/ # CSS 파일 분리 관리
│ ├── data/ # 통계용 JSON 데이터 파일
│ └── App.jsx # 라우터 설정
│
├── .env # API 주소 설정
├── package.json
└── README.md
```
