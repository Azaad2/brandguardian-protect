
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart } from '@/components/ui/chart';

interface ComplianceChartProps {
  complianceData?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
}

const ComplianceChart = ({ complianceData }: ComplianceChartProps) => {
  // Use mock data if no compliance data is provided
  const defaultComplianceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'MAP Violations',
        data: [14, 12, 10, 9, 7, 8],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
      },
      {
        label: 'Resolved Issues',
        data: [5, 7, 9, 8, 10, 12],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Monitoring</CardTitle>
        <CardDescription>MAP violations and resolution trends</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <BarChart 
          data={complianceData || defaultComplianceData} 
          className="w-full" 
        />
      </CardContent>
    </Card>
  );
};

export default ComplianceChart;
