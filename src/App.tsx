
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileHeader from "@/components/MobileHeader";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Mjolo from "./pages/Mjolo";
import Games from "./pages/Games";
import BrainTraining from "./pages/BrainTraining";
import Gamification from "./pages/Gamification";
import Messaging from "./pages/Messaging";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Don't show navigation on auth/welcome pages
  const hideNavigation = ['/welcome', '/auth'].includes(location.pathname) || !user;
  
  // Page titles for header
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Mjolo';
      case '/mjolo': return 'Browse';
      case '/games': return 'Games';
      case '/brain-training': return 'Brain Training';
      case '/gamification': return 'Achievements';
      case '/messaging': return 'Messages';
      case '/settings': return 'Profile';
      default: return 'Mjolo';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {!hideNavigation && <MobileHeader title={getPageTitle()} />}
      
      <main className={`${!hideNavigation ? 'pb-20' : ''} min-h-screen`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<Welcome onLogin={() => {}} onSignUp={() => {}} />} />
          <Route path="/auth" element={<Auth onLogin={() => {}} onBack={() => {}} />} />
          <Route path="/mjolo" element={<Mjolo />} />
          <Route path="/games" element={<Games />} />
          <Route path="/brain-training" element={<BrainTraining />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {!hideNavigation && <MobileBottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </HashRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
