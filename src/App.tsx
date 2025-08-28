
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Mjolo from "./pages/Mjolo";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-mjolo-pink/10 via-white to-mjolo-purple/10">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/welcome" element={<Welcome onLogin={() => {}} onSignUp={() => {}} />} />
                <Route path="/auth" element={<Auth onLogin={() => {}} onBack={() => {}} />} />
                <Route path="/mjolo" element={<Mjolo />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/settings" element={<ProfileSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
