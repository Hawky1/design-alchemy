import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle, FileText, Clock, Shield, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLead } from '@/lib/lead-context';
import consumerLogo from '@/assets/consumer-logo.png';
import experianLogo from '@/assets/experian-logo.png';
import equifaxLogo from '@/assets/equifax-logo.png';
import transunionLogo from '@/assets/transunion-logo.png';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
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
      logo: experianLogo,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
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
      logo: equifaxLogo,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
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
      logo: transunionLogo,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
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
    <div className="min-h-screen bg-gray-50">
      {/* Settlements Banner */}
      <SettlementsBanner />
      
      {/* Header */}
      <header className="sticky top-0 z-40 py-4 px-6 border-b border-gray-200 bg-white shadow-sm">
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

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-semibold">Step 2 of 4</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Get Your Free Credit Reports
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Follow these steps to download your credit reports from all three bureaus. 
              You'll need these PDFs for our AI-powered analysis.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200 shadow-sm">
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">Important: Use AnnualCreditReport.com</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  This is the only official website authorized by federal law to provide free credit reports 
                  from all three bureaus. You're entitled to one free report from each bureau every 12 months.
                </p>
                <Button asChild size="lg" className="mt-4 gap-2 shadow-md hover:shadow-lg transition-shadow">
                  <a 
                    href="https://www.annualcreditreport.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Go to AnnualCreditReport.com
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Time Estimate */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-base">
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm border border-gray-200">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-gray-700 font-medium">Takes about 15-20 minutes</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm border border-gray-200">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-gray-700 font-medium">100% secure process</span>
            </div>
          </div>

          {/* Bureau Cards */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Download from Each Bureau</h2>
            {bureaus.map((bureau, index) => (
              <div key={bureau.name} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`h-3 bg-gradient-to-r ${bureau.color}`} />
                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-24 flex items-center">
                        <img src={bureau.logo} alt={bureau.name} className="h-full w-auto object-contain" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{bureau.name}</h3>
                        <p className="text-gray-600 mt-1 text-base leading-relaxed">{bureau.description}</p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full bg-gray-100 text-gray-700">
                      Report {index + 1} of 3
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <p className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4">
                      Steps to download:
                    </p>
                    <ol className="space-y-3">
                      {bureau.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-center gap-4">
                          <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${bureau.color} text-white text-sm flex items-center justify-center font-bold shadow-sm`}>
                            {stepIndex + 1}
                          </span>
                          <span className="text-gray-700 text-lg">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              Pro Tips for Best Results
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 bg-white/60 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-lg leading-relaxed">Save each report as a <strong className="text-gray-900">PDF file</strong> for the best analysis results.</span>
              </li>
              <li className="flex items-start gap-4 bg-white/60 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-lg leading-relaxed">You can upload reports from <strong className="text-gray-900">1, 2, or all 3 bureaus</strong> - more is better!</span>
              </li>
              <li className="flex items-start gap-4 bg-white/60 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-lg leading-relaxed">If you've already requested reports recently, you may need to <strong className="text-gray-900">pay a small fee</strong> or wait until your next free report is available.</span>
              </li>
              <li className="flex items-start gap-4 bg-white/60 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-lg leading-relaxed">Have your <strong className="text-gray-900">Social Security number</strong> and address history ready for verification.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button variant="outline" size="lg" asChild className="text-base px-8 py-6 h-auto">
              <Link to="/portal" className="gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Portal
              </Link>
            </Button>
            <Button 
              size="lg" 
              onClick={handleMarkComplete}
              className="gap-2 btn-glow text-base px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-shadow"
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
