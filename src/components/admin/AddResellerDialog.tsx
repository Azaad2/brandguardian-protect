
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AddResellerDialogProps {
  onAddApplication: (email: string, companyName: string) => Promise<void>;
  isOfflineMode?: boolean;
}

const AddResellerDialog = ({ onAddApplication, isOfflineMode = false }: AddResellerDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const handleAddApplication = async () => {
    if (!newEmail || !newCompanyName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both email and company name",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      setNetworkError(false);
      
      if (isOfflineMode) {
        // Simulate success in offline mode (for demo purposes)
        setTimeout(() => {
          toast({
            title: "Application saved locally",
            description: "The application will be submitted when connection is restored.",
          });
          setNewEmail('');
          setNewCompanyName('');
          setDialogOpen(false);
          setIsSubmitting(false);
        }, 1000);
        return;
      }
      
      await onAddApplication(newEmail, newCompanyName);
      
      // Reset form
      setNewEmail('');
      setNewCompanyName('');
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Error in handleAddApplication:', error);
      
      if (error.message && error.message.includes('Failed to fetch')) {
        setNetworkError(true);
        toast({
          variant: "destructive",
          title: "Network connection error",
          description: "Could not connect to the server. Please check your internet connection.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error adding application",
          description: error.message || "Failed to add application. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Manual Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Reseller Application</DialogTitle>
          <DialogDescription>
            Add a reseller who sent their application by email
          </DialogDescription>
        </DialogHeader>
        
        {networkError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Network Error</AlertTitle>
            <AlertDescription>
              Connection to the database failed. The application will be temporarily stored locally
              and synchronized when the connection is restored.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="col-span-3"
              placeholder="reseller@company.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input
              id="company"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              className="col-span-3"
              placeholder="Reseller Company Name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleAddApplication} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddResellerDialog;
