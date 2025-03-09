'use client';

import Link from "next/link";
import { FaHeart, FaChartPie, FaTable, FaShare } from "react-icons/fa";
import { useAuth } from "./providers/auth-provider";
import { useEffect, useState } from "react";
import NavBar from "./components/nav-bar";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-t-4 border-brand-lavender-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Use the NavBar component which will handle auth state */}
      <NavBar />
      
      {/* If user is authenticated, redirect to dashboard */}
      {!isLoading && user && (
        <div className="py-6 px-4 sm:px-6 lg:px-8 bg-brand-lavender-50 border-b border-brand-lavender-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <p className="text-brand-lavender-700">
                Welcome back! You're signed in.
              </p>
              <Link href="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-pink-500 via-brand-lavender-500 to-brand-mint-500 text-transparent bg-clip-text">
              Track Your Dating Journey
            </h2>
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Log your dates, visualize your patterns, and generate beautiful animated slideshows to share with friends.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!user ? (
                <Link href="/auth/signup" className="btn-primary text-center py-3 px-8 text-lg">
                  Get Started
                </Link>
              ) : (
                <Link href="/dashboard" className="btn-primary text-center py-3 px-8 text-lg">
                  Go to Dashboard
                </Link>
              )}
              <Link href="#features" className="btn-secondary text-center py-3 px-8 text-lg">
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Features Preview */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="features">
            <div className="card hover:scale-105 border border-brand-pink-200">
              <div className="h-12 w-12 bg-brand-pink-100 rounded-full flex items-center justify-center mb-4">
                <FaTable className="text-brand-pink-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excel-Like Interface</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Log your dates in an intuitive spreadsheet-like interface. Track names, platforms, costs, ratings, and outcomes.
              </p>
            </div>
            
            <div className="card hover:scale-105 border border-brand-lavender-200">
              <div className="h-12 w-12 bg-brand-lavender-100 rounded-full flex items-center justify-center mb-4">
                <FaChartPie className="text-brand-lavender-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Stats</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize your dating data with beautiful 3D charts. Discover patterns and get insights about your dating life.
              </p>
            </div>
            
            <div className="card hover:scale-105 border border-brand-mint-200">
              <div className="h-12 w-12 bg-brand-mint-100 rounded-full flex items-center justify-center mb-4">
                <FaShare className="text-brand-mint-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Shareable Slideshow</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create a Spotify Wrapped-style animated slideshow to share your dating year with friends.
              </p>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-brand-pink-100 rounded-full flex items-center justify-center mb-4 relative">
                <span className="absolute -top-2 -right-2 h-8 w-8 bg-brand-pink-500 rounded-full text-white flex items-center justify-center font-bold">1</span>
                <FaTable className="text-brand-pink-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Your Data</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Log your dates in our easy-to-use table interface. Add details about cost, duration, platform, and more.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-brand-lavender-100 rounded-full flex items-center justify-center mb-4 relative">
                <span className="absolute -top-2 -right-2 h-8 w-8 bg-brand-lavender-500 rounded-full text-white flex items-center justify-center font-bold">2</span>
                <FaChartPie className="text-brand-lavender-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">View Your Stats</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant analytics on your dating patterns, preferences, success rates, and spending habits.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-brand-mint-100 rounded-full flex items-center justify-center mb-4 relative">
                <span className="absolute -top-2 -right-2 h-8 w-8 bg-brand-mint-500 rounded-full text-white flex items-center justify-center font-bold">3</span>
                <FaShare className="text-brand-mint-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate & Share</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create a beautiful animated slideshow of your dating year and share it with friends or export as PDF.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Dating Wrapped. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
