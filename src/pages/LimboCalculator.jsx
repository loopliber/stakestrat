
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Zap, Calculator, TrendingUp, AlertTriangle, Target, Sparkles } from "lucide-react";

export default function LimboCalculator() {
  const [inputs, setInputs] = useState({
    betAmount: 1,
    multiplier: 2.0,
    balance: 1000,
    martingaleIncrease: 100,
    maxLosses: 10,
    targetProfit: 10,
    maxBets: 100
  });

  const [results, setResults] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate win chance from multiplier
  const winChance = (99 / inputs.multiplier).toFixed(4);
  const houseEdge = ((100 - parseFloat(winChance)) / 100) * inputs.multiplier - 1;

  const calculateLimboStrategy = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const { betAmount, multiplier, balance, martingaleIncrease, maxLosses, targetProfit, maxBets } = inputs;

      // Basic calculations
      const winProbability = 99 / multiplier / 100;
      const lossProbability = 1 - winProbability;
      const expectedValue = (winProbability * (betAmount * (multiplier - 1))) - (lossProbability * betAmount);
      const expectedValuePercentage = (expectedValue / betAmount) * 100;

      // Martingale calculations
      const martingaleMultiplier = 1 + (martingaleIncrease / 100);
      let tempBet = betAmount;
      let tempBalance = balance;
      let maxConsecutiveLosses = 0;

      // Calculate maximum consecutive losses before bankruptcy
      // This loop will stop either when tempBalance is insufficient or maxLosses is reached
      // The condition `maxConsecutiveLosses < maxLosses` ensures it doesn't try to simulate beyond the user's defined max losses
      while (tempBalance >= tempBet && maxConsecutiveLosses < maxLosses) {
        tempBalance -= tempBet;
        if (tempBalance >= 0) { // Only increase bet if we haven't gone bankrupt yet in this theoretical check
          tempBet *= martingaleMultiplier;
        }
        maxConsecutiveLosses++;
      }

      // Bankruptcy risk calculation - adjusted to reflect the number of losses that would cause bankruptcy
      // It's the probability of losing 'maxConsecutiveLosses' times in a row
      const bankruptcyRisk = Math.pow(lossProbability, maxConsecutiveLosses) * 100;

      // Required streak calculation for target profit
      const profitPerWin = betAmount * (multiplier - 1);
      const betsNeededForTarget = Math.ceil(targetProfit / profitPerWin);

      // House edge calculation
      const realHouseEdge = (1 - (winProbability * multiplier)) * 100;

      setResults({
        winProbability: (winProbability * 100).toFixed(4),
        lossProbability: (lossProbability * 100).toFixed(4),
        expectedValue: expectedValue.toFixed(6),
        expectedValuePercentage: expectedValuePercentage.toFixed(4),
        maxConsecutiveLosses,
        bankruptcyRisk: bankruptcyRisk.toFixed(4),
        houseEdge: realHouseEdge.toFixed(4),
        profitPerWin: profitPerWin.toFixed(2),
        betsNeededForTarget
      });

      // Run simulation
      runSimulation();
      setIsCalculating(false);
    }, 500);
  };

  const runSimulation = () => {
    const { betAmount, multiplier, balance, martingaleIncrease, maxBets } = inputs;
    const winProbability = 99 / multiplier / 100;
    const martingaleMultiplier = 1 + (martingaleIncrease / 100);

    let simulatedBalance = balance;
    let currentBet = betAmount;
    let betsPlaced = 0;
    let wins = 0;
    let losses = 0;
    let consecutiveLosses = 0;
    let maxConsecutiveLossesReached = 0;
    let totalWagered = 0;

    const gameHistory = [];

    for (let i = 0; i < maxBets && simulatedBalance >= currentBet; i++) {
      betsPlaced++;
      totalWagered += currentBet;
      const isWin = Math.random() < winProbability;

      if (isWin) {
        const profit = currentBet * (multiplier - 1);
        simulatedBalance += profit;
        currentBet = betAmount; // Reset to base bet
        consecutiveLosses = 0;
        wins++;

        gameHistory.push({
          bet: i + 1,
          result: 'WIN',
          multiplier: multiplier.toFixed(2),
          profit: profit.toFixed(2),
          balance: simulatedBalance.toFixed(2)
        });
      } else {
        const lossAmount = currentBet; // Store the bet amount that was lost
        simulatedBalance -= lossAmount;
        currentBet *= martingaleMultiplier;
        consecutiveLosses++;
        maxConsecutiveLossesReached = Math.max(maxConsecutiveLossesReached, consecutiveLosses);
        losses++;

        gameHistory.push({
          bet: i + 1,
          result: 'LOSS',
          multiplier: '0.00',
          profit: (-lossAmount).toFixed(2), // Negative value for loss
          balance: simulatedBalance.toFixed(2)
        });
      }
    }

    const finalProfit = simulatedBalance - balance;
    const winRate = betsPlaced > 0 ? (wins / betsPlaced) * 100 : 0;
    const roi = totalWagered > 0 ? (finalProfit / totalWagered) * 100 : 0;

    setSimulation({
      finalBalance: simulatedBalance.toFixed(2),
      finalProfit: finalProfit.toFixed(2),
      betsPlaced,
      wins,
      losses,
      winRate: winRate.toFixed(2),
      totalWagered: totalWagered.toFixed(2),
      roi: roi.toFixed(2),
      maxConsecutiveLossesReached,
      gameHistory: gameHistory.reverse().slice(0, 10) // Get last 10 games, reversed for display
    });
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-4">
            <Zap className="w-4 h-4 mr-2" />
            <span>Limbo Strategy Calculator</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
            Advanced Limbo Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mathematical precision for under/over betting with comprehensive house edge analysis.
          </p>
        </div>

        <div className="grid xl:grid-cols-5 gap-8">
          {/* Input Panel */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Strategy Settings</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">Bet Amount ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={inputs.betAmount}
                      onChange={(e) => setInputs({...inputs, betAmount: parseFloat(e.target.value) || 0})}
                      className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">Balance ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={inputs.balance}
                      onChange={(e) => setInputs({...inputs, balance: parseFloat(e.target.value) || 0})}
                      className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-3 block text-sm">
                      Target Multiplier: <span className="text-orange-600 font-bold">{inputs.multiplier.toFixed(2)}x</span>
                    </Label>
                    <Slider
                      value={[inputs.multiplier]}
                      onValueChange={(value) => setInputs({...inputs, multiplier: value[0]})}
                      min={1.01}
                      max={100}
                      step={0.01}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1.01x</span>
                      <span>100x</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{winChance}%</div>
                        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Win Chance</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{(houseEdge * 100).toFixed(2)}%</div>
                        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">House Edge</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">Martingale (%)</Label>
                    <Input
                      type="number"
                      step="1"
                      value={inputs.martingaleIncrease}
                      onChange={(e) => setInputs({...inputs, martingaleIncrease: parseFloat(e.target.value) || 0})}
                      className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">Max Losses</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={inputs.maxLosses}
                      onChange={(e) => setInputs({...inputs, maxLosses: parseInt(e.target.value) || 1})}
                      className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">Target Profit ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={inputs.targetProfit}
                      onChange={(e) => setInputs({...inputs, targetProfit: parseFloat(e.target.value) || 0})}
                      className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">Max Bets</Label>
                    <Input
                      type="number"
                      min="1"
                      value={inputs.maxBets}
                      onChange={(e) => setInputs({...inputs, maxBets: parseInt(e.target.value) || 1})}
                      className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <Button
                  onClick={calculateLimboStrategy}
                  disabled={isCalculating}
                  className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 shadow-md"
                >
                  {isCalculating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Calculating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Calculate & Simulate</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="xl:col-span-3">
            {results ? (
              <div className="space-y-6">
                {/* Mathematical Analysis */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Mathematical Analysis</h2>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{results.winProbability}%</div>
                      <div className="text-gray-500 text-xs font-medium uppercase">Win Probability</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">{results.houseEdge}%</div>
                      <div className="text-gray-500 text-xs font-medium uppercase">House Edge</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{results.expectedValuePercentage}%</div>
                      <div className="text-gray-500 text-xs font-medium uppercase">Expected Value</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{results.maxConsecutiveLosses}</div>
                      <div className="text-gray-500 text-xs font-medium uppercase">Max Safe Losses</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                      <div className="text-xl font-bold text-gray-900">${results.profitPerWin}</div>
                      <div className="text-gray-500 text-xs font-medium uppercase">Profit per Win</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                      <div className="text-xl font-bold text-gray-900">{results.betsNeededForTarget}</div>
                      <div className="text-gray-500 text-xs font-medium uppercase">Wins for Target</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200 text-center">
                      <div className="text-xl font-bold text-red-600">{results.bankruptcyRisk}%</div>
                      <div className="text-red-500 text-xs font-medium uppercase">Bankruptcy Risk</div>
                    </div>
                  </div>
                </div>

                {simulation && (
                  <>
                    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Simulation Results</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                          <div className="text-lg font-bold text-gray-900">${simulation.finalBalance}</div>
                          <div className="text-gray-500 text-xs font-medium uppercase">Final Balance</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                          <div className={`text-lg font-bold ${parseFloat(simulation.finalProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${simulation.finalProfit}
                          </div>
                          <div className="text-gray-500 text-xs font-medium uppercase">Total Profit/Loss</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                          <div className="text-lg font-bold text-gray-900">{simulation.winRate}%</div>
                          <div className="text-gray-500 text-xs font-medium uppercase">Win Rate</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                          <div className={`text-lg font-bold ${parseFloat(simulation.roi) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {simulation.roi}%
                          </div>
                          <div className="text-gray-500 text-xs font-medium uppercase">ROI</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                          <div className="text-base font-bold text-gray-900">{simulation.betsPlaced}</div>
                          <div className="text-gray-500 text-xs font-medium uppercase">Total Bets</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                          <div className="text-base font-bold text-green-600">{simulation.wins}</div>
                          <div className="text-gray-500 text-xs font-medium uppercase">Wins</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                          <div className="text-base font-bold text-red-600">{simulation.losses}</div>
                          <div className="text-gray-500 text-xs font-medium uppercase">Losses</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                          <div className="text-base font-bold text-orange-600">{simulation.maxConsecutiveLossesReached}</div>
                          <div className="text-gray-500 text-xs font-medium uppercase">Max Loss Streak</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-3 mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Simulation History</h2>
                      </div>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {simulation.gameHistory.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            No simulation data available
                          </div>
                        ) : (
                          simulation.gameHistory.map((game) => (
                            <div key={game.bet} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <span className="text-gray-500 text-sm font-mono">#{game.bet}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  game.result === "WIN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {game.result}
                                </span>
                                <span className="text-gray-800 text-sm font-semibold">{game.multiplier}x</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className={`font-bold text-sm ${
                                  parseFloat(game.profit) >= 0 ? "text-green-600" : "text-red-600"
                                }`}>
                                  ${game.profit}
                                </span>
                                <span className="text-gray-500 text-sm font-medium w-24 text-right">${game.balance}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Risk Warning */}
                <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Risk Assessment</h2>
                  </div>

                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>The house always maintains a mathematical edge of <span className="text-red-600 font-semibold">{results?.houseEdge}%</span>.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Martingale strategies exponentially increase bet sizes during losing streaks.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Historical results do not predict future performance.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="font-semibold text-gray-700">Only gamble with money you can afford to lose.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center shadow-sm">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-6 border border-gray-200">
                  <Calculator className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Analyze</h3>
                <p className="text-gray-600 text-lg">
                  Configure your limbo strategy parameters and click calculate for detailed analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
