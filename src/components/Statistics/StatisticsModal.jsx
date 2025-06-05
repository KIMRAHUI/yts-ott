// StatisticsModal.jsx
import { useEffect, useState } from 'react';
import './StatisticsModal.css';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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

function StatisticsModal({ onClose }) {
  const [mode, setMode] = useState('genre');
  const [genreStats, setGenreStats] = useState([]);
  const [actorStats, setActorStats] = useState([]);
  const [ratingDist, setRatingDist] = useState([]);
  const [avgRatings, setAvgRatings] = useState([]);

  useEffect(() => {
    fetch('/data/genreStats.json')
      .then(res => res.json())
      .then(data => {
        setGenreStats(data.genre_stats);
        setActorStats(data.actor_popularity);
      });

    fetch('https://yts.mx/api/v2/list_movies.json?limit=50')
      .then(res => res.json())
      .then(data => {
        const movies = data.data.movies || [];

        const genreMap = {};
        const ratingBuckets = { '9+': 0, '8+': 0, '7+': 0, '6+': 0, '<6': 0 };
        const yearMap = {};

        movies.forEach(movie => {
          // 장르별 평균 평점 계산
          movie.genres?.forEach(genre => {
            if (!genreMap[genre]) genreMap[genre] = { total: 0, count: 0 };
            genreMap[genre].total += movie.rating;
            genreMap[genre].count++;
          });

          // 평점 분포 계산
          if (movie.rating >= 9) ratingBuckets['9+']++;
          else if (movie.rating >= 8) ratingBuckets['8+']++;
          else if (movie.rating >= 7) ratingBuckets['7+']++;
          else if (movie.rating >= 6) ratingBuckets['6+']++;
          else ratingBuckets['<6']++;

          // 연도별 평균 평점 계산
          const year = movie.year;
          if (!yearMap[year]) yearMap[year] = { total: 0, count: 0 };
          yearMap[year].total += movie.rating;
          yearMap[year].count++;
        });

        const avgByGenre = Object.entries(genreMap).map(([genre, val]) => ({
          genre,
          avg_rating: (val.total / val.count).toFixed(2)
        }));

        const dist = Object.entries(ratingBuckets).map(([range, count]) => ({
          range,
          count
        }));

        const avgByYear = Object.entries(yearMap).map(([year, val]) => ({
          year,
          avg_rating: (val.total / val.count).toFixed(2)
        })).sort((a, b) => a.year - b.year);

        setAvgRatings({ genre: avgByGenre, year: avgByYear });
        setRatingDist(dist);
      });
  }, []);

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

        <div className="stats-toggle">
          <button onClick={() => setMode('genre')}>장르 선호</button>
          <button onClick={() => setMode('actor')}>인기 배우</button>
          <button onClick={() => setMode('avg')}>장르별 평균 평점</button>
          <button onClick={() => setMode('dist')}>평점 분포</button>
          <button onClick={() => setMode('year')}>연도별 평균</button>
        </div>

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

        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default StatisticsModal;
