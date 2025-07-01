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

  useEffect(() => {
    if (status === 'idle') {
      //sliceTrainer.js 에서 초기상태 지정
      dispatch(fetchTrainers()); //idle 인 상태일때만 정보 정보 가져옴
    }
  }, [status, dispatch]); // status 가 변하거나 dipatch 되면 동작?

  useEffect(() => {
    if (status === 'succeeded') {
      setSearchResult(trainers?.data || []);
    }
  }, [status, trainers]);

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
            <div className=" flex align-center justify-center my-10">
              <button>이전</button>
              <button
                className="hover:underline hover:text-[#1a7d45]"
                key={num}
                onClick={() => {
                  setPage(num);
                }}
              >
                1
              </button>
              <button>다음</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerMain;
