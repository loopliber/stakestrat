import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Sparkles, GitCompareArrows, AlertTriangle } from 'lucide-react';

export default function ArbitrageCalculator() {
  const [oddsA, setOddsA] = useState(2.1);
  const [oddsB, setOddsB] = useState(2.05);
  const [totalStake, setTotalStake] = useState(100);
  const [results, setResults] = useState(null);

  const calculateArbitrage = () => {
    const probA = 1 / oddsA;
    const probB = 1 / oddsB;
    const totalProb = probA + probB;

    if (totalProb >= 1) {
      setResults({ error: "No arbitrage opportunity exists. Total probability is >= 100%." });
      return;
    }

    const stakeA = (totalStake * probA) / totalProb;
    const stakeB = (totalStake * probB) / totalProb;
    const profit = (stakeA * oddsA) - totalStake;
    const profitPercentage = (profit / totalStake) * 100;

    setResults({
      stakeA: stakeA.toFixed(2),
      stakeB: stakeB.toFixed(2),
      profit: profit.toFixed(2),
      profitPercentage: profitPercentage.toFixed(2),
      totalProb: (totalProb * 100).toFixed(2)
    });
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <GitCompareArrows className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Stake & Rainbet Arbitrage Calculator</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find profitable arbitrage opportunities across different sportsbooks and crypto exchanges.
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Enter Odds & Stake</h2>
            <div>
              <Label htmlFor="totalStake" className="text-gray-700 font-medium text-sm">Total Stake</Label>
              <Input id="totalStake" type="number" value={totalStake} onChange={e => setTotalStake(parseFloat(e.target.value))} className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="oddsA" className="text-gray-700 font-medium text-sm">Odds - Outcome A</Label>
                <Input id="oddsA" type="number" value={oddsA} step="0.01" onChange={e => setOddsA(parseFloat(e.target.value))} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="oddsB" className="text-gray-700 font-medium text-sm">Odds - Outcome B</Label>
                <Input id="oddsB" type="number" value={oddsB} step="0.01" onChange={e => setOddsB(parseFloat(e.target.value))} className="mt-2" />
              </div>
            </div>
            <Button onClick={calculateArbitrage} className="w-full bg-gray-900 text-white font-bold py-3 text-base rounded-lg hover:bg-gray-800">
              <Sparkles className="w-5 h-5 mr-2" />
              Calculate Arbitrage
            </Button>
          </div>

          {/* Results */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Results</h2>
            {results ? (
              results.error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3"/>
                    <span>{results.error}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center bg-green-50 p-6 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">Guaranteed Profit</p>
                    <p className="text-4xl font-bold text-green-600">${results.profit}</p>
                    <p className="text-lg font-semibold text-green-600">({results.profitPercentage}%)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500">Stake on Outcome A</p>
                      <p className="text-2xl font-bold text-gray-800">${results.stakeA}</p>
                    </div>
                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500">Stake on Outcome B</p>
                      <p className="text-2xl font-bold text-gray-800">${results.stakeB}</p>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500 pt-4">
                    Total market probability: {results.totalProb}%
                  </div>
                </div>
              )
            ) : (
              <div className="text-center text-gray-500 py-16">
                <Calculator className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>Enter odds to see results.</p>
              </div>
            )}
          </div>
        </div>

         {/* SEO Content Section */}
        <div className="mt-20 max-w-4xl mx-auto bg-white p-10 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is an Arbitrage Calculator?</h2>
            <div className="space-y-6 text-gray-600">
                <p>An <span className="font-semibold">arbitrage calculator</span>, or 'arb' calculator, is a tool used by bettors to calculate if an arbitrage opportunity exists and how to distribute stakes to guarantee a risk-free profit. Arbitrage occurs when different bookmakers have sufficiently different odds on the same event, allowing you to bet on all possible outcomes and make a profit regardless of which one wins.</p>
                
                <h3 className="text-xl font-semibold text-gray-800 pt-4">How to Use This Calculator</h3>
                <p>Using this free arbitrage calculator is simple:</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li><strong>Enter Total Stake:</strong> Decide the total amount of money you want to wager across all outcomes.</li>
                    <li><strong>Enter Odds:</strong> Input the decimal odds for each of the two outcomes from different bookmakers.</li>
                    <li><strong>Calculate:</strong> The tool will instantly tell you if an arbitrage opportunity exists. If it does, it will show the exact amount to stake on each outcome and the guaranteed profit you will make.</li>
                </ol>
                <p>Arbitrage opportunities are rare and often last for only a few minutes, so having a fast and reliable <span className="font-semibold">arbitrage calculator</span> is crucial for success.</p>
            </div>
        </div>
      </div>
    </div>
  );
}