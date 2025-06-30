
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BrandsErrorStateProps {
  error: Error | null;
}

const BrandsErrorState = ({ error }: BrandsErrorStateProps) => {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
        <AlertDescription className="text-base">
          {error instanceof Error ? error.message : 'Failed to load available brands'}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default BrandsErrorState;
