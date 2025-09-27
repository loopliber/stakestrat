
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Grid3X3 } from 'lucide-react';

export default function KenoCalculator() {
  const [betAmount, setBetAmount] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [results, setResults] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const payoutTable = {
    1: { 1: 3.6 },
    2: { 1: 1, 2: 9 },
    3: { 1: 1, 2: 2, 3: 46 },
    4: { 1: 0.5, 2: 2, 3: 6, 4: 120 },
    5: { 1: 0.5, 2: 1, 3: 3, 4: 12, 5: 710 },
    6: { 1: 0.5, 2: 1, 3: 2, 4: 3, 5: 30, 6: 1600 },
    7: { 1: 0.5, 2: 0.5, 3: 1, 4: 2, 5: 6, 6: 142, 7: 7000 },
    8: { 1: 0.5, 2: 0.5, 3: 1, 4: 2, 5: 4, 6: 25, 7: 1000, 8: 10000 }
  };

  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 8) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const drawNumbers = () => {
    if (selectedNumbers.length === 0) {
      alert("Please select at least one number!");
      return;
    }

    setIsDrawing(true);
    setDrawnNumbers([]);

    setTimeout(() => {
      const drawn = [];
      while (drawn.length < 10) {
        const num = Math.floor(Math.random() * 40) + 1;
        if (!drawn.includes(num)) {
          drawn.push(num);
        }
      }
      setDrawnNumbers(drawn);

      const matches = selectedNumbers.filter(num => drawn.includes(num)).length;
      const payout = payoutTable[selectedNumbers.length]?.[matches] || 0;
      const totalPayout = betAmount * payout;
      const profit = totalPayout - betAmount;

      setResults({
        matches,
        totalSelected: selectedNumbers.length,
        payout: payout,
        totalPayout: totalPayout.toFixed(2),
        profit: profit.toFixed(2)
      });

      setIsDrawing(false);
    }, 2000);
  };

  const resetGame = () => {
    setSelectedNumbers([]);
    setDrawnNumbers([]);
    setResults(null);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Grid3X3 className="w-12 h-12 mx-auto text-blue-500 mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Best Stake & Rainbet Keno Calculator</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate odds and payouts for Keno. Select your numbers and see potential winnings with our advanced calculator.
          </p>
        </div>

        {/* Compact Dual Platform Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg p-3 mb-6 text-white">
          <div className="text-center mb-3">
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-1">
              🎯 TOP PLATFORMS
            </div>
            <h3 className="text-sm font-bold mb-1">Ready to play? Choose your platform:</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Stake.com Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-md p-2 border border-white/20 text-center">
              <div className="mb-1">
                <h4 className="text-sm font-bold text-white">Stake.com</h4>
                <div className="text-green-300 font-bold text-xs">5% Rakeback</div>
              </div>
              <a
                href="https://stake.com/?c=aqTVKbe1"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-1.5 bg-white text-blue-600 font-bold rounded text-xs hover:bg-blue-50 transition-all duration-300"
              >
                🎲 Play on Stake
              </a>
            </div>

            {/* Rainbet Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-md p-2 border border-white/20 text-center">
              <div className="mb-1">
                <h4 className="text-sm font-bold text-white">Rainbet</h4>
                <div className="text-green-300 font-bold text-xs">100% Bonus</div>
              </div>
              <a
                href="https://rainbet.com/?r=stakestrat"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-1.5 bg-white text-purple-600 font-bold rounded text-xs hover:bg-purple-50 transition-all duration-300"
              >
                🌧️ Play on Rainbet
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Game Settings</h2>
            
            <div className="space-y-4">
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
                <Label className="text-gray-700 font-medium text-sm">
                  Selected Numbers ({selectedNumbers.length}/8)
                </Label>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedNumbers.sort((a, b) => a - b).join(', ') || 'None selected'}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={drawNumbers} disabled={isDrawing || selectedNumbers.length === 0} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {isDrawing ? 'Drawing...' : 'Draw Numbers'}
                </Button>
                <Button onClick={resetGame} variant="outline" className="px-4">
                  Reset
                </Button>
              </div>

              {results && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900">Results</h3>
                  <p className="text-sm text-blue-700">Matches: {results.matches}/{results.totalSelected}</p>
                  <p className="text-sm text-blue-700">Multiplier: {results.payout}x</p>
                  <p className="text-lg font-bold text-blue-900">${results.totalPayout}</p>
                  <p className={`text-sm font-semibold ${parseFloat(results.profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Profit: ${results.profit}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Number Grid */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Your Numbers (1-40)</h2>
            
            <div className="grid grid-cols-8 gap-2 mb-6">
              {Array.from({ length: 40 }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                    selectedNumbers.includes(num)
                      ? 'bg-blue-600 text-white'
                      : drawnNumbers.includes(num)
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {drawnNumbers.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-900 mb-2">Drawn Numbers</h3>
                <div className="flex flex-wrap gap-2">
                  {drawnNumbers.sort((a, b) => a - b).map(num => (
                    <span key={num} className="px-2 py-1 bg-yellow-400 text-black rounded font-semibold text-sm">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-20 max-w-4xl mx-auto bg-white p-10 rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Keno Strategy Guide: Mastering the Numbers Game</h2>
          <div className="space-y-6 text-gray-600">
            <p>Keno is a lottery-style game where players select numbers and hope they match those drawn randomly. This <span className="font-semibold">Crypto Keno calculator</span> helps you understand the odds and potential payouts for different number selections.</p>
            
            <h3 className="text-xl font-semibold text-gray-800">Optimal Number Selection</h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>4-6 Numbers:</strong> Best balance of hit frequency and payout potential</li>
              <li><strong>7-8 Numbers:</strong> Higher payouts but lower hit probability</li>
              <li><strong>1-3 Numbers:</strong> High hit rate but limited payout growth</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800">Bankroll Management</h3>
            <p>Since Keno is a high-variance game, proper bankroll management is crucial. Never bet more than 5% of your total bankroll on a single draw, and consider the house edge when planning your sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
