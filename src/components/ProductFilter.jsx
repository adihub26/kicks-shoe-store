import React from 'react'

const ProductFilter = ({ title, filters, selectedValue, onFilterChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {filters.map((filter) => (
          <label key={filter.value} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name={title}
              value={filter.value}
              checked={selectedValue === filter.value}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{filter.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default ProductFilter