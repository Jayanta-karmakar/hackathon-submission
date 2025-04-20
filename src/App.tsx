// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import { Suspense, lazy } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

// Direct imports
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Lazy load with proper type casting
const CreateRoom = lazy(
  () =>
    import("./pages/CreateRoom") as Promise<{ default: React.ComponentType }>
);
const BrowseRooms = lazy(
  () =>
    import("./pages/BrowseRooms") as Promise<{ default: React.ComponentType }>
);
const QuizRoom = lazy(
  () => import("./pages/QuizRoom") as Promise<{ default: React.ComponentType }>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <QuizProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateRoom />} />
              <Route path="/browse" element={<BrowseRooms />} />
              <Route path="/room/:roomId" element={<QuizRoom />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </QuizProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
