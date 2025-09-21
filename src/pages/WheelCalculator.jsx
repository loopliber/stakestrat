
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, Sparkles, Target } from 'lucide-react';

export default function WheelCalculator() {
  const [betAmount, setBetAmount] = useState(1);
  const [selectedRisk, setSelectedRisk] = useState("low");
  const [selectedSegments, setSelectedSegments] = useState(10);
  const [results, setResults] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const riskLevels = {
    low: { multipliers: [1.2, 1.5, 1.8, 2.0, 1.2, 1.5, 1.8, 2.0, 1.2, 1.5] },
    medium: { multipliers: [0.2, 1.5, 3.0, 5.0, 0.2, 1.5, 3.0, 5.0, 0.2, 1.5] },
    high: { multipliers: [0.0, 0.0, 2.0, 9.9, 0.0, 0.0, 2.0, 9.9, 0.0, 0.0] }
  };

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    
    setTimeout(() => {
      const multipliers = riskLevels[selectedRisk].multipliers;
      const winIndex = Math.floor(Math.random() * multipliers.length);
      const multiplier = multipliers[winIndex];
      const payout = betAmount * multiplier;
      const profit = payout - betAmount;

      setResults({
        segment: winIndex + 1,
        multiplier: multiplier.toFixed(1),
        payout: payout.toFixed(2),
        profit: profit.toFixed(2)
      });
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Target className="w-12 h-12 mx-auto text-purple-500 mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Crypto Wheel Calculator & Strategy</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your potential winnings and analyze the risk-reward ratios for the Wheel of Fortune game.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Wheel Settings</h2>
            
            <div>
              <Label className="text-gray-700 font-medium text-sm">Bet Amount</Label>
              <Input 
                type="number" 
                value={betAmount} 
                onChange={e => setBetAmount(parseFloat(e.target.value))} 
                className="mt-2" 
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium text-sm">Risk Level</Label>
              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={spinWheel} 
              disabled={spinning}
              className="w-full bg-purple-600 text-white font-bold py-3 text-base rounded-lg hover:bg-purple-700"
            >
              {spinning ? (
                <div className="flex items-center justify-center space-x-2">
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  <span>Spinning...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Spin Wheel</span>
                </div>
              )}
            </Button>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Results</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="text-center bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 font-medium">Landed on Segment</p>
                  <p className="text-3xl font-bold text-purple-600">#{results.segment}</p>
                  <p className="text-lg font-semibold text-purple-600">{results.multiplier}x</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Payout</p>
                    <p className="text-xl font-bold text-gray-800">${results.payout}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Profit/Loss</p>
                    <p className={`text-xl font-bold ${parseFloat(results.profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${results.profit}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16">
                <Target className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>Spin the wheel to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-20 max-w-4xl mx-auto bg-white p-10 rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Master the Crypto Wheel: Strategy Guide</h2>
          <div className="space-y-6 text-gray-600">
            <p>The <span className="font-semibold">Crypto Wheel</span> is one of the most popular games on many platforms, offering players the chance to win big with a simple spin. Understanding the risk levels and payout structures is crucial for developing a winning strategy.</p>
            
            <h3 className="text-xl font-semibold text-gray-800">Risk Level Analysis</h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Low Risk:</strong> Consistent small wins with multipliers ranging from 1.2x to 2.0x</li>
              <li><strong>Medium Risk:</strong> Balanced approach with potential for 5x wins but some losing segments</li>
              <li><strong>High Risk:</strong> Extreme volatility with 9.9x potential but many zero segments</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800">Optimal Betting Strategy</h3>
            <p>For consistent profits, consider using a progressive betting system with low-risk spins, increasing your bet after losses and returning to base after wins. This <span className="font-semibold">Crypto Wheel calculator</span> helps you plan these strategies effectively.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
