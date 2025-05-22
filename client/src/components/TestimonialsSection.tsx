import { useState } from "react";
import { useInView } from "./ScrollToTop";

interface Testimonial {
  name: string;
  position: string;
  hotel: string;
  location: string;
  brand: string;
  image: string;
  quote: string;
  rating: number;
}

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const testimonials: Testimonial[] = [
    {
      name: "Rajesh Sharma",
      position: "Owner",
      hotel: "Seaside Luxury Resort",
      location: "Worli, Mumbai",
      brand: "Sunday Hotels",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      quote:
        "Converting our property to Sunday Hotels was the best decision. Our revenue increased by 45% in just six months, and our guests love the 5-star experience. The team at OYO handled everything from training staff to upgrading our amenities.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      position: "Director",
      hotel: "Metro Heights",
      location: "Andheri East, Mumbai",
      brand: "OYO Townhouse Oak",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      quote:
        "The Townhouse Oak branding and superior booking system elevated our property's status. Young professionals love the stylish spaces, and our occupancy rates have increased to 82%. The self-operated model means we maintain consistent quality.",
      rating: 5,
    },
    {
      name: "Vikram Singh",
      position: "CEO",
      hotel: "Bayview Business Suites",
      location: "Kurla, Mumbai",
      brand: "OYO Collection O",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      quote:
        "As a business hotel operator, I was skeptical about partnering with OYO. The Collection O self-operated model convinced us, and we've seen a 38% increase in corporate bookings. The seamless operations and standardized quality ensure our business guests keep returning.",
      rating: 4,
    },
    {
      name: "Anjali Mehta",
      position: "Managing Partner",
      hotel: "Millennial Nest",
      location: "Goregaon, Mumbai",
      brand: "OYO Townhouse",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      quote:
        "Our property was struggling to attract the younger demographic until we converted to OYO Townhouse. The community spaces, in-room technology, and signature café have transformed our business completely. The self-operated model ensures consistent guest experience.",
      rating: 5,
    },
    {
      name: "Rohan Kapoor",
      position: "Owner",
      hotel: "Serene Retreat",
      location: "Palghar, Mumbai Region",
      brand: "OYO Palette",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      quote:
        "Converting our resort to OYO Palette has given us a distinct identity in the premium leisure segment. The unique dining experiences and stylish spaces have attracted high-value customers. The self-operated model allows us to maintain our resort's character while benefiting from OYO's reach.",
      rating: 5,
    },
  ];

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i < rating ? "text-[#d4af37]" : "text-gray-400"}`}
        ></i>
      );
    }
    return stars;
  };

  const animationClass = inView ? "animate-fade-in" : "opacity-0";

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-24 relative"
    >
      <div
        className="absolute inset-0 parallax"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')",
          opacity: 0.15,
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center max-w-2xl mx-auto px-4 mb-12 md:mb-16 ${animationClass}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4 md:mb-6 text-[#d4af37]">
            Mumbai Success Stories
          </h2>
          <p className="text-base md:text-lg text-gray-300 font-montserrat">
            Hear from our Mumbai partners who have experienced the OYO self-operated brand advantage
          </p>
          <div className="h-1 w-32 md:w-40 gold-gradient mx-auto mt-6 md:mt-8 rounded-full"></div>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div id="testimonial-carousel" className={`relative ${animationClass} delay-200`}>
            {/* Current Testimonial */}
            <div className="testimonial-slide glass-effect rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 md:mb-0 md:mr-4 mx-auto md:mx-0 border-2 border-[#d4af37]">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-playfair">
                    {testimonials[activeIndex].name}
                  </h3>
                  <p className="text-gray-300 font-montserrat text-xs sm:text-sm">
                    {testimonials[activeIndex].position}, {testimonials[activeIndex].hotel}
                  </p>
                  <div className="flex flex-wrap items-center mt-1 justify-center md:justify-start">
                    <span className="text-[#d4af37] font-montserrat text-xs sm:text-sm font-semibold mr-2">
                      {testimonials[activeIndex].brand}
                    </span>
                    <span className="text-gray-400 font-montserrat text-xs">
                      • {testimonials[activeIndex].location}
                    </span>
                  </div>
                </div>
                <div className="ml-auto text-[#d4af37] hidden md:block">
                  <i className="fas fa-quote-right text-3xl sm:text-4xl opacity-50"></i>
                </div>
              </div>
              <p className="text-gray-300 font-montserrat text-sm sm:text-base md:text-lg italic mb-4 md:mb-6 border-l-2 sm:border-l-4 border-[#d4af37] pl-3 sm:pl-4">
                "{testimonials[activeIndex].quote}"
              </p>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <div className="flex text-[#d4af37] text-sm sm:text-base">
                  {renderStars(testimonials[activeIndex].rating)}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0f172a] border border-[#d4af37] flex items-center justify-center text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-[#0f172a]"
                    aria-label="Previous testimonial"
                  >
                    <i className="fas fa-chevron-left text-sm sm:text-base"></i>
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0f172a] border border-[#d4af37] flex items-center justify-center text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-[#0f172a]"
                    aria-label="Next testimonial"
                  >
                    <i className="fas fa-chevron-right text-sm sm:text-base"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeIndex ? "bg-[#d4af37]" : "bg-gray-400"
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
