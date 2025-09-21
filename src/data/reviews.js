export const reviews = [
  {
    id: 1,
    platformName: "Rainbet",
    logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center",
    rating: 5,
    bonusInfo: "100% Welcome Bonus up to 1 BTC",
    affiliateLink: "https://rainbet.com/?r=stakestrat",
    summary: "Top-rated crypto casino with instant deposits, provably fair games, and the best dice experience. No KYC required.",
    pros: [
      "Instant crypto deposits and withdrawals",
      "Provably fair gaming with full transparency", 
      "No KYC verification required",
      "Low 1% house edge on dice games",
      "Lightning-fast game performance",
      "Mobile-optimized platform"
    ],
    cons: [
      "Crypto-only platform (no fiat)",
      "Limited customer support hours"
    ],
    gamesOffered: ["Dice", "Crash", "Plinko", "Blackjack", "Roulette", "Slots"],
    paymentMethods: ["Bitcoin", "Ethereum", "Litecoin", "Dogecoin"],
    licenseInfo: "Curacao Gaming License",
    establishedYear: 2019,
    minDeposit: "0.001 BTC",
    withdrawalTime: "Instant",
    description: "Rainbet stands out as one of the premier crypto casinos in the market, offering an exceptional gaming experience with a focus on transparency and user satisfaction. The platform's commitment to provably fair gaming ensures that every game outcome can be verified by players, providing unparalleled trust and confidence."
  },
  {
    id: 2,
    platformName: "Stake",
    logoUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=100&h=100&fit=crop&crop=center",
    rating: 4,
    bonusInfo: "Daily Rakeback + Weekly/Monthly Bonuses",
    affiliateLink: "https://stake.com/?c=stakestrat",
    summary: "Popular crypto casino with extensive game selection, active community, and regular promotions. Great for high-volume players.",
    pros: [
      "Huge game selection including originals",
      "Active community and chat features",
      "Regular promotions and bonuses",
      "VIP program with excellent rewards",
      "Sports betting available",
      "Mobile app available"
    ],
    cons: [
      "Higher house edge on some games",
      "Can be overwhelming for beginners",
      "Withdrawal verification required for large amounts"
    ],
    gamesOffered: ["Dice", "Crash", "Plinko", "Mines", "Blackjack", "Roulette", "Slots", "Sports"],
    paymentMethods: ["Bitcoin", "Ethereum", "Litecoin", "Ripple", "Tron"],
    licenseInfo: "Curacao Gaming License",
    establishedYear: 2017,
    minDeposit: "0.0001 BTC",
    withdrawalTime: "1-24 hours",
    description: "Stake has established itself as one of the most recognizable names in crypto gambling, offering a comprehensive platform that caters to both casual players and high rollers. With its extensive game library and active community features, Stake provides an engaging gaming environment."
  },
  {
    id: 3,
    platformName: "BC.Game",
    logoUrl: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=100&h=100&fit=crop&crop=center",
    rating: 4,
    bonusInfo: "300% Welcome Bonus + Free Spins",
    affiliateLink: "https://bc.game/?i=stakestrat",
    summary: "Feature-rich crypto casino with unique games, NFT integration, and comprehensive loyalty program.",
    pros: [
      "Unique and innovative games",
      "NFT marketplace integration",
      "Comprehensive loyalty program",
      "Multiple cryptocurrency support",
      "Regular tournaments and events",
      "Social features and chat"
    ],
    cons: [
      "Interface can be complex",
      "Some games have higher house edge",
      "Customer support response times vary"
    ],
    gamesOffered: ["Dice", "Crash", "Plinko", "Mines", "Limbo", "Blackjack", "Slots"],
    paymentMethods: ["Bitcoin", "Ethereum", "BNB", "Cardano", "Solana"],
    licenseInfo: "Curacao Gaming License",
    establishedYear: 2017,
    minDeposit: "0.0001 BTC",
    withdrawalTime: "Instant - 1 hour",
    description: "BC.Game offers a modern approach to crypto gambling with innovative features and a diverse game portfolio. The platform's integration of NFTs and social elements creates a unique gaming ecosystem that appeals to crypto enthusiasts."
  },
  {
    id: 4,
    platformName: "Roobet",
    logoUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop&crop=center",
    rating: 4,
    bonusInfo: "Deposit Bonus + Daily Rewards",
    affiliateLink: "https://roobet.com/?ref=stakestrat",
    summary: "Modern crypto casino with sleek design, exclusive games, and strong focus on user experience.",
    pros: [
      "Modern and intuitive interface",
      "Exclusive Roobet original games",
      "Fast gameplay and loading times",
      "Active social media presence",
      "Regular promotional events",
      "Responsive customer support"
    ],
    cons: [
      "Limited game selection compared to competitors",
      "Restricted in many jurisdictions",
      "Higher minimum bets on some games"
    ],
    gamesOffered: ["Crash", "Dice", "Blackjack", "Roulette", "Slots"],
    paymentMethods: ["Bitcoin", "Ethereum", "Litecoin"],
    licenseInfo: "Curacao Gaming License", 
    establishedYear: 2019,
    minDeposit: "0.001 BTC",
    withdrawalTime: "Instant - 30 minutes",
    description: "Roobet has quickly gained popularity for its polished user experience and focus on quality over quantity. The platform's exclusive games and modern design make it particularly appealing to younger crypto gambling enthusiasts."
  }
];

export const getReviews = (sortBy = "-rating", limit = 20) => {
  let sortedReviews = [...reviews];
  
  if (sortBy === "-rating") {
    sortedReviews.sort((a, b) => b.rating - a.rating);
  }
  
  return sortedReviews.slice(0, limit);
};