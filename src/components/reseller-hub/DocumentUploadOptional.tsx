import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface DocumentUploadOptionalProps {
  onDocumentSelect: (file: File | null) => void;
  onUploadStart: () => void;
  onUploadComplete: (path: string) => void;
  onUploadError: () => void;
  uploadInProgress: boolean;
  documentError: string | null;
  selectedFile: File | null;
}

const DocumentUploadOptional: React.FC<DocumentUploadOptionalProps> = ({
  onDocumentSelect,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  uploadInProgress,
  documentError,
  selectedFile
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file: File | null) => {
    onDocumentSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const removeFile = () => {
    handleFileChange(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Upload (Optional)
        </CardTitle>
        <CardDescription>
          Upload verification documents to speed up your application approval process. You can also submit your application now and upload documents later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Documents help speed up approval:</strong> While not required for submission, uploading business license, tax ID, or other verification documents will help us process your application faster.
          </AlertDescription>
        </Alert>

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Drop your document here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, PNG, JPG files up to 10MB
              </p>
              <Label htmlFor="document-upload">
                <Button
                  variant="outline"
                  className="mt-2"
                  type="button"
                  disabled={uploadInProgress}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </Label>
              <Input
                id="document-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleInputChange}
                disabled={uploadInProgress}
              />
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Ready to upload
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={uploadInProgress}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {documentError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{documentError}</AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertDescription className="text-sm">
            <strong>Note:</strong> You can submit your application without a document and upload verification files later through your reseller portal once approved.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadOptional;