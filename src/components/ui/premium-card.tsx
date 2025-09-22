import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "default" | "glass" | "gradient" | "floating" | "magnetic";
  interactive?: boolean;
  children: React.ReactNode;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant = "default", interactive = true, children, ...props }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!interactive || !cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setMousePosition({
        x: (e.clientX - centerX) / 10,
        y: (e.clientY - centerY) / 10,
      });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    const variants = {
      default: "rounded-xl bg-card border border-border shadow-lg",
      glass: "glass-card rounded-xl",
      gradient: "rounded-xl bg-gradient-to-br from-card/90 to-muted/50 border border-border/50 shadow-xl",
      floating: "rounded-xl bg-card border border-border shadow-lg floating-animation",
      magnetic: "rounded-xl bg-card border border-border shadow-lg magnetic-hover"
    };

    return (
      <motion.div
        ref={cardRef}
        className={cn(
          variants[variant],
          interactive && "premium-hover cursor-pointer",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={interactive ? {
          rotateX: mousePosition.y * 0.5,
          rotateY: mousePosition.x * 0.5,
        } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        whileHover={interactive ? { scale: 1.02, y: -4 } : {}}
        {...props}
      >
        <div className="relative z-10 p-6">
          {children}
        </div>
        
        {/* Gradient overlay for enhanced depth */}
        {variant === "gradient" && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        )}
        
        {/* Glow effect */}
        {interactive && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 blur-xl"
            animate={{ opacity: mousePosition.x !== 0 || mousePosition.y !== 0 ? 0.3 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    );
  }
);

PremiumCard.displayName = "PremiumCard";

export { PremiumCard };