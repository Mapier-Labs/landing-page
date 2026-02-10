'use client';

import { Brain, MapPin, Mic, User, Upload, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Intent Understanding',
    description: 'Leverages Large Language Model (LLM) technology to understand complex natural language navigation requests, such as "find the nearest restroom," and provides accurate navigation solutions.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: User,
    title: 'Personalized Navigation',
    description: 'Provides customized route recommendations and point-of-interest suggestions based on user travel habits, preferences, and history, making every trip more tailored to your needs.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: MapPin,
    title: 'Rich POI Information',
    description: 'Integrates vast point-of-interest data, including restaurants, gas stations, attractions, and service facilities, helping you quickly find what you need.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Upload,
    title: 'User Content Upload',
    description: 'Supports user-uploaded location information, photos, and reviews, collectively building a richer and more accurate map ecosystem.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Mic,
    title: 'Voice Control',
    description: 'Supports voice command operation, freeing your hands for safer and more convenient navigation, especially suitable for driving scenarios.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Sparkles,
    title: 'Smart Route Planning',
    description: 'Considers multiple factors including real-time traffic, user preferences, and time costs to provide optimal route solutions.',
    color: 'from-indigo-500 to-indigo-600',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" aria-label="Product features" className="py-24 px-6 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Redefining navigation experience with advanced AI technology
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-gray-200 hover:border-gray-300 bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
