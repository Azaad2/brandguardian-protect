
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { 
  ArrowDownToLine, 
  Calendar, 
  Clock,
  Mail, 
  Save,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BrandReports = () => {
  const [reportPeriod, setReportPeriod] = useState('30d');

  // Sample data - in a real app, this would come from an API
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Amazon',
        data: [42000, 49000, 52000, 58000, 64000, 72000],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      },
      {
        label: 'Walmart',
        data: [28000, 32000, 31000, 35000, 40000, 43000],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
      },
      {
        label: 'eBay',
        data: [12000, 11000, 14000, 16000, 15000, 18000],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
      },
    ],
  };

  const complianceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'MAP Violations',
        data: [24, 18, 12, 14, 10, 8],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Unauthorized Sellers',
        data: [16, 12, 10, 8, 5, 3],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Content Issues',
        data: [8, 7, 6, 9, 5, 4],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const resellerPerformanceData = {
    labels: ['Metro Wholesale', 'Summit Retail', 'Valley Supply Co.', 'Peak Distribution', 'Harbor Markets'],
    datasets: [
      {
        label: 'Sales Volume',
        data: [45000, 38000, 32000, 18000, 12000],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      },
    ],
  };

  const marketplaceDistribution = {
    labels: ['Amazon', 'Walmart', 'eBay', 'Shopify', 'Other'],
    datasets: [
      {
        label: 'Sales Distribution',
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(107, 114, 128, 0.7)',
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const productPerformanceData = {
    labels: ['Premium Skincare', 'Hair Growth Formula', 'Night Repair Serum', 'Teeth Whitening', 'Eye Cream'],
    datasets: [
      {
        label: 'Sales Volume',
        data: [65000, 48000, 42000, 38000, 25000],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      },
    ],
  };

  const handleDownload = (reportType: string) => {
    toast({
      title: 'Report Downloaded',
      description: `Your ${reportType} report has been downloaded successfully.`,
      duration: 3000,
    });
  };

  const handleSchedule = (reportType: string) => {
    toast({
      title: 'Report Scheduled',
      description: `Your ${reportType} report has been scheduled for weekly delivery.`,
      duration: 3000,
    });
  };

  // Preset report templates
  const reportTemplates = [
    {
      name: 'Sales Performance',
      description: 'Sales across marketplaces and resellers',
      icon: <ArrowDownToLine className="h-5 w-5" />,
    },
    {
      name: 'Compliance Trends',
      description: 'MAP violations and unauthorized sellers',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: 'Reseller Activity',
      description: 'Performance metrics by reseller',
      icon: <Save className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reporting</h1>
        <p className="text-muted-foreground">Generate insights and export reports about your brand performance</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Report Dashboard</h2>
          <p className="text-sm text-muted-foreground">Select a time period to view data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setReportPeriod('7d')} className={reportPeriod === '7d' ? 'bg-muted' : ''}>
            7 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setReportPeriod('30d')} className={reportPeriod === '30d' ? 'bg-muted' : ''}>
            30 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setReportPeriod('90d')} className={reportPeriod === '90d' ? 'bg-muted' : ''}>
            90 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setReportPeriod('1y')} className={reportPeriod === '1y' ? 'bg-muted' : ''}>
            1 Year
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="resellers">Reseller Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sales by Marketplace</CardTitle>
                <CardDescription>Monthly sales performance across different platforms</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <BarChart data={salesData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    },
                  },
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                    },
                  },
                }} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Distribution</CardTitle>
                <CardDescription>Sales percentage by platform</CardDescription>
              </CardHeader>
              <CardContent className="flex h-[300px] items-center justify-center">
                <div className="h-full w-full max-w-[300px]">
                  <PieChart data={marketplaceDistribution} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                  }} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing products by sales volume</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart data={productPerformanceData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                    },
                  },
                }} />
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleDownload('Sales Analytics')} className="flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => handleSchedule('Sales Analytics')} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Delivery
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trends</CardTitle>
              <CardDescription>Track MAP violations and unauthorized seller activity over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <LineChart data={complianceData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }} />
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleDownload('Compliance')} className="flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => handleSchedule('Compliance')} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Delivery
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="resellers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Resellers by Volume</CardTitle>
              <CardDescription>Performance of your highest volume reseller partners</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <BarChart data={resellerPerformanceData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }} />
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleDownload('Reseller Performance')} className="flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => handleSchedule('Reseller Performance')} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Delivery
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Scheduled Reports Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Scheduled Reports</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportTemplates.map((template, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    {template.icon}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Edit</span>
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="mt-2 text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Frequency:</span>
                    <span>Weekly</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Format:</span>
                    <span>PDF + Excel</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Recipients:</span>
                    <span>3 team members</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Report Card */}
          <Card className="flex flex-col items-center justify-center border-dashed py-6">
            <div className="mb-3 rounded-full bg-primary/10 p-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-1 text-lg font-medium">Create Report</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Configure a new custom report
            </p>
            <Button>Create New</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Plus icon component
const Plus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default BrandReports;
