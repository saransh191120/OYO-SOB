import { useState } from "react";
import { useInView } from "./ScrollToTop";

interface FormData {
  name: string;
  email: string;
  hotelName: string;
  location: string;
  rooms: string;
  brandPreference: string;
  message: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    hotelName: "",
    location: "",
    rooms: "",
    brandPreference: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, we would send this data to a server
    console.log("Form submitted:", formData);
    // Show success message
    setSubmitted(true);
    // Reset form
    setFormData({
      name: "",
      email: "",
      hotelName: "",
      location: "",
      rooms: "",
      brandPreference: "",
      message: "",
    });
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const animationClass = inView ? "animate-fade-in" : "opacity-0";

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 bg-gradient-to-b from-[#1a2442] to-[#0f172a]"
    >
      <div className="container mx-auto px-4">
        <div className={`text-center max-w-2xl mx-auto mb-16 ${animationClass}`}>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#d4af37]">
            Partner With OYO
          </h2>
          <p className="text-lg text-gray-300 font-montserrat">
            Interested in joining OYO's self-operated hotel brands in Mumbai? Connect with our partnership team today.
          </p>
          <div className="h-1 w-40 gold-gradient mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className={`glass-effect rounded-xl p-8 shadow-2xl ${animationClass} delay-200`}>
            <h3 className="text-2xl font-playfair font-bold text-white mb-6">
              Contact Our Partnership Team
            </h3>
            {submitted ? (
              <div className="bg-green-600 bg-opacity-20 border border-green-500 text-green-400 p-4 rounded-lg mb-6">
                Thank you for your interest in OYO's self-operated brands. Our team will contact you shortly!
              </div>
            ) : null}
            <form id="contactForm" onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2 font-montserrat"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2 font-montserrat"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                  placeholder="your@email.com"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="hotelName"
                  className="block text-sm font-medium text-gray-300 mb-2 font-montserrat"
                >
                  Hotel/Property Name
                </label>
                <input
                  type="text"
                  id="hotelName"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                  placeholder="Your Hotel Name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-300 mb-2 font-montserrat"
                  >
                    Location in Mumbai
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                    placeholder="e.g., Andheri, Worli"
                  />
                </div>
                <div>
                  <label
                    htmlFor="rooms"
                    className="block text-sm font-medium text-gray-300 mb-2 font-montserrat"
                  >
                    Number of Rooms
                  </label>
                  <input
                    type="number"
                    id="rooms"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                    placeholder="e.g., 20"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="brandPreference"
                  className="block text-sm font-medium text-gray-300 mb-2 font-montserrat"
                >
                  Preferred OYO Brand
                </label>
                <select
                  id="brandPreference"
                  name="brandPreference"
                  value={formData.brandPreference}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                >
                  <option value="">Select a Brand</option>
                  <option value="sunday">Sunday Hotels (5-star luxury)</option>
                  <option value="palette">OYO Palette (Premium resorts)</option>
                  <option value="clubhouse">OYO Clubhouse (Resort-style)</option>
                  <option value="townhouse">OYO Townhouse (Millennial focused)</option>
                  <option value="townhouse-oak">OYO Townhouse Oak (Upscale)</option>
                  <option value="collection-o">OYO Collection O (Business hotels)</option>
                  <option value="not-sure">Not sure / Need guidance</option>
                </select>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2 font-montserrat"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                  placeholder="Tell us about your property and partnership goals..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#d4af37] text-[#0f172a] font-bold rounded-full transition-all hover:bg-opacity-90 font-montserrat"
              >
                <i className="fas fa-paper-plane mr-2"></i>Submit Partnership Inquiry
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className={animationClass + " delay-400"}>
            {/* Hotel Exterior Image */}
            <div className="rounded-xl overflow-hidden mb-8">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80"
                alt="OYO Mumbai Hotel Exterior"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="glass-effect rounded-xl p-8 shadow-2xl">
              <h3 className="text-2xl font-playfair font-bold text-white mb-6">
                Mumbai Partnership Office
              </h3>
              <div className="space-y-4 font-montserrat">
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt text-[#d4af37] mt-1 mr-4"></i>
                  <p className="text-gray-300">
                    OYO Mumbai Partner Center
                    <br />
                    Andheri East, Mumbai
                    <br />
                    Maharashtra, India
                  </p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-phone text-[#d4af37] mr-4"></i>
                  <p className="text-gray-300">+91 9373395733</p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-[#d4af37] mr-4"></i>
                  <p className="text-gray-300">saransh.chaurasia@oyorooms.com</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-lg font-playfair font-bold text-white mb-3">Why Partner With OYO?</h4>
                  <ul className="space-y-2 text-gray-300 font-montserrat">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-[#d4af37] mt-1 mr-3"></i>
                      <span>Access to OYO's global booking platform</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-[#d4af37] mt-1 mr-3"></i>
                      <span>Premium brand association and marketing</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-[#d4af37] mt-1 mr-3"></i>
                      <span>Operational excellence and revenue optimization</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-[#d4af37] mt-1 mr-3"></i>
                      <span>Dedicated support for Mumbai properties</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex items-center mt-6 space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0f172a] transition-all hover:bg-opacity-90"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0f172a] transition-all hover:bg-opacity-90"
                    aria-label="Twitter"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0f172a] transition-all hover:bg-opacity-90"
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0f172a] transition-all hover:bg-opacity-90"
                    aria-label="LinkedIn"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
