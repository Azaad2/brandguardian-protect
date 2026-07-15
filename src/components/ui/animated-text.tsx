import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  children: string;
  className?: string;
  variant?: "fade" | "slide" | "typewriter" | "gradient";
  delay?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  className,
  variant = "fade",
  delay = 0,
  duration = 0.8,
  as = "p"
}) => {
  const Component = motion[as];
  
  const variants = {
    fade: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay, ease: "easeOut" as const }
    },
    slide: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay, ease: "easeOut" as const }
    },
    typewriter: {
      initial: { width: 0 },
      animate: { width: "auto" },
      transition: { duration: duration * 2, delay, ease: "linear" as const }
    },
    gradient: {
      initial: { 
        opacity: 0, 
        y: 20,
        backgroundPosition: "200% center"
      },
      animate: { 
        opacity: 1, 
        y: 0,
        backgroundPosition: "0% center"
      },
      transition: { duration, delay, ease: "easeOut" as const }
    }
  };

  const currentVariant = variants[variant];

  const gradientClass = variant === "gradient" 
    ? "bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_100%]"
    : "";

  if (variant === "typewriter") {
    return (
      <Component
        className={cn("overflow-hidden whitespace-nowrap border-r-2 border-current", className)}
        initial={currentVariant.initial}
        animate={currentVariant.animate}
        transition={currentVariant.transition}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={cn(gradientClass, className)}
      initial={currentVariant.initial}
      animate={currentVariant.animate}
      transition={currentVariant.transition}
    >
      {children}
    </Component>
  );
};

interface AnimatedWordsProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export const AnimatedWords: React.FC<AnimatedWordsProps> = ({
  children,
  className,
  delay = 0,
  stagger = 0.1,
  as = "p"
}) => {
  const Component = motion[as];
  const words = children.split(" ");

  return (
    <Component className={cn("flex flex-wrap gap-x-2", className)}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + index * stagger,
            ease: "easeOut"
          }}
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
};