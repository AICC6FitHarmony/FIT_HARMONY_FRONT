import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

const Trainer = () => {
  //  검색버튼, 프로필 리스트 노출, 클릭

  const [search, setSearch] = useState(''); // 검색어 상태 관리
  const [trainers, setTrainers] = useState([]); // 강사 목록 상태
  const [searchResult, setSearchResult] = useState([]); // 검색 결과 상태
  // const [loading, setLoading] = useState(false); // 로딩상태

  const handleSearch = () => {
    console.log('Searching for:', search);
    // 예를 들어, 검색어를 기반으로 trainers를 필터링하여 searchResult를 업데이트할 수 있습니다.
    const results = trainers.filter((trainer) => trainer.name.includes(search));
    setSearchResult(results); // trainer.name 유저 속성 구분으로 변경
  };

  return (
    <div className="content-wrapper pt-20 justify-center w-full">
      <div className="">
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
                className="border-2 border-[#1a7d45] rounded-md  w-[35rem] h-[40px] shadow-md "
                style={{ paddingRight: '40px' }}
              />
              <button
                onClick={handleSearch}
                className="abso lute right-0 hover:text-[#000] text-2xl text-[#1a7d45]"
                style={{ height: 'calc(100% - 8px)' }}
              >
                <IoSearchOutline />
              </button>
            </div>
          </div>
        </div>

        {/* 검색 결과 표시 */}
        <div className="search-results flex h-full mt-30 relative justify-between">
          <div className="trainer-container  border-2 border-[#1e231e] w-[70%] h-[40rem] right-0 absolute">
            <div className="trainer-list w-full h-full align-center justify-center">
              {searchResult.length > 0 ? (
                searchResult.map((trainer) => (
                  <div key={trainer.id}>
                    <p>프필사진{trainer.image}</p>
                    <h3>이름{trainer.name}</h3>
                    <p>상품설명{trainer.description}</p>
                    <p>가격{trainer.price}</p>
                    <p>{trainer.date}</p>
                  </div>
                ))
              ) : (
                <p className="justify-center h-full  p-15 flex">
                  검색 결과가 없습니다{' '}
                </p>
              )}
            </div>
          </div>
          <div className="nav w-full h-full">
            <div className="trainer-filter border-1 absolute h-full w-[20%]">
              border
            </div>
          </div>
        </div>

        <div className="check"></div>
        <div className="under">h</div>
      </div>
    </div>
  );
};

export default Trainer;
