
import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, ArrowLeft, X } from 'lucide-react';
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
            let buffer = '';
            let partialRead = '';

            // ... (Rest of the streaming logic remains similar if the edge function mimics the stream)
            // This part might need adjustment depending on how Supabase streams stats.

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
        <div className="min-h-screen bg-neutral-950 text-neutral-100 relative overflow-hidden">
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
            <div className="fixed inset-0 -z-10 bg-black/60" />

            <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/carc-logo.webp"
                            alt="Consumer Advocate Resolution Center"
                            width={180}
                            height={60}
                            className="h-14 w-auto"
                        />
                    </Link>
                    <Link to="/" className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #fecdd3 50%, #ffffff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                        Analyze Your Credit Reports
                    </h1>
                    <p className="text-lg text-neutral-300 mb-2">
                        Upload reports from all three bureaus for comprehensive cross-bureau analysis
                    </p>
                    <p className="text-sm font-medium" style={{ color: '#f43f5e' }}>
                        Upload all three for the most accurate violation detection and discrepancy analysis
                    </p>
                </div>

                <div className="rounded-2xl p-8 md:p-12"
                    style={{
                        background: 'rgba(23, 23, 23, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    }}>
                    <div className="space-y-8">
                        {/* Upload Areas for Each Bureau */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Experian */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-center">Experian</h3>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${files.experian
                                            ? 'border-rose-500 bg-rose-500/10'
                                            : 'border-neutral-700 bg-neutral-900/50 hover:border-rose-500/50 hover:bg-rose-500/5'
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
                                                <FileText className="w-12 h-12" style={{ color: '#f43f5e' }} />
                                                <p className="text-sm font-semibold truncate max-w-full">
                                                    {files.experian?.name}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFile('experian');
                                                    }}
                                                    className="text-xs hover:opacity-80 flex items-center gap-1"
                                                    style={{ color: '#f43f5e' }}
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-12 h-12 text-neutral-500" />
                                                <p className="text-sm font-semibold">Upload PDF</p>
                                                <p className="text-xs text-neutral-500">Optional</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Equifax */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-center">Equifax</h3>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${files.equifax
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-neutral-700 bg-neutral-900/50 hover:border-blue-500/50 hover:bg-blue-500/5'
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
                                                <FileText className="w-12 h-12 text-blue-500" />
                                                <p className="text-sm font-semibold truncate max-w-full">
                                                    {files.equifax?.name}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFile('equifax');
                                                    }}
                                                    className="text-xs text-blue-500 hover:opacity-80 flex items-center gap-1"
                                                    style={{ color: '#f43f5e' }}
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-12 h-12 text-neutral-500" />
                                                <p className="text-sm font-semibold">Upload PDF</p>
                                                <p className="text-xs text-neutral-500">Optional</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* TransUnion */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-center">TransUnion</h3>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${files.transunion
                                            ? 'border-emerald-500 bg-emerald-500/10'
                                            : 'border-neutral-700 bg-neutral-900/50 hover:border-emerald-500/50 hover:bg-emerald-500/5'
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
                                                <FileText className="w-12 h-12 text-emerald-500" />
                                                <p className="text-sm font-semibold truncate max-w-full">
                                                    {files.transunion?.name}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFile('transunion');
                                                    }}
                                                    className="text-xs text-emerald-500 hover:opacity-80 flex items-center gap-1"
                                                    style={{ color: '#f43f5e' }}
                                                >
                                                    <X className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-12 h-12 text-neutral-500" />
                                                <p className="text-sm font-semibold">Upload PDF</p>
                                                <p className="text-xs text-neutral-500">Optional</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="border-l-4 p-4 rounded-lg"
                            style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                borderLeftColor: '#3b82f6',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderLeftWidth: '4px'
                            }}>
                            <h4 className="font-semibold mb-2" style={{ color: '#60a5fa' }}>Why Upload All Three?</h4>
                            <ul className="text-sm text-neutral-300 space-y-1">
                                <li>- Detect discrepancies between bureaus (amounts, dates, statuses)</li>
                                <li>- Find accounts reported to some bureaus but not others</li>
                                <li>- Identify duplicate accounts across different bureaus</li>
                                <li>- Maximize your chances of finding FCRA violations</li>
                            </ul>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg p-4 text-center border"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderColor: 'rgba(239, 68, 68, 0.3)',
                                    color: '#fca5a5'
                                }}>
                                {error}
                            </div>
                        )}

                        {/* Progress Bar */}
                        {analyzing && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-neutral-400">
                                    <span>Analyzing your credit reports and comparing bureaus...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden"
                                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                                    <div
                                        className="h-full transition-all duration-300"
                                        style={{
                                            width: `${progress}%`,
                                            background: 'linear-gradient(90deg, #f43f5e 0%, #fb7185 100%)',
                                            boxShadow: '0 0 10px rgba(244, 63, 94, 0.5)'
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={!hasAnyFile || analyzing}
                            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${!hasAnyFile || analyzing
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                                }`}
                            style={
                                !hasAnyFile || analyzing
                                    ? { background: 'rgba(115, 115, 115, 0.3)', color: '#737373' }
                                    : {
                                        background: 'linear-gradient(135deg, rgba(26, 26, 26, 1) 0%, rgba(10, 10, 10, 1) 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
                                        color: '#ffffff'
                                    }
                            }
                            onMouseEnter={(e) => {
                                if (!hasAnyFile || analyzing) return;
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(244, 63, 94, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                if (!hasAnyFile || analyzing) return;
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.5)';
                            }}
                        >
                            {analyzing ? 'Analyzing...' : hasAnyFile ? 'Analyze Credit Reports' : 'Upload At Least One Report'}
                        </button>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 text-center text-sm text-neutral-400">
                    <p>Your data is processed securely and never stored permanently</p>
                </div>
            </div>
        </div>
    );
}

