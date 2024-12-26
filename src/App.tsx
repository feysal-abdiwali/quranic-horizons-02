import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Navigation } from "./components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Search = lazy(() => import("./pages/Search"));
const Recent = lazy(() => import("./pages/Recent"));
const SurahPage = lazy(() => import("./pages/SurahPage"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const AuthCallback = lazy(() => import("./pages/auth/callback"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="container max-w-4xl mx-auto px-4 py-8">
    <div className="space-y-4">
      <Skeleton className="h-12 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/surah/:number" element={<SurahPage />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;