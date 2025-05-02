
import React from "react";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ onReset }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <CheckCheck className="h-12 w-12 text-green-500 mb-4" />
      <h3 className="text-2xl font-bold mb-2">Message Received!</h3>
      <p className="text-muted-foreground mb-6">
        Thank you for reaching out. One of our team members will contact you shortly.
      </p>
      <Button onClick={onReset}>Send Another Message</Button>
    </div>
  );
};
