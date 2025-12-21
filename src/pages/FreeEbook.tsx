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

  // If already signed up, redirect to portal
  useEffect(() => {
    if (lead?.email && lead?.ebookDownloaded) {
      navigate('/portal');
    }
  }, [lead, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Please enter a valid email address",
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
      
      {/* Header */}
      <header className="sticky top-0 z-40 py-4 px-6 border-b border-white/30 bg-white/80 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src={consumerLogo} alt="Consumer Advocate Resolution Center" className="h-14 w-auto" />
          </Link>
        </div>
      </header>
      
      <main className="relative z-10 min-h-screen flex flex-col justify-center px-4 py-12">
        <div className="w-full max-w-5xl mx-auto animate-reveal">
          
          {/* Full-width Header */}
          <div className="text-center mb-10">
            <img 
              src={breakingNewsBanner} 
              alt="Consumer Alert Breaking News" 
              className="mx-auto mb-6 max-w-md w-full"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Get Paid Up to <span className="text-primary">$1,000</span> for Each Credit Report Error
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover how the Fair Credit Reporting Act entitles you to real compensation—and use our free AI scanner to find violations in minutes.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column - Book Cover */}
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Urgency Timer */}
              <div className="w-full max-w-sm bg-gradient-to-r from-destructive/90 to-primary/90 rounded-xl p-4 border border-primary/50 shadow-xl shadow-primary/30">
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5 text-white animate-pulse" />
                  <span className="text-white font-medium">Offer expires in:</span>
                  <div className="flex gap-1 font-mono font-bold text-white text-xl">
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
                  className="relative w-80 md:w-96 lg:w-[420px] rounded-lg shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute -top-4 -right-4 bg-destructive text-destructive-foreground text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-bounce">
                  Free
                </div>
              </div>
            </div>

            {/* Right Column - Content & Form */}
            <div className="flex flex-col justify-center">
              {/* Compelling Signup Card */}
              <div className="bg-gradient-to-br from-destructive/90 to-primary/90 rounded-2xl p-8 space-y-6 border border-primary/50 shadow-2xl shadow-primary/30">

                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Claim Your FREE Guide
                  </h2>
                  <p className="text-white/90">
                    Join 10,000+ consumers who discovered hidden violations
                  </p>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span className="text-white/90">Learn which FCRA violations qualify for <span className="text-white font-semibold">$1,000+</span> in damages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span className="text-white/90">Step-by-step process to dispute errors and file claims</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white font-bold mt-0.5">✓</span>
                    <span className="text-white/90">Get instant results from our <span className="text-white font-semibold">free AI scanner</span></span>
                  </li>
                </ul>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 bg-white text-background placeholder:text-background/60 border-0 text-lg font-medium"
                    disabled={isSubmitting}
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-white text-background placeholder:text-background/60 border-0 text-lg font-medium"
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-xl font-bold bg-background hover:bg-background/90 text-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Instant Access
                        <ArrowRight className="w-6 h-6 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Trust badges */}
                <div className="flex justify-center gap-6 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Free eBook</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scan className="w-4 h-4" />
                    <span>AI Scan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>No Card</span>
                  </div>
                </div>

                {/* Author credit */}
                <p className="text-center text-sm text-white/70">
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
