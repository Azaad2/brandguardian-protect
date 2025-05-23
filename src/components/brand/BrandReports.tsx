
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesReportsTab from "./reports/SalesReportsTab";
import InventoryReportsTab from "./reports/InventoryReportsTab";
import ResellersReportsTab from "./reports/ResellersReportsTab";
import ComplianceReportsTab from "./reports/ComplianceReportsTab";
import DistributionReportsTab from "./reports/DistributionReportsTab";

const BrandReports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">View and export performance reports for your brand</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="resellers">Resellers</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <SalesReportsTab />
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <InventoryReportsTab />
        </TabsContent>
        
        <TabsContent value="resellers" className="space-y-4">
          <ResellersReportsTab />
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <ComplianceReportsTab />
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <DistributionReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandReports;
