import React from 'react';
import { Shield, Phone, Link as LinkIcon, AlertTriangle } from 'lucide-react';

export default function ResponsibleGamblingPage() {
  return (
    <div className="bg-white py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto text-blue-600" />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Responsible Gambling
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your safety is our priority. Gambling should be fun, not a problem.
          </p>
        </div>
        
        <div className="space-y-10">
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-600 leading-relaxed">
              At StakeStrat, we are committed to promoting responsible gambling practices. We believe that gambling should always be an enjoyable leisure activity. While our tools are designed to explore strategies and understand probabilities, they do not guarantee winnings. It's crucial to remember that all forms of gambling involve risk.
            </p>
          </div>

          <div className="bg-red-50 p-8 rounded-2xl border border-red-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><AlertTriangle className="w-6 h-6 mr-3 text-red-500" /> Know the Signs of Problem Gambling</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Gambling more money than you can afford to lose.</li>
              <li>Neglecting responsibilities at work, school, or home due to gambling.</li>
              <li>Chasing losses or trying to win back money you have lost.</li>
              <li>Feeling guilty, anxious, or depressed about your gambling.</li>
              <li>Borrowing money or selling possessions to gamble.</li>
              <li>Lying to family and friends about the extent of your gambling.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Help</h2>
            <p className="text-gray-600 mb-6">
              If you or someone you know is struggling with gambling, help is available. These organizations offer free, confidential support and resources.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800">National Council on Problem Gambling</h3>
                <div className="flex items-center mt-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>1-800-522-4700</span>
                </div>
                <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" className="flex items-center mt-2 text-sm text-blue-600 hover:underline">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  ncpgambling.org
                </a>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800">Gamblers Anonymous</h3>
                 <a href="http://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer" className="flex items-center mt-3 text-sm text-blue-600 hover:underline">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  gamblersanonymous.org
                </a>
              </div>
            </div>
          </div>

           <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Self-Help Tools</h2>
            <p className="text-gray-600 mb-6">
              Most licensed gambling platforms offer tools to help you stay in control. Look for these features in your account settings:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Deposit Limits:</strong> Control how much money you can deposit daily, weekly, or monthly.</li>
              <li><strong>Time-Outs:</strong> Take a short break from gambling, from 24 hours up to several weeks.</li>
              <li><strong>Self-Exclusion:</strong> Block access to your account for a longer period, typically six months or more.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}