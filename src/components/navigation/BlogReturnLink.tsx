import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogReturnLinkProps {
  variant?: "default" | "subtle" | "icon";
  className?: string;
}

const BlogReturnLink = ({ variant = "default", className = "" }: BlogReturnLinkProps) => {
  if (variant === "icon") {
    return (
      <Link to="/blog" className={`inline-flex items-center text-muted-foreground hover:text-primary transition-colors ${className}`}>
        <ArrowLeft className="h-5 w-5" />
      </Link>
    );
  }
  
  if (variant === "subtle") {
    return (
      <Link to="/blog" className={`inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ${className}`}>
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Blog</span>
      </Link>
    );
  }
  
  // Default
  return (
    <Link to="/blog">
      <Button variant="outline" size="sm" className={`inline-flex items-center gap-2 ${className}`}>
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Button>
    </Link>
  );
};

export default BlogReturnLink;