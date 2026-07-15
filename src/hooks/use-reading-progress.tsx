import { useState, useEffect } from 'react';
import { trackEngagement } from '@/lib/analytics';

interface ReadingProgress {
  scrollProgress: number;
  readingTime: number;
  wordsRead: number;
  engagementScore: number;
}

export const useReadingProgress = (contentSelector: string = 'article') => {
  const [progress, setProgress] = useState<ReadingProgress>({
    scrollProgress: 0,
    readingTime: 0,
    wordsRead: 0,
    engagementScore: 0
  });

  const [startTime] = useState(Date.now());
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;
    let engagementTimer: ReturnType<typeof setTimeout>;

    const calculateProgress = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min((scrolled / maxHeight) * 100, 100);
      
      setMaxScroll(Math.max(maxScroll, scrollProgress));

      // Estimate reading progress based on scroll position
      const contentElement = document.querySelector(contentSelector);
      let wordsRead = 0;
      
      if (contentElement) {
        const totalWords = contentElement.textContent?.split(' ').length || 0;
        wordsRead = Math.floor((scrollProgress / 100) * totalWords);
      }

      const currentTime = Date.now();
      const readingTime = Math.floor((currentTime - startTime) / 1000);

      // Calculate engagement score (0-100)
      const timeWeight = Math.min(readingTime / 60, 1) * 40; // Max 40 points for time spent (up to 1 minute)
      const scrollWeight = Math.min(scrollProgress / 80, 1) * 40; // Max 40 points for scroll depth (80% = full score)
      const completionWeight = scrollProgress > 80 ? 20 : 0; // 20 points for near-completion
      
      const engagementScore = Math.round(timeWeight + scrollWeight + completionWeight);

      setProgress({
        scrollProgress,
        readingTime,
        wordsRead,
        engagementScore
      });
    };

    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(calculateProgress, 100);
    };

    const trackEngagementPeriodically = () => {
      trackEngagement(progress.readingTime, progress.scrollProgress, window.location.pathname);
      engagementTimer = setTimeout(trackEngagementPeriodically, 30000); // Track every 30 seconds
    };

    window.addEventListener('scroll', handleScroll);
    calculateProgress(); // Initial calculation
    
    // Start periodic engagement tracking
    engagementTimer = setTimeout(trackEngagementPeriodically, 30000);

    // Track final engagement on page unload
    const handleBeforeUnload = () => {
      trackEngagement(progress.readingTime, maxScroll, window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(scrollTimer);
      clearTimeout(engagementTimer);
    };
  }, [contentSelector, startTime, maxScroll, progress.readingTime, progress.scrollProgress]);

  return progress;
};

export default useReadingProgress;