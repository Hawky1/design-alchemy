import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, Shield, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AnalysisResults from '@/components/analysis-results';
import LeadCaptureDialog, { LeadData } from '@/components/lead-capture-dialog';
import Hls from 'hls.js';
import { AnalysisResult } from '@/lib/analysis-schema';
import consumerLogo from '@/assets/consumer-logo.png';
import experianLogo from '@/assets/experian-logo.png';
import equifaxLogo from '@/assets/equifax-logo.png';
import transunionLogo from '@/assets/transunion-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { SettlementsBanner } from '@/components/settlements-banner';

interface BureauFiles {
    experian: File | null;
    equifax: File | null;
    transunion: File | null;
}

export default function Analyze() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [files, setFiles] = useState<BureauFiles>({
        experian: null,
        equifax: null,
        transunion: null
    });
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [showLeadDialog, setShowLeadDialog] = useState(false);
    const [leadData, setLeadData] = useState<LeadData | null>(null);

    // Initialize video background
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.src = 'https://files.revneo.com/red3.mp4';
        video.load();
        video.play().catch(() => {
            // Autoplay failed, which is okay for background video
        });
    }, []);

    const handleFileChange = (bureau: keyof BureauFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e?.target?.files?.[0];
        if (selectedFile?.type === 'application/pdf') {
            setFiles(prev => ({ ...prev, [bureau]: selectedFile }));
            setError(null);
        } else {
            setError('Please upload a valid PDF file');
        }
    };

    const removeFile = (bureau: keyof BureauFiles) => {
        setFiles(prev => ({ ...prev, [bureau]: null }));
    };

    const handleAnalyzeClick = () => {
        const uploadedFiles = Object.values(files).filter(f => f !== null);
        if (uploadedFiles.length === 0) {
            setError('Please upload at least one credit report');
            return;
        }
        
        // If we already have lead data, proceed with analysis
        if (leadData) {
            handleAnalyze(leadData);
        } else {
            // Show lead capture dialog
            setShowLeadDialog(true);
        }
    };

    const handleLeadSubmit = (data: LeadData) => {
        setLeadData(data);
        setShowLeadDialog(false);
        handleAnalyze(data);
    };

    const handleAnalyze = async (lead: LeadData) => {
        setAnalyzing(true);
        setError(null);
        setProgress(0);

        try {
            const formData = new FormData();
            if (files.experian) formData.append('experian', files.experian);
            if (files.equifax) formData.append('equifax', files.equifax);
            if (files.transunion) formData.append('transunion', files.transunion);
            
            // Add lead data to the request
            formData.append('leadName', lead.name);
            formData.append('leadEmail', lead.email);

            // Use fetch directly for streaming SSE response (supabase.functions.invoke truncates large responses)
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-report`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Analysis request failed');
            }

            // Read the streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let partialRead = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    partialRead += decoder.decode(value, { stream: true });
                    const lines = partialRead.split('\n');
                    partialRead = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                setAnalyzing(false);
                                return;
                            }
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed?.status === 'processing') {
                                    if (typeof parsed?.progress === 'number') {
                                        setProgress(prev => Math.max(prev, Math.min(parsed.progress, 99)));
                                    }
                                } else if (parsed?.status === 'completed') {
                                    setResults(parsed?.result as AnalysisResult);
                                    setProgress(100);
                                    setAnalyzing(false);
                                    return;
                                } else if (parsed?.status === 'error') {
                                    throw new Error(parsed?.message || 'Analysis failed');
                                }
                            } catch (e) {
                                // Skip invalid JSON lines
                            }
                        }
                    }
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'Failed to analyze credit report. Check backend connection.');
            setAnalyzing(false);
        }
    };

    if (results) {
        return <AnalysisResults results={results} onReset={() => {
            setResults(null);
            setFiles({ experian: null, equifax: null, transunion: null });
        }} />;
    }

    const hasAnyFile = files.experian || files.equifax || files.transunion;

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Video Background */}
            <video
                ref={videoRef}
                src="https://files.revneo.com/red3.mp4"
                className="fixed inset-0 w-full h-full object-cover z-0"
                autoPlay
                muted
                loop
                playsInline
            />

            {/* Settlements Banner */}
            <SettlementsBanner />

            <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src={consumerLogo}
                            alt="Consumer Advocate Resolution Center"
                            className="h-16 w-auto"
                        />
                    </Link>
                    <Link to="/">
                        <button className="px-4 py-1.5 text-sm rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-medium">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 pt-16 pb-16">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8 animate-reveal">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">1</span>
                        <span className="text-sm font-medium text-primary">Upload</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
                        <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm font-bold flex items-center justify-center">2</span>
                        <span className="text-sm font-medium text-muted-foreground">Analyze</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
                        <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm font-bold flex items-center justify-center">3</span>
                        <span className="text-sm font-medium text-muted-foreground">Results</span>
                    </div>
                </div>

                <div className="text-center mb-10 animate-reveal">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight gradient-text">
                        Analyze Your Credit Reports
                    </h1>
                    <p className="text-lg text-muted-foreground mb-3 font-light">
                        Upload reports from all three bureaus for comprehensive cross-bureau analysis
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            ~2 min analysis
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Shield className="w-4 h-4 text-success" />
                            256-bit encrypted
                        </span>
                    </div>
                </div>

                <div className="glass-panel-strong rounded-3xl p-8 md:p-12 animate-reveal-delay-1 shadow-2xl border-gradient">
                    <div className="space-y-8">
                        {/* Upload Areas for Each Bureau */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Experian */}
                            <div className="space-y-4 group">
                                <div className="flex justify-center h-12 p-2 bg-white/90 rounded-xl mx-4">
                                    <img src={experianLogo} alt="Experian" className="h-full w-auto object-contain" />
                                </div>
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${files.experian
                                            ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
                                            : 'border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 group-hover:scale-[1.02]'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange('experian')}
                                        className="hidden"
                                        id="experian-upload"
                                        disabled={analyzing}
                                    />
                                    <label htmlFor="experian-upload" className="cursor-pointer block">
                                        {files.experian ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <FileText className="w-7 h-7 text-primary" />
                                                </div>
                                                <p className="text-sm font-semibold truncate max-w-full">
                                                    {files.experian?.name}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFile('experian');
                                                    }}
                                                    className="text-xs text-primary hover:opacity-80 flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                    <Upload className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <p className="text-sm font-semibold">Upload PDF</p>
                                                <p className="text-xs text-muted-foreground">Click to browse</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Equifax */}
                            <div className="space-y-4 group">
                                <div className="flex justify-center h-12 p-2 bg-white/90 rounded-xl mx-4">
                                    <img src={equifaxLogo} alt="Equifax" className="h-full w-auto object-contain" />
                                </div>
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${files.equifax
                                            ? 'border-info bg-info/15 shadow-lg shadow-info/20'
                                            : 'border-border bg-card/50 hover:border-info/50 hover:bg-info/5 hover:shadow-lg hover:shadow-info/10 group-hover:scale-[1.02]'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange('equifax')}
                                        className="hidden"
                                        id="equifax-upload"
                                        disabled={analyzing}
                                    />
                                    <label htmlFor="equifax-upload" className="cursor-pointer block">
                                        {files.equifax ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-info/20 flex items-center justify-center">
                                                    <FileText className="w-7 h-7 text-info" />
                                                </div>
                                                <p className="text-sm font-semibold truncate max-w-full">
                                                    {files.equifax?.name}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFile('equifax');
                                                    }}
                                                    className="text-xs text-info hover:opacity-80 flex items-center gap-1 px-3 py-1 rounded-full bg-info/10 hover:bg-info/20 transition-colors"
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-info/10 transition-colors">
                                                    <Upload className="w-7 h-7 text-muted-foreground group-hover:text-info transition-colors" />
                                                </div>
                                                <p className="text-sm font-semibold">Upload PDF</p>
                                                <p className="text-xs text-muted-foreground">Click to browse</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* TransUnion */}
                            <div className="space-y-4 group">
                                <div className="flex justify-center h-12 p-2 bg-white/90 rounded-xl mx-4">
                                    <img src={transunionLogo} alt="TransUnion" className="h-full w-auto object-contain" />
                                </div>
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${files.transunion
                                            ? 'border-success bg-success/15 shadow-lg shadow-success/20'
                                            : 'border-border bg-card/50 hover:border-success/50 hover:bg-success/5 hover:shadow-lg hover:shadow-success/10 group-hover:scale-[1.02]'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange('transunion')}
                                        className="hidden"
                                        id="transunion-upload"
                                        disabled={analyzing}
                                    />
                                    <label htmlFor="transunion-upload" className="cursor-pointer block">
                                        {files.transunion ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
                                                    <FileText className="w-7 h-7 text-success" />
                                                </div>
                                                <p className="text-sm font-semibold truncate max-w-full">
                                                    {files.transunion?.name}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFile('transunion');
                                                    }}
                                                    className="text-xs text-success hover:opacity-80 flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 hover:bg-success/20 transition-colors"
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-success/10 transition-colors">
                                                    <Upload className="w-7 h-7 text-muted-foreground group-hover:text-success transition-colors" />
                                                </div>
                                                <p className="text-sm font-semibold">Upload PDF</p>
                                                <p className="text-xs text-muted-foreground">Click to browse</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-info">
                            <h4 className="font-semibold mb-3 text-info">Why Upload All Three?</h4>
                            <ul className="text-sm text-muted-foreground space-y-2 font-light">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-info" /> Detect discrepancies between bureaus (amounts, dates, statuses)</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-info" /> Find accounts reported to some bureaus but not others</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-info" /> Identify duplicate accounts across different bureaus</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-info" /> Maximize your chances of finding FCRA violations</li>
                            </ul>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-2xl p-4 text-center border border-destructive/30 bg-destructive/10 text-destructive">
                                {error}
                            </div>
                        )}

                        {/* Progress Bar */}
                        {analyzing && (
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span className="font-light">Analyzing your credit reports and comparing bureaus...</span>
                                    <span className="font-medium">{progress}%</span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden bg-border">
                                    <div
                                        className="h-full transition-all duration-300 bg-primary rounded-full"
                                        style={{
                                            width: `${progress}%`,
                                            boxShadow: '0 0 12px hsl(var(--primary) / 0.5)'
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Analyze Button */}
                        <div className="space-y-4">
                            <button
                                onClick={handleAnalyzeClick}
                                disabled={!hasAnyFile || analyzing}
                                className={`w-full btn-pill text-lg font-semibold transition-all ${
                                    !hasAnyFile || analyzing
                                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                        : 'bg-primary text-primary-foreground btn-glow animate-[pulse-glow_2s_ease-in-out_infinite]'
                                }`}
                            >
                                {analyzing ? 'Analyzing...' : hasAnyFile ? 'Analyze Credit Reports' : 'Upload At Least One Report'}
                            </button>
                            
                            {/* Trust Badge */}
                            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-success" />
                                    Bank-level security
                                </span>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-info" />
                                    FCRA compliant
                                </span>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                <span>Files deleted after analysis</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 text-center text-sm text-muted-foreground animate-reveal-delay-2">
                    <p className="font-light">Your data is processed securely and never stored permanently</p>
                </div>
            </div>

            {/* Lead Capture Dialog */}
            <LeadCaptureDialog
                open={showLeadDialog}
                onOpenChange={setShowLeadDialog}
                onSubmit={handleLeadSubmit}
            />
        </div>
    );
}
