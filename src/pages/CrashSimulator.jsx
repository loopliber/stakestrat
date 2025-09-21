import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrendingUp, Play, RotateCcw, Settings } from "lucide-react";

export default function CrashSimulator() {
  const [gameState, setGameState] = useState("waiting"); // waiting, playing, crashed
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(0);
  
  const [settings, setSettings] = useState({
    betAmount: 1,
    autoCashout: 2.0,
    balance: 1000,
  });

  const [stats, setStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    totalProfit: 0,
    currentBalance: 1000,
    winStreak: 0,
    lossStreak: 0
  });

  const [gameHistory, setGameHistory] = useState([]);
  const intervalRef = useRef(null);

  const generateCrashPoint = () => {
    // House edge implementation - realistic crash point generation
    const houseEdge = 0.01; // 1% house edge
    const random = Math.random();
    
    // Mathematical model for crash point generation
    const adjustedRandom = Math.max(0.01, random * (1 - houseEdge));
    const crashPoint = 1 / adjustedRandom;
    
    return Math.min(crashPoint, 10000); // Cap at 10000x
  };

  const startGame = () => {
    if (stats.currentBalance < settings.betAmount) {
      alert("Insufficient balance!");
      return;
    }

    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setMultiplier(1.00);
    setGameState("playing");

    setStats(prev => ({
      ...prev,
      currentBalance: prev.currentBalance - settings.betAmount
    }));

    intervalRef.current = setInterval(() => {
      setMultiplier(current => {
        const increment = current < 2 ? 0.01 : current < 10 ? 0.02 : 0.05;
        const newMultiplier = current + increment;
        
        if (newMultiplier >= newCrashPoint) {
          clearInterval(intervalRef.current);
          crashGame();
          return newCrashPoint;
        }
        
        // Auto cashout check
        if (settings.autoCashout && newMultiplier >= settings.autoCashout) {
          clearInterval(intervalRef.current);
          cashOut(settings.autoCashout);
          return settings.autoCashout;
        }
        
        return newMultiplier;
      });
    }, 100);
  };

  const cashOut = (multiplierAtCashout = multiplier) => {
    if (gameState !== "playing") return;
    
    clearInterval(intervalRef.current);
    setGameState("waiting");
    
    const winAmount = settings.betAmount * multiplierAtCashout;
    const profit = winAmount - settings.betAmount;
    
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      wins: prev.wins + 1,
      totalProfit: prev.totalProfit + profit,
      currentBalance: prev.currentBalance + winAmount,
      winStreak: prev.winStreak + 1,
      lossStreak: 0
    }));

    setGameHistory(prev => [...prev, {
      game: prev.length + 1,
      crashPoint: crashPoint.toFixed(2),
      cashoutAt: multiplierAtCashout.toFixed(2),
      result: "WIN",
      profit: profit.toFixed(2)
    }].slice(-10));
  };

  const crashGame = () => {
    setGameState("crashed");
    
    const profit = -settings.betAmount;
    
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      losses: prev.losses + 1,
      totalProfit: prev.totalProfit + profit,
      winStreak: 0,
      lossStreak: prev.lossStreak + 1
    }));

    setGameHistory(prev => [...prev, {
      game: prev.length + 1,
      crashPoint: crashPoint.toFixed(2),
      cashoutAt: "0.00",
      result: "LOSS",
      profit: profit.toFixed(2)
    }].slice(-10));

    setTimeout(() => {
      setGameState("waiting");
    }, 2000);
  };

  const resetGame = () => {
    clearInterval(intervalRef.current);
    setGameState("waiting");
    setMultiplier(1.00);
    setCrashPoint(0);
  };

  const resetStats = () => {
    setStats({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      totalProfit: 0,
      currentBalance: settings.balance,
      winStreak: 0,
      lossStreak: 0
    });
    setGameHistory([]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-600 font-semibold text-sm mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Free Stake & Rainbet Crash Simulator</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
            Stake Crash Calculator - Free Rainbet Crash Game Simulator
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional <strong>Stake crash simulator</strong> and <strong>Rainbet crash calculator</strong>. Test your <strong>crypto crash strategies</strong> with real-time multiplier tracking, auto-cashout features, and risk analysis. Perfect for <strong>Stake</strong> and <strong>Rainbet</strong> crash game preparation.
          </p>
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          {/* Game Display */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className={`text-6xl lg:text-8xl font-bold mb-4 transition-colors duration-300 ${
                    gameState === "playing" ? "text-green-600" : 
                    gameState === "crashed" ? "text-red-600" : "text-gray-800"
                  }`}>
                    {multiplier.toFixed(2)}x
                  </div>
                  
                  {gameState === "crashed" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl lg:text-6xl font-bold text-red-600 animate-pulse">
                        CRASHED!
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-gray-500 text-lg mb-8 font-medium h-7">
                  {gameState === "waiting" && "Ready to launch"}
                  {gameState === "playing" && "🚀 Flying..."}
                  {gameState === "crashed" && `💥 Crashed at ${crashPoint.toFixed(2)}x`}
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  {gameState === "waiting" && (
                    <Button
                      onClick={startGame}
                      disabled={stats.currentBalance < settings.betAmount}
                      size="lg"
                      className="bg-gray-900 text-white font-bold px-8 py-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 shadow-md w-full sm:w-auto"
                    >
                      🚀 Launch Game
                    </Button>
                  )}
                  
                  {gameState === "playing" && (
                    <Button
                      onClick={() => cashOut()}
                      size="lg"
                      className="bg-orange-500 text-white font-bold px-8 py-6 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-md"
                    >
                      💰 Cash Out {multiplier.toFixed(2)}x
                    </Button>
                  )}

                  <Button
                    onClick={resetGame}
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Game History */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Games</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {gameHistory.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="font-medium">No games played yet</p>
                  </div>
                ) : (
                  [...gameHistory].reverse().map((game) => (
                    <div key={game.game} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-500 font-medium text-sm">#{game.game}</span>
                        <span className="text-gray-800 font-semibold text-sm">Crashed: {game.crashPoint}x</span>
                        <span className="text-gray-800 font-semibold text-sm">Cashed: {game.cashoutAt}x</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          game.result === "WIN" ? 
                          "bg-green-100 text-green-700" : 
                          "bg-red-100 text-red-700"
                        }`}>
                          {game.result}
                        </span>
                        <span className={`font-bold text-sm ${
                          parseFloat(game.profit) >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          ${game.profit}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Settings & Stats */}
          <div className="space-y-6">
            {/* Settings */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Game Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block text-sm">Bet Amount ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.betAmount}
                    onChange={(e) => setSettings({...settings, betAmount: parseFloat(e.target.value)})}
                    className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block text-sm">Auto Cashout At</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.autoCashout}
                    onChange={(e) => setSettings({...settings, autoCashout: parseFloat(e.target.value)})}
                    className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block text-sm">Starting Balance ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.balance}
                    onChange={(e) => setSettings({...settings, balance: parseFloat(e.target.value)})}
                    className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Session Statistics</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="text-gray-500 text-sm font-medium mb-1">Current Balance</div>
                  <div className="text-2xl font-bold text-gray-900">${stats.currentBalance.toFixed(2)}</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="text-gray-500 text-sm font-medium mb-1">Total Profit/Loss</div>
                  <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${stats.totalProfit.toFixed(2)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                    <div className="text-lg font-bold text-gray-900">{stats.gamesPlayed}</div>
                    <div className="text-gray-500 text-sm font-medium">Games</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-gray-500 text-sm font-medium">Win Rate</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                    <div className="text-lg font-bold text-green-600">{stats.winStreak}</div>
                    <div className="text-gray-500 text-sm font-medium">Win Streak</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                    <div className="text-lg font-bold text-red-600">{stats.lossStreak}</div>
                    <div className="text-gray-500 text-sm font-medium">Loss Streak</div>
                  </div>
                </div>

                <Button
                  onClick={resetStats}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Reset Statistics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}