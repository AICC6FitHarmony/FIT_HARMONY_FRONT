import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/cmmn/Home";
import Login from "./components/cmmn/Login";
import AuthGoogleResult from "./components/cmmn/AuthGoogleResult";


function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              {/* 구글 인증 처리 후 동작 페이지 */}
              <Route path="/auth/google/result" element={<AuthGoogleResult/>}/>
          </Routes>
      </BrowserRouter>
  )
}

export default App
