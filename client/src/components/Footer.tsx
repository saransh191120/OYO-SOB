const Footer = () => {
  return (
    <footer className="py-12 bg-[#0f172a] border-t border-[#d4af37]/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-[#d4af37] font-playfair text-3xl font-bold mr-2">OYO</span>
              <span className="text-white font-playfair text-2xl">Premium</span>
            </div>
            <p className="text-gray-400 text-sm mt-2 font-montserrat text-center md:text-left">
              Elevating Hospitality to Luxury
            </p>
          </div>
          <div className="text-gray-400 text-sm font-montserrat text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} OYO Premium. All rights reserved.</p>
            <p className="mt-1">A premium initiative by OYO Rooms.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
