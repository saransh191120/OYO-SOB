import { useState } from "react";
import { useInView } from "./ScrollToTop";

interface Testimonial {
  name: string;
  position: string;
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
      position: "Owner, Rajasthan Palace",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      quote:
        "Partnering with OYO Premium transformed our boutique hotel. Our revenue increased by 45% in just six months, and the SOB calculator helped us forecast accurately.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      position: "Director, Hill View Resort",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      quote:
        "The premium branding and superior booking system elevated our property's status. Our occupancy rates have never been better, and the revenue calculator is remarkably accurate.",
      rating: 5,
    },
    {
      name: "Vikram Singh",
      position: "CEO, Luxury Stays Group",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      quote:
        "As a premium hotel chain, we were skeptical about partnering with OYO. The SOB model convinced us, and we've seen a 38% increase in our revenue streams across all properties.",
      rating: 4,
    },
  ];

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
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
        <div className={`text-center max-w-2xl mx-auto mb-16 ${animationClass}`}>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#d4af37]">
            What Hoteliers Say
          </h2>
          <p className="text-lg text-gray-300 font-montserrat">
            Hear from our partners who have experienced the OYO Premium advantage.
          </p>
          <div className="h-1 w-40 gold-gradient mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div id="testimonial-carousel" className={`relative ${animationClass} delay-200`}>
            {/* Current Testimonial */}
            <div className="testimonial-slide glass-effect rounded-xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-playfair">
                    {testimonials[activeIndex].name}
                  </h3>
                  <p className="text-[#d4af37] font-montserrat">
                    {testimonials[activeIndex].position}
                  </p>
                </div>
                <div className="ml-auto text-[#d4af37]">
                  <i className="fas fa-quote-right text-4xl opacity-50"></i>
                </div>
              </div>
              <p className="text-gray-300 font-montserrat text-lg italic mb-6">
                "{testimonials[activeIndex].quote}"
              </p>
              <div className="flex text-[#d4af37]">
                {renderStars(testimonials[activeIndex].rating)}
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
