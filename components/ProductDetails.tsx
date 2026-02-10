"use client";

import { CheckCircle2, Smartphone, Map, Mic2, Sparkles } from "lucide-react";

export default function ProductDetails() {
  return (
    <section className="py-24 px-6 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Our Product</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive AI navigation platform designed for the modern user
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">What We&apos;re Building</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Mapier is a next-generation navigation application that combines the power of Large
              Language Models with comprehensive mapping technology. Our platform understands
              natural language queries, learns from user behavior, and provides intelligent,
              personalized navigation experiences.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Unlike traditional navigation apps, Mapier doesn&apos;t just find locations—it
              understands context, preferences, and intent. Whether you&apos;re looking for &ldquo;a
              quiet place to work&rdquo; or &ldquo;the fastest route avoiding tolls,&rdquo; Mapier
              interprets your needs and delivers the best solution.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    AI-Powered Intent Recognition
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Understands complex, conversational navigation requests using advanced LLM
                    technology
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Personalized Experience</h4>
                  <p className="text-gray-600 text-sm">
                    Learns from your preferences, habits, and history to provide tailored
                    recommendations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Voice-First Interface</h4>
                  <p className="text-gray-600 text-sm">
                    Natural voice commands for hands-free, safe navigation especially while driving
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Community-Driven Content</h4>
                  <p className="text-gray-600 text-sm">
                    User-generated POI data, reviews, and photos for richer, more accurate map
                    information
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <Smartphone className="w-12 h-12 text-blue-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Mobile App</h4>
              <p className="text-gray-600 text-sm">
                Native iOS and Android applications with full feature set
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <Map className="w-12 h-12 text-purple-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Rich Maps</h4>
              <p className="text-gray-600 text-sm">
                Comprehensive POI database with real-time updates
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <Mic2 className="w-12 h-12 text-green-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Voice Control</h4>
              <p className="text-gray-600 text-sm">Natural language voice commands and responses</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <Sparkles className="w-12 h-12 text-orange-600 mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">AI Intelligence</h4>
              <p className="text-gray-600 text-sm">LLM-powered understanding and personalization</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">What Users Can Expect</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Intuitive Interface</h4>
              <p className="text-gray-600 text-sm">
                Clean, modern design that&apos;s easy to use and visually appealing
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast & Accurate</h4>
              <p className="text-gray-600 text-sm">
                Quick response times with precise location data and route calculations
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Always Learning</h4>
              <p className="text-gray-600 text-sm">
                The more you use Mapier, the better it understands your preferences
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
