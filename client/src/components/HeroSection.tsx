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
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0000] via-[#660000]/80 to-[#0a0000] bg-opacity-90"></div>
      <div className="container mx-auto px-6 z-10 py-32 md:py-0">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6 inline-block animate-zoom-in relative">
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-[#660000] via-[#990000] to-[#660000] opacity-75 blur-md animate-shimmer"></div>
            <div className="relative bg-[#0a0000]/50 p-3 rounded-lg backdrop-blur-sm">
              <span className="text-4xl md:text-6xl font-playfair font-bold text-[#cc0000] tracking-wider animate-blood-glow">OYO</span>
              <span className="text-3xl md:text-5xl font-playfair font-semibold text-white ml-2 text-shadow-lg">Self-Operated Brands</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 text-white leading-tight animate-slide-left delay-200 drop-shadow-[0_4px_8px_rgba(0,0,0,1)] text-shadow-strong glow-text-white">
            Mumbai's Premium Hotel Collection
          </h1>
          <p className="text-xl md:text-2xl font-montserrat text-white mb-10 animate-slide-right delay-400 bg-[#0a0000]/30 p-4 rounded-lg backdrop-blur-sm inline-block">
            Discover OYO's exclusive self-operated hotel brands designed for luxury, comfort, and exceptional experiences
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 animate-fade-in delay-600">
            <button
              onClick={scrollToCalculator}
              className="px-10 py-5 bg-gradient-to-r from-[#cc0000] to-[#990000] text-white font-montserrat font-bold rounded-full transition-all hover:shadow-2xl hover:shadow-[#cc0000]/60 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000] to-[#cc0000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative z-10 flex items-center justify-center">
                <i className="fas fa-calculator mr-3 animate-pulse"></i>
                <span className="animate-blood-glow">Explore Revenue Potential</span>
              </span>
            </button>
            <button
              onClick={scrollToContact}
              className="px-12 py-6 bg-gradient-to-r from-[#8B0000] via-[#DC143C] to-[#8B0000] text-white font-montserrat font-black text-lg rounded-full transition-all hover:shadow-2xl hover:shadow-[#DC143C]/80 transform hover:-translate-y-3 hover:scale-110 relative overflow-hidden group animate-pulse border-2 border-[#FF6B6B] glow-border"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF1744] to-[#FF6B6B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center animate-shimmer"></div>
              <span className="relative z-10 flex items-center justify-center drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                <i className="fas fa-handshake mr-3 animate-bounce text-xl"></i>
                <span className="tracking-wide animate-blood-glow">PARTNER WITH US NOW</span>
              </span>
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
          className="text-[#cc0000] animate-bounce inline-block hover:text-white transition-colors"
          aria-label="Scroll to calculator"
        >
          <i className="fas fa-chevron-down text-2xl animate-blood-glow"></i>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
