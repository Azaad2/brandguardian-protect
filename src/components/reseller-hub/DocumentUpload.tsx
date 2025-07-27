
import React from 'react';
import { Check, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

interface DocumentUploadProps {
  documentFile: File | null;
  setDocumentFile: (file: File | null) => void;
  documentError?: string | null;
  onUploadComplete?: (filePath: string) => void;
}

const DocumentUpload = ({ 
  documentFile, 
  setDocumentFile, 
  documentError,
  onUploadComplete 
}: DocumentUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const maxFileSizeMB = 5;

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      
      // For reseller applications, create anonymous upload path
      // Generate unique identifier for this session
      const sessionId = crypto.randomUUID();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `reseller-applications/${sessionId}/${fileName}`;

      // Upload file to storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      setUploadedPath(filePath);
      onUploadComplete?.(filePath);
      
      toast({
        title: "Document uploaded successfully",
        description: `${file.name} has been uploaded and will be reviewed by our team.`,
      });

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (5MB limit)
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File size too large",
          description: `The file exceeds the ${maxFileSizeMB}MB limit. Please select a smaller file.`,
        });
        return;
      }
      
      // Check file type
      const acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', 'application/pdf', 'image/jpeg', 'image/png'];
      const fileType = file.type;
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!acceptedTypes.some(type => 
        type === fileType || type === fileExtension
      )) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF, JPG, or PNG file.",
        });
        return;
      }
      
      setDocumentFile(file);
      
      // Auto-upload the file
      await uploadFile(file);
    }
  };

  const removeFile = () => {
    setDocumentFile(null);
    setUploadedPath(null);
    const fileInput = document.getElementById('document-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">Verification Documents</p>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {!documentFile ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Upload your EIN documents or Resale Certificate
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG files up to {maxFileSizeMB}MB</p>
            <div className="mt-4">
              <label
                htmlFor="document-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandguardian-500"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Select file'
                )}
              </label>
              <input
                id="document-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={isUploading}
                className="sr-only"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: Document upload is required to submit the application.
            </p>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {uploadedPath ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                ) : (
                  <Upload className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{documentFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(documentFile.size / 1024).toFixed(1)} KB
                  {uploadedPath && <span className="text-green-600 ml-2">✓ Uploaded</span>}
                  {isUploading && <span className="text-blue-600 ml-2">Uploading...</span>}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              disabled={isUploading}
              className="font-medium text-brandguardian-600 hover:text-brandguardian-500 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Your documents are used to verify your business credentials and are stored securely.
      </p>
      {documentError && (
        <p className="text-sm text-red-600 mt-2">{documentError}</p>
      )}
    </div>
  );
};

export default DocumentUpload;
