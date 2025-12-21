import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book, FileText, ScanSearch, Phone, CheckCircle, ArrowRight, Download, ExternalLink, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLead } from '@/lib/lead-context';
import consumerLogo from '@/assets/consumer-logo.png';
import { SettlementsBanner } from '@/components/settlements-banner';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
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

  const getStepColors = (step: Step) => {
    if (step.isComplete) {
      return {
        bg: 'bg-green-500',
        text: 'text-white',
        border: 'border-green-500',
      };
    }
    if (step.isUnlocked) {
      return {
        bg: 'bg-primary',
        text: 'text-white',
        border: 'border-primary',
      };
    }
    return {
      bg: 'bg-gray-200',
      text: 'text-gray-500',
      border: 'border-gray-300',
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Video Background - subtle overlay */}
      <video
        src="http://files.revneo.com/red6.mp4"
        className="fixed inset-0 w-full h-full object-cover -z-10 opacity-10"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Settlements Banner */}
      <SettlementsBanner />
      
      {/* Header */}
      <header className="sticky top-0 z-40 py-4 px-6 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src={consumerLogo} alt="Consumer Advocate Resolution Center" className="h-14 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-base text-gray-700 hidden sm:block font-medium">
              Welcome, {lead.name?.split(' ')[0] || 'there'}!
            </span>
          </div>
        </div>
      </header>

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Welcome Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Your Credit Repair Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Follow these steps to analyze your credit reports and discover potential 
              FCRA violations that could entitle you to damages.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-gray-900">Your Progress</span>
              <span className="text-base text-gray-600 font-medium">
                {completedSteps} of {steps.length} steps completed
              </span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-3">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${step.isComplete ? 'bg-green-500' : step.isUnlocked ? 'bg-primary' : 'bg-gray-300'}`} />
                  <span className="text-xs text-gray-500 mt-1 hidden sm:block">Step {step.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const colors = getStepColors(step);
              return (
                <div 
                  key={step.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 transition-all hover:shadow-lg ${
                    !step.isUnlocked ? 'opacity-60' : ''
                  }`}
                >
                  {/* Colored top bar */}
                  <div className={`h-2 ${step.isComplete ? 'bg-gradient-to-r from-green-500 to-green-400' : step.isUnlocked ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-gray-200'}`} />
                  
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Step Number / Status */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${colors.bg} ${colors.text} shadow-md`}>
                        {step.isComplete ? (
                          <CheckCircle className="w-7 h-7" />
                        ) : (
                          <span className="font-bold text-xl">{step.id}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 flex-wrap">
                              <span className="text-primary">{step.icon}</span>
                              {step.title}
                              {step.isComplete && (
                                <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                                  Complete
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                          </div>

                          {/* Action Button */}
                          {step.isUnlocked && (
                            <div className="flex-shrink-0">
                              {step.id === 1 ? (
                                <Button 
                                  variant={step.isComplete ? "outline" : "default"}
                                  size="lg"
                                  onClick={handleDownloadEbook}
                                  className="gap-2 shadow-md hover:shadow-lg transition-shadow"
                                >
                                  <Download className="w-5 h-5" />
                                  {step.action}
                                </Button>
                              ) : step.id === 4 && !step.isUnlocked ? (
                                <Button variant="outline" size="lg" disabled>
                                  Complete Analysis First
                                </Button>
                              ) : step.id === 4 ? (
                                <Button 
                                  size="lg"
                                  className="gap-2 btn-glow shadow-md hover:shadow-lg transition-shadow"
                                  onClick={() => window.open('https://calendly.com', '_blank')}
                                >
                                  {step.action}
                                  <ExternalLink className="w-5 h-5" />
                                </Button>
                              ) : (
                                <Button 
                                  variant={step.isComplete ? "outline" : "default"}
                                  size="lg"
                                  asChild
                                  className="shadow-md hover:shadow-lg transition-shadow"
                                >
                                  <Link to={step.href} className="gap-2">
                                    {step.action}
                                    <ArrowRight className="w-5 h-5" />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-start pl-14 -mt-2 pb-0">
                      <div className="h-8 border-l-2 border-dashed border-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="bg-primary/5 rounded-2xl p-10 border border-primary/20 shadow-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <HelpCircle className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Need Help?</h2>
            <p className="text-gray-600 text-lg max-w-lg mx-auto leading-relaxed">
              Our team is here to assist you throughout the process. 
              If you have any questions, don't hesitate to reach out.
            </p>
            <Button variant="outline" size="lg" asChild className="shadow-sm hover:shadow-md transition-shadow">
              <a href="mailto:Consumeradvocatecenter@gmail.com">
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
