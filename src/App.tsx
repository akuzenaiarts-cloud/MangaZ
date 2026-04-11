import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import ScrollToTop from "@/components/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import Index from "./pages/Index";

const MangaInfo = lazy(() => import("./pages/MangaInfo"));
const ChapterReader = lazy(() => import("./pages/ChapterReader"));
const Latest = lazy(() => import("./pages/Latest"));
const Series = lazy(() => import("./pages/Series"));
const Library = lazy(() => import("./pages/Library"));
const EarnCoins = lazy(() => import("./pages/EarnCoins"));
const CoinShop = lazy(() => import("./pages/CoinShop"));
const UserSettings = lazy(() => import("./pages/UserSettings"));
const DMCA = lazy(() => import("./pages/DMCA"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Subscribe = lazy(() => import("./pages/Subscribe"));
const SubscribeCheckout = lazy(() => import("./pages/SubscribeCheckout"));
const SubscribeSuccess = lazy(() => import("./pages/SubscribeSuccess"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Scroll to top on route change
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppLayout = () => {
  const location = useLocation();
  const { isLoading } = useSiteSettings();
  const isChapterReader = /^\/manga\/[^/]+\/chapter\//.test(location.pathname);
  const isAdminPanel = location.pathname.startsWith('/admin');
  const hideShell = isChapterReader || isAdminPanel;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-[9999]">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 animate-pulse border border-primary/30 flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary shadow-[0_0_30px_rgba(var(--primary),0.4)] animate-bounce flex items-center justify-center">
              <span className="text-2xl font-black text-primary-foreground italic">MZ</span>
            </div>
          </div>
          <div className="absolute -inset-4 bg-primary/10 blur-3xl animate-pulse rounded-full -z-1" />
        </div>
        <div className="mt-8 space-y-2 text-center">
          <h2 className="text-white font-black tracking-tighter text-xl uppercase italic">MangaZ</h2>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-primary animate-loading-bar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead />
      <ScrollToTopOnNavigate />
      {!hideShell && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manga/:slug" element={<MangaInfo />} />
            <Route path="/manga/:slug/chapter/:chapterId" element={<ChapterReader />} />
            <Route path="/latest" element={<Latest />} />
            <Route path="/series" element={<Series />} />
            <Route path="/library" element={<Library />} />
            <Route path="/earn" element={<EarnCoins />} />
            <Route path="/coin-shop" element={<CoinShop />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/subscribe/checkout/:planId" element={<SubscribeCheckout />} />
            <Route path="/subscribe/success" element={<SubscribeSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!hideShell && <Footer />}
      <ScrollToTop />
      <LoginModal />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
