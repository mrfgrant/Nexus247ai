import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import Landing from "@/pages/landing";
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
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="md:hidden flex items-center gap-3 p-3 border-b border-border bg-background sticky top-0 z-30">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <span className="text-sm font-semibold text-foreground">VetLetters</span>
          </div>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/intake" component={Intake} />
            <Route path="/conditions" component={Conditions} />
            <Route path="/generate" component={GenerateDocument} />
            <Route path="/documents" component={Documents} />
            <Route path="/chat" component={Chat} />
            <Route path="/rating" component={RatingEstimator} />
            <Route path="/analyze" component={AnalyzeLetter} />
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
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return <AuthenticatedLayout />;
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
