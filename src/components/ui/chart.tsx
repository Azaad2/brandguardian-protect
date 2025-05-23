
import React from "react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart as RechartsAreaChart, Area, BarChart as RechartsBarChart, Bar } from "recharts";

interface ChartProps {
  data: any[];
  xAxis: string;
  yAxis: string;
  color?: string;
  showGrid?: boolean;
  showAxisLabels?: boolean;
}

export const LineChart = ({ 
  data, 
  xAxis, 
  yAxis, 
  color = "#3b82f6",
  showGrid = true,
  showAxisLabels = true 
}: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {showAxisLabels && <XAxis dataKey={xAxis} fontSize={12} tickLine={false} axisLine={false} />}
        {showAxisLabels && <YAxis fontSize={12} tickLine={false} axisLine={false} />}
        <Tooltip 
          contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
        />
        <Line
          type="monotone"
          dataKey={yAxis}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 3 }}
          activeDot={{ fill: color, r: 5 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const AreaChart = ({ 
  data, 
  xAxis, 
  yAxis, 
  color = "#3b82f6",
  showGrid = true,
  showAxisLabels = true 
}: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {showAxisLabels && <XAxis dataKey={xAxis} fontSize={12} tickLine={false} axisLine={false} />}
        {showAxisLabels && <YAxis fontSize={12} tickLine={false} axisLine={false} />}
        <Tooltip 
          contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
        />
        <Area
          type="monotone"
          dataKey={yAxis}
          stroke={color}
          fill={`${color}20`}
          strokeWidth={2}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export const BarChart = ({ 
  data, 
  xAxis, 
  yAxis, 
  color = "#3b82f6",
  showGrid = true,
  showAxisLabels = true 
}: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {showAxisLabels && <XAxis dataKey={xAxis} fontSize={12} tickLine={false} axisLine={false} />}
        {showAxisLabels && <YAxis fontSize={12} tickLine={false} axisLine={false} />}
        <Tooltip 
          contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
        />
        <Bar dataKey={yAxis} fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
