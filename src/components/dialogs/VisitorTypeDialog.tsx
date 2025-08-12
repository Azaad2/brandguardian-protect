
import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Building2 } from "lucide-react";

interface VisitorTypeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onVisitorTypeSelected?: () => void;
}

const VisitorTypeDialog = ({ open, setOpen, onVisitorTypeSelected }: VisitorTypeDialogProps) => {
  const navigate = useNavigate();

  const handleBrandSelect = () => {
    // Brands stay on homepage
    setOpen(false);
    onVisitorTypeSelected?.();
  };

  const handleResellerSelect = () => {
    // Resellers go to reseller hub to fill form
    navigate("/reseller-hub");
    setOpen(false);
    onVisitorTypeSelected?.();
  };

  // Prevent closing the dialog when clicking outside or pressing escape
  const handleOpenChange = (newOpen: boolean) => {
    // Only allow the dialog to close if we're explicitly setting it to close
    // through one of our buttons
    if (!newOpen) {
      return; // Prevent dialog from closing
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Welcome to BndBox</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Please select how you would like to use our platform
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 border-2 hover:border-bndbox-500 hover:bg-bndbox-50"
              onClick={handleBrandSelect}
            >
              <Building2 className="h-8 w-8 text-bndbox-600" />
              <div className="text-center">
                <div className="font-bold">I'm a Brand</div>
              </div>
            </Button>
            
            <Button
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center gap-2 border-2 hover:border-bndbox-500 hover:bg-bndbox-50"
              onClick={handleResellerSelect}
            >
              <ShoppingBag className="h-8 w-8 text-bndbox-600" />
              <div className="text-center">
                <div className="font-bold">I'm a Reseller</div>
              </div>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link to="/admin/login" className="text-bndbox-600 hover:underline">
              Are you an admin? Log in
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitorTypeDialog;
