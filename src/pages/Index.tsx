
import { Link } from 'react-router-dom';
import { FileText, Shield, TrendingUp, AlertCircle, BarChart3, CheckCircle } from 'lucide-react';

export default function Index() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(244, 63, 94, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(251, 113, 133, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(251, 113, 133, 0.1) 0%, transparent 40%)`
                }}></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img
                            src="/carc-logo.webp"
                            alt="Consumer Advocate Resolution Center"
                            width={180}
                            height={60}
                            className="h-14 w-auto"
                        />
                    </div>
                    <Link to="/analyze">
                        <button className="group relative px-6 py-2.5 rounded-full font-medium transition-all overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.8) 0%, rgba(251, 113, 133, 0.8) 100%)',
                                boxShadow: '0 0 20px rgba(244, 63, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(244, 63, 94, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(244, 63, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                            <span className="relative z-10 text-white">Analyze Report</span>
                        </button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 text-center">
                <div className="mb-8 animate-[fadeUp_0.8s_ease-out]">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-emerald-400/30 bg-emerald-400/10"
                        style={{
                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)'
                        }}>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-[glowPulse_2s_ease-in-out_infinite]"></div>
                        <span className="text-emerald-300 font-semibold">100% FREE Credit Analysis Tool</span>
                    </div>
                    <h2 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight"
                        style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #fecdd3 50%, #ffffff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                        Get a Complete Credit Analysis in Minutes
                    </h2>
                    <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-4">
                        Upload your credit reports and receive instant AI-powered insights, personalized recommendations, and a comprehensive breakdown of your credit health - plus automatic FCRA violation detection
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm font-medium mb-6">
                        <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">Experian</span>
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Equifax</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">TransUnion</span>
                    </div>
                </div>
                <div className="animate-[scaleIn_0.8s_ease-out_0.3s_both]">
                    <Link to="/analyze">
                        <button className="group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(26, 26, 26, 1) 0%, rgba(10, 10, 10, 1) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.5)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(244, 63, 94, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.5)';
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10 text-white">Start Free Credit Analysis</span>
                        </button>
                    </Link>
                    <p className="text-sm text-neutral-400 mt-4">Upload reports from all 3 bureaus for the most comprehensive analysis</p>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center mb-4">What You'll Get - Completely Free</h2>
                <p className="text-center text-neutral-400 mb-12 max-w-2xl mx-auto">
                    Our AI-powered analysis provides everything you need to understand and improve your credit health
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: BarChart3,
                            title: 'Complete Credit Breakdown',
                            description: 'Detailed analysis of your credit score with factors, payment history, and utilization metrics'
                        },
                        {
                            icon: TrendingUp,
                            title: 'Personalized Recommendations',
                            description: 'Step-by-step action plan to improve your credit score based on your specific situation'
                        },
                        {
                            icon: AlertCircle,
                            title: 'Cross-Bureau Comparison',
                            description: 'Side-by-side analysis of all three reports to identify inconsistencies and discrepancies'
                        },
                        {
                            icon: FileText,
                            title: 'Account Analysis',
                            description: 'Comprehensive review of all accounts, balances, payment history, and debt-to-income ratio'
                        },
                        {
                            icon: Shield,
                            title: 'Bonus: FCRA Violation Detection',
                            description: 'Automatic detection of potential legal violations that could entitle you to compensation'
                        },
                        {
                            icon: CheckCircle,
                            title: 'Next Steps & Resources',
                            description: 'Clear guidance on how to dispute errors and optimize your credit repair journey'
                        }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="group relative rounded-2xl p-8 transition-all duration-300 border-gradient"
                            style={{
                                background: 'rgba(23, 23, 23, 0.4)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 48px rgba(244, 63, 94, 0.15), 0 0 0 1px rgba(244, 63, 94, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                            }}>
                            <feature.icon className="w-12 h-12 mb-4" style={{ color: '#f43f5e' }} />
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-neutral-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FCRA Violations Bonus Section */}
            <section className="max-w-6xl mx-auto px-6 py-16 rounded-3xl my-8 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)`
                    }}></div>
                </div>
                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-block px-4 py-2 rounded-full font-bold mb-4"
                            style={{
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(249, 115, 22, 0.8) 100%)',
                                boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
                            }}>
                            BONUS FEATURE
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Plus: Automatic FCRA Violation Detection</h2>
                        <p className="text-neutral-300 max-w-2xl mx-auto">
                            As an added benefit, our tool automatically scans for Fair Credit Reporting Act violations that could entitle you to legal compensation
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Wrong Amounts', desc: 'Incorrect balances or payment amounts reported by creditors' },
                            { title: '1099-C Violations', desc: 'Debts reported after cancellation of debt (1099-C issued)' },
                            { title: 'Identity Theft', desc: 'Unauthorized accounts or fraudulent activity on your credit report' },
                            { title: 'Duplicate Accounts', desc: 'Same debt reported multiple times by different collectors' },
                            { title: 'Bankruptcy Discharge', desc: 'Discharged debts still showing as owed or active' },
                            { title: 'Background Screening Issues', desc: 'Improper use of credit reports for employment or tenant screening' }
                        ].map((violation, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl p-6 transition-all"
                                style={{
                                    background: 'rgba(23, 23, 23, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(249, 115, 22, 0.3)',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                                }}>
                                <h3 className="text-lg font-semibold mb-2">{violation.title}</h3>
                                <p className="text-neutral-400 text-sm">{violation.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CARC Services Section */}
            <section className="max-w-6xl mx-auto px-6 py-16 rounded-3xl my-8 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(23, 23, 23, 0.8) 100%)',
                    border: '1px solid rgba(220, 38, 38, 0.3)'
                }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32"
                    style={{
                        background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)'
                    }}></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full -ml-48 -mb-48"
                    style={{
                        background: 'radial-gradient(circle, rgba(251, 113, 133, 0.1) 0%, transparent 70%)'
                    }}></div>

                <div className="relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-block px-6 py-3 rounded-full font-bold mb-4"
                            style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(249, 115, 22, 0.8) 100%)',
                                boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                                animation: 'glowPulse 2s ease-in-out infinite'
                            }}>
                            PROTECT YOUR CONSUMER RIGHTS
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Found Violations? We Fight For You!</h2>
                        <p className="text-xl text-neutral-200 max-w-3xl mx-auto mb-2">
                            Consumer Advocate Resolution Center - America's Largest Consumer Protection Advocates
                        </p>
                        <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
                            We Fight For The 99%! Our nationwide network of attorneys sue debt collectors and credit reporting agencies
                        </p>
                    </div>

                    {/* Recent Settlements Carousel */}
                    <div className="rounded-2xl p-8 mb-8"
                        style={{
                            background: 'rgba(23, 23, 23, 0.6)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                        <h3 className="text-2xl font-bold mb-6 text-center">Recent Settlements</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { amount: '$100K', desc: 'Fraudulent credit info resulting in identity theft and missed credit opportunities' },
                                { amount: '$77K', desc: 'Incorrect credit card balance reporting causing score drop and increased utilization' },
                                { amount: '$67K', desc: 'Vehicle repossession reporting error & erroneous background check affecting rental opportunities' },
                                { amount: '$60K', desc: 'Wrong balance reporting causing significant credit score drop' },
                                { amount: '$42K', desc: 'Inaccurate eviction listing & reporting leading to home refinance denial' },
                                { amount: '$40K', desc: 'Duplicate account reporting causing significant credit score drop' }
                            ].map((settlement, idx) => (
                                <div key={idx} className="rounded-xl p-6 border-2 transition-all"
                                    style={{
                                        background: 'rgba(16, 185, 129, 0.05)',
                                        borderColor: 'rgba(16, 185, 129, 0.3)',
                                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)'
                                    }}>
                                    <p className="text-3xl font-bold mb-2" style={{ color: '#10b981' }}>{settlement.amount}</p>
                                    <p className="text-sm text-neutral-300">{settlement.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* What We Do */}
                    <div className="rounded-2xl p-8 mb-8"
                        style={{
                            background: 'rgba(23, 23, 23, 0.6)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                        <h3 className="text-2xl font-bold mb-6 text-center">How C.A.R.C Fights For You</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: 'FREE Case Review', desc: 'No charge to review your case and estimate what type of settlement you could be eligible for' },
                                { title: 'Nationwide Network of Attorneys', desc: 'Consumer protection lawyers ready to fight for your rights across the country' },
                                { title: 'FCRA & FDCPA Violations', desc: 'We hold companies accountable using consumer laws that protect your rights' },
                                { title: 'Corrected Reports or Settlements', desc: 'We work to correct inaccuracies on your report or secure monetary compensation' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 text-xl" style={{ color: '#10b981' }}>-</div>
                                    <div>
                                        <p className="font-semibold">{item.title}</p>
                                        <p className="text-neutral-300 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Training */}
                    <div className="rounded-2xl p-8 mb-8 border-2"
                        style={{
                            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
                            borderColor: 'rgba(96, 165, 250, 0.5)',
                            boxShadow: '0 0 30px rgba(37, 99, 235, 0.2)'
                        }}>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-3">CATCH US LIVE EVERY THURSDAY NIGHT</h3>
                            <p className="text-3xl font-bold mb-2">6:00 PM - 7:00 PM CST</p>
                            <p className="text-lg mb-4">Register to Learn More on How to Protect Your Rights!</p>
                            <p className="text-sm mb-6" style={{ color: '#bfdbfe' }}>Limited for First 100 Participants Only</p>
                            <a href="tel:1-888-817-2272" className="inline-block">
                                <button className="px-8 py-4 rounded-xl font-bold text-lg transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
                                        color: '#1e40af',
                                        boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.2)';
                                    }}>
                                    Call 1-888-817-CARC (2272)
                                </button>
                            </a>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <div className="rounded-2xl p-8 max-w-3xl mx-auto"
                            style={{
                                background: 'rgba(23, 23, 23, 0.6)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                            <p className="text-lg mb-4">
                                If you've been searching for a "Consumer Advocate" - you found us!
                            </p>
                            <p className="text-sm text-neutral-300 mb-6">
                                C.A.R.C puts our clients first. We work with you from start to finish. If a violation has been committed against you,
                                we will have it reviewed by the law firm FREE of charge to determine whether you have a potential claim.
                            </p>
                            <a href="tel:1-888-817-2272">
                                <button className="px-8 py-4 rounded-xl font-bold text-lg transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
                                        color: '#ffffff',
                                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)';
                                    }}>
                                    Get Your Free Case Review
                                </button>
                            </a>
                            <p className="text-sm text-neutral-400 mt-4">Call: 1-888-817-CARC (2272) - No Charge for Case Review</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Get Your Credit Reports */}
            <section className="max-w-6xl mx-auto px-6 py-16 rounded-3xl my-8"
                style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.1)'
                }}>
                <h2 className="text-3xl font-bold text-center mb-4">How to Get Your Credit Reports</h2>
                <p className="text-center text-neutral-400 mb-10 max-w-3xl mx-auto">
                    To get your free credit analysis, you'll need to obtain official PDF copies from the three major credit bureaus
                </p>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        { title: 'Experian', domain: 'experian.com', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' },
                        { title: 'Equifax', domain: 'equifax.com', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' },
                        { title: 'TransUnion', domain: 'transunion.com', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }
                    ].map((bureau, idx) => (
                        <div key={idx} className="rounded-xl p-6 border-2"
                            style={{
                                background: 'rgba(23, 23, 23, 0.6)',
                                backdropFilter: 'blur(20px)',
                                borderColor: bureau.borderColor,
                                boxShadow: `0 4px 16px ${bureau.borderColor}`
                            }}>
                            <h3 className="text-xl font-bold mb-3" style={{ color: bureau.color }}>{bureau.title}</h3>
                            <p className="text-neutral-300 text-sm mb-3">Visit <span className="font-semibold">{bureau.domain}</span> to download your report</p>
                            <ul className="text-neutral-400 text-sm space-y-2">
                                <li>- Free annual report available</li>
                                <li>- {idx === 0 ? 'Includes credit score' : idx === 1 ? 'Detailed account information' : 'Comprehensive credit history'}</li>
                                <li>- Download as PDF</li>
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-8 p-6 rounded-xl border-2 max-w-4xl mx-auto"
                    style={{
                        background: 'rgba(245, 158, 11, 0.05)',
                        borderColor: 'rgba(245, 158, 11, 0.3)'
                    }}>
                    <p className="text-center text-neutral-300">
                        <span className="font-semibold">Pro Tip:</span> You're entitled to one free credit report from each bureau every year via{' '}
                        <span className="font-semibold" style={{ color: '#f43f5e' }}>AnnualCreditReport.com</span>
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
                <p className="text-center text-neutral-400 mb-12 max-w-2xl mx-auto">
                    Simple three-step process to get your complete credit analysis
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { step: '1', title: 'Upload Your Reports', desc: 'Upload your credit reports from all 3 bureaus in PDF format for the most comprehensive analysis' },
                        { step: '2', title: 'AI Analysis', desc: 'Our AI analyzes your credit health, score factors, accounts, and automatically checks for FCRA violations' },
                        { step: '3', title: 'Get Your Results', desc: 'Receive detailed recommendations, improvement strategies, and next steps to fix your credit' }
                    ].map((item) => (
                        <div key={item.step} className="text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.8) 0%, rgba(251, 113, 133, 0.8) 100%)',
                                    boxShadow: '0 8px 24px rgba(244, 63, 94, 0.3)'
                                }}>
                                {item.step}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-neutral-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Usage Instructions */}
            <section className="max-w-6xl mx-auto px-6 py-16 rounded-3xl my-8"
                style={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    border: '1px solid rgba(139, 92, 246, 0.1)'
                }}>
                <h2 className="text-3xl font-bold text-center mb-4">Getting Started</h2>
                <p className="text-center text-neutral-400 mb-10 max-w-2xl mx-auto">
                    Follow these simple steps to get the most comprehensive credit analysis
                </p>
                <div className="max-w-4xl mx-auto space-y-6">
                    {[
                        {
                            title: 'Best Practices',
                            color: '#3b82f6',
                            items: [
                                { label: 'Upload all 3 reports:', text: 'Get the most complete picture of your credit health across all bureaus' },
                                { label: 'Use official PDF reports:', text: 'Only upload reports directly downloaded from bureau websites' },
                                { label: 'Recent reports work best:', text: 'Reports from the last 30-90 days provide the most relevant analysis' },
                                { label: 'Check for completeness:', text: 'Ensure your PDF reports include all pages and account details' }
                            ]
                        },
                        {
                            title: 'What You\'ll Receive',
                            color: '#10b981',
                            items: [
                                { label: 'Credit Score Breakdown:', text: 'Understand exactly what\'s affecting your credit score' },
                                { label: 'Personalized Recommendations:', text: 'Actionable steps to improve your credit health' },
                                { label: 'Cross-Bureau Comparison:', text: 'Identify inconsistencies between the three bureaus' },
                                { label: 'FCRA Violation Detection:', text: 'Bonus feature that flags potential legal violations' }
                            ]
                        },
                        {
                            title: 'Important Notes',
                            color: '#a855f7',
                            items: [
                                { label: '', text: 'This is a 100% free educational tool - no hidden fees or charges' },
                                { label: '', text: 'All uploads are processed securely and never stored on our servers' },
                                { label: '', text: 'Analysis typically takes 30-60 seconds depending on report complexity' },
                                { label: '', text: 'If violations are found, contact C.A.R.C for a FREE case review and potential legal representation' }
                            ]
                        }
                    ].map((section, idx) => (
                        <div key={idx} className="rounded-xl p-6 border-l-4"
                            style={{
                                background: 'rgba(23, 23, 23, 0.6)',
                                backdropFilter: 'blur(20px)',
                                borderLeftColor: section.color,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderLeftWidth: '4px',
                                borderLeftStyle: 'solid'
                            }}>
                            <h3 className="text-lg font-bold mb-3">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start">
                                        <span className="mr-2 font-bold" style={{ color: section.color }}>-</span>
                                        <span className="text-neutral-300">
                                            {item.label && <span className="font-semibold">{item.label}</span>} {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t mt-20"
                style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    background: 'rgba(23, 23, 23, 0.6)'
                }}>
                <div className="max-w-6xl mx-auto px-6 py-8 text-center text-neutral-400">
                    <p className="mb-2">(c) 2024 Consumer Advocate Resolution Center. All Rights Reserved.</p>
                    <p className="text-sm">Your data is processed securely and never stored. | Call: 1-888-817-CARC (2272)</p>
                </div>
            </footer>
        </div>
    );
}
