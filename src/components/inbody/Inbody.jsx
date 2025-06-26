import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInbodyData } from "../../js/redux/slice/sliceInbody";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { format } from "date-fns";

const BarItem = ({ label, value }) => (
  <div className="mb-2">
    <div className="text-sm mb-1">{label}</div>
    <div className="bg-gray-200 h-4 rounded">
      <div
        className="bg-blue-500 h-4 rounded"
        style={{ width: `${value}%` }}
      ></div>
    </div>
    <div className="text-xs text-right text-gray-500">{value}</div>
  </div>
);

const Inbody = () => {
  const dispatch = useDispatch();
  const { inbodyData, loading, error } = useSelector((state) => state.inbody);

  const [inbodyTime, setInbodyTime] = useState("1000-01-01");
  const [availableDates, setAvailableDates] = useState([]);

  const userId = "1"; // 테스트용

  // 🔁 useEffect: inbodyTime 변경될 때마다 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(
          fetchInbodyData({ userId, inbodyTime })
        ).unwrap();

        // 날짜 리스트 추출 및 저장
        const inbodyTimeResult = result?.inbodyTimeResult || [];
        const dates = inbodyTimeResult.map((date) =>
          format(date.inbodyTime, "yyyy-MM-dd")
        );
        setAvailableDates(dates);

        // 최초 진입 시 실제 데이터 날짜로 설정
        if (inbodyTime === "1000-01-01" && result?.inbodyResult?.length > 0) {
          const initDate = format(
            result.inbodyResult[0].inbodyTime,
            "yyyy-MM-dd"
          );
          setInbodyTime(initDate);
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchData();
  }, [dispatch, userId, inbodyTime]);

  const handlePrevDate = () => {
    const idx = availableDates.indexOf(inbodyTime);
    if (idx > 0) {
      setInbodyTime(availableDates[idx - 1]);
    }
  };

  const handleNextDate = () => {
    const idx = availableDates.indexOf(inbodyTime);
    if (idx < availableDates.length - 1) {
      setInbodyTime(availableDates[idx + 1]);
    }
  };
  // 데이터 로딩 상태 확인
  // console.log("Redux 상태:", { inbodyData, loading, error });

  if (loading) return <div>데이터를 불러오는 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;

  // 변수 설정

  const {
    inbodyId, // 인바디 아이디
    weight, // 체중
    bodyWater, // 체수분
    inbodyScore, // 인바디 점수
    protein, // 단백질
    bodyMineral, // 무기질
    bodyFat, // 체지방
    bmi, // BMI
    skeletalMuscle, // 골격근량
    trunkMuscle, // 몸통 근육량
    leftArmMuscle, // 왼팔 근육량
    rightArmMuscle, // 오른팔 근육량
    leftLegMuscle, // 왼다리 근육량
    rightLegMuscle, // 오른다리 근육량
    trunkFat, // 몸통 체지방
    leftArmFat, // 왼팔 체지방
    rightArmFat, // 오른팔 체지방
    leftLegFat, // 왼다리 체지방
    rightLegFat, // 오른다리 체지방
  } = inbodyData?.inbodyResult[0] || {};

  const standardData = inbodyData?.standardData || [];
  const standardValues = {};
  standardData.forEach((item) => {
    standardValues[item.itemName] = {
      min: parseFloat(item.minValue),
      max: parseFloat(item.maxValue),
      avg: (parseFloat(item.minValue) + parseFloat(item.maxValue)) / 2,
      fullMark:
        ((parseFloat(item.minValue) + parseFloat(item.maxValue)) / 2) * 1.5,
    };
  });

  // fullMark 변수 설정 (표준값 * 1.5)
  // _t = trunk, _r = right, _l = left, _a = arm, _f = fat, m = muscle , f = fat
  const fullMark_tM = standardValues["trunk_muscle"]?.fullMark || 0;
  const fullMark_rAM = standardValues["right_arm_muscle"]?.fullMark || 0;
  const fullMark_rLM = standardValues["right_leg_muscle"]?.fullMark || 0;
  const fullMark_lLM = standardValues["left_leg_muscle"]?.fullMark || 0;
  const fullMark_lAM = standardValues["left_arm_muscle"]?.fullMark || 0;
  const fullMark_tF = standardValues["trunk_fat"]?.fullMark || 0;
  const fullMark_rAF = standardValues["right_arm_fat"]?.fullMark || 0;
  const fullMark_rLF = standardValues["right_leg_fat"]?.fullMark || 0;
  const fullMark_lLF = standardValues["left_leg_fat"]?.fullMark || 0;
  const fullMark_lAF = standardValues["left_arm_fat"]?.fullMark || 0;

  const muscleData = [
    {
      subject: "몸통",
      A: trunkMuscle,
      B: standardValues["trunk_muscle"]?.avg || 0,
      fullMark: fullMark_tM,
    },
    {
      subject: "오른팔",
      A: rightArmMuscle,
      B: standardValues["right_arm_muscle"]?.avg || 0,
      fullMark: fullMark_rAM,
    },
    {
      subject: "오른다리",
      A: rightLegMuscle,
      B: standardValues["right_leg_muscle"]?.avg || 0,
      fullMark: fullMark_rLM,
    },
    {
      subject: "왼다리",
      A: leftLegMuscle,
      B: standardValues["left_leg_muscle"]?.avg || 0,
      fullMark: fullMark_lLM,
    },
    {
      subject: "왼팔",
      A: leftArmMuscle,
      B: standardValues["left_arm_muscle"]?.avg || 0,
      fullMark: fullMark_lAM,
    },
  ];

  const fatData = [
    {
      subject: "몸통",
      A: trunkFat,
      B: standardValues["trunk_fat"]?.avg || 0,
      fullMark: fullMark_tF,
    },
    {
      subject: "오른팔",
      A: rightArmFat,
      B: standardValues["right_arm_fat"]?.avg || 0,
      fullMark: fullMark_rAF,
    },
    {
      subject: "오른다리",
      A: rightLegFat,
      B: standardValues["right_leg_fat"]?.avg || 0,
      fullMark: fullMark_rLF,
    },
    {
      subject: "왼다리",
      A: leftLegFat,
      B: standardValues["left_leg_fat"]?.avg || 0,
      fullMark: fullMark_lLF,
    },
    {
      subject: "왼팔",
      A: leftArmFat,
      B: standardValues["left_arm_fat"]?.avg || 0,
      fullMark: fullMark_lAF,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* 왼쪽 */}
      <div className="w-full md:w-1/2 space-y-4">
        <div className="text-xl font-semibold text-center">
          인바디 점수 ({inbodyScore}/100)
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <div className="text-xl font-semibold text-center p-2">근육량</div>
            <div className="flex justify-center">
              <RadarChart
                outerRadius={90}
                width={730}
                height={250}
                data={muscleData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, fullMark_tM]} />
                <Radar
                  name="현재"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name="표준"
                  dataKey="B"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </div>
          </div>

          <div>
            <div className="text-xl font-semibold text-center p-2">체지방</div>
            <div className="flex justify-center">
              <RadarChart
                outerRadius={90}
                width={730}
                height={250}
                data={fatData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, fullMark_tF]} />
                <Radar
                  name="현재"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name="표준"
                  dataKey="B"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 */}
      <div className="w-full md:w-1/2 space-y-4">
        <div>
          <div className="font-bold text-lg mb-2">체성분 분석</div>
          <BarItem label="체수분" value={bodyWater} />
          <BarItem label="단백질" value={protein} />
          <BarItem label="무기질" value={bodyMineral} />
          <BarItem label="체지방" value={bodyFat} />
        </div>

        <div>
          <div className="font-bold text-lg mb-2">골격근 지방 분석</div>
          <BarItem label="체중" value={weight} />
          <BarItem label="골격근량" value={skeletalMuscle} />
          <BarItem label="체지방" value={bodyFat} />
        </div>

        <div>
          <div className="font-bold text-lg mb-2">비만 분석</div>
          <BarItem label="BMI" value={bmi} />
          <BarItem label="체지방률" value={bodyFat} />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
          <div className="flex items-center">
            {availableDates.indexOf(inbodyTime) > 0 && (
              <button
                className="w-8 h-8 text-2xl mr-2"
                onClick={handlePrevDate}
              >
                <IoIosArrowBack />
              </button>
            )}
            <button>{inbodyTime}</button>
            {availableDates.indexOf(inbodyTime) < availableDates.length - 1 && (
              <button
                className="w-8 h-8 text-2xl ml-2"
                onClick={handleNextDate}
              >
                <IoIosArrowForward />
              </button>
            )}
          </div>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inbody;
