const Footer = () => {
  return (
    <footer className="py-12 bg-[#1a0505] border-t border-[#990000]/20 red-glow">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <span className="text-[#990000] font-playfair text-3xl font-bold mr-2 animate-pulse">OYO</span>
              <span className="text-white font-playfair text-2xl">Self-Operated</span>
            </div>
            <p className="text-gray-400 text-sm font-montserrat text-center md:text-left">
              Experience the finest self-operated hotel brands in Mumbai. Premium amenities, exceptional service, and unparalleled comfort.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-playfair text-lg mb-4 text-center md:text-left">Mumbai Brands</h4>
            <ul className="text-white text-sm space-y-2 font-montserrat text-center md:text-left">
              <li><a href="#features" className="hover:text-[#cc0000] transition-colors">Sunday Hotels</a></li>
              <li><a href="#features" className="hover:text-[#cc0000] transition-colors">OYO Palette</a></li>
              <li><a href="#features" className="hover:text-[#cc0000] transition-colors">OYO Clubhouse</a></li>
              <li><a href="#features" className="hover:text-[#cc0000] transition-colors">OYO Townhouse</a></li>
              <li><a href="#features" className="hover:text-[#cc0000] transition-colors">OYO Townhouse Oak</a></li>
              <li><a href="#features" className="hover:text-[#cc0000] transition-colors">OYO Collection O</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-playfair text-lg mb-4 text-center md:text-left">Quick Links</h4>
            <ul className="text-white text-sm space-y-2 font-montserrat text-center md:text-left">
              <li><a href="#home" className="hover:text-[#cc0000] transition-colors">Home</a></li>
              <li><a href="#calculator" className="hover:text-[#cc0000] transition-colors">SOB Calculator</a></li>
              <li><a href="#testimonials" className="hover:text-[#cc0000] transition-colors">Success Stories</a></li>
              <li><a href="#contact" className="hover:text-[#cc0000] transition-colors">Partnership Inquiry</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-playfair text-lg mb-4 text-center md:text-left">Contact</h4>
            <ul className="text-gray-400 text-sm space-y-2 font-montserrat text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-phone text-[#990000] mr-2"></i>
                <span>+91 9373395733</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-envelope text-[#990000] mr-2"></i>
                <span>saransh.chaurasia@oyorooms.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-map-marker-alt text-[#990000] mr-2"></i>
                <span>Mumbai Partner Center, Andheri East</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#cc0f35]/20 pt-6 mt-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm font-montserrat text-center md:text-left mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} OYO Self-Operated Brands. All rights reserved.</p>
          </div>
          <div className="text-gray-500 text-xs font-montserrat">
            <p>A strategic self-operated initiative by OYO Rooms.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
