import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/auth-provider";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" className={poppins.className}>
      <body className="min-h-screen bg-gradient-to-br from-brand-pink-100 via-white to-brand-mint-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
