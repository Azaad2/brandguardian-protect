import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DistributorCSVUpload } from './DistributorCSVUpload';
import { DistributorsTable } from './DistributorsTable';
import { Upload, Building2 } from 'lucide-react';

export const DistributorsDirectory = () => {
  const [activeTab, setActiveTab] = useState('manage');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distributors Directory</h1>
        <p className="text-muted-foreground">
          Manage distributors, import from CSV, and feature partners on homepage
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Manage Distributors
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            CSV Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <DistributorsTable />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <DistributorCSVUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};
