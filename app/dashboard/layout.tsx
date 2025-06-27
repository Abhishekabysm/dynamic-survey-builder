'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../lib/store';
import { logoutUser } from '../../features/auth/authSlice';

// Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const SurveyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ResponsesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChevronLeftIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${props.className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const MenuIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${props.className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const PanelCloseIcon = (props: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <line x1="9" x2="9" y1="3" y2="21" />
    <path d="m14 15-3-3 3-3" />
  </svg>
);

const PlusIcon = (props: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, needsEmailVerification } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    
    // Redirect to email verification page if email is not verified
    if (!isLoading && user && needsEmailVerification) {
      router.push('/verify-email');
    }
  }, [user, isLoading, needsEmailVerification, router]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/');
  };

  if (isLoading || !user || needsEmailVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center p-3 rounded-lg ${
      isActive
        ? 'bg-gray-200 text-gray-900 font-semibold'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    } ${isSidebarCollapsed ? 'justify-center' : ''}`;
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex h-full flex-col bg-gray-50 border-r border-gray-200">
          <div className={`flex h-[65px] items-center border-b border-gray-200 px-4 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`font-bold text-gray-800 whitespace-nowrap ${isSidebarCollapsed ? 'hidden' : 'block'}`} style={{ width: '130px' }}>
              Survey Builder
            </div>
            <div className={`font-bold text-gray-800 ${!isSidebarCollapsed ? 'hidden' : 'block'}`}>
              SB
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`rounded-lg p-1 text-gray-500 hover:bg-gray-200 ${isSidebarCollapsed ? 'ml-2' : ''}`}
            >
              <PanelCloseIcon className={`h-6 w-6 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <nav className="flex-grow space-y-2 p-4">
            <Link
              href="/dashboard/surveys/create"
              className={`group relative flex items-center rounded-lg p-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <PlusIcon className="h-5 w-5" />
              <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>Create Survey</span>
              {isSidebarCollapsed && (
                <span className="absolute left-full ml-4 w-max rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Create Survey
                </span>
              )}
            </Link>

            <div className="pt-2">
              <Link href="/dashboard" className={`${getLinkClasses('/dashboard')} group relative`}>
                <DashboardIcon />
                <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
                {isSidebarCollapsed && (
                  <span className="absolute left-full ml-4 w-max rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Dashboard
                  </span>
                )}
              </Link>
              <Link href="/dashboard/surveys" className={`${getLinkClasses('/dashboard/surveys')} group relative`}>
                <SurveyIcon />
                <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>My Surveys</span>
                {isSidebarCollapsed && (
                  <span className="absolute left-full ml-4 w-max rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    My Surveys
                  </span>
                )}
              </Link>
              <Link href="/dashboard/responses" className={`${getLinkClasses('/dashboard/responses')} group relative`}>
                <ResponsesIcon />
                <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>Responses</span>
                {isSidebarCollapsed && (
                  <span className="absolute left-full ml-4 w-max rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Responses
                  </span>
                )}
              </Link>
            </div>
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className={`group relative flex w-full items-center rounded-lg p-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <LogoutIcon />
              <span className={`ml-3 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>Logout</span>
              {isSidebarCollapsed && (
                <span className="absolute left-full ml-4 w-max rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'pl-20' : 'pl-64'}`}>
        <header className={`bg-white/60 backdrop-blur-sm py-4 px-6 flex items-center justify-between fixed top-0 right-0 z-20 transition-all duration-300 ${isSidebarCollapsed ? 'left-20' : 'left-64'}`}>
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className="p-1 rounded-full text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <MenuIcon />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 ml-2">Dashboard</h2>
          </div>
          
          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-medium">{user.email}</span>
              <ChevronDownIcon />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                <div className="px-4 py-2 text-xs text-gray-500">
                  Signed in as
                  <div className="font-medium text-gray-900 truncate">{user.email}</div>
                </div>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogoutIcon />
                  <span className="ml-2">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </header>
        
        <main className="p-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
} 