
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart } from '@/components/ui/chart';

interface ComplianceChartProps {
  complianceData: {
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Monitoring</CardTitle>
        <CardDescription>MAP violations and resolution trends</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <BarChart 
          data={complianceData} 
          className="w-full" 
        />
      </CardContent>
    </Card>
  );
};

export default ComplianceChart;
