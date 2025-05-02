
import React from 'react';
import { Check, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  documentFile: File | null;
  setDocumentFile: (file: File | null) => void;
}

const DocumentUpload = ({ documentFile, setDocumentFile }: DocumentUploadProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocumentFile(file);
      toast({
        title: "Document attached",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      });
    }
  };

  const removeFile = () => {
    setDocumentFile(null);
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
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG files up to 5MB</p>
            <div className="mt-4">
              <label
                htmlFor="document-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandguardian-500"
              >
                Select file
              </label>
              <input
                id="document-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{documentFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(documentFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="font-medium text-brandguardian-600 hover:text-brandguardian-500"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Your documents are used to verify your business credentials and are stored securely.
      </p>
    </div>
  );
};

export default DocumentUpload;
