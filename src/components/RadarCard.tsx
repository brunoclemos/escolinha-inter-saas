"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export function RadarCard({
  data,
  color = "#C8102E",
}: {
  data: { fundamento: string; nota: number }[];
  color?: string;
}) {
  return (
    <div className="w-full h-[320px] lg:h-[380px]">
      <ResponsiveContainer>
        <RadarChart data={data} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
          <PolarGrid stroke="#E5E5E5" />
          <PolarAngleAxis
            dataKey="fundamento"
            tick={{ fontSize: 11, fill: "#6B6B66" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fontSize: 9, fill: "#9A9A95" }}
            stroke="#E5E5E5"
          />
          <Radar
            dataKey="nota"
            stroke={color}
            fill={color}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
