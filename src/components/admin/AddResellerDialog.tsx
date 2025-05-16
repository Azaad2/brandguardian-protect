
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
import { PlusCircle } from 'lucide-react';

interface AddResellerDialogProps {
  onAddApplication: (email: string, companyName: string) => Promise<void>;
}

const AddResellerDialog = ({ onAddApplication }: AddResellerDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');

  const handleAddApplication = async () => {
    await onAddApplication(newEmail, newCompanyName);
    // Reset form
    setNewEmail('');
    setNewCompanyName('');
    setDialogOpen(false);
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
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddApplication}>Add Application</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddResellerDialog;
