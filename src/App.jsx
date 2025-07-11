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

function App() {
  const isLoading = useSelector((state) => state.common.isLoading);
  const isTrainerMatchMember = useSelector(state => state.common.isTrainerMatchMember);

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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
