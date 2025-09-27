
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Dice1, TrendingUp, Target, Zap, ArrowRight, Shield, BarChart3, PieChart } from "lucide-react";
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const games = [
    {
      title: "Dice Calculator",
      subtitle: "Martingale & Probability",
      description: "Advanced probability calculations and martingale strategy analysis for dice.",
      icon: Dice1,
      url: createPageUrl("DiceCalculator"),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Crash Simulator",
      subtitle: "Real-time Strategy",
      description: "Live crash game simulation with auto-cashout optimization and backtesting.",
      icon: TrendingUp,
      url: createPageUrl("CrashSimulator"),
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Plinko Simulator",
      subtitle: "Physics Engine",
      description: "Realistic Plinko physics with comprehensive payout analysis and risk levels.",
      icon: Target,
      url: createPageUrl("PlinkoSimulator"),
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Limbo Calculator",
      subtitle: "House Edge Analysis",
      description: "Mathematical modeling for under/over betting strategies in Limbo.",
      icon: Zap,
      url: createPageUrl("LimboCalculator"),
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Mathematically Precise",
      description: "All calculations are based on proven mathematical models and probability theory."
    },
    {
      icon: BarChart3,
      title: "Real-time Analysis",
      description: "Live simulations and instant strategy feedback for optimal decision making."
    },
    {
      icon: PieChart,
      title: "Comprehensive Tools",
      description: "Enterprise-level tools designed for serious strategy development and risk assessment."
    }
  ];

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>Free Stake & Rainbet Calculators - Crypto & Dice Strategy Tools</title>
        <meta name="description" content="Best free Stake dice calculator and Rainbet calculator tools. Professional crypto casino simulators for dice strategy, crash games, Plinko, and more. No signup required." />
        <meta name="keywords" content="stake dice calculator free, rainbet dice calculator, stake crash simulator, rainbet calculator, crypto dice strategy, stake dice bot, rainbet demo mode" />
        <link rel="canonical" href="https://stakestrat.com/" />
        <meta property="og:title" content="Free Stake & Rainbet Calculators - Crypto & Dice Strategy Tools" />
        <meta property="og:description" content="Professional Stake dice calculator and Rainbet calculator. Free crypto casino simulators for optimal strategy development." />
        <meta property="og:url" content="https://stakestrat.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* SEO Schema for Home Page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "StakeStrat - Crypto Casino Strategy Calculators",
          "description": "Professional crypto casino strategy calculators and gambling guides for crypto games including Dice, Crash, Plinko, Limbo, and more.",
          "url": "https://stakestrat.com",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "StakeStrat Calculator Suite",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://stakestrat.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Hero Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-6">
            Professional Strategy Tools
          </div>
            
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tighter mb-6">
            Free Stake &amp; Rainbet Calculators - Crypto &amp; Dice Strategy Tools
          </h1>
            
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Professional <strong>Stake dice calculator</strong> and <strong>Rainbet calculator</strong> tools. Free crypto casino simulators for <strong>Stake</strong> and <strong>Rainbet</strong> games including <strong>dice strategy</strong>, <strong>crash simulator</strong>, and <strong>Plinko calculator</strong>. No signup required - start calculating your winning strategies now.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={createPageUrl("DiceCalculator")}>
              <button className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-300 shadow-lg">
                Start Calculating
                <ArrowRight className="ml-2 w-4 h-4 inline" />
              </button>
            </Link>
            <Link to="#features">
              <button className="w-full sm:w-auto px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-300">
                View Features
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Crypto Casino Partners Banner */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-bold mb-4">
                🎯 OUR TOP PLACES TO PLAY WITH HIGHEST RTP
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                Ready to Apply Your Strategies?
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                After perfecting your calculations, play on our trusted partners with the highest RTPs in crypto gambling
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Stake.com Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Stake.com</h3>
                    <p className="text-blue-100 text-sm">Original Crypto Casino</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-300 font-bold text-lg">99%+ RTP</div>
                    <div className="text-blue-200 text-xs">Verified Provably Fair</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center text-blue-100">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Instant crypto deposits & withdrawals
                  </div>
                  <div className="flex items-center text-blue-100">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Weekly & monthly bonuses
                  </div>
                  <div className="flex items-center text-blue-100">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Live chat support 24/7
                  </div>
                </div>
                
                <a
                  href="https://stake.com/?c=aqTVKbe1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 text-center shadow-lg"
                >
                  🎲 Play on Stake Now
                </a>
              </div>

              {/* Rainbet Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Rainbet</h3>
                    <p className="text-blue-100 text-sm">Fast & Modern Casino</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-300 font-bold text-lg">98%+ RTP</div>
                    <div className="text-blue-200 text-xs">Lightning Fast Payouts</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center text-blue-100">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    No KYC required
                  </div>
                  <div className="flex items-center text-blue-100">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Exclusive StakeStrat bonus
                  </div>
                  <div className="flex items-center text-blue-100">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Demo mode available
                  </div>
                </div>
                
                <a
                  href="https://rainbet.com/?r=stakestrat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all duration-300 text-center shadow-lg"
                >
                  🌧️ Play on Rainbet Now
                </a>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-blue-200 text-sm">
                ⚡ Use our calculators above to develop strategies, then apply them on these trusted platforms
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Why Choose Our Stake &amp; Rainbet Calculator Tools?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional <strong>crypto casino calculators</strong> built with mathematical precision for <strong>Stake</strong> and <strong>Rainbet</strong> strategy development.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div key={index} className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 mx-auto border border-gray-200">
                  <feature.icon className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Free Crypto Casino Calculators &amp; Strategy Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each calculator is engineered with mathematical precision and real-time analysis capabilities. Perfect for developing and testing your <strong>crypto casino strategies</strong>.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {games.map((game, index) => (
              <Link 
                to={game.url} 
                key={index} 
                className="block bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                title={`${game.title} - Free Crypto Calculator`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {game.title}
                    </h3>
                    <p className="text-gray-500 font-medium text-sm">{game.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${game.bgColor} flex items-center justify-center`}>
                    <game.icon className={`w-6 h-6 ${game.color}`} />
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {game.description}
                </p>

                <div className="font-semibold text-sm text-blue-600 flex items-center">
                  Launch Calculator
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stake & Rainbet Specific Section */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 border border-blue-100">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
              Best Stake &amp; Rainbet Calculator Tools - Free Dice &amp; Crash Simulators
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎲 Stake Dice Calculator Free</h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• <strong>Stake dice calculator app</strong> - No download required</li>
                  <li>• <strong>Best stake dice calculator</strong> with real-time probability analysis</li>
                  <li>• <strong>Stake dice strategy</strong> optimization tools</li>
                  <li>• <strong>Stake dice simulator</strong> for risk-free testing</li>
                  <li>• Advanced <strong>stake dice bot</strong> strategy planning</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🌧️ Rainbet Calculator Free</h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• <strong>Rainbet dice calculator free</strong> - Professional tools</li>
                  <li>• <strong>Rainbet demo mode</strong> strategy development</li>
                  <li>• <strong>Rainbet Plinko</strong> optimization calculator</li>
                  <li>• <strong>Rainbet sign up bonus</strong> strategy guides</li>
                  <li>• Where <strong>Rainbet legal</strong> information and guides</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-6">
                Trusted by thousands of crypto casino players. Featured on <strong>Reddit</strong> gambling communities and casino forums.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to={createPageUrl("DiceCalculator")} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Try Stake Dice Calculator
                </Link>
                <Link to={createPageUrl("Reviews")} className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors">
                  Compare Rainbet vs Stake
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Master Crypto Casino Games with Professional Strategy Development
            </h2>
            <div className="prose prose-lg max-w-4xl mx-auto text-left">
              <p className="text-gray-600 leading-relaxed">
                StakeStrat provides the most comprehensive suite of <strong>crypto casino calculators</strong> and strategy tools available online. Our advanced <strong>crypto dice calculators</strong>, 
                <strong> crash game analyzers</strong>, <strong> Plinko simulators</strong>, and <strong> Limbo optimization tools</strong> are built for serious gamblers who want to understand the mathematics behind their games.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Whether you're developing <strong>martingale strategies</strong>, analyzing <strong>probability calculations</strong>, optimizing <strong>house edge scenarios</strong>, or implementing advanced <strong>risk management techniques</strong>, our tools provide the mathematical foundation you need to make informed decisions.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                All calculators are 100% free and built with mobile-first design for optimal performance on any device. Start with our <strong>crypto dice strategy calculator</strong> or explore our complete suite of professional gambling tools.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
