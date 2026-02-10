'use client';

import { Target, Users, TrendingUp } from 'lucide-react';

export default function BusinessDescription() {
  return (
    <section className="py-24 px-6 sm:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            About Mapier
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming navigation through AI-powered intent understanding
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mapier is an AI-powered navigation application that leverages Large Language Model (LLM) technology to understand complex, natural language user intents and deliver personalized, intelligent navigation experiences.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Unlike traditional navigation apps that require specific addresses or predefined searches, Mapier interprets conversational requests like &ldquo;find the nearest restroom&rdquo; or &ldquo;take me to a quiet coffee shop with WiFi&rdquo; and provides accurate, context-aware navigation solutions.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Problems We Solve
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Complex Query Understanding:</strong> Traditional navigation apps fail when users express needs in natural language or have complex, multi-criteria requirements.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Lack of Personalization:</strong> Current solutions don&apos;t learn from user preferences, habits, or context, resulting in generic, one-size-fits-all experiences.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Limited Voice Interaction:</strong> Most navigation apps have basic voice commands but can&apos;t handle conversational, intent-based requests.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Static POI Data:</strong> Existing maps rely on static databases, missing real-time user-generated content and local insights.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-600" />
                Target Audience
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Urban Professionals & Commuters</h4>
                  <p className="text-gray-600 text-sm">Busy individuals who need efficient, context-aware navigation that adapts to their daily routines and preferences.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Travelers & Explorers</h4>
                  <p className="text-gray-600 text-sm">People visiting new cities who need to find places based on natural language descriptions and local recommendations.</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Drivers & Navigation Users</h4>
                  <p className="text-gray-600 text-sm">Users who prefer voice-controlled, hands-free navigation with intelligent route planning and real-time adjustments.</p>
                </div>
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Tech-Savvy Early Adopters</h4>
                  <p className="text-gray-600 text-sm">Users excited about AI-powered solutions and personalized experiences that learn and improve over time.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Industry Context
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                The navigation and mapping industry is experiencing a transformative shift with the integration of AI and LLM technologies. While traditional players like Google Maps and Apple Maps dominate with comprehensive data, they lack the conversational intelligence that modern users expect.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Mapier positions itself at the intersection of <strong>AI technology</strong>, <strong>location services</strong>, and <strong>user experience design</strong>, targeting a growing market of users who demand more intuitive, personalized, and context-aware navigation solutions. The global navigation market is projected to reach $50+ billion by 2027, with AI-powered features becoming a key differentiator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

