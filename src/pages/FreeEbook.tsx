import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, BookOpen, Scan, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLead, parseUTMParams } from '@/lib/lead-context';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ebookCover from '@/assets/ebook-cover.png';
import breakingNewsBanner from '@/assets/breaking-news-banner.png';
import consumerLogo from '@/assets/consumer-logo.png';
import { SettlementsBanner } from '@/components/settlements-banner';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { VSLPlayer } from '@/components/vsl-player';

// Validation schema for lead capture
const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
});

export default function FreeEbook() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });
  const navigate = useNavigate();
  const { setLead, lead } = useLead();
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input using zod schema
    const result = leadSchema.safeParse({ name, email });
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || 'Invalid input';
      toast({
        title: errorMessage,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const utmParams = parseUTMParams();
      
      const { data, error } = await supabase.functions.invoke('create-lead', {
        body: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          ebook_downloaded: true,
          source: utmParams.source || 'free-ebook',
          utm_campaign: utmParams.utmCampaign,
          utm_source: utmParams.utmSource,
          utm_medium: utmParams.utmMedium,
        }
      });

      if (error) throw error;

      setLead({
        id: data?.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        ebookDownloaded: true,
        portalAccessed: false,
        reportsDownloaded: false,
        analysisCompleted: false,
        violationsFound: 0,
        callBooked: false,
        ...utmParams
      });

      toast({
        title: "Welcome!",
        description: "Check your email for the eBook download link."
      });

      navigate('/portal');
    } catch (error) {
      console.error('Error creating lead:', error);
      
      const utmParams = parseUTMParams();
      setLead({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        ebookDownloaded: true,
        portalAccessed: false,
        reportsDownloaded: false,
        analysisCompleted: false,
        violationsFound: 0,
        callBooked: false,
        ...utmParams
      });

      navigate('/portal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Settlements Banner */}
      <SettlementsBanner />
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/red5-background.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/40 z-[1]" />
      
      <main className="relative z-10 min-h-screen flex flex-col justify-center px-3 sm:px-4 py-3 sm:py-4 md:py-6">
        <div className="w-full max-w-5xl mx-auto animate-reveal">
          
          {/* Full-width Header */}
          <div className="text-center mb-3 sm:mb-4">
            <img 
              src={breakingNewsBanner} 
              alt="Consumer Alert Breaking News" 
              className="mx-auto mb-2 sm:mb-3 max-w-[200px] sm:max-w-xs md:max-w-sm w-full"
            />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-1 sm:mb-2 px-2">
              Get Paid Up to <span className="text-primary">$1,000</span> for Each Credit Report Error
            </h1>
          </div>

          {/* VSL Section with CTA */}
          <div className="mb-4 sm:mb-6 text-center">
            <VSLPlayer 
              videoUrl="https://storage.googleapis.com/msgsndr/HAUHIKH4QhgbgKCPEnEu/media/6951d6de73a5e0dda7815d67.mp4"
              caption="Watch: FCRA Expert Ken LaMothe Reveals How to Get Compensation"
              className="max-w-full sm:max-w-2xl mx-auto"
            />
            <Button 
              onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-3 sm:mt-4 h-11 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/50 btn-glow"
            >
              <span className="hidden sm:inline">Get Your Free Guide & Analysis Now</span>
              <span className="sm:hidden">Get Your Free Guide Now</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>

          {/* Two-column layout - stacks on mobile */}
          <div id="signup-form" className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
            
            {/* Left Column - Book Cover (hidden on mobile, shown after form on small screens) */}
            <div className="hidden md:flex flex-col items-center justify-center gap-4 sm:gap-6 order-2 md:order-1">
              {/* Urgency Timer */}
              <div className="w-full max-w-sm bg-gradient-to-r from-destructive/90 to-primary/90 rounded-xl p-3 sm:p-4 border border-primary/50 shadow-xl shadow-primary/30">
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
                  <span className="text-white font-medium text-sm sm:text-base">Offer expires in:</span>
                  <div className="flex gap-1 font-mono font-bold text-white text-lg sm:text-xl">
                    <span className="bg-background/30 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span>:</span>
                    <span className="bg-background/30 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-destructive to-primary rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
                <img 
                  src={ebookCover} 
                  alt="Free Credit Repair eBook" 
                  className="relative w-64 sm:w-80 md:w-96 lg:w-[420px] rounded-lg shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-destructive text-destructive-foreground text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg animate-bounce">
                  Free
                </div>
              </div>
            </div>

            {/* Right Column - Content & Form (shows first on mobile) */}
            <div className="flex flex-col justify-center order-1 md:order-2">
              {/* Mobile-only urgency timer */}
              <div className="md:hidden w-full max-w-sm mx-auto mb-4 bg-gradient-to-r from-destructive/90 to-primary/90 rounded-xl p-3 border border-primary/50 shadow-xl shadow-primary/30">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Clock className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-white font-medium text-sm">Offer expires in:</span>
                  <div className="flex gap-1 font-mono font-bold text-white text-lg">
                    <span className="bg-background/30 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span>:</span>
                    <span className="bg-background/30 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>

              {/* Compelling Signup Card */}
              <div className="bg-gradient-to-br from-destructive/90 to-primary/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 border border-primary/50 shadow-2xl shadow-primary/30">

                <div className="text-center space-y-1 sm:space-y-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    Claim Your FREE Guide
                  </h2>
                  <p className="text-white/90 text-sm sm:text-base">
                    Join 10,000+ consumers who discovered hidden violations
                  </p>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-white font-bold mt-0.5 text-sm sm:text-base">✓</span>
                    <span className="text-white/90 text-sm sm:text-base">Learn which FCRA violations qualify for <span className="text-white font-semibold">$1,000+</span> in damages</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-white font-bold mt-0.5 text-sm sm:text-base">✓</span>
                    <span className="text-white/90 text-sm sm:text-base">Step-by-step process to dispute errors and file claims</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-white font-bold mt-0.5 text-sm sm:text-base">✓</span>
                    <span className="text-white/90 text-sm sm:text-base">Get instant results from our <span className="text-white font-semibold">free AI scanner</span></span>
                  </li>
                </ul>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 sm:h-14 bg-white text-background placeholder:text-background/60 border-0 text-base sm:text-lg font-medium"
                    disabled={isSubmitting}
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 sm:h-14 bg-white text-background placeholder:text-background/60 border-0 text-base sm:text-lg font-medium"
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-12 sm:h-14 text-lg sm:text-xl font-bold bg-background hover:bg-background/90 text-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Instant Access
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Trust badges */}
                <div className="flex justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/80">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Free eBook</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Scan className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>AI Scan</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>No Card</span>
                  </div>
                </div>

                {/* Author credit */}
                <p className="text-center text-xs sm:text-sm text-white/70">
                  By <span className="text-white font-medium">Ken Lamothe</span>, FCRA Expert
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
