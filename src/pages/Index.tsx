
import { Link } from 'react-router-dom';
import { FileText, Shield, TrendingUp, AlertCircle, BarChart3, CheckCircle } from 'lucide-react';
import carcLogo from '@/assets/carc-logo.webp';

export default function Index() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Ambient Background Orbs */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="ambient-orb ambient-orb-primary absolute -top-[10%] -left-[10%] w-[40%] h-[40%]" />
                <div className="ambient-orb ambient-orb-secondary absolute bottom-[10%] -right-[5%] w-[30%] h-[30%]" />
                <div className="ambient-orb ambient-orb-primary absolute top-[60%] left-[20%] w-[20%] h-[20%]" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-14 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img
                            src={carcLogo}
                            alt="Consumer Advocate Resolution Center"
                            width={180}
                            height={60}
                            className="h-14 w-auto"
                        />
                    </div>
                    <Link to="/analyze">
                        <button className="px-4 py-1.5 text-sm rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-medium">
                            Analyze Report
                        </button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 min-h-[90vh] flex items-center overflow-hidden isolate">
                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/videos/hero-background.mp4" type="video/mp4" />
                    </video>
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-[1]" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="animate-reveal">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-white font-medium text-sm">100% FREE Credit Analysis Tool</span>
                        </div>
                    </div>
                    
                    <h1 className="animate-reveal-delay-1 text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-white">
                        Get a Complete Credit
                        <br />
                        <span className="bg-gradient-to-r from-primary via-primary to-accent-coral bg-clip-text text-transparent">Analysis in Minutes</span>
                    </h1>
                    
                    <p className="animate-reveal-delay-2 text-lg sm:text-xl text-white/80 font-light max-w-3xl mx-auto mb-8 leading-relaxed">
                        Upload your credit reports and receive instant AI-powered insights, personalized recommendations, and a comprehensive breakdown of your credit health - plus automatic FCRA violation detection
                    </p>
                    
                    <div className="animate-reveal-delay-2 flex flex-wrap justify-center gap-3 mb-10">
                        <span className="px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm text-sm font-medium">Experian</span>
                        <span className="px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm text-sm font-medium">Equifax</span>
                        <span className="px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm text-sm font-medium">TransUnion</span>
                    </div>
                    
                    <div className="animate-reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/analyze">
                            <button className="btn-pill btn-glow bg-primary text-primary-foreground font-semibold text-lg">
                                Start Free Credit Analysis
                            </button>
                        </Link>
                        <Link to="/analyze">
                            <button className="btn-pill border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-medium transition-all">
                                Learn More
                            </button>
                        </Link>
                    </div>
                    
                    <p className="animate-reveal-delay-3 text-sm text-white/60 mt-6">
                        Upload reports from all 3 bureaus for the most comprehensive analysis
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 section-border">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">What You'll Get - Completely Free</h2>
                        <p className="text-muted-foreground font-light max-w-2xl mx-auto text-lg">
                            Our AI-powered analysis provides everything you need to understand and improve your credit health
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                className="group glass-panel rounded-3xl p-8 card-hover border-gradient">
                                <feature.icon className="w-12 h-12 mb-5 text-primary" />
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground font-light leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FCRA Violations Bonus Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-3xl p-10 lg:p-14 border border-warning/30 bg-warning/5 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-warning rounded-full blur-[150px]" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <div className="inline-block px-6 py-2 rounded-full bg-warning text-warning-foreground font-bold mb-6">
                                    BONUS FEATURE
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">Plus: Automatic FCRA Violation Detection</h2>
                                <p className="text-muted-foreground font-light max-w-2xl mx-auto text-lg">
                                    As an added benefit, our tool automatically scans for Fair Credit Reporting Act violations that could entitle you to legal compensation
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                                        className="glass-panel rounded-2xl p-6 border border-warning/20">
                                        <h3 className="text-lg font-semibold mb-2">{violation.title}</h3>
                                        <p className="text-muted-foreground text-sm font-light">{violation.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CARC Services Section */}
            <section className="py-24 px-6 section-border">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-3xl p-10 lg:p-14 border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 bg-primary/10 blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full -ml-48 -mb-48 bg-accent-coral/10 blur-[120px]" />

                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <div className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold mb-6 animate-pulse-glow">
                                    PROTECT YOUR CONSUMER RIGHTS
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">Found Violations? We Fight For You!</h2>
                                <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-2 font-light">
                                    Consumer Advocate Resolution Center - America's Largest Consumer Protection Advocates
                                </p>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
                                    We Fight For The 99%! Our nationwide network of attorneys sue debt collectors and credit reporting agencies
                                </p>
                            </div>

                            {/* Recent Settlements Carousel */}
                            <div className="glass-panel rounded-2xl p-8 mb-8">
                                <h3 className="text-2xl font-semibold mb-6 text-center">Recent Settlements</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {[
                                        { amount: '$100K', desc: 'Fraudulent credit info resulting in identity theft and missed credit opportunities' },
                                        { amount: '$77K', desc: 'Incorrect credit card balance reporting causing score drop and increased utilization' },
                                        { amount: '$67K', desc: 'Vehicle repossession reporting error & erroneous background check affecting rental opportunities' },
                                        { amount: '$60K', desc: 'Wrong balance reporting causing significant credit score drop' },
                                        { amount: '$42K', desc: 'Inaccurate eviction listing & reporting leading to home refinance denial' },
                                        { amount: '$40K', desc: 'Duplicate account reporting causing significant credit score drop' }
                                    ].map((settlement, idx) => (
                                        <div key={idx} className="rounded-2xl p-6 border-2 border-success/30 bg-success/5">
                                            <p className="text-3xl font-bold mb-2 text-success">{settlement.amount}</p>
                                            <p className="text-sm text-muted-foreground font-light">{settlement.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* What We Do */}
                            <div className="glass-panel rounded-2xl p-8 mb-8">
                                <h3 className="text-2xl font-semibold mb-6 text-center">How C.A.R.C Fights For You</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { title: 'FREE Case Review', desc: 'No charge to review your case and estimate what type of settlement you could be eligible for' },
                                        { title: 'Nationwide Network of Attorneys', desc: 'Consumer protection lawyers ready to fight for your rights across the country' },
                                        { title: 'FCRA & FDCPA Violations', desc: 'We hold companies accountable using consumer laws that protect your rights' },
                                        { title: 'Corrected Reports or Settlements', desc: 'We work to correct inaccuracies on your report or secure monetary compensation' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-success mt-2" />
                                            <div>
                                                <p className="font-semibold mb-1">{item.title}</p>
                                                <p className="text-muted-foreground text-sm font-light">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Live Training */}
                            <div className="rounded-2xl p-8 mb-8 border-2 border-info/40 bg-gradient-to-br from-info/20 to-info/5">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold mb-3">CATCH US LIVE EVERY THURSDAY NIGHT</h3>
                                    <p className="text-3xl font-bold mb-2">6:00 PM - 7:00 PM CST</p>
                                    <p className="text-lg mb-4 font-light">Register to Learn More on How to Protect Your Rights!</p>
                                    <p className="text-sm mb-6 text-info">Limited for First 100 Participants Only</p>
                                    <a href="tel:1-888-817-2272">
                                        <button className="btn-pill bg-foreground text-background font-bold hover:bg-info hover:text-info-foreground transition-all">
                                            Call 1-888-817-CARC (2272)
                                        </button>
                                    </a>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="text-center">
                                <div className="glass-panel rounded-2xl p-8 max-w-3xl mx-auto">
                                    <p className="text-lg mb-4 font-light">
                                        If you've been searching for a "Consumer Advocate" - you found us!
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-6 font-light">
                                        C.A.R.C puts our clients first. We work with you from start to finish. If a violation has been committed against you,
                                        we will have it reviewed by the law firm FREE of charge to determine whether you have a potential claim.
                                    </p>
                                    <a href="tel:1-888-817-2272">
                                        <button className="btn-pill btn-glow bg-success text-success-foreground font-bold">
                                            Get Your Free Case Review
                                        </button>
                                    </a>
                                    <p className="text-sm text-muted-foreground mt-4">Call: 1-888-817-CARC (2272) - No Charge for Case Review</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Get Your Credit Reports */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-3xl p-10 lg:p-14 border border-info/20 bg-info/5">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center mb-4 tracking-tight">How to Get Your Credit Reports</h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto font-light text-lg">
                            To get your free credit analysis, you'll need to obtain official PDF copies from the three major credit bureaus
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {[
                                { title: 'Experian', domain: 'experian.com', colorClass: 'primary', info: 'Includes credit score' },
                                { title: 'Equifax', domain: 'equifax.com', colorClass: 'info', info: 'Detailed account information' },
                                { title: 'TransUnion', domain: 'transunion.com', colorClass: 'success', info: 'Comprehensive credit history' }
                            ].map((bureau, idx) => (
                                <div key={idx} className={`glass-panel rounded-2xl p-6 border-2 border-${bureau.colorClass}/30`}>
                                    <h3 className={`text-xl font-bold mb-3 text-${bureau.colorClass}`}>{bureau.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-3 font-light">Visit <span className="font-semibold text-foreground">{bureau.domain}</span> to download your report</p>
                                    <ul className="text-muted-foreground text-sm space-y-2 font-light">
                                        <li className="flex items-center gap-2"><CheckCircle className={`w-4 h-4 text-${bureau.colorClass}`} /> Free annual report available</li>
                                        <li className="flex items-center gap-2"><CheckCircle className={`w-4 h-4 text-${bureau.colorClass}`} /> {bureau.info}</li>
                                        <li className="flex items-center gap-2"><CheckCircle className={`w-4 h-4 text-${bureau.colorClass}`} /> Download as PDF</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 p-6 rounded-2xl border-2 border-warning/30 bg-warning/5 max-w-4xl mx-auto">
                            <p className="text-center text-muted-foreground font-light">
                                <span className="font-semibold text-foreground">Pro Tip:</span> You're entitled to one free credit report from each bureau every year via{' '}
                                <span className="font-semibold text-primary">AnnualCreditReport.com</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-6 section-border">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center mb-4 tracking-tight">How It Works</h2>
                    <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto font-light text-lg">
                        Simple three-step process to get your complete credit analysis
                    </p>
                    <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                        {[
                            { step: '1', title: 'Upload Your Reports', desc: 'Upload your credit reports from all 3 bureaus in PDF format for the most comprehensive analysis' },
                            { step: '2', title: 'AI Analysis', desc: 'Our AI analyzes your credit health, score factors, accounts, and automatically checks for FCRA violations' },
                            { step: '3', title: 'Get Your Results', desc: 'Receive detailed recommendations, improvement strategies, and next steps to fix your credit' }
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 bg-primary text-primary-foreground shadow-glow">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Usage Instructions */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-3xl p-10 lg:p-14 border border-accent-coral/20 bg-accent-coral/5">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center mb-4 tracking-tight">Getting Started</h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-light text-lg">
                            Follow these simple steps to get the most comprehensive credit analysis
                        </p>
                        <div className="max-w-4xl mx-auto space-y-6">
                            {[
                                {
                                    title: 'Best Practices',
                                    colorClass: 'info',
                                    items: [
                                        { label: 'Upload all 3 reports:', text: 'Get the most complete picture of your credit health across all bureaus' },
                                        { label: 'Use official PDF reports:', text: 'Only upload reports directly downloaded from bureau websites' },
                                        { label: 'Recent reports work best:', text: 'Reports from the last 30-90 days provide the most relevant analysis' },
                                        { label: 'Check for completeness:', text: 'Ensure your PDF reports include all pages and account details' }
                                    ]
                                },
                                {
                                    title: 'What You\'ll Receive',
                                    colorClass: 'success',
                                    items: [
                                        { label: 'Credit Score Breakdown:', text: 'Understand exactly what\'s affecting your credit score' },
                                        { label: 'Personalized Recommendations:', text: 'Actionable steps to improve your credit health' },
                                        { label: 'Cross-Bureau Comparison:', text: 'Identify inconsistencies between the three bureaus' },
                                        { label: 'FCRA Violation Detection:', text: 'Bonus feature that flags potential legal violations' }
                                    ]
                                },
                                {
                                    title: 'Important Notes',
                                    colorClass: 'accent-coral',
                                    items: [
                                        { label: '', text: 'This is a 100% free educational tool - no hidden fees or charges' },
                                        { label: '', text: 'All uploads are processed securely and never stored on our servers' },
                                        { label: '', text: 'Analysis typically takes 30-60 seconds depending on report complexity' },
                                        { label: '', text: 'If violations are found, contact C.A.R.C for a FREE case review and potential legal representation' }
                                    ]
                                }
                            ].map((section, idx) => (
                                <div key={idx} className={`glass-panel rounded-2xl p-6 border-l-4 border-l-${section.colorClass}`}>
                                    <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                                    <ul className="space-y-3">
                                        {section.items.map((item, itemIdx) => (
                                            <li key={itemIdx} className="flex items-start gap-3">
                                                <CheckCircle className={`w-5 h-5 text-${section.colorClass} flex-shrink-0 mt-0.5`} />
                                                <span className="text-muted-foreground font-light">
                                                    {item.label && <span className="font-semibold text-foreground">{item.label}</span>} {item.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="section-border bg-card/50">
                <div className="max-w-7xl mx-auto px-6 py-10 text-center text-muted-foreground">
                    <p className="mb-2 font-light">© 2024 Consumer Advocate Resolution Center. All Rights Reserved.</p>
                    <p className="text-sm font-light">Your data is processed securely and never stored. | Call: 1-888-817-CARC (2272)</p>
                </div>
            </footer>
        </div>
    );
}
