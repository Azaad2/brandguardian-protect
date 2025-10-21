import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useDistributorCSVUpload } from './useDistributorCSVUpload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const REQUIRED_FIELDS = ['company_name', 'contact_email'] as const;
const OPTIONAL_FIELDS = [
  'legal_name',
  'contact_phone',
  'website_url',
  'country_code',
  'state_province',
  'city',
  'address',
  'postal_code',
  'description',
  'business_type',
  'categories',
  'brands_carried',
  'logo_url',
  'min_order_value',
  'payment_terms',
  'shipping_regions',
  'certifications'
] as const;

export const DistributorCSVUpload = () => {
  const {
    file,
    csvData,
    columnMapping,
    uploadProgress,
    uploadStatus,
    validationErrors,
    handleFileSelect,
    handleColumnMapping,
    handleUpload,
    resetUpload
  } = useDistributorCSVUpload();

  const [showPreview, setShowPreview] = useState(false);

  if (!file && uploadStatus === 'idle') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Distributors CSV
          </CardTitle>
          <CardDescription>
            Import distributors from a CSV or Excel file. Required fields: Company Name, Contact Email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label 
            htmlFor="csv-upload" 
            className="block border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="text-lg font-medium mb-2">Click to upload or drag and drop</div>
            <div className="text-sm text-muted-foreground mb-4">
              CSV or XLSX (max 20MB)
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="mt-2"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('csv-upload')?.click();
              }}
            >
              Select File
            </Button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          <div className="mt-6 space-y-4">
            <div className="text-sm font-medium">Expected CSV Format:</div>
            <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
              company_name,contact_email,contact_phone,country_code,city,categories,...<br />
              "ABC Distributors","contact@abc.com","+1-555-1234","US","Los Angeles","Electronics,Home Goods",...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (csvData && !showPreview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map CSV Columns</CardTitle>
          <CardDescription>
            Match your CSV columns to database fields. Required: Company Name, Contact Email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Found {csvData.length} rows in your file. First row is treated as headers.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="font-medium">Required Fields</div>
            {REQUIRED_FIELDS.map((field) => (
              <div key={field} className="grid grid-cols-2 gap-4 items-center">
                <Label className="text-right capitalize">
                  {field.replace(/_/g, ' ')} *
                </Label>
                <Select
                  value={columnMapping[field] || ''}
                  onValueChange={(value) => handleColumnMapping(field, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skip">-- Skip --</SelectItem>
                    {csvData[0] && Object.keys(csvData[0]).map((col) => (
                      <SelectItem key={col} value={col}>{col}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <div className="font-medium mt-6">Optional Fields</div>
            {OPTIONAL_FIELDS.map((field) => (
              <div key={field} className="grid grid-cols-2 gap-4 items-center">
                <Label className="text-right capitalize text-sm">
                  {field.replace(/_/g, ' ')}
                </Label>
                <Select
                  value={columnMapping[field] || 'skip'}
                  onValueChange={(value) => handleColumnMapping(field, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Skip --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skip">-- Skip --</SelectItem>
                    {csvData[0] && Object.keys(csvData[0]).map((col) => (
                      <SelectItem key={col} value={col}>{col}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setShowPreview(true)} disabled={!columnMapping.company_name || !columnMapping.contact_email}>
              Preview Import
            </Button>
            <Button variant="outline" onClick={resetUpload}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showPreview && uploadStatus === 'idle') {
    const previewData = csvData.slice(0, 10);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preview Import ({csvData.length} records)</CardTitle>
          <CardDescription>
            Review the first 10 records before importing. Click Import to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Found {validationErrors.length} validation errors. Please fix them before importing.
                <ul className="mt-2 list-disc list-inside">
                  {validationErrors.slice(0, 5).map((error, idx) => (
                    <li key={idx} className="text-sm">{error}</li>
                  ))}
                  {validationErrors.length > 5 && (
                    <li className="text-sm">...and {validationErrors.length - 5} more</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Categories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">
                      {columnMapping.company_name ? row[columnMapping.company_name] : '-'}
                    </TableCell>
                    <TableCell>
                      {columnMapping.contact_email ? row[columnMapping.contact_email] : '-'}
                    </TableCell>
                    <TableCell>
                      {columnMapping.contact_phone ? row[columnMapping.contact_phone] : '-'}
                    </TableCell>
                    <TableCell>
                      {columnMapping.city ? row[columnMapping.city] : '-'}
                      {columnMapping.country_code ? `, ${row[columnMapping.country_code]}` : ''}
                    </TableCell>
                    <TableCell className="text-xs">
                      {columnMapping.categories ? row[columnMapping.categories] : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="flex gap-3">
            <Button 
              onClick={handleUpload} 
              disabled={validationErrors.length > 0}
            >
              Import {csvData.length} Distributors
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to Mapping
            </Button>
            <Button variant="outline" onClick={resetUpload}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (uploadStatus === 'uploading') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Importing Distributors...</CardTitle>
          <CardDescription>
            Please wait while we process your file. This may take a few minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={uploadProgress} className="w-full" />
          <div className="text-center text-sm text-muted-foreground">
            {uploadProgress}% complete
          </div>
        </CardContent>
      </Card>
    );
  }

  if (uploadStatus === 'success') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Import Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully imported {csvData.length} distributors.
            </AlertDescription>
          </Alert>
          <Button onClick={resetUpload}>
            Import Another File
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (uploadStatus === 'error') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Import Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              An error occurred during import. Please check your file and try again.
            </AlertDescription>
          </Alert>
          <Button onClick={resetUpload}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};
