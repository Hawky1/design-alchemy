import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, CheckCircle, Shield, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLead, parseUTMParams } from '@/lib/lead-context';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import carcLogo from '@/assets/carc-logo.webp';

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
    "Understanding your credit report",
    "How to spot errors and inaccuracies",
    "Your rights under the FCRA",
    "Steps to dispute incorrect information",
    "How to build better credit"
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Book className="w-4 h-4" />
                <span className="text-sm font-medium">Free Resource</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Complete Guide to
                <span className="gradient-text-primary block mt-2">Credit Repair</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Learn how to read your credit report, identify errors, and understand your rights 
                under the Fair Credit Reporting Act. Plus, discover how our free AI-powered 
                scanner can help you find potential violations.
              </p>

              <div className="space-y-4">
                <p className="font-semibold text-foreground">What you'll learn:</p>
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
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>5,000+ Downloads</span>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:pl-8">
              <div className="glass-panel-strong rounded-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Get Your Free eBook</h2>
                  <p className="text-muted-foreground">
                    Enter your details below for instant access
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
                        Get Free Access
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
