import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
  fetchTrainerDetail,
  fetchTrainerProduct,
  fetchTrainerReview,
} from '../../js/redux/slice/sliceTrainer';
import { MapPin, Star, Navigation } from 'lucide-react';
import Swal from 'sweetalert2';

const TrainerReadMore = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  // 지도 관련 상태
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // 자기소개 더보기 상태
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTrainerDetail(userId));
      dispatch(fetchTrainerProduct(userId));
      dispatch(fetchTrainerReview(userId));
    }
  }, [userId, dispatch]);

  const detail = useSelector((state) => state.trainer.trainers.detail);
  const status = useSelector((state) => state.trainer.status);
  const error = useSelector((state) => state.trainer.error);
  const product = useSelector((state) => state.trainer.trainers.product);
  const review = useSelector((state) => state.trainer.trainers.review);

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
          maximumAge: 300000,
        }
      );
    });
  };

  // IP 기반 위치 가져오기
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
    const initLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setCurrentLocation(location);
        setLocationError(null);
        setLocationLoading(false);
      } catch (gpsError) {
        console.warn('GPS 위치 가져오기 실패:', gpsError);
        try {
          const location = await getLocationByIP();
          setCurrentLocation(location);
          setLocationError(null);
          setLocationLoading(false);
        } catch (ipError) {
          console.warn('IP 기반 위치 가져오기 실패:', ipError);
          setLocationError('위치 정보를 가져올 수 없습니다.');
          setCurrentLocation({ lat: 37.5665, lng: 126.978 });
          setLocationLoading(false);
        }
      }
    };

    // 위치 정보 초기화를 비동기로 처리하여 컴포넌트 렌더링을 차단하지 않음
    initLocation().catch((error) => {
      console.error('위치 정보 초기화 실패:', error);
      setLocationError('위치 정보를 초기화할 수 없습니다.');
      setCurrentLocation({ lat: 37.5665, lng: 126.978 });
      setLocationLoading(false);
    });
  }, []);

  // 두 지점 간의 거리 계산 (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // 카카오맵 초기화
  useEffect(() => {
    if (!detail) return;

    setMapLoading(true);
    setMapError(null);

    const initKakaoMap = () => {
      try {
        window.kakao.maps.load(() => {
          try {
            const container = mapRef.current;
            if (!container) {
              setMapLoading(false);
              return;
            }

            const gymAddress = detail.gymAddress || detail.gym?.gymAddress;
            if (!gymAddress) {
              setMapError('헬스장 주소 정보가 없습니다.');
              setMapLoading(false);
              return;
            }

            const geocoder = new window.kakao.maps.services.Geocoder();

            // 주소로 좌표 검색
            geocoder.addressSearch(gymAddress, (result, status) => {
              try {
                if (status === window.kakao.maps.services.Status.OK) {
                  const coords = new window.kakao.maps.LatLng(
                    result[0].y,
                    result[0].x
                  );

                  const options = {
                    center: coords,
                    level: 3,
                  };

                  const mapInstance = new window.kakao.maps.Map(
                    container,
                    options
                  );
                  setMap(mapInstance);

                  // 트레이너 위치 마커
                  const trainerMarker = new window.kakao.maps.Marker({
                    position: coords,
                    map: mapInstance,
                    title: detail.userName || '트레이너',
                  });
                  setMarker(trainerMarker);

                  // 현재 위치가 있으면 마커 추가 및 거리 계산
                  if (currentLocation && !locationError) {
                    try {
                      const currentCoords = new window.kakao.maps.LatLng(
                        currentLocation.lat,
                        currentLocation.lng
                      );

                      const currentMarker = new window.kakao.maps.Marker({
                        position: currentCoords,
                        map: mapInstance,
                        title: '현재 위치',
                      });

                      // 현재 위치 마커 스타일
                      const markerImage = new window.kakao.maps.MarkerImage(
                        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                        new window.kakao.maps.Size(24, 35)
                      );
                      currentMarker.setImage(markerImage);
                      setCurrentLocationMarker(currentMarker);

                      // 거리 계산
                      const dist = calculateDistance(
                        currentLocation.lat,
                        currentLocation.lng,
                        result[0].y,
                        result[0].x
                      );
                      setDistance(dist);
                    } catch (locationError) {
                      console.warn('현재 위치 마커 추가 실패:', locationError);
                    }
                  }

                  setMapLoading(false);
                } else {
                  setMapError('주소를 찾을 수 없습니다.');
                  setMapLoading(false);
                }
              } catch (geocodeError) {
                console.error('지도 생성 실패:', geocodeError);
                setMapError('지도를 생성할 수 없습니다.');
                setMapLoading(false);
              }
            });
          } catch (mapError) {
            console.error('지도 초기화 실패:', mapError);
            setMapError('지도 초기화에 실패했습니다.');
            setMapLoading(false);
          }
        });
      } catch (kakaoError) {
        console.error('카카오맵 로드 실패:', kakaoError);
        setMapError('지도 서비스를 로드할 수 없습니다.');
        setMapLoading(false);
      }
    };

    if (!window.kakao) {
      // 카카오맵 API 키 확인
      const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;
      if (!kakaoMapKey) {
        console.warn('카카오맵 API 키가 설정되지 않았습니다.');
        setMapError('지도 서비스를 사용할 수 없습니다.');
        setMapLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`;
      document.head.appendChild(script);
      script.onload = initKakaoMap;
      script.onerror = () => {
        console.error('카카오맵 스크립트 로드 실패');
        setMapError('지도 스크립트를 로드할 수 없습니다.');
        setMapLoading(false);
      };
    } else {
      initKakaoMap();
    }
  }, [detail, currentLocation, locationError]);

  // 컴포넌트 언마운트 시 마커 정리
  useEffect(() => {
    return () => {
      try {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
        if (currentLocationMarker && currentLocationMarker.setMap) {
          currentLocationMarker.setMap(null);
        }
      } catch (error) {
        console.warn('마커 정리 중 오류:', error);
      }
    };
  }, [marker, currentLocationMarker]);

  const handleConsultationRequest = () => {
    alert('상담 요청이 접수되었습니다! 곧 연락드리겠습니다.');
  };

  // 강의 신청 확인 데이터 전달 swal 사용
  const handleServiceClick = (p) => {
    Swal.fire({
      title: `${p.name} 강의를 신청하시겠습니까?`,
      text: '신청 후에는 상담을 통해 일정 조율이 진행됩니다.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '신청하기',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ 서버 요청 또는 처리 로직
        //fetch 요청 추가
        fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/trainer/product/buy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productId: p.productId,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              //  성공 메시지 표시
              Swal.fire({
                title: '신청 완료!',
                text: '상담 요청이 접수되었습니다. 곧 연락드리겠습니다.',
                icon: 'success',
                confirmButtonText: '확인',
              });
            } else {
              // 실패했을 때 실패 메시지 표시
              Swal.fire({
                title: '신청 실패',
                text: data.msg || '신청 중 오류가 발생했습니다.',
                icon: 'error',
                confirmButtonText: '확인',
              });
            }
          })
          .catch((error) => {
            console.error('신청 오류:', error);
            Swal.fire({
              title: '신청 실패',
              text: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
              icon: 'error',
              confirmButtonText: '확인',
            });
          });
      }
    });
  };
  const handleContactClick = (type) => {
    try {
      switch (type) {
        case 'location':
          if (!map) {
            alert('지도를 로드할 수 없습니다.');
            return;
          }
          if (mapError) {
            alert(mapError);
            return;
          }
          map.setLevel(2); // 줌인
          break;
        case 'directions':
          const gymAddress = detail.gymAddress || detail.gym?.gymAddress;
          if (!gymAddress) {
            alert('헬스장 주소 정보가 없어 길찾기를 할 수 없습니다.');
            return;
          }
          try {
            const url = `https://map.kakao.com/link/to/${encodeURIComponent(
              gymAddress
            )},${gymAddress}`;
            window.open(url, '_blank');
          } catch (error) {
            console.error('길찾기 URL 생성 실패:', error);
            alert('길찾기 서비스를 열 수 없습니다.');
          }
          break;
        default:
          console.warn('알 수 없는 연락 방식:', type);
          break;
      }
    } catch (error) {
      console.error('연락처 클릭 처리 실패:', error);
      alert('요청을 처리할 수 없습니다.');
    }
  };

  // 로딩 상태 처리
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>트레이너 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // detail이 없거나 빈 객체인 경우 처리
  if (!detail || Object.keys(detail).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">트레이너 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-8">
            {/* 프로필 이미지 */}
            <div className="relative">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_DOMAIN}/common/file/${
                      detail.fileId
                    }`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-sm">✨</span>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="flex-1">
              <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
                TRAINER
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {detail?.userName || detail?.name || '트레이너'}
              </h1>
              <p className="text-gray-600 mb-4">
                건강한 변화의 시작, 함께 만들어가요
              </p>

              {/* 통계 */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {detail?.rating || '없음'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">평점</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {detail?.fitHistory || '없음'}
                  </div>
                  <div className="text-sm text-gray-500">경력</div>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleConsultationRequest}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              상담 요청하기
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 자기소개 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                자기소개
              </h2>
              <div className="prose text-gray-700 leading-relaxed">
                {(() => {
                  const introduction = `안녕하세요! 건강한 삶을 추구하는 ${
                    detail?.userName || detail?.name || '트레이너'
                  } 트레이너입니다.`;
                  const title = detail?.title || '';
                  const content = detail?.content || '';

                  // 전체 텍스트 합치기
                  const fullText = `${introduction} ${title} ${content}`.trim();

                  // 150글자 이상인지 확인
                  const isLongText = fullText.length > 150;
                  const displayText =
                    isLongText && !showFullDescription
                      ? fullText.substring(0, 150) + '...'
                      : fullText;

                  return (
                    <div>
                      <p className="mb-4 whitespace-pre-wrap">{displayText}</p>

                      {isLongText && (
                        <button
                          onClick={() =>
                            setShowFullDescription(!showFullDescription)
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors"
                        >
                          {showFullDescription ? '접기' : '상세설명 더보기'}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
            {/* 제공 서비스 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                제공 서비스
              </h2>

              <div className="space-y-4">
                {product && product.length > 0 ? (
                  product.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleServiceClick(p)}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {p.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {p.description || '설명 없음'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {p.sessionCnt}회 · {p.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-orange-600">
                            {p.price != null
                              ? `${p.price.toLocaleString()}원`
                              : '정보없음'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    등록된 상품이 없습니다.
                  </p>
                )}
              </div>
            </div>
            {/* 리뷰 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  리뷰
                </h2>
                <div className="bg-blue-50 px-4 py-2 rounded-full">
                  <span className="text-blue-700 font-semibold text-sm">
                    {detail?.reviewCount || '0'}개의 리뷰
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                {review?.length > 0 ? (
                  review.map((r, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {(r.userName || '익명')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {r.userName || '익명'}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < (r.rating || 0)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                {r.rating}점
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                            {r.formattedDate}
                          </span>
                        </div>
                      </div>

                      <div className="pl-13">
                        <p className="text-gray-700 leading-relaxed">
                          {r.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      등록된 리뷰가 없습니다
                    </p>
                    <p className="text-gray-400 text-sm">
                      첫 번째 리뷰를 남겨보세요!
                    </p>
                  </div>
                )}
              </div>
              <Link
                to={`/trainer/review/${userId}`}
                className="text-center my-4 hover:text-green-500 cursor-pointer block"
              >
                리뷰 전체보기
              </Link>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-8">
            {/* 위치 정보 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                위치 정보
              </h3>

              {/* 지도 */}
              <div className="mb-4 relative">
                {mapLoading && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">지도 로딩 중...</p>
                    </div>
                  </div>
                )}

                {mapError && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{mapError}</p>
                    </div>
                  </div>
                )}

                <div
                  ref={mapRef}
                  className="w-full h-48 bg-gray-100 rounded-lg border"
                  style={{ minHeight: '192px' }}
                />
              </div>

              {/* 위치 상세 정보 */}
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {detail?.gym || '헬스장 정보'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {detail?.gymAddress ||
                      detail?.gym?.gymAddress ||
                      '주소 정보 없음'}
                  </p>
                </div>

                {/* 거리 정보 */}
                {distance && !locationError && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Navigation className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        현재 위치에서 약 {distance.toFixed(1)}km
                      </span>
                    </div>
                  </div>
                )}

                {/* 현재 위치 로딩 중 */}
                {locationLoading && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      <span className="text-sm">현재 위치 확인 중...</span>
                    </div>
                  </div>
                )}

                {/* 위치 오류 메시지 */}
                {locationError && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-700">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{locationError}</span>
                    </div>
                  </div>
                )}

                {/* 액션 버튼들 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleContactClick('location')}
                    disabled={!map || mapError}
                    className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    지도 확대
                  </button>
                  <button
                    onClick={() => handleContactClick('directions')}
                    disabled={!detail?.gymAddress && !detail?.gym?.gymAddress}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Navigation className="w-4 h-4" />
                    길찾기
                  </button>
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
