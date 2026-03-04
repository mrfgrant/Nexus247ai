import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ClipboardList,
  Stethoscope,
  FileText,
  FolderOpen,
  MessageCircle,
  Calculator,
  CreditCard,
  Settings,
  BookOpen,
  HeadphonesIcon,
  LogOut,
  Shield,
  FileSearch,
  ClipboardCheck,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import logoIcon from "@assets/Nexus247_Logo_Shield_1772555600715.png";
import { getRankDisplayName } from "@shared/utils";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Intake Profile", url: "/intake", icon: ClipboardList },
  { title: "My Conditions", url: "/conditions", icon: Stethoscope },
  { title: "Generate Letter", url: "/generate", icon: FileText },
  { title: "C&P Exam Prep", url: "/cnp-prep", icon: ClipboardCheck, badge: "Pro" },
  { title: "My Documents", url: "/documents", icon: FolderOpen },
  { title: "Ask VA Questions", url: "/chat", icon: MessageCircle },
  { title: "Rating Estimator", url: "/rating", icon: Calculator },
  { title: "Analyze Decision Letter", url: "/analyze", icon: FileSearch },
];

const bottomItems = [
  { title: "Pricing", url: "/pricing", icon: CreditCard },
  { title: "Get Help", url: "/support", icon: HeadphonesIcon },
  { title: "Report a Problem", url: "/support?type=bug", icon: AlertTriangle },
  { title: "Feature Request", url: "/support?type=feature", icon: Lightbulb },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminItems = [
  { title: "Manage Users", url: "/admin/users", icon: Shield },
  { title: "Knowledge Base", url: "/admin/knowledge-base", icon: BookOpen },
  { title: "Support Requests", url: "/admin/support", icon: HeadphonesIcon },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const { data: profile } = useQuery<any>({ queryKey: ["/api/profile"] });
  const isAdminUser = profile?.role === "admin";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img
            src={logoIcon}
            alt="Nexus247"
            className="w-9 h-9 rounded-md"
            data-testid="img-logo"
          />
          <div>
            <h2 className="text-sm font-bold tracking-tight text-sidebar-foreground">
              Nexus247
            </h2>
            <p className="text-xs text-sidebar-foreground/60">.ai</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Claims Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
                      <item.icon className="w-4 h-4" />
                      <span className="flex-1">{item.title}</span>
                      {"badge" in item && item.badge && (
                        <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 h-4 font-medium">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdminUser && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      data-active={location === item.url}
                    >
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImageUrl || ""} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                {user.lastName?.[0] || user.firstName?.[0] || user.email?.[0] || "V"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                {getRankDisplayName(profile?.rank, profile?.branch, user.lastName, user.firstName) || user.email}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => logout()}
              className="text-sidebar-foreground/60"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
