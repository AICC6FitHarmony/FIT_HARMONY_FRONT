import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/cmmn/Home";
import Login from "./components/login/Login";
import AuthGoogleResult from "./components/cmmn/AuthGoogleResult";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Intro from "./components/intro/Intro";
import Dashboard from "./components/dashboard/Dashboard";
import Inbody from "./components/inbody/Inbody";
import MyPage from "./components/mypage/MyPage";
import Schedule from "./components/schedule/Schedule";
import Trainer from "./components/Trainer/Trainer";
import Community from "./components/Community/Community";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inbody" element={<Inbody />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/trainer" element={<Trainer />} />
          <Route path="/community" element={<Community />} />
          {/* 구글 인증 처리 후 동작 페이지 */}
          <Route path="/auth/google/result" element={<AuthGoogleResult />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
