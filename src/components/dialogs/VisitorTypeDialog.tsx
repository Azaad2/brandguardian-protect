
import * as React from "react";
import { useNavigate } from "react-router-dom";
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
}

const VisitorTypeDialog = ({ open, setOpen }: VisitorTypeDialogProps) => {
  const navigate = useNavigate();

  const handleBrandSelect = () => {
    // Changed to navigate to homepage instead of brand portal
    navigate("/");
    setOpen(false);
  };

  const handleResellerSelect = () => {
    setOpen(false);
    navigate("/reseller-hub");
  };

  // Prevent closing the dialog when clicking outside or pressing escape
  const handleOpenChange = (open: boolean) => {
    // Only allow the dialog to close if we're explicitly setting it to close
    // through one of our buttons
    if (open === false) {
      return; // Prevent dialog from closing
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitorTypeDialog;
