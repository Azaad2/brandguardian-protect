
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LineChart, PieChart } from '@/components/ui/chart';

interface SalesChartsProps {
  revenueData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  marketplaceData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

const SalesCharts = ({ revenueData, marketplaceData }: SalesChartsProps) => {
  return (
    <div className="col-span-4 space-y-4">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>Total revenue across all channels and resellers</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <LineChart 
            data={revenueData} 
            className="w-full" 
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Marketplace Distribution</CardTitle>
          <CardDescription>Sales and listing distribution across marketplaces</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px]">
          <div className="w-full max-w-[300px]">
            <PieChart 
              data={marketplaceData} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesCharts;
