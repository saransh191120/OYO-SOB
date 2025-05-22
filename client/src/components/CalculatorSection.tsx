import { useState, useEffect } from "react";
import { useInView } from "./ScrollToTop";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

interface CalculatorFormData {
  roomRate: number | "";
  stayDuration: number | "";
  numberOfRooms: number | "";
  occupancyRate: number | "";
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
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add OYO logo/header
      doc.setFillColor(255, 51, 51); // OYO Red background
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255); // White text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("OYO Hotels and Homes Pvt. Ltd", pageWidth / 2, 20, { align: "center" });
      
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
      doc.text(`Generated on ${today}`, pageWidth - 15, 50, { align: "right" });
      
      // Add hotel brand information
      const selectedBrand = brands.find(brand => brand.id === formData.selectedBrand);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Selected Brand:", 15, 65);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text(selectedBrand?.name || "OYO Brand", 45, 65);
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text(`Revenue Share: ${selectedBrand?.revSharePercentage || 0}%`, pageWidth - 15, 65, { align: "right" });
      
      // Add hotel details section
      doc.setTextColor(255, 51, 51); // OYO Red
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Hotel Information", 15, 85);
      
      // Add a separator line
      doc.setDrawColor(255, 51, 51); // OYO Red
      doc.setLineWidth(0.5);
      doc.line(15, 90, pageWidth - 15, 90);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Number of Rooms:", 15, 105);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.numberOfRooms}`, 100, 105);
      
      doc.setFont("helvetica", "bold");
      doc.text("Room Rate:", 15, 120);
      doc.setFont("helvetica", "normal");
      doc.text(`₹ ${formData.roomRate.toLocaleString('en-IN')}`, 100, 120);
      
      doc.setFont("helvetica", "bold");
      doc.text("Stay Duration:", 15, 135);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.stayDuration} days`, 100, 135);
      
      doc.setFont("helvetica", "bold");
      doc.text("Occupancy Rate:", 15, 150);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.occupancyRate}%`, 100, 150);
      
      // Add results section
      doc.setTextColor(255, 51, 51); // OYO Red
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Revenue Analysis", 15, 175);
      
      // Add a separator line
      doc.setDrawColor(255, 51, 51); // OYO Red
      doc.line(15, 180, pageWidth - 15, 180);
      
      // Helper function to clean numbers from results
      const cleanNumber = (text: string) => {
        return text.replace(/[^\d.,]/g, '');
      };
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Total Sellable Rooms:", 15, 195);
      doc.setFont("helvetica", "normal");
      doc.text(results.totalSellableRooms, 120, 195);
      
      doc.setFont("helvetica", "bold");
      doc.text("Total Revenue:", 15, 210);
      doc.setFont("helvetica", "normal");
      doc.text(`₹ ${cleanNumber(results.totalRevenue)}`, 120, 210);
      
      doc.setFont("helvetica", "bold");
      doc.text("Occupancy Information:", 15, 225);
      doc.setFont("helvetica", "normal");
      doc.text(results.occupancyInfo, 120, 225);
      
      // Highlight revenue share in OYO branded box
      doc.setFillColor(255, 240, 240); // Light red background
      doc.roundedRect(15, 235, pageWidth - 30, 30, 3, 3, 'F');
      
      doc.setDrawColor(255, 51, 51); // OYO Red
      doc.setLineWidth(1);
      doc.roundedRect(15, 235, pageWidth - 30, 30, 3, 3, 'S');
      
      doc.setTextColor(255, 51, 51); // OYO Red
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Your Revenue Share:", 25, 253);
      
      doc.setFontSize(16);
      doc.text(`₹ ${cleanNumber(results.revShare)}`, pageWidth - 25, 253, { align: "right" });
      
      // Add footer
      doc.setFillColor(255, 51, 51); // OYO Red
      doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("OYO Hotels and Homes Pvt. Ltd - Self-Operated Business (SOB)", pageWidth / 2, pageHeight - 10, { align: "center" });
      
      // Save the PDF
      doc.save("OYO_Revenue_Calculator_Results.pdf");
      
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
        [name]: value === "" ? "" : parseFloat(value),
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
      !roomRate ||
      !stayDuration ||
      !numberOfRooms ||
      !occupancyRate ||
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505]/90 to-[#1a0505]/95"></div>

      {/* Error Message */}
      <div
        id="messageBox"
        className={`fixed top-5 right-5 bg-[#cc0f35] text-white p-4 rounded-lg shadow-lg transition-opacity duration-300 max-w-sm z-50 font-montserrat animate-pulse-red ${
          showErrorMessage ? "" : "hidden"
        }`}
      >
        <div className="flex items-center">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {errorMessage}
        </div>
      </div>

      <div className="container mx-auto px-4 pt-16 relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-16 ${animationClass}`}>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#e31041] relative inline-block">
            <span className="relative z-10">SOB Revenue Calculator</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[#cc0f35]/20 via-[#e31041]/40 to-[#cc0f35]/20 -z-10 transform -skew-x-12"></span>
          </h2>
          <p className="text-lg text-gray-300 font-montserrat">
            Discover your hotel's revenue potential with OYO Hotels and Homes Pvt. Ltd's Self-Operated Business model
          </p>
          <div className="h-1 w-40 bg-gradient-to-r from-[#cc0f35] to-[#e31041] mx-auto mt-8 rounded-full animate-pulse-red"></div>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-xl glass-effect p-8 md:p-10 shadow-2xl ${animationClass} delay-200 relative overflow-hidden`}>
            <div className="text-center mb-8 relative z-10">
              <div className="inline-block bg-gradient-to-r from-[#cc0f35] to-[#e31041] px-6 py-3 rounded-md text-white text-2xl font-bold mb-3 font-playfair transform hover:scale-105 transition-transform duration-300 animate-pulse-red">
                OYO
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-playfair mb-3 animate-slide-left delay-200">
                Self-Operated Brand Calculator
              </h3>
              <p className="text-md text-gray-300 font-montserrat animate-slide-right delay-400">
                {currentBrand.description} - <span className="text-[#e31041] font-bold">{currentBrand.revSharePercentage}%</span> Revenue Share
              </p>
            </div>

            {/* Brand Selection */}
            <div className="mb-8 relative z-10">
              <label
                htmlFor="selectedBrand"
                className="flex items-center text-sm font-medium text-gray-300 mb-2 font-montserrat"
              >
                <i className="fas fa-building mr-2 text-[#e31041]"></i>
                Select Hotel Brand
              </label>
              <select
                id="selectedBrand"
                name="selectedBrand"
                value={formData.selectedBrand}
                onChange={handleInputChange}
                onBlur={calculateRevenue}
                className="w-full p-3 rounded-lg bg-[#1a0505] bg-opacity-70 text-white border border-[#e31041]/30 focus:ring-[#e31041] focus:border-[#e31041] font-montserrat"
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
              <div className="group">
                <label
                  htmlFor="roomRate"
                  className="flex items-center text-sm font-medium text-gray-300 mb-1 font-montserrat group-hover:text-[#e31041] transition-colors"
                >
                  <i className="fas fa-hotel mr-2 text-[#e31041]"></i>
                  Room Rate (₹)
                </label>
                <input
                  type="number"
                  id="roomRate"
                  name="roomRate"
                  value={formData.roomRate}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 rounded-lg bg-[#1a0505] bg-opacity-70 text-white border border-[#cc0f35]/30 focus:ring-[#e31041] focus:border-[#e31041] font-montserrat transition-all hover:border-[#e31041]/50"
                  placeholder={`e.g., ${currentBrand.defaultRate}`}
                />
              </div>

              <div className="group">
                <label
                  htmlFor="stayDuration"
                  className="flex items-center text-sm font-medium text-gray-300 mb-1 font-montserrat group-hover:text-[#e31041] transition-colors"
                >
                  <i className="fas fa-calendar-alt mr-2 text-[#e31041]"></i>
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
                className="px-6 py-3 bg-[#FF3333] text-white font-bold rounded-full transition-all hover:bg-opacity-90 font-montserrat"
              >
                <i className="fas fa-calculator mr-2"></i>Calculate
              </button>
              <button
                id="resetBtn"
                onClick={resetCalculator}
                className="px-6 py-3 border border-white text-white font-bold rounded-full transition-all hover:bg-white hover:text-[#FF3333] font-montserrat"
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
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#FF3333] text-white font-bold rounded-lg transition-all hover:bg-opacity-90 font-montserrat flex items-center justify-center"
                >
                  <i className="fas fa-file-pdf mr-2 text-lg"></i>Download OYO PDF Report
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
