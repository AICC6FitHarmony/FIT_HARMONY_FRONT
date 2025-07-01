// TrainerMain.jsx 개선본 with 가로 목록 뷰 추가
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

  // 페이지 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // 한 페이지 에 보여줄 트레이너 수
  useEffect(() => {
    dispatch(
      fetchTrainers({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      })
    );
    console.log('요청 보내는 offset:', (currentPage - 1) * itemsPerPage);
  }, [currentPage, dispatch]);
  // useeffect 실행 조건 : status 변하면 작동/ dispatch는 쓸모없는 관례,원칙용임

  useEffect(() => {
    if (status === 'succeeded') {
      setSearchResult(trainers?.data || []); // 받으온 데이터를 SearchResult에 ㅈ저장 || 데이터가 없다면 빈 배열로 처리
      setTotalItems(trainers?.total || 0); // 트레이너 총 수 데이터 가져옴
      setTotalPages(Math.ceil((trainers?.total || 0) / itemsPerPage)); //전체 페이지 수 계산 math 라이브러리 사용 .트레이너 총수 / 한 페이지 . ex) 100/ 4 = 25
    }
  }, [status, trainers, itemsPerPage]); //useeffect 실행 조건 셋중 하나라도 변하면 해당 훅 실행

  console.log('Trainers data:', trainers); // 디버깅용
  console.log('Total items:', trainers?.total);

  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      setSearchResult(trainers?.data || []);
      return;
    }

    const gymMap = new Map(trainers.gym.map((g) => [g.gymId, g]));

    const results = trainers.data
      .filter((t) => t.userName.toLowerCase().includes(keyword))
      .map((t) => ({ ...t, gym: gymMap.get(t.gymId) || null }));

    setSearchResult(results);
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
      // 총 페이지가 10 이하면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i); // 숫자 버튼  만드는 코드 .
      }
    } else {
      // 총 페이지가 10 초과일 때
      const currentGroup = Math.ceil(currentPage / maxVisiblePages); //현재 페이지가 있는 그룹 1~10
      const startPage = (currentGroup - 1) * maxVisiblePages + 1; //현재 그룹의 시작 번호
      const endPage = Math.min(currentGroup * maxVisiblePages, totalPages); //현재 그룹의 끝 번호

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

  // 페이지 이동 이벤트 처리
  // 숫자 클릭
  const handlePrevGroup = () => {
    const currentGroup = Math.ceil(currentPage / 10);
    if (currentGroup > 1) {
      const newPage = (currentGroup - 2) * 10 + 1;
      handlePageChange(newPage);
    }
  };

  // 이전
  const handleNextGroup = () => {
    const currentGroup = Math.ceil(currentPage / 10);
    const maxGroup = Math.ceil(totalPages / 10);
    if (currentGroup < maxGroup) {
      const newPage = currentGroup * 10 + 1;
      handlePageChange(newPage);
    }
  };

  // 다음
  const pageNumbers = getPageNumbers();
  const showPrevGroup = Math.ceil(currentPage / 10) > 1;
  const showNextGroup =
    Math.ceil(currentPage / 10) < Math.ceil(totalPages / 10);

  return (
    // 검색
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
            {/* 검색버튼 */}
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
          <div className="trainer-container bg-orange-50 w-[80%]  flex flex-col">
            <div className="array-wrapper flex w-full justify-between p-2">
              <button className="trainer-array bg-white w-30 rounded-2xl h-10 flex items-center justify-center gap-2 hover:underline">
                정렬 <TiArrowSortedDown />
              </button>

              {/* 목록 이미지로 보기, 가로로 보기 */}
              <button
                className="trainer-array bg-white w-15 rounded-2xl h-10 flex items-center justify-center gap-2 hover:text-[#1a7d45] text-2xl"
                onClick={() =>
                  setListMode(listMode === 'grid' ? 'horizontal' : 'grid')
                }
              >
                {listMode === 'grid' ? <FaListUl /> : <MdDialpad />}
              </button>
            </div>
            {/* 검색 결과 목록 */}
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
                          {trainer.gym?.gymAddress}
                        </p>
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
            {/* 페이지 번호 */}
            <div className="page-number flex align-center justify-center my-10 gap-4">
              {showPrevGroup && (
                <button
                  onClick={handlePrevGroup}
                  className=" text-blue-600 hover:underline"
                >
                  이전
                </button>
              )}

              {/* 페이지 번호들 */}
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

              {/* 다음 그룹 버튼 */}
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
