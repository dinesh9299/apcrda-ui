import { useState } from 'react';
import { Users, FileCheck, Clock, AlertCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import BestOfCharts from './components/BestOfCharts';
import ProgressBar from './components/ProgressBar';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden lg:block">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {isMobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileSidebar}
          ></div>
          <div className="lg:hidden">
            <Sidebar isCollapsed={false} onToggle={toggleMobileSidebar} />
          </div>
        </>
      )}

      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Header onMenuClick={toggleMobileSidebar} />

        <main className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Monitor key metrics and performance indicators</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Citizens Registered"
              value="156,234"
              change={12.5}
              icon={Users}
              color="blue"
            />
            <MetricCard
              title="Documents Processed"
              value="89,432"
              change={8.2}
              icon={FileCheck}
              color="green"
            />
            <MetricCard
              title="Pending Applications"
              value="1,234"
              change={-5.3}
              icon={Clock}
              color="amber"
            />
            <MetricCard
              title="Critical Issues"
              value="23"
              change={-15.8}
              icon={AlertCircle}
              color="red"
            />
          </div>

          <div className="mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Annual Goals Progress</h2>
                <p className="text-sm text-gray-600">Track progress towards key performance indicators</p>
              </div>
              <div className="space-y-6">
                <ProgressBar
                  label="Citizen Registration Target"
                  current={156234}
                  target={200000}
                  color="blue"
                />
                <ProgressBar
                  label="Digital Transformation Initiative"
                  current={89432}
                  target={100000}
                  color="green"
                />
                <ProgressBar
                  label="Service Efficiency Improvement"
                  current={85}
                  target={90}
                  color="amber"
                />
                <ProgressBar
                  label="Citizen Satisfaction Score"
                  current={92}
                  target={95}
                  color="green"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Best of the Charts</h2>
              <p className="text-sm text-gray-600">Top performers across departments and regions</p>
            </div>
            <BestOfCharts />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { time: '2 min ago', text: 'New citizen registration completed', type: 'success' },
                  { time: '15 min ago', text: 'Document verification pending', type: 'warning' },
                  { time: '1 hour ago', text: 'System maintenance scheduled', type: 'info' },
                  { time: '2 hours ago', text: 'Monthly report generated', type: 'success' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-4">
                {[
                  { name: 'Database', status: 'Operational', uptime: '99.9%' },
                  { name: 'API Services', status: 'Operational', uptime: '99.8%' },
                  { name: 'File Storage', status: 'Operational', uptime: '100%' },
                  { name: 'Email Service', status: 'Operational', uptime: '99.7%' },
                ].map((system, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-900">{system.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{system.uptime}</p>
                      <p className="text-xs text-green-600 font-medium">{system.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  'New Citizen Registration',
                  'Process Document',
                  'Generate Report',
                  'System Settings',
                ].map((action, idx) => (
                  <button
                    key={idx}
                    className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors text-left text-sm"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
