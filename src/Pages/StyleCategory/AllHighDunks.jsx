import React, { useState, useEffect } from 'react'
import ProductCard from "/src/components/ProductCard.jsx";
import ProductFilter from "/src/components/ProductFilter.jsx";
import { highDunksProducts } from '../../data/JS HighDunksProducts'

const AllHighDunks = () => {
  const [filteredProducts, setFilteredProducts] = useState(highDunksProducts)
  const [filters, setFilters] = useState({
    priceRange: 'all',
    rating: 'all'
  })

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-5000', label: 'Under ₹5000' },
    { value: '5000-6000', label: '₹5000 - ₹6000' },
    { value: '6000-7000', label: '₹6000 - ₹7000' },
    { value: '7000+', label: 'Over ₹7000' }
  ]

  const ratings = [
    { value: 'all', label: 'All Ratings' },
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4.0', label: '4.0+ Stars' },
    { value: '3.5', label: '3.5+ Stars' }
  ]

  useEffect(() => {
    let filtered = highDunksProducts

    // Filter by price range
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case '0-5000':
          filtered = filtered.filter(product => product.price < 5000)
          break
        case '5000-6000':
          filtered = filtered.filter(product => product.price >= 5000 && product.price <= 6000)
          break
        case '6000-7000':
          filtered = filtered.filter(product => product.price >= 6000 && product.price <= 7000)
          break
        case '7000+':
          filtered = filtered.filter(product => product.price > 7000)
          break
        default:
          break
      }
    }

    // Filter by rating
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter(product => product.rating >= minRating)
    }

    setFilteredProducts(filtered)
  }, [filters])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">High Dunks</h1>
          <p className="text-lg text-gray-600">
            Classic high-top designs with premium styling
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <ProductFilter
              title="Price Range"
              filters={priceRanges}
              selectedValue={filters.priceRange}
              onFilterChange={(value) => handleFilterChange('priceRange', value)}
            />

            <ProductFilter
              title="Customer Rating"
              filters={ratings}
              selectedValue={filters.rating}
              onFilterChange={(value) => handleFilterChange('rating', value)}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllHighDunks