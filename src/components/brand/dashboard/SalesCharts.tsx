
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LineChart, PieChart } from '@/components/ui/chart';

interface Order {
  total_amount: number;
  status: string;
  created_at: string;
}

interface SalesChartsProps {
  orders: Order[];
}

const SalesCharts = ({ orders }: SalesChartsProps) => {
  // Transform order data into chart format
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Revenue',
        data: [0, 0, 0, 0, 0, orders.reduce((sum, order) => sum + Number(order.total_amount), 0)],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 2,
      },
    ],
  };

  // Create marketplace distribution (mock data for now since we don't have marketplace info in orders)
  const marketplaceData = {
    labels: ['Amazon', 'Walmart', 'eBay', 'Direct', 'Other'],
    datasets: [
      {
        label: 'Sales Distribution',
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(234, 88, 12, 0.7)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(107, 114, 128, 0.7)',
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="col-span-4 space-y-4">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>
            Total revenue from {orders.length} orders across all channels and resellers
          </CardDescription>
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
