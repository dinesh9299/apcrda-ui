import { Award, MapPin, Building2 } from 'lucide-react';

interface ChartItem {
  rank: number;
  name: string;
  value: string;
  percentage: number;
}

const BestOfCharts = () => {
  const topDepartments: ChartItem[] = [
    { rank: 1, name: 'Department of Health', value: '12,456', percentage: 92 },
    { rank: 2, name: 'Department of Education', value: '10,823', percentage: 85 },
    { rank: 3, name: 'Public Works', value: '8,912', percentage: 78 },
  ];

  const topRegions: ChartItem[] = [
    { rank: 1, name: 'Central Region', value: '45,678', percentage: 95 },
    { rank: 2, name: 'Northern Province', value: '38,234', percentage: 88 },
    { rank: 3, name: 'Southern District', value: '32,145', percentage: 82 },
  ];

  const renderChartSection = (title: string, items: ChartItem[], icon: React.ReactNode) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.rank} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    item.rank === 1
                      ? 'bg-amber-500 text-white'
                      : item.rank === 2
                      ? 'bg-gray-400 text-white'
                      : 'bg-orange-600 text-white'
                  }`}
                >
                  {item.rank}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.value} records</p>
                </div>
              </div>
              {item.rank === 1 && <Award className="text-amber-500" size={20} />}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderChartSection(
        'Top Performing Departments',
        topDepartments,
        <Building2 className="text-blue-600" size={20} />
      )}
      {renderChartSection(
        'Most Active Regions',
        topRegions,
        <MapPin className="text-blue-600" size={20} />
      )}
    </div>
  );
};

export default BestOfCharts;
