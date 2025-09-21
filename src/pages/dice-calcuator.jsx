import React, { useEffect } from "react";
import { createPageUrl } from "@/utils";

export default function DiceCalculatorRedirect() {
  useEffect(() => {
    // Immediately redirect to the correct URL
    window.location.replace(createPageUrl("DiceCalculator"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Dice Calculator...</p>
      </div>
    </div>
  );
}