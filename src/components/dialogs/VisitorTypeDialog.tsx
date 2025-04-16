
import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
    setOpen(false);
    navigate("/brand/login");
  };

  const handleResellerSelect = () => {
    setOpen(false);
    navigate("/reseller-hub");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Welcome to BndBox</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-center text-muted-foreground mb-6">
            Please select how you would like to use our platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 border-2 hover:border-bndbox-500 hover:bg-bndbox-50"
              onClick={handleBrandSelect}
            >
              <Building2 className="h-8 w-8 text-bndbox-600" />
              <div className="text-center">
                <div className="font-bold">I'm a Brand</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Find trusted resellers for your products
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  Connect with brands and grow your business
                </p>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitorTypeDialog;
