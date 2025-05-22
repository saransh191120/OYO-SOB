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
    ? "fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#0f172a] bg-opacity-90"
    : "fixed top-0 left-0 w-full z-50 transition-all duration-300 glass-effect";

  return (
    <nav id="navbar" className={navbarClass}>
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-[#d4af37] font-playfair text-2xl sm:text-3xl font-bold mr-1 sm:mr-2">OYO</span>
          <span className="text-white font-playfair text-xl sm:text-2xl">Premium</span>
        </div>
        <div className="hidden md:flex space-x-4 lg:space-x-8 font-montserrat text-sm lg:text-base">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
            className={`nav-item transition-all hover:text-[#d4af37] ${activeSection === "home" ? "text-[#d4af37]" : "text-white"}`}
          >
            Home
          </a>
          <a
            href="#calculator"
            onClick={(e) => { e.preventDefault(); scrollToSection("calculator"); }}
            className={`nav-item transition-all hover:text-[#d4af37] ${activeSection === "calculator" ? "text-[#d4af37]" : "text-white"}`}
          >
            Calculator
          </a>
          <a
            href="#features"
            onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}
            className={`nav-item transition-all hover:text-[#d4af37] ${activeSection === "features" ? "text-[#d4af37]" : "text-white"}`}
          >
            Features
          </a>
          <a
            href="#testimonials"
            onClick={(e) => { e.preventDefault(); scrollToSection("testimonials"); }}
            className={`nav-item transition-all hover:text-[#d4af37] ${activeSection === "testimonials" ? "text-[#d4af37]" : "text-white"}`}
          >
            Testimonials
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
            className={`nav-item transition-all hover:text-[#d4af37] ${activeSection === "contact" ? "text-[#d4af37]" : "text-white"}`}
          >
            Contact
          </a>
        </div>
        <div className="md:hidden">
          <button 
            id="mobile-menu-button" 
            onClick={toggleMenu}
            className="text-white p-1"
            aria-label="Toggle menu"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div id="mobile-menu" className={`md:hidden bg-[#0f172a] bg-opacity-95 px-4 py-2 border-t border-gray-800 ${isOpen ? '' : 'hidden'}`}>
        <div className="flex flex-col space-y-1 font-montserrat py-3">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
            className={`nav-item transition-all hover:text-[#d4af37] py-3 border-b border-gray-800 flex items-center ${activeSection === "home" ? "text-[#d4af37]" : "text-white"}`}
          >
            <i className="fas fa-home mr-3 w-5 text-center"></i> Home
          </a>
          <a
            href="#calculator"
            onClick={(e) => { e.preventDefault(); scrollToSection("calculator"); }}
            className={`nav-item transition-all hover:text-[#d4af37] py-3 border-b border-gray-800 flex items-center ${activeSection === "calculator" ? "text-[#d4af37]" : "text-white"}`}
          >
            <i className="fas fa-calculator mr-3 w-5 text-center"></i> Calculator
          </a>
          <a
            href="#features"
            onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}
            className={`nav-item transition-all hover:text-[#d4af37] py-3 border-b border-gray-800 flex items-center ${activeSection === "features" ? "text-[#d4af37]" : "text-white"}`}
          >
            <i className="fas fa-star mr-3 w-5 text-center"></i> Features
          </a>
          <a
            href="#testimonials"
            onClick={(e) => { e.preventDefault(); scrollToSection("testimonials"); }}
            className={`nav-item transition-all hover:text-[#d4af37] py-3 border-b border-gray-800 flex items-center ${activeSection === "testimonials" ? "text-[#d4af37]" : "text-white"}`}
          >
            <i className="fas fa-quote-right mr-3 w-5 text-center"></i> Testimonials
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
            className={`nav-item transition-all hover:text-[#d4af37] py-3 flex items-center ${activeSection === "contact" ? "text-[#d4af37]" : "text-white"}`}
          >
            <i className="fas fa-envelope mr-3 w-5 text-center"></i> Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
