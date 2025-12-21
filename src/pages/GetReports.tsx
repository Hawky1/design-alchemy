import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle, FileText, Clock, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLead } from '@/lib/lead-context';
import consumerLogo from '@/assets/consumer-logo.png';
import { SettlementsBanner } from '@/components/settlements-banner';

export default function GetReports() {
  const navigate = useNavigate();
  const { lead, updateLead, isLoading } = useLead();

  // Redirect to signup if no lead
  useEffect(() => {
    if (!isLoading && !lead?.email) {
      navigate('/free-ebook');
    }
  }, [lead, isLoading, navigate]);

  if (isLoading || !lead) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    updateLead({ reportsDownloaded: true });
    navigate('/analyze');
  };

  const bureaus = [
    {
      name: "Experian",
      color: "from-blue-500 to-blue-600",
      description: "One of the three major credit bureaus, Experian provides detailed credit history.",
      steps: [
        "Visit AnnualCreditReport.com",
        "Select Experian as your bureau",
        "Verify your identity",
        "Download your report as PDF"
      ]
    },
    {
      name: "Equifax",
      color: "from-red-500 to-red-600",
      description: "Equifax tracks credit history and provides one of the three major credit reports.",
      steps: [
        "Visit AnnualCreditReport.com",
        "Select Equifax as your bureau",
        "Answer security questions",
        "Save your report as PDF"
      ]
    },
    {
      name: "TransUnion",
      color: "from-teal-500 to-teal-600",
      description: "TransUnion is the third major bureau that lenders use to check credit.",
      steps: [
        "Visit AnnualCreditReport.com",
        "Select TransUnion as your bureau",
        "Complete identity verification",
        "Export your report as PDF"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Settlements Banner */}
      <SettlementsBanner />
      
      {/* Header */}
      <header className="sticky top-0 z-40 py-4 px-6 border-b border-neutral-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src={consumerLogo} alt="Consumer Advocate Resolution Center" className="h-14 w-auto" />
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/portal" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Portal
            </Link>
          </Button>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Step 2 of 4</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Get Your Free Credit Reports
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to download your credit reports from all three bureaus. 
              You'll need these PDFs for our AI-powered analysis.
            </p>
          </div>

          {/* Important Notice */}
          <div className="glass-panel-strong rounded-2xl p-6 border-l-4 border-primary">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Important: Use AnnualCreditReport.com</h3>
                <p className="text-muted-foreground">
                  This is the only official website authorized by federal law to provide free credit reports 
                  from all three bureaus. You're entitled to one free report from each bureau every 12 months.
                </p>
                <Button asChild className="mt-4">
                  <a 
                    href="https://www.annualcreditreport.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    Go to AnnualCreditReport.com
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Time Estimate */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Takes about 15-20 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>100% secure process</span>
            </div>
          </div>

          {/* Bureau Cards */}
          <div className="space-y-6">
            {bureaus.map((bureau, index) => (
              <div key={bureau.name} className="glass-panel rounded-xl overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${bureau.color}`} />
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{bureau.name}</h3>
                      <p className="text-muted-foreground mt-1">{bureau.description}</p>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-muted">
                      Report {index + 1} of 3
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Steps to download:
                    </p>
                    <ol className="space-y-2">
                      {bureau.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                            {stepIndex + 1}
                          </span>
                          <span className="text-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Pro Tips for Best Results
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Save each report as a <strong className="text-foreground">PDF file</strong> for the best analysis results.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>You can upload reports from <strong className="text-foreground">1, 2, or all 3 bureaus</strong> - more is better!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>If you've already requested reports recently, you may need to <strong className="text-foreground">pay a small fee</strong> or wait until your next free report is available.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Have your <strong className="text-foreground">Social Security number</strong> and address history ready for verification.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="outline" size="lg" asChild>
              <Link to="/portal" className="gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Portal
              </Link>
            </Button>
            <Button 
              size="lg" 
              onClick={handleMarkComplete}
              className="gap-2 btn-glow"
            >
              I Have My Reports - Continue
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
