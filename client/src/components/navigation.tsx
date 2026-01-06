import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useShop } from '@/contexts/ShopContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const navRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, wishlist } = useShop();
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  const handleHomeClick = () => {
    if (location === '/') {
      // If already on home page, scroll to hero
      scrollToSection('hero');
    } else {
      // Navigate to home page
      setLocation('/');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        ref={navRef}
        className="nav-floating absolute top-20 left-4 right-4 z-50 rounded-full px-6 py-3 hidden md:block"
        data-testid="floating-nav"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center" data-testid="logo">
            <img
              src="/logo.svg"
              alt="Think Craft Lab Logo"
              className="h-8 md:h-10 w-auto"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-8">
              <button
                onClick={handleHomeClick}
                className="nav-link text-foreground hover:text-primary transition-all duration-300 relative group px-3 py-2 rounded-lg overflow-hidden"
                data-testid="nav-home"
              >
                <span className="relative z-10">Home</span>
                <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
              <Link href="/shop">
                <button className="nav-link text-foreground hover:text-primary transition-all duration-300 relative group px-3 py-2 rounded-lg overflow-hidden cursor-pointer"
                  data-testid="nav-shop"
                >
                  <span className="relative z-10">Shop</span>
                  <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
              </Link>
              <Link href="/work">
                <button className="nav-link text-foreground hover:text-primary transition-all duration-300 relative group px-3 py-2 rounded-lg overflow-hidden cursor-pointer"
                  data-testid="nav-work"
                >
                  <span className="relative z-10">Work</span>
                  <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
              </Link>
              <Link href="/about">
                <button className="nav-link text-foreground hover:text-primary transition-all duration-300 relative group px-3 py-2 rounded-lg overflow-hidden cursor-pointer"
                  data-testid="nav-about"
                >
                  <span className="relative z-10">About Us</span>
                  <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
              </Link>
              <button
                onClick={() => scrollToSection('footer')}
                className="nav-link text-foreground hover:text-primary transition-all duration-300 relative group px-3 py-2 rounded-lg overflow-hidden"
                data-testid="nav-contact"
              >
                <span className="relative z-10">Contact</span>
                <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>

            {/* Wishlist, Cart, and Profile Icons */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              <Link href="/wishlist">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group">
                  <svg className="w-6 h-6 text-gray-700 group-hover:text-[#ff6a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6a00] text-white text-xs rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </Link>
              <Link href="/cart">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group">
                  <svg className="w-6 h-6 text-gray-700 group-hover:text-[#ff6a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6a00] text-white text-xs rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </Link>
              <Link href="/profile">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-gray-700 group-hover:text-[#ff6a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#ff6a00] transition-colors hidden xl:block">
                        {user?.username}
                      </span>
                    </div>
                  ) : (
                    <Link href="/login">
                      <span className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#ff6a00] transition-colors">
                        Sign In
                      </span>
                    </Link>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.svg"
              alt="Think Craft Lab"
              className="h-8 w-auto"
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Wishlist, Cart, and Profile Icons for Mobile */}
            <Link href="/wishlist">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </Link>
            <Link href="/cart">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </Link>
            <Link href="/profile">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff6a00] focus:ring-opacity-50"
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ease-out ${isMobileMenuOpen
                    ? 'rotate-45 translate-y-1.5 bg-[#ff6a00]'
                    : 'rotate-0 translate-y-0'
                    }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ease-out mt-1 ${isMobileMenuOpen
                    ? 'opacity-0 scale-0'
                    : 'opacity-100 scale-100'
                    }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ease-out mt-1 ${isMobileMenuOpen
                    ? '-rotate-45 -translate-y-1.5 bg-[#ff6a00]'
                    : 'rotate-0 translate-y-0'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[86vw] bg-white/95 backdrop-blur-xl border-l border-gray-100 shadow-2xl transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.svg"
                alt="Think Craft Lab"
                className="h-8 w-auto"
              />
              <span className="font-semibold text-gray-900">Think Craft Lab</span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-6 py-8">
            <nav className="space-y-2">
              <button
                onClick={handleHomeClick}
                className={`w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:text-[#ff6a00] hover:bg-orange-50 rounded-xl transition-all duration-200 transform ${isMobileMenuOpen
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-8 opacity-0'
                  }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? '0ms' : '0ms'
                }}
              >
                Home
              </button>

              <Link href="/shop">
                <span
                  className={`w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:text-[#ff6a00] hover:bg-orange-50 rounded-xl transition-all duration-200 transform block cursor-pointer ${isMobileMenuOpen
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-8 opacity-0'
                    }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? '50ms' : '0ms'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </span>
              </Link>

              <Link href="/work">
                <span
                  className={`w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:text-[#ff6a00] hover:bg-orange-50 rounded-xl transition-all duration-200 transform block cursor-pointer ${isMobileMenuOpen
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-8 opacity-0'
                    }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? '100ms' : '0ms'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Work
                </span>
              </Link>

              <Link href="/about">
                <span
                  className={`w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:text-[#ff6a00] hover:bg-orange-50 rounded-xl transition-all duration-200 transform block cursor-pointer ${isMobileMenuOpen
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-8 opacity-0'
                    }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? '150ms' : '0ms'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </span>
              </Link>

              <button
                onClick={() => scrollToSection('footer')}
                className={`w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:text-[#ff6a00] hover:bg-orange-50 rounded-xl transition-all duration-200 transform ${isMobileMenuOpen
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-8 opacity-0'
                  }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? '200ms' : '0ms'
                }}
              >
                Contact
              </button>
            </nav>
          </div>

          {/* CTA Button */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={() => scrollToSection('footer')}
              className={`w-full bg-gradient-to-r from-[#ff6a00] to-[#ff7f33] text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 transform ${isMobileMenuOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
                }`}
              style={{
                transitionDelay: isMobileMenuOpen ? '250ms' : '0ms'
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
