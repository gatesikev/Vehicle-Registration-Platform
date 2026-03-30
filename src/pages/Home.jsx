import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await api.get('/vehicle')
      return response.data
    },
  })

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg animate-pulse">Loading vehicles...</p>
    </div>
  )

  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-lg">Failed to load vehicles. Please try again.</p>
    </div>
  )

  const vehicles = data?.data || data || []

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🚗 Vehicle Registry</h1>
            <p className="text-gray-500 mt-1">Public list of all registered vehicles</p>
          </div>
          {isAuthenticated && (
            <Link
              to="/vehicle/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              + Register Vehicle
            </Link>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Manufacturer</th>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Plate Number</th>
                <th className="px-6 py-4">Status</th>
                {isAuthenticated && <th className="px-6 py-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400">
                    No vehicles registered yet.
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{vehicle.manufacture}</td>
                    <td className="px-6 py-4 text-gray-600">{vehicle.model}</td>
                    <td className="px-6 py-4 text-gray-600">{vehicle.year}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {vehicle.vehicleType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{vehicle.plateNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vehicle.vehicleStatus === 'NEW'
                          ? 'bg-green-100 text-green-700'
                          : vehicle.vehicleStatus === 'USED'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {vehicle.vehicleStatus}
                      </span>
                    </td>
                    {isAuthenticated && (
                      <td className="px-6 py-4">
                        <Link
                          to={`/vehicle/${vehicle.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Home