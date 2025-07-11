import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsPeopleFill } from 'react-icons/bs';
import { HiMenu, HiX } from 'react-icons/hi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useAuth } from '../../js/login/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsTrainerMatchMember,
  setTrainerSelectedMember,
} from '../../js/redux/slice/commonSlice';
import { useRequest } from '../../js/config/requests';
import { userLogout } from '../../js/login/loginUtils';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // 모바일 메뉴 열렸을 때 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // const [isTrainerMatchMember, setIsTrainerMatchMember] = useState(false);
  const request = useRequest();
  const dispatch = useDispatch();
  const isTrainerMatchMember = useSelector(
    (state) => state.common.isTrainerMatchMember
  );
  const [trainerMatchUserList, setTrainerMatchUserList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isTrainerMatchMember) {
      dispatch(setTrainerSelectedMember({ userId: 0, userName: '회원선택' }));
      setShowSelectDropdown(false);
    } else {
      const selectTrainerMatchUserList = async () => {
        const options = {
          method: 'GET',
        };
        const result = await request('/buy/matchMember?status=A', options);

        const { success, message } = result;

        if (success) {
          setTrainerMatchUserList(result.data);
        } else {
          if (message == 'noAuth') {
            toast.error('로그인 후 이용 가능한 서비스 입니다.', {
              position: 'bottom-center',
            });
          } else {
            toast.error('에러가 발생했습니다.\n잠시후 다시 이용해주세요.', {
              position: 'bottom-center',
            });
          }
        }
      };
      selectTrainerMatchUserList();
    }
  }, [isTrainerMatchMember]);

  const trainerSelectedMember = useSelector(
    (state) => state.common.trainerSelectedMember
  );
  const [showSelectDropdown, setShowSelectDropdown] = useState(false);
  const handleSelect = (option) => {
    dispatch(setTrainerSelectedMember(option));
    setShowSelectDropdown(false);
  };

  useEffect(() => {
    const nowPage = location.pathname;
    if (nowPage == '/schedule' || nowPage == '/inbody') {
      navigate('/reload'); // 리로드용 빈페이지
      setTimeout(() => {
        navigate(nowPage); // 현제 페이지
      }, 50);
    }
  }, [trainerSelectedMember]);

  return (
    // 사이트 전체 배경
    <div className="bg-orange-50">
      {/* 로고 섹션 - 데스크탑에서만 표시 */}
      <div className="hidden relative py-5 px-4 sm:flex sm:flex-col sm:justify-center">
        {user?.user?.role == 'TRAINER' && (
          <div className="flex absolute left-4">
            <div
              className={`relative w-40 h-10 flex items-center px-1 rounded-full cursor-pointer transition-colors duration-300 ${
                isTrainerMatchMember ? 'bg-green-500' : 'bg-gray-300'
              }`}
              onClick={() =>
                dispatch(setIsTrainerMatchMember(!isTrainerMatchMember))
              }
            >
              {/* 토글 텍스트 */}
              <span
                className={`absolute w-full text-xs font-semibold text-white text-center transition-opacity duration-300 ml-[-0.5rem] ${
                  isTrainerMatchMember ? 'opacity-100' : 'opacity-0'
                }`}
              >
                매칭회원정보
              </span>
              <span
                className={`absolute w-full text-xs font-semibold text-white text-center transition-opacity duration-300 ${
                  isTrainerMatchMember ? 'opacity-0' : 'opacity-100'
                }`}
              >
                MY INFO
              </span>

              {/* 토글 원 */}
              <div
                className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  isTrainerMatchMember ? 'translate-x-30' : 'translate-x-0'
                }`}
              />
            </div>

            {isTrainerMatchMember && (
              <div className="relative ml-3">
                <button
                  className="trainer-array bg-white rounded-2xl h-10 flex items-center justify-center gap-2 hover:underline px-4"
                  onClick={() => setShowSelectDropdown(!showSelectDropdown)}
                >
                  {trainerSelectedMember.userId == 0
                    ? trainerSelectedMember.userName
                    : `${trainerSelectedMember.nickName}( ${trainerSelectedMember.userName} )`}
                  &nbsp;
                  {trainerSelectedMember.userId == 0 ? '' : '회원님'}
                  <TiArrowSortedDown />
                </button>

                {/* 정렬 드롭다운 */}
                {showSelectDropdown && (
                  <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                    <ul className="py-2">
                      {trainerMatchUserList?.map((item, idx) => (
                        <li key={idx}>
                          <button
                            className="w-full text-center px-4 py-3 hover:bg-gray-100 text-sm"
                            onClick={() => handleSelect(item)}
                          >
                            {`${item.nickName}( ${item.userName} )`} 회원님
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col justify-center mx-auto">
          <Link to="/">
            <div className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Fit
              </span>
              <span className="text-[#4a902c] bg-clip-text ml-1">Harmony</span>
            </div>
            <div className="text-xs font-medium text-slate-500 tracking-wider uppercase mt-0.5 text-center md:text-left">
              Modern Fitness
            </div>
          </Link>
        </div>
        {/* 로그인/회원가입 */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {!user?.isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-green-700 text-sm hover:bg-green-100 px-3 py-1 rounded-full transition"
              >
                로그인
              </Link>
              <Link
                to="/login/signup"
                className="text-white bg-green-700 text-sm px-3 py-1 rounded-full transition hover:bg-green-800"
              >
                회원가입
              </Link>
            </div>
          ) : (
            <div className="text-green-700 text-sm flex items-center gap-2">
              <span>안녕하세요, {user.user.nickName}님</span>
              <button
                className="text-white bg-green-700 text-sm px-3 py-1 rounded-full transition hover:bg-green-800"
                onClick={() => {
                  userLogout();
                }}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 내비게이션 바 */}
      <div className="bg-white sticky top-0 z-30 shadow-md shadow-green-800/10 rounded-2xl mx-2 md:mx-4">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* 메뉴 - md 이상에서만 표시 */}
          <div className="hidden md:flex flex-1 justify-center space-x-6 text-sm font-medium text-green-700">
            {!(user?.user?.role == 'TRAINER' && isTrainerMatchMember) && (
              <Link
                to="/dashboard"
                className="hover:bg-green-100 px-4 py-2 rounded-full transition"
              >
                대쉬보드
              </Link>
            )}
            <Link
              to="/schedule"
              className="hover:bg-green-100 px-4 py-2 rounded-full transition"
            >
              캘린더
            </Link>
            <Link
              to="/inbody"
              className="hover:bg-green-100 px-4 py-2 rounded-full transition"
            >
              인바디
            </Link>
            <Link
              to="/community"
              className="hover:bg-green-100 px-4 py-2 rounded-full transition"
            >
              커뮤니티
            </Link>


            {user?.user?.role != "TRAINER" && (
              <Link
                to="/trainer"
                className="hover:bg-green-100 px-4 py-2 rounded-full transition"
              >
                강사 찾기
              </Link>
            )}
            {(user?.user?.role == "TRAINER" && !isTrainerMatchMember) && (
              <Link to="/products" className="hover:bg-green-100 px-4 py-2 rounded-full transition">
                강사상품관리
              </Link>
            )}
          </div>

          {/* 모바일 레이아웃 */}
          <div className="md:hidden flex items-center justify-between w-full">
            {/* 햄버거 메뉴 버튼 */}
            <button
              onClick={toggleMenu}
              className="text-green-700 hover:bg-green-100 p-2 rounded-full transition-colors duration-200 touch-manipulation"
              aria-label="메뉴 열기/닫기"
            >
              {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>

            {/* 중앙 로고 */}
            <div className="flex-1 text-center">
              <Link to="/" className="inline-block">
                <div className="text-lg font-extrabold text-slate-800 tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Fit
                  </span>
                  <span className="text-[#4a902c] ml-1">Harmony</span>
                </div>
              </Link>
            </div>

            {/* 마이페이지 아이콘 */}
            <Link
              to="/mypage"
              className="text-green-700 hover:text-orange-50  transition-colors duration-200 touch-manipulation"
              aria-label="마이페이지"
            >
              <BsPeopleFill size={20} />
            </Link>
          </div>

          {/* 데스크탑 마이페이지 */}
          <div className="hidden md:block">
            <Link
              to="/mypage"
              className="text-green-700 hover:text-orange-900  p-3 rounded-full transition-colors duration-200"
            >
              <BsPeopleFill />
            </Link>
          </div>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {isMenuOpen && (
          <>
            {/* 배경 오버레이 */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* 모바일 메뉴 패널 */}
            <div className="fixed top-16 left-0 right-0 bg-white z-50 md:hidden shadow-lg rounded-b-2xl mx-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="py-4">
                {/* 로그인 섹션 - 모바일에서만 표시 */}
                {!user?.isLoggedIn && (
                  <div className="px-4 pb-4 mb-4 border-b border-gray-100">
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="text-center bg-green-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-800 transition-colors duration-200 touch-manipulation"
                      >
                        로그인
                      </Link>
                      <Link
                        to="/login/signup"
                        onClick={closeMenu}
                        className="text-center border border-green-700 text-green-700 py-3 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200 touch-manipulation"
                      >
                        회원가입
                      </Link>
                    </div>
                  </div>
                )}

                {/* 네비게이션 메뉴 */}
                <div className="px-4 space-y-1">
                  {!(user?.user?.role == 'TRAINER' && isTrainerMatchMember) && (
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center w-full text-left py-4 px-4 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-colors duration-200 touch-manipulation"
                    >
                      대쉬보드
                    </Link>
                  )}
                  <Link
                    to="/schedule"
                    onClick={closeMenu}
                    className="flex items-center w-full text-left py-4 px-4 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-colors duration-200 touch-manipulation"
                  >
                    캘린더
                  </Link>
                  <Link
                    to="/inbody"
                    onClick={closeMenu}
                    className="flex items-center w-full text-left py-4 px-4 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-colors duration-200 touch-manipulation"
                  >
                    인바디
                  </Link>
                  <Link
                    to="/community"
                    onClick={closeMenu}
                    className="flex items-center w-full text-left py-4 px-4 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-colors duration-200 touch-manipulation"
                  >
                    커뮤니티
                  </Link>


                  {user?.user?.role != "TRAINER" && (
                    <Link
                      to="/trainer"
                      onClick={closeMenu}
                      className="flex items-center w-full text-left py-4 px-4 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-colors duration-200 touch-manipulation">
                      강사 찾기
                    </Link>
                  )}
                  {(user?.user?.role == "TRAINER" && !isTrainerMatchMember) && (
                    <Link
                      to="/products"
                      onClick={closeMenu}
                      className="flex items-center w-full text-left py-4 px-4 rounded-lg text-green-700 font-medium hover:bg-green-50 transition-colors duration-200 touch-manipulation">
                      강사상품관리
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
