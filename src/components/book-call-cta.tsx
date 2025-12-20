import { Phone, ExternalLink, Shield, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookCallCTAProps {
  violationsCount: number;
  potentialDamages?: number;
  calendlyUrl?: string;
}

export function BookCallCTA({ 
  violationsCount, 
  potentialDamages = 0,
  calendlyUrl = "https://calendly.com" 
}: BookCallCTAProps) {
  const handleBookCall = () => {
    window.open(calendlyUrl, '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/30">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 text-destructive border border-destructive/30 animate-pulse">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {violationsCount} Potential Violation{violationsCount !== 1 ? 's' : ''} Found
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold">
            You May Be Entitled to Compensation
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our analysis found potential FCRA violations in your credit reports. 
            Schedule a free consultation with our legal team to review your case.
          </p>
        </div>

        {/* Stats */}
        {potentialDamages > 0 && (
          <div className="flex justify-center">
            <div className="glass-panel rounded-xl px-6 py-4 text-center">
              <div className="flex items-center gap-2 text-primary mb-1">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Potential Damages</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                ${potentialDamages.toLocaleString()}+
              </p>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium">Free Consultation</p>
            <p className="text-xs text-muted-foreground">No cost, no obligation</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium">Expert Review</p>
            <p className="text-xs text-muted-foreground">FCRA attorneys on staff</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium">Quick Process</p>
            <p className="text-xs text-muted-foreground">Usually 15-30 minutes</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-4">
          <Button 
            size="lg" 
            onClick={handleBookCall}
            className="text-lg px-8 py-6 btn-glow gap-3"
          >
            <Phone className="w-5 h-5" />
            Book Your Free Review Call
            <ExternalLink className="w-4 h-4" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Available Monday-Friday, 9am-5pm EST
          </p>
        </div>
      </div>
    </div>
  );
}
