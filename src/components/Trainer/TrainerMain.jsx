// TrainerMain.jsx 수정본 - gym 정보 매핑 개선
import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrainers } from '../../js/redux/slice/sliceTrainer';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FaListUl } from 'react-icons/fa6';
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
  const [listMode, setListMode] = useState('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('기본순');

  // 페이지 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(
      fetchTrainers({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      })
    );
    console.log('요청 보내는 offset:', (currentPage - 1) * itemsPerPage);
  }, [currentPage, dispatch]);

  // gym 정보를 매핑하는 함수
  const mapTrainersWithGym = (trainersData, gymData) => {
    if (!trainersData || !gymData) return [];

    const gymMap = new Map(gymData.map((g) => [g.gymId, g]));

    return trainersData.map((trainer) => ({
      ...trainer,
      gym: gymMap.get(trainer.gymId) || null,
    }));
  };

  useEffect(() => {
    if (status === 'succeeded' && trainers) {
      // 트레이너 데이터에 gym 정보 매핑
      const mappedTrainers = mapTrainersWithGym(trainers.data, trainers.gym);
      setSearchResult(mappedTrainers);
      setTotalItems(trainers?.total || 0);
      setTotalPages(Math.ceil((trainers?.total || 0) / itemsPerPage));
    }
  }, [status, trainers, itemsPerPage]);

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
  console.log('Total items:', trainers?.total);
  console.log('Mapped search result:', searchResult); // 매핑된 결과 확인

  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();

    // 매핑된 전체 데이터에서 검색
    const allMappedTrainers = mapTrainersWithGym(
      trainers?.data || [],
      trainers?.gym || []
    );

    if (!keyword) {
      setSearchResult(allMappedTrainers);
      return;
    }

    const results = allMappedTrainers.filter((trainer) =>
      trainer.userName.toLowerCase().includes(keyword)
    );

    setSearchResult(results);
  };

  // 정렬 함수
  const handleSort = (sortType) => {
    setSortBy(sortType);
    setShowSortDropdown(false);

    const sortedResults = [...searchResult].sort((a, b) => {
      switch (sortType) {
        case '인기순':
          // 인기순 정렬 로직 (예: userId 기준 내림차순)
          return b.userId - a.userId;
        case '조회순':
          // 조회순 정렬 로직 (예: 임시로 userName 길이 기준)
          return b.userName.length - a.userName.length;
        case '별점순':
          // 별점순 정렬 로직 (예: 임시로 age 기준)
          return (b.age || 0) - (a.age || 0);
        default:
          return 0;
      }
    });

    setSearchResult(sortedResults);
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
    if (page !== currentPage) {
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
              className="border-2 bg-white border-[#1a7d45] rounded-md w-[35rem] h-[40px] shadow-md pr-10"
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
          <div className="trainer-navbar w-[20%] bg-orange-50 h-full">
            필터검색
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
                  <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32">
                    <ul className="py-2">
                      <li>
                        <button
                          className="w-full text-center px-4 py-3 hover:bg-gray-100 text-sm"
                          onClick={() => handleSort('기본순')}
                        >
                          기본순
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-center px-4 py-3 hover:bg-gray-100 text-sm"
                          onClick={() => handleSort('인기순')}
                        >
                          인기순
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-center px-4 py-3 hover:bg-gray-100 text-sm"
                          onClick={() => handleSort('조회순')}
                        >
                          조회순
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-center px-4 py-3 hover:bg-gray-100 text-sm"
                          onClick={() => handleSort('별점순')}
                        >
                          별점순
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <button
                className="trainer-array bg-white w-15 rounded-2xl h-10 flex items-center justify-center gap-2 hover:text-[#1a7d45] text-2xl"
                onClick={() =>
                  setListMode(listMode === 'grid' ? 'horizontal' : 'grid')
                }
              >
                {listMode === 'grid' ? <FaListUl /> : <MdDialpad />}
              </button>
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
                {status === 'succeeded' && searchResult.length > 0 ? (
                  searchResult.map((trainer) => (
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
                          listMode === 'grid' ? 'img mb-2' : 'w-40 h-32'
                        }
                      >
                        <img
                          src={aa}
                          alt="Trainer"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                      <div className="p">
                        <div className="flex items-baseline gap-1">
                          <p className="text-xl font-semibold">
                            {trainer.userName}
                          </p>
                          <p className="text-sm text-gray-400">강사님</p>
                        </div>

                        <p className="text-sm">
                          {trainer.gym?.gym || '정보 없음'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {trainer.gym?.gymAddress || '주소 정보 없음'}
                        </p>
                        {/* listMode가 horizontal(flex)일 때만 introduction 표시 */}
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
                  className={`px-3 py-2 mx-1 w-6 rounded ${
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerMain;
