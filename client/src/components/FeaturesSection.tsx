import { useInView } from "./ScrollToTop";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
  image: string;
  imageAlt: string;
  delay: string;
  inView: boolean;
};

const FeatureCard = ({
  title,
  description,
  icon,
  image,
  imageAlt,
  delay,
  inView,
}: FeatureCardProps) => {
  const animationClass = inView ? `animate-fade-in ${delay}` : "opacity-0";

  return (
    <div className={`feature-card glass-effect rounded-xl overflow-hidden shadow-2xl ${animationClass}`}>
      <div className="h-64 overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center mb-4">
          <i className={`${icon} text-[#0f172a] text-xl`}></i>
        </div>
        <h3 className="text-2xl font-playfair font-bold text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-300 font-montserrat">{description}</p>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const features = [
    {
      title: "Luxury Pools",
      description:
        "Indulge in our temperature-controlled infinity pools with panoramic views and premium poolside service.",
      icon: "fas fa-swimming-pool",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "Luxury Hotel Swimming Pool",
      delay: "delay-200",
    },
    {
      title: "Premium Suites",
      description:
        "Experience unparalleled comfort in our meticulously designed suites with premium amenities and personalized service.",
      icon: "fas fa-bed",
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "Luxury Hotel Room",
      delay: "delay-400",
    },
    {
      title: "Fine Dining",
      description:
        "Savor exquisite cuisine crafted by renowned chefs in an elegant atmosphere with impeccable service.",
      icon: "fas fa-utensils",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "Luxury Hotel Dining",
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
        <div className={`text-center max-w-2xl mx-auto mb-16 ${headerAnimation}`}>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#d4af37]">
            Premium Features
          </h2>
          <p className="text-lg text-gray-300 font-montserrat">
            Experience the luxury and exclusive amenities that set OYO Premium
            hotels apart.
          </p>
          <div className="h-1 w-40 gold-gradient mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
