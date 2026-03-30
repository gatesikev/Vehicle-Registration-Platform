const SelectField = ({ label, error, options, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        {...props}
        className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 transition bg-white ${
          error
            ? 'border-red-400 focus:ring-red-300 bg-red-50'
            : 'border-gray-300 focus:ring-blue-300'
        }`}
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

export default SelectField