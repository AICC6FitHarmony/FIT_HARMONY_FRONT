import React, { useEffect, useState } from 'react';

const TrainerReadMore = () => {
  const [trainerDetail, setTrainerDetail] = useState({
    userName: '김헬스',
    gym: { gymName: '프리미엄 피트니스 센터' },
  });
  const [isFavorited, setIsFavorited] = useState(false);

  // 상담 요청 핸들러
  const handleConsultationRequest = () => {
    alert('상담 요청이 접수되었습니다! 곧 연락드리겠습니다.');
  };

  // 찜하기 핸들러
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  // 공유하기 핸들러
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${trainerDetail?.userName} 트레이너`,
        text: `${trainerDetail?.userName} 트레이너의 프로필을 확인해보세요!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  // 서비스 카드 클릭 핸들러
  const handleServiceClick = (serviceName) => {
    alert(`${serviceName} 상세 정보를 확인하시겠습니까?`);
  };

  // 연락처 클릭 핸들러
  const handleContactClick = (type, value) => {
    switch (type) {
      case 'phone':
        alert('전화 연결 중...');
        break;
      case 'email':
        alert('이메일 작성 중...');
        break;
      case 'location':
        alert('위치 정보를 확인합니다.');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-lime-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-32 right-20 w-32 h-32 bg-yellow-200/40 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-green-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-lime-300/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto p-6 pt-20 relative z-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-100/90 to-lime-100/90 backdrop-blur-xl rounded-[2.5rem] p-10 mb-8 shadow-2xl border border-lime-200/50 relative overflow-hidden">
          {/* 내부 장식 요소 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-lime-200/30 to-transparent rounded-full translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-200/40 to-transparent rounded-full -translate-x-16 translate-y-16"></div>

          <div className="flex items-center gap-10 mb-10 max-lg:flex-col max-lg:text-center relative z-10">
            {/* 프로필 이미지 */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-lime-400 via-lime-500 to-green-500 flex items-center justify-center text-7xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="relative z-10">🏋️</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">✨</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="inline-block bg-gradient-to-r from-lime-600 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                🌟 프리미엄 트레이너
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-lime-700 via-green-600 to-lime-600 bg-clip-text text-transparent mb-4 leading-tight">
                {trainerDetail.userName} 트레이너
              </h1>
              <p className="text-2xl text-gray-700 mb-6 font-medium">
                건강한 변화의 시작, 함께 만들어가요
              </p>

              {/* 통계 카드들 */}
              <div className="flex items-center gap-8 max-lg:justify-center flex-wrap">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-lime-200/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="text-2xl font-bold text-lime-700">
                        4.9
                      </div>
                      <div className="text-sm text-gray-600">
                        평점 (124개 리뷰)
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-lime-200/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="text-2xl font-bold text-lime-700">
                        3년
                      </div>
                      <div className="text-sm text-gray-600">경력</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-lime-200/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💪</span>
                    <div>
                      <div className="text-2xl font-bold text-lime-700">89</div>
                      <div className="text-sm text-gray-600">완료 수업</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-4 max-md:flex-col max-md:items-center relative z-10">
            <button
              onClick={handleConsultationRequest}
              className="group px-10 py-4 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                🗣️ 상담 요청하기
              </span>
            </button>
            <button
              onClick={handleFavorite}
              className={`group px-10 py-4 rounded-full font-bold border-2 transition-all duration-300 hover:-translate-y-2 text-lg ${
                isFavorited
                  ? 'bg-gradient-to-r from-pink-400 to-red-400 text-white border-pink-400 shadow-xl'
                  : 'bg-white/90 text-lime-700 border-lime-500 hover:bg-lime-500 hover:text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <span className="flex items-center gap-2">
                {isFavorited ? '❤️ 찜 완료' : '🤍 찜하기'}
              </span>
            </button>
            <button
              onClick={handleShare}
              className="group px-10 py-4 bg-white/90 text-lime-700 border-2 border-lime-500 rounded-full font-bold hover:bg-lime-500 hover:text-white hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              <span className="flex items-center gap-2">📤 공유하기</span>
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 왼쪽 메인 콘텐츠 */}
          <div className="xl:col-span-2 space-y-8">
            {/* 서비스 섹션 */}
            <div className="bg-gradient-to-br from-yellow-100/90 to-lime-100/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-lime-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-200/20 rounded-full translate-x-16 -translate-y-16"></div>

              <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3 relative z-10">
                <span className="text-4xl">🎯</span>
                제공 서비스
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                <div
                  onClick={() => handleServiceClick('기초 PT 클래스')}
                  className="group bg-gradient-to-br from-white via-yellow-50 to-lime-50 rounded-2xl p-6 border-2 border-lime-200/50 cursor-pointer hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-lime-200/20 rounded-full translate-x-10 -translate-y-10"></div>
                  <div className="text-3xl mb-3">🌱</div>
                  <h3 className="text-xl font-bold text-lime-700 mb-2">
                    기초 PT 클래스
                  </h3>
                  <div className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                    80,000원
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    운동 초보자를 위한 기본 자세부터 운동 루틴까지 배우는
                    클래스입니다. 개인 맞춤형 트레이닝으로 진행됩니다.
                  </p>
                  <div className="mt-4 text-sm text-lime-600 font-semibold group-hover:text-lime-700 transition-colors">
                    자세히 보기 →
                  </div>
                </div>

                <div
                  onClick={() => handleServiceClick('웨이트 트레이닝')}
                  className="group bg-gradient-to-br from-white via-yellow-50 to-lime-50 rounded-2xl p-6 border-2 border-lime-200/50 cursor-pointer hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200/20 rounded-full translate-x-10 -translate-y-10"></div>
                  <div className="text-3xl mb-3">💪</div>
                  <h3 className="text-xl font-bold text-lime-700 mb-2">
                    웨이트 트레이닝
                  </h3>
                  <div className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                    100,000원
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    근력 증진과 체형 개선을 위한 웨이트 트레이닝 클래스입니다.
                    안전한 운동법과 효과적인 루틴을 제공합니다.
                  </p>
                  <div className="mt-4 text-sm text-lime-600 font-semibold group-hover:text-lime-700 transition-colors">
                    자세히 보기 →
                  </div>
                </div>

                <div
                  onClick={() => handleServiceClick('프리미엄 코스')}
                  className="group bg-gradient-to-br from-white via-yellow-50 to-lime-50 rounded-2xl p-6 border-2 border-lime-200/50 cursor-pointer hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 lg:col-span-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/20 rounded-full translate-x-12 -translate-y-12"></div>
                  <div className="text-3xl mb-3">🏆</div>
                  <h3 className="text-xl font-bold text-lime-700 mb-2">
                    프리미엄 코스
                  </h3>
                  <div className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                    300,000원
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    4주 연속 수업으로 구성된 종합 피트니스 코스입니다. 유산소,
                    근력, 체형 교정을 모두 포함합니다.
                  </p>
                  <div className="mt-4 text-sm text-lime-600 font-semibold group-hover:text-lime-700 transition-colors">
                    자세히 보기 →
                  </div>
                </div>
              </div>
            </div>

            {/* 자기소개 섹션 */}
            <div className="bg-gradient-to-br from-lime-100/90 to-green-100/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-lime-200/50 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-200/20 rounded-full -translate-x-20 translate-y-20"></div>

              <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3 relative z-10">
                <span className="text-4xl">👋</span>
                자기소개
              </h2>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-lime-200/30 relative z-10">
                <p className="leading-8 text-gray-700 text-lg">
                  안녕하세요! 건강한 삶을 추구하는{' '}
                  <strong className="text-lime-700">
                    {trainerDetail.userName}
                  </strong>{' '}
                  트레이너입니다. 🌟
                  <br />
                  <br />
                  저는 체육학과를 졸업하고 NSCA-CPT 자격증을 보유하고 있으며,
                  3년간 다양한 연령대의 회원들과 함께 건강한 라이프스타일을
                  만들어가고 있습니다.
                  <br />
                  <br />
                  <strong className="text-lime-700 text-xl">
                    🎯 트레이닝 특징:
                  </strong>
                  <br />
                  <div className="mt-4 space-y-2 ml-4">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                      <span>1:1 또는 소그룹 맞춤형 트레이닝</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                      <span>개인별 체력 수준에 맞는 운동 프로그램</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                      <span>안전하고 효과적인 운동법 지도</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                      <span>즐겁고 동기부여가 되는 수업 분위기</span>
                    </div>
                  </div>
                  <br />
                  운동이 처음이신 분부터 실력을 더 키우고 싶은 분까지, 모든
                  레벨의 회원들을 환영합니다! 함께 건강한 몸을 만들어보아요! 💪
                </p>
              </div>
            </div>

            {/* 리뷰 섹션 */}
            <div className="bg-gradient-to-br from-yellow-100/90 to-lime-100/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-lime-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-lime-200/20 rounded-full translate-x-18 -translate-y-18"></div>

              <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3 relative z-10">
                <span className="text-4xl">💬</span>
                리뷰 (124개)
              </h2>

              <div className="space-y-6 relative z-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-l-4 border-lime-500 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-800 text-lg">
                      박***
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xl">
                        ⭐⭐⭐⭐⭐
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    처음 운동을 시작하는데 정말 친절하게 잘 가르쳐주셨어요!
                    덕분에 이제 혼자서도 운동할 수 있게 되었습니다. 추천합니다!
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-l-4 border-lime-500 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-800 text-lg">
                      김***
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xl">
                        ⭐⭐⭐⭐⭐
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    웨이트 트레이닝 정말 만족스러웠어요. 자세 교정과 운동법을
                    정확히 알려주셔서 효과를 바로 느꼈습니다!
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-l-4 border-lime-500 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-800 text-lg">
                      이***
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xl">
                        ⭐⭐⭐⭐⭐
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    프리미엄 코스 완주했습니다! 4주 동안 정말 많이 배웠고, 이제
                    건강한 운동 습관을 가지게 되었어요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드바 */}
          <div className="bg-gradient-to-br from-lime-100/90 to-green-100/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-lime-200/50 h-fit relative overflow-hidden">
            <div className="absolute top-0 left-0 w-28 h-28 bg-yellow-200/20 rounded-full -translate-x-14 -translate-y-14"></div>

            {/* 연락처 정보 */}
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3 relative z-10">
              <span className="text-3xl">📞</span>
              연락처 정보
            </h3>
            <div className="space-y-4 mb-8 relative z-10">
              <div
                onClick={() => handleContactClick('phone', '010-1234-5678')}
                className="group flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-white hover:shadow-lg hover:translate-x-2 transition-all duration-300 border border-lime-200/50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                  📱
                </div>
                <span className="text-gray-700 font-medium text-lg">
                  010-1234-5678
                </span>
              </div>
              <div
                onClick={() =>
                  handleContactClick('email', 'trainer@example.com')
                }
                className="group flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-white hover:shadow-lg hover:translate-x-2 transition-all duration-300 border border-lime-200/50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                  ✉️
                </div>
                <span className="text-gray-700 font-medium text-lg">
                  trainer@example.com
                </span>
              </div>
              <div
                onClick={() =>
                  handleContactClick(
                    'location',
                    trainerDetail.gym?.gymName || '서울시 강남구'
                  )
                }
                className="group flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-white hover:shadow-lg hover:translate-x-2 transition-all duration-300 border border-lime-200/50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                  🏠
                </div>
                <span className="text-gray-700 font-medium text-lg">
                  {trainerDetail.gym?.gymName || '서울시 강남구'}
                </span>
              </div>
            </div>

            {/* 위치 정보 */}
            <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3 relative z-10">
              <span className="text-3xl">📍</span>
              위치 정보
            </h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center mb-8 shadow-lg border border-lime-200/50 relative z-10">
              <p className="text-4xl mb-4">🗺️</p>
              <p className="text-gray-700 font-medium text-lg">
                {trainerDetail.gym?.gymName || '헬스장 정보'}
                <br />
                <span className="text-lime-600">지하철역 도보 5분 거리</span>
              </p>
            </div>

            {/* 운영 시간 */}
            <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3 relative z-10">
              <span className="text-3xl">⏰</span>
              운영 시간
            </h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-lime-200/50 relative z-10">
              <div className="space-y-3 text-lg">
                <p className="flex justify-between">
                  <strong>평일:</strong>{' '}
                  <span className="text-lime-600">06:00 - 22:00</span>
                </p>
                <p className="flex justify-between">
                  <strong>주말:</strong>{' '}
                  <span className="text-lime-600">08:00 - 20:00</span>
                </p>
                <p className="flex justify-between text-orange-600 font-semibold">
                  <strong>휴무:</strong> <span>매주 일요일</span>
                </p>
              </div>
            </div>

            {/* 자격증 */}
            <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3 relative z-10">
              <span className="text-3xl">🏆</span>
              자격증
            </h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-lime-200/50 relative z-10">
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                  <p className="font-medium">NSCA-CPT 자격증</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                  <p className="font-medium">생활스포츠지도사 2급</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                  <p className="font-medium">응급처치법 자격증</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
                  <p className="font-medium">체육학과 학사 졸업</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerReadMore;
