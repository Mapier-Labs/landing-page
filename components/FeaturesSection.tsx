'use client';

import { Brain, MapPin, Mic, User, Upload, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI理解用户意图',
    description: '通过大型语言模型（LLM）技术，理解复杂的自然语言导航需求，如"找离我最近的厕所"等，提供精准的导航方案。',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: User,
    title: '个性化导航',
    description: '根据用户的出行习惯、偏好和历史记录，提供定制化的路线推荐和兴趣点建议，让每次出行都更符合你的需求。',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: MapPin,
    title: '丰富的POI信息',
    description: '整合海量兴趣点数据，包括餐厅、加油站、景点、服务设施等，帮助你快速找到所需地点。',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Upload,
    title: '用户内容上传',
    description: '支持用户上传地点信息、照片和评论，共同构建更丰富、更准确的地图生态。',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Mic,
    title: '语音控制',
    description: '支持语音指令操作，解放双手，让导航更安全、更便捷，特别适合驾驶场景。',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Sparkles,
    title: '智能路线规划',
    description: '综合考虑实时路况、用户偏好、时间成本等多维度因素，提供最优路线方案。',
    color: 'from-indigo-500 to-indigo-600',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            强大的功能特性
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基于先进AI技术，重新定义导航体验
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

