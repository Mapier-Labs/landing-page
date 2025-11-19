'use client';

import { Linkedin } from 'lucide-react';

const teamMembers = [
  {
    name: 'Jinyi Bruce Li',
    role: '联合创始人 & CEO',
    linkedin: 'https://www.linkedin.com/in/jinyi-bruce-li/',
    description: '拥有丰富的科技行业领导经验，致力于推动AI导航技术的创新与应用。',
  },
  {
    name: 'Homin Luo',
    role: '联合创始人 & CTO',
    linkedin: 'https://www.linkedin.com/in/hominluo/',
    description: '专注于人工智能和导航技术的研发，在LLM应用领域有深厚的技术积累。',
  },
  {
    name: 'Mido Sang',
    role: '首席开发工程师',
    linkedin: 'https://www.linkedin.com/in/mido-sang-a99657265/',
    description: '负责核心产品开发，在移动应用和地图服务开发方面拥有丰富经验。',
  },
  {
    name: 'Mark Xiong',
    role: '产品经理',
    linkedin: 'https://www.linkedin.com/in/mark-xiong-356aa3210/',
    description: '擅长产品设计和用户体验优化，致力于打造直观易用的导航产品。',
  },
  {
    name: 'Neo Shangguan',
    role: 'UX/UI 设计师',
    linkedin: 'https://www.linkedin.com/in/neo-shangguan/',
    description: '专注于用户界面和交互设计，创造美观且功能强大的用户体验。',
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="py-24 px-6 sm:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            我们的团队
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            由经验丰富的技术专家和产品团队组成，致力于打造下一代AI导航产品
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{member.role}</p>
                </div>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label={`${member.name}的LinkedIn`}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

