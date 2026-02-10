"use client";

import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-screen flex items-center justify-center pt-20 px-6 sm:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          AI-Powered Navigation
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Let AI Understand Your
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Every Navigation Need
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Mapier leverages advanced Large Language Model technology to understand complex user
          intents
          <br className="hidden sm:block" />
          and deliver personalized, intelligent navigation experiences
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#waitlist"
            className="group inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Join Waitlist
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-full font-medium border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
