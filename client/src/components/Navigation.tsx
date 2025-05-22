import { useState, useEffect } from "react";

interface NavigationProps {
  activeSection: string;
}

const Navigation = ({ activeSection }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect on navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      closeMenu();
    }
  };

  const navbarClass = isScrolled
    ? "fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#1a0505] bg-opacity-90 red-glow"
    : "fixed top-0 left-0 w-full z-50 transition-all duration-300 glass-effect";

  return (
    <nav id="navbar" className={navbarClass}>
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-[#e31041] font-playfair text-2xl sm:text-3xl font-bold mr-1 sm:mr-2 animate-pulse">OYO</span>
          <span className="text-white font-playfair text-xl sm:text-2xl">Premium</span>
        </div>
        <div className="hidden md:flex space-x-4 lg:space-x-8 font-montserrat text-sm lg:text-base">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
            className={`nav-item transition-all hover:text-[#e31041] ${activeSection === "home" ? "text-[#e31041]" : "text-white"}`}
          >
            Home
          </a>
          <a
            href="#calculator"
            onClick={(e) => { e.preventDefault(); scrollToSection("calculator"); }}
            className={`nav-item transition-all hover:text-[#e31041] ${activeSection === "calculator" ? "text-[#e31041]" : "text-white"}`}
          >
            Calculator
          </a>
          <a
            href="#features"
            onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}
            className={`nav-item transition-all hover:text-[#e31041] ${activeSection === "features" ? "text-[#e31041]" : "text-white"}`}
          >
            Features
          </a>
          <a
            href="#testimonials"
            onClick={(e) => { e.preventDefault(); scrollToSection("testimonials"); }}
            className={`nav-item transition-all hover:text-[#e31041] ${activeSection === "testimonials" ? "text-[#e31041]" : "text-white"}`}
          >
            Testimonials
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
            className={`nav-item transition-all hover:text-[#e31041] ${activeSection === "contact" ? "text-[#e31041]" : "text-white"}`}
          >
            Contact
          </a>
        </div>
        <div className="md:hidden">
          <button 
            id="mobile-menu-button" 
            onClick={toggleMenu}
            className="text-[#e31041] p-1 transition-colors"
            aria-label="Toggle menu"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div id="mobile-menu" className={`md:hidden bg-[#1a0505] bg-opacity-95 px-4 py-2 border-t border-[#cc0f35]/30 ${isOpen ? '' : 'hidden'} red-glow`}>
        <div className="flex flex-col space-y-1 font-montserrat py-3">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
            className={`nav-item transition-all hover:text-[#e31041] py-3 border-b border-[#cc0f35]/30 flex items-center ${activeSection === "home" ? "text-[#e31041]" : "text-white"}`}
          >
            <i className="fas fa-home mr-3 w-5 text-center text-[#e31041]"></i> Home
          </a>
          <a
            href="#calculator"
            onClick={(e) => { e.preventDefault(); scrollToSection("calculator"); }}
            className={`nav-item transition-all hover:text-[#e31041] py-3 border-b border-[#cc0f35]/30 flex items-center ${activeSection === "calculator" ? "text-[#e31041]" : "text-white"}`}
          >
            <i className="fas fa-calculator mr-3 w-5 text-center text-[#e31041]"></i> Calculator
          </a>
          <a
            href="#features"
            onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}
            className={`nav-item transition-all hover:text-[#e31041] py-3 border-b border-[#cc0f35]/30 flex items-center ${activeSection === "features" ? "text-[#e31041]" : "text-white"}`}
          >
            <i className="fas fa-star mr-3 w-5 text-center text-[#e31041]"></i> Features
          </a>
          <a
            href="#testimonials"
            onClick={(e) => { e.preventDefault(); scrollToSection("testimonials"); }}
            className={`nav-item transition-all hover:text-[#e31041] py-3 border-b border-[#cc0f35]/30 flex items-center ${activeSection === "testimonials" ? "text-[#e31041]" : "text-white"}`}
          >
            <i className="fas fa-quote-right mr-3 w-5 text-center text-[#e31041]"></i> Testimonials
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
            className={`nav-item transition-all hover:text-[#e31041] py-3 flex items-center ${activeSection === "contact" ? "text-[#e31041]" : "text-white"}`}
          >
            <i className="fas fa-envelope mr-3 w-5 text-center text-[#e31041]"></i> Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
