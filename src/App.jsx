import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ExplorePage from './pages/Explore';
import Support from './pages/Support';
import MyPage from './pages/MyPage';
import MovieDetail from './pages/MovieDetail';
import Subscription from './pages/Subscription';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/subscribe" element={<Subscription />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
