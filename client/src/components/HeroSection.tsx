import { useEffect, useRef } from "react";

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);

  // Scroll to Calculator section
  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById("calculator");
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to Contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add fade-in animation on component mount
  useEffect(() => {
    const animateElements = heroRef.current?.querySelectorAll(".animate-fade-in");
    
    if (animateElements) {
      animateElements.forEach((element) => {
        element.classList.add("opacity-100");
      });
    }
  }, []);

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="min-h-screen relative flex items-center justify-center parallax"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a0505] via-[#cc0f35]/70 to-[#1a0505] bg-opacity-80"></div>
      <div className="container mx-auto px-6 z-10 py-32 md:py-0">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-4 inline-block animate-zoom-in relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#cc0f35] via-[#e31041] to-[#cc0f35] opacity-75 blur animate-shimmer"></div>
            <div className="relative">
              <span className="text-4xl md:text-6xl font-playfair font-bold text-[#e31041] tracking-wider animate-pulse-red">OYO</span>
              <span className="text-3xl md:text-5xl font-playfair font-semibold text-white ml-2">Self-Operated Brands</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 text-white leading-tight animate-slide-left delay-200">
            Mumbai's Premium Hotel Collection
          </h1>
          <p className="text-xl md:text-2xl font-montserrat text-gray-200 mb-10 animate-slide-right delay-400">
            Discover OYO's exclusive self-operated hotel brands designed for luxury, comfort, and exceptional experiences
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 animate-fade-in delay-600">
            <button
              onClick={scrollToCalculator}
              className="px-8 py-4 bg-gradient-to-r from-[#cc0f35] to-[#e31041] text-white font-montserrat font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-[#e31041]/50 transform hover:-translate-y-1 red-glow"
            >
              Explore Revenue Potential
            </button>
            <button
              onClick={scrollToContact}
              className="px-8 py-4 border-2 border-[#e31041] text-white font-montserrat font-semibold rounded-full transition-all hover:bg-[#e31041]/20 hover:shadow-lg transform hover:-translate-y-1"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <a
          href="#calculator"
          onClick={(e) => {
            e.preventDefault();
            scrollToCalculator();
          }}
          className="text-[#e31041] animate-bounce inline-block hover:text-white transition-colors"
          aria-label="Scroll to calculator"
        >
          <i className="fas fa-chevron-down text-2xl animate-pulse-red"></i>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
