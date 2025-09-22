
import React from "react";
import bndBoxLogo from "@/assets/bndbox-logo.png";

interface BndBoxLogoProps {
  className?: string;
}

const BndBoxLogo: React.FC<BndBoxLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={bndBoxLogo} 
        alt="BndBox Logo" 
        className="h-10 w-auto mr-3"
      />
      <div className="flex flex-col">
        <div className="text-xl font-bold text-primary tracking-tight">BndBox</div>
        <div className="text-xs text-muted-foreground font-medium">Connect. Protect. Grow.</div>
      </div>
    </div>
  );
};

export default BndBoxLogo;
