import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bomb, Gem, Sparkles } from 'lucide-react';

export default function MinesCalculator() {
  const [betAmount, setBetAmount] = useState(1);
  const [mineCount, setMineCount] = useState(3);
  const [revealedGems, setRevealedGems] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [nextMultiplier, setNextMultiplier] = useState(1);
  const [profit, setProfit] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState(Array(25).fill({ revealed: false, isMine: false }));

  const startGame = () => {
    setRevealedGems(0);
    setCurrentMultiplier(1);
    setProfit(0);
    setGameOver(false);

    let newGrid = Array(25).fill({ revealed: false, isMine: false });
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const index = Math.floor(Math.random() * 25);
      if (!newGrid[index].isMine) {
        newGrid[index] = { ...newGrid[index], isMine: true };
        minesPlaced++;
      }
    }
    setGrid(newGrid);
    calculateMultipliers(0);
  };

  const calculateMultipliers = (gems) => {
    const totalTiles = 25;
    const houseEdge = 0.99; // 1% house edge
    
    function ncr(n, r) {
      if (r < 0 || r > n) return 0;
      if (r === 0 || r === n) return 1;
      if (r > n / 2) r = n - r;
      let res = 1;
      for (let i = 1; i <= r; i++) {
        res = res * (n - i + 1) / i;
      }
      return res;
    }

    const currentMult = houseEdge * ncr(totalTiles, gems) / ncr(totalTiles - mineCount, gems);
    setCurrentMultiplier(currentMult);
    setProfit(betAmount * (currentMult -1));

    const nextMult = houseEdge * ncr(totalTiles, gems + 1) / ncr(totalTiles - mineCount, gems + 1);
    setNextMultiplier(nextMult);
  };

  const handleTileClick = (index) => {
    if (gameOver || grid[index].revealed) return;

    const newGrid = [...grid];
    newGrid[index] = { ...newGrid[index], revealed: true };
    setGrid(newGrid);

    if (grid[index].isMine) {
      setGameOver(true);
      setCurrentMultiplier(0);
      setProfit(-betAmount);
    } else {
      const newRevealedGems = revealedGems + 1;
      setRevealedGems(newRevealedGems);
      calculateMultipliers(newRevealedGems);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Bomb className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Best Stake & Rainbet Mines Calculator</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze probabilities and develop your strategy for the Mines game. Use this free Crypto Mines Calculator to understand multipliers and risk.
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
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <Label htmlFor="betAmount" className="text-gray-700 font-medium text-sm">Bet Amount</Label>
                <Input id="betAmount" type="number" value={betAmount} onChange={e => setBetAmount(parseFloat(e.target.value))} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="mineCount" className="text-gray-700 font-medium text-sm">Mines (1-24)</Label>
                <Input id="mineCount" type="number" value={mineCount} min="1" max="24" onChange={e => setMineCount(parseInt(e.target.value))} className="mt-2" />
              </div>
              <Button onClick={startGame} className="w-full bg-gray-900 text-white font-bold py-3 text-base rounded-lg hover:bg-gray-800">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Game
              </Button>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3 mt-4 border border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Current Multiplier</p>
                  <p className="text-2xl font-bold text-blue-600">{currentMultiplier.toFixed(2)}x</p>
                </div>
                 <div className="text-center">
                  <p className="text-sm text-gray-500">Profit</p>
                  <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{profit.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Gems Found</p>
                  <p className="text-2xl font-bold text-gray-800">{revealedGems}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Game Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-5 gap-2 md:gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm aspect-square">
              {grid.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => handleTileClick(index)}
                  disabled={gameOver}
                  className={`w-full h-full rounded-lg flex items-center justify-center transition-all duration-300 ${
                    tile.revealed
                      ? tile.isMine
                        ? 'bg-red-200'
                        : 'bg-green-200'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {tile.revealed && (
                    tile.isMine ? <Bomb className="w-8 h-8 text-red-600" /> : <Gem className="w-8 h-8 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-20 max-w-4xl mx-auto bg-white p-10 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mastering the Mines: A Guide to the Crypto Calculator Mines</h2>
            <div className="space-y-6 text-gray-600">
                <p>The <span className="font-semibold">Crypto Calculator Mines</span> tool is an essential asset for any player looking to move beyond simple luck. By using this free calculator, you can simulate game scenarios, understand the direct impact of mine quantity on potential multipliers, and develop a coherent strategy for risk management.</p>
                
                <h3 className="text-xl font-semibold text-gray-800 pt-4">How Does the Mines Calculator Work?</h3>
                <p>Our tool replicates the core mechanics of the Crypto Mines game. When you set the number of mines and start a game, it calculates the multiplier for each successful gem you uncover. The formula is based on combinatorics, determining the probability of picking a safe tile. As you find more gems, the multiplier increases exponentially, but so does the risk of hitting a mine on your next pick.</p>
                
                <h3 className="text-xl font-semibold text-gray-800 pt-4">Key Strategies for Crypto Mines</h3>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><span className="font-semibold">Low-Risk Approach:</span> Set a higher number of mines (e.g., 10-15) and cash out after finding just one or two gems. This provides smaller, more consistent wins.</li>
                    <li><span className="font-semibold">High-Risk, High-Reward:</span> Use a low number of mines (e.g., 2-4) and attempt to clear a significant portion of the board. This is where you can hit massive multipliers.</li>
                    <li><span className="font-semibold">Pattern Play:</span> While the mine placement is random, some players adopt a consistent tile-picking pattern to manage their decision-making process. Use the calculator to see how different patterns might play out over time.</li>
                </ul>
                <p>Ultimately, this <span className="font-semibold">free Crypto Mines calculator</span> is designed to give you the data-driven edge you need to play smarter.</p>
            </div>
        </div>
      </div>
    </div>
  );
}