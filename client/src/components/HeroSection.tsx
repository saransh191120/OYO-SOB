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
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 text-white leading-tight animate-slide-left delay-200 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
            Mumbai's Premium Hotel Collection
          </h1>
          <p className="text-xl md:text-2xl font-montserrat text-white mb-10 animate-slide-right delay-400 bg-[#0a0000]/30 p-4 rounded-lg backdrop-blur-sm inline-block">
            Discover OYO's exclusive self-operated hotel brands designed for luxury, comfort, and exceptional experiences
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 animate-fade-in delay-600">
            <button
              onClick={scrollToCalculator}
              className="px-8 py-4 bg-gradient-to-r from-[#660000] to-[#990000] text-white font-montserrat font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-[#990000]/50 transform hover:-translate-y-1 red-glow"
            >
              <span className="animate-blood-glow">Explore Revenue Potential</span>
            </button>
            <button
              onClick={scrollToContact}
              className="px-8 py-4 border-2 border-[#990000] text-white font-montserrat font-semibold rounded-full transition-all hover:bg-[#990000]/20 hover:shadow-lg transform hover:-translate-y-1"
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
