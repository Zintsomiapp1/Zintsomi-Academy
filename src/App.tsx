
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/Navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load components for better performance
const Index = React.lazy(() => import("@/pages/Index"));
const Courses = React.lazy(() => import("@/pages/Courses"));
const CoursePlayer = React.lazy(() => import("@/pages/CoursePlayer"));
const Auth = React.lazy(() => import("@/pages/Auth"));
const Welcome = React.lazy(() => import("@/pages/Welcome"));
const BrainTraining = React.lazy(() => import("@/pages/BrainTraining"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const AdvancedCourses = React.lazy(() => import("@/pages/AdvancedCourses"));
const Wishlist = React.lazy(() => import("@/pages/Wishlist"));
const Cart = React.lazy(() => import("@/pages/Cart"));
const Games = React.lazy(() => import("@/pages/Games"));
const Stories = React.lazy(() => import("@/pages/Stories"));
const IndigenousGames = React.lazy(() => import("@/pages/IndigenousGames"));
const IndigenousInstruments = React.lazy(() => import("@/pages/IndigenousInstruments"));
const ProfileSettings = React.lazy(() => import("@/pages/ProfileSettings"));
const AdminPanel = React.lazy(() => import("@/pages/AdminPanel"));
const VRContent = React.lazy(() => import("@/pages/VRContent"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
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
                  <Suspense fallback={<LoadingSpinner fullScreen={true} message="Loading..." />}>
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
                  </Suspense>
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
