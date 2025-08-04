// Preload critical resources for better performance
export const preloadCriticalResources = () => {
  // Preload key routes that users are likely to visit
  const criticalRoutes = [
    '/about',
    '/blog', 
    '/reseller-hub'
  ];

  // Preload route components
  criticalRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });

  // Preload critical fonts if any
  const fontPreloads = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];

  fontPreloads.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'style';
    link.onload = function() {
      (this as any).rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
};

// Preload images that are likely to be needed
export const preloadImages = (images: string[]) => {
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};