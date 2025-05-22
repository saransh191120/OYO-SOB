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
  annualTotalRevenue?: string;
  annualRevShare?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Loading effect for a luxurious experience
  useEffect(() => {
    // Simulate loading data with a short delay for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const brands: BrandData[] = [
    {
      id: "sunday",
      name: "Sunday Hotels",
      revSharePercentage: 55,
      defaultRate: 4500,
      description: "Premium 5-star luxury hotel chain"
    },
    {
      id: "palette",
      name: "OYO Palette",
      revSharePercentage: 52,
      defaultRate: 3800,
      description: "Premium self-operated upscale resorts"
    },
    {
      id: "clubhouse",
      name: "OYO Clubhouse",
      revSharePercentage: 48,
      defaultRate: 3200,
      description: "Resort-style self-operated hotels"
    },
    {
      id: "townhouse",
      name: "OYO Townhouse",
      revSharePercentage: 45,
      defaultRate: 2800,
      description: "Premium neighborhood hotels for millennials"
    },
    {
      id: "townhouse-oak",
      name: "OYO Townhouse Oak",
      revSharePercentage: 47,
      defaultRate: 3000,
      description: "Upscale version of the Townhouse concept"
    },
    {
      id: "collection-o",
      name: "OYO Collection O",
      revSharePercentage: 40,
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
    annualTotalRevenue: "₹ 0.00",
    annualRevShare: "₹ 0.00",
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
  
  // Function to generate and download PDF report of calculation with luxury styling
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
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm"
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add black header and footer background for luxury feel
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Add decorative border
      const borderMargin = 10;
      const borderWidth = 1;
      
      // Gold border (simulated with yellow)
      doc.setDrawColor(218, 165, 32); // Gold color
      doc.setLineWidth(borderWidth);
      doc.rect(
        borderMargin, 
        borderMargin, 
        pageWidth - (2 * borderMargin), 
        pageHeight - (2 * borderMargin), 
        'S'
      );
      
      // Inner white content area
      doc.setFillColor(255, 255, 255);
      doc.rect(
        borderMargin + 3, 
        borderMargin + 3, 
        pageWidth - (2 * (borderMargin + 3)), 
        pageHeight - (2 * (borderMargin + 3)), 
        'F'
      );
      
      // Add OYO logo/header
      doc.setFillColor(255, 51, 51); // OYO Red background
      doc.rect(borderMargin + 3, borderMargin + 3, pageWidth - (2 * (borderMargin + 3)), 35, 'F');
      
      // Add pattern to header for luxury feel
      for (let i = 0; i < pageWidth - 20; i += 4) {
        doc.setDrawColor(190, 30, 30); // Darker red
        doc.setLineWidth(0.2);
        doc.line(borderMargin + 5 + i, borderMargin + 3, borderMargin + 5 + i, borderMargin + 38);
      }
      
      // Header content
      doc.setTextColor(255, 255, 255); // White text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("OYO Hotels and Homes Pvt. Ltd", pageWidth / 2, borderMargin + 20, { align: "center" });
      
      doc.setFontSize(14);
      doc.text("Revenue Calculator Results", pageWidth / 2, borderMargin + 30, { align: "center" });
      
      // Add calculation date
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      const today = new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(`Generated on ${today}`, pageWidth - 20, borderMargin + 45, { align: "right" });
      
      // Define consistent margins and spacing for content
      const contentStartY = borderMargin + 55;
      const leftMargin = 20;
      const rightColumnX = 95;
      const lineSpacing = 8;
      
      // Brand information with decorative elements
      const selectedBrand = brands.find(brand => brand.id === formData.selectedBrand);
      
      // Decorative line above brand info
      doc.setDrawColor(218, 165, 32); // Gold color
      doc.setLineWidth(0.5);
      doc.line(leftMargin, contentStartY - 5, pageWidth - leftMargin, contentStartY - 5);
      
      // Brand information section with proper spacing
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Selected Brand: ${selectedBrand?.name || "OYO Brand"}`, leftMargin, contentStartY);
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text(`Revenue Share: ${selectedBrand?.revSharePercentage || 0}%`, pageWidth - 20, contentStartY, { align: "right" });
      
      // Decorative line below brand info
      doc.setDrawColor(218, 165, 32);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, contentStartY + 5, pageWidth - leftMargin, contentStartY + 5);
      
      // Add hotel details section
      let y = contentStartY + 20;
      
      // Section header with luxurious styling
      doc.setFillColor(240, 240, 240); // Light gray background
      doc.rect(leftMargin - 5, y - 5, pageWidth - 2 * (leftMargin - 5), 10, 'F');
      
      doc.setTextColor(255, 51, 51); // OYO Red
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Hotel Information", leftMargin, y);
      
      // Add a decorative line for the section header
      doc.setDrawColor(255, 51, 51); // OYO Red
      doc.setLineWidth(0.5);
      doc.line(leftMargin, y + 5, pageWidth - leftMargin, y + 5);
      
      // Details section with consistent formatting and elegant layout
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      
      // Setting the base Y position for hotel details
      y += 15;
      
      // Create a two-column layout for details with luxurious styling
      // For each row, add subtle background for alternating rows
      
      // Row 1 - Number of Rooms
      doc.setFillColor(248, 248, 248);
      doc.rect(leftMargin - 5, y - 5, pageWidth - 2 * (leftMargin - 5), 10, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.text("Number of Rooms:", leftMargin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.numberOfRooms}`, rightColumnX, y);
      
      // Row 2 - Room Rate
      y += lineSpacing * 3;
      
      doc.setFillColor(255, 255, 255); // White for alternating row
      doc.rect(leftMargin - 5, y - 5, pageWidth - 2 * (leftMargin - 5), 10, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.text("Room Rate:", leftMargin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`₹ ${formData.roomRate.toLocaleString('en-IN')}`, rightColumnX, y);
      
      // Row 3 - Stay Duration
      y += lineSpacing * 3;
      
      doc.setFillColor(248, 248, 248);
      doc.rect(leftMargin - 5, y - 5, pageWidth - 2 * (leftMargin - 5), 10, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.text("Stay Duration:", leftMargin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.stayDuration} days`, rightColumnX, y);
      
      // Row 4 - Occupancy Rate
      y += lineSpacing * 3;
      
      doc.setFillColor(255, 255, 255);
      doc.rect(leftMargin - 5, y - 5, pageWidth - 2 * (leftMargin - 5), 10, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.text("Occupancy Rate:", leftMargin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${formData.occupancyRate}%`, rightColumnX, y);
      
      // Add results section with luxury styling
      y += lineSpacing * 5;
      
      // Section header with luxury styling
      doc.setFillColor(240, 240, 240);
      doc.rect(leftMargin - 5, y - 5, pageWidth - 2 * (leftMargin - 5), 10, 'F');
      
      doc.setTextColor(255, 51, 51); // OYO Red
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Revenue Analysis", leftMargin, y);
      
      // Add a separator line
      doc.setDrawColor(255, 51, 51); // OYO Red
      doc.line(leftMargin, y + 5, pageWidth - leftMargin, y + 5);
      
      // Format number function with luxury styling
      const formatCurrencyForPDF = (amount: string | number): string => {
        if (typeof amount === 'string') {
          // Clean the string first
          amount = amount.replace(/[^\d.,]/g, '');
          amount = parseFloat(amount);
        }
        
        // Format with thousand separators
        return new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        }).format(amount);
      };
      
      // Results section with consistent spacing and luxury styling
      y += lineSpacing * 3;
      
      // Calculate the actual values directly to ensure accuracy
      const totalSellableRoomNights = Number(formData.numberOfRooms || 0) * Number(formData.stayDuration || 0);
      const occupiedRoomNights = totalSellableRoomNights * (Number(formData.occupancyRate || 0) / 100);
      const totalRevenue = occupiedRoomNights * Number(formData.roomRate || 0);
      const revShare = totalRevenue * (selectedBrand?.revSharePercentage || 0) / 100;
      
      // Row 1 - Total Sellable Rooms
      doc.setFillColor(248, 248, 248);
      doc.rect(leftMargin - 5, y - 5, pageWidth - 2 * (leftMargin - 5), 10, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Total Sellable Rooms:", leftMargin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${totalSellableRoomNights} rooms`, rightColumnX, y);
      
      // Row 2 - Total Revenue with elegant formatting
      y += lineSpacing * 3;
      
      doc.setFillColor(255, 255, 255);
      doc.rect(leftMargin - 5, y - 5, pageWidth - 2 * (leftMargin - 5), 10, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.text("Total Revenue:", leftMargin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`₹ ${formatCurrencyForPDF(totalRevenue)}`, rightColumnX, y);
      
      // Row 3 - Occupancy info
      y += lineSpacing * 3;
      
      doc.setFillColor(248, 248, 248);
      doc.rect(leftMargin - 5, y - 5, pageWidth - 2 * (leftMargin - 5), 10, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.text("Occupancy Information:", leftMargin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`Based on ${formData.occupancyRate}% occupancy rate`, rightColumnX, y);
      
      // Revenue share box - with luxury styling
      y += lineSpacing * 5;
      
      // Calculate safe position for the box to not overlap with footer
      const boxHeight = 30;
      const boxY = Math.min(y, pageHeight - 45 - boxHeight);
      
      // Elegant gradient effect using multiple rectangles with decreasing opacity
      const gradientSteps = 5;
      for (let i = 0; i < gradientSteps; i++) {
        const opacity = 0.1 + (i * 0.1);
        doc.setFillColor(255, 51, 51, opacity);
        const padding = (gradientSteps - i);
        doc.roundedRect(
          leftMargin - padding, 
          boxY - padding, 
          pageWidth - 2 * (leftMargin - padding), 
          boxHeight + (2 * padding), 
          3, 3, 'F'
        );
      }
      
      // Main box for revenue share
      doc.setFillColor(255, 245, 245);
      doc.roundedRect(leftMargin, boxY, pageWidth - 2 * leftMargin, boxHeight, 3, 3, 'F');
      
      doc.setDrawColor(255, 51, 51);
      doc.setLineWidth(1);
      doc.roundedRect(leftMargin, boxY, pageWidth - 2 * leftMargin, boxHeight, 3, 3, 'S');
      
      // Decorative pattern inside the box
      for (let i = 0; i < 10; i++) {
        const patternY = boxY + (i * 3);
        if (patternY < boxY + boxHeight) {
          doc.setDrawColor(255, 51, 51, 0.1);
          doc.setLineWidth(0.5);
          doc.line(leftMargin + 5, patternY, pageWidth - leftMargin - 5, patternY);
        }
      }
      
      // Revenue share text with elegant styling
      doc.setTextColor(255, 51, 51);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Your Revenue Share:", leftMargin + 5, boxY + boxHeight/2);
      
      // Format and display revenue share with large, elegant font
      doc.setFontSize(16);
      doc.text(`₹ ${formatCurrencyForPDF(revShare)}`, pageWidth - leftMargin - 5, boxY + boxHeight/2, { align: "right" });
      
      // Safe footer placement - ensure no overlap with content
      const footerY = pageHeight - 25;
      
      // Add decorative line above footer
      doc.setDrawColor(218, 165, 32); // Gold color
      doc.setLineWidth(0.5);
      doc.line(leftMargin, footerY - 5, pageWidth - leftMargin, footerY - 5);
      
      // Footer with luxury styling
      doc.setFillColor(0, 0, 0); // Black background
      doc.rect(0, footerY, pageWidth, 25, 'F');
      
      // Add pattern to footer for luxury feel
      for (let i = 0; i < pageWidth; i += 10) {
        doc.setDrawColor(50, 50, 50);
        doc.setLineWidth(0.2);
        doc.line(i, footerY, i + 5, footerY + 25);
      }
      
      // Footer text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("OYO Hotels and Homes Pvt. Ltd - Self-Operated Business (SOB)", pageWidth / 2, footerY + 10, { align: "center" });
      
      // Decorative logo or trademark in footer
      doc.setFontSize(8);
      doc.text("© 2025 - Premium Luxury Hotels", pageWidth / 2, footerY + 18, { align: "center" });
      
      // Decorative corner elements for luxury feel
      const cornerSize = 15;
      
      // Top left corner
      doc.setDrawColor(218, 165, 32);
      doc.setLineWidth(1);
      doc.line(borderMargin, borderMargin, borderMargin + cornerSize, borderMargin);
      doc.line(borderMargin, borderMargin, borderMargin, borderMargin + cornerSize);
      
      // Top right corner
      doc.line(pageWidth - borderMargin, borderMargin, pageWidth - borderMargin - cornerSize, borderMargin);
      doc.line(pageWidth - borderMargin, borderMargin, pageWidth - borderMargin, borderMargin + cornerSize);
      
      // Bottom corners are inside the footer, so no need to draw them
      
      // Save the PDF with a premium name
      doc.save("OYO_Premium_Revenue_Analysis.pdf");
      
      toast({
        title: "Premium PDF Generated",
        description: "Your luxury revenue analysis report has been downloaded.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error creating your premium PDF. Please try again.",
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
    
    // Annual calculations - simply multiply monthly revenue by 12
    const monthsInYear = 12;
    const annualTotalRevenue = totalRevenueMade * monthsInYear;
    const annualRevShare = initialRevShare * monthsInYear;

    // Display results
    setResults({
      totalSellableRooms: `${formatNumber(
        Math.round(totalSellableRoomNights)
      )} rooms`,
      totalRevenue: formatCurrency(totalRevenueMade),
      occupancyInfo: `Based on ${occupancyRate}% occupancy rate`,
      revShare: formatCurrency(initialRevShare),
      annualTotalRevenue: formatCurrency(annualTotalRevenue),
      annualRevShare: formatCurrency(annualRevShare),
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0000]/90 to-[#0a0000]/95"></div>
      
      {/* Loading Animation */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-[#0a0000]/90">
          <div className="text-3xl text-[#cc0000] font-playfair mb-4 animate-blood-glow">
            Loading Calculator
          </div>
          <div className="w-64 mb-8">
            <div className="calculator-loader"></div>
          </div>
          <div className="text-white text-sm opacity-70">
            Preparing your luxury experience...
          </div>
        </div>
      )}

      {/* Error Message */}
      <div
        id="messageBox"
        className={`fixed top-5 right-5 bg-[#990000] text-white p-4 rounded-lg shadow-lg transition-opacity duration-300 max-w-sm z-50 font-montserrat animate-pulse-red ${
          showErrorMessage ? "" : "hidden"
        }`}
      >
        <div className="flex items-center">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {errorMessage}
        </div>
      </div>

      <div className="container mx-auto px-4 pt-16 relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-16 ${animationClass} ${!isLoading ? "calculator-reveal" : "opacity-0"}`} style={{animationDelay: '100ms'}}>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#cc0000] relative inline-block">
            <span className="relative z-10 animate-blood-glow">SOB Revenue Calculator</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[#660000]/30 via-[#990000]/50 to-[#660000]/30 -z-10 transform -skew-x-12"></span>
          </h2>
          <p className="text-lg text-white font-montserrat bg-[#0a0000]/70 p-4 rounded-lg inline-block shadow-lg font-medium">
            Discover your hotel's revenue potential with OYO Hotels and Homes Pvt. Ltd's Self-Operated Business model
          </p>
          <div className="h-1 w-40 bg-gradient-to-r from-[#660000] to-[#990000] mx-auto mt-8 rounded-full animate-pulse-red"></div>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-xl glass-effect p-8 md:p-10 shadow-2xl ${animationClass} ${!isLoading ? "calculator-reveal" : "opacity-0"} relative overflow-hidden`} style={{animationDelay: '300ms'}}>
            <div className="text-center mb-8 relative z-10">
              <div className="inline-block bg-gradient-to-r from-[#660000] to-[#990000] px-6 py-3 rounded-md text-white text-2xl font-bold mb-3 font-playfair transform hover:scale-105 transition-transform duration-300 animate-pulse-red">
                <span className="animate-blood-glow">OYO</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-playfair mb-3 animate-slide-left delay-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                Self-Operated Brand Calculator
              </h3>
              <p className="text-md text-white font-montserrat animate-slide-right delay-400 bg-[#0a0000]/70 py-3 px-5 rounded-lg inline-block shadow-md font-medium">
                {currentBrand.description} - <span className="text-[#cc0000] font-bold animate-blood-glow">{currentBrand.revSharePercentage}%</span> Revenue Share
              </p>
            </div>

            {/* Brand Selection */}
            {/* Calculator Form */}
            <form
              id="calculatorForm"
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8"
              onSubmit={(e) => {
                e.preventDefault();
                calculateRevenue();
              }}
            >
              {/* Brand Selection - moved into the form for consistent styling */}
              <div className="group md:col-span-2 mb-4">
                <label
                  htmlFor="selectedBrand"
                  className="flex items-center text-md font-semibold text-white mb-2 font-montserrat bg-[#0a0000]/60 p-2 rounded-md"
                >
                  <i className="fas fa-building mr-2 text-[#cc0000]"></i>
                  Select Hotel Brand
                </label>
                <select
                  id="selectedBrand"
                  name="selectedBrand"
                  value={formData.selectedBrand}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 rounded-lg bg-[#0a0000] bg-opacity-70 text-white border border-[#990000]/30 focus:ring-[#990000] focus:border-[#990000] font-montserrat"
                >
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name} - {brand.revSharePercentage}% Revenue Share
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="group">
                <label
                  htmlFor="roomRate"
                  className="flex items-center text-md font-semibold text-white mb-2 font-montserrat group-hover:text-[#cc0000] transition-colors bg-[#0a0000]/60 p-2 rounded-md"
                >
                  <i className="fas fa-hotel mr-2 text-[#cc0000]"></i>
                  Room Rate (₹)
                </label>
                <input
                  type="number"
                  id="roomRate"
                  name="roomRate"
                  value={formData.roomRate}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 h-12 rounded-lg bg-[#0a0000] bg-opacity-70 text-white border border-[#990000]/30 focus:ring-[#990000] focus:border-[#990000] font-montserrat transition-all hover:border-[#990000]/50"
                  placeholder={`e.g., ${currentBrand.defaultRate}`}
                />
              </div>

              <div className="group">
                <label
                  htmlFor="stayDuration"
                  className="flex items-center text-md font-semibold text-white mb-2 font-montserrat group-hover:text-[#cc0000] transition-colors bg-[#0a0000]/60 p-2 rounded-md"
                >
                  <i className="fas fa-calendar-alt mr-2 text-[#cc0000]"></i>
                  Stay Duration (Days)
                </label>
                <input
                  type="number"
                  id="stayDuration"
                  name="stayDuration"
                  value={formData.stayDuration}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 h-12 rounded-lg bg-[#0a0000] bg-opacity-70 text-white border border-[#990000]/30 focus:ring-[#990000] focus:border-[#990000] font-montserrat transition-all hover:border-[#990000]/50"
                  placeholder="e.g., 30"
                />
              </div>

              <div className="group">
                <label
                  htmlFor="numberOfRooms"
                  className="flex items-center text-md font-semibold text-white mb-2 font-montserrat group-hover:text-[#cc0000] transition-colors bg-[#0a0000]/60 p-2 rounded-md"
                >
                  <i className="fas fa-door-open mr-2 text-[#cc0000]"></i>
                  Number of Rooms
                </label>
                <input
                  type="number"
                  id="numberOfRooms"
                  name="numberOfRooms"
                  value={formData.numberOfRooms}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 h-12 rounded-lg bg-[#0a0000] bg-opacity-70 text-white border border-[#990000]/30 focus:ring-[#990000] focus:border-[#990000] font-montserrat transition-all hover:border-[#990000]/50"
                  placeholder="e.g., 15"
                />
              </div>

              <div className="group">
                <label
                  htmlFor="occupancyRate"
                  className="flex items-center text-md font-semibold text-white mb-2 font-montserrat group-hover:text-[#cc0000] transition-colors bg-[#0a0000]/60 p-2 rounded-md"
                >
                  <i className="fas fa-percent mr-2 text-[#cc0000]"></i>
                  Occupancy Rate (%)
                </label>
                <input
                  type="number"
                  id="occupancyRate"
                  name="occupancyRate"
                  value={formData.occupancyRate}
                  onChange={handleInputChange}
                  onBlur={calculateRevenue}
                  className="w-full p-3 h-12 rounded-lg bg-[#0a0000] bg-opacity-70 text-white border border-[#990000]/30 focus:ring-[#990000] focus:border-[#990000] font-montserrat transition-all hover:border-[#990000]/50"
                  placeholder="e.g., 70"
                />
              </div>
            </form>

            {/* Result Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className={`rounded-lg glass-effect p-4 text-center transform transition-transform hover:scale-105 ${!isLoading ? "calculator-reveal" : "opacity-0"}`} style={{animationDelay: '500ms'}}>
                <div className="relative">
                  <h4 className="text-[#cc0000] font-montserrat text-sm mb-1 uppercase tracking-wider animate-blood-glow">
                    Total Sellable Room Nights
                  </h4>
                  <p
                    id="totalSellableRooms"
                    className="text-2xl font-semibold text-white font-montserrat animate-pulse-red"
                  >
                    {results.totalSellableRooms}
                  </p>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#990000] to-transparent"></div>
                </div>
              </div>

              <div className={`rounded-lg glass-effect p-4 text-center transform transition-transform hover:scale-105 ${!isLoading ? "calculator-reveal" : "opacity-0"}`} style={{animationDelay: '600ms'}}>
                <div className="relative">
                  <h4 className="text-[#cc0000] font-montserrat text-sm mb-1 uppercase tracking-wider animate-blood-glow">
                    Total Revenue Generated
                  </h4>
                  <p
                    id="totalRevenue"
                    className="text-2xl font-semibold text-white font-montserrat animate-pulse-red"
                  >
                    {results.totalRevenue}
                  </p>
                  <small
                    id="occupancyInfo"
                    className="text-white text-xs font-montserrat bg-[#0a0000]/70 px-2 py-1 rounded-full inline-block"
                  >
                    {results.occupancyInfo}
                  </small>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#990000] to-transparent"></div>
                </div>
              </div>
            </div>

            {/* SUPER VISIBLE REVENUE SHARE BOX */}
            <div className={`rounded-xl border-4 border-[#cc0000] bg-gradient-to-br from-[#990000]/30 via-[#660000]/40 to-[#cc0000]/30 backdrop-blur-lg p-8 mb-8 text-center relative overflow-hidden group shadow-2xl shadow-[#cc0000]/50 ${!isLoading ? "calculator-reveal" : "opacity-0"}`} style={{animationDelay: '750ms'}}>
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#cc0000]/20 via-[#ff0000]/30 to-[#cc0000]/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 animate-pulse"></div>
              
              {/* Pulsing border effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-[#cc0000] animate-pulse"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="inline-block bg-gradient-to-r from-[#cc0000] to-[#ff0000] px-4 py-2 rounded-full mb-4 shadow-lg">
                  <span className="text-white font-bold text-lg font-montserrat animate-pulse">💰 REVENUE SHARE</span>
                </div>
                
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-4 font-playfair drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]">
                  Your Revenue Share
                </h4>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 border border-[#cc0000]/50">
                  <span className="text-white text-xl font-bold animate-blood-glow">({currentBrand.revSharePercentage}%)</span>
                </div>
                
                <div className="bg-gradient-to-r from-[#cc0000] to-[#ff0000] rounded-xl p-6 shadow-2xl border-2 border-white/20">
                  <p
                    id="revShare"
                    className="text-4xl md:text-6xl lg:text-7xl font-black text-white font-montserrat drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse"
                  >
                    {results.revShare}
                  </p>
                </div>
                
                <div className="h-2 w-48 mx-auto mt-6 bg-gradient-to-r from-[#cc0000] via-[#ff0000] to-[#cc0000] rounded-full animate-pulse shadow-lg"></div>
                
                {/* Professional accent elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-[#ffff00] rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#ffff00] rounded-full animate-pulse delay-500"></div>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-6 ${!isLoading ? "calculator-reveal" : "opacity-0"}`} style={{animationDelay: '800ms'}}>
              <button
                id="calculateBtn"
                onClick={calculateRevenue}
                className="px-8 py-4 h-14 bg-gradient-to-r from-[#cc0000] to-[#990000] text-white font-bold rounded-full transition-all hover:shadow-2xl hover:shadow-[#cc0000]/60 transform hover:-translate-y-1 hover:scale-105 font-montserrat relative overflow-hidden group flex-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000] to-[#cc0000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10 flex items-center justify-center w-full">
                  <i className="fas fa-calculator mr-2"></i>Calculate Revenue
                </span>
              </button>
              <button
                id="resetBtn"
                onClick={resetCalculator}
                className="px-8 py-4 h-14 border-2 border-[#cc0000] text-white font-bold rounded-full transition-all hover:bg-gradient-to-r hover:from-[#cc0000]/20 hover:to-[#990000]/20 hover:shadow-2xl hover:shadow-[#cc0000]/40 transform hover:-translate-y-1 hover:scale-105 font-montserrat relative overflow-hidden group flex-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#cc0000]/10 to-[#990000]/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
                <span className="relative z-10 flex items-center justify-center w-full">
                  <i className="fas fa-redo mr-2"></i>Reset Calculator
                </span>
              </button>
            </div>
            
            {/* ANNUAL REVENUE PROJECTIONS BOX */}
            <div className={`rounded-xl border-4 border-[#cc0000] bg-gradient-to-br from-[#990000]/30 via-[#660000]/40 to-[#cc0000]/30 backdrop-blur-lg p-8 mb-8 text-center relative overflow-hidden group shadow-2xl shadow-[#cc0000]/50 ${!isLoading ? "calculator-reveal" : "opacity-0"}`} style={{animationDelay: '850ms'}}>
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#cc0000]/20 via-[#ff0000]/30 to-[#cc0000]/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 animate-pulse"></div>
              
              {/* Pulsing border effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-[#cc0000] animate-pulse"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="inline-block bg-gradient-to-r from-[#cc0000] to-[#ff0000] px-4 py-2 rounded-full mb-4 shadow-lg">
                  <span className="text-white font-bold text-lg font-montserrat animate-pulse">📊 ANNUAL PROJECTIONS</span>
                </div>
                
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-4 font-playfair drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]">
                  Yearly Revenue Potential
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-[#cc0000]/50 shadow-inner">
                    <h5 className="text-lg font-bold text-white mb-2 font-montserrat">Annual Revenue</h5>
                    <span className="text-2xl md:text-4xl font-bold text-white font-montserrat drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] animate-pulse-red">
                      {results.annualTotalRevenue}
                    </span>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-[#cc0000]/50 shadow-inner">
                    <h5 className="text-lg font-bold text-white mb-2 font-montserrat">Annual Rev. Share</h5>
                    <span className="text-2xl md:text-4xl font-bold text-white font-montserrat drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] animate-pulse-red">
                      {results.annualRevShare}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm md:text-md text-gray-300 font-montserrat mt-4">
                  Projected annual figures based on consistent occupancy rates
                </p>
              </div>
            </div>
            
            {/* PDF Generation Section */}
            <div className={`mt-8 pt-6 border-t border-[#990000]/30 ${!isLoading ? "calculator-reveal" : "opacity-0"}`} style={{animationDelay: '900ms'}}>
              <h4 className="text-xl font-semibold text-white mb-4 font-playfair text-center relative inline-block">
                <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Save Your Calculation</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#660000]/30 via-[#990000]/50 to-[#660000]/30"></span>
              </h4>
              <p className="text-white text-sm mb-4 text-center font-montserrat bg-[#0a0000]/40 py-2 px-4 rounded inline-block">
                Download a detailed PDF report of your revenue calculation for future reference.
              </p>
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => generatePDF()}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#cc0000] to-[#990000] text-white font-bold rounded-full transition-all hover:shadow-2xl hover:shadow-[#cc0000]/60 transform hover:-translate-y-2 hover:scale-105 font-montserrat relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff0000] to-[#cc0000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    <i className="fas fa-file-pdf mr-3 text-lg"></i>Download OYO PDF Report
                  </span>
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
