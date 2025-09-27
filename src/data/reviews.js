export const reviews = [
  {
    id: 1,
    platformName: "Rainbet",
    logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center",
    rating: 5,
    bonusInfo: "100% Bonus + 20 Freespins",
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
    affiliateLink: "https://stake.com/?c=aqTVKbe1",
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
];

export const getReviews = (sortBy = "-rating", limit = 20) => {
  let sortedReviews = [...reviews];
  
  if (sortBy === "-rating") {
    sortedReviews.sort((a, b) => b.rating - a.rating);
  }
  
  return sortedReviews.slice(0, limit);
};