import { Link } from 'react-router-dom';
import { FileText, Shield, TrendingUp, AlertCircle, BarChart3, CheckCircle } from 'lucide-react';
import consumerLogo from '@/assets/consumer-logo.png';
import { SettlementsBanner } from '@/components/settlements-banner';

export default function Index() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 relative overflow-hidden">
            {/* Settlements Banner */}
            <SettlementsBanner />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img
                            src={consumerLogo}
                            alt="Consumer Advocate Resolution Center"
                            className="h-16 w-auto"
                        />
                    </div>
                    <Link to="/analyze">
                        <button className="px-5 py-2 text-sm rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
                            Analyze Report
                        </button>
                    </Link>
                </div>
            </header>

            {/* Hero Section - Keep dark with video */}
            <section className="relative pt-32 pb-24 px-6 min-h-[90vh] flex items-center overflow-hidden isolate">
                {/* Video Background */}
                <div className="absolute inset-0 z-0 bg-black">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="https://storage.googleapis.com/msgsndr/FuOewPgnMEW1CaeIftBR/media/6944c9a85b256bbfd9c619bc.mp4" type="video/mp4" />
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

            {/* How It Works */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center mb-4 tracking-tight text-gray-900">How It Works</h2>
                    <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto font-light text-lg">
                        Simple three-step process to get your complete credit analysis
                    </p>
                    <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                        {[
                            { step: '1', title: 'Upload Your Reports', desc: 'Upload your credit reports from all 3 bureaus in PDF format for the most comprehensive analysis' },
                            { step: '2', title: 'AI Analysis', desc: 'Our AI analyzes your credit health, score factors, accounts, and automatically checks for FCRA violations' },
                            { step: '3', title: 'Get Your Results', desc: 'Receive detailed recommendations, improvement strategies, and next steps to fix your credit' }
                        ].map((item) => (
                            <div key={item.step} className="text-center bg-gray-50 rounded-2xl p-8 shadow-md border border-gray-100">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 bg-primary text-primary-foreground shadow-lg">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                                <p className="text-gray-600 font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight text-gray-900">What You'll Get - Completely Free</h2>
                        <p className="text-gray-600 font-light max-w-2xl mx-auto text-lg">
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
                                className="group bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <feature.icon className="w-12 h-12 mb-5 text-primary" />
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 font-light leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FCRA Violations Bonus Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-3xl p-10 lg:p-14 border-2 border-amber-200 bg-amber-50 relative overflow-hidden shadow-lg">
                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <div className="inline-block px-6 py-2 rounded-full bg-amber-500 text-white font-bold mb-6 shadow-md">
                                    BONUS FEATURE
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight text-gray-900">Plus: Automatic FCRA Violation Detection</h2>
                                <p className="text-gray-600 font-light max-w-2xl mx-auto text-lg">
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
                                        className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{violation.title}</h3>
                                        <p className="text-gray-600 text-sm font-light">{violation.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CARC Services Section */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-3xl p-10 lg:p-14 border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-white relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <div className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold mb-6 shadow-lg">
                                    PROTECT YOUR CONSUMER RIGHTS
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight text-gray-900">Found Violations? We Fight For You!</h2>
                                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-2 font-light">
                                    Consumer Advocate Resolution Center - America's Largest Consumer Protection Advocates
                                </p>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                                    We Fight For The 99%! Our nationwide network of attorneys sue debt collectors and credit reporting agencies
                                </p>
                            </div>

                            {/* Recent Settlements Carousel */}
                            <div className="bg-white rounded-2xl p-8 mb-8 shadow-md border border-gray-100">
                                <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">Recent Settlements</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {[
                                        { amount: '$100K', desc: 'Fraudulent credit info resulting in identity theft and missed credit opportunities' },
                                        { amount: '$77K', desc: 'Incorrect credit card balance reporting causing score drop and increased utilization' },
                                        { amount: '$67K', desc: 'Vehicle repossession reporting error & erroneous background check affecting rental opportunities' },
                                        { amount: '$60K', desc: 'Wrong balance reporting causing significant credit score drop' },
                                        { amount: '$42K', desc: 'Inaccurate eviction listing & reporting leading to home refinance denial' },
                                        { amount: '$40K', desc: 'Duplicate account reporting causing significant credit score drop' }
                                    ].map((settlement, idx) => (
                                        <div key={idx} className="rounded-2xl p-6 border-2 border-emerald-200 bg-emerald-50 shadow-sm">
                                            <p className="text-3xl font-bold mb-2 text-emerald-600">{settlement.amount}</p>
                                            <p className="text-sm text-gray-600 font-light">{settlement.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* What We Do */}
                            <div className="bg-white rounded-2xl p-8 mb-8 shadow-md border border-gray-100">
                                <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">How C.A.R.C Fights For You</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { title: 'FREE Case Review', desc: 'No charge to review your case and estimate what type of settlement you could be eligible for' },
                                        { title: 'Nationwide Network of Attorneys', desc: 'Consumer protection lawyers ready to fight for your rights across the country' },
                                        { title: 'FCRA & FDCPA Violations', desc: 'We hold companies accountable using consumer laws that protect your rights' },
                                        { title: 'Corrected Reports or Settlements', desc: 'We work to correct inaccuracies on your report or secure monetary compensation' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl">
                                            <div className="flex-shrink-0 w-3 h-3 rounded-full bg-emerald-500 mt-1.5" />
                                            <div>
                                                <p className="font-semibold mb-1 text-gray-900">{item.title}</p>
                                                <p className="text-gray-600 text-sm font-light">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Live Training */}
                            <div className="rounded-2xl p-8 mb-8 border-2 border-sky-200 bg-sky-50 shadow-md">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900">CATCH US LIVE EVERY THURSDAY NIGHT</h3>
                                    <p className="text-3xl font-bold mb-2 text-sky-600">6:00 PM - 7:00 PM CST</p>
                                    <p className="text-lg mb-4 font-light text-gray-700">Register to Learn More on How to Protect Your Rights!</p>
                                    <p className="text-sm mb-6 text-sky-600 font-medium">Limited for First 100 Participants Only</p>
                                    <a href="tel:1-888-817-2272">
                                        <button className="px-8 py-4 rounded-full bg-gray-900 text-white font-bold hover:bg-sky-600 transition-all shadow-lg hover:shadow-xl">
                                            Call 1-888-817-CARC (2272)
                                        </button>
                                    </a>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="text-center">
                                <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto shadow-md border border-gray-100">
                                    <p className="text-lg mb-4 font-light text-gray-700">
                                        If you've been searching for a "Consumer Advocate" - you found us!
                                    </p>
                                    <p className="text-sm text-gray-600 mb-6 font-light">
                                        C.A.R.C puts our clients first. We work with you from start to finish. If a violation has been committed against you,
                                        we will have it reviewed by the law firm FREE of charge to determine whether you have a potential claim.
                                    </p>
                                    <a href="tel:1-888-817-2272">
                                        <button className="px-8 py-4 rounded-full bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl">
                                            Get Your Free Case Review
                                        </button>
                                    </a>
                                    <p className="text-sm text-gray-500 mt-4">Call: 1-888-817-CARC (2272) - No Charge for Case Review</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>




            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-10 text-center text-gray-600">
                    <p className="mb-2 font-light">© 2024 Consumer Advocate Resolution Center. All Rights Reserved.</p>
                    <p className="text-sm font-light">Your data is processed securely and never stored. | Call: 1-888-817-CARC (2272)</p>
                </div>
            </footer>
        </div>
    );
}
