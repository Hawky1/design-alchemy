import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, BookOpen, Scan, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLead, parseUTMParams } from '@/lib/lead-context';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ebookCover from '@/assets/ebook-cover.png';

export default function FreeEbook() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setLead, lead } = useLead();
  const { toast } = useToast();

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
      {/* Ambient background effects */}
      <div className="ambient-orb ambient-orb-primary w-[600px] h-[600px] -top-40 -left-40" />
      <div className="ambient-orb ambient-orb-secondary w-[500px] h-[500px] -bottom-32 -right-32" />
      
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-reveal">
          
          {/* eBook Cover */}
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={ebookCover} 
                alt="How to Turn Credit Report Errors Into Compensation" 
                className="w-56 md:w-64 rounded-lg shadow-2xl shadow-primary/30"
              />
              <div className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
                Free
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Get Paid Up to <span className="text-primary">$1,000</span> for Each Credit Report Error
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto">
              Discover how the Fair Credit Reporting Act entitles you to real compensation—and use our free AI scanner to find violations in minutes.
            </p>
          </div>

          {/* Bullet Points */}
          <ul className="space-y-3 text-left max-w-sm mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span className="text-muted-foreground">Learn which FCRA violations qualify for <span className="text-foreground font-medium">$1,000+</span> in statutory damages</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span className="text-muted-foreground">Understand why Equifax, TransUnion, and Experian make so many mistakes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span className="text-muted-foreground">Follow a step-by-step process to dispute errors and file claims</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span className="text-muted-foreground">Get instant results from our <span className="text-foreground font-medium">free AI-powered</span> credit report scanner</span>
            </li>
          </ul>

          {/* Form Card */}
          <div className="glass-panel-strong rounded-2xl p-6 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-background/50"
                disabled={isSubmitting}
              />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-background/50"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold btn-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Get My Free Guide
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              No credit card required. Unsubscribe anytime.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Free eBook</span>
            </div>
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-primary" />
              <span>AI Scan</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>No Card</span>
            </div>
          </div>

          {/* Author credit */}
          <p className="text-center text-sm text-muted-foreground">
            By <span className="text-foreground font-medium">Ken Lamothe</span>, FCRA Expert
          </p>
        </div>
      </main>
    </div>
  );
}
