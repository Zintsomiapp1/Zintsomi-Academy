
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/advanced-courses" element={<AdvancedCourses />} />
                <Route path="/course/:id" element={<CoursePlayer />} />
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
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
