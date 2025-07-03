// TrainerMain.jsx - 페이징 처리 수정
import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrainers } from '../../js/redux/slice/sliceTrainer';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FaListUl, FaStar } from 'react-icons/fa6';
import aa from '../Trainer/test/aa.png';
import { useNavigate } from 'react-router-dom';
import { MdDialpad } from 'react-icons/md';

const TrainerMain = () => {
  const dispatch = useDispatch();
  const trainers = useSelector((state) => state.trainer.trainers);
  const status = useSelector((state) => state.trainer.status);
  const error = useSelector((state) => state.trainer.error);

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
  const [displayedResult, setDisplayedResult] = useState([]); // 현재 페이지에 표시할 데이터
  const [listMode, setListMode] = useState('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('최신순');

  // 필터 상태
  const [filters, setFilters] = useState({
    rating: 0, // 별점
    gender: '', // 성별
    location: '', // 지역
    categories: [], // 종류 (PT, 수영, 요가 등)
    minPrice: 10000, // 최소 가격
    maxPrice: 500000, // 최대 가격
  });

  // 페이지 관리 - 프론트엔드에서 처리
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // 백엔드에서 초기 데이터 가져오기 (한 번만 실행)
  useEffect(() => {
    dispatch(
      fetchTrainers({
        limit: 1000, // 모든 데이터를 가져와서 프론트엔드에서 처리
        offset: 0,
      })
    );
  }, [dispatch]);

  // 백엔드에서 받은 데이터를 프론트엔드에서 사용할 형태로 변환
  const transformTrainerData = (trainersData) => {
    if (!trainersData || !Array.isArray(trainersData)) return [];

    return trainersData.map((trainer) => {
      // 성별 변환 (M -> 남, F -> 여)
      const genderMap = { M: '남', F: '여' };
      const gender = genderMap[trainer.gender] || trainer.gender || '정보없음';

      // 카테고리 설정 (실제 데이터가 없으므로 기본값 설정)
      const categories = ['PT']; // 기본 카테고리, 추후 백엔드에서 카테고리 정보가 오면 수정

      return {
        userId: trainer.userId,
        userName: trainer.userName,
        gender: gender,
        gym: {
          gym: trainer.gym,
          gymAddress: trainer.gymAddress,
        },
        minPrice: trainer.min, // 백엔드에서 min 컬럼으로 최소가격 제공
        rating: trainer.rating || 0,
        reviewCount: trainer.reviewCount || 0,
        categories: categories[0] || 'PT',
        allCategories: categories,
        priceRange: trainer.min
          ? `${trainer.min.toLocaleString()}원부터`
          : '가격 정보 없음',
        introduction: '전문 트레이너입니다.', // 기본 소개글, 추후 백엔드에서 제공되면 수정
      };
    });
  };

  // 백엔드 데이터 변환 및 초기 설정
  useEffect(() => {
    if (status === 'succeeded' && trainers) {
      console.log('Raw trainers data:', trainers);

      // 백엔드에서 받은 데이터 변환
      const transformedTrainers = transformTrainerData(trainers.data);
      console.log('Transformed trainers:', transformedTrainers);

      setSearchResult(transformedTrainers);
    }
  }, [status, trainers]);

  // 필터 적용 함수
  const applyFilters = (data) => {
    return data.filter((trainer) => {
      // 별점 필터
      if (filters.rating > 0 && trainer.rating < filters.rating) {
        return false;
      }

      // 성별 필터
      if (filters.gender && trainer.gender !== filters.gender) {
        return false;
      }

      // 지역 필터
      if (
        filters.location &&
        !trainer.gym?.gymAddress?.includes(filters.location)
      ) {
        return false;
      }

      // 종류 필터 - 모든 카테고리에서 확인
      if (
        filters.categories.length > 0 &&
        !filters.categories.some((category) =>
          trainer.allCategories.includes(category)
        )
      ) {
        return false;
      }

      // 가격 필터 - minPrice가 있을 때만 적용
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

    // 검색어 필터링
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      result = result.filter(
        (trainer) =>
          trainer.userName.toLowerCase().includes(keyword) ||
          trainer.gym?.gym?.toLowerCase().includes(keyword) ||
          trainer.gym?.gymAddress?.toLowerCase().includes(keyword)
      );
    }

    // 필터 적용
    result = applyFilters(result);

    setFilteredResult(result);
    setTotalItems(result.length);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  }, [searchResult, search, filters]);

  // 페이지 변경 시 표시할 데이터 계산
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredResult.slice(startIndex, endIndex);
    setDisplayedResult(currentData);
  }, [filteredResult, currentPage, itemsPerPage]);

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

  console.log('Trainers data:', trainers);
  console.log('Filtered result:', filteredResult);
  console.log('Displayed result:', displayedResult);
  console.log('Current page:', currentPage, 'Total pages:', totalPages);

  const handleSearch = () => {
    // 검색은 useEffect에서 자동으로 처리됨
  };

  // 필터 변경 함수들
  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const handleGenderChange = (gender) => {
    setFilters((prev) => ({
      ...prev,
      gender: prev.gender === gender ? '' : gender,
    }));
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
  };

  const handlePriceChange = (type, value) => {
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
          // 실제 조회수 데이터가 없다면 userId 기준 (임시)
          return b.userId - a.userId;
        case '별점순':
          return (b.rating || 0) - (a.rating || 0);
        case '가격 낮은순':
          return (a.minPrice || Infinity) - (b.minPrice || Infinity);
        case '가격 높은순':
          return (b.minPrice || 0) - (a.minPrice || 0);
        case '최신순':
        default:
          return b.userId - a.userId; // 최신 가입한 트레이너 순
      }
    });

    setFilteredResult(sortedResults);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const navigate = useNavigate();
  const handleReadMore = (userId) => {
    navigate(`/trainer/${userId}`);
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
    <div className="main-wrapper pt-20 w-full">
      <div className="search-title">
        <div className="flex justify-center">
          <h2 className="text-2xl">강사 찾기</h2>
        </div>
        <div className="pt-5 flex justify-center items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="검색어를 입력해 주세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              className="border-2 bg-white border-[#1a7d45] rounded-md w-[35rem] h-[40px] shadow-md pr-10 pl-4"
            />
            <button
              onClick={handleSearch}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 text-2xl text-[#1a7d45] hover:text-black"
            >
              <IoSearchOutline />
            </button>
          </div>
        </div>
      </div>

      <div className="search-results flex mt-10">
        <div className="flex w-full gap-5 p-3">
          {/* 필터 사이드바 */}
          <div className="trainer-navbar w-[20%]  mb-30 sticky z-10 top-20 border-2 border-gray-200 bg-white rounded-lg shadow-md p-4 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">필터 검색</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                초기화
              </button>
            </div>

            {/* 별점 필터 */}
            <div className="filter-section mb-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  1
                </span>
                별점
              </h4>
              <div className="flex flex-col gap-2">
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
                      className="w-4 h-4"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                      <span className="text-sm">이상</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 성별 필터 */}
            <div className="filter-section mb-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  2
                </span>
                성별
              </h4>
              <div className="flex gap-4">
                {['남', '여'].map((gender) => (
                  <label
                    key={gender}
                    className="flex items-center gap-2 hover:bg-orange-100 rounded-2xl cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.gender === gender}
                      onChange={() => handleGenderChange(gender)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 지역 필터 */}
            <div className="filter-section mb-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  3
                </span>
                지역
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="지역 추가하기"
                  value={filters.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                {filters.location && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
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
            <div className="filter-section mb-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  4
                </span>
                종류
              </h4>
              <div className="flex flex-col gap-2">
                {['PT', '수영', '요가', '헬스', '필라테스'].map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 hover:bg-orange-100 rounded-2xl cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 가격 필터 */}
            <div className="filter-section mb-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  5
                </span>
                가격
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    최소 가격
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handlePriceChange('minPrice', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                    step="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    최대 가격
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handlePriceChange('maxPrice', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                    step="10000"
                  />
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {filters.minPrice.toLocaleString()}원 ~{' '}
                  {filters.maxPrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          <div className="trainer-container bg-orange-50 w-[80%] flex flex-col">
            <div className="array-wrapper flex w-full justify-between p-2">
              <div className="relative">
                <button
                  className="trainer-array bg-white w-30 rounded-2xl h-10 flex items-center justify-center gap-2 hover:underline px-4"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  {sortBy} <TiArrowSortedDown />
                </button>

                {/* 정렬 드롭다운 */}
                {showSortDropdown && (
                  <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-36">
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
                            className="w-full text-center px-4 py-3 hover:bg-gray-100 text-sm"
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
                <span className="text-sm text-gray-600">
                  총 {totalItems}개 결과 (페이지 {currentPage}/{totalPages})
                </span>
                <button
                  className="trainer-array bg-white w-15 rounded-2xl h-10 flex items-center justify-center gap-2 hover:text-[#1a7d45] text-2xl"
                  onClick={() =>
                    setListMode(listMode === 'grid' ? 'horizontal' : 'grid')
                  }
                >
                  {listMode === 'grid' ? <FaListUl /> : <MdDialpad />}
                </button>
              </div>
            </div>

            <div className="trainer-list px-3 py-4 h-auto">
              <div
                className={
                  listMode === 'grid'
                    ? 'list-grid grid grid-cols-4 gap-4'
                    : 'flex flex-col gap-4'
                }
              >
                {status === 'loading' && <p>Loading...</p>}
                {status === 'failed' && <p>Error: {error}</p>}
                {status === 'succeeded' && displayedResult.length > 0 ? (
                  displayedResult.map((trainer, idx) => (
                    <div
                      key={trainer.userId}
                      onClick={() => handleReadMore(trainer.userId)}
                      className={
                        listMode === 'grid'
                          ? 'cursor-pointer hover:shadow-lg p-2 rounded-lg bg-white'
                          : 'cursor-pointer hover:shadow-md flex bg-white p-4 rounded-xl items-center gap-4'
                      }
                    >
                      <div
                        className={
                          listMode === 'grid'
                            ? 'img mb-2 relative'
                            : 'w-40 h-32 relative'
                        }
                      >
                        <img
                          src={aa}
                          alt="Trainer"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <div className="rounded-2xl text-shadow-2xs text-sm text-white border-1 px-2 w-25 bg-black opacity-50 absolute z-10 bottom-2 left-2">
                          {trainer.categories}
                        </div>
                      </div>
                      <div className="p flex-1">
                        <div className="flex items-baseline gap-1">
                          <p className="text-xl font-semibold">
                            {trainer.userName}
                          </p>
                          <p className="text-sm text-gray-400">강사님</p>
                          <div className="flex items-center gap-1 ml-2">
                            <FaStar className="text-yellow-400 text-sm" />
                            <span className="text-sm">{trainer.rating}</span>
                            <span className="text-xs text-gray-400">
                              ({trainer.reviewCount}개)
                            </span>
                          </div>
                        </div>

                        <p className="text-sm">
                          {trainer.gym?.gym || '정보 없음'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {trainer.gym?.gymAddress || '주소 정보 없음'}
                        </p>
                        <p className="text-sm font-semibold text-[#1a7d45] mt-1">
                          {trainer.minPrice
                            ? `${trainer.minPrice.toLocaleString()}원부터`
                            : '가격 문의'}
                        </p>

                        {listMode === 'horizontal' && (
                          <p className="text-sm text-gray-500 mt-2">
                            {trainer.introduction || '소개글이 없습니다.'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center w-full pt-10">
                    검색 결과가 없습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
            {totalPages > 1 && (
              <div className="page-number flex align-center justify-center my-10 gap-4">
                {showPrevGroup && (
                  <button
                    onClick={handlePrevGroup}
                    className="text-blue-600 hover:underline"
                  >
                    이전
                  </button>
                )}

                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 mx-1 w-8 h-8 rounded flex items-center justify-center ${
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
                    className="px-3 py-2 text-blue-600 hover:underline"
                  >
                    다음
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerMain;
