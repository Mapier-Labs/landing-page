'use client';

import { Code, Rocket, Users } from 'lucide-react';

export default function StatusSection() {
  return (
    <section className="py-24 px-6 sm:px-8 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            产品开发状态
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mapier正在快速发展中，我们致力于打造最智能的导航体验
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-6">
              <Code className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">MVP阶段</h3>
            <p className="text-gray-600 leading-relaxed">
              核心功能已基本实现，包括AI意图理解、基础导航、POI搜索等。目前正在进行内部测试和优化。
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">封闭测试</h3>
            <p className="text-gray-600 leading-relaxed">
              计划在未来几个月内启动封闭测试，邀请早期用户参与体验，收集反馈并持续改进产品。
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white mb-6">
              <Rocket className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">公开测试</h3>
            <p className="text-gray-600 leading-relaxed">
              基于用户反馈优化后，将推出公开测试版本，让更多用户体验AI导航的魅力。
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <div className="inline-block px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            正在积极开发中
          </div>
        </div>
      </div>
    </section>
  );
}

