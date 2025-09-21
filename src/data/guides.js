export const guides = [
  {
    id: 1,
    title: "Complete Guide to Dice Strategy",
    slug: "dice-strategy-guide",
    category: "Dice",
    summary: "Master the art of dice betting with our comprehensive strategy guide. Learn probability calculations, bankroll management, and risk assessment.",
    content: `# Complete Guide to Dice Strategy

## Introduction

Dice games are among the most popular crypto casino games due to their simplicity and potential for strategic play. This guide will teach you everything you need to know about dice strategy.

## Understanding Dice Mechanics

### House Edge
Most dice games have a house edge of around 1%. This means that for every $100 you bet, you can expect to lose $1 over the long term.

### Probability Calculations
The probability of winning a dice bet depends on the range you choose:
- Higher chance = Lower payout
- Lower chance = Higher payout

## Basic Strategies

### 1. Martingale Strategy
The Martingale strategy involves doubling your bet after each loss. While this can work short-term, it requires a large bankroll and has unlimited risk.

### 2. Anti-Martingale Strategy
This strategy involves doubling your bet after each win and returning to base bet after a loss. This limits your losses while maximizing winning streaks.

### 3. Flat Betting
Betting the same amount consistently. This is the safest approach for long-term play.

## Risk Management

### Bankroll Management
- Never bet more than 1-5% of your total bankroll on a single bet
- Set stop-loss limits
- Take profits when you're ahead

### Emotional Control
- Don't chase losses
- Stick to your strategy
- Take breaks during losing streaks

## Conclusion

Remember that no strategy can overcome the house edge in the long run. Play responsibly and never bet more than you can afford to lose.`,
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    publishedDate: "2024-03-15T10:00:00Z",
    author: "StakeStrat Team"
  },
  {
    id: 2,
    title: "Crash Game Strategy and Analysis",
    slug: "crash-game-strategy",
    category: "Crash",
    summary: "Learn how to maximize your chances in crash games with proven strategies, timing techniques, and bankroll management.",
    content: `# Crash Game Strategy and Analysis

## What Are Crash Games?

Crash games involve betting on a multiplier that increases over time. The challenge is to cash out before the game "crashes" and you lose your bet.

## Key Strategies

### Early Cash Out Strategy
- Cash out at low multipliers (1.5x - 2x)
- Higher win rate but smaller profits
- Good for conservative players

### High Risk Strategy
- Target high multipliers (5x+)
- Lower win rate but bigger profits
- Requires excellent bankroll management

### Auto Cash Out
- Set automatic cash out points
- Removes emotion from decision making
- Helps stick to your strategy

## Advanced Techniques

### Pattern Recognition
While crashes are random, some players track patterns to inform their decisions.

### Bankroll Scaling
Adjust your bet size based on your current bankroll and recent performance.

## Conclusion

Crash games are highly volatile. Only play with money you can afford to lose and always set strict limits.`,
    featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    publishedDate: "2024-03-10T14:30:00Z",
    author: "StakeStrat Team"
  },
  {
    id: 3,
    title: "Plinko Optimization Guide",
    slug: "plinko-optimization",
    category: "Plinko",
    summary: "Discover the best Plinko strategies, risk levels, and betting patterns to optimize your gameplay and maximize returns.",
    content: `# Plinko Optimization Guide

## Understanding Plinko

Plinko is a game of chance where a ball drops through pegs and lands in slots with different multipliers.

## Risk Levels

### Low Risk
- Safer but lower potential returns
- Good for beginners
- More consistent outcomes

### Medium Risk
- Balanced risk and reward
- Most popular choice
- Moderate volatility

### High Risk
- Maximum potential returns
- High volatility
- Requires strong bankroll management

## Betting Strategies

### Progressive Betting
Increase bets during winning streaks, decrease during losing streaks.

### Flat Betting
Consistent bet amounts for predictable variance.

## Tips for Success

1. Understand the RTP for each risk level
2. Set clear profit and loss limits
3. Don't chase losses
4. Take regular breaks

## Conclusion

Plinko is purely based on chance, but proper bankroll management and understanding risk levels can help optimize your experience.`,
    featuredImage: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800&h=400&fit=crop",
    publishedDate: "2024-03-05T09:15:00Z",
    author: "StakeStrat Team"
  }
];

export const getGuideBySlug = (slug) => {
  return guides.find(guide => guide.slug === slug);
};

export const getGuides = (sortBy = "-created_date", limit = 50) => {
  let sortedGuides = [...guides];
  
  if (sortBy === "-created_date") {
    sortedGuides.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  }
  
  return sortedGuides.slice(0, limit);
};