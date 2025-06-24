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

const Inbody = () => {
  const data1 = [
    {
      subject: "몸통",
      A: 98,
      B: 130,
      fullMark: 150,
    },
    {
      subject: "오른팔",
      A: 86,
      B: 130,
      fullMark: 150,
    },
    {
      subject: "오른다리",
      A: 99,
      B: 100,
      fullMark: 150,
    },
    {
      subject: "왼다리",
      A: 85,
      B: 90,
      fullMark: 150,
    },
    {
      subject: "왼팔",
      A: 65,
      B: 85,
      fullMark: 150,
    },
  ];

  const dispatch = useDispatch();
  const { inbodyData, loading, error } = useSelector((state) => state.inbody);
  // 테스트용 userId (실제로는 인증된 사용자 ID를 사용해야 함)
  const userId = "1";
  useEffect(() => {
    console.log("사용자 ID:", userId);

    // 컴포넌트 마운트 시 데이터 가져오기
    const fetchData = async () => {
      try {
        await dispatch(fetchInbodyData(userId)).unwrap();
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };
    fetchData();
  }, [dispatch, userId]);

  // 데이터 로딩 상태 확인
  // console.log("Redux 상태:", { inbodyData, loading, error });
  // console.log(inbodyData.data[0].inbodyId);

  if (loading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div>에러 발생: {error}</div>;
  }

  return (
    <div>
      <RadarChart outerRadius={90} width={730} height={250} data={data1}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar
          name="Mike"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Lily"
          dataKey="B"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </div>
  );
};

export default Inbody;
