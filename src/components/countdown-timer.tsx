import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  className?: string;
  compact?: boolean;
}

export function CountdownTimer({ 
  initialMinutes = 14, 
  initialSeconds = 59, 
  className = '',
  compact = false 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes === 0 && prev.seconds === 0) {
          return { minutes: initialMinutes, seconds: initialSeconds };
        }
        if (prev.seconds === 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialMinutes, initialSeconds]);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="w-4 h-4 text-primary animate-pulse" />
        <span className="font-mono font-bold text-primary">
          {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
        <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
          Limited Time Offer
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-b from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <span className="font-mono text-2xl font-bold">{formatTime(timeLeft.minutes)}</span>
        </div>
        <span className="text-2xl font-bold text-amber-500">:</span>
        <div className="bg-gradient-to-b from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <span className="font-mono text-2xl font-bold">{formatTime(timeLeft.seconds)}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Expires soon - Act now!</p>
    </div>
  );
}
