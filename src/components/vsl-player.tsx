import { useState, useRef } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface VSLPlayerProps {
  videoUrl: string;
  caption?: string;
  className?: string;
}

export function VSLPlayer({ videoUrl, caption, className = '' }: VSLPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/30 bg-black">
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video object-cover"
          controls={isPlaying}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />

        {/* Play Button Overlay - shown when not playing */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 transition-all hover:bg-black/30"
            onClick={handlePlay}
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
              {/* Play button */}
              <button className="relative w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform btn-glow">
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </button>
            </div>
          </div>
        )}

        {/* Mute toggle when playing */}
        {isPlaying && (
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p className="text-center text-sm text-muted-foreground mt-3 font-medium">
          {caption}
        </p>
      )}
    </div>
  );
}
