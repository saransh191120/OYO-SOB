import { useState, useEffect } from "react";
import { useInView } from "./ScrollToTop";

interface CalculatorFormData {
  luxuryRoomRate: number;
  stayDuration: number;
  numberOfRooms: number;
  occupancyRate: number;
}

interface CalculatorResults {
  totalSellableRooms: string;
  totalRevenue: string;
  occupancyInfo: string;
  revShare: string;
}

const CalculatorSection = () => {
  const [formData, setFormData] = useState<CalculatorFormData>({
    luxuryRoomRate: 2000,
    stayDuration: 30,
    numberOfRooms: 15,
    occupancyRate: 70,
  });

  const [results, setResults] = useState<CalculatorResults>({
    totalSellableRooms: "0 rooms",
    totalRevenue: "₹ 0.00",
    occupancyInfo: "Based on 0% occupancy rate",
    revShare: "₹ 0.00",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  // Initialize calculator on component mount
  useEffect(() => {
    calculateRevenue();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? 0 : parseFloat(value),
    });
  };

  const resetCalculator = () => {
    setFormData({
      luxuryRoomRate: 2000,
      stayDuration: 30,
      numberOfRooms: 15,
      occupancyRate: 70,
    });
    calculateRevenue();
  };

  // Helper function to format numbers as Indian currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("₹", "₹ "); // Add space after ₹
  };

  // Helper function to format numbers with commas (for room counts)
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const calculateRevenue = () => {
    const { luxuryRoomRate, stayDuration, numberOfRooms, occupancyRate } = formData;

    // Basic validation
    if (
      luxuryRoomRate <= 0 ||
      stayDuration <= 0 ||
      numberOfRooms <= 0 ||
      occupancyRate <= 0 ||
      occupancyRate > 100
    ) {
      setResults({
        totalSellableRooms: "0 rooms",
        totalRevenue: formatCurrency(0),
        occupancyInfo: "Based on 0% occupancy rate",
        revShare: formatCurrency(0),
      });

      // Show error message
      setErrorMessage(
        "Please enter valid positive values for all fields. Occupancy rate must be between 1 and 100."
      );
      setShowErrorMessage(true);
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      
      return;
    }

    // Calculations
    const totalSellableRoomNights = numberOfRooms * stayDuration;
    const occupiedRoomNights = totalSellableRoomNights * (occupancyRate / 100);
    const totalRevenueMade = occupiedRoomNights * luxuryRoomRate;
    const initialRevShare = totalRevenueMade * 0.4; // Assuming 40% RevShare

    // Display results
    setResults({
      totalSellableRooms: `${formatNumber(
        Math.round(totalSellableRoomNights)
      )} rooms`,
      totalRevenue: formatCurrency(totalRevenueMade),
      occupancyInfo: `Based on ${occupancyRate}% occupancy rate`,
      revShare: formatCurrency(initialRevShare),
    });

    // Clear any error messages
    setShowErrorMessage(false);
  };

  const animationClass = inView ? "animate-fade-in" : "";

  return (
    <section
      id="calculator"
      ref={ref}
      className="min-h-screen py-20 relative"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 parallax"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')",
          opacity: 0.2,
        }}
      ></div>

      {/* Error Message */}
      <div
        id="messageBox"
        className={`fixed top-5 right-5 bg-[#800020] text-white p-3 rounded-lg shadow-lg transition-opacity duration-300 max-w-sm z-50 font-montserrat ${
          showErrorMessage ? "" : "hidden"
        }`}
      >
        {errorMessage}
      </div>

      <div className="container mx-auto px-4 pt-16 relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-16 ${animationClass}`}>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#d4af37]">
            SOB Calculator
          </h2>
          <p className="text-lg text-gray-300 font-montserrat">
            Discover your premium hotel revenue potential with OYO's exclusive
            revenue model.
          </p>
          <div className="h-1 w-40 gold-gradient mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-xl glass-effect p-8 md:p-10 shadow-2xl ${animationClass} delay-200`}>
            <div className="text-center mb-8">
              <div className="inline-block bg-[#d4af37] px-6 py-2 rounded-md text-[#0f172a] text-2xl font-bold mb-2 font-playfair">
                OYO
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-playfair mb-2">
                Premium SOB Calculator
              </h3>
              <p className="text-md text-gray-300 font-montserrat">
                Luxury Stays, Premium Revenue
              </p>
            </div>

            {/* Calculator Form */}
            <form
              id="calculatorForm"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              onSubmit={(e) => {
                e.preventDefault();
                calculateRevenue();
              }}
            >
              <div>
                <label
                  htmlFor="luxuryRoomRate"
                  className="flex items-center text-sm font-medium text-gray-300 mb-1 font-montserrat"
                >
                  <i className="fas fa-hotel mr-2 text-[#d4af37]"></i>
                  Luxury Room Rate (₹)
                </label>
                <input
                  type="number"
                  id="luxuryRoomRate"
                  name="luxuryRoomRate"
                  value={formData.luxuryRoomRate}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                  placeholder="e.g., 2000"
                />
              </div>

              <div>
                <label
                  htmlFor="stayDuration"
                  className="flex items-center text-sm font-medium text-gray-300 mb-1 font-montserrat"
                >
                  <i className="fas fa-calendar-alt mr-2 text-[#d4af37]"></i>
                  Stay Duration (Days)
                </label>
                <input
                  type="number"
                  id="stayDuration"
                  name="stayDuration"
                  value={formData.stayDuration}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                  placeholder="e.g., 30"
                />
              </div>

              <div>
                <label
                  htmlFor="numberOfRooms"
                  className="flex items-center text-sm font-medium text-gray-300 mb-1 font-montserrat"
                >
                  <i className="fas fa-door-open mr-2 text-[#d4af37]"></i>
                  Number of Rooms
                </label>
                <input
                  type="number"
                  id="numberOfRooms"
                  name="numberOfRooms"
                  value={formData.numberOfRooms}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                  placeholder="e.g., 15"
                />
              </div>

              <div>
                <label
                  htmlFor="occupancyRate"
                  className="flex items-center text-sm font-medium text-gray-300 mb-1 font-montserrat"
                >
                  <i className="fas fa-percent mr-2 text-[#d4af37]"></i>
                  Occupancy Rate (%)
                </label>
                <input
                  type="number"
                  id="occupancyRate"
                  name="occupancyRate"
                  value={formData.occupancyRate}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                  placeholder="e.g., 70"
                />
              </div>
            </form>

            {/* Result Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-lg glass-effect p-4 text-center">
                <h4 className="text-[#d4af37] font-montserrat text-sm mb-1">
                  Total Sellable Room Nights
                </h4>
                <p
                  id="totalSellableRooms"
                  className="text-2xl font-semibold text-white font-montserrat"
                >
                  {results.totalSellableRooms}
                </p>
              </div>

              <div className="rounded-lg glass-effect p-4 text-center">
                <h4 className="text-[#d4af37] font-montserrat text-sm mb-1">
                  Total Revenue Generated
                </h4>
                <p
                  id="totalRevenue"
                  className="text-2xl font-semibold text-white font-montserrat"
                >
                  {results.totalRevenue}
                </p>
                <small
                  id="occupancyInfo"
                  className="text-gray-400 text-xs font-montserrat"
                >
                  {results.occupancyInfo}
                </small>
              </div>
            </div>

            <div className="rounded-lg glass-effect p-6 mb-8 text-center">
              <h4 className="text-xl font-semibold text-white mb-2 font-playfair">
                Your Revenue Share (40%)
              </h4>
              <p
                id="revShare"
                className="text-3xl md:text-4xl font-bold text-[#d4af37] font-montserrat"
              >
                {results.revShare}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                id="calculateBtn"
                onClick={calculateRevenue}
                className="px-6 py-3 bg-[#d4af37] text-[#0f172a] font-bold rounded-full transition-all hover:bg-opacity-90 font-montserrat"
              >
                <i className="fas fa-calculator mr-2"></i>Calculate
              </button>
              <button
                id="resetBtn"
                onClick={resetCalculator}
                className="px-6 py-3 border border-white text-white font-bold rounded-full transition-all hover:bg-white hover:text-[#0f172a] font-montserrat"
              >
                <i className="fas fa-redo mr-2"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
