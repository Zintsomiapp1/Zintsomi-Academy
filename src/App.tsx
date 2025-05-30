
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/Navigation";
import Index from "@/pages/Index";
import Courses from "@/pages/Courses";
import CoursePlayer from "@/pages/CoursePlayer";
import Auth from "@/pages/Auth";
import Welcome from "@/pages/Welcome";
import BrainTraining from "@/pages/BrainTraining";
import Dashboard from "@/pages/Dashboard";
import AdvancedCourses from "@/pages/AdvancedCourses";
import Wishlist from "@/pages/Wishlist";
import Cart from "@/pages/Cart";
import Games from "@/pages/Games";
import Stories from "@/pages/Stories";
import IndigenousGames from "@/pages/IndigenousGames";
import IndigenousInstruments from "@/pages/IndigenousInstruments";
import ProfileSettings from "@/pages/ProfileSettings";
import AdminPanel from "@/pages/AdminPanel";
import VRContent from "@/pages/VRContent";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <CartProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/advanced-courses" element={<AdvancedCourses />} />
                    <Route path="/stories" element={<Stories />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/indigenous-games" element={<IndigenousGames />} />
                    <Route path="/indigenous-instruments" element={<IndigenousInstruments />} />
                    <Route path="/vr-content" element={<VRContent />} />
                    <Route path="/course/:id" element={<CoursePlayer />} />
                    <Route path="/profile-settings" element={<ProfileSettings />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route 
                      path="/auth" 
                      element={
                        <Auth 
                          onLogin={() => {}} 
                          onBack={() => window.history.back()} 
                        />
                      } 
                    />
                    <Route 
                      path="/welcome" 
                      element={
                        <Welcome 
                          onLogin={() => window.location.href = '/auth'} 
                          onSignUp={() => window.location.href = '/auth'} 
                        />
                      } 
                    />
                    <Route 
                      path="/brain-training" 
                      element={
                        <BrainTraining 
                          user={{ name: 'User', email: 'user@example.com' }} 
                          onBack={() => window.history.back()} 
                        />
                      } 
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              <Toaster />
            </Router>
          </CartProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
