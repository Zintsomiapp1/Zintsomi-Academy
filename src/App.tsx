
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Mjolo from "./pages/Mjolo";
import Courses from "./pages/Courses";
import Library from "./pages/Library";
import Community from "./pages/Community";
import AdminDashboard from "./pages/AdminDashboard";
import AdvancedCourses from "./pages/AdvancedCourses";
import Stories from "./pages/Stories";
import Indigenous from "./pages/Indigenous";
import IndigenousInstruments from "./pages/IndigenousInstruments";
import IndigenousGames from "./pages/IndigenousGames";
import Games from "./pages/Games";
import BrainTraining from "./pages/BrainTraining";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import CoursePlayer from "./pages/CoursePlayer";
import VRContent from "./pages/VRContent";
import AdminPanel from "./pages/AdminPanel";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <div className="min-h-screen bg-background">
                <Navigation />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/welcome" element={<Welcome onLogin={() => {}} onSignUp={() => {}} />} />
                  <Route path="/auth" element={<Auth onLogin={() => {}} onBack={() => {}} />} />
                  <Route path="/mjolo" element={<Mjolo />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/advanced-courses" element={<AdvancedCourses />} />
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/indigenous" element={<Indigenous />} />
                  <Route path="/indigenous/instruments" element={<IndigenousInstruments />} />
                  <Route path="/indigenous/games" element={<IndigenousGames />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/brain-training" element={<BrainTraining />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/course/:id" element={<CoursePlayer />} />
                  <Route path="/vr-content" element={<VRContent />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/settings" element={<ProfileSettings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
