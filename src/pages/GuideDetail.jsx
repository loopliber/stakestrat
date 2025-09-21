import React, { useState, useEffect } from "react";
import { getGuideBySlug } from "@/data/guides";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, User, Calendar, Shield, Clock, BookOpen } from 'lucide-react';

export default function GuideDetailPage() {
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const slug = urlParams.get('slug');
            if (slug) {
                setLoading(true);
                const result = getGuideBySlug(slug);
                if (result) {
                    setGuide(result);
                }
                setLoading(false);
            }
        };
        fetchGuide();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading guide...</p>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Guide not found</h2>
                    <p className="text-gray-600 mb-6">The guide you're looking for doesn't exist.</p>
                    <Link to={createPageUrl("Guides")} className="text-blue-600 hover:text-blue-700 font-medium">
                        ← Back to all guides
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link 
                            to={createPageUrl("Guides")} 
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to all guides
                        </Link>
                    </div>
                    
                    <div className="text-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
                            <BookOpen className="w-4 h-4 mr-2" />
                            {guide.category}
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
                            {guide.title}
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                            {guide.summary}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium">{guide.author}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                <span>5 min read</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{new Date(guide.created_date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {guide.featuredImage && (
                            <div className="aspect-video sm:aspect-[21/9] overflow-hidden">
                                <img 
                                    src={guide.featuredImage} 
                                    alt={guide.title} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        
                        <div className="p-6 sm:p-8 lg:p-12">
                            <div className="prose prose-lg prose-blue max-w-none">
                                <style jsx>{`
                                    .prose {
                                        color: #374151;
                                        line-height: 1.75;
                                    }
                                    .prose h1 {
                                        color: #111827;
                                        font-weight: 800;
                                        font-size: 2.25rem;
                                        line-height: 1.2;
                                        margin-top: 0;
                                        margin-bottom: 2rem;
                                    }
                                    .prose h2 {
                                        color: #111827;
                                        font-weight: 700;
                                        font-size: 1.875rem;
                                        line-height: 1.3;
                                        margin-top: 3rem;
                                        margin-bottom: 1.5rem;
                                        padding-bottom: 0.5rem;
                                        border-bottom: 2px solid #e5e7eb;
                                    }
                                    .prose h3 {
                                        color: #1f2937;
                                        font-weight: 600;
                                        font-size: 1.5rem;
                                        line-height: 1.4;
                                        margin-top: 2.5rem;
                                        margin-bottom: 1rem;
                                    }
                                    .prose h4 {
                                        color: #1f2937;
                                        font-weight: 600;
                                        font-size: 1.25rem;
                                        margin-top: 2rem;
                                        margin-bottom: 0.75rem;
                                    }
                                    .prose p {
                                        margin-bottom: 1.75rem;
                                        font-size: 1.125rem;
                                        line-height: 1.8;
                                    }
                                    .prose ul, .prose ol {
                                        margin-bottom: 2rem;
                                        padding-left: 1.5rem;
                                    }
                                    .prose li {
                                        margin-bottom: 0.75rem;
                                        font-size: 1.125rem;
                                        line-height: 1.7;
                                    }
                                    .prose li > p {
                                        margin-bottom: 0.5rem;
                                    }
                                    .prose strong {
                                        color: #111827;
                                        font-weight: 600;
                                    }
                                    .prose blockquote {
                                        border-left: 4px solid #3b82f6;
                                        background: #f8fafc;
                                        padding: 1.5rem;
                                        margin: 2rem 0;
                                        border-radius: 0.5rem;
                                        font-style: italic;
                                    }
                                    .prose code {
                                        background: #f1f5f9;
                                        padding: 0.25rem 0.5rem;
                                        border-radius: 0.375rem;
                                        font-size: 0.9em;
                                        color: #1e293b;
                                    }
                                    .prose pre {
                                        background: #1e293b;
                                        color: #f1f5f9;
                                        padding: 1.5rem;
                                        border-radius: 0.75rem;
                                        overflow-x: auto;
                                        margin: 2rem 0;
                                    }
                                    .prose table {
                                        width: 100%;
                                        border-collapse: collapse;
                                        margin: 2rem 0;
                                        background: white;
                                        border-radius: 0.5rem;
                                        overflow: hidden;
                                        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                                    }
                                    .prose th {
                                        background: #f8fafc;
                                        padding: 1rem;
                                        text-align: left;
                                        font-weight: 600;
                                        color: #374151;
                                        border-bottom: 1px solid #e5e7eb;
                                    }
                                    .prose td {
                                        padding: 1rem;
                                        border-bottom: 1px solid #f3f4f6;
                                    }
                                    .prose a {
                                        color: #3b82f6;
                                        text-decoration: none;
                                        font-weight: 500;
                                        border-bottom: 1px solid transparent;
                                        transition: all 0.2s;
                                    }
                                    .prose a:hover {
                                        color: #1d4ed8;
                                        border-bottom-color: #3b82f6;
                                    }
                                    
                                    @media (max-width: 640px) {
                                        .prose h1 { font-size: 1.875rem; }
                                        .prose h2 { font-size: 1.5rem; margin-top: 2rem; }
                                        .prose h3 { font-size: 1.25rem; margin-top: 1.5rem; }
                                        .prose p, .prose li { font-size: 1rem; }
                                        .prose table { font-size: 0.875rem; }
                                        .prose th, .prose td { padding: 0.75rem; }
                                    }
                                `}</style>
                                <ReactMarkdown>{guide.content}</ReactMarkdown>
                            </div>
                        </div>
                    </article>
                </div>
            </div>

            {/* Responsible Gambling Notice */}
            <div className="py-8 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-start">
                            <Shield className="w-6 h-6 text-yellow-600 mr-4 flex-shrink-0 mt-1"/>
                            <div>
                                <h3 className="text-lg font-bold text-yellow-900 mb-2">Gamble Responsibly</h3>
                                <p className="text-sm text-yellow-800 mb-4 leading-relaxed">
                                    Gambling should be a form of entertainment, not a way to make money. Never gamble more than you can afford to lose. If you think you might have a problem, please seek help from a professional organization.
                                </p>
                                <Link 
                                    to={createPageUrl("ResponsibleGambling")} 
                                    className="inline-flex items-center text-sm font-semibold text-yellow-900 hover:text-yellow-700 transition-colors"
                                >
                                    Learn More about Responsible Gambling
                                    <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}