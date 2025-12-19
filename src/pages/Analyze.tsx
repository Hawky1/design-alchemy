
import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, ArrowLeft, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnalysisResults from '@/components/analysis-results';
import Hls from 'hls.js';
import { AnalysisResult } from '@/lib/analysis-schema';

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

    // Initialize video background
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const videoSrc = 'https://customer-cbeadsgr09pnsezs.cloudflarestream.com/b17f76a1270818e8cdc55e8719b9ace8/manifest/video.m3u8';

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
            });
            hls.loadSource(videoSrc);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {
                    // Autoplay failed, which is okay for background video
                });
            });

            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = videoSrc;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(() => {
                    // Autoplay failed
                });
            });
        }
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

    const handleAnalyze = async () => {
        const uploadedFiles = Object.values(files).filter(f => f !== null);
        if (uploadedFiles.length === 0) {
            setError('Please upload at least one credit report');
            return;
        }

        setAnalyzing(true);
        setError(null);
        setProgress(0);

        try {
            const formData = new FormData();
            if (files.experian) formData.append('experian', files.experian);
            if (files.equifax) formData.append('equifax', files.equifax);
            if (files.transunion) formData.append('transunion', files.transunion);

            // Use the Supabase edge function URL from environment
            const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
            const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

            const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-report`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                }
            });

            if (!response?.ok) {
                throw new Error('Analysis request failed (Backend not connected)');
            }

            const reader = response?.body?.getReader();
            const decoder = new TextDecoder();
            let partialRead = '';

            while (true) {
                const { done, value } = await reader?.read?.() ?? {};
                if (done) break;

                partialRead += decoder?.decode?.(value, { stream: true }) ?? '';
                let lines = partialRead?.split?.('\n') ?? [];
                partialRead = lines?.pop?.() ?? '';

                for (const line of lines) {
                    if (line?.startsWith?.('data: ')) {
                        const data = line?.slice?.(6) ?? '';
                        if (data === '[DONE]') {
                            return;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed?.status === 'processing') {
                                if (typeof parsed?.progress === 'number') {
                                    setProgress(prev => Math.max(prev, Math.min(parsed.progress, 99)));
                                } else {
                                    setProgress(prev => Math.min(prev + 1, 99));
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
                            // Skip invalid JSON
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
                className="fixed inset-0 w-full h-full object-cover -z-20"
                autoPlay
                muted
                loop
                playsInline
            />
            {/* Dark Overlay for Content Readability */}
            <div className="fixed inset-0 -z-10 bg-background/70" />
            
            {/* Ambient Orbs */}
            <div className="fixed inset-0 pointer-events-none -z-5">
                <div className="ambient-orb ambient-orb-primary absolute -top-[10%] -left-[10%] w-[40%] h-[40%]" />
                <div className="ambient-orb ambient-orb-secondary absolute bottom-[10%] -right-[5%] w-[30%] h-[30%]" />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/carc-logo.webp"
                            alt="Consumer Advocate Resolution Center"
                            width={180}
                            height={60}
                            className="h-12 w-auto"
                        />
                    </Link>
                    <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 pt-32 pb-16">
                <div className="text-center mb-12 animate-reveal">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight gradient-text">
                        Analyze Your Credit Reports
                    </h1>
                    <p className="text-lg text-muted-foreground mb-2 font-light">
                        Upload reports from all three bureaus for comprehensive cross-bureau analysis
                    </p>
                    <p className="text-sm font-medium text-primary">
                        Upload all three for the most accurate violation detection and discrepancy analysis
                    </p>
                </div>

                <div className="glass-panel rounded-3xl p-8 md:p-12 animate-reveal-delay-1">
                    <div className="space-y-8">
                        {/* Upload Areas for Each Bureau */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Experian */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-center">Experian</h3>
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${files.experian
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5'
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
                                    <label htmlFor="experian-upload" className="cursor-pointer">
                                        {files.experian ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-12 h-12 text-primary" />
                                                <p className="text-sm font-semibold truncate max-w-full">
                                                    {files.experian?.name}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFile('experian');
                                                    }}
                                                    className="text-xs text-primary hover:opacity-80 flex items-center gap-1"
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-12 h-12 text-muted-foreground" />
                                                <p className="text-sm font-semibold">Upload PDF</p>
                                                <p className="text-xs text-muted-foreground">Optional</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Equifax */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-center">Equifax</h3>
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${files.equifax
                                            ? 'border-info bg-info/10'
                                            : 'border-border bg-card/50 hover:border-info/50 hover:bg-info/5'
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
                                    <label htmlFor="equifax-upload" className="cursor-pointer">
                                        {files.equifax ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-12 h-12 text-info" />
                                                <p className="text-sm font-semibold truncate max-w-full">
                                                    {files.equifax?.name}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFile('equifax');
                                                    }}
                                                    className="text-xs text-primary hover:opacity-80 flex items-center gap-1"
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-12 h-12 text-muted-foreground" />
                                                <p className="text-sm font-semibold">Upload PDF</p>
                                                <p className="text-xs text-muted-foreground">Optional</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* TransUnion */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-center">TransUnion</h3>
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${files.transunion
                                            ? 'border-success bg-success/10'
                                            : 'border-border bg-card/50 hover:border-success/50 hover:bg-success/5'
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
                                    <label htmlFor="transunion-upload" className="cursor-pointer">
                                        {files.transunion ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-12 h-12 text-success" />
                                                <p className="text-sm font-semibold truncate max-w-full">
                                                    {files.transunion?.name}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFile('transunion');
                                                    }}
                                                    className="text-xs text-primary hover:opacity-80 flex items-center gap-1"
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-12 h-12 text-muted-foreground" />
                                                <p className="text-sm font-semibold">Upload PDF</p>
                                                <p className="text-xs text-muted-foreground">Optional</p>
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
                        <button
                            onClick={handleAnalyze}
                            disabled={!hasAnyFile || analyzing}
                            className={`w-full btn-pill text-lg font-semibold transition-all ${
                                !hasAnyFile || analyzing
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                    : 'bg-primary text-primary-foreground btn-glow'
                            }`}
                        >
                            {analyzing ? 'Analyzing...' : hasAnyFile ? 'Analyze Credit Reports' : 'Upload At Least One Report'}
                        </button>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 text-center text-sm text-muted-foreground animate-reveal-delay-2">
                    <p className="font-light">Your data is processed securely and never stored permanently</p>
                </div>
            </div>
        </div>
    );
}
