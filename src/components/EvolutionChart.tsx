"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { EvolutionPoint } from "@/data/felipe";

type Metric = {
  key: keyof EvolutionPoint;
  label: string;
  unit: string;
  color: string;
  inverted?: boolean; // menor é melhor (sprint)
};

export function EvolutionChart({
  data,
  metric,
}: {
  data: EvolutionPoint[];
  metric: Metric;
}) {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#F0F0EE" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#6B6B66" }}
            stroke="#E5E5E5"
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6B6B66" }}
            stroke="#E5E5E5"
            tickLine={false}
            axisLine={false}
            width={40}
            domain={["auto", "auto"]}
            reversed={metric.inverted}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #E5E5E5",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
            formatter={(v) => [`${v} ${metric.unit}`, metric.label]}
            labelStyle={{ color: "#6B6B66", fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey={metric.key as string}
            stroke={metric.color}
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: metric.color }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
