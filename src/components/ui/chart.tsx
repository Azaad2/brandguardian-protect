import * as React from "react";
import { 
  Bar, 
  Line, 
  Pie, 
  BarChart as ReChartsBarChart,
  LineChart as ReChartsLineChart,
  PieChart as ReChartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from "recharts";

// Define type for chart data
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
    borderDash?: number[];
  }[];
}

// Define type for pie chart data item
export interface PieChartDataItem {
  name: string;
  value: number;
  color?: string;
}

// Bar Chart Component
export function BarChart({ data, className }: { data: ChartData; className?: string }) {
  // Transform the data for recharts
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <ReChartsBarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Bar 
            key={index}
            dataKey={dataset.label} 
            fill={Array.isArray(dataset.backgroundColor) 
              ? dataset.backgroundColor[0] 
              : dataset.backgroundColor}
          />
        ))}
      </ReChartsBarChart>
    </ResponsiveContainer>
  );
}

// Line Chart Component
export function LineChart({ data, className }: { data: ChartData; className?: string }) {
  // Transform the data for recharts
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <ReChartsLineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Line
            key={index}
            type={dataset.tension ? "natural" : "monotone"}
            dataKey={dataset.label}
            stroke={dataset.borderColor}
            strokeWidth={dataset.borderWidth || 2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            strokeDasharray={dataset.borderDash ? dataset.borderDash.join(' ') : undefined}
          />
        ))}
      </ReChartsLineChart>
    </ResponsiveContainer>
  );
}

// Pie Chart Component
export function PieChart({ 
  data, 
  className 
}: { 
  data: ChartData | PieChartDataItem[]; 
  className?: string 
}) {
  const isPieChartData = (data: any): data is PieChartDataItem[] => {
    return Array.isArray(data) && data.length > 0 && 'name' in data[0] && 'value' in data[0];
  };

  // Transform data if it's in ChartData format
  const transformedData = isPieChartData(data) 
    ? data 
    : data.labels.map((label, index) => ({
        name: label,
        value: data.datasets[0].data[index],
        color: Array.isArray(data.datasets[0].backgroundColor) 
          ? data.datasets[0].backgroundColor[index] 
          : data.datasets[0].backgroundColor
      }));

  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
    "#82CA9D", "#A4DE6C", "#D0ED57", "#FFC658", "#8DD1E1"
  ];

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <ReChartsPieChart>
        <Pie
          data={transformedData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={(entry) => entry.name}
        >
          {transformedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </ReChartsPieChart>
    </ResponsiveContainer>
  );
}
