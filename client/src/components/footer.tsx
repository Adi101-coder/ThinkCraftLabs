import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="bg-black text-white py-12 sm:py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Large Company Name */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none">
            THINKCRAFT
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm max-w-md">
              Sign up for our design updates, 3D printing insights, and innovation newsletters.
            </p>
            <p className="text-gray-500 text-xs hidden lg:block">
              "Innovation through precision" — ThinkCraft Lab
            </p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mb-12 sm:mb-16">
          <form onSubmit={handleSubmit} className="flex items-center border-b border-gray-700 pb-2 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email address"
              className="bg-transparent text-white placeholder-gray-500 flex-1 outline-none text-base sm:text-lg"
              required
            />
            <button
              type="submit"
              className="text-gray-400 hover:text-white transition-colors ml-4 text-base sm:text-lg"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Locations */}
          <div>
            <h3 className="text-white font-medium mb-4">Bareilly</h3>
            <div className="text-gray-400 text-sm space-y-1">
              <p>Civil Lines Area</p>
              <p>Bareilly, UP 243001</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Delhi</h3>
            <div className="text-gray-400 text-sm space-y-1">
              <p>Connaught Place</p>
              <p>New Delhi, DL 110001</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Mumbai</h3>
            <div className="text-gray-400 text-sm space-y-1">
              <p>Bandra West</p>
              <p>Mumbai, MH 400050</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-medium mb-4">ThinkCraft</h3>
            <div className="space-y-2">
              <button 
                onClick={() => scrollToSection('hero')}
                className="block text-gray-400 hover:text-white transition-colors text-sm text-left"
              >
                Work
              </button>
              <button 
                onClick={() => scrollToSection('text-reveal')}
                className="block text-gray-400 hover:text-white transition-colors text-sm text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('three-steps-process')}
                className="block text-gray-400 hover:text-white transition-colors text-sm text-left"
              >
                Services
              </button>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Catalog
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Careers
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Socials</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                LinkedIn
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Behance
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                YouTube
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500 space-y-4 sm:space-y-0 mb-6">
          <div className="flex flex-wrap">
            <a href="#" className="hover:text-gray-300 transition-colors break-all">
              https://www.thinkcraftlab.com
            </a>
          </div>
          <div className="flex space-x-4 sm:space-x-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms
            </a>
          </div>
        </div>

        {/* Made by Credit */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <p className="text-xs text-gray-500">
            Made by <a href="https://x.com/adit_katiyar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Adit Katiyar</a>
          </p>
          <a 
            href="https://x.com/adit_katiyar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <span className="text-xs">Connect on</span>
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
