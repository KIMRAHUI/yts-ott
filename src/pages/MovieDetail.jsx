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

  // 반드시 localStorage에 'user_id'로 저장되어 있어야 합니다.
  // backend 필드명이 user_id로 되어 있어서 키 이름을 맞춰야 합니다.
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('user_id'); // key 정확히 확인하세요
  const birthYear = localStorage.getItem('birthYear');
  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - parseInt(birthYear) : null;

  // 영화 상세 및 댓글 로딩
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`https://yts-backend.onrender.com/api/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };
    fetchComments();
  }, [id]);

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

  useEffect(() => {
    if (!movie) return;
    const saved = JSON.parse(localStorage.getItem('yts_favorites')) || [];
    const exists = saved.some((m) => m.id === movie.id);
    setIsFavorite(exists);
  }, [movie]);

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

  // 댓글 등록 시 필수 필드 모두 체크하고 요청
  const handleAddComment = async () => {
    if (!newComment.trim() || newRating === 0) {
      alert('댓글 내용과 평점을 입력해주세요.');
      return;
    }
    if (!userId || !username) {
      alert('로그인 상태를 확인해주세요.');
      return;
    }
    try {
      const res = await axios.post('https://yts-backend.onrender.com/api/comments', {
        user_id: userId,
        username,
        movie_id: id,
        content: newComment,
        rating: newRating,
      });
      setComments([res.data, ...comments]);
      setNewComment('');
      setNewRating(0);
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      // 삭제 시 user_id 전달 (본인 댓글만 삭제 가능하도록)
      await axios.delete(`https://yts-backend.onrender.com/api/comments/${commentId}`, {
        data: { user_id: userId },
      });
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditValue(comments[index].content);
    setEditRating(comments[index].rating);
  };

  const handleSaveEdit = async (index, commentId) => {
    if (editValue.trim() === '') {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      // 수정 시 user_id 전달 (본인 댓글만 수정 가능하도록)
      await axios.put(`https://yts-backend.onrender.com/api/comments/${commentId}`, {
        user_id: userId,
        content: editValue,
        rating: editRating,
      });
      const updated = [...comments];
      updated[index].content = editValue;
      updated[index].rating = editRating;
      setComments(updated);
      setEditingIndex(null);
      setEditValue('');
      setEditRating(0);
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      alert('댓글 수정에 실패했습니다.');
    }
  };

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
    setIsTrailerPlaying(true);
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
          {username && (
            <div className="yts-favorite-btn-container">
              <button
                className={`yts-favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? '❤️ 찜 완료' : '🤍 찜하기'}
              </button>
            </div>
          )}

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
                      <p><strong>{torrent.quality}</strong> / {torrent.type}</p>
                      <p>{torrent.size}</p>
                      <a href={torrent.url} target="_blank" rel="noopener noreferrer" className="modal-download">다운로드</a>
                    </div>
                  ))}
                </div>
                <button className="modal-close" onClick={() => setShowModal(false)}>닫기</button>
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
                <button className="submit-button" onClick={handleAddComment}>등록</button>
              </div>
            </div>
          )}
          {comments.length > 0 && (
            <div className="comment-list">
              {comments.map((c, i) => (
                <div key={c.id} className="comment-item">
                  <strong>{c.username}</strong> ({c.created_at?.split('T')[0] || '날짜 없음'}) {renderHearts(c.rating)}
                  {editingIndex === i ? (
                    <>
                      <div className="heart-row">{renderHearts(editRating, setEditRating)}</div>
                      <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                      <button onClick={() => handleSaveEdit(i, c.id)}>저장</button>
                    </>
                  ) : (
                    <p>{c.content}</p>
                  )}
                  {c.user_id === userId && editingIndex !== i && (
                    <div className="comment-actions">
                      <button onClick={() => handleEdit(i)}>수정</button>
                      <button onClick={() => handleDelete(c.id)}>삭제</button>
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
            {movie.description_full?.trim() ? movie.description_full : '이 영화에 대한 설명이 등록되지 않았습니다.'}
          </div>
          {movie.yt_trailer_code ? (
            <div className="trailer-box">
              {!isTrailerPlaying ? (
                <div className="trailer-thumb" onClick={handlePlayTrailer} style={{ position: 'relative', cursor: 'pointer' }}>
                  <img
                    src={`https://img.youtube.com/vi/${movie.yt_trailer_code}/hqdefault.jpg`}
                    alt="예고편 썸네일"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', color: 'white', textShadow: '0 0 10px rgba(0,0,0,0.7)' }}>
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
                  <div key={m.id} className="similar-movie-card" onClick={() => navigate(`/movie/${m.id}`)}>
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
