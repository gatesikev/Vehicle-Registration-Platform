import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import { step1Schema, step2Schema, step3Schema } from '../validation/vehicleSchema'
import InputField from '../components/ui/InputField'
import SelectField from '../components/ui/SelectField'

const STEPS = ['Vehicle Info', 'Owner Info', 'Registration & Insurance']

const RegisterVehicle = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const schemas = [step1Schema, step2Schema, step3Schema]

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemas[currentStep]),
    mode: 'onChange',
  })

  const ownerType = watch('ownerType')

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.post('/vehicle', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles'])
      toast.success('Vehicle registered successfully! 🎉')
      navigate('/')
    },
   onError: (error) => {
  console.log('FULL ERROR:', error?.response?.data)
  const errors = error?.response?.data?.errors
  if (errors && Array.isArray(errors)) {
    errors.forEach((err) => toast.error(err.message || err))
  } else if (error?.response?.data?.message) {
    toast.error(error.response.data.message)
  } else {
    toast.error('Something went wrong. Please try again.')
  }
},
  })

  const onNext = (data) => {
    const updated = { ...formData, ...data }
    setFormData(updated)
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Final submit — shape the payload
     const payload = {
  manufacture: updated.manufacturer,
  model: updated.model,
  year: Number(updated.year),
  vehicleType: updated.vehicleType,
  bodyType: updated.bodyType,
  color: updated.color,
  fuelType: updated.fuelType,
  engineCapacity: Number(updated.engineCapacity),
  odometerReading: Number(updated.odometerReading),
  seatingCapacity: Number(updated.seatingCapacity),
  vehiclePurpose: updated.purpose,
  vehicleStatus: updated.status,
  ownerName: updated.ownerName,
  ownerType: updated.ownerType,
  nationalId: updated.nationalId,
  passportNumber: updated.passportNumber || '',
  companyRegNumber: updated.companyRegNumber || '',
  address: updated.address,
  mobile: updated.mobileNumber,
  email: updated.email,
  plateNumber: updated.plateNumber,
  registrationStatus: updated.registrationStatus,
  registrationDate: new Date(updated.registrationDate).toISOString(),
  expiryDate: new Date(updated.expiryDate).toISOString(),
  state: updated.address,
  plateType: updated.plateType,
  policyNumber: updated.policyNumber,
  companyName: updated.insuranceCompany,
  insuranceExpiryDate: new Date(updated.insuranceExpiryDate).toISOString(),
  insuranceStatus: updated.insuranceStatus,
  insuranceType: updated.insuranceType,
  roadworthyCert: updated.roadworthyCert,
  customsRef: updated.customsRef,
  proofOfOwnership: updated.proofOfOwnership,
} 
      mutate(payload)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Register New Vehicle</h1>
        <p className="text-gray-500 mb-8">Fill in all details carefully across the steps below.</p>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className={`text-sm font-medium ${
                index === currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}>{step}</span>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-1 rounded ${
                  index < currentStep ? 'bg-green-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow p-8">
          <form onSubmit={handleSubmit(onNext)}>

            {/* Step 1 - Vehicle Info */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Manufacturer" error={errors.manufacturer?.message}
                  {...register('manufacturer')} placeholder="e.g. Toyota" />
                <InputField label="Model" error={errors.model?.message}
                  {...register('model')} placeholder="e.g. Corolla" />
                <InputField label="Year" type="number" error={errors.year?.message}
                  {...register('year', { valueAsNumber: true })} placeholder="e.g. 2020" />
                <InputField label="Body Type" error={errors.bodyType?.message}
                  {...register('bodyType')} placeholder="e.g. Sedan" />
                <InputField label="Color" error={errors.color?.message}
                  {...register('color')} placeholder="e.g. White" />
                <InputField label="Engine Capacity (cc)" type="number" error={errors.engineCapacity?.message}
                  {...register('engineCapacity', { valueAsNumber: true })} placeholder="e.g. 1800" />
                <InputField label="Seating Capacity" type="number" error={errors.seatingCapacity?.message}
                  {...register('seatingCapacity', { valueAsNumber: true })} placeholder="e.g. 5" />
                <InputField label="Odometer Reading (km)" type="number" error={errors.odometerReading?.message}
                  {...register('odometerReading', { valueAsNumber: true })} placeholder="e.g. 0" />
                <SelectField label="Vehicle Type" error={errors.vehicleType?.message}
                  {...register('vehicleType')}
                  options={['ELECTRIC', 'SUV', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN', 'PICKUP', 'OTHER']} />
                <SelectField label="Fuel Type" error={errors.fuelType?.message}
                  {...register('fuelType')}
                  options={['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'OTHER']} />
                <SelectField label="Purpose" error={errors.purpose?.message}
                  {...register('purpose')}
                  options={['PERSONAL', 'COMMERCIAL', 'TAXI', 'GOVERNMENT']} />
                <SelectField label="Status" error={errors.status?.message}
                  {...register('status')}
                  options={['NEW', 'USED', 'REBUILT']} />
              </div>
            )}

            {/* Step 2 - Owner Info */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Owner Name" error={errors.ownerName?.message}
                  {...register('ownerName')} placeholder="e.g. John Doe" />
                <SelectField label="Owner Type" error={errors.ownerType?.message}
                  {...register('ownerType')}
                  options={['INDIVIDUAL', 'COMPANY', 'NGO', 'GOVERNMENT']} />
                <InputField label="National ID (16 digits)" error={errors.nationalId?.message}
                  {...register('nationalId')} placeholder="e.g. 1199800012345678" />
                <InputField label="Mobile Number (10 digits)" error={errors.mobileNumber?.message}
                  {...register('mobileNumber')} placeholder="e.g. 0788123456" />
                <InputField label="Email" type="email" error={errors.email?.message}
                  {...register('email')} placeholder="e.g. john@example.com" />
                <InputField label="Address" error={errors.address?.message}
                  {...register('address')} placeholder="e.g. KG 123 St, Kigali" />
                {ownerType === 'COMPANY' && (
                  <InputField label="Company Registration Number" error={errors.companyRegNumber?.message}
                    {...register('companyRegNumber')} placeholder="e.g. 123456789" />
                )}
                <InputField label="Passport Number (optional)" error={errors.passportNumber?.message}
                  {...register('passportNumber')} placeholder="e.g. A12345678" />
              </div>
            )}

            {/* Step 3 - Registration & Insurance */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Plate Number" error={errors.plateNumber?.message}
                  {...register('plateNumber')} placeholder="e.g. RAB 123 A" />
                <SelectField label="Plate Type" error={errors.plateType?.message}
                  {...register('plateType')}
                  options={['PRIVATE', 'COMMERCIAL', 'GOVERNMENT', 'DIPLOMATIC', 'PERSONALIZED']} />
                <InputField label="Registration Date" type="date" error={errors.registrationDate?.message}
                  {...register('registrationDate')} />
                <InputField label="Registration Expiry Date" type="date" error={errors.expiryDate?.message}
                  {...register('expiryDate')} />
                <SelectField label="Registration Status" error={errors.registrationStatus?.message}
                  {...register('registrationStatus')}
                  options={['ACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING']} />
                <InputField label="Customs Reference" error={errors.customsRef?.message}
                  {...register('customsRef')} placeholder="e.g. CUST-2024-001" />
                <InputField label="Proof of Ownership" error={errors.proofOfOwnership?.message}
                  {...register('proofOfOwnership')} placeholder="e.g. DEED-2024-001" />
                <InputField label="Roadworthy Certificate" error={errors.roadworthyCert?.message}
                  {...register('roadworthyCert')} placeholder="e.g. RW-CERT-001" />
                <div className="col-span-2 border-t pt-4 mt-2">
                  <h3 className="text-md font-semibold text-gray-700 mb-4">🛡️ Insurance Details</h3>
                </div>
                <InputField label="Policy Number" error={errors.policyNumber?.message}
                  {...register('policyNumber')} placeholder="e.g. POL-2024-001" />
                <InputField label="Insurance Company" error={errors.insuranceCompany?.message}
                  {...register('insuranceCompany')} placeholder="e.g. Sanlam Insurance" />
                <InputField label="Insurance Type" error={errors.insuranceType?.message}
                  {...register('insuranceType')} placeholder="e.g. Comprehensive" />
                <InputField label="Insurance Expiry Date" type="date" error={errors.insuranceExpiryDate?.message}
                  {...register('insuranceExpiryDate')} />
                <SelectField label="Insurance Status" error={errors.insuranceStatus?.message}
                  {...register('insuranceStatus')}
                  options={['ACTIVE', 'SUSPENDED', 'EXPIRED']} />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
                >
                  ← Back
                </button>
              ) : <div />}

              <button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {currentStep < STEPS.length - 1
                  ? 'Next →'
                  : isPending ? 'Submitting...' : 'Submit 🚗'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterVehicle