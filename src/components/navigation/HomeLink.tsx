
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeLinkProps {
  variant?: "default" | "subtle" | "icon";
  className?: string;
}

const HomeLink = ({ variant = "default", className = "" }: HomeLinkProps) => {
  if (variant === "icon") {
    return (
      <Link to="/" className={`inline-flex items-center text-gray-600 hover:text-primary transition-colors ${className}`}>
        <Home className="h-5 w-5" />
      </Link>
    );
  }
  
  if (variant === "subtle") {
    return (
      <Link to="/" className={`inline-flex items-center gap-1 text-gray-600 hover:text-primary transition-colors ${className}`}>
        <Home className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>
    );
  }
  
  // Default
  return (
    <Link to="/">
      <Button variant="outline" size="sm" className={`inline-flex items-center gap-1 ${className}`}>
        <Home className="h-4 w-4 mr-1" />
        Back to Home
      </Button>
    </Link>
  );
};

export default HomeLink;
