
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CatalogUploadFormProps {
  file: File;
  catalogName: string;
  setCatalogName: (name: string) => void;
  uploading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const CatalogUploadForm = ({
  file,
  catalogName,
  setCatalogName,
  uploading,
  onCancel,
  onSubmit,
}: CatalogUploadFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Catalog</CardTitle>
        <CardDescription>
          Submit your product catalog for admin approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Selected File</label>
            <p className="text-sm">{file.name} ({Math.round(file.size / 1024)} KB)</p>
          </div>
          <div>
            <label htmlFor="catalog-name" className="text-sm font-medium">Catalog Name</label>
            <Input 
              id="catalog-name"
              value={catalogName}
              onChange={(e) => setCatalogName(e.target.value)}
              placeholder="Enter catalog name"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onSubmit}
              disabled={uploading || !catalogName}
            >
              {uploading ? "Uploading..." : "Submit for Approval"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatalogUploadForm;
