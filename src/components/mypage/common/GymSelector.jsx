import React, { useEffect, useState, useRef } from "react";
import spinner from "../../../images/spinner.svg";
import { useDispatch, useSelector } from "react-redux";
import { searchGym } from "../../../js/redux/slice/sliceMypage";
import "../../../css/Mypage.css";
import { AddressSelectorWithModal } from "../../login/common/AddressSelector";
import InputWithLabel from "../../cmmn/InputWithLabel";
import { createGym, getGyms } from "../../../js/login/gymUtil";

const GymSelector = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  isCheckingDuplicate,
  isDuplicateChecked,
  isDuplicate,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const searchTimeoutRef = useRef(null);
  const [newGym, setNewGym] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [gymList, setGymList] = useState([]);
  const [gymInfo, setGymInfo] = useState({
    name: "",
    address: "",
    addressDetail: "",
  });
  const [address, setAddress] = useState("");

  // Redux 훅 사용
  const dispatch = useDispatch();
  const { gymData, loading } = useSelector((state) => state.mypage);

  // 검색 함수
  const performSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const result = await dispatch(searchGym({ search: term }));
      if (result.payload && result.payload.success) {
        setSearchResults(result.payload.gyms || []);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Gym 검색 오류:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = async () => {
    // 조건 체크
    if (!gymInfo.name.trim()) {
      return;
    }
    if (!address.trim()) {
      return;
    }
    if (!gymInfo.addressDetail.trim()) {
      return;
    }

    const body = {
      gym_name: gymInfo.name.trim(),
      gym_address: `${address.trim()}, ${gymInfo.addressDetail.trim()}`,
    };
    const res = await createGym(body);
    await updateGymList();

    // 새로 생성된 체육관을 선택
    if (onChange) {
      onChange({ target: { name: name, value: res.gym.gym } });
    }

    clearInfo();
    setNewGym(false);
    setGymFilter(res.gym.gym);
    setSelectIdx(res.gym.gymId);
  };

  const clearInfo = () => {
    setAddress("");
    setGymInfo({
      name: "",
      address: "",
      addressDetail: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newInfo = {
      ...gymInfo,
    };
    newInfo[name] = value;
    setGymInfo(newInfo);
  };

  const updateGymList = async () => {
    const res = await getGyms();
    setGymList(res.gyms);
  };

  useEffect(() => {
    updateGymList();
  }, []);

  // 디바운싱된 검색
  const debouncedSearch = (term) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(term);
    }, 300);
  };

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // 부모 컴포넌트에 값 전달
    if (onChange) {
      onChange(e);
    }

    // 검색 실행
    debouncedSearch(newValue);
  };

  // 검색 결과 선택
  const handleSelectGym = (gym) => {
    setSearchTerm(gym.gym);
    setShowDropdown(false);

    // 부모 컴포넌트에 선택된 값 전달
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: gym.gym,
        },
      });
    }
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".gym-search-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // value prop이 변경되면 searchTerm도 업데이트
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  return (
    <div className="space-y-2 gym-search-container">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
          placeholder={placeholder}
          autoComplete="off"
        />
        {(isSearching || loading) && (
          <img src={spinner} alt="spinner" className="spinner" />
        )}
      </div>
      <div>
        {/* 검색 결과 드롭다운 */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-10 w-1/2 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((gym, index) => (
              <div
                key={gym.gym_id}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelectGym(gym)}
              >
                <div className="font-medium text-gray-900">{gym.gym}</div>
                <div className="text-sm text-gray-500">{gym.gymAddress}</div>
              </div>
            ))}
            <div
              className="px-4 py-3  hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 text-center"
              onClick={() => {
                setShowDropdown(false);
                setNewGym(true);
              }}
            >
              <div className="font-medium text-gray-400">
                운동 센터가 나오지 않는다면?
                <span className="text-blue-500">운동 센터 등록하기</span>
              </div>
            </div>
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {showDropdown &&
          searchResults.length === 0 &&
          searchTerm.trim() &&
          !isSearching &&
          !loading && (
            <div className="absolute z-10 w-1/2 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="px-4 py-3 text-gray-500 text-center">
                검색 결과가 없습니다.
              </div>
              <div
                className="px-4 py-3  hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 text-center"
                onClick={() => {
                  setShowDropdown(false);
                  setNewGym(true);
                }}
              >
                <div className="font-medium text-gray-400">
                  운동 센터가 나오지 않는다면?
                  <span className="text-blue-500">운동 센터 등록하기</span>
                </div>
              </div>
            </div>
          )}
      </div>
      <div
        className={`new-gym pt-[1rem] flex flex-col gap-2 
          ${newGym ? "" : "hidden"}
          `}
      >
        <InputWithLabel
          label={"이름"}
          name={"name"}
          value={gymInfo.name}
          onChange={handleChange}
          placeholder={"소속 체육관(단체) 이름을 적어주세요."}
        />
        <AddressSelectorWithModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setAddress={setAddress}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
            }}
            className="ok"
          >
            주소 검색
          </button>
        </div>
        <InputWithLabel
          label={"주소"}
          name={"address"}
          value={address}
          readOnly={true}
          placeholder={"주소 검색 버튼을 클릭해주세요."}
        />
        <InputWithLabel
          label={"상세"}
          name={"addressDetail"}
          onChange={handleChange}
          value={gymInfo.addressDetail}
          placeholder={"상세 주소를 입력해 주세요."}
        />
        <div className="flex justify-end">
          <button type="button" onClick={handleAdd} className="ok">
            추가
          </button>
          <button
            type="button"
            onClick={() => {
              setNewGym(false);
            }}
            className="cancel"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymSelector;
