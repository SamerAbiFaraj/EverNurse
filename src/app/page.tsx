import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-teal-50/30 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 max-w-7xl relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-evernurse-teal px-4 py-2 rounded-full text-sm font-medium mb-8 border border-teal-100">
            <span className="w-2 h-2 bg-evernurse-teal rounded-full animate-pulse-soft"></span>
            AI-Powered Healthcare Recruitment
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-evernurse-dark mb-6 tracking-tight leading-tight">
            Find the Perfect
            <br />
            <span className="text-evernurse-teal bg-clip-text">Healthcare Match</span>
          </h1>

          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed mb-12">
            Revolutionize your healthcare recruitment with our intelligent CV matching system.
            Instantly connect top medical professionals with your open positions using advanced AI technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/upload"
              className="bg-[#00A99D] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#008f85] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 group"
            >
              Start Matching CVs
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/jobs"
              className="bg-white border-2 border-gray-200 text-evernurse-dark px-8 py-4 rounded-xl font-bold text-lg hover:border-evernurse-teal hover:bg-gray-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
            >
              Manage Jobs
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-evernurse-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-evernurse-dark mb-2">10x</h3>
            <p className="text-black font-medium">Faster Matching</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-evernurse-dark mb-2">95%</h3>
            <p className="text-black font-medium">Match Accuracy</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-4xl font-bold text-evernurse-dark mb-2">24/7</h3>
            <p className="text-black font-medium">Automated Processing</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-4xl md:text-5xl font-bold text-evernurse-dark mb-4">
              How It Works
            </h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Three simple steps to find your ideal healthcare professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up group" style={{ animationDelay: '0.4s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-evernurse-teal rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-glow group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-2xl font-bold text-evernurse-dark mb-4 group-hover:text-evernurse-teal transition-colors">
                Upload CVs
              </h3>
              <p className="text-black leading-relaxed">
                Simply drag and drop candidate CVs in PDF or DOCX format. Our system processes them instantly with advanced AI parsing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up group" style={{ animationDelay: '0.5s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-2xl font-bold text-evernurse-dark mb-4 group-hover:text-blue-600 transition-colors">
                AI Matching
              </h3>
              <p className="text-black leading-relaxed">
                Our intelligent algorithm analyzes skills, experience, and qualifications to match candidates with your job positions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up group" style={{ animationDelay: '0.6s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-2xl font-bold text-evernurse-dark mb-4 group-hover:text-purple-600 transition-colors">
                Review Results
              </h3>
              <p className="text-black leading-relaxed">
                Access detailed match scores, qualified candidates, and comprehensive insights through our intuitive dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-evernurse-teal to-[#008f85] rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            Join leading healthcare facilities using EverNurse to find top talent faster and more efficiently.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-white text-evernurse-teal px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
          >
            Get Started Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
