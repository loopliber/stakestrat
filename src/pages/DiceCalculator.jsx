
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dice1, Calculator, TrendingUp, AlertTriangle, Target, Sparkles, HelpCircle, SlidersHorizontal, Play, Pause, RotateCcw, Download, BarChart3 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export default function DiceCalculator() {
  // Martingale Strategy Settings
  const [martingaleSettings, setMartingaleSettings] = useState({
    startingBankroll: 1000,
    baseBet: 1,
    martingaleMultiplier: 2.0,
    winChance: 49.5,
    useStopOnProfit: false,
    stopOnProfit: 100,
    useStopOnLoss: false,
    stopOnLoss: 500,
    maxSimulations: 1000,
    simulationSpeed: 'medium'
  });

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState({
    currentBankroll: 1000,
    currentBet: 1,
    totalBets: 0,
    wins: 0,
    losses: 0,
    longestWinStreak: 0,
    longestLossStreak: 0,
    currentWinStreak: 0,
    currentLossStreak: 0,
    largestBet: 1,
    totalWagered: 0,
    netProfit: 0,
    startTime: null,
    sessionHistory: []
  });

  // Advanced Analytics
  const [analytics, setAnalytics] = useState({
    ruinProbability: 0,
    expectedValue: 0,
    breakevenPoint: 0,
    maxSustainableLosses: 0,
    projectedProfit: 0,
    riskRating: 'Medium'
  });

  // Multiple Sessions Storage
  const [savedSessions, setSavedSessions] = useState([]);
  const [sessionResults, setSessionResults] = useState([]); // This state seems unused, keep it for now.
  const simulationRef = useRef(null); // Ref for the setTimeout ID

  // Refs for isSimulating and isPaused to ensure `processBatch` always has the latest state without being recreated
  const isSimulatingRef = useRef(isSimulating);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isSimulatingRef.current = isSimulating;
  }, [isSimulating]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Interactive Dice Game State (keeping the existing simple game)
  const [gameBalance, setGameBalance] = useState(100000);
  const [betAmount, setBetAmount] = useState(1);
  const [winChance, setWinChance] = useState(49.5);
  const [rollOver, setRollOver] = useState(50.50);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);

  // Calculate Advanced Analytics with useCallback to fix dependency issue
  const calculateAdvancedAnalytics = useCallback(() => {
    const { startingBankroll, baseBet, martingaleMultiplier, winChance } = martingaleSettings;

    // Calculate maximum sustainable losses
    let maxLosses = 0;
    // Ensure initial bet is possible
    if (startingBankroll < baseBet) {
        maxLosses = 0; // Cannot even place the first bet
    } else {
        // Calculate how many losses can be sustained before bankroll cannot cover next bet
        let currentBankrollForLosses = startingBankroll;
        let currentBetAmountForLosses = baseBet;
        while (currentBankrollForLosses >= currentBetAmountForLosses) {
          maxLosses++;
          currentBankrollForLosses -= currentBetAmountForLosses;
          currentBetAmountForLosses *= martingaleMultiplier;
        }
    }

    // Ruin probability calculation
    const lossChance = (100 - winChance) / 100;
    // Probability of losing 'maxLosses' times in a row
    const ruinProb = maxLosses > 0 ? Math.pow(lossChance, maxLosses) * 100 : 100; // If maxLosses is 0, ruin is certain

    // Expected value calculation
    const payoutFactor = 99 / winChance; // This factor applies to the *profit* ratio (e.g., win 1 for 1 bet at 50% means 2x payout, profit is 1, so payoutFactor is 2)
    const expectedValuePerBet = (winChance / 100) * (baseBet * (payoutFactor - 1)) - (lossChance * baseBet); // EV for one base bet

    // Risk rating
    let riskRating = 'Low';
    if (ruinProb > 5) riskRating = 'Medium'; // Adjusted thresholds for realism
    if (ruinProb > 15) riskRating = 'High';
    if (ruinProb > 30) riskRating = 'Extreme';

    setAnalytics({
      ruinProbability: ruinProb.toFixed(4),
      expectedValue: expectedValuePerBet.toFixed(6),
      // Breakeven point: number of bets needed for expected profit to cover base bet.
      // This is less meaningful in Martingale, as EV per bet is negative.
      // Let's make it more about total projected profit over max simulations.
      // Or, could be the number of initial wins needed to break even before a loss.
      // For now, keep as original but understand its limitations for martingale.
      breakevenPoint: expectedValuePerBet < 0 ? Math.ceil(Math.abs(startingBankroll / expectedValuePerBet)) : 0, // Bets to lose bankroll if EV is negative
      maxSustainableLosses: maxLosses,
      projectedProfit: expectedValuePerBet * martingaleSettings.maxSimulations, // Over max simulations
      riskRating
    });
  }, [martingaleSettings, setAnalytics]);

  // Call calculateAdvancedAnalytics when it changes (which is only when its dependencies change)
  useEffect(() => {
    calculateAdvancedAnalytics();
  }, [calculateAdvancedAnalytics]);


  // Refactored stopSimulation to be a useCallback and manage simulation state
  const stopSimulation = useCallback(() => {
    // Only clear timeout and save if simulation was actually active.
    if (simulationRef.current) {
      clearTimeout(simulationRef.current);
      simulationRef.current = null;
    }

    setIsSimulating(false); // Set simulation status to false
    setIsPaused(false);     // Ensure paused status is also false

    // Use functional update for `setCurrentSession` to ensure we get the latest state for saving
    setCurrentSession(prevSession => {
      // Only save if a session was actually started, had bets, and isn't already saved.
      // Prevents saving empty sessions or duplicate entries if stop is called multiple times.
      if (prevSession.startTime && prevSession.totalBets > 0 && !savedSessions.some(s => s.id === prevSession.startTime)) {
        const completedSession = { ...prevSession, endTime: Date.now(), id: prevSession.startTime };
        setSavedSessions(prevSaved => [completedSession, ...prevSaved.slice(0, 9)]); // Limit to 10 saved sessions
      }
      return prevSession; // Return the current session state as is
    });
  }, [savedSessions]); // `savedSessions` is a dependency for the `savedSessions.some` check


  // Refactored runSimulation to use useCallback and refs for stable state access
  const runSimulation = useCallback(() => {
    const { winChance, martingaleMultiplier, useStopOnProfit, stopOnProfit, useStopOnLoss, stopOnLoss, maxSimulations } = martingaleSettings;

    const processBatch = () => {
      // Use functional update for `setCurrentSession` to ensure `prevSession` is always the latest.
      setCurrentSession(prevSession => {
        // Check global simulation state (isSimulating, isPaused) directly via refs.
        // This is crucial to immediately respond to user actions like pause/stop
        // even if the `setTimeout` for this batch was scheduled earlier.
        if (!isSimulatingRef.current || isPausedRef.current) {
          if (simulationRef.current) clearTimeout(simulationRef.current); // Clear any pending timeouts
          return prevSession; // Return the current state without further processing.
        }

        let tempSim = { ...prevSession };
        const batchSize = martingaleSettings.simulationSpeed === 'fast' ? 100 :
                          martingaleSettings.simulationSpeed === 'medium' ? 10 : 1;

        let simulationEndedInBatch = false; // Flag to indicate if a terminal condition was met *within* this batch's loop

        for (let i = 0; i < batchSize && tempSim.totalBets < maxSimulations; i++) {
          // Check terminal stop conditions *before* placing the bet for this iteration.
          // If any met, set flag and break the loop. The actual `stopSimulation` will be called by `useEffect` later.
          if (tempSim.currentBankroll <= 0 ||
              (useStopOnProfit && tempSim.netProfit >= stopOnProfit) ||
              (useStopOnLoss && Math.abs(tempSim.netProfit) >= stopOnLoss)) {
            simulationEndedInBatch = true;
            break; // Break out of the current batch loop
          }

          // Check for insufficient funds *before* placing a bet. This is also a terminal condition.
          if (tempSim.currentBankroll < tempSim.currentBet) {
            simulationEndedInBatch = true;
            break; // Break out of the current batch loop
          }

          // --- Perform a single bet simulation ---
          const isWin = Math.random() < (winChance / 100);
          tempSim.totalBets++;
          tempSim.totalWagered += tempSim.currentBet;

          const rollResult = {
            betNumber: tempSim.totalBets,
            betAmount: tempSim.currentBet,
            isWin,
            rollValue: parseFloat((Math.random() * 100).toFixed(2)), // For display, actual roll doesn't matter for win/loss
            profit: 0,
            bankrollAfter: 0
          };

          if (isWin) {
            const payout = tempSim.currentBet * (99 / winChance); // Payout includes original bet
            const profit = payout - tempSim.currentBet; // Actual profit
            tempSim.currentBankroll += profit;
            tempSim.netProfit += profit;
            tempSim.wins++;
            tempSim.currentWinStreak++;
            tempSim.currentLossStreak = 0;
            tempSim.longestWinStreak = Math.max(tempSim.longestWinStreak, tempSim.currentWinStreak);

            // Reset to base bet after a win
            tempSim.currentBet = martingaleSettings.baseBet;

            rollResult.profit = profit;
          } else {
            tempSim.currentBankroll -= tempSim.currentBet;
            tempSim.netProfit -= tempSim.currentBet;
            tempSim.losses++;
            tempSim.currentLossStreak++;
            tempSim.currentWinStreak = 0;
            tempSim.longestLossStreak = Math.max(tempSim.longestLossStreak, tempSim.currentLossStreak);

            rollResult.profit = -tempSim.currentBet;

            // Increase bet according to martingale multiplier
            tempSim.currentBet *= martingaleMultiplier;
            tempSim.largestBet = Math.max(tempSim.largestBet, tempSim.currentBet);
          }

          rollResult.bankrollAfter = tempSim.currentBankroll;
          // Keep only the last 500 history items for performance and display
          tempSim.sessionHistory = [...tempSim.sessionHistory, rollResult].slice(-500);
        }

        // --- After processing the batch, decide if simulation should continue ---
        const isSimulationFinished = simulationEndedInBatch || // A terminal condition was met inside the loop
                                     tempSim.totalBets >= maxSimulations || // Max simulations reached
                                     tempSim.currentBankroll <= 0 || // Bankroll busted
                                     (useStopOnProfit && tempSim.netProfit >= stopOnProfit) || // Profit target reached
                                     (useStopOnLoss && Math.abs(tempSim.netProfit) >= stopOnLoss) || // Loss limit reached
                                     tempSim.currentBankroll < tempSim.currentBet; // Insufficient funds for the *next* bet

        if (!isSimulationFinished) {
          const delay = martingaleSettings.simulationSpeed === 'fast' ? 10 :
                        martingaleSettings.simulationSpeed === 'medium' ? 100 : 300;
          simulationRef.current = setTimeout(processBatch, delay); // Schedule the next batch
        } else {
          // Simulation is finished from this batch's perspective.
          // The `useEffect` below will detect this final state of `currentSession`
          // and trigger the `stopSimulation` cleanup.
        }

        return tempSim; // Return the updated session state
      });
    };

    // Initial call to start the batch processing. Use setTimeout 0 to allow the component to render
    // the "running" state immediately before the first batch processes.
    simulationRef.current = setTimeout(processBatch, 0);
  }, [martingaleSettings]); // `martingaleSettings` are dependencies for `runSimulation`

  // New useEffect hook to detect when the simulation has reached a terminal condition
  // and then call `stopSimulation` for proper cleanup and saving.
  useEffect(() => {
    // Only proceed if a simulation is currently marked as running.
    if (isSimulating) {
      const { maxSimulations, useStopOnProfit, stopOnProfit, useStopOnLoss, stopOnLoss } = martingaleSettings;
      const { totalBets, currentBankroll, netProfit, currentBet } = currentSession;

      // Re-evaluate all terminal conditions based on the *latest* `currentSession` state.
      const simulationFinished = totalBets >= maxSimulations ||
                                 currentBankroll <= 0 ||
                                 (useStopOnProfit && netProfit >= stopOnProfit) ||
                                 (useStopOnLoss && Math.abs(netProfit) >= stopOnLoss) ||
                                 // Check for insufficient funds for the *next* bet, but only after at least one bet was placed
                                 // to prevent immediate stop if startingBankroll < baseBet initially but baseBet was adjusted
                                 (currentBankroll < currentBet && totalBets > 0);

      if (simulationFinished) {
        stopSimulation(); // Call the stable `stopSimulation` function for cleanup and saving.
      }
    }
  }, [isSimulating, currentSession, martingaleSettings, stopSimulation]); // Dependencies: state variables and the stable `stopSimulation` function

  const startMartingaleSimulation = () => {
    // Reset simulation state and then start.
    resetSimulation(); // Ensure previous session is cleared
    setIsSimulating(true);
    setIsPaused(false);

    // Initialize session with current martingale settings
    const newSession = {
      currentBankroll: martingaleSettings.startingBankroll,
      currentBet: martingaleSettings.baseBet,
      totalBets: 0,
      wins: 0,
      losses: 0,
      longestWinStreak: 0,
      longestLossStreak: 0,
      currentWinStreak: 0,
      currentLossStreak: 0,
      largestBet: martingaleSettings.baseBet,
      totalWagered: 0,
      netProfit: 0,
      startTime: Date.now(), // Add startTime for session identification
      sessionHistory: []
    };

    setCurrentSession(newSession);
    // Start the simulation loop, which will pick up the newSession state
    runSimulation();
  };

  // pauseSimulation logic remains mostly the same, now `runSimulation` is useCallback
  const pauseSimulation = useCallback(() => {
    setIsPaused(prev => {
        const nextPausedState = !prev;
        if (nextPausedState) { // If pausing, clear any pending timeouts
            if (simulationRef.current) {
                clearTimeout(simulationRef.current);
                simulationRef.current = null;
            }
        } else { // If resuming
            // Ensure simulation is indeed active before attempting to resume the run loop
            if (isSimulatingRef.current) { // Check ref for latest `isSimulating` state
                // Schedule the next batch to continue the simulation
                // A small delay ensures state updates (like `isPaused` becoming false) propagate
                setTimeout(() => runSimulation(), 50);
            }
        }
        return nextPausedState;
    });
  }, [runSimulation]); // `runSimulation` is now a dependency as it's called here

  const resetSimulation = () => {
    // If a simulation is active or paused, stop it first
    if (isSimulating || isPaused) {
      stopSimulation(); // This will clear timeouts, set isSimulating/isPaused to false, and save if applicable
    }

    // Reset current session state to initial values
    setCurrentSession({
      currentBankroll: martingaleSettings.startingBankroll,
      currentBet: martingaleSettings.baseBet,
      totalBets: 0,
      wins: 0,
      losses: 0,
      longestWinStreak: 0,
      longestLossStreak: 0,
      currentWinStreak: 0,
      currentLossStreak: 0,
      largestBet: martingaleSettings.baseBet,
      totalWagered: 0,
      netProfit: 0,
      startTime: null, // Clear startTime for a fresh session
      sessionHistory: []
    });
    // Ensure simulation state is definitively reset
    setIsSimulating(false);
    setIsPaused(false);
  };

  const exportSessionData = () => {
    const dataStr = JSON.stringify(savedSessions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `martingale_sessions_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Simple dice game functions (keeping existing functionality)
  const updateWinChance = (newWinChance) => {
    setWinChance(newWinChance);
    setRollOver((100 - newWinChance).toFixed(2));
  };

  const rollDice = () => {
    if (gameBalance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setIsRolling(true);

    setTimeout(() => {
      const rollResult = Math.random() * 100;
      const isWin = rollResult > parseFloat(rollOver);
      const multiplier = 99 / winChance;

      let profit = 0;
      let newBalance = gameBalance;

      if (isWin) {
        profit = betAmount * (multiplier - 1);
        newBalance = gameBalance + profit;
      } else {
        profit = -betAmount;
        newBalance = gameBalance - betAmount;
      }

      setGameBalance(newBalance);
      setTotalProfit(prev => prev + profit);

      const rollData = {
        id: Date.now(),
        roll: rollResult.toFixed(2),
        target: rollOver,
        isWin,
        multiplier: multiplier.toFixed(4),
        betAmount,
        profit: profit.toFixed(2),
        balance: newBalance.toFixed(2)
      };

      setLastRoll(rollData);
      setGameHistory(prev => [rollData, ...prev.slice(0, 9)]);
      setIsRolling(false);
    }, 1000);
  };

  const resetGame = () => {
    setGameBalance(100000);
    setTotalProfit(0);
    setGameHistory([]);
    setLastRoll(null);
  };

  const multiplier = (99 / winChance).toFixed(4);
  const winRate = currentSession.totalBets > 0 ? (currentSession.wins / currentSession.totalBets * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-4">
            <Dice1 className="w-4 h-4 mr-2" />
            <span>Free Stake & Rainbet Dice Calculator</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-3">
            Best Stake Dice Calculator Free - Rainbet Dice Strategy Simulator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional <strong>Stake dice calculator free</strong> tool and <strong>Rainbet dice calculator</strong>. Advanced <strong>crypto dice strategy</strong> simulator with <strong>Martingale calculator</strong>, risk analysis, and real-time probability calculations. No signup required - start optimizing your <strong>Stake dice strategy</strong> now.
          </p>
        </div>

        {/* Rainbet Promotion Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-12 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-semibold mb-3">
                <Sparkles className="w-4 h-4 mr-2" />
                Featured Partner
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">Rainbet Dice Calculator Free - Test Your Strategy</h2>
              <p className="text-blue-100 mb-4">
                Perfect your <strong>Rainbet dice strategy</strong> with our free calculator, then play on <strong>Rainbet</strong> - the fastest crypto casino with <strong>Rainbet demo mode</strong>, instant deposits, and provably fair games. Get your <strong>Rainbet sign up bonus</strong> today.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 text-sm text-blue-100">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Instant Crypto Deposits
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Provably Fair Games
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  No KYC Required
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://rainbet.com/?r=stakestrat"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg text-center whitespace-nowrap"
              >
                🎲 Play Dice Now
              </a>
              <div className="text-center text-xs text-blue-200">
                Exclusive StakeStrat bonus available
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Martingale Settings Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-purple-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Martingale Settings</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium text-sm">Starting Bankroll</Label>
                  <Input
                    type="number"
                    value={martingaleSettings.startingBankroll}
                    onChange={(e) => setMartingaleSettings({...martingaleSettings, startingBankroll: parseFloat(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium text-sm">Base Bet</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={martingaleSettings.baseBet}
                    onChange={(e) => setMartingaleSettings({...martingaleSettings, baseBet: parseFloat(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2 block text-sm">
                  Martingale Multiplier: <span className="text-purple-600 font-bold">{martingaleSettings.martingaleMultiplier}x</span>
                </Label>
                <Slider
                  value={[martingaleSettings.martingaleMultiplier]}
                  onValueChange={(value) => setMartingaleSettings({...martingaleSettings, martingaleMultiplier: value[0]})}
                  min={1.1}
                  max={5.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1.1x</span>
                  <span>5.0x</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2 block text-sm">
                  Win Chance: <span className="text-green-600 font-bold">{martingaleSettings.winChance}%</span>
                </Label>
                <Slider
                  value={[martingaleSettings.winChance]}
                  onValueChange={(value) => setMartingaleSettings({...martingaleSettings, winChance: value[0]})}
                  min={1}
                  max={95}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1%</span>
                  <span>95%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useStopOnProfit"
                      checked={martingaleSettings.useStopOnProfit}
                      onCheckedChange={(checked) => setMartingaleSettings({ ...martingaleSettings, useStopOnProfit: checked })}
                    />
                    <label htmlFor="useStopOnProfit" className="text-sm font-medium text-gray-700 leading-none">
                      Stop on Profit
                    </label>
                  </div>
                  {martingaleSettings.useStopOnProfit && (
                    <Input
                      type="number"
                      value={martingaleSettings.stopOnProfit}
                      onChange={(e) => setMartingaleSettings({ ...martingaleSettings, stopOnProfit: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useStopOnLoss"
                      checked={martingaleSettings.useStopOnLoss}
                      onCheckedChange={(checked) => setMartingaleSettings({ ...martingaleSettings, useStopOnLoss: checked })}
                    />
                    <label htmlFor="useStopOnLoss" className="text-sm font-medium text-gray-700 leading-none">
                      Stop on Loss
                    </label>
                  </div>
                  {martingaleSettings.useStopOnLoss && (
                    <Input
                      type="number"
                      value={martingaleSettings.stopOnLoss}
                      onChange={(e) => setMartingaleSettings({ ...martingaleSettings, stopOnLoss: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium text-sm">Max Simulations</Label>
                  <Input
                    type="number"
                    value={martingaleSettings.maxSimulations}
                    onChange={(e) => setMartingaleSettings({...martingaleSettings, maxSimulations: parseInt(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium text-sm">Simulation Speed</Label>
                  <Select
                    value={martingaleSettings.simulationSpeed}
                    onValueChange={(value) => setMartingaleSettings({...martingaleSettings, simulationSpeed: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-2">
                {!isSimulating ? (
                  <Button
                    onClick={startMartingaleSimulation}
                    className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Simulation
                  </Button>
                ) : (
                  <Button
                    onClick={pauseSimulation}
                    className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                )}
                <Button
                  onClick={resetSimulation}
                  variant="outline"
                  className="px-4 py-3"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Risk Assessment Dashboard */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mt-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Risk Assessment</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Ruin Probability</span>
                  <span className="font-bold text-red-600">{analytics.ruinProbability}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Max Safe Losses</span>
                  <span className="font-bold text-orange-600">{analytics.maxSustainableLosses}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Expected Value</span>
                  <span className={`font-bold ${parseFloat(analytics.expectedValue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${analytics.expectedValue}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Risk Rating</span>
                  <span className={`font-bold px-2 py-1 rounded text-sm ${
                    analytics.riskRating === 'Low' ? 'bg-green-100 text-green-700' :
                    analytics.riskRating === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    analytics.riskRating === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {analytics.riskRating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Results & Analytics */}
          <div className="lg:col-span-8 space-y-6">
            {/* Real-time Session Statistics */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Live Session Statistics</h2>
                </div>
                {savedSessions.length > 0 && (
                  <Button onClick={exportSessionData} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <div className="text-2xl font-bold text-gray-900">${currentSession.currentBankroll.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Current Bankroll</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <div className={`text-2xl font-bold ${currentSession.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${currentSession.netProfit.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">Net Profit</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <div className="text-2xl font-bold text-gray-900">{currentSession.totalBets}</div>
                  <div className="text-sm text-gray-500">Total Bets</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <div className="text-2xl font-bold text-gray-900">{winRate}%</div>
                  <div className="text-sm text-gray-500">Win Rate</div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{currentSession.wins}</div>
                  <div className="text-xs text-gray-500">Wins</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{currentSession.losses}</div>
                  <div className="text-xs text-gray-500">Losses</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">${currentSession.largestBet.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Largest Bet</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{currentSession.longestLossStreak}</div>
                  <div className="text-xs text-gray-500">Max Loss Streak</div>
                </div>
              </div>

              {/* Progress indicators */}
              {isSimulating && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress: {currentSession.totalBets} / {martingaleSettings.maxSimulations}</span>
                    <span>{isPaused ? 'Paused' : 'Running...'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(currentSession.totalBets / martingaleSettings.maxSimulations) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Simulation History */}
            {currentSession.sessionHistory.length > 0 && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Bets</h3>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {currentSession.sessionHistory.slice(-20).reverse().map((bet, index) => (
                    <div key={bet.betNumber} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-gray-500">#{bet.betNumber}</span>
                        <span className={`px-2 py-1 rounded font-semibold ${
                          bet.isWin ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {bet.isWin ? 'WIN' : 'LOSS'}
                        </span>
                        <span className="font-medium">${bet.betAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`font-bold ${bet.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${bet.profit.toFixed(2)}
                        </span>
                        <span className="text-gray-500">${bet.bankrollAfter.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Sessions */}
            {savedSessions.length > 0 && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Previous Sessions</h3>
                <div className="space-y-3">
                  {savedSessions.map((session, index) => (
                    <div key={session.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">Session {index + 1}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(session.startTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`font-bold ${session.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${session.netProfit.toFixed(2)}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>Bets: {session.totalBets}</div>
                        <div>W/L: {session.wins}/{session.losses}</div>
                        <div>Max Bet: ${session.largestBet.toFixed(2)}</div>
                        <div>Loss Streak: {session.longestLossStreak}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Simple Interactive Dice Game (keeping existing) */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Play className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Quick Dice Test</h2>
            <div className="ml-auto text-right">
              <div className="text-sm text-gray-500">Demo Wallet</div>
              <div className="text-lg font-bold text-gray-900">${gameBalance.toFixed(2)}</div>
            </div>
          </div>

          <div className="grid xl:grid-cols-3 gap-8">
            {/* Game Controls */}
            <div className="xl:col-span-1 space-y-6">
              <div>
                <Label className="text-gray-700 font-medium mb-2 block text-sm">Bet Amount</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                    disabled={isRolling}
                    className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg px-4 py-2"
                  />
                  <Button
                    onClick={() => setBetAmount(prev => Math.max(0.01, prev / 2))}
                    disabled={isRolling}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >½</Button>
                  <Button
                    onClick={() => setBetAmount(prev => prev * 2)}
                    disabled={isRolling}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >2×</Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-3 block text-sm">
                  Win Chance: <span className="font-bold text-blue-600">{winChance}%</span>
                </Label>
                <Slider
                  value={[parseFloat(winChance)]}
                  onValueChange={(value) => updateWinChance(value[0].toFixed(2))}
                  min={1}
                  max={98}
                  step={0.01}
                  disabled={isRolling}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1%</span>
                  <span>98%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Multiplier</div>
                  <div className="text-xl font-bold text-blue-600 mt-1">{multiplier}x</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Roll Over</div>
                  <div className="text-xl font-bold text-orange-600 mt-1">{rollOver}</div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={resetGame}
                  variant="outline"
                  size="sm"
                  disabled={isRolling}
                  className="w-full text-gray-600 border-gray-300 hover:bg-gray-100"
                >
                  Reset Demo Wallet ($100,000)
                </Button>
              </div>
            </div>

            {/* Game Display */}
            <div className="xl:col-span-2">
              <div className="text-center mb-6">
                <Button
                  onClick={rollDice}
                  disabled={isRolling || gameBalance < betAmount}
                  className="bg-green-600 text-white font-bold px-8 py-4 text-lg rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md"
                >
                  {isRolling ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Rolling...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Dice1 className="w-6 h-6" />
                      <span>Roll Dice</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Last Roll Result */}
              {lastRoll && (
                <div className={`text-center p-6 rounded-xl border-2 mb-6 ${
                  lastRoll.isWin ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="text-4xl font-bold mb-2">
                    {lastRoll.roll}
                  </div>
                  <div className={`text-xl font-bold mb-2 ${
                    lastRoll.isWin ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {lastRoll.isWin ? 'WIN!' : 'LOSS'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Roll {lastRoll.isWin ? '>' : '≤'} {lastRoll.target} •
                    Profit: <span className={`font-bold ${
                      parseFloat(lastRoll.profit) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${lastRoll.profit}
                    </span>
                  </div>
                </div>
              )}

              {/* Game Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                  <div className="text-sm text-gray-500">Total Profit</div>
                  <div className={`text-lg font-bold ${
                    totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${totalProfit.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                  <div className="text-sm text-gray-500">Games Played</div>
                  <div className="text-lg font-bold text-gray-900">{gameHistory.length}</div>
                </div>
              </div>

              {/* Game History */}
              {gameHistory.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Rolls</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {gameHistory.map((game) => (
                      <div key={game.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            game.isWin ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {game.isWin ? 'WIN' : 'LOSS'}
                          </span>
                          <span className="text-sm font-mono">{game.roll}</span>
                          <span className="text-xs text-gray-500">{game.multiplier}x</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            parseFloat(game.profit) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${game.profit}
                          </div>
                          <div className="text-xs text-gray-500">${game.balance}</div>
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
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <HelpCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Understanding Advanced Martingale Strategy</h2>
                <p className="text-gray-500">Professional-grade analysis and risk management tools.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Play with Real Money?</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  After testing your strategies with our calculator, you can apply them on <a href="https://rainbet.com/?r=stakestrat" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold">Rainbet's Dice game</a>. Rainbet offers one of the most trusted and fastest crypto gambling experiences with:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 text-gray-600 mb-6">
                  <li><strong>Instant Deposits:</strong> Start playing immediately with crypto</li>
                  <li><strong>Provably Fair:</strong> Verify every roll is completely fair</li>
                  <li><strong>Low House Edge:</strong> Only 1% house edge on dice games</li>
                  <li><strong>No Registration Hassle:</strong> Play without lengthy KYC processes</li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-800 font-semibold">Exclusive StakeStrat Bonus</p>
                      <p className="text-blue-600 text-sm">Get special bonuses when you sign up through our link</p>
                    </div>
                    <a
                      href="https://rainbet.com/?r=stakestrat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Claim Bonus
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Features for Professional Analysis</h3>
                <ul className="list-disc list-inside space-y-2 pl-4 text-gray-600">
                  <li><strong>Real-time Risk Assessment:</strong> Live calculation of ruin probability and risk ratings</li>
                  <li><strong>Advanced Simulation Engine:</strong> Run thousands of rounds with customizable speed and stop conditions</li>
                  <li><strong>Comprehensive Analytics:</strong> Track streaks, win rates, and betting patterns</li>
                  <li><strong>Data Export:</strong> Save and analyze session data for long-term strategy development</li>
                  <li><strong>Custom Multipliers:</strong> Test different martingale progressions beyond simple doubling</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Understanding the Risks</h3>
                <p className="text-gray-600 leading-relaxed">
                  The Martingale system is fundamentally flawed due to the combination of limited bankrolls and table limits. Our calculator shows you exactly why: even with a 95% win chance, the probability of hitting a losing streak that bankrupts your account is significant. Use this tool to understand the mathematics before risking real money.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Rainbet Promotion at Bottom */}
        <div className="max-w-4xl mx-auto mt-12">
        {/* SEO Content Section */}
        <div className="mt-16 mb-12">
          <div className="bg-white rounded-2xl p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Complete Guide to Stake &amp; Rainbet Dice Calculator Strategies
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Stake Dice Calculator Features</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>Stake dice calculator free</strong> - No registration required</li>
                  <li>• <strong>Best stake dice calculator</strong> with advanced Martingale simulation</li>
                  <li>• <strong>Stake dice strategy</strong> optimization and backtesting</li>
                  <li>• <strong>Stake dice simulator</strong> for risk-free strategy testing</li>
                  <li>• <strong>Stake dice bot</strong> strategy development tools</li>
                  <li>• Real-time probability and risk analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">🌧️ Rainbet Dice Calculator Benefits</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>Rainbet dice calculator free</strong> with professional features</li>
                  <li>• Perfect for <strong>Rainbet demo mode</strong> strategy preparation</li>
                  <li>• Optimized for <strong>Rainbet dice</strong> game mechanics</li>
                  <li>• Calculate optimal bets for <strong>Rainbet sign up bonus</strong></li>
                  <li>• Reddit-approved calculator trusted by <strong>dice rainbet reddit</strong> community</li>
                  <li>• Works where <strong>Rainbet legal</strong> and accessible</li>
                </ul>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Our Dice Calculator is the Best Choice</h3>
              <p className="text-gray-600 mb-4">
                Our <strong>crypto dice calculator</strong> combines advanced mathematical modeling with real-time simulation capabilities. Whether you're developing a <strong>Stake dice strategy</strong> or testing <strong>Rainbet dice</strong> approaches, our tool provides the analytical depth you need.
              </p>
              <p className="text-gray-600 mb-4">
                Unlike simple probability calculators, our <strong>dice strategy simulator</strong> accounts for bankroll management, streak analysis, and risk assessment. The <strong>Martingale calculator</strong> feature helps you understand the true risks of progressive betting systems.
              </p>
              <p className="text-gray-600">
                Featured on <strong>Reddit</strong> gambling communities and trusted by thousands of crypto casino players worldwide. Start with our free calculator, then apply your optimized strategies on <strong>Stake</strong> or <strong>Rainbet</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12">
          <div className="bg-gray-900 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Test Your Dice Strategy?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              You've calculated the odds with the <strong>best Stake dice calculator</strong> and <strong>Rainbet dice calculator free</strong> tool. Now it's time to put your optimized <strong>crypto dice strategy</strong> to work on a real platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://rainbet.com/?r=stakestrat"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-300 shadow-lg"
              >
                🚀 Start Playing on Rainbet
              </a>
              <div className="text-gray-400 text-sm">
                Trusted by thousands • Instant payouts • Provably fair
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
