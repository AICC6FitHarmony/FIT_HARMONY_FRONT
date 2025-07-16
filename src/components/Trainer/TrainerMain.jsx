// TrainerMain.jsx - 페이징 처리 수정
import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrainers } from '../../js/redux/slice/sliceTrainer';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FaListUl, FaStar } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { MdDialpad } from 'react-icons/md';
import TrainerMapModal from './TrainerMapModal'; // 위에서 만든 컴포넌트
import { useAuth } from '../../js/login/AuthContext';
import StandardModal from '../cmmn/StandardModal';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// 스켈레톤 컴포넌트
const SkeletonCard = ({ mode }) => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
    <div
      className={
        mode === 'grid'
          ? 'p-1.5 sm:p-2 md:p-3 rounded-lg bg-white flex sm:flex-col items-center sm:items-stretch gap-2 sm:gap-0'
          : 'flex bg-white p-2 sm:p-3 md:p-4 rounded-xl items-center gap-2 sm:gap-3 md:gap-4'
      }
    >
      <div
        className={
          mode === 'grid'
            ? 'mb-0 sm:mb-1 md:mb-2 h-20 w-20 sm:h-40 sm:w-auto flex-shrink-0'
            : 'w-16 h-14 sm:w-32 sm:h-24 md:w-40 md:h-32 flex-shrink-0'
        }
      >
        <Skeleton height="100%" width="100%" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <Skeleton height={20} width="70%" />
          <Skeleton height={16} width="50%" />
        </div>
        <Skeleton height={14} width="80%" className="mt-0.5 sm:mt-1" />
        <Skeleton height={14} width="90%" className="mt-0.5 sm:mt-1" />
        <Skeleton height={14} width="60%" className="mt-0.5 sm:mt-1" />
        {mode === 'horizontal' && (
          <Skeleton
            height={14}
            width="100%"
            className="mt-1 sm:mt-2"
            count={2}
          />
        )}
      </div>
    </div>
  </SkeletonTheme>
);

const TrainerMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const trainers = useSelector((state) => state.trainer.trainers);
  const status = useSelector((state) => state.trainer.status);
  const error = useSelector((state) => state.trainer.error);

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
  const [displayedResult, setDisplayedResult] = useState([]);
  const [listMode, setListMode] = useState('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('최신순');
  const [showMapModal, setShowMapModal] = useState(false); // 지도 모달 상태 추가
  const [showMobileFilter, setShowMobileFilter] = useState(false); // 모바일 필터 토글 상태 추가
  const [showLoginModal, setShowLoginModal] = useState(false); // 로그인 모달 상태 추가

  // 필터 상태
  const [filters, setFilters] = useState({
    rating: 0,
    gender: '',
    location: '',
    categories: [],
    minPrice: 10000,
    maxPrice: 500000,
  });

  // 페이지 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // 로그인 상태 확인
  useEffect(() => {
    if (!authLoading && !user?.isLoggedIn) {
      setShowLoginModal(true);
    }
  }, [authLoading, user?.isLoggedIn]);

  // 백엔드에서 초기 데이터 가져오기
  useEffect(() => {
    if (!authLoading && user?.isLoggedIn) {
      dispatch(
        fetchTrainers({
          limit: 1000,
          offset: 0,
        })
      );
    }
  }, [dispatch, authLoading, user?.isLoggedIn]);

  // 로그인 모달 확인 버튼 클릭 시
  const handleLoginModalOK = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  // 로그인 모달 취소 버튼 클릭 시
  const handleLoginModalCancel = () => {
    setShowLoginModal(false);
    navigate('/');
  };

  // 백엔드에서 받은 데이터를 프론트엔드에서 사용할 형태로 변환
  const transformTrainerData = (trainersData) => {
    if (!trainersData || !Array.isArray(trainersData)) return [];

    return trainersData.map((trainer) => {
      const genderMap = { M: '남', F: '여' };
      const gender = genderMap[trainer.gender] || trainer.gender || '정보없음';
      const categories = ['PT'];

      return {
        userId: trainer.userId,
        userName: trainer.userName,
        fileId: trainer.fileId,
        gender: gender,
        gym: {
          gym: trainer.gym,
          gymAddress: trainer.gymAddress,
        },
        minPrice: trainer.minPrice,
        rating: trainer.rating || 0,
        reviewCount: trainer.reviewCount || 0,
        categories: categories[0] || 'PT',
        allCategories: categories,
        priceRange: trainer.minPrice
          ? `${trainer.minPrice.toLocaleString()}원부터`
          : '가격 정보 없음',
        introduction: '전문 트레이너입니다.',
      };
    });
  };

  // 백엔드 데이터 변환 및 초기 설정
  useEffect(() => {
    if (status === 'succeeded' && trainers) {
      const transformedTrainers = transformTrainerData(trainers.data);
      setSearchResult(transformedTrainers);
    }
  }, [status, trainers]);

  // 필터 적용 함수
  const applyFilters = (data) => {
    return data.filter((trainer) => {
      if (filters.rating > 0 && Math.floor(trainer.rating) !== filters.rating) {
        return false;
      }
      if (filters.gender && trainer.gender !== filters.gender) {
        return false;
      }
      if (
        filters.location &&
        !trainer.gym?.gymAddress?.includes(filters.location)
      ) {
        return false;
      }
      if (
        filters.categories.length > 0 &&
        !filters.categories.some((category) =>
          trainer.allCategories.includes(category)
        )
      ) {
        return false;
      }
      if (
        trainer.minPrice &&
        (trainer.minPrice < filters.minPrice ||
          trainer.minPrice > filters.maxPrice)
      ) {
        return false;
      }
      return true;
    });
  };

  // 검색 및 필터 적용
  useEffect(() => {
    let result = searchResult;

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      result = result.filter(
        (trainer) =>
          trainer.userName.toLowerCase().includes(keyword) ||
          trainer.gym?.gym?.toLowerCase().includes(keyword) ||
          trainer.gym?.gymAddress?.toLowerCase().includes(keyword)
      );
    }

    result = applyFilters(result);
    setFilteredResult(result);
    setTotalItems(result.length);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchResult, search, filters]);

  // 페이지 변경 시 표시할 데이터 계산
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredResult.slice(startIndex, endIndex);
    setDisplayedResult(currentData);
  }, [filteredResult, currentPage, itemsPerPage]);

  // 적용된 필터 개수 계산
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.rating > 0) count++;
    if (filters.gender) count++;
    if (filters.location) count++;
    if (filters.categories.length > 0) count++;
    if (filters.minPrice !== 10000 || filters.maxPrice !== 500000) count++;
    return count;
  };

  // 모바일 필터 열림/닫힘 시 스크롤 방지
  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilter]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortDropdown && !event.target.closest('.relative')) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown]);

  const handleSearch = () => {
    // 검색은 useEffect에서 자동으로 처리됨
  };

  // 필터 변경 함수들
  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
    // 모바일에서 필터 적용 후 자동으로 닫기
    if (window.innerWidth < 1024) {
      setTimeout(() => setShowMobileFilter(false), 300);
    }
  };

  const handleGenderChange = (gender) => {
    setFilters((prev) => ({
      ...prev,
      gender: prev.gender === gender ? '' : gender,
    }));
    // 모바일에서 필터 적용 후 자동으로 닫기
    if (window.innerWidth < 1024) {
      setTimeout(() => setShowMobileFilter(false), 300);
    }
  };

  const handleLocationChange = (location) => {
    setFilters((prev) => ({ ...prev, location }));
  };

  const handleCategoryToggle = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
    // 모바일에서 필터 적용 후 자동으로 닫기
    if (window.innerWidth < 1024) {
      setTimeout(() => setShowMobileFilter(false), 300);
    }
  };

  const handlePriceChange = (type, value) => {
    // 8자리 이상 입력 제한
    if (value.length > 8) {
      return;
    }
    setFilters((prev) => ({ ...prev, [type]: parseInt(value) }));
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilters({
      rating: 0,
      gender: '',
      location: '',
      categories: [],
      minPrice: 10000,
      maxPrice: 500000,
    });
    // 모바일에서 필터 초기화 후 자동으로 닫기
    if (window.innerWidth < 1024) {
      setTimeout(() => setShowMobileFilter(false), 300);
    }
  };

  // 정렬 함수
  const handleSort = (sortType) => {
    setSortBy(sortType);
    setShowSortDropdown(false);

    const sortedResults = [...filteredResult].sort((a, b) => {
      switch (sortType) {
        case '리뷰 많은 순':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case '조회순':
          return b.userId - a.userId;
        case '별점순':
          return (b.rating || 0) - (a.rating || 0);
        case '가격 낮은순':
          return (a.minPrice || Infinity) - (b.minPrice || Infinity);
        case '가격 높은순':
          return (b.minPrice || 0) - (a.minPrice || 0);
        case '최신순':
        default:
          return b.userId - a.userId;
      }
    });

    setFilteredResult(sortedResults);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleReadMore = (userId) => {
    navigate(`/trainer/${userId}`);
  };

  // 지도에서 트레이너 선택 시 처리
  const handleTrainerSelectFromMap = (trainer) => {
    handleReadMore(trainer.userId);
  };

  // 페이지 번호 생성
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 10;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const currentGroup = Math.ceil(currentPage / maxVisiblePages);
      const startPage = (currentGroup - 1) * maxVisiblePages + 1;
      const endPage = Math.min(currentGroup * maxVisiblePages, totalPages);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevGroup = () => {
    const currentGroup = Math.ceil(currentPage / 10);
    if (currentGroup > 1) {
      const newPage = (currentGroup - 2) * 10 + 1;
      handlePageChange(newPage);
    }
  };

  const handleNextGroup = () => {
    const currentGroup = Math.ceil(currentPage / 10);
    const maxGroup = Math.ceil(totalPages / 10);
    if (currentGroup < maxGroup) {
      const newPage = currentGroup * 10 + 1;
      handlePageChange(newPage);
    }
  };

  const pageNumbers = getPageNumbers();
  const showPrevGroup = Math.ceil(currentPage / 10) > 1;
  const showNextGroup =
    Math.ceil(currentPage / 10) < Math.ceil(totalPages / 10);

  return (
    <div className="main-wrapper pt-20 w-full px-4 lg:px-6">
      <div className="search-title">
        <div className="flex justify-center">
          <h2 className="text-xl md:text-2xl">강사 찾기</h2>
        </div>
        <div className="pt-5 flex justify-center items-center px-4">
          <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
            <input
              type="text"
              placeholder="검색어를 입력해 주세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              className="border-2 bg-white border-[#1a7d45] rounded-md w-full h-[40px] shadow-md pr-10 pl-4 text-sm md:text-base"
            />
            <button
              onClick={handleSearch}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 text-xl md:text-2xl text-[#1a7d45] hover:text-black"
            >
              <IoSearchOutline />
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 필터 버튼 */}
      <div className="flex justify-center lg:hidden mt-4">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="flex items-center gap-2 bg-[#1a7d45] text-white px-4 py-2 rounded-lg hover:bg-[#155a35] transition-colors relative"
        >
          <span>필터 검색</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {getActiveFiltersCount()}
            </span>
          )}
          <span
            className={`transition-transform ${
              showMobileFilter ? 'rotate-180' : ''
            }`}
          >
            ▼
          </span>
        </button>
      </div>

      <div className="search-results flex flex-col lg:flex-row mt-6 lg:mt-10">
        <div className="flex flex-col lg:flex-row w-full gap-3 lg:gap-5 p-3">
          {/* 모바일 필터 오버레이 */}
          {showMobileFilter && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilter(false)}
            />
          )}

          {/* 필터 사이드바 */}
          <div
            className={`trainer-navbar w-full lg:w-[20%] xl:w-[18%] mb-6 lg:mb-0 lg:sticky z-50 top-20 border-2 border-gray-200 bg-white rounded-lg shadow-md p-3 md:p-4 h-fit transition-all duration-300 ${
              showMobileFilter
                ? 'fixed top-4 left-4 right-4 max-h-[80vh] overflow-y-auto lg:static lg:max-h-none lg:overflow-visible shadow-2xl'
                : 'hidden lg:block'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base md:text-lg font-semibold">필터 검색</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-xs md:text-sm text-gray-500 hover:text-red-500"
                >
                  초기화
                </button>
                {/* 모바일에서만 닫기 버튼 표시 */}
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 text-lg"
                >
                  ×
                </button>
              </div>
            </div>

            {/* 별점 필터 */}
            <div className="filter-section mb-4 md:mb-6">
              <h4 className="font-medium mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm">
                  1
                </span>
                별점
              </h4>
              <div className="flex flex-col gap-1 md:gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === 0}
                    onChange={() => handleRatingChange(0)}
                    className="w-3 h-3 md:w-4 md:h-4"
                  />
                  <span className="text-xs md:text-sm">전체</span>
                </label>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="w-3 h-3 md:w-4 md:h-4"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <FaStar
                          key={i}
                          className="text-yellow-400 text-xs md:text-sm"
                        />
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 성별 필터 */}
            <div className="filter-section mb-4 md:mb-6">
              <h4 className="font-medium mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm">
                  2
                </span>
                성별
              </h4>
              <div className="flex gap-2 md:gap-4">
                {['남', '여'].map((gender) => (
                  <label
                    key={gender}
                    className="flex items-center gap-2 hover:bg-orange-100 rounded-2xl cursor-pointer p-1"
                  >
                    <input
                      type="checkbox"
                      checked={filters.gender === gender}
                      onChange={() => handleGenderChange(gender)}
                      className="w-3 h-3 md:w-4 md:h-4"
                    />
                    <span className="text-xs md:text-sm">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 지역 필터 */}
            <div className="filter-section mb-4 md:mb-6">
              <h4 className="font-medium mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm">
                  3
                </span>
                지역
              </h4>
              <button
                onClick={() => setShowMapModal(true)}
                className="hover:text-green-500 cursor-pointer text-blue-600 underline mb-2 text-xs md:text-sm"
              >
                지도로 보기
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="지역 추가하기"
                  value={filters.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-xs md:text-sm"
                  maxLength="20"
                />
                {filters.location && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="bg-gray-100 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-2">
                      {filters.location}
                      <button
                        onClick={() => handleLocationChange('')}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 종류 필터 */}
            <div className="filter-section mb-4 md:mb-6">
              <h4 className="font-medium mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm">
                  4
                </span>
                종류
              </h4>
              <div className="flex flex-col gap-1 md:gap-2">
                {['PT', '수영', '요가', '헬스', '필라테스'].map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 hover:bg-orange-100 rounded-2xl cursor-pointer p-1"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-3 h-3 md:w-4 md:h-4"
                    />
                    <span className="text-xs md:text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 가격 필터 */}
            <div className="filter-section mb-4 md:mb-6">
              <h4 className="font-medium mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm">
                  5
                </span>
                가격
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs md:text-sm text-gray-600 mb-1">
                    최소 가격
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handlePriceChange('minPrice', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-xs md:text-sm"
                    min="0"
                    step="10000"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm text-gray-600 mb-1">
                    최대 가격
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handlePriceChange('maxPrice', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-xs md:text-sm"
                    min="0"
                    step="10000"
                  />
                </div>
                <div className="text-xs md:text-sm text-gray-500 text-center">
                  {filters.minPrice.toLocaleString()}원 ~{' '}
                  {filters.maxPrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          <div className="trainer-container bg-orange-50 w-full lg:w-[80%] flex flex-col">
            <div className="array-wrapper flex flex-col sm:flex-row w-full justify-between p-1 sm:p-2 gap-2 sm:gap-3 lg:gap-0">
              <div className="relative">
                <button
                  className="trainer-array bg-white w-full sm:w-32 rounded-2xl h-10 flex items-center justify-center gap-2 hover:underline px-4 text-sm md:text-base"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  {sortBy} <TiArrowSortedDown />
                </button>

                {showSortDropdown && (
                  <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-full sm:w-36">
                    <ul className="py-2">
                      {[
                        '최신순',
                        '리뷰 많은 순',
                        '조회순',
                        '별점순',
                        '가격 낮은순',
                        '가격 높은순',
                      ].map((sortOption) => (
                        <li key={sortOption}>
                          <button
                            className="w-full text-center px-4 py-3 hover:bg-gray-100 text-xs md:text-sm"
                            onClick={() => handleSort(sortOption)}
                          >
                            {sortOption}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm text-gray-600">
                  총 {totalItems}개 결과 (페이지 {currentPage}/{totalPages})
                </span>
                <button
                  className="trainer-array bg-white w-12 h-10 rounded-2xl flex items-center justify-center gap-2 hover:text-[#1a7d45] text-lg md:text-2xl"
                  onClick={() =>
                    setListMode(listMode === 'grid' ? 'horizontal' : 'grid')
                  }
                >
                  {listMode === 'grid' ? <FaListUl /> : <MdDialpad />}
                </button>
              </div>
            </div>

            <div className="trainer-list px-2 sm:px-3 py-3 sm:py-4 h-auto">
              <div
                className={
                  listMode === 'grid'
                    ? 'list-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4'
                    : 'flex flex-col gap-2 sm:gap-3 md:gap-4'
                }
              >
                {status === 'loading' &&
                  Array.from({ length: 8 }).map((_, index) => (
                    <SkeletonCard key={index} mode={listMode} />
                  ))}
                {status === 'failed' && (
                  <p className="text-sm md:text-base">Error: {error}</p>
                )}
                {status === 'succeeded' && displayedResult.length > 0 ? (
                  displayedResult.map((trainer, idx) => (
                    <div
                      key={trainer.userId}
                      onClick={() => handleReadMore(trainer.userId)}
                      className={
                        listMode === 'grid'
                          ? 'cursor-pointer hover:shadow-lg p-1.5 sm:p-2 md:p-3 rounded-lg bg-white transition-shadow flex sm:flex-col items-center sm:items-stretch gap-2 sm:gap-0'
                          : 'cursor-pointer hover:shadow-md flex bg-white p-2 sm:p-3 md:p-4 rounded-xl items-center gap-2 sm:gap-3 md:gap-4 transition-shadow'
                      }
                    >
                      <div
                        className={
                          listMode === 'grid'
                            ? 'img mb-0 sm:mb-1 md:mb-2 relative h-20 w-20 sm:h-40 sm:w-auto flex-shrink-0'
                            : 'w-16 h-14 sm:w-32 sm:h-24 md:w-40 md:h-32 relative flex-shrink-0'
                        }
                      >
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_DOMAIN
                          }/common/file/${trainer.fileId}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="rounded-lg sm:rounded-2xl text-shadow-2xs text-xs text-white border-1 px-1 sm:px-2 w-auto bg-black opacity-50 absolute bottom-0.5 sm:bottom-1 md:bottom-2 left-0.5 sm:left-1 md:left-2">
                          {trainer.categories}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-0.5 sm:gap-1">
                          <div className="flex items-baseline gap-1">
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold truncate">
                              {trainer.userName}
                            </p>
                            <p className="text-xs text-gray-400 flex-shrink-0">
                              강사님
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-xs">{trainer.rating}</span>
                            <span className="text-xs text-gray-400">
                              ({trainer.reviewCount}개)
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-800 mt-0.5 sm:mt-1 truncate">
                          {trainer.gym?.gym || '정보 없음'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                          {trainer.gym?.gymAddress || '주소 정보 없음'}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-[#1a7d45] mt-0.5 sm:mt-1">
                          {trainer.minPrice
                            ? `${trainer.minPrice.toLocaleString()}원부터`
                            : '가격 문의'}
                        </p>

                        {listMode === 'horizontal' && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 line-clamp-2">
                            {trainer.introduction || '소개글이 없습니다.'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center w-full pt-10 text-sm md:text-base">
                    검색 결과가 없습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
            {totalPages > 1 && (
              <div className="page-number flex flex-wrap items-center justify-center my-6 md:my-10 gap-2 md:gap-4">
                {showPrevGroup && (
                  <button
                    onClick={handlePrevGroup}
                    className="text-blue-600 hover:underline text-sm md:text-base px-2 py-1"
                  >
                    이전
                  </button>
                )}

                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-2 md:px-3 py-1 md:py-2 mx-1 w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center text-xs md:text-sm transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#1a7d45] text-white'
                        : 'text-blue-600 hover:underline hover:text-[#1a7d45]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {showNextGroup && (
                  <button
                    onClick={handleNextGroup}
                    className="px-2 md:px-3 py-1 md:py-2 text-blue-600 hover:underline text-sm md:text-base"
                  >
                    다음
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <TrainerMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        trainers={filteredResult}
        onTrainerSelect={handleTrainerSelectFromMap}
      />

      {showLoginModal && (
        <StandardModal
          title="로그인이 필요합니다"
          closeEvent={handleLoginModalCancel}
          okEvent={handleLoginModalOK}
          cancelEvent={handleLoginModalCancel}
          size={{ width: '400px', height: 'auto' }}
        >
          <p>강사를 찾으시려면 로그인이 필요합니다.</p>
        </StandardModal>
      )}
    </div>
  );
};

export default TrainerMain;
