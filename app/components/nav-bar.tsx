'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHeart, FaChartBar, FaFilm, FaCog, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../providers/auth-provider';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) return null;

  // Show a loading indicator while checking auth
  if (isLoading) {
    return (
      <nav className="bg-white shadow-md dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FaSpinner className="animate-spin h-5 w-5 text-brand-lavender-500" />
              <span className="ml-2 text-gray-600">Loading...</span>
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
    { href: '/dashboard', label: 'Data Entry', icon: <FaHeart className="mr-2" /> },
    { href: '/stats', label: 'Stats', icon: <FaChartBar className="mr-2" /> },
    { href: '/wrapped', label: 'Wrapped', icon: <FaFilm className="mr-2" /> },
    { href: '/settings', label: 'Settings', icon: <FaCog className="mr-2" /> },
  ];

  // If not authenticated, show a minimal navbar with login/signup links
  if (!user) {
    return (
      <nav className="bg-white shadow-md dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <FaHeart className="h-8 w-8 text-brand-pink-500" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-brand-pink-500 via-brand-lavender-500 to-brand-mint-500 text-transparent bg-clip-text">
                  Dating Wrapped
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-brand-lavender-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lavender-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Login
              </Link>
              <Link 
                href="/auth/signup"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-lavender-500 hover:bg-brand-lavender-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lavender-500 dark:bg-brand-lavender-600 dark:hover:bg-brand-lavender-700"
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
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <FaHeart className="h-8 w-8 text-brand-pink-500" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-brand-pink-500 via-brand-lavender-500 to-brand-mint-500 text-transparent bg-clip-text">
                  Dating Wrapped
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-brand-lavender-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
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
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-brand-lavender-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lavender-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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
                  ? 'bg-brand-lavender-50 border-brand-lavender-500 text-brand-lavender-700 border-l-4 dark:bg-gray-700 dark:text-white'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 border-l-4 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="flex w-full items-center px-3 py-2 text-base font-medium border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 border-l-4 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <FaSignOutAlt className="mr-2" />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
} 