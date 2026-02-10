"use client";

import { Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Jinyi Bruce Li",
    role: "Co-founder",
    specialization: "UI/UX Branding Design & Product Design",
    linkedin: "https://www.linkedin.com/in/jinyi-bruce-li/",
    description:
      "Passionate about creating intuitive user experiences and building products that make a difference. Brings extensive experience in design systems, brand identity, and product strategy.",
    background:
      "Expert in UI/UX design with a focus on creating user-centered experiences. Has led design initiatives for multiple products and brings strong expertise in visual design and product thinking.",
  },
  {
    name: "Homin Luo",
    role: "Co-founder",
    specialization: "Engineering",
    linkedin: "https://www.linkedin.com/in/hominluo/",
    description:
      "Focused on AI and navigation technology development with deep expertise in LLM applications. Leads the technical architecture and AI integration efforts.",
    background:
      "Experienced engineer with strong background in machine learning and AI systems. Specializes in Large Language Model integration and navigation algorithms.",
  },
  {
    name: "Mido Sang",
    role: "Co-founder",
    specialization: "Engineering",
    linkedin: "https://www.linkedin.com/in/mido-sang-a99657265/",
    description:
      "Leading core product development with extensive experience in mobile apps and mapping services. Drives the technical implementation of key features.",
    background:
      "Senior engineer with proven track record in mobile application development and geospatial technologies. Has built scalable mapping and location-based services.",
  },
  {
    name: "Mark Xiong",
    role: "Co-founder",
    specialization: "Product",
    linkedin: "https://www.linkedin.com/in/mark-xiong-356aa3210/",
    description:
      "Expert in product design and user experience optimization, dedicated to creating intuitive navigation products. Shapes product vision and user experience strategy.",
    background:
      "Product leader with experience in building user-focused products. Combines technical understanding with strong product sense to deliver exceptional user experiences.",
  },
  {
    name: "Neo Shangguan",
    role: "Co-founder",
    specialization: "Engineering",
    linkedin: "https://www.linkedin.com/in/neo-shangguan/",
    description:
      "Specialized in user interface and interaction design, creating beautiful and powerful user experiences. Bridges design and engineering to deliver polished products.",
    background:
      "Full-stack engineer with strong design sensibilities. Has experience building interactive interfaces and implementing complex user interactions.",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="py-24 px-6 sm:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A team of experienced technologists and product experts dedicated to building the next
            generation of AI navigation
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-gray-600 text-sm mb-1">{member.role}</p>
                  <p className="text-gray-500 text-xs mb-3">{member.specialization}</p>
                </div>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label={`${member.name}'s LinkedIn`}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{member.description}</p>
              <p className="text-gray-500 text-xs leading-relaxed italic">{member.background}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
