import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";

const InbodyRadarCharts = ({
  inbodyScore,
  muscleData,
  fatData,
  fullMark_tM,
  fullMark_tF,
}) => {
  return (
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
  );
};

export default InbodyRadarCharts;
