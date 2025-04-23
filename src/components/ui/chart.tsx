
import React from 'react';
import { Line, Bar, Pie } from 'recharts';

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }[];
};

type ChartOptions = {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      position?: 'top' | 'left' | 'right' | 'bottom';
      display?: boolean;
    };
    tooltip?: {
      mode?: 'index' | 'nearest' | 'point';
      intersect?: boolean;
    };
  };
  scales?: {
    x?: {
      stacked?: boolean;
      beginAtZero?: boolean;
    };
    y?: {
      stacked?: boolean;
      beginAtZero?: boolean;
    };
  };
  indexAxis?: 'x' | 'y';
};

interface ChartProps {
  data: ChartData;
  options?: ChartOptions;
  className?: string;
}

// Convert our ChartData format to Recharts format
const convertToRechartsData = (data: ChartData) => {
  return data.labels.map((label, index) => {
    const point: Record<string, any> = { name: label };
    data.datasets.forEach(dataset => {
      point[dataset.label] = dataset.data[index];
    });
    return point;
  });
};

const LineChart: React.FC<ChartProps> = ({ data, options, className }) => {
  const rechartsData = convertToRechartsData(data);
  
  return (
    <div className={className}>
      <div className="flex h-full w-full items-center justify-center">
        {/* This is a simplified implementation */}
        <div className="h-full w-full rounded-md bg-slate-50 p-4">
          <div className="mb-4 flex justify-between">
            <div>
              <h4 className="text-sm font-medium">Line Chart</h4>
              <p className="text-xs text-muted-foreground">{data.datasets[0].label}</p>
            </div>
            <div className="flex items-center gap-2">
              {data.datasets.map((dataset, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: Array.isArray(dataset.backgroundColor) 
                      ? dataset.backgroundColor[0] 
                      : dataset.backgroundColor || 'currentColor' }} 
                  />
                  <span className="text-xs">{dataset.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[calc(100%-2rem)] w-full">
            <Line 
              data={rechartsData}
              dataKey={data.datasets.map(ds => ds.label)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BarChart: React.FC<ChartProps> = ({ data, options, className }) => {
  const rechartsData = convertToRechartsData(data);
  
  return (
    <div className={className}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-full w-full rounded-md bg-slate-50 p-4">
          <div className="mb-4 flex justify-between">
            <div>
              <h4 className="text-sm font-medium">Bar Chart</h4>
              <p className="text-xs text-muted-foreground">{data.datasets[0].label}</p>
            </div>
            <div className="flex items-center gap-2">
              {data.datasets.map((dataset, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: Array.isArray(dataset.backgroundColor) 
                      ? dataset.backgroundColor[0] 
                      : dataset.backgroundColor || 'currentColor' }} 
                  />
                  <span className="text-xs">{dataset.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[calc(100%-2rem)] w-full">
            <Bar 
              data={rechartsData}
              dataKey={data.datasets.map(ds => ds.label)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const PieChart: React.FC<ChartProps> = ({ data, options, className }) => {
  const rechartsData = convertToRechartsData(data);
  
  return (
    <div className={className}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-full w-full rounded-md bg-slate-50 p-4">
          <div className="mb-4 flex justify-between">
            <div>
              <h4 className="text-sm font-medium">Pie Chart</h4>
              <p className="text-xs text-muted-foreground">{data.datasets[0].label}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: Array.isArray(data.datasets[0].backgroundColor) 
                      ? data.datasets[0].backgroundColor[index] 
                      : data.datasets[0].backgroundColor || 'currentColor' }} 
                  />
                  <span className="text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-[calc(100%-2rem)] w-full items-center justify-center">
            <Pie 
              data={rechartsData.map((item, index) => ({
                name: item.name,
                value: data.datasets[0].data[index],
              }))}
              dataKey="value"
              nameKey="name" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { LineChart, BarChart, PieChart };
