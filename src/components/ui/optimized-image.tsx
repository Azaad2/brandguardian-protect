import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  lazy?: boolean;
  priority?: boolean;
  sizes?: string;
  webpSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className,
  lazy = true,
  priority = false,
  sizes,
  webpSrc,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [imageSrc, setImageSrc] = useState<string | null>(priority ? src : null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView, src]);

  // Handle image load error
  const handleError = () => {
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Placeholder for lazy loading */}
      {!isLoaded && imageSrc && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {/* Main image */}
      {imageSrc && (
        <picture>
          {webpSrc && (
            <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
          )}
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            sizes={sizes}
            loading={lazy && !priority ? 'lazy' : 'eager'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              className
            )}
            {...props}
          />
        </picture>
      )}
      
      {/* Fallback div for intersection observer when no src yet */}
      {!imageSrc && <div ref={imgRef} className="w-full h-full" />}
    </div>
  );
};

export default OptimizedImage;