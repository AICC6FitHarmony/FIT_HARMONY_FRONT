import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/login/Login';
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
import Reload from './components/common/Reload';
import { AuthProvider } from './js/login/AuthContext';
import Products from './components/products/Products';
import { useEffect } from 'react';

function App() {
  const isLoading = useSelector((state) => state.common.isLoading);
  const isTrainerMatchMember = useSelector(state => state.common.isTrainerMatchMember);


  useEffect(() => {
    const handleImageError = (e) => {
      const target = e.target;
      if (target.tagName === 'IMG' && !target.getAttribute('data-has-fallback')) {
        target.src="data:image/svg+xml;utf8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f5f5f5%22%3E%3C%2Frect%3E%0A%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2255%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-size%3D%2216%22%20fill%3D%22%23aaa%22%3E%0A%20%20%20%20%F0%9F%93%B7%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%97%86%EC%9D%8C%0A%20%20%3C%2Ftext%3E%0A%3C%2Fsvg%3E%0A"; // 👈 2번 이미지 경로
        target.setAttribute('data-has-fallback', 'true');
      }
    }; 
   
    // 캡처 단계에서 모든 이미지 에러 감지
    document.addEventListener('error', handleImageError, true);
  
    return () => {
      document.removeEventListener('error', handleImageError, true);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
      <Header />
      <div className={`content-wrapper bg-orange-50${(isTrainerMatchMember ? ' trainer-match-wrapper' : '')}`}>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inbody" element={<Inbody/>} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/schedule" element={<Schedule/>} />
          <Route path="/trainer/*" element={<Trainer />} />
          <Route path="/community/*" element={<Community />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reload" element={<Reload />} />
        </Routes>

        {isLoading && (
          <div className="fixed w-full h-full top-0 left-0 z-100 flex justify-center items-center">
            <div className="w-full h-[100px] flex justify-center z-101">
              <div className="fit-loading-text text-4xl sm:text-6xl h-full flex items-center">
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
