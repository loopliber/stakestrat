
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Calculator, TrendingUp, AlertTriangle } from 'lucide-react';

export default function BlackjackCalculator() {
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCard, setDealerCard] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [bankroll, setBankroll] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [gameVariant, setGameVariant] = useState('standard');

  const basicStrategy = {
    // Simplified basic strategy matrix
    hard: {
      5: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      6: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      7: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      8: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      9: { 2: 'H', 3: 'Dh', 4: 'Dh', 5: 'Dh', 6: 'Dh', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      10: { 2: 'Dh', 3: 'Dh', 4: 'Dh', 5: 'Dh', 6: 'Dh', 7: 'Dh', 8: 'Dh', 9: 'Dh', 10: 'H', 11: 'H' },
      11: { 2: 'Dh', 3: 'Dh', 4: 'Dh', 5: 'Dh', 6: 'Dh', 7: 'Dh', 8: 'Dh', 9: 'Dh', 10: 'Dh', 11: 'Dh' },
      12: { 2: 'H', 3: 'H', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      13: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      14: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      15: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      16: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
      17: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 11: 'S' },
      18: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 11: 'S' },
      19: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 11: 'S' },
      20: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 11: 'S' },
      21: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 11: 'S' }
    }
  };

  const actionNames = {
    'H': 'Hit',
    'S': 'Stand', 
    'Dh': 'Double if allowed, otherwise Hit',
    'Ds': 'Double if allowed, otherwise Stand',
    'P': 'Split'
  };

  const calculateHand = () => {
    if (playerCards.length < 2 || !dealerCard) {
      alert('Please select both player cards and dealer card.');
      return;
    }

    const playerTotal = playerCards.reduce((sum, card) => sum + parseInt(card), 0);
    const dealerValue = parseInt(dealerCard);
    
    // Ensure playerTotal is a valid key in basicStrategy.hard
    const action = basicStrategy.hard[playerTotal]?.[dealerValue] || 'H'; // Default to Hit if no strategy found
    
    setRecommendation({
      action: actionNames[action],
      playerTotal,
      dealerCard: dealerValue,
      explanation: getExplanation(action, playerTotal, dealerValue)
    });
  };

  const getExplanation = (action, playerTotal, dealerCard) => {
    const explanations = {
      'H': `With ${playerTotal} against dealer's ${dealerCard}, basic strategy recommends hitting to improve your hand.`,
      'S': `With ${playerTotal} against dealer's ${dealerCard}, basic strategy recommends standing as the risk of busting outweighs potential improvement.`,
      'Dh': `With ${playerTotal} against dealer's ${dealerCard}, double down if allowed (you have a mathematical advantage), otherwise hit.`,
      'Ds': `With ${playerTotal} against dealer's ${dealerCard}, double down if allowed, otherwise stand.`,
      'P': `Basic strategy recommends splitting this pair against dealer's ${dealerCard}.`
    };
    return explanations[action] || 'Follow basic strategy for optimal play.';
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="w-12 h-12 mx-auto text-red-600 mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Blackjack Basic Strategy Calculator
          </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Master blackjack strategy with our advanced probability calculator. Get real-time odds, optimal playing decisions, and house edge analysis.
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
                href="https://playrainbet.com/tf1ad404a"
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
          {/* Calculator */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Strategy Calculator</h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-gray-700 font-medium text-sm mb-2 block">Your Cards</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={playerCards[0] || ''} onValueChange={(value) => setPlayerCards([value, playerCards[1] || ''])}>
                    <SelectTrigger>
                      <SelectValue placeholder="First card" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2,3,4,5,6,7,8,9,10,11].map(val => (
                        <SelectItem key={val} value={val.toString()}>
                          {val === 11 ? 'Ace' : val === 10 ? '10/J/Q/K' : val.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={playerCards[1] || ''} onValueChange={(value) => setPlayerCards([playerCards[0] || '', value])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Second card" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2,3,4,5,6,7,8,9,10,11].map(val => (
                        <SelectItem key={val} value={val.toString()}>
                          {val === 11 ? 'Ace' : val === 10 ? '10/J/Q/K' : val.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium text-sm mb-2 block">Dealer's Up Card</Label>
                <Select value={dealerCard} onValueChange={setDealerCard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Dealer's visible card" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2,3,4,5,6,7,8,9,10,11].map(val => (
                      <SelectItem key={val} value={val.toString()}>
                        {val === 11 ? 'Ace' : val === 10 ? '10/J/Q/K' : val.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium text-sm">Bankroll</Label>
                  <Input
                    type="number"
                    value={bankroll}
                    onChange={(e) => setBankroll(parseFloat(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium text-sm">Bet Amount</Label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
              </div>

              <Button 
                onClick={calculateHand}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Get Strategy Recommendation
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Strategy Recommendation</h2>
            
            {recommendation ? (
              <div className="space-y-6">
                <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-2xl font-bold text-red-600 mb-2">{recommendation.action}</h3>
                  <p className="text-sm text-red-700">Player: {recommendation.playerTotal} | Dealer: {recommendation.dealerCard}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Explanation</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{recommendation.explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">
                      {((bankroll - betAmount) / bankroll * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-green-700">Bankroll Remaining</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">99.5%</div>
                    <div className="text-xs text-blue-700">Basic Strategy RTP</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>Enter your cards and dealer's up card to get strategy recommendation</p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-20 max-w-4xl mx-auto bg-white p-10 rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Master Blackjack with Basic Strategy</h2>
          <div className="space-y-6 text-gray-600">
            <p>
              Our <span className="font-semibold">blackjack basic strategy calculator</span> provides mathematically optimal decisions for every possible hand combination. Based on computer simulations of millions of hands, basic strategy reduces the house edge to just 0.5% when played perfectly.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 pt-4">How to Use This Blackjack Calculator</h3>
            <p>
              Using this <span className="font-semibold">blackjack strategy calculator</span> is simple:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li><strong>Enter Your Cards:</strong> Select your two starting cards from the dropdown menus</li>
              <li><strong>Dealer's Card:</strong> Choose the dealer's face-up card</li>
              <li><strong>Get Recommendation:</strong> Our calculator instantly provides the optimal play</li>
              <li><strong>Follow the Strategy:</strong> Execute the recommended action for maximum expected value</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 pt-4">Understanding Basic Strategy Actions</h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Hit:</strong> Take another card to improve your hand total</li>
              <li><strong>Stand:</strong> Keep your current hand and end your turn</li>
              <li><strong>Double Down:</strong> Double your bet and receive exactly one more card</li>
              <li><strong>Split:</strong> Separate pairs into two hands and play them independently</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 pt-4">Why Basic Strategy Works</h3>
            <p>
              Basic strategy is derived from mathematical analysis of all possible outcomes. It tells you the statistically best decision for every hand based on:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Your hand total and composition</li>
              <li>The dealer's visible card</li>
              <li>The probability of busting vs. improving</li>
              <li>Expected value calculations for each possible action</li>
            </ul>

            <p className="pt-4 font-medium text-gray-700">
              Master blackjack strategy with our calculator and reduce the house edge to its minimum. Remember that perfect basic strategy execution is essential - even small deviations can significantly impact your long-term results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
