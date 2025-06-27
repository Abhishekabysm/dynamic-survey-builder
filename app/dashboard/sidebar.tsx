'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  PlusCircle,
  Settings,
  HelpCircle,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NavLink = ({ href, icon: Icon, label, isCollapsed, className }: { href: string; icon: React.ElementType; label: string; isCollapsed: boolean; className?: string }) => {
  const pathname = usePathname();
  const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href) && href !== '/';

  const linkElement = (
    <Link
      href={href}
      className={cn(
        'flex items-center text-muted-foreground transition-all hover:text-primary',
        isCollapsed
          ? 'h-9 w-9 justify-center rounded-lg'
          : 'gap-3 rounded-md px-3 py-2',
        isActive && 'font-bold text-primary',
        isActive && isCollapsed && 'bg-muted',
        className
      )}
    >
      <Icon className={cn('h-4 w-4', isCollapsed && 'h-5 w-5')} />
      {!isCollapsed && <span className="text-sm">{label}</span>}
      <span className="sr-only">{label}</span>
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkElement;
};

export function DashboardSidebar({ isCollapsed, onCollapse }: { isCollapsed: boolean, onCollapse: () => void }) {
  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className={cn("flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6", isCollapsed && "justify-center px-2")}>
        <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "hidden")}>
          <span className="">Survey Builder</span>
        </Link>
        <Button size="icon" variant="ghost" onClick={onCollapse} className={cn("hidden md:flex", !isCollapsed && "ml-auto")}>
            {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className={cn("grid items-start gap-2 px-2 text-sm font-medium", isCollapsed && "justify-items-center")}>
          <NavLink 
            href="/dashboard/surveys/create" 
            icon={PlusCircle} 
            label="Create Survey" 
            isCollapsed={isCollapsed} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground mb-4" 
          />
          <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
          <NavLink href="/dashboard/surveys" icon={FileText} label="My Surveys" isCollapsed={isCollapsed} />
          <NavLink href="/dashboard/responses" icon={BarChart2} label="Responses" isCollapsed={isCollapsed} />
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <nav className={cn("grid gap-1 px-2 text-sm font-medium", isCollapsed && "justify-items-center")}>
          <NavLink href="/dashboard/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />
          <NavLink href="/dashboard/help" icon={HelpCircle} label="Help" isCollapsed={isCollapsed} />
        </nav>
      </div>
    </div>
  );
} 