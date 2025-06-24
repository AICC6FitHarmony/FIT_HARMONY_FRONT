import React, { PureComponent } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";

const data = [
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

const Inbody = () => {
  return (
    <div>
      <h1>Inbody</h1>
      <RadarChart outerRadius={90} width={730} height={250} data={data}>
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
