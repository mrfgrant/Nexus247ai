import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import Landing from "@/pages/landing";
import Faq from "@/pages/faq";
import Terms from "@/pages/terms";
import Dashboard from "@/pages/dashboard";
import Intake from "@/pages/intake";
import Conditions from "@/pages/conditions";
import GenerateDocument from "@/pages/generate-document";
import Documents from "@/pages/documents";
import Chat from "@/pages/chat";
import RatingEstimator from "@/pages/rating-estimator";
import Pricing from "@/pages/pricing";
import Support from "@/pages/support";
import Settings from "@/pages/settings";
import AdminKnowledgeBase from "@/pages/admin-knowledge-base";
import AdminSupport from "@/pages/admin-support";
import AdminUsers from "@/pages/admin-users";
import AnalyzeLetter from "@/pages/analyze-letter";
import CnpPrep from "@/pages/cnp-prep";
import DocumentPrint from "@/pages/document-print";
import Forum from "@/pages/forum";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { CookieConsent } from "@/components/cookie-consent";
import { WelcomeOverlay } from "@/components/welcome-overlay";
import { ExitIntent } from "@/components/exit-intent";
import { trackSignUp } from "@/lib/analytics";

function AuthenticatedLayout() {
  const [location] = useLocation();
  const isChatPage = location === "/chat";

  const { data: profile, isLoading: profileLoading } = useQuery<any>({
    queryKey: ["/api/profile"],
  });

  const hasProfile = !!profile && profile !== null && typeof profile === "object" && profile.id;
  const allowedWithoutProfile = ["/intake", "/pricing", "/settings", "/support", "/chat", "/forum"];
  const needsRedirect = !profileLoading && !hasProfile && !allowedWithoutProfile.includes(location);
  useEffect(() => {
    if (!profileLoading && !hasProfile) {
      try {
        if (!localStorage.getItem("nexus247_signup_tracked")) {
          trackSignUp();
          localStorage.setItem("nexus247_signup_tracked", "true");
        }
      } catch {}
    }
  }, [profileLoading, hasProfile]);

  if (profileLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (needsRedirect) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <Redirect to="/intake" />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {!isChatPage && (
            <div className="md:hidden flex items-center gap-3 p-3 border-b border-border bg-background sticky top-0 z-30">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <span className="text-sm font-semibold text-foreground">Nexus247</span>
            </div>
          )}
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/intake" component={Intake} />
            <Route path="/conditions" component={Conditions} />
            <Route path="/generate" component={GenerateDocument} />
            <Route path="/documents" component={Documents} />
            <Route path="/chat" component={Chat} />
            <Route path="/rating" component={RatingEstimator} />
            <Route path="/analyze" component={AnalyzeLetter} />
            <Route path="/cnp-prep" component={CnpPrep} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/support" component={Support} />
            <Route path="/settings" component={Settings} />
            <Route path="/admin/knowledge-base" component={AdminKnowledgeBase} />
            <Route path="/admin/support" component={AdminSupport} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route component={Dashboard} />
          </Switch>
        </main>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/faq" component={Faq} />
          <Route path="/terms" component={Terms} />
          <Route path="/forum" component={Forum} />
          <Route component={Landing} />
        </Switch>
        <WelcomeOverlay />
        <CookieConsent />
        <ExitIntent />
      </>
    );
  }

  return (
    <Switch>
      <Route path="/faq" component={Faq} />
      <Route path="/terms" component={Terms} />
      <Route path="/forum" component={Forum} />
      <Route path="/documents/:id/print" component={DocumentPrint} />
      <Route><AuthenticatedLayout /></Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
