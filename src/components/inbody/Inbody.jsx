import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInbodyDayData,
  fetchInbodyMonthData,
} from "../../js/redux/slice/sliceInbody";
import {
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
import InbodyRegisterForm from "./InbodyRegisterForm";
import InbodyCalendarModal from "./InbodyCalendarModal";
import InbodyRadarCharts from "./InbodyRadarCharts";
import { useAuthRedirect } from "../../js/login/AuthContext";
import InbodyDetailForm from "./InbodyDetailForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Inbody = () => {
  const dispatch = useDispatch();
  const [isShowCalendarModal, setIsShowCalendarModal] = useState(false);
  const [inbodyTime, setInbodyTime] = useState("1000-01-01");
  const [availableDates, setAvailableDates] = useState([]);
  const [mainInbodyData, setMainInbodyData] = useState(null);
  const [modalInbodyData, setModalInbodyData] = useState(null);
  const [isShowRegisterModal, setIsShowRegisterModal] = useState(false);
  const { user, loading } = useAuthRedirect();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);


  const navigate = useNavigate(); // 화면 라우팅 시 활용하는 훅
  // 강사 회원 매칭 정보 리덕스(강사 회원 관리 화면)
  const isTrainerMatchMember = useSelector(state => state.common.isTrainerMatchMember);
  const trainerSelectedMember = useSelector(state => state.common.trainerSelectedMember);

  // modalInbodyData 상태 변경 감지
  useEffect(() => {}, [modalInbodyData]);

  // user 값이 있을 때만 userId 설정
  useEffect(() => {
    if(user?.user?.role == "TRAINER" && isTrainerMatchMember){ // 트레이너이며, 
      if(trainerSelectedMember.userId == 0){
          toast.error("확인하실 회원님을 선택해주세요.", {
              position: "bottom-center"
          });
          setTimeout(() => {
              navigate("/")
          }, 2000);
          return;
      }else{
        setUserId(trainerSelectedMember.userId);
        setUserName(trainerSelectedMember.nickName);
      }
    }else if (user?.user?.userId) {
      setUserId(user.user.userId);
      setUserName(user.user.nickName);
    }

  }, [user]);

  // user와 userId가 있을 때만 데이터 요청
  useEffect(() => {
    if (!user || !userId || loading) {
      return; // user가 없거나 로딩 중이면 실행하지 않음
    }
    console.log("userId", userId);
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
  }, [dispatch, userId, inbodyTime, user, loading]);

  const calendarModalOpen = () => {
    if (!userId) {
      console.error("사용자 ID가 없습니다.");
      return;
    }
    setIsShowCalendarModal(true);
  };

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
    }
  };

  const handleDatesSet = async (arg) => {
    try {
      const result = await dispatch(
        fetchInbodyMonthData({
          userId,
          startDate: format(arg.start, "yyyy-MM-dd"),
          endDate: format(arg.end, "yyyy-MM-dd"),
        })
      ).unwrap();
      setModalInbodyData(result.inbodyTimeResult);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  // events 데이터 생성
  const calendarEvents =
    modalInbodyData?.map((item) => ({
      date: format(item.inbodyTime, "yyyy-MM-dd"),
      color: "green",
      display: "background", // 배경으로 표시
    })) || [];

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
  const handleInbodyInsertSubmit = (formData) => {
    console.log("등록 완료:", formData);
    // 등록 완료 후 페이지 리로드
    setIsShowRegisterModal(false);
    window.location.reload();
  };

  const handleInbodyUpdateSubmit = (formData) => {
    console.log("수정 완료:", formData);
    setIsShowDetailModal(false);
    window.location.reload();
  };
  // 데이터 로딩 상태 확인
  // console.log("Redux 상태:", { inbodyData, loading, error });

  // --------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------  변수 설정  -------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------

  // mainInbodyData가 있을 때만 변수 설정
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div>로딩중...</div>
      </div>
    );
  }

  // 표준값 안전 접근 헬퍼 함수
  const getStandardStat = (key, field, fallback = 0) => {
    const item = standardValues[key];
    return item && typeof item[field] === "number" ? item[field] : fallback;
  };

  // muscle / fat 데이터 생성 함수
  const buildSectionData = (keys) =>
    keys.map(({ key, label, value }) => ({
      subject: label,
      A: value,
      B: 100,
    }));

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
    };
  });

  // muscle / fat 키 배열
  const muscleKeys = [
    {
      key: "trunk_muscle",
      label: "몸통",
      value: (100 * trunkMuscle) / getStandardStat("trunk_muscle", "avg"),
    },
    {
      key: "right_arm_muscle",
      label: "오른팔",
      value:
        (100 * rightArmMuscle) / getStandardStat("right_arm_muscle", "avg"),
    },
    {
      key: "right_leg_muscle",
      label: "오른다리",
      value:
        (100 * rightLegMuscle) / getStandardStat("right_leg_muscle", "avg"),
    },
    {
      key: "left_leg_muscle",
      label: "왼다리",
      value: (100 * leftLegMuscle) / getStandardStat("left_leg_muscle", "avg"),
    },
    {
      key: "left_arm_muscle",
      label: "왼팔",
      value: (100 * leftArmMuscle) / getStandardStat("left_arm_muscle", "avg"),
    },
  ];

  const fatKeys = [
    {
      key: "trunk_fat",
      label: "몸통",
      value: (100 * trunkFat) / getStandardStat("trunk_fat", "avg"),
    },
    {
      key: "right_arm_fat",
      label: "오른팔",
      value: (100 * rightArmFat) / getStandardStat("right_arm_fat", "avg"),
    },
    {
      key: "right_leg_fat",
      label: "오른다리",
      value: (100 * rightLegFat) / getStandardStat("right_leg_fat", "avg"),
    },
    {
      key: "left_leg_fat",
      label: "왼다리",
      value: (100 * leftLegFat) / getStandardStat("left_leg_fat", "avg"),
    },
    {
      key: "left_arm_fat",
      label: "왼팔",
      value: (100 * leftArmFat) / getStandardStat("left_arm_fat", "avg"),
    },
  ];

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

  return (
    <>
      {mainInbodyData &&
      mainInbodyData.inbodyResult &&
      mainInbodyData.inbodyResult.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6 p-6 text-green-600">
          <InbodyRadarCharts
            inbodyScore={inbodyScore}
            muscleData={muscleData}
            fatData={fatData}
          />
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
                <button onClick={calendarModalOpen}>{inbodyTime}</button>
                {availableDates.indexOf(inbodyTime) <
                  availableDates.length - 1 && (
                  <button
                    className="w-8 h-8 text-2xl ml-2"
                    onClick={handleNextDate}
                  >
                    <IoIosArrowForward />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="ok"
                  onClick={() => setIsShowDetailModal(true)}
                >
                  상세
                </button>
                <button
                  className="ok"
                  onClick={() => setIsShowRegisterModal(true)}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div>등록된 정보가 없습니다. 인바디를 등록해주세요.</div>
          <button className="ok" onClick={() => setIsShowRegisterModal(true)}>
            등록
          </button>
        </div>
      )}

      {/* 모달들은 조건부 렌더링 밖에 있어야 함 */}
      <InbodyCalendarModal
        isOpen={isShowCalendarModal}
        onClose={() => setIsShowCalendarModal(false)}
        calendarEvents={calendarEvents}
        onDateClick={handleDateClick}
        onDatesSet={handleDatesSet}
        initialDate={inbodyTime}
      />
      {isShowRegisterModal && (
        <StandardModal
          title="인바디 등록"
          size={{ width: "50vw", height: "10vw" }}
          closeEvent={() => setIsShowRegisterModal(false)}
        >
          <InbodyRegisterForm
            userName={userName}
            userId={userId}
            onClose={() => setIsShowRegisterModal(false)}
            onSubmit={handleInbodyInsertSubmit}
          />
        </StandardModal>
      )}
      {isShowDetailModal && (
        <StandardModal
          title="인바디 상세"
          size={{ width: "50vw", height: "10vw" }}
          closeEvent={() => setIsShowDetailModal(false)}
        >
          <InbodyDetailForm
            userName={userName}
            inbodyData={mainInbodyData?.inbodyResult[0]}
            onClose={() => setIsShowDetailModal(false)}
            onSubmit={handleInbodyUpdateSubmit}
          />
        </StandardModal>
      )}
    </>
  );
};

export default Inbody;
