import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchInbodyDayData,
  fetchInbodyMonthData,
} from "../../js/redux/slice/sliceInbody";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { format } from "date-fns";
import StandardModal from "../cmmn/StandardModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import InbodyRegisterForm from "./InbodyRegisterForm";

const Inbody = () => {
  const dispatch = useDispatch();
  const [isShowCalendarModal, setIsShowCalendarModal] = useState(false);
  const [inbodyTime, setInbodyTime] = useState("1000-01-01");
  const [availableDates, setAvailableDates] = useState([]);
  const [mainInbodyData, setMainInbodyData] = useState(null);
  const [modalInbodyData, setModalInbodyData] = useState(null);
  const [isShowRegisterModal, setIsShowRegisterModal] = useState(false);

  // modalInbodyData 상태 변경 감지
  useEffect(() => {}, [modalInbodyData]);

  const calendarModalOpen = async (inbodyMonthTime) => {
    const formattedDate = inbodyMonthTime.slice(0, 7);
    setIsShowCalendarModal(true);
    try {
      const result = await dispatch(
        fetchInbodyMonthData({ userId, inbodyMonthTime: formattedDate })
      ).unwrap();
      setModalInbodyData(result.inbodyTimeResult);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  const userId = "1"; // 테스트용

  //inbodyTime 변경될 때마다 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(
          fetchInbodyDayData({ userId, inbodyTime })
        ).unwrap();

        // 날짜 리스트 추출 및 저장
        const inbodyTimeResult = result?.inbodyTimeResult || [];
        const dates = inbodyTimeResult.map((date) =>
          format(date.inbodyTime, "yyyy-MM-dd")
        );
        setAvailableDates(dates);
        setMainInbodyData(result);

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

  // 인바디 등록 처리
  const handleInbodySubmit = (formData) => {
    console.log("등록 완료:", formData);
    // 여기에 등록 로직 추가
    setIsShowRegisterModal(false);
  };
  // 데이터 로딩 상태 확인
  // console.log("Redux 상태:", { inbodyData, loading, error });

  // --------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------  변수 설정  -------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------

  // mainInbodyData가 있을 때만 변수 설정
  if (!mainInbodyData) {
    return <div>데이터를 불러오는 중...</div>;
  }

  // 인바디 데이터 설정
  const {
    inbodyId, // 인바디 아이디
    weight, // 체중
    bodyWater, // 체수분
    inbodyScore, // 인바디 점수
    protein, // 단백질
    bodyMineral, // 무기질
    bodyFat, // 체지방
    bodyFatPercent, // 체지방률
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
  } = mainInbodyData?.inbodyResult[0] || {};

  // 표준값 설정
  const standardData = mainInbodyData?.standardData || [];
  const standardValues = {};

  standardData.forEach((item) => {
    const min = parseFloat(item.minValue);
    const max = parseFloat(item.maxValue);
    standardValues[item.itemName] = {
      min,
      max,
      avg: (min + max) / 2,
      fullMark: ((min + max) / 2) * 1.5,
    };
  });

  // 표준값 안전 접근 헬퍼 함수
  const getStandardStat = (key, field, fallback = 0) => {
    const item = standardValues[key];
    return item && typeof item[field] === "number" ? item[field] : fallback;
  };

  // muscle / fat 키 배열
  const muscleKeys = [
    { key: "trunk_muscle", label: "몸통", value: trunkMuscle },
    { key: "right_arm_muscle", label: "오른팔", value: rightArmMuscle },
    { key: "right_leg_muscle", label: "오른다리", value: rightLegMuscle },
    { key: "left_leg_muscle", label: "왼다리", value: leftLegMuscle },
    { key: "left_arm_muscle", label: "왼팔", value: leftArmMuscle },
  ];

  const fatKeys = [
    { key: "trunk_fat", label: "몸통", value: trunkFat },
    { key: "right_arm_fat", label: "오른팔", value: rightArmFat },
    { key: "right_leg_fat", label: "오른다리", value: rightLegFat },
    { key: "left_leg_fat", label: "왼다리", value: leftLegFat },
    { key: "left_arm_fat", label: "왼팔", value: leftArmFat },
  ];

  // muscle / fat 데이터 생성 함수
  const buildSectionData = (keys) =>
    keys.map(({ key, label, value }) => ({
      subject: label,
      A: value,
      B: getStandardStat(key, "avg"),
      fullMark: getStandardStat(key, "fullMark"),
    }));

  const muscleData = buildSectionData(muscleKeys);
  const fatData = buildSectionData(fatKeys);

  // BarChartdata
  // 체성분 구성 데이터
  const bodyCompositionData = [
    { name: "체수분 (L)", value: bodyWater, unit: "L" },
    { name: "단백질 (kg)", value: protein, unit: "kg" },
    { name: "무기질 (kg)", value: bodyMineral, unit: "kg" },
  ];

  // 골격근·지방 분석 데이터
  const muscleFatAnalysisData = [
    {
      name: "체중 (kg)",
      value: weight,
      value_percent: (weight * 100) / getStandardStat("weight", "avg"),
      min: 85,
      max: 115,
      unit: "kg",
    },
    {
      name: "골격근량 (kg)",
      value: skeletalMuscle,
      value_percent:
        (skeletalMuscle * 100) / getStandardStat("skeletal_muscle", "avg"),
      min: 90,
      max: 110,
      unit: "kg",
    },
    {
      name: "체지방 (kg)",
      value: bodyFat,
      value_percent: (bodyFat * 100) / getStandardStat("body_fat", "avg"),
      min: 80,
      max: 160,
      unit: "kg",
    },
  ];

  // 비만 분석 데이터
  const obesityAnalysisData = [
    {
      name: "BMI (kg/m²)",
      value: bmi,
      min: getStandardStat("bmi", "min"),
      max: getStandardStat("bmi", "max"),
      unit: "kg/m²",
    },
    {
      name: "체지방률 (%)",
      value: bodyFatPercent,
      min: getStandardStat("body_fat_percent", "min"),
      max: getStandardStat("body_fat_percent", "max"),
      unit: "%",
    },
  ];

  // fullMark 변수 설정 (표준값 * 1.5)
  const fullMark_tM = standardValues?.trunk_muscle?.fullMark || 0;
  const fullMark_tF = standardValues?.trunk_fat?.fullMark || 0;

  // 날짜 클릭 핸들러
  const handleDateClick = (arg) => {
    const clickedDate = format(arg.date, "yyyy-MM-dd");

    // modalInbodyData에서 해당 날짜가 있는지 확인
    const isAvailableDate = modalInbodyData?.some(
      (item) => format(item.inbodyTime, "yyyy-MM-dd") === clickedDate
    );

    if (isAvailableDate) {
      // 모달 닫기
      setIsShowCalendarModal(false);
      // 해당 날짜로 inbodyTime 설정하여 메인 화면에 데이터 로드
      setInbodyTime(clickedDate);
    } else {
      // 선택적으로 사용자에게 알림
    }
  };

  // events 데이터 생성
  const calendarEvents =
    modalInbodyData?.map((item) => ({
      title: "인바디 측정",
      date: format(item.inbodyTime, "yyyy-MM-dd"),
      color: "green",
      display: "background", // 배경으로 표시
    })) || [];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 text-green-600">
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
                  stroke="oklch(62.7% 0.194 149.214)"
                  fill="oklch(62.7% 0.194 149.214)"
                  fillOpacity={0.6}
                />
                <Radar
                  name="표준"
                  dataKey="B"
                  stroke="oklch(87.1% 0.15 154.449)"
                  fill="oklch(87.1% 0.15 154.449)"
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
                  stroke="oklch(62.7% 0.194 149.214)"
                  fill="oklch(62.7% 0.194 149.214)"
                  fillOpacity={0.6}
                />
                <Radar
                  name="표준"
                  dataKey="B"
                  stroke="oklch(87.1% 0.15 154.449)"
                  fill="oklch(87.1% 0.15 154.449)"
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
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">체성분 분석</h2>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              layout="vertical"
              data={bodyCompositionData}
              margin={{ top: 10, right: 40, left: 60, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 14, fill: "oklch(62.7% 0.194 149.214)" }}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const item = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "white",
                        padding: 8,
                        borderRadius: 8,
                        color: "#16a34a",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{item.name}</div>
                      <div>
                        {Number(item.value).toFixed(1)} {item.unit}
                      </div>
                    </div>
                  );
                }}
                formatter={(v, name, props) => `${v} ${props.payload.unit}`}
              />

              <Bar
                dataKey="value"
                fill="oklch(62.7% 0.194 149.214)"
                radius={[0, 6, 6, 0]}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(v) => {
                    return `${v}`;
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">골격근 · 지방 분석</h2>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              layout="vertical"
              data={muscleFatAnalysisData}
              margin={{ top: 10, right: 40, left: 60, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 400]}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 14, fill: "oklch(62.7% 0.194 149.214)" }}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const item = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "white",
                        padding: 8,
                        borderRadius: 8,
                        color: "#16a34a",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{item.name}</div>
                      <div>{Number(item.value_percent).toFixed(1)}%</div>
                    </div>
                  );
                }}
                formatter={(v, name, props) =>
                  `${Number(v).toFixed(1)} ${props.payload.unit}`
                }
              />

              {/* 기준 영역 배경 (표준 범위 시각화) */}
              {muscleFatAnalysisData.map((item, index) => (
                <ReferenceArea
                  key={index}
                  y1={item.name}
                  y2={item.name}
                  x1={item.min}
                  x2={item.max}
                  fill="oklch(87.1% 0.15 154.449)"
                  fillOpacity={1}
                  radius={[6, 6, 6, 6]}
                />
              ))}

              <Bar
                dataKey="value_percent"
                fill="oklch(62.7% 0.194 149.214)"
                radius={[0, 6, 6, 0]}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(v) => `${v}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">비만 분석</h2>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              layout="vertical"
              data={obesityAnalysisData}
              margin={{ top: 10, right: 40, left: 60, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 55]}
                tickFormatter={(v) => `${v}`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 14, fill: "oklch(62.7% 0.194 149.214)" }}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const item = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "white",
                        padding: 8,
                        borderRadius: 8,
                        color: "#16a34a",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{item.name}</div>
                      <div>
                        {Number(item.value).toFixed(1)} {item.unit}
                      </div>
                    </div>
                  );
                }}
                formatter={(v, name, props) => `${v} ${props.payload.unit}`}
              />

              {/* 기준 영역 배경 (표준 범위 시각화) */}
              {obesityAnalysisData.map((item, index) => (
                <ReferenceArea
                  key={index}
                  y1={item.name}
                  y2={item.name}
                  x1={item.min}
                  x2={item.max}
                  fill="oklch(87.1% 0.15 154.449)"
                  fillOpacity={1}
                  radius={[6, 6, 6, 6]}
                />
              ))}

              <Bar
                dataKey="value"
                fill="oklch(62.7% 0.194 149.214)"
                radius={[0, 6, 6, 0]}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(v) => `${v}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
            <button onClick={() => calendarModalOpen(inbodyTime)}>
              {inbodyTime}
            </button>
            {availableDates.indexOf(inbodyTime) < availableDates.length - 1 && (
              <button
                className="w-8 h-8 text-2xl ml-2"
                onClick={handleNextDate}
              >
                <IoIosArrowForward />
              </button>
            )}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={() => setIsShowRegisterModal(true)}
          >
            등록
          </button>
        </div>
      </div>
      {isShowCalendarModal && (
        <StandardModal
          title="캘린더"
          size={{ width: "50vw" }}
          closeEvent={() => setIsShowCalendarModal(false)}
        >
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            headerToolbar={{
              right: "next",
              center: "title",
              left: "prev",
            }}
            height="auto"
            events={calendarEvents}
            dateClick={handleDateClick}
          />
        </StandardModal>
      )}
      {isShowRegisterModal && (
        <StandardModal
          title="인바디 등록"
          size={{ width: "50vw", height: "10vw" }}
          closeEvent={() => setIsShowRegisterModal(false)}
        >
          <InbodyRegisterForm
            onClose={() => setIsShowRegisterModal(false)}
            onSubmit={handleInbodySubmit}
          />
        </StandardModal>
      )}
    </div>
  );
};

export default Inbody;
