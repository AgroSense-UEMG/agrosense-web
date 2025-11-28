import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Package,
  LogOut,
  Menu,
  Leaf,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NavItem } from "@/types";
import { mockUser, isUserCoordinator } from "@/mocks";

/**
 * Itens de navegação da Sidebar
 * Conforme especificação: "Meus Projetos", "Inventário" (se Coordenador), "Sair"
 */
const NAV_ITEMS: NavItem[] = [
  {
    label: "Projetos",
    href: "/app/projects",
    icon: FolderKanban,
  },
  {
    label: "Inventário",
    href: "/app/inventory",
    icon: Package,
    coordinatorOnly: true,
  },
];

/**
 * Extrai as iniciais do nome do usuário para o avatar
 */
function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Componente de navegação da Sidebar - Desktop (Expansível)
 */
function SidebarNavDesktop({ 
  isExpanded, 
  onToggle 
}: { 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  const navigate = useNavigate();
  const isCoordinator = isUserCoordinator(mockUser);

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.coordinatorOnly || isCoordinator
  );

  const handleLogout = () => {
    console.log("Logout");
    navigate("/login");
  };

  return (
    <div 
      className={cn(
        "flex h-full flex-col py-4 transition-all duration-300",
        isExpanded ? "w-56 px-3" : "w-16 items-center"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center mb-6",
        isExpanded ? "gap-3 px-2" : "justify-center"
      )}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        {isExpanded && (
          <span className="text-lg font-bold text-[hsl(var(--title-primary))] whitespace-nowrap">
            AgroSense
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className={cn(
        "flex flex-1 flex-col gap-1",
        !isExpanded && "items-center"
      )}>
        {filteredNavItems.map((item) => {
          const linkContent = (
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center rounded-xl transition-all duration-200",
                  isExpanded 
                    ? "gap-3 px-3 py-2.5 w-full" 
                    : "h-10 w-10 justify-center",
                  isActive
                    ? isExpanded
                      ? "bg-primary text-primary-foreground shadow-sm [&>svg]:text-primary-foreground"
                      : "bg-primary/15 shadow-md [&>svg]:text-[#1B5E20]"
                    : "hover:bg-accent [&>svg]:text-[#1B5E20] [&>span]:text-[#1B5E20]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Indicador de página ativa - apenas sidebar retraída */}
                  {isActive && !isExpanded && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full bg-primary" />
                  )}
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isExpanded && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          );

          // Tooltip apenas quando recolhido
          if (!isExpanded) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </nav>

      {/* Toggle Button */}
      <div className={cn(
        "py-2",
        isExpanded ? "px-2" : "flex justify-center"
      )}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-9 w-9 text-[hsl(var(--title-primary))] hover:bg-accent"
            >
              {isExpanded ? (
                <ChevronsLeft className="h-4 w-4" />
              ) : (
                <ChevronsRight className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {isExpanded ? "Recolher menu" : "Expandir menu"}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* User Avatar com Dropdown */}
      <div className={cn(
        "pt-2 border-t border-border",
        isExpanded ? "px-2" : "flex justify-center"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "hover:bg-accent text-foreground",
                isExpanded 
                  ? "w-full justify-start gap-3 px-2 py-2 h-auto" 
                  : "h-10 w-10 rounded-xl p-0"
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {getUserInitials(mockUser.name)}
                </AvatarFallback>
              </Avatar>
              {isExpanded && (
                <div className="flex flex-col items-start text-left min-w-0">
                  <span className="text-sm font-medium truncate max-w-[140px]">
                    {mockUser.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {mockUser.role}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align={isExpanded ? "end" : "start"} 
            side="right" 
            className="w-56 ml-2"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground">{mockUser.email}</p>
              <p className="text-xs text-primary mt-0.5">{mockUser.role}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/**
 * Componente de navegação da Sidebar - Mobile (Expandida)
 */
function SidebarNavMobile({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const isCoordinator = isUserCoordinator(mockUser);

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.coordinatorOnly || isCoordinator
  );

  const handleLogout = () => {
    console.log("Logout");
    navigate("/login");
  };

  return (
    <div className="flex h-full flex-col p-4">
      {/* Logo e Branding */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-[hsl(var(--title-primary))]">
          AgroSense
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-[hsl(var(--title-primary))] hover:bg-accent"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getUserInitials(mockUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{mockUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}

/**
 * Layout Principal do Dashboard
 * 
 * Conforme especificação:
 * - Sidebar lateral (desktop) ou Menu Hamburguer (mobile)
 * - Contendo: "Meus Projetos", "Inventário" (se Coordenador), "Sair"
 * - Mostrar nome do usuário e avatar
 */
export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar Desktop - Expansível */}
      <aside className="hidden lg:flex lg:flex-col lg:border-r lg:border-border lg:bg-card">
        <SidebarNavDesktop 
          isExpanded={sidebarExpanded} 
          onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
        />
      </aside>

      {/* Mobile Header + Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-[hsl(var(--title-primary))]">
              AgroSense
            </span>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu de navegação</SheetTitle>
              </SheetHeader>
              <SidebarNavMobile onNavigate={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
