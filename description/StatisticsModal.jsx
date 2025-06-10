// ✅ 영화 통계 모달 컴포넌트
import { useEffect, useState } from 'react';
import './StatisticsModal.css';

// Chart.js의 개별 차트 컴포넌트 가져오기
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Chart.js에서 사용할 요소 등록
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement
} from 'chart.js';

// ✅ 차트에서 사용할 요소들 등록 (필수)
ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

// ✅ StatisticsModal 컴포넌트 정의
function StatisticsModal({ onClose }) {
  const [mode, setMode] = useState('genre'); // 현재 선택된 통계 모드
  const [genreStats, setGenreStats] = useState([]); // 찜 기반 장르 통계
  const [actorStats, setActorStats] = useState([]); // 배우 인기 통계
  const [ratingDist, setRatingDist] = useState([]); // 평점 분포
  const [avgRatings, setAvgRatings] = useState([]); // 평균 평점: 장르별 + 연도별

  // ✅ 초기 데이터 fetch - 통계용 JSON + YTS API
  useEffect(() => {
    // 1) 로컬 JSON에서 찜 기반 통계 불러오기
    fetch('/data/genreStats.json')
      .then(res => res.json())
      .then(data => {
        setGenreStats(data.genre_stats);           // 장르 선호
        setActorStats(data.actor_popularity);      // 인기 배우
      });

    // 2) YTS API에서 최근 50개 영화 데이터로 통계 생성
    fetch('https://yts.mx/api/v2/list_movies.json?limit=50')
      .then(res => res.json())
      .then(data => {
        const movies = data.data.movies || [];

        const genreMap = {};       // {장르: {총점, 개수}} 형태
        const ratingBuckets = { '9+': 0, '8+': 0, '7+': 0, '6+': 0, '<6': 0 };
        const yearMap = {};        // {연도: {총점, 개수}}

        movies.forEach(movie => {
          // ✅ 장르별 평균 평점 계산용
          movie.genres?.forEach(genre => {
            if (!genreMap[genre]) genreMap[genre] = { total: 0, count: 0 };
            genreMap[genre].total += movie.rating;
            genreMap[genre].count++;
          });

          // ✅ 평점 분포 계산
          if (movie.rating >= 9) ratingBuckets['9+']++;
          else if (movie.rating >= 8) ratingBuckets['8+']++;
          else if (movie.rating >= 7) ratingBuckets['7+']++;
          else if (movie.rating >= 6) ratingBuckets['6+']++;
          else ratingBuckets['<6']++;

          // ✅ 연도별 평균 평점 계산용
          const year = movie.year;
          if (!yearMap[year]) yearMap[year] = { total: 0, count: 0 };
          yearMap[year].total += movie.rating;
          yearMap[year].count++;
        });

        // ✅ 장르별 평균 평점
        const avgByGenre = Object.entries(genreMap).map(([genre, val]) => ({
          genre,
          avg_rating: (val.total / val.count).toFixed(2)
        }));

        // ✅ 평점 분포 데이터
        const dist = Object.entries(ratingBuckets).map(([range, count]) => ({
          range,
          count
        }));

        // ✅ 연도별 평균 평점 (오름차순 정렬)
        const avgByYear = Object.entries(yearMap).map(([year, val]) => ({
          year,
          avg_rating: (val.total / val.count).toFixed(2)
        })).sort((a, b) => a.year - b.year);

        // 상태 저장
        setAvgRatings({ genre: avgByGenre, year: avgByYear });
        setRatingDist(dist);
      });
  }, []);

  // ✅ 공통 차트 옵션
  const options = {
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } },
    },
    scales: {
      x: { ticks: { color: 'white' } },
      y: { ticks: { color: 'white' } },
    },
    responsive: true
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>영화 통계 보기</h2>

        {/* ✅ 통계 종류 토글 버튼 */}
        <div className="stats-toggle">
          <button onClick={() => setMode('genre')}>장르 선호</button>
          <button onClick={() => setMode('actor')}>인기 배우</button>
          <button onClick={() => setMode('avg')}>장르별 평균 평점</button>
          <button onClick={() => setMode('dist')}>평점 분포</button>
          <button onClick={() => setMode('year')}>연도별 평균</button>
        </div>

        {/* ✅ 장르 선호도 (좋아요/싫어요) */}
        {mode === 'genre' && (
          <Bar
            data={{
              labels: genreStats.map(s => s.genre),
              datasets: [
                {
                  label: '좋아요',
                  data: genreStats.map(s => s.like),
                  backgroundColor: 'rgba(0, 123, 255, 0.7)'
                },
                {
                  label: '싫어요',
                  data: genreStats.map(s => s.dislike),
                  backgroundColor: 'rgba(220, 53, 69, 0.7)'
                }
              ]
            }}
            options={options}
          />
        )}

        {/* ✅ 인기 배우 (출연 횟수 기준) */}
        {mode === 'actor' && (
          <Bar
            data={{
              labels: actorStats.map(a => a.actor),
              datasets: [
                {
                  label: '출연 횟수',
                  data: actorStats.map(a => a.count),
                  backgroundColor: 'rgba(255, 206, 86, 0.7)'
                }
              ]
            }}
            options={options}
          />
        )}

        {/* ✅ 장르별 평균 평점 */}
        {mode === 'avg' && (
          <Bar
            data={{
              labels: avgRatings.genre.map(d => d.genre),
              datasets: [
                {
                  label: '장르별 평균 평점',
                  data: avgRatings.genre.map(d => d.avg_rating),
                  backgroundColor: 'rgba(40, 167, 69, 0.7)'
                }
              ]
            }}
            options={options}
          />
        )}

        {/* ✅ 평점 분포 도넛 차트 */}
        {mode === 'dist' && (
          <div className="chart-container">
            <Doughnut
              data={{
                labels: ratingDist.map(d => d.range),
                datasets: [
                  {
                    label: '영화 수',
                    data: ratingDist.map(d => d.count),
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#66bb6a', '#aaa']
                  }
                ]
              }}
            />
          </div>
        )}

        {/* ✅ 연도별 평균 평점 (선형 차트) */}
        {mode === 'year' && (
          <Line
            data={{
              labels: avgRatings.year.map(d => d.year),
              datasets: [
                {
                  label: '연도별 평균 평점',
                  data: avgRatings.year.map(d => d.avg_rating),
                  fill: false,
                  borderColor: 'rgba(153, 102, 255, 0.8)',
                  tension: 0.2
                }
              ]
            }}
            options={options}
          />
        )}

        {/* ✅ 모달 닫기 버튼 */}
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default StatisticsModal;
