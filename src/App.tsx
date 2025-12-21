import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LeadProvider } from "@/lib/lead-context";
import { ScrollToTop } from "@/components/scroll-to-top";
import Index from "./pages/Index";
import Analyze from "./pages/Analyze";
import ApiTest from "./pages/ApiTest";
import FreeEbook from "./pages/FreeEbook";
import Portal from "./pages/Portal";
import GetReports from "./pages/GetReports";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Disclaimer from "./pages/Disclaimer";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <LeadProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<FreeEbook />} />
                        <Route path="/home" element={<Index />} />
                        <Route path="/analyze" element={<Analyze />} />
                        <Route path="/api-test" element={<ApiTest />} />
                        <Route path="/portal" element={<Portal />} />
                        <Route path="/portal/get-reports" element={<GetReports />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/disclaimer" element={<Disclaimer />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </LeadProvider>
    </QueryClientProvider>
);

export default App;
