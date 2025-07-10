import React, { useEffect, useState, useRef } from "react";
import spinner from "../../../images/spinner.svg";
import { useDispatch, useSelector } from "react-redux";
import { searchGym } from "../../../js/redux/slice/sliceMypage";
import "../../../css/Mypage.css";

const Test = ({
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
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((gym, index) => (
              <div
                key={gym.gym_id}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelectGym(gym)}
              >
                <div className="font-medium text-gray-900">{gym.gym}</div>
                <div className="text-sm text-gray-500">{gym.gym_address}</div>
              </div>
            ))}
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {showDropdown &&
          searchResults.length === 0 &&
          searchTerm.trim() &&
          !isSearching &&
          !loading && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="px-4 py-3 text-gray-500 text-center">
                검색 결과가 없습니다.
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Test;
