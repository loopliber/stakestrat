
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getReviews } from "@/data/reviews";
import { createPageUrl } from "@/utils";
import { Star, CheckCircle, XCircle } from "lucide-react";

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ))}
  </div>
);

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            const data = getReviews("-rating", 20);
            // Filter out 'BitStarz' from the fetched reviews
            const filteredData = data.filter(review => review.platformName !== 'BitStarz');
            setReviews(filteredData);
            setLoading(false);
        };
        fetchReviews();
    }, []);

    // Featured Rainbet review data
    const rainbetReview = {
        id: 'rainbet-featured',
        platformName: 'Rainbet',
        logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center', // Placeholder, ideally use an actual Rainbet logo
        rating: 5,
        bonusInfo: 'Exclusive StakeStrat Welcome Bonus',
        affiliateLink: 'https://rainbet.com/?r=stakestrat',
        summary: 'Top-rated crypto casino with instant deposits, provably fair games, and the best dice experience. No KYC required.',
        pros: [
            'Instant crypto deposits and withdrawals',
            'Provably fair gaming with full transparency',
            'No KYC verification required',
            'Low 1% house edge on dice games',
            'Lightning-fast game performance',
            'Mobile-optimized platform'
        ],
        cons: [
            'Crypto-only platform (no fiat)',
            'Limited traditional payment methods'
        ]
    };

    return (
        <div className="bg-gray-50 py-12 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Crypto Casino Platform Reviews
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Honest, in-depth reviews of online gambling platforms to help you choose wisely.
                    </p>
                </div>

                {/* Featured Rainbet Review */}
                <div className="mb-12">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-1">
                        <div className="bg-white rounded-2xl p-8">
                            <div className="flex flex-wrap items-center mb-4 gap-2">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs font-semibold">
                                    ⭐ FEATURED PARTNER
                                </div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                                    ✓ STAKESTRAT RECOMMENDED
                                </div>
                            </div>
                            
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <div className="flex items-center mb-4">
                                        <img src={rainbetReview.logoUrl} alt={rainbetReview.platformName} className="w-16 h-16 rounded-lg mr-4 border-2 border-blue-200"/>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{rainbetReview.platformName}</h3>
                                            <StarRating rating={rainbetReview.rating} />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-6">{rainbetReview.summary}</p>
                                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                        <p className="text-sm font-semibold text-blue-800 mb-2">Special Offer:</p>
                                        <p className="text-sm text-blue-700">{rainbetReview.bonusInfo}</p>
                                    </div>
                                    <a 
                                        href={rainbetReview.affiliateLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="w-full text-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg block"
                                    >
                                        🎲 Play Now - Get Bonus
                                    </a>
                                </div>
                                
                                <div className="lg:col-span-2">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Pros
                                            </h4>
                                            <ul className="space-y-2">
                                                {rainbetReview.pros.map((pro, index) => (
                                                    <li key={index} className="text-sm text-gray-600 flex items-start">
                                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                                        {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                                                <XCircle className="w-5 h-5 mr-2" />
                                                Cons
                                            </h4>
                                            <ul className="space-y-2">
                                                {rainbetReview.cons.map((con, index) => (
                                                    <li key={index} className="text-sm text-gray-600 flex items-start">
                                                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                                        {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">Why We Recommend Rainbet:</h4>
                                        <p className="text-sm text-gray-600">
                                            Perfect for testing the dice strategies from our calculator. Rainbet's provably fair system lets you verify every roll, and their 1% house edge matches our calculations exactly. The instant crypto deposits mean you can start applying your strategies immediately.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Other Platform Reviews</h2>
                    <p className="text-gray-600">Compare features and find the best platform for your needs</p>
                </div>
                
                {loading ? (
                    <div className="text-center py-20">Loading reviews...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reviews.map(review => (
                                    <tr key={review.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img src={review.logoUrl} alt={review.platformName} className="w-10 h-10 mr-4"/>
                                                <span className="font-semibold text-gray-900">{review.platformName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{review.bonusInfo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StarRating rating={review.rating} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <a href={review.affiliateLink} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-blue-600 text-white font-semibold text-sm rounded-md hover:bg-blue-700 transition-colors">
                                                Visit Site
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
