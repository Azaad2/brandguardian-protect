
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartLineChart, Line, PieChart as RechartPieChart, Pie, Cell } from 'recharts';

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: any;
  scales?: any;
  indexAxis?: string;
  [key: string]: any;
}

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
  options?: ChartOptions;
  className?: string;
}

export function BarChart({ data, options, className }: BarChartProps) {
  // Transform data structure for recharts
  const chartData = data.labels.map((label, index) => {
    const dataPoint: any = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Bar 
            key={dataset.label}
            dataKey={dataset.label} 
            fill={dataset.backgroundColor} 
          />
        ))}
      </RechartBarChart>
    </ResponsiveContainer>
  );
}

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension?: number;
      borderDash?: number[];
    }[];
  };
  options?: ChartOptions;
  className?: string;
}

export function LineChart({ data, options, className }: LineChartProps) {
  // Transform data structure for recharts
  const chartData = data.labels.map((label, index) => {
    const dataPoint: any = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Line
            key={dataset.label}
            type="monotone"
            dataKey={dataset.label}
            stroke={dataset.borderColor}
            strokeWidth={2}
            dot={{ strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            strokeDasharray={dataset.borderDash ? `${dataset.borderDash[0]} ${dataset.borderDash[1]}` : ""}
          />
        ))}
      </RechartLineChart>
    </ResponsiveContainer>
  );
}

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  options?: ChartOptions;
  className?: string;
}

export function PieChart({ data, options, className }: PieChartProps) {
  // Transform data structure for recharts
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index],
  }));

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={data.datasets[0].backgroundColor[index % data.datasets[0].backgroundColor.length]} 
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartPieChart>
    </ResponsiveContainer>
  );
}
