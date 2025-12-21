import { Phone, ExternalLink, Shield, DollarSign, Clock, AlertTriangle } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-destructive border-2 border-primary/50 shadow-2xl">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
      
      <div className="relative p-8 md:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-bold tracking-wide uppercase">
              {violationsCount} Potential Violation{violationsCount !== 1 ? 's' : ''} Detected
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            You May Be Entitled to Compensation
          </h2>
          
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Our analysis found potential FCRA violations in your credit reports. 
            Schedule a <span className="font-bold underline decoration-2">free consultation</span> with our legal team to review your case.
          </p>
        </div>

        {/* Stats */}
        {potentialDamages > 0 && (
          <div className="flex justify-center">
            <div className="bg-white/15 backdrop-blur-md rounded-xl px-8 py-5 text-center border border-white/20 shadow-lg">
              <div className="flex items-center justify-center gap-2 text-white/80 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Potential Damages</span>
              </div>
              <p className="text-4xl font-black text-white">
                ${potentialDamages.toLocaleString()}+
              </p>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border border-white/30">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <p className="text-base font-bold text-white">Free Consultation</p>
            <p className="text-sm text-white/70">No cost, no obligation</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border border-white/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <p className="text-base font-bold text-white">Expert Review</p>
            <p className="text-sm text-white/70">FCRA attorneys on staff</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border border-white/30">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <p className="text-base font-bold text-white">Quick Process</p>
            <p className="text-sm text-white/70">Usually 15-30 minutes</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-4">
          <Button 
            size="lg" 
            onClick={handleBookCall}
            className="text-lg px-10 py-7 gap-3 bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl font-bold"
          >
            <Phone className="w-6 h-6" />
            Book Your Free Review Call
            <ExternalLink className="w-5 h-5" />
          </Button>
          <p className="text-sm text-white/60 mt-4">
            Available Monday-Friday, 9am-5pm EST
          </p>
        </div>
      </div>
    </div>
  );
}
