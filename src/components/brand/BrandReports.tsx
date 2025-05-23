
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { AreaChart, BarChart, LineChart } from "@/components/ui/chart";
import { ArrowDownToLine, FileText, Filter } from "lucide-react";

const BrandReports = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  });
  
  const [selectedReport, setSelectedReport] = useState("sales");

  // Sample data for charts
  const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 3490 },
    { name: "Aug", value: 4000 },
    { name: "Sep", value: 4500 },
    { name: "Oct", value: 5200 },
    { name: "Nov", value: 6000 },
    { name: "Dec", value: 7000 },
  ];
  
  const categoryData = [
    { name: "Electronics", value: 40 },
    { name: "Home Goods", value: 25 },
    { name: "Beauty", value: 15 },
    { name: "Fashion", value: 12 },
    { name: "Sports", value: 8 },
  ];
  
  const channelData = [
    { name: "Amazon", value: 55 },
    { name: "Walmart", value: 25 },
    { name: "eBay", value: 10 },
    { name: "Direct", value: 10 },
  ];

  const resellerPerformanceData = [
    { name: "Summit Retail", value: 4800 },
    { name: "Metro Wholesale", value: 3200 },
    { name: "Valley Supply", value: 2900 },
    { name: "Acme Distribution", value: 2400 },
    { name: "Peak Distribution", value: 1800 },
  ];

  // Sample reports list
  const reports = [
    {
      id: "report-1",
      name: "Monthly Sales Report - April 2023",
      type: "Sales",
      date: "2023-05-05",
    },
    {
      id: "report-2",
      name: "Q1 Performance Analysis",
      type: "Performance",
      date: "2023-04-15",
    },
    {
      id: "report-3",
      name: "Reseller Network Growth",
      type: "Network",
      date: "2023-03-30",
    },
    {
      id: "report-4",
      name: "Product Category Analysis",
      type: "Product",
      date: "2023-03-15",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View sales reports and analyze performance metrics</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
              <DatePicker 
                selected={dateRange.from}
                onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                placeholder="From date" 
              />
              <span className="hidden sm:block">to</span>
              <DatePicker 
                selected={dateRange.to}
                onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                placeholder="To date" 
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button size="sm">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from previous period
                </p>
                <div className="h-[80px] mt-4">
                  <LineChart 
                    data={salesData}
                    xAxis="name"
                    yAxis="value"
                    color="#10b981"
                    showGrid={false}
                    showAxisLabels={false}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">
                  +12.3% from previous period
                </p>
                <div className="h-[80px] mt-4">
                  <BarChart 
                    data={salesData}
                    xAxis="name"
                    yAxis="value"
                    color="#8b5cf6"
                    showGrid={false}
                    showAxisLabels={false}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Resellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +8 new this period
                </p>
                <div className="h-[80px] mt-4">
                  <LineChart 
                    data={[
                      { name: "Jan", value: 10 },
                      { name: "Feb", value: 12 },
                      { name: "Mar", value: 15 },
                      { name: "Apr", value: 18 },
                      { name: "May", value: 20 },
                      { name: "Jun", value: 22 },
                      { name: "Jul", value: 24 },
                    ]}
                    xAxis="name"
                    yAxis="value"
                    color="#f59e0b"
                    showGrid={false}
                    showAxisLabels={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Monthly revenue over the last year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <AreaChart 
                    data={salesData}
                    xAxis="name"
                    yAxis="value"
                    color="#3b82f6"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sales Breakdown</CardTitle>
                    <CardDescription>
                      <Select defaultValue={selectedReport} onValueChange={setSelectedReport}>
                        <SelectTrigger className="w-[180px] mt-2">
                          <SelectValue placeholder="Select breakdown" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">By Product Category</SelectItem>
                          <SelectItem value="channel">By Sales Channel</SelectItem>
                          <SelectItem value="reseller">By Reseller</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {selectedReport === 'sales' && (
                    <BarChart 
                      data={categoryData}
                      xAxis="name"
                      yAxis="value"
                      color="#8b5cf6"
                    />
                  )}
                  {selectedReport === 'channel' && (
                    <BarChart 
                      data={channelData}
                      xAxis="name"
                      yAxis="value"
                      color="#10b981"
                    />
                  )}
                  {selectedReport === 'reseller' && (
                    <BarChart 
                      data={resellerPerformanceData}
                      xAxis="name"
                      yAxis="value"
                      color="#f59e0b"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Access and download your previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs text-blue-700 mr-2">
                            {report.type}
                          </span>
                          <span>Generated: {report.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground">
                  Showing {reports.length} reports
                </p>
                <Button variant="outline" size="sm">
                  Load More
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Report</CardTitle>
              <CardDescription>
                Create a customized report based on your requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select defaultValue="sales">
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="reseller">Reseller Performance</SelectItem>
                      <SelectItem value="product">Product Performance</SelectItem>
                      <SelectItem value="marketing">Marketing Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex items-center space-x-2">
                    <DatePicker 
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      placeholder="From date" 
                    />
                    <span>to</span>
                    <DatePicker 
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      placeholder="To date" 
                    />
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Additional Filters</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="home">Home Goods</SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sales channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Channels</SelectItem>
                        <SelectItem value="amazon">Amazon</SelectItem>
                        <SelectItem value="walmart">Walmart</SelectItem>
                        <SelectItem value="ebay">eBay</SelectItem>
                        <SelectItem value="direct">Direct</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <label className="text-sm font-medium">Report Format</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="pdf" name="format" value="pdf" defaultChecked />
                      <label htmlFor="pdf">PDF</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="excel" name="format" value="excel" />
                      <label htmlFor="excel">Excel</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="csv" name="format" value="csv" />
                      <label htmlFor="csv">CSV</label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Generate Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandReports;
