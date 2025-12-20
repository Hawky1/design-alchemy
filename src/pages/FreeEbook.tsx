import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, CheckCircle, Shield, Zap, ArrowRight, Loader2, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLead, parseUTMParams } from '@/lib/lead-context';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import carcLogo from '@/assets/carc-logo.webp';
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

    // Basic email validation
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
      
      // Create lead in database via edge function or direct insert
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

      // Set lead in context
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
      
      // Still allow access even if backend fails
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

  const benefits = [
    "Why credit bureaus may owe YOU money",
    "The FCRA laws that entitle you to compensation",
    "How to identify violations on your report",
    "Step-by-step process to claim what you're owed",
    "Real examples of $1,000+ settlements"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-4 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={carcLogo} alt="CARC Logo" className="h-10 w-auto" />
        </div>
      </header>

      <main className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - eBook Info */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Up to $1,000 Per Violation</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                How to Turn Credit Report Errors Into
                <span className="text-destructive block mt-2">Cash Compensation</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover how everyday Americans are using the <strong className="text-foreground">Fair Credit Reporting Act (FCRA)</strong> to 
                claim <strong className="text-foreground">up to $1,000 for each violation</strong> on their credit reports. 
                This free guide shows you exactly how.
              </p>

              {/* Free Scan Callout */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Scan className="w-5 h-5" />
                  <span>PLUS: Free AI-Powered Violation Scan</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  After downloading, you'll get access to our free scanner that analyzes your credit report 
                  for potential FCRA violations. <strong className="text-foreground">See if you qualify for compensation in minutes.</strong>
                </p>
              </div>

              <div className="space-y-4">
                <p className="font-semibold text-foreground">Inside this free guide:</p>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>100% Free Guide</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Instant Access</span>
                </div>
              </div>
            </div>

            {/* Right Column - Form + Book Cover */}
            <div className="lg:pl-8 space-y-6">
              {/* eBook Cover Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <img 
                    src={ebookCover} 
                    alt="How to Turn Credit Report Errors Into Compensation eBook" 
                    className="w-64 md:w-72 rounded-lg shadow-2xl shadow-primary/20"
                  />
                  <div className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                    FREE
                  </div>
                </div>
              </div>

              <div className="glass-panel-strong rounded-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Get Instant Access</h2>
                  <p className="text-muted-foreground">
                    Download your free guide + unlock the violation scanner
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg btn-glow"
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
                  By signing up, you agree to receive emails from CARC. 
                  We respect your privacy and will never share your information.
                </p>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Written by <strong className="text-foreground">Ken Lamothe</strong>, FCRA Expert
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
