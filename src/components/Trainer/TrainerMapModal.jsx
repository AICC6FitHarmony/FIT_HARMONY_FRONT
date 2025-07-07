import React, { useState, useEffect, useRef } from 'react';
import { IoClose, IoSearchOutline } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa6';

const TrainerMapModal = ({ isOpen, onClose, trainers, onTrainerSelect }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredTrainers, setFilteredTrainers] = useState(trainers);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5분 캐시
        }
      );
    });
  };

  // IP 기반 위치 가져오기 (GPS 실패 시 대안)
  const getLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return { lat: data.latitude, lng: data.longitude };
    } catch (error) {
      console.error('IP location error:', error);
      throw error;
    }
  };

  // 위치 정보 초기화
  useEffect(() => {
    if (!isOpen) return;

    const initLocation = async () => {
      try {
        // 먼저 GPS로 위치 시도
        const location = await getCurrentLocation();
        setCurrentLocation(location);
        setLocationError(null);
      } catch (gpsError) {
        console.warn('GPS 위치 가져오기 실패:', gpsError);

        try {
          // GPS 실패 시 IP 기반 위치 시도
          const location = await getLocationByIP();
          setCurrentLocation(location);
          setLocationError(null);
        } catch (ipError) {
          console.warn('IP 기반 위치 가져오기 실패:', ipError);
          setLocationError(
            '위치 정보를 가져올 수 없습니다. 기본 위치로 설정합니다.'
          );
          // 기본 위치 (서울)
          setCurrentLocation({ lat: 37.5665, lng: 126.978 });
        }
      }
    };

    initLocation();
  }, [isOpen]);

  // 카카오맵 초기화 부분을 다음과 같이 수정
  useEffect(() => {
    if (!isOpen || !currentLocation) return;

    const initKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        const options = {
          center: new window.kakao.maps.LatLng(
            currentLocation.lat,
            currentLocation.lng
          ),
          level: 8,
        };

        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);

        // 현재 위치 마커 추가 (GPS로 가져온 경우에만)
        if (!locationError) {
          const currentLocationMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(
              currentLocation.lat,
              currentLocation.lng
            ),
            map: mapInstance,
            title: '현재 위치',
          });

          // 현재 위치 마커 스타일 변경
          const markerImage = new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
            new window.kakao.maps.Size(24, 35)
          );
          currentLocationMarker.setImage(markerImage);
        }

        window.kakao.maps.event.addListener(mapInstance, 'click', () => {
          setSelectedTrainer(null);
        });
      });
    };

    if (!window.kakao) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_KEY
      }&autoload=false&libraries=services`;
      document.head.appendChild(script);

      script.onload = initKakaoMap;
      script.onerror = () => {
        console.error('카카오맵 스크립트 로드 실패');
      };
    } else {
      initKakaoMap();
    }
  }, [isOpen, currentLocation]);

  // 마커 생성 및 표시
  useEffect(() => {
    if (!map || !filteredTrainers.length) return;

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = [];
    const geocoder = new window.kakao.maps.services.Geocoder();

    filteredTrainers.forEach((trainer, index) => {
      const address = trainer.gym?.gymAddress;
      if (!address) return;

      // 주소로 좌표 검색
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          // 마커 생성
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: coords,
            title: trainer.userName,
          });

          // 마커 클릭 이벤트
          window.kakao.maps.event.addListener(marker, 'click', () => {
            setSelectedTrainer(trainer);
          });

          newMarkers.push(marker);
        }
      });
    });

    setMarkers(newMarkers);
  }, [map, filteredTrainers]);

  // 트레이너 검색
  useEffect(() => {
    if (!searchKeyword.trim()) {
      setFilteredTrainers(trainers);
      return;
    }

    const filtered = trainers.filter(
      (trainer) =>
        trainer.userName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        trainer.gym?.gym?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        trainer.gym?.gymAddress
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase())
    );
    setFilteredTrainers(filtered);
  }, [searchKeyword, trainers]);

  // 현재 위치로 이동하는 함수
  const moveToCurrentLocation = () => {
    if (map && currentLocation) {
      const moveLatLon = new window.kakao.maps.LatLng(
        currentLocation.lat,
        currentLocation.lng
      );
      map.setCenter(moveLatLon);
      map.setLevel(5); // 줌 레벨 조정
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] h-[80%] max-w-6xl max-h-[800px] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <h2 className="text-xl font-bold">강사 찾기</h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-300">
            <IoClose />
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="검색어 입력"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md pr-10"
            />
            <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {/* 위치 정보 및 현재 위치 버튼 */}
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-gray-600">
              {locationError ? (
                <span className="text-orange-600">{locationError}</span>
              ) : (
                <span className="text-green-600">
                  현재 위치: {currentLocation?.lat.toFixed(4)},{' '}
                  {currentLocation?.lng.toFixed(4)}
                </span>
              )}
            </div>
            <button
              onClick={moveToCurrentLocation}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              disabled={!currentLocation}
            >
              현재 위치로 이동
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 사이드바 - 필터 */}
          <div className="w-64 bg-white border-r p-4 overflow-y-auto">
            <h3 className="font-bold mb-4">필터</h3>

            {/* 성별 필터 */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">성별</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>남</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>여</span>
                </label>
              </div>
            </div>

            {/* 지역 필터 */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">지역</h4>
              <input
                type="text"
                placeholder="지역 추가하기"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            {/* 종류 필터 */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">종류</h4>
              <div className="space-y-2">
                {['PT', '수영', '요가', '헬스', '필라테스'].map((category) => (
                  <label key={category} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 지도 영역 */}
          <div className="flex-1 relative">
            <div
              ref={mapRef}
              className="w-full h-full"
              style={{ minHeight: '400px' }}
            />

            {/* 선택된 트레이너 정보 카드 */}
            {selectedTrainer && (
              <div className="absolute top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 w-80 max-w-sm">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    <img
                      src="/api/placeholder/80/80"
                      alt="트레이너"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">
                        {selectedTrainer.userName}
                      </h4>
                      <span className="text-sm text-gray-500">강사님</span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm">
                        {selectedTrainer.rating || 0}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({selectedTrainer.reviewCount || 0}개)
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">
                      {selectedTrainer.gym?.gym || '정보 없음'}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {selectedTrainer.gym?.gymAddress || '주소 정보 없음'}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600">
                        {selectedTrainer.minPrice
                          ? `${selectedTrainer.minPrice.toLocaleString()}원부터`
                          : '가격 문의'}
                      </span>
                      <button
                        onClick={() => {
                          onTrainerSelect(selectedTrainer);
                          onClose();
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        선택
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerMapModal;
