import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../services/api'

const TABS = ['Info', 'Owner', 'Registration', 'Insurance']

const VehicleDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('Info')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Segmented queries - each tab fetches its own endpoint
  const infoQuery = useQuery({
    queryKey: ['vehicle', id, 'info'],
    queryFn: async () => {
      const res = await api.get(`/vehicle/${id}/info`)
      return res.data
    },
    enabled: activeTab === 'Info',
  })

  const ownerQuery = useQuery({
    queryKey: ['vehicle', id, 'owner'],
    queryFn: async () => {
      const res = await api.get(`/vehicle/${id}/owner`)
      return res.data
    },
    enabled: activeTab === 'Owner',
  })

  const registrationQuery = useQuery({
    queryKey: ['vehicle', id, 'registration'],
    queryFn: async () => {
      const res = await api.get(`/vehicle/${id}/registration`)
      return res.data
    },
    enabled: activeTab === 'Registration',
  })

  const insuranceQuery = useQuery({
    queryKey: ['vehicle', id, 'insurance'],
    queryFn: async () => {
      const res = await api.get(`/vehicle/${id}/insurance`)
      return res.data
    },
    enabled: activeTab === 'Insurance',
  })

  // Delete mutation
  const { mutate: deleteVehicle, isPending: isDeleting } = useMutation({
    mutationFn: () => api.delete(`/vehicle/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles'])
      toast.success('Vehicle deleted successfully!')
      navigate('/')
    },
    onError: () => toast.error('Failed to delete vehicle.'),
  })

  const getActiveData = () => {
    switch (activeTab) {
      case 'Info': return { query: infoQuery }
      case 'Owner': return { query: ownerQuery }
      case 'Registration': return { query: registrationQuery }
      case 'Insurance': return { query: insuranceQuery }
      default: return { query: infoQuery }
    }
  }

  const { query } = getActiveData()
  const data = query?.data?.data || query?.data || {}

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-RW', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const StatusBadge = ({ value }) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-700',
      EXPIRED: 'bg-red-100 text-red-700',
      SUSPENDED: 'bg-yellow-100 text-yellow-700',
      PENDING: 'bg-blue-100 text-blue-700',
      NEW: 'bg-green-100 text-green-700',
      USED: 'bg-yellow-100 text-yellow-700',
      REBUILT: 'bg-gray-100 text-gray-700',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[value] || 'bg-gray-100 text-gray-600'}`}>
        {value || 'N/A'}
      </span>
    )
  }

  const Field = ({ label, value, isStatus }) => (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      {isStatus ? <StatusBadge value={value} /> : (
        <p className="text-gray-800 font-medium">{value || 'N/A'}</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:underline text-sm mb-2 block"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">🚘 Vehicle Details</h1>
            <p className="text-gray-500 text-sm mt-1">ID: {id}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/vehicle/${id}/edit`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow p-8">
          {query.isLoading ? (
            <p className="text-gray-400 animate-pulse text-center py-10">Loading {activeTab} data...</p>
          ) : query.isError ? (
            <p className="text-red-500 text-center py-10">Failed to load {activeTab} data.</p>
          ) : (
            <>
              {/* Info Tab */}
              {activeTab === 'Info' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Manufacturer" value={data.manufacture} />
                  <Field label="Model" value={data.model} />
                  <Field label="Year" value={data.year} />
                  <Field label="Body Type" value={data.bodyType} />
                  <Field label="Color" value={data.color} />
                  <Field label="Vehicle Type" value={data.vehicleType} />
                  <Field label="Fuel Type" value={data.fuelType} />
                  <Field label="Engine Capacity" value={data.engineCapacity ? `${data.engineCapacity} cc` : null} />
                  <Field label="Seating Capacity" value={data.seatingCapacity} />
                  <Field label="Odometer Reading" value={data.odometerReading ? `${data.odometerReading} km` : null} />
                  <Field label="Purpose" value={data.vehiclePurpose} />
                  <Field label="Status" value={data.vehicleStatus} isStatus />
                </div>
              )}

              {/* Owner Tab */}
              {activeTab === 'Owner' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Owner Name" value={data.ownerName} />
                  <Field label="Owner Type" value={data.ownerType} />
                  <Field label="National ID" value={data.nationalId} />
                  <Field label="Mobile" value={data.mobile} />
                  <Field label="Email" value={data.email} />
                  <Field label="Address" value={data.address} />
                  {data.companyRegNumber && (
                    <Field label="Company Reg Number" value={data.companyRegNumber} />
                  )}
                  {data.passportNumber && (
                    <Field label="Passport Number" value={data.passportNumber} />
                  )}
                </div>
              )}

              {/* Registration Tab */}
              {activeTab === 'Registration' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Plate Number" value={data.plateNumber} />
                  <Field label="Plate Type" value={data.plateType} />
                  <Field label="Registration Date" value={formatDate(data.registrationDate)} />
                  <Field label="Expiry Date" value={formatDate(data.expiryDate)} />
                  <Field label="State" value={data.state} />
                  <Field label="Status" value={data.registrationStatus} isStatus />
                  <Field label="Customs Ref" value={data.customsRef} />
                  <Field label="Proof of Ownership" value={data.proofOfOwnership} />
                  <Field label="Roadworthy Certificate" value={data.roadworthyCert} />
                </div>
              )}

              {/* Insurance Tab */}
              {activeTab === 'Insurance' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Policy Number" value={data.policyNumber} />
                  <Field label="Company Name" value={data.companyName} />
                  <Field label="Insurance Type" value={data.insuranceType} />
                  <Field label="Expiry Date" value={formatDate(data.insuranceExpiryDate)} />
                  <Field label="Status" value={data.insuranceStatus} isStatus />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">⚠️ Delete Vehicle</h2>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteVehicle()}
                disabled={isDeleting}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VehicleDetails