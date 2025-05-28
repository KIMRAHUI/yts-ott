# FilmDreams - YTS 기반 영화 플랫폼

YTS API를 기반으로 제작된 영화 탐색 웹 애플리케이션입니다. Explore 및 Home 페이지에서 영화 줄거리 미리보기 기능을 공통 적용하여 사용자 경험을 강화했습니다.

## 주요 기능

### Explore 페이지
- 장르 필터링, 정렬, 키워드 검색 기능 제공
- 실시간 YTS API 연동
- 영화 포스터에 마우스를 올리면 줄거리 요약 미리보기 표시
- 클릭 시 상세 페이지로 이동
- 페이지네이션 기능 포함

### Home 페이지
- Action, Comedy, Animation 등 주요 장르별 추천 슬라이더
- 장르별 키워드 검색 가능
- Explore와 동일한 줄거리 미리보기 오버레이 적용

### 공통 UI/UX
- `.movie-hover` 스타일을 기반으로 카드 내에서 요약 미리보기 제공
- 모달 없이 자연스럽고 직관적인 사용자 경험 구현
- CSS 중복 없이 공통 스타일 재사용

## 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| 프론트엔드 | React, React Router, Vite, Axios |
| 스타일링 | CSS3, Slick Carousel |
| 외부 API | YTS.mx API |

## 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/KIMRAHUI/yts-ott.git
cd yts-ott

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
