import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrainers } from '../../js/redux/slice/sliceTrainer';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FaListUl } from 'react-icons/fa6';
import aa from '../Trainer/test/aa.png';

const TrainerMain = () => {
  const dispatch = useDispatch();
  const trainers = useSelector((state) => state.trainer.trainers); // Access trainers from the Redux store
  const status = useSelector((state) => state.trainer.status);
  const error = useSelector((state) => state.trainer.error);

  const [search, setSearch] = useState(''); // 검색어 상태 관리
  const [searchResult, setSearchResult] = useState([]); // 검색 결과 상태

  useEffect(() => {
    if (status === 'idle') {
      console.log('Dispatching fetchTrainers');
      dispatch(fetchTrainers()); // Dispatch the fetchTrainers action
    }
  }, [status, dispatch]);

  useEffect(() => {
    console.log('Status:', status);
    console.log('Trainers:', trainers);
    console.log('Error:', error);
  }, [status, trainers, error]);

  const handleSearch = () => {
    console.log('Searching for:', search);

    // trainers 데이터가 존재하는지 확인
    if (trainers && trainers.data) {
      const results = trainers.data.filter((trainer) =>
        trainer.userName.includes(search)
      );
      setSearchResult(results);
    } else {
      console.error('Trainers data is not available');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReadMore = () => {};

  return (
    <div className="main-wrapper pt-20 w-full">
      <div>
        <div className="search-title">
          <div className="flex justify-center">
            <h2 className="text-2xl">강사 찾기</h2>
          </div>

          <div className="search-title pt-5 flex justify-center items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="검색어를 입력해 주세요"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                className="border-2 border-[#1a7d45] rounded-md w-[35rem] h-[40px] shadow-md"
                style={{ paddingRight: '40px' }}
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 hover:text-[#000] text-2xl text-[#1a7d45]"
                style={{ height: 'calc(100% - 8px)' }}
              >
                <IoSearchOutline />
              </button>
            </div>
          </div>
        </div>

        {/* 검색 결과 표시 */}
        <div className="search-results flex  mt-30">
          <div className="flex w-full grid-cols-2 gap-5 p-3">
            <div className="trainer-navbar  w-[20%]">
              <div className=" bg-orange-50 h-full ">필터검색</div>
            </div>
            <div className="trainer-container  bg-orange-50 w-[80%] h-[40rem] flex flex-col">
              <div className="array-wrapper flex w-full justify-between">
                <button className="trainer-array border-1 bg-white w-30 rounded-2xl text-center h-10 flex items-center justify-center gap-2 hover:underline">
                  정렬
                  <TiArrowSortedDown />
                </button>
                <button className="trainer-array border-1 bg-white w-15 rounded-2xl text-center h-10 flex items-center justify-center gap-2 hover:text-[#1a7d45]">
                  <FaListUl />
                </button>
              </div>
              <div className=" ">
                <div className="trainer-list   px-3  py-8 h-auto">
                  <div className="list-grid grid grid-cols-4 grid-rows-4 gap-4 ">
                    {status === 'loading' && <p>Loading...</p>}
                    {status === 'failed' && <p>Error: {error}</p>}
                    {status === 'succeeded' && searchResult.length > 0 ? (
                      searchResult.map((trainer) => (
                        <div key={trainer.userId} onClick={handleReadMore}>
                          {/* <img
                        src={trainer.image}
                        alt="Trainer"
                        className="w-10 h-60 rounded-3xl"
                      /> */}
                          <div className="img">
                            <img
                              src={aa}
                              alt="Trainer"
                              className=" rounded-3xl"
                            />
                          </div>
                          <div className="p">
                            <span className="flex ">
                              <p className="text-2xl">{trainer.userName}</p>
                              <p className="text-sm text-gray-400"> 강사님</p>
                            </span>
                            <p>{trainer.gymId}</p>
                            {/* <p>{trainer.price}</p>
                      <p>{trainer.date}</p> */}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="justify-center h-auto p-15 flex">
                        검색 결과가 없습니다{' '}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerMain;
