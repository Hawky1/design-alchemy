import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { CountdownTimer } from './countdown-timer';

interface StickyCTAProps {
  scrollThreshold?: number;
}

export function StickyCTA({ scrollThreshold = 600 }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold, isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-2xl transform transition-transform duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left - Message */}
          <div className="hidden md:flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-white font-medium">
              Get your <span className="text-primary">FREE</span> credit analysis now
            </p>
          </div>

          {/* Center - Timer */}
          <div className="flex-shrink-0">
            <CountdownTimer compact />
          </div>

          {/* Right - CTA */}
          <div className="flex items-center gap-3">
            <Link to="/free-ebook">
              <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg btn-glow">
                Get Free Guide & Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
