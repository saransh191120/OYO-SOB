import { useState, useEffect } from "react";
import { useInView } from "./ScrollToTop";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

interface CalculatorFormData {
  roomRate: number;
  stayDuration: number;
  numberOfRooms: number;
  occupancyRate: number;
  selectedBrand: string;
}

interface CalculatorResults {
  totalSellableRooms: string;
  totalRevenue: string;
  occupancyInfo: string;
  revShare: string;
}

interface BrandData {
  id: string;
  name: string;
  revSharePercentage: number;
  defaultRate: number;
  description: string;
}

interface SavedCalculation {
  id: number;
  brandId: string;
  roomRate: number;
  stayDuration: number;
  numberOfRooms: number;
  occupancyRate: number;
  totalRevenue: number;
  revShare: number;
  createdAt: string;
}

const CalculatorSection = () => {
  const { toast } = useToast();
  const brands: BrandData[] = [
    {
      id: "sunday",
      name: "Sunday Hotels",
      revSharePercentage: 45,
      defaultRate: 4500,
      description: "Premium 5-star luxury hotel chain"
    },
    {
      id: "palette",
      name: "OYO Palette",
      revSharePercentage: 42,
      defaultRate: 3800,
      description: "Premium self-operated upscale resorts"
    },
    {
      id: "clubhouse",
      name: "OYO Clubhouse",
      revSharePercentage: 40,
      defaultRate: 3200,
      description: "Resort-style self-operated hotels"
    },
    {
      id: "townhouse",
      name: "OYO Townhouse",
      revSharePercentage: 38,
      defaultRate: 2800,
      description: "Premium neighborhood hotels for millennials"
    },
    {
      id: "townhouse-oak",
      name: "OYO Townhouse Oak",
      revSharePercentage: 40,
      defaultRate: 3000,
      description: "Upscale version of the Townhouse concept"
    },
    {
      id: "collection-o",
      name: "OYO Collection O",
      revSharePercentage: 35,
      defaultRate: 2200,
      description: "Business hotels with standard amenities"
    }
  ];

  const [formData, setFormData] = useState<CalculatorFormData>({
    roomRate: 3000,
    stayDuration: 30,
    numberOfRooms: 15,
    occupancyRate: 70,
    selectedBrand: "sunday"
  });

  const [results, setResults] = useState<CalculatorResults>({
    totalSellableRooms: "0 rooms",
    totalRevenue: "₹ 0.00",
    occupancyInfo: "Based on 0% occupancy rate",
    revShare: "₹ 0.00",
  });

  const [email, setEmail] = useState<string>("");
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [currentBrand, setCurrentBrand] = useState<BrandData>(brands[0]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  // Load email from localStorage if available
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      // Fetch saved calculations for this email
      fetchSavedCalculations(savedEmail);
    }
  }, []);
  
  // Function to fetch saved calculations from the API
  const fetchSavedCalculations = async (email: string) => {
    try {
      const response = await fetch(`/api/calculator-results?email=${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const data = await response.json();
        setSavedCalculations(data);
      } else {
        console.error("Failed to fetch saved calculations");
      }
    } catch (error) {
      console.error("Error fetching saved calculations:", error);
    }
  };
  
  // Function to generate and download PDF report of calculation
  const generatePDF = () => {
    if (!results.totalRevenue) {
      toast({
        title: "No Calculation Available",
        description: "Please calculate your revenue first before generating a PDF.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add OYO logo/header
      doc.setFillColor(15, 23, 42); // Navy background
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(212, 175, 55); // Gold text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("OYO PREMIUM", pageWidth / 2, 20, { align: "center" });
      
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(14);
      doc.text("Revenue Calculator Results", pageWidth / 2, 30, { align: "center" });
      
      // Add calculation date
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      const today = new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(`Generated on ${today}`, pageWidth - 15, 45, { align: "right" });
      
      // Add hotel brand information
      const selectedBrand = brands.find(brand => brand.id === formData.selectedBrand);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Selected Brand:", 15, 60);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text(selectedBrand?.name || "OYO Brand", 15, 70);
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text(`Revenue Share: ${selectedBrand?.revSharePercentage || 0}%`, 15, 80);
      
      // Add hotel details section
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Hotel Information:", 15, 100);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Number of Rooms: ${formData.numberOfRooms}`, 20, 110);
      doc.text(`Room Rate (₹): ${formData.roomRate}`, 20, 120);
      doc.text(`Stay Duration: ${formData.stayDuration} days`, 20, 130);
      doc.text(`Occupancy Rate: ${formData.occupancyRate}%`, 20, 140);
      
      // Add a separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 150, pageWidth - 15, 150);
      
      // Add results section
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Revenue Analysis:", 15, 170);
      
      // Helper function to clean numbers from results
      const cleanNumber = (text: string) => {
        return text.replace(/[^\d.,]/g, '');
      };
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Sellable Rooms: ${results.totalSellableRooms}`, 20, 180);
      doc.text(`Total Revenue: ₹${cleanNumber(results.totalRevenue)}`, 20, 190);
      doc.text(`Occupancy Information: ${results.occupancyInfo}`, 20, 200);
      
      // Highlight revenue share in gold box
      doc.setFillColor(250, 240, 210); // Light gold background
      doc.roundedRect(15, 210, pageWidth - 30, 25, 3, 3, 'F');
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Your Revenue Share:", 25, 225);
      
      doc.setTextColor(166, 127, 6); // Darker gold for emphasis
      doc.setFontSize(16);
      doc.text(`₹${cleanNumber(results.revShare)}`, pageWidth - 25, 225, { align: "right" });
      
      // Add footer
      doc.setFillColor(15, 23, 42); // Navy background
      doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("OYO Self-Operated Business (SOB) - Mumbai", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
      
      // Save the PDF
      doc.save("OYO_Premium_Calculator_Results.pdf");
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your calculation report has been downloaded.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Update current brand whenever the selected brand changes
  useEffect(() => {
    const selectedBrandData = brands.find(brand => brand.id === formData.selectedBrand) || brands[0];
    setCurrentBrand(selectedBrandData);
    
    // Update room rate based on selected brand
    setFormData(prev => ({
      ...prev,
      roomRate: selectedBrandData.defaultRate
    }));
  }, [formData.selectedBrand]);

  // Initialize calculator on component mount
  useEffect(() => {
    calculateRevenue();
  }, [currentBrand]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "selectedBrand") {
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : parseFloat(value),
      });
    }
  };

  const resetCalculator = () => {
    const selectedBrandData = brands.find(brand => brand.id === formData.selectedBrand) || brands[0];
    
    setFormData({
      roomRate: selectedBrandData.defaultRate,
      stayDuration: 30,
      numberOfRooms: 15,
      occupancyRate: 70,
      selectedBrand: formData.selectedBrand
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

  const calculateRevenue = async () => {
    const { roomRate, stayDuration, numberOfRooms, occupancyRate } = formData;

    // Basic validation
    if (
      roomRate <= 0 ||
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
    const totalRevenueMade = occupiedRoomNights * roomRate;
    const initialRevShare = totalRevenueMade * (currentBrand.revSharePercentage / 100);

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
    
    // Save calculation result to database if user provided email
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      try {
        // Store calculation in database
        await fetch('/api/calculator-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            brandId: formData.selectedBrand,
            roomRate,
            stayDuration,
            numberOfRooms,
            occupancyRate,
            totalRevenue: totalRevenueMade,
            revShare: initialRevShare,
            userEmail
          }),
        });
      } catch (error) {
        console.error("Error saving calculation:", error);
        // Do not show error to user, fail silently as this is not critical
      }
    }
  };

  const animationClass = inView ? "animate-fade-in" : "";

  return (
    <section
      id="calculator"
      ref={ref}
      className="min-h-screen py-16 md:py-20 relative"
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
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/70 to-[#0f172a]/70"></div>

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
            SOB Revenue Calculator
          </h2>
          <p className="text-lg text-gray-300 font-montserrat">
            Discover your hotel's revenue potential with OYO's Self-Operated Business model
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
                Self-Operated Brand Calculator
              </h3>
              <p className="text-md text-gray-300 font-montserrat">
                {currentBrand.description} - {currentBrand.revSharePercentage}% Revenue Share
              </p>
            </div>

            {/* Brand Selection */}
            <div className="mb-8">
              <label
                htmlFor="selectedBrand"
                className="flex items-center text-sm font-medium text-gray-300 mb-2 font-montserrat"
              >
                <i className="fas fa-building mr-2 text-[#d4af37]"></i>
                Select Hotel Brand
              </label>
              <select
                id="selectedBrand"
                name="selectedBrand"
                value={formData.selectedBrand}
                onChange={handleInputChange}
                onBlur={calculateRevenue}
                className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
              >
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name} - {brand.revSharePercentage}% Revenue Share
                  </option>
                ))}
              </select>
            </div>

            {/* Calculator Form */}
            <form
              id="calculatorForm"
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8"
              onSubmit={(e) => {
                e.preventDefault();
                calculateRevenue();
              }}
            >
              <div>
                <label
                  htmlFor="roomRate"
                  className="flex items-center text-sm font-medium text-gray-300 mb-1 font-montserrat"
                >
                  <i className="fas fa-hotel mr-2 text-[#d4af37]"></i>
                  Room Rate (₹)
                </label>
                <input
                  type="number"
                  id="roomRate"
                  name="roomRate"
                  value={formData.roomRate}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 rounded-lg bg-[#0f172a] bg-opacity-70 text-white border border-gray-600 focus:ring-[#d4af37] focus:border-[#d4af37] font-montserrat"
                  placeholder={`e.g., ${currentBrand.defaultRate}`}
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
                Your Revenue Share ({currentBrand.revSharePercentage}%)
              </h4>
              <p
                id="revShare"
                className="text-3xl md:text-4xl font-bold text-[#d4af37] font-montserrat"
              >
                {results.revShare}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
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
            
            {/* PDF Generation Section */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h4 className="text-xl font-semibold text-white mb-4 font-playfair text-center">
                Save Your Calculation
              </h4>
              <p className="text-gray-300 text-sm mb-4 text-center font-montserrat">
                Download a detailed PDF report of your revenue calculation for future reference.
              </p>
              
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => generatePDF()}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#d4af37] text-[#0f172a] font-bold rounded-lg transition-all hover:bg-opacity-90 font-montserrat flex items-center justify-center"
                >
                  <i className="fas fa-file-pdf mr-2 text-lg"></i>Download PDF Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
