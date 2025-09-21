
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Play, RotateCcw, Settings } from "lucide-react";

const Ball = ({ path, onAnimationEnd }) => {
  const ballStyle = {
    animation: `fall ${path.duration}s linear forwards`,
    '--path-x': `${path.x}px`,
    '--path-y': `${path.y}px`,
  };

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-yellow-400 rounded-full z-20"
      style={ballStyle}
      onAnimationEnd={onAnimationEnd}
    />
  );
};

export default function PlinkoSimulator() {
  const [gameSettings, setGameSettings] = useState({
    betAmount: 1,
    riskLevel: "medium", // low, medium, high
    rows: 16,
    isAuto: false,
    autoBetCount: 10,
    stopOnProfit: 0,
    stopOnLoss: 0
  });

  const [activeBall, setActiveBall] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [autoBetsRemaining, setAutoBetsRemaining] = useState(0);
  
  const [stats, setStats] = useState({
    totalBalls: 0,
    totalWagered: 0,
    totalPayout: 0,
    biggestWin: 0,
    currentBalance: 1000,
    sessionProfit: 0
  });

  const boardRef = useRef(null);
  const autoIntervalRef = useRef(null);

  const payoutTables = {
    low: {
      8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
      12: [8.1, 3, 1.9, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.9, 3, 8.1],
      16: [16, 9, 2, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 2, 9, 16] 
    },
    medium: {
      8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
      12: [24, 10, 2, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 2, 10, 24],
      16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110]
    },
    high: {
      8: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
      12: [43, 13, 3, 1.3, 0.7, 0.4, 0.2, 0.4, 0.7, 1.3, 3, 13, 43],
      16: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000]
    }
  };

  const simulateBallDrop = () => {
    const rows = gameSettings.rows;
    let position = 0;
    for (let i = 0; i < rows; i++) {
      position += (Math.random() < 0.5 ? -1 : 1);
    }
    const bucketIndex = Math.round((position + rows) / 2);
    const buckets = payoutTables[gameSettings.riskLevel][rows];
    return Math.max(0, Math.min(buckets.length - 1, bucketIndex));
  };
  
  const handleBet = async (isAutoBet = false) => {
    if (stats.currentBalance < gameSettings.betAmount) {
      if (autoPlaying) {
        stopAutoPlay();
      }
      alert("Insufficient balance!");
      return;
    }
    
    setIsPlaying(true);
    
    const boardWidth = boardRef.current?.offsetWidth || 600;
    const boardHeight = boardRef.current?.offsetHeight || 450;
    
    const bucketIndex = simulateBallDrop();
    const buckets = payoutTables[gameSettings.riskLevel][gameSettings.rows];
    const multiplier = buckets[bucketIndex];
    const payout = gameSettings.betAmount * multiplier;
    const profit = payout - gameSettings.betAmount;

    // Calculate animation path
    const bucketWidth = boardWidth / buckets.length;
    const finalX = (bucketIndex * bucketWidth) + (bucketWidth / 2) - (boardWidth / 2);
    const finalY = boardHeight - 40;

    setActiveBall({
      id: Date.now(),
      path: { x: finalX, y: finalY, duration: 1.5 },
      result: { bucketIndex, multiplier, payout, profit, isAutoBet }
    });
  };

  const onAnimationEnd = () => {
    if (!activeBall) return;
    const { result } = activeBall;
    
    setStats(prev => ({
      ...prev,
      totalBalls: prev.totalBalls + 1,
      totalWagered: prev.totalWagered + gameSettings.betAmount,
      totalPayout: prev.totalPayout + result.payout,
      biggestWin: Math.max(prev.biggestWin, result.payout),
      currentBalance: prev.currentBalance - gameSettings.betAmount + result.payout,
      sessionProfit: result.isAutoBet ? prev.sessionProfit + result.profit : prev.sessionProfit
    }));
    
    setRecentResults(prev => [result, ...prev].slice(0, 20));
    setActiveBall(null);
    setIsPlaying(false);

    if (autoPlaying && result.isAutoBet) {
      setAutoBetsRemaining(prev => prev - 1);
    }
  };

  const startAutoPlay = () => {
    if (stats.currentBalance < gameSettings.betAmount) {
      alert("Insufficient balance to start auto-play!");
      return;
    }
    if (gameSettings.autoBetCount <= 0) {
      alert("Number of bets must be greater than 0.");
      return;
    }

    setAutoPlaying(true);
    setAutoBetsRemaining(gameSettings.autoBetCount);
    setStats(prev => ({ ...prev, sessionProfit: 0 })); // Reset session profit
  };

  const stopAutoPlay = () => {
    setAutoPlaying(false);
    setAutoBetsRemaining(0);
    if (autoIntervalRef.current) {
      clearTimeout(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (autoIntervalRef.current) {
        clearTimeout(autoIntervalRef.current);
      }
    };
  }, []);

  // Auto play logic
  useEffect(() => {
    if (autoPlaying && !isPlaying && autoBetsRemaining > 0) {
        // Check stop conditions immediately before scheduling the next bet
        const sessionProfit = stats.sessionProfit;
        const currentBalance = stats.currentBalance;
        const shouldStopEarly = 
          (gameSettings.stopOnProfit > 0 && sessionProfit >= gameSettings.stopOnProfit) ||
          (gameSettings.stopOnLoss > 0 && sessionProfit <= -gameSettings.stopOnLoss) ||
          currentBalance < gameSettings.betAmount;

        if (shouldStopEarly) {
            stopAutoPlay();
            return;
        }

        autoIntervalRef.current = setTimeout(() => {
            handleBet(true);
        }, 200);
    } else if (autoPlaying && autoBetsRemaining <= 0 && isPlaying === false) {
        stopAutoPlay();
    }
  }, [autoPlaying, isPlaying, autoBetsRemaining, gameSettings.stopOnProfit, gameSettings.stopOnLoss, gameSettings.betAmount, stats.sessionProfit, stats.currentBalance]);


  const getBucketColor = (multiplier) => {
    if (multiplier >= 100) return "bg-red-500";
    if (multiplier >= 10) return "bg-orange-500";
    if (multiplier >= 3) return "bg-yellow-500";
    if (multiplier >= 1.5) return "bg-lime-500";
    if (multiplier >= 1) return "bg-green-500";
    return "bg-blue-500";
  };

  const currentPayouts = payoutTables[gameSettings.riskLevel][gameSettings.rows];

  return (
    <div className="bg-[#0f212e] min-h-screen p-4 sm:p-8">
      <style>
        {`
          @keyframes fall {
            0% { transform: translate(-50%, 0); }
            100% { transform: translate(var(--path-x), var(--path-y)); }
          }
        `}
      </style>
      <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Controls */}
        <div className="lg:col-span-3 bg-[#0f212e]">
          <div className="bg-[#213743] rounded-lg p-4 space-y-4 sticky top-24">
            <div className="grid grid-cols-2 gap-1 bg-[#0f212e] p-1 rounded-md">
              <Button 
                onClick={() => {
                  setGameSettings(s => ({...s, isAuto: false}));
                  if (autoPlaying) stopAutoPlay();
                }}
                className={`w-full h-11 transition-all ${!gameSettings.isAuto ? 'bg-[#2f4553] text-white' : 'bg-transparent text-gray-400 hover:bg-[#2f4553]/50'}`}
              >Manual</Button>
              <Button 
                onClick={() => setGameSettings(s => ({...s, isAuto: true}))}
                className={`w-full h-11 transition-all ${gameSettings.isAuto ? 'bg-[#2f4553] text-white' : 'bg-transparent text-gray-400 hover:bg-[#2f4553]/50'}`}
              >Auto</Button>
            </div>

            <div>
              <Label className="text-gray-400 text-xs font-medium">Bet Amount</Label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  value={gameSettings.betAmount}
                  onChange={(e) => setGameSettings(s => ({...s, betAmount: parseFloat(e.target.value) || 0}))}
                  disabled={autoPlaying}
                  className="bg-[#0f212e] border-[#2f4553] text-white rounded-md h-11 px-3"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     disabled={autoPlaying}
                     className="text-gray-400 hover:bg-[#2f4553] hover:text-white" 
                     onClick={() => setGameSettings(s => ({...s, betAmount: s.betAmount / 2}))}
                   >½</Button>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     disabled={autoPlaying}
                     className="text-gray-400 hover:bg-[#2f4553] hover:text-white" 
                     onClick={() => setGameSettings(s => ({...s, betAmount: s.betAmount * 2}))}
                   >2×</Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs font-medium">Risk</Label>
              <Select 
                value={gameSettings.riskLevel} 
                onValueChange={(value) => setGameSettings(s => ({...s, riskLevel: value}))}
                disabled={autoPlaying}
              >
                <SelectTrigger className="bg-[#0f212e] border-[#2f4553] text-white rounded-md h-11 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#213743] border-[#2f4553] text-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-400 text-xs font-medium">Rows</Label>
              <Select 
                value={gameSettings.rows.toString()} 
                onValueChange={(value) => setGameSettings(s => ({...s, rows: parseInt(value)}))}
                disabled={autoPlaying}
              >
                <SelectTrigger className="bg-[#0f212e] border-[#2f4553] text-white rounded-md h-11 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#213743] border-[#2f4553] text-white">
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auto Play Settings */}
            {gameSettings.isAuto && (
              <div className="space-y-3 pt-2 border-t border-[#2f4553]">
                <div>
                  <Label className="text-gray-400 text-xs font-medium">Number of Bets</Label>
                  <Input
                    type="number"
                    value={gameSettings.autoBetCount}
                    onChange={(e) => setGameSettings(s => ({...s, autoBetCount: parseInt(e.target.value) || 1}))}
                    disabled={autoPlaying}
                    className="bg-[#0f212e] border-[#2f4553] text-white rounded-md h-9 px-3 mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-gray-400 text-xs font-medium">Cashout on Profit</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={autoPlaying ? "0.00 (disabled)" : "0.00"}
                      value={gameSettings.stopOnProfit === 0 ? '' : gameSettings.stopOnProfit}
                      onChange={(e) => setGameSettings(s => ({...s, stopOnProfit: parseFloat(e.target.value) || 0}))}
                      disabled={autoPlaying}
                      className="bg-[#0f212e] border-[#2f4553] text-white rounded-md h-9 px-2 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs font-medium">Stop on Loss</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={autoPlaying ? "0.00 (disabled)" : "0.00"}
                      value={gameSettings.stopOnLoss === 0 ? '' : gameSettings.stopOnLoss}
                      onChange={(e) => setGameSettings(s => ({...s, stopOnLoss: parseFloat(e.target.value) || 0}))}
                      disabled={autoPlaying}
                      className="bg-[#0f212e] border-[#2f4553] text-white rounded-md h-9 px-2 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Bet Button */}
            {gameSettings.isAuto ? (
              autoPlaying ? (
                <div className="space-y-2">
                  <Button
                    onClick={stopAutoPlay}
                    className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold text-base rounded-md"
                  >
                    Stop Auto ({autoBetsRemaining} left)
                  </Button>
                  <div className="text-center text-xs text-gray-400">
                    Session P&L: <span className={stats.sessionProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${stats.sessionProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={startAutoPlay}
                  disabled={isPlaying}
                  className="w-full h-12 bg-green-500 hover:bg-green-600 text-black font-bold text-base rounded-md"
                >
                  Start Auto Play
                </Button>
              )
            ) : (
              <Button
                onClick={() => handleBet(false)}
                disabled={isPlaying}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-black font-bold text-base rounded-md"
              >
                {isPlaying ? "Dropping..." : "Bet"}
              </Button>
            )}
          </div>
        </div>

        {/* Board */}
        <div className="lg:col-span-9 flex flex-col items-center">
          <div ref={boardRef} className="relative w-full max-w-[600px] aspect-[4/3] mb-4">
            {/* Pegs */}
            {Array.from({ length: gameSettings.rows }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="absolute w-full flex justify-center"
                style={{ top: `${(rowIndex + 1) * (100 / (gameSettings.rows + 2))}%` }}
              >
                {Array.from({ length: rowIndex + 2 }).map((_, pegIndex) => (
                  <div
                    key={pegIndex}
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-500/50 rounded-full"
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${(pegIndex - (rowIndex + 1) / 2) * (boardRef.current ? (boardRef.current.offsetWidth * 0.9 / (gameSettings.rows)) : 30)}px)`,
                      transform: 'translateX(-50%)',
                    }}
                  />
                ))}
              </div>
            ))}
            
            {/* Buckets */}
            <div className="absolute bottom-0 w-full flex justify-center gap-1 px-2">
              {currentPayouts.map((multiplier, index) => (
                <div
                  key={index}
                  className={`flex-1 h-8 flex items-center justify-center text-white font-bold text-xs rounded-t-sm rounded-b-md ${getBucketColor(multiplier)}`}
                >
                  {multiplier}x
                </div>
              ))}
            </div>

            {/* Ball */}
            {activeBall && <Ball key={activeBall.id} {...activeBall} onAnimationEnd={onAnimationEnd} />}
          </div>
          
          {/* Stats Bar */}
          <div className="w-full bg-[#213743] rounded-lg p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-white">
              <div>
                <div className="text-xs text-gray-400">Balance</div>
                <div className="text-sm font-semibold">${stats.currentBalance.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Total Profit</div>
                <div className={`text-sm font-semibold ${(stats.totalPayout - stats.totalWagered) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(stats.totalPayout - stats.totalWagered).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Balls Dropped</div>
                <div className="text-sm font-semibold">{stats.totalBalls}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Biggest Win</div>
                <div className="text-sm font-semibold text-yellow-400">${stats.biggestWin.toFixed(2)}</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
