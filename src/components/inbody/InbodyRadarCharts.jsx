import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";

const InbodyRadarCharts = ({ inbodyScore, muscleData, fatData }) => {
  return (
    <div className="w-full md:w-1/2 space-y-4">
      <div className="text-xl font-semibold text-center">
        <p>
          인바디 점수 (<span className="font-bold text-2xl">{inbodyScore}</span>
          /100)
        </p>
        <span className="text-sm text-gray-400">
          *체성분 종합점수입니다. 근육이 많은 경우 100점을 넘을 수 있습니다.
        </span>
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
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
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
              <PolarRadiusAxis angle={30} domain={[0, 300]} />
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
  );
};

export default InbodyRadarCharts;
