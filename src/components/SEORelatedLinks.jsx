import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Target, Zap } from 'lucide-react';

const SEORelatedLinks = ({ currentPage, className = "" }) => {
  const allCalculators = {
    'dice': {
      title: 'Stake & Rainbet Dice Calculator',
      path: '/dice-calculator',
      description: 'Advanced dice strategy calculator with Martingale simulation',
      icon: Calculator
    },
    'crash': {
      title: 'Crypto Crash Simulator',
      path: '/crash-simulator', 
      description: 'Real-time crash game analysis and auto-cashout optimization',
      icon: TrendingUp
    },
    'plinko': {
      title: 'Plinko Strategy Calculator',
      path: '/plinko-simulator',
      description: 'Physics-based Plinko simulator with risk analysis',
      icon: Target
    },
    'limbo': {
      title: 'Limbo Calculator',
      path: '/limbo-calculator',
      description: 'Under/over betting calculator with house edge analysis',
      icon: Zap
    },
    'mines': {
      title: 'Mines Calculator',
      path: '/mines-calculator',
      description: 'Advanced mines probability calculator and strategy tool',
      icon: Calculator
    }
  };

  // Get related calculators (exclude current page)
  const relatedCalculators = Object.entries(allCalculators)
    .filter(([key]) => key !== currentPage)
    .slice(0, 3); // Show top 3 related

  if (relatedCalculators.length === 0) return null;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-blue-600" />
        Related Strategy Calculators
      </h3>
      <div className="space-y-3">
        {relatedCalculators.map(([key, calculator]) => {
          const Icon = calculator.icon;
          return (
            <Link
              key={key}
              to={calculator.path}
              className="flex items-start p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
            >
              <Icon className="w-4 h-4 mt-1 mr-3 text-gray-400 group-hover:text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">
                  {calculator.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {calculator.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* SEO Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Professional crypto casino calculators for <strong>Stake</strong> and <strong>Rainbet</strong>. 
          Free strategy tools with advanced risk analysis and probability calculations.
        </p>
      </div>
    </div>
  );
};

export default SEORelatedLinks;