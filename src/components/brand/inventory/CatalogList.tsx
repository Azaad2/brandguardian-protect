
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface Catalog {
  id: string;
  name: string;
  created_at: string;
  status: string;
  file_url: string;
}

interface CatalogListProps {
  catalogs: Catalog[] | null;
  isLoading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CatalogList = ({ catalogs, isLoading, onFileSelect }: CatalogListProps) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Catalogs</CardTitle>
        <CardDescription>
          View and manage your uploaded product catalogs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading catalogs...</div>
        ) : catalogs && catalogs.length > 0 ? (
          <div className="space-y-4">
            {catalogs.map((catalog: Catalog) => (
              <div key={catalog.id} className="flex justify-between items-center p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{catalog.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Uploaded on {new Date(catalog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(catalog.status)}`}>
                    {catalog.status.charAt(0).toUpperCase() + catalog.status.slice(1)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => window.open(catalog.file_url, '_blank')}>
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
            <div className="text-center">
              <h3 className="mb-1 text-lg font-medium">No catalogs uploaded yet</h3>
              <p className="text-muted-foreground">
                Upload your product catalog for admin approval.
              </p>
              <div className="mt-4">
                <label htmlFor="first-catalog-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Your First Catalog
                  </Button>
                  <input
                    id="first-catalog-upload"
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.pdf"
                    onChange={onFileSelect}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CatalogList;
