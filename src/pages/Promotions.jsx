
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getReviews } from "@/data/reviews";
import { Gift, Star } from "lucide-react";

export default function PromotionsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            const data = getReviews("-rating", 20);
            setReviews(data);
            setLoading(false);
        };
        fetchReviews();
    }, []);

    // Featured Rainbet promotion
    const rainbetPromo = {
        id: 'rainbet-special',
        platformName: 'Rainbet',
        logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center',
        rating: 5,
        bonusInfo: 'Exclusive StakeStrat Welcome Package - 100% Bonus + 20 Freespins',
        affiliateLink: 'https://rainbet.com/?r=stakestrat',
        summary: 'The perfect platform to test your StakeStrat dice strategies with real money. Get exclusive bonuses and start playing immediately.'
    };

    return (
        <div className="bg-gray-50 py-12 sm:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Latest Crypto Casino Promotions
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Curated offers and bonuses from top-rated platforms. Perfect for testing your StakeStrat strategies.
                    </p>
                </div>

                {/* Featured Rainbet Promotion */}
                <div className="mb-12">
                    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-1">
                        <div className="bg-white rounded-3xl p-8">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold mb-4">
                                    🎯 EXCLUSIVE STAKESTRAT OFFER
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Rainbet Welcome Bonus</h2>
                                <p className="text-gray-600">The ultimate platform for testing your dice strategies</p>
                            </div>
                            
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center mb-6">
                                        <img src={rainbetPromo.logoUrl} alt="Rainbet" className="w-20 h-20 rounded-xl mr-4 border-2 border-blue-200"/>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Rainbet</h3>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-700">
                                            <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                                            <span className="font-semibold">100% Bonus + 20 Freespins</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                                            <span>Perfect for StakeStrat dice strategies</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                                            <span>Instant crypto deposits & withdrawals</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                                            <span>Provably fair dice games (1% house edge)</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                                            <span>No KYC required - play immediately</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
                                        <div className="text-4xl font-bold mb-2">100%</div>
                                        <div className="text-lg font-semibold mb-1">Welcome Bonus</div>
                                        <div className="text-blue-200 text-sm">Exclusive for StakeStrat users</div>
                                    </div>
                                    
                                    <a 
                                        href={rainbetPromo.affiliateLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full text-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl inline-block transform hover:scale-105"
                                    >
                                        🚀 Claim Exclusive Bonus
                                    </a>
                                    
                                    <p className="text-xs text-gray-500 mt-3">
                                        Terms apply • 18+ • Gamble responsibly
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <h4 className="font-semibold text-blue-900 mb-2">Why Rainbet is Perfect for StakeStrat Users:</h4>
                                <p className="text-blue-700 text-sm">
                                    Test your calculated dice strategies on a platform that matches our mathematical models exactly. With provably fair gaming and our exclusive bonus, you can verify every roll and maximize your starting bankroll.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Other Platform Promotions</h2>
                    <p className="text-gray-600">Additional bonuses and offers from trusted operators</p>
                </div>

                {loading ? (
                    <div className="text-center">Loading promotions...</div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col">
                                <div className="flex items-center mb-4">
                                    <img src={review.logoUrl} alt={review.platformName} className="w-12 h-12 mr-4"/>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{review.platformName}</h3>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow mb-6">
                                     <p className="text-gray-600 text-sm">{review.summary}</p>
                                     <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm font-semibold text-blue-800">Bonus Offer:</p>
                                        <p className="text-sm text-blue-700">{review.bonusInfo}</p>
                                     </div>
                                </div>
                                <a href={review.affiliateLink} target="_blank" rel="noopener noreferrer" className="w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                                    Claim Bonus
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
