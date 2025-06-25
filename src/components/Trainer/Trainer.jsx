import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import a from '../Trainer/test/aa.png';

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
    <div className="content-wrapper pt-20 w-full">
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

        <div className="search-results  flex h-full w-full mt-30">
          <div className="nav border-1 w-[25%] ">
            <div className="trainer-filter">border</div>
          </div>
          <div className="flex w-full justify-end">
            <div className="trainer-container border-2  border-[#1e231e] w-full  h-[40rem] flex">
              <div className="trainer-list w-auto px-3 h-auto">
                <div className="flex border-1">
                  <div className="flex flex-col  align-center justify-center text-left">
                    <img src={a} alt="dd" className="w-10 h-60 rounded-3xl" />
                    <div className="profile-txt px-5 ">
                      <p className="border-1 border-gray-300 rounded-3xl my-2 px-3 w-30 text-sm text-gray-500 ">
                        pt, 요가
                      </p>
                      <span className="flex ">
                        <p className="text-2xl">이름 </p>
                        <p className="text-gray-400 text-sm mt-[11px] px-2 ">
                          강사님
                        </p>
                      </span>
                      <p>상품 한줄 소개상품 </p>
                      <p>gym</p>
                      <p className="text-sm">서울시 종로구 16</p>
                    </div>
                  </div>
                </div>

                {/* {searchResult.length > 0 ? (
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
                  <p className="justify-center h-auto p-15 flex">
                    검색 결과가 없습니다{' '}
                  </p>
                )} */}
              </div>
              <div className="trainer-list w-auto h-auto">
                <div className="flex ">
                  <div className="flex flex-col align-center justify-center text-center">
                    <img src={a} alt="dd" className="w-10 h-60 rounded-3xl" />
                    <p className="border-1 rounded-3xl m-2 mr-10  w-auto text-sm text-gray-500 pr-40">
                      pt, 요가
                    </p>
                    <span className="flex align-center justify-center text-center">
                      <p className="text-2xl">이름 </p>
                      <p className="text-gray-400 text-sm mt-[11px] px-2 ">
                        강사님
                      </p>
                    </span>
                    <p>상품 한줄 소개상품 한줄 소개</p>
                    <p>서울시 종로구 16</p>
                    <p>날짜</p>
                  </div>
                </div>

                {/* {searchResult.length > 0 ? (
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
                  <p className="justify-center h-auto p-15 flex">
                    검색 결과가 없습니다{' '}
                  </p>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainer;
