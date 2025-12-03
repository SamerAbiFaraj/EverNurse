import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "EverNurse CV Matcher",
  description: "AI-powered CV matching for healthcare professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans bg-gray-50 text-evernurse-text antialiased`} suppressHydrationWarning>
        <div className="flex flex-col min-h-screen">
          {/* Sticky Glassmorphic Header */}
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-[#00A99D] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-glow transition-transform group-hover:scale-105">
                  E
                </div>
                <span className="text-2xl font-bold text-evernurse-dark tracking-tight">
                  Ever<span className="text-evernurse-teal">Nurse</span>
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                <NavLink href="/upload">Upload CVs</NavLink>
                <NavLink href="/jobs">Manage Jobs</NavLink>
                <NavLink href="/results">Results Dashboard</NavLink>
              </nav>

              <button className="bg-[#333333] text-white px-6 py-2.5 rounded-full font-medium hover:bg-black transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                Contact Support
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50/50 via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="relative z-10">
              {children}
            </div>
          </main>

          {/* Premium Footer */}
          <footer className="bg-[#333333] text-white py-12 mt-auto">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-[#00A99D] rounded flex items-center justify-center text-white font-bold">E</div>
                    <span className="text-xl font-bold">EverNurse</span>
                  </div>
                  <p className="text-white max-w-md leading-relaxed">
                    Revolutionizing healthcare recruitment with AI-powered matching technology.
                    Connecting the best talent with world-class healthcare facilities.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-6 text-evernurse-teal">Quick Links</h4>
                  <ul className="space-y-3 text-white">
                    <li><Link href="/upload" className="hover:text-white transition-colors">Upload CVs</Link></li>
                    <li><Link href="/jobs" className="hover:text-white transition-colors">Job Positions</Link></li>
                    <li><Link href="/results" className="hover:text-white transition-colors">Matching Results</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-6 text-evernurse-teal">Contact</h4>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-center gap-2">
                      <span className="text-evernurse-teal">✉</span> support@evernurse.ae
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-evernurse-teal">📞</span> +971 4 123 4567
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-evernurse-teal">📍</span> Dubai Healthcare City
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-white text-sm">
                <p>© {new Date().getFullYear()} EverNurse. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-black font-medium hover:text-evernurse-teal transition-colors relative group py-2"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00A99D] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}