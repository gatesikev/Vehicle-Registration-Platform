import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../services/api'

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await api.get('/vehicle')
      return response.data
    },
  })

  const vehicles = data?.data || data || []

  const stats = {
    total: vehicles.length,
    electric: vehicles.filter(v => v.vehicleType === 'ELECTRIC').length,
    new: vehicles.filter(v => v.status === 'NEW').length,
    used: vehicles.filter(v => v.status === 'USED').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>
            <p className="text-gray-500 mt-1">Vehicle management overview</p>
          </div>
          <Link
            to="/vehicle/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            + Register New Vehicle
          </Link>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Vehicles', value: stats.total, color: 'bg-blue-500', icon: '🚗' },
              { label: 'Electric', value: stats.electric, color: 'bg-green-500', icon: '⚡' },
              { label: 'New Vehicles', value: stats.new, color: 'bg-purple-500', icon: '✨' },
              { label: 'Used Vehicles', value: stats.used, color: 'bg-yellow-500', icon: '🔧' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                <div className={`${stat.color} text-white text-2xl w-12 h-12 rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Vehicles Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Recent Vehicles</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3">Manufacturer</th>
                <th className="px-6 py-3">Model</th>
                <th className="px-6 py-3">Year</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.slice(0, 10).map((vehicle) => (
                <tr key={vehicle.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{vehicle.manufacturer}</td>
                  <td className="px-6 py-4 text-gray-600">{vehicle.model}</td>
                  <td className="px-6 py-4 text-gray-600">{vehicle.year}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {vehicle.vehicleType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'NEW'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/vehicle/${vehicle.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard