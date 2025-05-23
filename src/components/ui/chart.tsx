
import React from "react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart as RechartsAreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Chart data types to match the format used in our application
export type ChartDataset = {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  tension?: number;
  borderDash?: number[];
  fill?: string;
};

export type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

// Convert chart data format for recharts
const formatChartData = (data: ChartData): any[] => {
  return data.labels.map((label, i) => ({
    name: label,
    ...data.datasets.reduce((acc, dataset, j) => {
      acc[dataset.label || `dataset-${j}`] = dataset.data[i];
      return acc;
    }, {} as Record<string, number>),
  }));
};

// Convert data for pie chart
const formatPieData = (data: ChartData): Array<{ name: string; value: number; color?: string }> => {
  const dataset = data.datasets[0];
  return data.labels.map((label, i) => ({
    name: label,
    value: dataset.data[i],
    color: Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[i] : undefined,
  }));
};

interface ChartProps {
  data: ChartData;
  xAxis?: string;
  yAxis?: string;
  color?: string;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  className?: string;
}

export const LineChart = ({ 
  data, 
  xAxis = "name", 
  yAxis, 
  color = "#3b82f6",
  showGrid = true,
  showAxisLabels = true,
  className
}: ChartProps) => {
  const formattedData = formatChartData(data);
  
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart data={formattedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {showAxisLabels && <XAxis dataKey={xAxis} fontSize={12} tickLine={false} axisLine={false} />}
        {showAxisLabels && <YAxis fontSize={12} tickLine={false} axisLine={false} />}
        <Tooltip 
          contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
        />
        {data.datasets.map((dataset, i) => (
          <Line
            key={i}
            type="monotone"
            dataKey={dataset.label}
            stroke={dataset.borderColor || color}
            strokeWidth={2}
            dot={{ fill: dataset.borderColor || color, r: 3 }}
            activeDot={{ fill: dataset.borderColor || color, r: 5 }}
            strokeDasharray={dataset.borderDash}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const AreaChart = ({ 
  data, 
  xAxis = "name", 
  yAxis, 
  color = "#3b82f6",
  showGrid = true,
  showAxisLabels = true,
  className
}: ChartProps) => {
  const formattedData = formatChartData(data);
  
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsAreaChart data={formattedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {showAxisLabels && <XAxis dataKey={xAxis} fontSize={12} tickLine={false} axisLine={false} />}
        {showAxisLabels && <YAxis fontSize={12} tickLine={false} axisLine={false} />}
        <Tooltip 
          contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
        />
        {data.datasets.map((dataset, i) => (
          <Area
            key={i}
            type="monotone"
            dataKey={dataset.label}
            stroke={dataset.borderColor || color}
            fill={typeof dataset.backgroundColor === 'string' ? dataset.backgroundColor : `${color}20`}
            strokeWidth={2}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export const BarChart = ({ 
  data, 
  xAxis = "name", 
  yAxis, 
  color = "#3b82f6",
  showGrid = true,
  showAxisLabels = true,
  className
}: ChartProps) => {
  const formattedData = formatChartData(data);
  
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsBarChart data={formattedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {showAxisLabels && <XAxis dataKey={xAxis} fontSize={12} tickLine={false} axisLine={false} />}
        {showAxisLabels && <YAxis fontSize={12} tickLine={false} axisLine={false} />}
        <Tooltip 
          contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
        />
        {data.datasets.map((dataset, i) => (
          <Bar 
            key={i} 
            dataKey={dataset.label} 
            fill={Array.isArray(dataset.backgroundColor) 
              ? dataset.backgroundColor[0] 
              : dataset.backgroundColor || color
            } 
            radius={[4, 4, 0, 0]} 
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

interface PieChartProps {
  data: ChartData | Array<{ name: string; value: number; color?: string }>;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
}

export const PieChart = ({ 
  data, 
  colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
  innerRadius = 0,
  outerRadius = 80,
  className
}: PieChartProps) => {
  // Handle both data formats
  const pieData = Array.isArray(data) ? data : formatPieData(data);
  
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px" }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
