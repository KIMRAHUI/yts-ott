import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/MovieDetail.css';
import defaultPoster from '../assets/default-poster.png';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const username = localStorage.getItem('username');
  const birthYear = localStorage.getItem('birthYear');
  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - parseInt(birthYear) : null;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`https://yts.mx/api/v2/movie_details.json`, {
          params: {
            movie_id: id,
            with_images: true,
            with_cast: true,
          },
        });

        const m = res.data.data.movie;

        if (m.mpa_rating === 'R' && age < 19) {
          alert('성인 등급(R) 영화는 성인만 볼 수 있습니다.');
          navigate('/');
        } else if (m.mpa_rating === 'PG' && age < 7) {
          alert('청소년 등급(PG) 영화는 미취학 아동은 볼 수 없습니다.');
          navigate('/');
        } else {
          setMovie(m);
        }
      } catch (err) {
        console.error('영화 정보 불러오기 실패:', err);
      }
    };

    fetchMovie();
  }, [id, age, navigate]);

  // ✅ 진입 시 찜 여부 확인
  useEffect(() => {
    if (!movie) return;
    const saved = JSON.parse(localStorage.getItem('yts_favorites')) || [];
    const exists = saved.some((m) => m.id === movie.id);
    setIsFavorite(exists);
  }, [movie]);

  // ✅ 찜 추가/제거 함수
  const toggleFavorite = () => {
    const saved = JSON.parse(localStorage.getItem('yts_favorites')) || [];

    if (isFavorite) {
      const updated = saved.filter((m) => m.id !== movie.id);
      localStorage.setItem('yts_favorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      const newFav = {
        id: movie.id,
        title: movie.title,
        category: movie.genres?.[0] || 'unknown',
        description: movie.summary || '',
        poster: movie.medium_cover_image,
      };
      localStorage.setItem('yts_favorites', JSON.stringify([newFav, ...saved]));
      setIsFavorite(true);
    }
  };

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!movie?.genres?.[0]) return;
      try {
        const res = await axios.get('https://yts.mx/api/v2/list_movies.json', {
          params: {
            genre: movie.genres[0],
            limit: 6,
            sort_by: 'like_count',
          },
        });
        const filtered = res.data.data.movies.filter((m) => m.id !== movie.id).slice(0, 3);
        setSimilarMovies(filtered);
      } catch (err) {
        console.error('유사 영화 불러오기 실패:', err);
      }
    };

    if (movie) fetchSimilar();
  }, [movie]);

  const handleAddComment = () => {
    if (!newComment.trim() || newRating === 0) return;
    const date = new Date().toLocaleDateString();
    setComments([{ user: username, content: newComment, rating: newRating, date }, ...comments]);
    setNewComment('');
    setNewRating(0);
  };

  const handleDelete = (index) => {
    const updated = [...comments];
    updated.splice(index, 1);
    setComments(updated);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditValue(comments[index].content);
    setEditRating(comments[index].rating);
  };

  const handleSaveEdit = (index) => {
    const updated = [...comments];
    updated[index].content = editValue;
    updated[index].rating = editRating;
    setComments(updated);
    setEditingIndex(null);
    setEditValue('');
    setEditRating(0);
  };

  // --- 수정된 부분: 예고편 재생 및 시청기록 저장 함수 ---
  const handlePlayTrailer = () => {
    if (!movie) return;

    const history = JSON.parse(localStorage.getItem('yts_history')) || [];
    const exists = history.some((h) => h.id === movie.id);

    if (!exists) {
      const newEntry = {
        id: movie.id,
        title: movie.title,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        poster: movie.medium_cover_image,
      };
      localStorage.setItem('yts_history', JSON.stringify([newEntry, ...history]));
    }

    setIsTrailerPlaying(true); // iframe 보여주기 위해 상태 변경
  };

  const renderHearts = (count, onClick) => {
    return [1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        style={{ cursor: onClick ? 'pointer' : 'default', fontSize: '1.4rem' }}
        onClick={() => onClick && onClick(i)}
      >
        {i <= count ? '🖤' : '🤍'}
      </span>
    ));
  };

  if (!movie) return <p style={{ textAlign: 'center' }}>영화 정보를 불러오는 중...</p>;

  const posterSrc = movie.large_cover_image || movie.medium_cover_image || defaultPoster;

  return (
    <div className="movie-detail-container">
      <h2 className="movie-title">{movie.title}</h2>

      <div className="movie-content-layout">
        <div>
          <img className="movie-cover" src={posterSrc} alt={movie.title} />

          <div className="yts-favorite-btn-container">
            <button
              className={`yts-favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              {isFavorite ? '❤️ 찜 완료' : '🤍 찜하기'}
            </button>
          </div>

          {username && movie.torrents && (
            <div className="download-button-box">
              <button className="download-toggle" onClick={() => setShowModal(true)}>
                🎬 토렌트 다운로드
              </button>
            </div>
          )}

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">화질을 선택하세요</h3>
                <div className="modal-options">
                  {movie.torrents.map((torrent, i) => (
                    <div key={i} className="modal-card">
                      <p>
                        <strong>{torrent.quality}</strong> / {torrent.type}
                      </p>
                      <p>{torrent.size}</p>
                      <a
                        href={torrent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-download"
                      >
                        다운로드
                      </a>
                    </div>
                  ))}
                </div>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  닫기
                </button>
              </div>
            </div>
          )}

          {username && (
            <div className="review-box">
              <div className="review-input-wrap">
                <div className="heart-row">{renderHearts(newRating, setNewRating)}</div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="영화에 대한 후기를 입력하세요"
                />
                <button className="submit-button" onClick={handleAddComment}>
                  등록
                </button>
              </div>
            </div>
          )}

          {comments.length > 0 && (
            <div className="comment-list">
              {comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <strong>{c.user}</strong> ({c.date}) {renderHearts(c.rating, null)}
                  {editingIndex === i ? (
                    <>
                      <div className="heart-row">{renderHearts(editRating, setEditRating)}</div>
                      <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                      <button onClick={() => handleSaveEdit(i)}>저장</button>
                    </>
                  ) : (
                    <p>{c.content}</p>
                  )}
                  {c.user === username && editingIndex !== i && (
                    <div className="comment-actions">
                      <button onClick={() => handleEdit(i)}>수정</button>
                      <button onClick={() => handleDelete(i)}>삭제</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="movie-right-box">
          <p className="movie-rating">등급: {movie.mpa_rating || '정보 없음'}</p>
          <div className="movie-desc">
            {movie.description_full?.trim()
              ? movie.description_full
              : '이 영화에 대한 설명이 등록되지 않았습니다.'}
          </div>

          {movie.yt_trailer_code ? (
            <div className="trailer-box">
              {!isTrailerPlaying ? (
                <div
                  className="trailer-thumb"
                  style={{ position: 'relative', cursor: 'pointer' }}
                  onClick={handlePlayTrailer}
                >
                  <img
                    src={`https://img.youtube.com/vi/${movie.yt_trailer_code}/hqdefault.jpg`}
                    alt="예고편 썸네일"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '3rem',
                      color: 'white',
                      textShadow: '0 0 10px rgba(0,0,0,0.7)',
                    }}
                  >
                    ▶
                  </div>
                </div>
              ) : (
                <iframe
                  width="100%"
                  height="300"
                  src={`https://www.youtube.com/embed/${movie.yt_trailer_code}?autoplay=1`}
                  title="예고편"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            <p style={{ color: '#555', fontStyle: 'italic' }}>예고편이 제공되지 않습니다.</p>
          )}

          {similarMovies.length > 0 && (
            <div className="similar-movies">
              <h3 className="similar-title">Similar Movies</h3>
              <div className="similar-movie-list">
                {similarMovies.map((m) => (
                  <div
                    key={m.id}
                    className="similar-movie-card"
                    onClick={() => navigate(`/movie/${m.id}`)}
                  >
                    <img src={m.medium_cover_image} alt={m.title} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
