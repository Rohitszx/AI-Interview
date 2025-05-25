import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Setup from "./pages/Setup";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";


import { Header } from "./components/Header";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        
          <AnimatePresence mode="wait">
            <div className="flex flex-col min-h-screen bg-background">
              <Header />
              <main className="flex-1 relative">
                <Routes>
                  <Route path="/" element={<Index />} />
                  
                  
                  <Route path="/setup" element={<Setup />} />
                  <Route path="/interview" element={<Interview />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </AnimatePresence>
        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
