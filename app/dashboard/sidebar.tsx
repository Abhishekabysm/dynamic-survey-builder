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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NavLink = ({ href, icon: Icon, label, isCollapsed, className }: { href: string; icon: React.ElementType; label: string; isCollapsed: boolean; className?: string }) => {
  const pathname = usePathname();
  const isActive = href === '/dashboard' ? pathname === href : pathname.startsWith(href) && href !== '/';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-muted text-primary': isActive },
            className,
          )}
        >
          <Icon className="h-4 w-4" />
          {!isCollapsed && <span>{label}</span>}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export function DashboardSidebar({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="">Survey Builder</span>
        </Link>
      </div>
      <div className="flex-1 py-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
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
        <nav className="grid gap-1 px-2 text-sm font-medium">
          <NavLink href="/dashboard/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />
          <NavLink href="/dashboard/help" icon={HelpCircle} label="Help" isCollapsed={isCollapsed} />
        </nav>
      </div>
    </div>
  );
} 