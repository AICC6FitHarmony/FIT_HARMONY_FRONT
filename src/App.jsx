import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/cmmn/Home';
import Login from './components/login/Login';
import AuthGoogleResult from './components/cmmn/AuthGoogleResult';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Intro from './components/intro/Intro';
import Dashboard from './components/dashboard/Dashboard';
import Inbody from './components/inbody/Inbody';
import MyPage from './components/mypage/MyPage';
import Schedule from './components/schedule/Schedule';
import Trainer from './components/Trainer/Trainer';
import Community from './components/Community/Community';
import { useSelector } from 'react-redux';

function App() {
  const isLoading = useSelector((state) => state.loading.isLoading);
  
  return (
    <BrowserRouter>
      <Header />
      <div className="content-wrapper bg-orange-50">
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inbody" element={<Inbody />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/trainer/*" element={<Trainer />} />
          <Route path="/community/*" element={<Community />} />
          {/* 구글 인증 처리 후 동작 페이지 */}
          <Route path="/auth/google/result" element={<AuthGoogleResult />} />
        </Routes>

        {isLoading && (
          <div className="fixed w-screen h-screen top-0 left-0 z-100 flex justify-center items-center">
            <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center z-101">
              <div className="fit-loading-text">
                <span>F</span>
                <span>I</span>
                <span>T</span>
                <span>-</span>
                <span>H</span>
                <span>O</span>
                <span>R</span>
                <span>M</span>
                <span>O</span>
                <span>N</span>
                <span>Y</span>
              </div>
            </div>
            <div className="absolute w-full h-full bg-gray-500 opacity-70"></div>
          </div>
        )}
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
