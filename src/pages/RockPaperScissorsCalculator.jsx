
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Hand, Sparkles, Trophy, RotateCcw } from 'lucide-react';

export default function RockPaperScissorsCalculator() {
  const [betAmount, setBetAmount] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [gameState, setGameState] = useState('betting'); // betting, playing, result
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [balance, setBalance] = useState(1000);
  const [totalProfit, setTotalProfit] = useState(0);

  const choices = [
    { id: 'rock', name: 'Rock', emoji: '🪨', icon: '✊' },
    { id: 'paper', name: 'Paper', emoji: '📄', icon: '✋' },
    { id: 'scissors', name: 'Scissors', emoji: '✂️', icon: '✌️' }
  ];

  const getWinner = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) return 'tie';
    if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const calculateMultiplier = (streakCount) => {
    // Exponential multiplier based on winning streak
    return Math.pow(1.98, streakCount);
  };

  const playRound = (playerChoice) => {
    if (balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    setSelectedChoice(playerChoice);
    setGameState('playing');

    // Simulate thinking time
    setTimeout(() => {
      const computerChoice = choices[Math.floor(Math.random() * 3)].id;
      setComputerChoice(computerChoice);
      
      const gameResult = getWinner(playerChoice, computerChoice);
      setResult(gameResult);

      let newStreak = streak;
      let payout = 0;
      let profit = -betAmount; // Start with bet loss

      if (gameResult === 'win') {
        newStreak = streak + 1;
        const multiplier = calculateMultiplier(newStreak);
        payout = betAmount * multiplier;
        profit = payout - betAmount;
        setCurrentMultiplier(multiplier);
      } else if (gameResult === 'lose') {
        newStreak = 0;
        setCurrentMultiplier(1);
      } else {
        // Tie - return bet
        profit = 0;
        payout = betAmount;
      }

      setStreak(newStreak);
      setBalance(prev => prev + profit);
      setTotalProfit(prev => prev + profit);

      // Add to history
      const historyEntry = {
        id: Date.now(),
        playerChoice,
        computerChoice,
        result: gameResult,
        multiplier: gameResult === 'win' ? calculateMultiplier(newStreak) : 0,
        profit: profit.toFixed(2),
        streak: newStreak
      };

      setGameHistory(prev => [historyEntry, ...prev.slice(0, 19)]);
      setGameState('result');
    }, 1500);
  };

  const continueGame = () => {
    if (result === 'lose') {
      setStreak(0);
      setCurrentMultiplier(1);
    }
    resetRound();
  };

  const cashOut = () => {
    if (streak > 0) {
      const cashoutAmount = betAmount * currentMultiplier;
      const profit = cashoutAmount - betAmount;
      setBalance(prev => prev + profit);
      setTotalProfit(prev => prev + profit);
      
      setGameHistory(prev => [{
        id: Date.now(),
        playerChoice: 'cashout',
        computerChoice: null,
        result: 'cashout',
        multiplier: currentMultiplier,
        profit: profit.toFixed(2),
        streak: streak
      }, ...prev.slice(0, 19)]);
    }
    
    setStreak(0);
    setCurrentMultiplier(1);
    resetRound();
  };

  const resetRound = () => {
    setSelectedChoice(null);
    setComputerChoice(null);
    setResult(null);
    setGameState('betting');
  };

  const resetGame = () => {
    setBalance(1000);
    setTotalProfit(0);
    setStreak(0);
    setCurrentMultiplier(1);
    setGameHistory([]);
    resetRound();
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Hand className="w-12 h-12 mx-auto text-blue-500 mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Best Stake & Rainbet RPS Calculator
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the classic game with exponential multipliers! Win consecutive rounds to build massive multipliers up to 1,000,000x your bet.
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
          {/* Game Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Game Settings</h2>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-700 font-medium">Current Multiplier</div>
                  <div className="text-3xl font-bold text-blue-900">{currentMultiplier.toFixed(2)}x</div>
                  <div className="text-xs text-blue-600">Win Streak: {streak}</div>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium text-sm">Bet Amount</Label>
                <Input
                  type="number"
                  value={betAmount}
                  onChange={e => setBetAmount(parseFloat(e.target.value) || 0)}
                  disabled={gameState !== 'betting'}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Balance</div>
                  <div className="text-lg font-bold text-gray-900">${balance.toFixed(2)}</div>
                </div>
                <div className="text-center bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Total P&L</div>
                  <div className={`text-lg font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${totalProfit.toFixed(2)}
                  </div>
                </div>
              </div>

              {streak > 0 && gameState === 'betting' && (
                <Button
                  onClick={cashOut}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
                >
                  Cash Out ${(betAmount * currentMultiplier).toFixed(2)}
                </Button>
              )}

              <Button
                onClick={resetGame}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Game
              </Button>
            </div>
          </div>

          {/* Game Area */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Your Move</h2>
              
              {/* Choice Selection */}
              {gameState === 'betting' && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {choices.map(choice => (
                    <button
                      key={choice.id}
                      onClick={() => playRound(choice.id)}
                      className="p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
                    >
                      <div className="text-6xl mb-4">{choice.icon}</div>
                      <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                        {choice.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Game in Progress */}
              {gameState === 'playing' && (
                <div className="text-center py-12">
                  <div className="animate-pulse text-4xl mb-4">🤔</div>
                  <div className="text-xl font-semibold text-gray-700">Thinking...</div>
                  <div className="text-sm text-gray-500 mt-2">Computer is making a choice</div>
                </div>
              )}

              {/* Game Result */}
              {gameState === 'result' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-8 text-center">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">You Chose</div>
                      <div className="text-6xl mb-2">
                        {choices.find(c => c.id === selectedChoice)?.icon}
                      </div>
                      <div className="text-lg font-semibold">
                        {choices.find(c => c.id === selectedChoice)?.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Computer Chose</div>
                      <div className="text-6xl mb-2">
                        {choices.find(c => c.id === computerChoice)?.icon}
                      </div>
                      <div className="text-lg font-semibold">
                        {choices.find(c => c.id === computerChoice)?.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-6 rounded-xl border-2 border-gray-200">
                    {result === 'win' && (
                      <div className="text-green-600">
                        <Trophy className="w-12 h-12 mx-auto mb-4" />
                        <div className="text-2xl font-bold">YOU WIN!</div>
                        <div className="text-lg">Multiplier: {currentMultiplier.toFixed(2)}x</div>
                        <div className="text-sm text-gray-600">Win Streak: {streak}</div>
                      </div>
                    )}
                    {result === 'lose' && (
                      <div className="text-red-600">
                        <div className="text-4xl mb-4">😞</div>
                        <div className="text-2xl font-bold">YOU LOSE!</div>
                        <div className="text-sm text-gray-600">Streak Reset</div>
                      </div>
                    )}
                    {result === 'tie' && (
                      <div className="text-yellow-600">
                        <div className="text-4xl mb-4">🤝</div>
                        <div className="text-2xl font-bold">IT'S A TIE!</div>
                        <div className="text-sm text-gray-600">Bet Returned</div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={continueGame}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
                  >
                    {result === 'lose' ? 'Start New Streak' : 'Continue Playing'}
                  </Button>
                </div>
              )}

              {/* Game History */}
              {gameHistory.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Games</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {gameHistory.map((game) => (
                      <div key={game.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {game.playerChoice === 'cashout' ? (
                            <span className="text-green-600 font-semibold">💰 CASH OUT</span>
                          ) : (
                            <>
                              <span className="text-lg">
                                {choices.find(c => c.id === game.playerChoice)?.icon}
                              </span>
                              <span className="text-gray-400">vs</span>
                              <span className="text-lg">
                                {choices.find(c => c.id === game.computerChoice)?.icon}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            game.result === 'win' || game.result === 'cashout' ? 'text-green-600' :
                            game.result === 'lose' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {game.result === 'cashout' ? 'CASH OUT' : game.result.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {game.multiplier > 0 ? `${game.multiplier.toFixed(2)}x` : ''} ${game.profit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-20 max-w-4xl mx-auto bg-white p-10 rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Master Crypto Rock Paper Scissors Strategy</h2>
          <div className="space-y-6 text-gray-600">
            <p>
              If you're looking for an original crypto casino creation that offers simple gameplay with an exciting element of strategy, then <span className="font-semibold">Rock Paper Scissors</span> is for you. This thrilling and fun game provides plenty of action with every round, with the potential to win up to <span className="font-bold text-green-600">1,027,604.48x</span> your bet!
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 pt-4">How to Play Rock Paper Scissors</h3>
            <p>
              Rock Paper Scissors is a timeless game that is played around the world! Now you can experience this nostalgic game in a whole new way, thanks to modern crypto casinos. The game mechanics are simple but the strategy runs deep:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Rock beats Scissors</strong> - The classic crushing victory</li>
              <li><strong>Scissors beats Paper</strong> - Cut through to victory</li>
              <li><strong>Paper beats Rock</strong> - Wrap up the win</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 pt-4">Winning Streak Multipliers</h3>
            <p>
              The key to massive wins in crypto Rock Paper Scissors is building winning streaks. Each consecutive win multiplies your potential payout exponentially:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>1 Win:</strong> 1.98x multiplier</li>
              <li><strong>2 Wins:</strong> 3.92x multiplier</li>
              <li><strong>5 Wins:</strong> 30.4x multiplier</li>
              <li><strong>10 Wins:</strong> 983x multiplier</li>
              <li><strong>20 Wins:</strong> Over 1 million multiplier!</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 pt-4">Strategic Considerations</h3>
            <p>While each round is determined by random number generation ensuring fairness, strategic thinking about when to cash out becomes crucial:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Conservative Strategy:</strong> Cash out after 2-3 wins for consistent profits</li>
              <li><strong>Balanced Strategy:</strong> Target 5-7 win streaks for substantial returns</li>
              <li><strong>High-Risk Strategy:</strong> Go for 10+ win streaks for life-changing multipliers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 pt-4">Bankroll Management</h3>
            <p>With Rock Paper Scissors offering such explosive potential, proper bankroll management is essential:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Never bet more than 1-2% of your total bankroll per round</li>
              <li>Set clear cash-out targets before starting your session</li>
              <li>Use our calculator above to simulate different strategies</li>
              <li>Remember that longer streaks become exponentially harder to achieve</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 pt-4">RTP and House Edge</h3>
            <p>
              Rock Paper Scissors offers an impressive <span className="font-semibold text-green-600">98.00% RTP</span> with only a 2.00% house edge. This makes it one of the most player-friendly games in many crypto casino collections, especially when combined with the exponential multiplier system.
            </p>

            <p className="pt-4 font-medium text-gray-700">
              Use our Rock Paper Scissors calculator above to test different strategies and understand the risk-reward dynamics before playing with real money. Remember to always gamble responsibly and within your means.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
