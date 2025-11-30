import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EverNurse CV Matcher',
  description: 'AI-powered CV matching system for healthcare recruitment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-blue-600">
                    EverNurse CV Matcher
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/upload" className="text-gray-600 hover:text-blue-600">
                    Upload CVs
                  </a>
                  <a href="/jobs" className="text-gray-600 hover:text-blue-600">
                    Jobs
                  </a>
                  <a href="/results" className="text-gray-600 hover:text-blue-600">
                    Results
                  </a>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}