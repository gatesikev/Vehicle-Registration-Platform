const InputField = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 transition ${
          error
            ? 'border-red-400 focus:ring-red-300 bg-red-50'
            : 'border-gray-300 focus:ring-blue-300'
        }`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

export default InputField