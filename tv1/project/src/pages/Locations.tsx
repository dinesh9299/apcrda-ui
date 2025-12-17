import { MapPin, Search, Filter, Building2, Users, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const locations = [
  {
    id: 1,
    name: 'Central District Office',
    address: '123 Main Street, Capital City',
    type: 'Administrative',
    population: 45000,
    status: 'Active',
    statusColor: 'bg-green-500',
    projects: 12,
    budget: '$2.4M',
  },
  {
    id: 2,
    name: 'North Regional Center',
    address: '456 North Avenue, Northville',
    type: 'Service Center',
    population: 32000,
    status: 'Active',
    statusColor: 'bg-green-500',
    projects: 8,
    budget: '$1.8M',
  },
  {
    id: 3,
    name: 'East Community Hub',
    address: '789 East Boulevard, Eastside',
    type: 'Community',
    population: 28000,
    status: 'Under Review',
    statusColor: 'bg-amber-500',
    projects: 5,
    budget: '$1.2M',
  },
  {
    id: 4,
    name: 'South Development Zone',
    address: '321 South Highway, Southpoint',
    type: 'Development',
    population: 15000,
    status: 'Planning',
    statusColor: 'bg-blue-500',
    projects: 15,
    budget: '$3.1M',
  },
  {
    id: 5,
    name: 'West Innovation District',
    address: '654 West Circle, Westend',
    type: 'Innovation Hub',
    population: 38000,
    status: 'Active',
    statusColor: 'bg-green-500',
    projects: 20,
    budget: '$4.2M',
  },
  {
    id: 6,
    name: 'Coastal Services Center',
    address: '987 Beachfront Drive, Coastside',
    type: 'Service Center',
    population: 22000,
    status: 'Active',
    statusColor: 'bg-green-500',
    projects: 7,
    budget: '$1.5M',
  },
];

export default function Locations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || location.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const locationTypes = ['All', ...Array.from(new Set(locations.map((loc) => loc.type)))];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {locationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
              Add Location
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {location.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                      {location.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600 flex items-start">
                  <Building2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                  {location.address}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                    {location.population.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-1.5 text-gray-400" />
                    {location.projects} Projects
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${location.statusColor}`}
                    ></span>
                    <span className="text-sm font-medium text-gray-900">
                      {location.status}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {location.budget}
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Location Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{locations.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Locations</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {locations.filter((l) => l.status === 'Active').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Active Sites</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {locations.reduce((sum, l) => sum + l.projects, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Projects</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {locations.reduce((sum, l) => sum + l.population, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Population</p>
          </div>
        </div>
      </div>
    </div>
  );
}
