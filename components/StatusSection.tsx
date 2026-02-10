"use client";

import { Code, Rocket, Users } from "lucide-react";

export default function StatusSection() {
  return (
    <section className="py-24 px-6 sm:px-8 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Development Status</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mapier is rapidly evolving as we work to create the most intelligent navigation
            experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-6">
              <Code className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">MVP Stage</h3>
            <p className="text-gray-600 leading-relaxed">
              Core features have been implemented, including AI intent understanding, basic
              navigation, and POI search. Currently undergoing internal testing and optimization.
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Closed Beta</h3>
            <p className="text-gray-600 leading-relaxed">
              Planning to launch closed beta testing in the coming months, inviting early users to
              experience and provide feedback for continuous product improvement.
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white mb-6">
              <Rocket className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Open Beta</h3>
            <p className="text-gray-600 leading-relaxed">
              After optimization based on user feedback, we will launch an open beta version,
              allowing more users to experience the power of AI navigation.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <div className="inline-block px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Actively in Development
          </div>
        </div>
      </div>
    </section>
  );
}
