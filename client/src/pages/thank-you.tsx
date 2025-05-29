import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2442] to-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-effect rounded-xl p-8 text-center">
        <h1 className="text-3xl font-playfair font-bold text-white mb-4">
          Thank You!
        </h1>
        <div className="bg-green-600 bg-opacity-20 border border-green-500 text-green-400 p-4 rounded-lg mb-6">
          Your form has been submitted successfully. Our team will contact you shortly.
        </div>
        <p className="text-white mb-8">
          We appreciate your interest in partnering with OYO Premium. A member of our team will review your information and get back to you soon.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#cc0000] to-[#990000] text-white font-bold rounded-full transition-all hover:shadow-2xl hover:shadow-[#cc0000]/50 transform hover:-translate-y-1"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYou; 