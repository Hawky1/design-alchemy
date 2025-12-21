import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book, FileText, ScanSearch, Phone, CheckCircle, Circle, ArrowRight, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLead } from '@/lib/lead-context';
import carcLogo from '@/assets/carc-logo.webp';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  href: string;
  isComplete: boolean;
  isUnlocked: boolean;
}

export default function Portal() {
  const navigate = useNavigate();
  const { lead, updateLead, isLoading } = useLead();

  // Redirect to signup if no lead
  useEffect(() => {
    if (!isLoading && !lead?.email) {
      navigate('/free-ebook');
    } else if (lead && !lead.portalAccessed) {
      updateLead({ portalAccessed: true });
    }
  }, [lead, isLoading, navigate, updateLead]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!lead) return null;

  const steps: Step[] = [
    {
      id: 1,
      title: "Download Your eBook",
      description: "Read our comprehensive guide to understanding credit reports and your rights.",
      icon: <Book className="w-6 h-6" />,
      action: "Download eBook",
      href: "#download-ebook",
      isComplete: lead.ebookDownloaded,
      isUnlocked: true,
    },
    {
      id: 2,
      title: "Get Your Credit Reports",
      description: "Learn how to get free copies of your credit reports from all three bureaus.",
      icon: <FileText className="w-6 h-6" />,
      action: "View Guide",
      href: "/portal/get-reports",
      isComplete: lead.reportsDownloaded,
      isUnlocked: true,
    },
    {
      id: 3,
      title: "Analyze Your Reports",
      description: "Upload your reports for our AI-powered FCRA violation scan.",
      icon: <ScanSearch className="w-6 h-6" />,
      action: "Start Analysis",
      href: "/analyze",
      isComplete: lead.analysisCompleted,
      isUnlocked: lead.reportsDownloaded || true, // Always unlocked for now
    },
    {
      id: 4,
      title: "Book Your Review Call",
      description: "Schedule a free call with our team to review your results and discuss next steps.",
      icon: <Phone className="w-6 h-6" />,
      action: "Book Call",
      href: "#book-call",
      isComplete: lead.callBooked,
      isUnlocked: lead.analysisCompleted && lead.violationsFound > 0,
    },
  ];

  const handleDownloadEbook = () => {
    // In production, this would trigger an actual download
    updateLead({ ebookDownloaded: true });
    // Open eBook PDF in new tab (placeholder URL)
    window.open('https://example.com/ebook.pdf', '_blank');
  };

  const completedSteps = steps.filter(s => s.isComplete).length;
  const progressPercent = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen relative">
      {/* Video Background */}
      <video
        src="https://files.revneo.com/red2.mp4"
        className="fixed inset-0 w-full h-full object-cover -z-10"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Header */}
      <header className="py-4 px-6 border-b border-border bg-background shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src={carcLogo} alt="CARC Logo" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground hidden sm:block">
              Welcome, {lead.name?.split(' ')[0] || 'there'}!
            </span>
          </div>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Your Credit Repair Journey
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to analyze your credit reports and discover potential 
              FCRA violations that could entitle you to damages.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps} of {steps.length} steps completed
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`glass-panel rounded-xl p-6 transition-all ${
                  !step.isUnlocked ? 'opacity-50' : 'card-hover'
                }`}
              >
                <div className="flex items-start gap-6">
                  {/* Step Number / Status */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.isComplete 
                      ? 'bg-primary text-primary-foreground' 
                      : step.isUnlocked 
                        ? 'bg-muted border-2 border-primary text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.isComplete ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-bold">{step.id}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {step.icon}
                          {step.title}
                          {step.isComplete && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                              Complete
                            </span>
                          )}
                        </h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>

                      {/* Action Button */}
                      {step.isUnlocked && (
                        <div className="flex-shrink-0">
                          {step.id === 1 ? (
                            <Button 
                              variant={step.isComplete ? "outline" : "default"}
                              onClick={handleDownloadEbook}
                              className="gap-2"
                            >
                              <Download className="w-4 h-4" />
                              {step.action}
                            </Button>
                          ) : step.id === 4 && !step.isUnlocked ? (
                            <Button variant="outline" disabled>
                              Complete Analysis First
                            </Button>
                          ) : step.id === 4 ? (
                            <Button 
                              className="gap-2 btn-glow"
                              onClick={() => window.open('https://calendly.com', '_blank')}
                            >
                              {step.action}
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant={step.isComplete ? "outline" : "default"}
                              asChild
                            >
                              <Link to={step.href} className="gap-2">
                                {step.action}
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="ml-6 mt-4 h-8 border-l-2 border-dashed border-border" />
                )}
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="glass-panel-strong rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold">Need Help?</h2>
            <p className="text-muted-foreground">
              Our team is here to assist you throughout the process. 
              If you have any questions, don't hesitate to reach out.
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:support@consumeradvocatecenter.com">
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
