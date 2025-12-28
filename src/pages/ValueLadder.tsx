import { ArrowRight, BookOpen, FileText, Brain, Phone, Scale, CheckCircle2, Shield, Lock, Award, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ebookCover from "@/assets/ebook-cover.png";

const ValueLadder = () => {
  const navigate = useNavigate();

  const ladderSteps = [
    {
      step: 1,
      title: "Free Expert Guide",
      description: "Instant eBook download - \"Get Paid Up to $1,000 for Each Credit Report Error\" by FCRA Expert Ken Lamothe",
      value: "FREE",
      icon: BookOpen,
      color: "from-emerald-500/20 to-emerald-600/10",
      borderColor: "border-emerald-500/30",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      step: 2,
      title: "Credit Reports Guide",
      description: "Step-by-step instructions to obtain your official credit reports from all 3 bureaus (Equifax, Experian, TransUnion)",
      value: "FREE",
      icon: FileText,
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/30",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      step: 3,
      title: "AI-Powered Analysis",
      description: "Advanced AI scans your reports for FCRA violations, inconsistencies, and errors across all bureaus",
      value: "FREE",
      icon: Brain,
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "border-purple-500/30",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      step: 4,
      title: "Expert Consultation",
      description: "15-30 minute call with FCRA legal team to review violations and discuss your case",
      value: "FREE",
      icon: Phone,
      color: "from-amber-500/20 to-amber-600/10",
      borderColor: "border-amber-500/30",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      step: 5,
      title: "Legal Representation",
      description: "If you qualify, our attorneys pursue compensation on your behalf — up to $1,000+ per violation",
      value: "No Upfront Cost",
      icon: Scale,
      color: "from-red-500/20 to-red-600/10",
      borderColor: "border-red-500/30",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
    },
  ];

  const optInBenefits = [
    "Immediate access to the comprehensive eBook guide",
    "Entry to your personal member portal",
    "Track your progress through each step",
    "Access to our AI-powered violation scanner",
    "Priority booking for expert consultations",
    "Updates on FCRA news and settlements",
  ];

  const journeySteps = [
    { icon: BookOpen, title: "Download the Guide", subtitle: "Learn your rights under the FCRA" },
    { icon: FileText, title: "Get Your Reports", subtitle: "Gather evidence from all 3 bureaus" },
    { icon: Brain, title: "Run AI Analysis", subtitle: "Find violations automatically" },
    { icon: Phone, title: "Book a Call", subtitle: "Get expert legal review" },
    { icon: DollarSign, title: "Get Compensated", subtitle: "Receive up to $1,000+ per violation" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Scale className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your Path to Credit Justice</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Journey to 
            <span className="text-primary"> Credit Compensation</span>
            <br />Starts Here
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Follow our proven 5-step process to discover credit report errors and pursue the compensation you deserve under federal law. Everything starts with a free guide.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/")}
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
          >
            Get Your Free Guide Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Value Ladder Visualization */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Value Ladder</h2>
            <p className="text-muted-foreground text-lg">Each step builds on the last, increasing your value at no cost</p>
          </div>

          <div className="space-y-4">
            {ladderSteps.map((item, index) => (
              <div
                key={item.step}
                className={`relative p-6 rounded-2xl border ${item.borderColor} bg-gradient-to-r ${item.color} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                style={{ marginLeft: `${index * 2}%`, marginRight: `${(4 - index) * 2}%` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step {item.step}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.step === 5 ? 'bg-primary/20 text-primary' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {item.value}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                
                {index < ladderSteps.length - 1 && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get When You Opt-In */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-3xl" />
              <img 
                src={ebookCover} 
                alt="Free FCRA Guide eBook" 
                className="relative z-10 w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What You Get When You <span className="text-primary">Opt-In</span>
              </h2>
              
              <div className="space-y-4">
                {optInBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                onClick={() => navigate("/")}
                className="mt-8 text-lg px-8 py-6"
              >
                Claim Your Free Guide
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey Explained */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Journey Explained</h2>
            <p className="text-muted-foreground text-lg">A simple, guided path from discovery to compensation</p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-purple-500 to-red-500 transform -translate-y-1/2 rounded-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4 relative z-10 shadow-lg">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Trust This Process?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-background border border-border text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">FCRA Expert Author</h3>
              <p className="text-muted-foreground text-sm">
                Guide written by Ken Lamothe, a recognized FCRA expert with years of experience
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-border text-center">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Proven Results</h3>
              <p className="text-muted-foreground text-sm">
                Thousands of dollars in settlements recovered for clients with credit report errors
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-border text-center">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Confidential</h3>
              <p className="text-muted-foreground text-sm">
                Your information is secure and never shared with third parties
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Start in Under 2 Minutes</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start Your <span className="text-primary">Free Journey?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            What do you have to lose? Everything is free until you qualify for legal representation — and even then, there's no upfront cost to you.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/")}
            className="text-xl px-10 py-7 bg-primary hover:bg-primary/90"
          >
            Get Your Free Guide Now
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Join thousands who have already discovered their credit report rights
          </p>
        </div>
      </section>
    </div>
  );
};

export default ValueLadder;
