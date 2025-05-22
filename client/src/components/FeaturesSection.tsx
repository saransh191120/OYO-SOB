import { useInView } from "./ScrollToTop";

type BrandCardProps = {
  title: string;
  tagline: string;
  description: string;
  targetAudience: string;
  amenities: string;
  icon: string;
  image: string;
  imageAlt: string;
  delay: string;
  inView: boolean;
};

const BrandCard = ({
  title,
  tagline,
  description,
  targetAudience,
  amenities,
  icon,
  image,
  imageAlt,
  delay,
  inView,
}: BrandCardProps) => {
  const animationClass = inView ? `animate-fade-in ${delay}` : "opacity-0";

  return (
    <div className={`feature-card glass-effect rounded-xl overflow-hidden shadow-2xl h-full flex flex-col ${animationClass}`}>
      <div className="h-56 sm:h-64 overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-4 sm:p-6 flex-grow">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#cc0000] to-[#990000] flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-[#cc0000]/50">
          <i className={`${icon} text-white text-lg sm:text-xl animate-pulse`}></i>
        </div>
        <h3 className="text-xl sm:text-2xl font-playfair font-bold text-white mb-1 sm:mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {title}
        </h3>
        <p className="text-[#cc0000] font-montserrat text-xs sm:text-sm mb-2 sm:mb-3 italic font-semibold animate-blood-glow">{tagline}</p>
        <p className="text-white font-montserrat text-sm mb-3 sm:mb-4">{description}</p>
        
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
          <p className="text-white font-montserrat text-xs sm:text-sm mb-1 font-bold">Target Audience:</p>
          <p className="text-gray-300 font-montserrat text-xs sm:text-sm mb-2 sm:mb-3">{targetAudience}</p>
          
          <p className="text-white font-montserrat text-xs sm:text-sm mb-1 font-bold">Key Amenities:</p>
          <p className="text-gray-300 font-montserrat text-xs sm:text-sm">{amenities}</p>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const hotelBrands = [
    {
      title: "OYO Sunday Hotels",
      tagline: "Premium 5-star hotel chain",
      description: 
        "Luxury 4 & 5-star hotels for affluent leisure and senior executives. High potential in Mumbai with positive reviews highlighting professionalism and luxury standards.",
      targetAudience: "Affluent leisure travelers and senior executives",
      amenities: "Fine dining, spa, pools, concierge service, premium and luxurious accommodations",
      icon: "fas fa-crown",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "Luxury OYO Sunday Hotel",
      delay: "delay-200",
    },
    {
      title: "OYO Palette",
      tagline: "Premium self-operated upscale resorts",
      description:
        "Upscale resorts crafted for premium leisure, relaxing staycations, and bleisure travelers. Palghar resort serves the extended Mumbai market with promising expansion opportunities.",
      targetAudience: "Premium leisure, staycation, and bleisure travelers",
      amenities: "Inviting pools, rejuvenating spas, unique dining, and stylish spaces to unwind",
      icon: "fas fa-umbrella-beach",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "OYO Palette Resort",
      delay: "delay-400",
    },
    {
      title: "OYO Clubhouse",
      tagline: "Resort-style self-operated hotels",
      description:
        "Modern, company-serviced hotels focused on comfort and reliability. Perfect opportunity for expansion in the Mumbai market.",
      targetAudience: "Value-conscious solo travelers, couples, families, and business guests",
      amenities: "Restaurant, Wi-Fi, AC, modern decor, with pools and gyms at select locations",
      icon: "fas fa-glass-cheers",
      image:
        "https://images.unsplash.com/photo-1551516594-56cb78394645?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "OYO Clubhouse Hotel",
      delay: "delay-600",
    },
    {
      title: "OYO Townhouse",
      tagline: "Premium neighborhood hotels for millennials",
      description:
        "Smart, friendly neighborhood hotels designed for millennials. Established in Khar, Airport, Goregaon, Worli, with promising café expansions.",
      targetAudience: "Millennials, students, and young professionals who value affordability and local vibes",
      amenities: "In-room Netflix, high-speed Wi-Fi, signature cafes, and communal workspaces",
      icon: "fas fa-home",
      image:
        "https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "OYO Townhouse",
      delay: "delay-200",
    },
    {
      title: "OYO Townhouse Oak",
      tagline: "Upscale version of the Townhouse concept",
      description:
        "Premium extension offering stylish, refined experiences. Locations in Vashi, Khar, Andheri East, Kopar Khairane with growth potential.",
      targetAudience: "Discerning millennials, young professionals, corporate guests",
      amenities: "Premium finishes, gym, pools, enhanced in-room comforts, restaurants",
      icon: "fas fa-tree",
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "OYO Townhouse Oak",
      delay: "delay-400",
    },
    {
      title: "OYO Collection O",
      tagline: "Business hotels with standard amenities for corporate travelers",
      description:
        "Affordable premium features tailored for business and leisure travelers. Strong presence in Kurla, Andheri, Sanpada, Mumbai Central with growth potential.",
      targetAudience: "Value-conscious business travelers and leisure tourists",
      amenities: "AC rooms, free Wi-Fi, TV, clean linen, breakfast, 24/7 check-in available",
      icon: "fas fa-briefcase",
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "OYO Collection O",
      delay: "delay-600",
    },
  ];

  const headerAnimation = inView ? "animate-fade-in" : "opacity-0";

  return (
    <section
      id="features"
      ref={ref}
      className="py-24 bg-gradient-to-b from-[#0f172a] to-[#1a2442]"
    >
      <div className="container mx-auto px-4">
        <div className={`text-center max-w-2xl mx-auto px-4 mb-12 md:mb-16 ${headerAnimation}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4 md:mb-6 text-[#cc0000] animate-blood-glow drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]">
            Self-Operated Hotel Brands
          </h2>
          <p className="text-base md:text-lg text-white font-montserrat">
            Discover OYO's diverse portfolio of self-operated hotel brands in Mumbai,
            each designed to cater to specific customer preferences and needs.
          </p>
          <div className="h-1 w-32 md:w-40 bg-gradient-to-r from-[#660000] via-[#cc0000] to-[#660000] mx-auto mt-6 md:mt-8 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {hotelBrands.map((brand, index) => (
            <BrandCard
              key={index}
              {...brand}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
