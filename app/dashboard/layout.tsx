'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../lib/store';
import { logoutUser } from '../../features/auth/authSlice';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Menu,
  User,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DashboardSidebar } from './sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, needsEmailVerification } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (!isLoading && user && needsEmailVerification) {
      router.push('/verify-email');
    }
  }, [user, isLoading, needsEmailVerification, router]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/');
  };

  if (isLoading || !user || needsEmailVerification) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        {!isMobile && (
          <div className={`hidden md:block border-r bg-background transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
            <DashboardSidebar isCollapsed={isSidebarCollapsed} onCollapse={toggleSidebar} />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:static md:h-auto md:border-0 md:bg-transparent md:px-6">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs p-0">
                  <DashboardSidebar isCollapsed={false} />
                </SheetContent>
              </Sheet>
            )}
            <div className="flex-1"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push('/')}
                  className="cursor-pointer"
                >
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard')}
                  className="cursor-pointer"
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard/surveys')}
                  className="cursor-pointer"
                >
                  My Surveys
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard/responses')}
                  className="cursor-pointer"
                >
                  Responses
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:px-6 md:py-0">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
} 