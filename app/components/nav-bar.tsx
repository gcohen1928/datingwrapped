'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaFilm, FaCog, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import { useAuth } from '../providers/auth-provider';
import { useEffect, useState } from 'react';
import Logo from './logo';
import LoadingSpinner from './loading-spinner';

export default function NavBar() {
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) return null;

  // Shared navbar style for all states
  const navbarStyle = "fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/30 border-b border-white/20";

  // Show a loading indicator while checking auth
  if (isLoading) {
    return (
      <nav className={navbarStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Logo href="/" />
            </div>
            <div className="flex items-center">
              <LoadingSpinner size="sm" color="#9370DB" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // If in development, log the auth state
  if (process.env.NODE_ENV === 'development' && user) {
    console.log('NavBar rendering with user:', user.id.substring(0, 8) + '...');
  }

  const navItems = [
    { href: '/your-dates', label: 'Data Entry', icon: <FaHeart className="mr-2" /> },
    { href: '/stats', label: 'Stats', icon: <FaChartBar className="mr-2" /> },
    { href: '/wrapped', label: 'Wrapped', icon: <FaFilm className="mr-2" /> },
    { href: '/settings', label: 'Settings', icon: <FaCog className="mr-2" /> },
  ];

  // If not authenticated, show a minimal navbar with login/signup links
  if (!user) {
    return (
      <nav className={navbarStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Logo href="/" />
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-brand-lavender-700 bg-white/70 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lavender-500"
              >
                Login
              </Link>
              <Link 
                href="/auth/signup"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-lavender-400 hover:bg-brand-lavender-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lavender-500"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={navbarStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo href="/" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-brand-lavender-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={signOut}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-brand-lavender-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lavender-500"
            >
              <FaSignOutAlt className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 text-base font-medium ${
                pathname === item.href
                  ? 'bg-brand-lavender-50 border-brand-lavender-500 text-brand-lavender-700 border-l-4'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 border-l-4'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="flex w-full items-center px-3 py-2 text-base font-medium border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 border-l-4"
          >
            <FaSignOutAlt className="mr-2" />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
} 