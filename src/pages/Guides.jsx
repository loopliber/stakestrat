import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGuides } from "@/data/guides";
import { createPageUrl } from "@/utils";
import { BookOpen, Search } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const ArticleCard = ({ item, type }) => (
  <Link 
    to={createPageUrl(`${type}Detail?slug=${item.slug}`)} 
    className="block bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
  >
    <div className="flex flex-col sm:flex-row items-start gap-6">
      <img src={item.featuredImage} alt={item.title} className="w-full sm:w-48 h-32 object-cover rounded-lg mb-4 sm:mb-0"/>
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-600 mb-2">{item.category || new Date(item.publishedDate).toLocaleDateString()}</p>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {item.summary}
        </p>
      </div>
    </div>
  </Link>
);


export default function GuidesPage() {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuides = async () => {
            setLoading(true);
            const data = getGuides("-created_date", 50);
            setGuides(data);
            setLoading(false);
        };
        fetchGuides();
    }, []);

    return (
        <div className="bg-gray-50 py-12 sm:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-4">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span>In-Depth Guides</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Strategy Guides
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Learn the math, strategies, and best practices behind your favorite casino games.
                    </p>
                </div>
                
                {loading ? (
                    <div className="text-center py-20">Loading guides...</div>
                ) : (
                    <div className="grid lg:grid-cols-1 gap-8">
                       {guides.map(guide => (
                           <ArticleCard key={guide.id} item={guide} type="Guide" />
                       ))}
                    </div>
                )}
            </div>
        </div>
    );
}