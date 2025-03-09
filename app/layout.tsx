import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/auth-provider";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: "swap",
  variable: '--font-poppins',
});

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: "swap",
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Dating Wrapped - Your Dating Year in Review",
  description: "Track your dating life and get beautiful animated visualizations of your dating patterns and statistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-brand-pink-100/80 via-brand-lavender-50/60 to-brand-mint-100/80 font-inter">
        <div className="fixed inset-0 bg-[url('/images/noise.svg')] opacity-5 z-0 pointer-events-none"></div>
        <AuthProvider>
          <div className="relative z-10">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
