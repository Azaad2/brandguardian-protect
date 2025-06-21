
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useBrandCSVUpload } from './useBrandCSVUpload';

interface BrandCSVUploadProps {
  onSuccess: () => void;
}

const BrandCSVUpload = ({ onSuccess }: BrandCSVUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { uploadCSV, isUploading, uploadResult, clearResult } = useBrandCSVUpload();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      clearResult();
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const success = await uploadCSV(file);
    if (success) {
      setFile(null);
      onSuccess();
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,website_url,description,contact_email,logo_url,categories
"Example Brand","https://example.com","Premium quality products","contact@example.com","https://example.com/logo.png","Electronics,Gadgets"
"Another Brand","https://anotherbrand.com","Sustainable fashion","hello@anotherbrand.com","","Fashion,Sustainable"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brands_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Brand Upload</CardTitle>
        <CardDescription>
          Upload multiple brands at once using a CSV file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-file">Select CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Selected: {file.name}
          </div>
        )}

        {uploadResult && (
          <Alert variant={uploadResult.success ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {uploadResult.success ? (
                <div>
                  <p>Upload completed successfully!</p>
                  <p>Added: {uploadResult.added} brands</p>
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <p>Errors: {uploadResult.errors.length} rows had issues</p>
                  )}
                </div>
              ) : (
                uploadResult.message
              )}
            </AlertDescription>
          </Alert>
        )}

        {uploadResult?.errors && uploadResult.errors.length > 0 && (
          <div className="max-h-32 overflow-y-auto text-sm">
            <p className="font-medium mb-2">Errors:</p>
            <ul className="space-y-1 text-red-600">
              {uploadResult.errors.map((error, index) => (
                <li key={index}>Row {error.row}: {error.message}</li>
              ))}
            </ul>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Brands
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BrandCSVUpload;
