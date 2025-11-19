'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const marketGrowthData = [
  { year: '2023', value: 35 },
  { year: '2024', value: 42 },
  { year: '2025', value: 48 },
  { year: '2026', value: 55 },
  { year: '2027', value: 62 },
];

const featureComparisonData = [
  { feature: 'AI Intent', mapier: 95, traditional: 20 },
  { feature: 'Personalization', mapier: 90, traditional: 40 },
  { feature: 'Voice Control', mapier: 85, traditional: 60 },
  { feature: 'POI Coverage', mapier: 80, traditional: 90 },
  { feature: 'User Content', mapier: 75, traditional: 30 },
];

const userJourneyData = [
  { stage: 'Discovery', users: 100 },
  { stage: 'Interest', users: 75 },
  { stage: 'Trial', users: 50 },
  { stage: 'Active', users: 35 },
  { stage: 'Advocate', users: 20 },
];

const technologyStackData = [
  { name: 'LLM/AI', value: 30, color: '#3b82f6' },
  { name: 'Mobile Dev', value: 25, color: '#8b5cf6' },
  { name: 'Mapping', value: 20, color: '#10b981' },
  { name: 'Backend', value: 15, color: '#f59e0b' },
  { name: 'Design', value: 10, color: '#ef4444' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function DataVisualization() {
  return (
    <section className="py-24 px-6 sm:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Data & Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Market trends, growth projections, and competitive advantages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Market Growth Chart */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Navigation Market Growth</h3>
            <p className="text-gray-600 text-sm mb-6">Global navigation market size (in billions USD)</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  name="Market Size (Billion USD)"
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Projected growth in the global navigation and mapping industry
            </p>
          </div>

          {/* Feature Comparison Chart */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Feature Comparison</h3>
            <p className="text-gray-600 text-sm mb-6">Mapier vs Traditional Navigation Apps</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="feature" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="mapier" fill="#3b82f6" name="Mapier" radius={[8, 8, 0, 0]} />
                <Bar dataKey="traditional" fill="#9ca3af" name="Traditional Apps" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Capability scores across key features (0-100 scale)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* User Journey Funnel */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">User Journey Funnel</h3>
            <p className="text-gray-600 text-sm mb-6">Expected user conversion through stages</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={userJourneyData}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="stage" type="category" stroke="#6b7280" width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="users" 
                  fill="#8b5cf6" 
                  radius={[0, 8, 8, 0]}
                  name="Users (%)"
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4 text-center">
              User progression from discovery to advocacy
            </p>
          </div>

          {/* Technology Stack Distribution */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Technology Focus</h3>
            <p className="text-gray-600 text-sm mb-6">Resource allocation across technology areas</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={technologyStackData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {technologyStackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {technologyStackData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">50B+</div>
            <div className="text-sm text-gray-700">Market Size by 2027</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-sm text-gray-700">AI Intent Accuracy</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">6</div>
            <div className="text-sm text-gray-700">Core Features</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
            <div className="text-sm text-gray-700">Team Members</div>
          </div>
        </div>
      </div>
    </section>
  );
}

