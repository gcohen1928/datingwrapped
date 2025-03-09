'use client';

import Link from "next/link";
import { FaHeart, FaChartPie, FaTable, FaShare } from "react-icons/fa";
import { useAuth } from "./providers/auth-provider";
import { useEffect, useState } from "react";
import NavBar from "./components/nav-bar";
import HeroSection from "./components/hero-section";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);

    // Track mouse position for interactive elements
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Use the NavBar component which will handle auth state */}
      <NavBar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <HeroSection />
        
        {/* Features Preview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="features">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-purple-900">
              Everything You Need to Track Your Dating Life
            </h2>
            <p className="text-lg text-purple-700 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you log, analyze, and share your dating experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="pt-10 pb-5 px-2">
              <div className="relative flex-shrink-0 w-full p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100 text-pink-900 shadow-lg backdrop-blur-sm hover:-translate-y-2 transition-all duration-300">
                <div className="mb-6 inline-flex items-center justify-center p-3 rounded-2xl bg-pink-200">
                  <div className="text-pink-700">
                    <FaTable className="text-2xl" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Excel-Like Interface</h3>
                <p className="text-lg opacity-80 mb-6">
                  Log your dates in an intuitive spreadsheet-like interface. Track names, platforms, costs, ratings, and outcomes.
                </p>
                <div className="inline-flex items-center text-sm font-medium">
                  <span className="text-pink-700">Learn more</span>
                  <svg className="ml-1 w-4 h-4 text-pink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="pt-10 pb-5 px-2">
              <div className="relative flex-shrink-0 w-full p-8 rounded-3xl bg-gradient-to-br from-lavender-50 to-lavender-100 text-lavender-900 shadow-lg backdrop-blur-sm hover:-translate-y-2 transition-all duration-300">
                <div className="mb-6 inline-flex items-center justify-center p-3 rounded-2xl bg-lavender-200">
                  <div className="text-lavender-700">
                    <FaChartPie className="text-2xl" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Interactive Stats</h3>
                <p className="text-lg opacity-80 mb-6">
                  Visualize your dating data with beautiful 3D charts. Discover patterns and get insights about your dating life.
                </p>
                <div className="inline-flex items-center text-sm font-medium">
                  <span className="text-lavender-700">Learn more</span>
                  <svg className="ml-1 w-4 h-4 text-lavender-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="pt-10 pb-5 px-2">
              <div className="relative flex-shrink-0 w-full p-8 rounded-3xl bg-gradient-to-br from-mint-50 to-mint-100 text-mint-900 shadow-lg backdrop-blur-sm hover:-translate-y-2 transition-all duration-300">
                <div className="mb-6 inline-flex items-center justify-center p-3 rounded-2xl bg-mint-200">
                  <div className="text-mint-700">
                    <FaShare className="text-2xl" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Shareable Slideshow</h3>
                <p className="text-lg opacity-80 mb-6">
                  Create a Spotify Wrapped-style animated slideshow to share your dating year with friends.
                </p>
                <div className="inline-flex items-center text-sm font-medium">
                  <span className="text-mint-700">Learn more</span>
                  <svg className="ml-1 w-4 h-4 text-mint-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-3xl shadow-lg my-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-purple-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 relative">
                <span className="absolute -top-2 -right-2 h-8 w-8 bg-pink-500 rounded-full text-white flex items-center justify-center font-bold">1</span>
                <FaTable className="text-pink-700 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-pink-900">Enter Your Data</h3>
              <p className="text-pink-700">
                Log your dates in our easy-to-use table interface. Add details about cost, duration, platform, and more.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-lavender-100 rounded-full flex items-center justify-center mb-4 relative">
                <span className="absolute -top-2 -right-2 h-8 w-8 bg-lavender-500 rounded-full text-white flex items-center justify-center font-bold">2</span>
                <FaChartPie className="text-lavender-700 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-lavender-900">View Your Stats</h3>
              <p className="text-lavender-700">
                Get instant analytics on your dating patterns, preferences, success rates, and spending habits.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-mint-100 rounded-full flex items-center justify-center mb-4 relative">
                <span className="absolute -top-2 -right-2 h-8 w-8 bg-mint-500 rounded-full text-white flex items-center justify-center font-bold">3</span>
                <FaShare className="text-mint-700 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-mint-900">Generate & Share</h3>
              <p className="text-mint-700">
                Create a beautiful animated slideshow of your dating year and share it with friends or export as PDF.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-purple-500">
          © {new Date().getFullYear()} Dating Wrapped. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
