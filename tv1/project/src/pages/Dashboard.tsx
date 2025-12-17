import {
  Users,
  TrendingUp,
  MapPin,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    name: 'Total Citizens',
    value: '12,345',
    change: '+12.3%',
    changeType: 'positive',
    icon: Users,
    color: 'blue',
  },
  {
    name: 'Active Projects',
    value: '87',
    change: '+8.1%',
    changeType: 'positive',
    icon: FileText,
    color: 'green',
  },
  {
    name: 'Locations Monitored',
    value: '234',
    change: '+5.4%',
    changeType: 'positive',
    icon: MapPin,
    color: 'amber',
  },
  {
    name: 'Budget Utilization',
    value: '67%',
    change: '-2.3%',
    changeType: 'negative',
    icon: TrendingUp,
    color: 'red',
  },
];

const chartData = [
  { category: 'Healthcare', value: 85, color: 'bg-blue-500' },
  { category: 'Education', value: 72, color: 'bg-green-500' },
  { category: 'Infrastructure', value: 68, color: 'bg-amber-500' },
  { category: 'Public Safety', value: 91, color: 'bg-red-500' },
  { category: 'Environment', value: 78, color: 'bg-teal-500' },
];

const progressMetrics = [
  {
    title: 'Digital Transformation Initiative',
    progress: 75,
    status: 'On Track',
    color: 'bg-blue-600',
  },
  {
    title: 'Infrastructure Development',
    progress: 60,
    status: 'In Progress',
    color: 'bg-green-600',
  },
  {
    title: 'Community Outreach Program',
    progress: 85,
    status: 'Near Completion',
    color: 'bg-amber-600',
  },
  {
    title: 'Environmental Sustainability',
    progress: 45,
    status: 'Early Stage',
    color: 'bg-teal-600',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            amber: 'bg-amber-50 text-amber-600',
            red: 'bg-red-50 text-red-600',
          };

          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div
                    className={`flex items-center text-sm font-semibold ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Best of the Charts
            </h2>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
            </select>
          </div>

          <div className="space-y-6">
            {chartData.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.category}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">94.5%</p>
                <p className="text-sm text-gray-500 mt-1">Avg. Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2.4K</p>
                <p className="text-sm text-gray-500 mt-1">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-500 mt-1">Reports Filed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'New project approved',
                time: '2 hours ago',
                type: 'success',
              },
              {
                title: 'Budget report submitted',
                time: '4 hours ago',
                type: 'info',
              },
              {
                title: 'Location survey completed',
                time: '6 hours ago',
                type: 'success',
              },
              {
                title: 'System maintenance scheduled',
                time: '8 hours ago',
                type: 'warning',
              },
              {
                title: 'Staff meeting notes uploaded',
                time: '10 hours ago',
                type: 'info',
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success'
                      ? 'bg-green-500'
                      : activity.type === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Project Progress Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressMetrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  {metric.title}
                </h3>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {metric.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.color} transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${metric.progress}%` }}
                  >
                    <span className="text-xs font-bold text-white">
                      {metric.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
