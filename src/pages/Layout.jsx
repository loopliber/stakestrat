

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Dice1, TrendingUp, Zap, Target, Calculator, Home, BookOpen, Star, Newspaper, Gift, Shield, Bomb, GitCompareArrows, RotateCcw, Grid3X3, Hand, Heart } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  // SEO-optimized page titles and meta descriptions
  const seoConfig = {
    "Home": {
      title: "Crypto Casino Strategy Calculators & Betting Tips | CryptoStrat Guide",
      description: "Master crypto casino games with our advanced calculators and strategy guides. Free tools for Dice, Crash, Plinko, Limbo, Mines and more. Expert betting tips and mathematical analysis."
    },
    "DiceCalculator": {
      title: "Crypto Dice Calculator & Martingale Strategy Tool | Free Calculator",
      description: "Professional Crypto Dice Calculator with Martingale analysis. Calculate probabilities, optimize betting strategies, and understand risk for Dice and Limbo games. 100% free tool."
    },
    "CrashSimulator": {
      title: "Crypto Crash Game Simulator & Strategy Calculator | Real-Time Analysis",
      description: "Advanced Crypto Crash simulator with auto-cashout optimization. Test strategies, analyze multipliers, and master the crash game with our professional tools."
    },
    "PlinkoSimulator": {
      title: "Crypto Plinko Simulator & Strategy Calculator | Physics-Based Tool",
      description: "Realistic Plinko physics simulator with comprehensive strategy analysis. Calculate odds, test betting patterns, and optimize your Plinko game performance."
    },
    "LimboCalculator": {
      title: "Crypto Limbo Calculator & Under/Over Strategy Tool | House Edge Analysis",
      description: "Professional Limbo calculator with mathematical modeling. Analyze under/over betting strategies, calculate house edge, and optimize your approach with precise tools."
    },
    "MinesCalculator": {
      title: "Crypto Mines Calculator & Strategy Tool | Free Probability Calculator",
      description: "Advanced Mines game calculator with probability analysis. Calculate multipliers, analyze risk levels, and develop winning strategies for Crypto Mines."
    },
    "ArbitrageCalculator": {
      title: "Arbitrage Betting Calculator | Risk-Free Profit Calculator",
      description: "Professional arbitrage calculator for risk-free betting opportunities. Calculate stakes, guaranteed profits, and arbitrage percentages across different bookmakers."
    },
    "WheelCalculator": {
      title: "Crypto Wheel Calculator & Strategy Guide | Spin Analysis Tool",
      description: "Comprehensive Wheel calculator with risk analysis. Calculate potential winnings, analyze payout structures, and optimize your Wheel of Fortune strategy."
    },
    "KenoCalculator": {
      title: "Crypto Keno Calculator & Number Selection Strategy | Odds Calculator",
      description: "Professional Keno calculator with optimal number selection strategies. Calculate odds, analyze payouts, and improve your Keno game performance."
    },
    "RockPaperScissorsCalculator": {
      title: "Crypto Rock Paper Scissors Calculator | Multiplier Strategy Tool",
      description: "Advanced RPS calculator with exponential multiplier analysis. Build winning streaks up to 1,027,604x your bet with our strategic tools."
    },
    "BlackjackCalculator": {
      title: "Blackjack Basic Strategy Calculator | Perfect Play Chart",
      description: "Professional blackjack basic strategy calculator with optimal play recommendations. Reduce house edge and master perfect blackjack strategy."
    },
    "PokerOddsCalculator": {
      title: "Poker Odds Calculator | Hand Equity & Pot Odds Tool",
      description: "Advanced poker odds calculator with real-time equity analysis. Calculate hand strengths, pot odds, and make optimal decisions in Texas Hold'em."
    },
    "Guides": {
      title: "Casino Strategy Guides & Gambling Tips | Expert Analysis",
      description: "Comprehensive casino strategy guides with expert tips. Learn advanced techniques, bankroll management, and winning strategies for all popular casino games."
    },
    "Reviews": {
      title: "Honest Casino Reviews & Platform Comparisons | 2024 Guide",
      description: "Unbiased casino reviews and platform comparisons. Find the best gambling sites with detailed analysis of bonuses, games, and payment methods."
    },
    "Promotions": {
      title: "Best Casino Promotions & Bonus Offers | Updated Daily",
      description: "Discover the best casino promotions and bonus offers. Compare welcome bonuses, free spins, and exclusive deals from top gambling platforms."
    },
    "ResponsibleGambling": {
      title: "Responsible Gambling Guide | Safe Gaming Practices",
      description: "Essential responsible gambling guide with safety tips, self-exclusion tools, and resources for problem gambling. Learn to gamble safely and responsibly."
    }
  };

  const currentSEO = seoConfig[currentPageName] || seoConfig["Home"];

  // Update page title and meta tags
  React.useEffect(() => {
    document.title = currentSEO.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = currentSEO.description;

    // Add viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1';
      document.head.appendChild(viewport);
    }

    // Add robots meta tag
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
      document.head.appendChild(robots);
    }

    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    // Add Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: currentSEO.title },
      { property: 'og:description', content: currentSEO.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:site_name', content: 'StakeStrat' },
      { property: 'og:locale', content: 'en_US' }
    ];

    ogTags.forEach(tag => {
      let ogMeta = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', tag.property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.content = tag.content;
    });

    // Add Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: currentSEO.title },
      { name: 'twitter:description', content: currentSEO.description }
    ];

    twitterTags.forEach(tag => {
      let twitterMeta = document.querySelector(`meta[name="${tag.name}"]`);
      if (!twitterMeta) {
        twitterMeta = document.createElement('meta');
        twitterMeta.name = tag.name;
        document.head.appendChild(twitterMeta);
      }
      twitterMeta.content = tag.content;
    });

    // Add JSON-LD structured data
    let existingJsonLd = document.querySelector('script[type="application/ld+json"]');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "StakeStrat",
      "description": "Professional crypto casino strategy calculators and gambling guides",
      "url": "https://cryptostrat.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://cryptostrat.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "StakeStrat",
        "logo": {
          "@type": "ImageObject",
          "url": "https://cryptostrat.com/logo.png"
        }
      }
    };

    if (currentPageName !== "Home") {
      structuredData["@type"] = "WebPage";
      structuredData.name = currentSEO.title;
      structuredData.description = currentSEO.description;
    }

    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.textContent = JSON.stringify(structuredData);
    document.head.appendChild(jsonLdScript);

  }, [currentPageName, currentSEO]);

  const mainNav = [
    { title: "Home", url: createPageUrl("Home"), icon: Home },
    { title: "Dice", url: createPageUrl("DiceCalculator"), icon: Dice1 },
    { title: "Crash", url: createPageUrl("CrashSimulator"), icon: TrendingUp },
    { title: "Plinko", url: createPageUrl("PlinkoSimulator"), icon: Target },
    { title: "Limbo", url: createPageUrl("LimboCalculator"), icon: Zap },
    { title: "Mines", url: createPageUrl("MinesCalculator"), icon: Bomb },
    { title: "Wheel", url: createPageUrl("WheelCalculator"), icon: RotateCcw },
    { title: "Keno", url: createPageUrl("KenoCalculator"), icon: Grid3X3 },
    { title: "RPS", url: createPageUrl("RockPaperScissorsCalculator"), icon: Hand },
    { title: "Arbitrage", url: createPageUrl("ArbitrageCalculator"), icon: GitCompareArrows },
    { title: "Blackjack", url: createPageUrl("BlackjackCalculator"), icon: Heart },
    { title: "Poker", url: createPageUrl("PokerOddsCalculator"), icon: Heart },
  ];
  
  const contentNav = [
    { title: "Guides", url: createPageUrl("Guides"), icon: BookOpen },
    { title: "Reviews", url: createPageUrl("Reviews"), icon: Star },
    { title: "Promotions", url: createPageUrl("Promotions"), icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3" title="StakeStrat - Crypto Casino Strategy Calculators">
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">StakeStrat</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
              {mainNav.slice(0, 8).map((item) => (
                <Link 
                  key={item.title} 
                  to={item.url} 
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${location.pathname === item.url ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                  title={`${item.title} Calculator - StakeStrat`}
                >
                  {item.title}
                </Link>
              ))}
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              {contentNav.map((item) => (
                <Link 
                  key={item.title} 
                  to={item.url} 
                  className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${location.pathname.startsWith(item.url) ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                  title={`${item.title} - StakeStrat`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Open mobile menu"
              title="Open navigation menu"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-4 6H4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20" role="contentinfo">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">StakeStrat</h2>
              </div>
              <p className="text-gray-500 text-sm max-w-xs mb-4">
                Professional crypto casino strategy calculators, in-depth guides, and honest reviews to improve your gambling strategy and decision-making.
              </p>
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} StakeStrat. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Casino Tools</h3>
              <ul className="mt-4 space-y-2">
                {mainNav.slice(1, 8).map(item => (
                  <li key={item.title}>
                    <Link 
                      to={item.url} 
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                      title={`${item.title} Calculator`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Strategy Tools</h3>
              <ul className="mt-4 space-y-2">
                {mainNav.slice(8).map(item => (
                  <li key={item.title}>
                    <Link 
                      to={item.url} 
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                      title={`${item.title} Calculator`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

             <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Content</h3>
              <ul className="mt-4 space-y-2">
                {contentNav.map(item => (
                  <li key={item.title}>
                    <Link 
                      to={item.url} 
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                      title={`${item.title} - StakeStrat`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal & Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link 
                    to={createPageUrl("ResponsibleGambling")} 
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    title="Responsible Gambling Resources"
                  >
                    Responsible Gambling
                  </Link>
                </li>
                <li>
                  <span className="text-sm text-gray-500">Affiliate Disclosure</span>
                </li>
                <li>
                  <span className="text-sm text-gray-500">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-sm text-gray-500">Terms of Service</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center mb-6">
              <div className="flex items-center justify-center text-yellow-800">
                <Shield className="w-5 h-5 mr-3"/>
                <p className="text-sm font-medium">
                  <span className="font-bold">Affiliate Disclosure:</span> Some links on this site are affiliate links. If you use them, we may earn a commission at no extra cost to you. This helps us maintain our free calculators and guides.
                </p>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500 space-y-2">
              <p>StakeStrat provides educational content and tools for entertainment purposes only.</p>
              <p>Gambling involves risk. Please gamble responsibly and within your means.</p>
              <p>Must be 18+ to participate in gambling activities. Know your local laws.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

