import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { sportsProducts } from '../data/JS SportsProducts'
import { cometProducts } from '../data/JS CometProducts'
import { highDunksProducts } from '../data/JS HighDunksProducts'
import { sneakersProducts } from '../data/JS SneakersProducts'
import Newsletter from '../components/Newsletter'  // ADD THIS IMPORT

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [trendingProducts, setTrendingProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])

  // Enhanced banner slides with sports-focused images
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      title: "Sports Performance",
      description: "Engineered for athletes who demand the best",
      buttonText: "Shop Sports",
      buttonLink: "/sports"
    },
    {
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      title: "Urban Style Collection",
      description: "Street fashion meets premium comfort",
      buttonText: "Shop Urban",
      buttonLink: "/sneakers"
    },
    {
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      title: "Limited Edition Drops",
      description: "Exclusive releases and collaborations",
      buttonText: "New Arrivals",
      buttonLink: "/products"
    }
  ]

  useEffect(() => {
    // Combine all products
    const combinedProducts = [
      ...sportsProducts,
      ...cometProducts,
      ...highDunksProducts,
      ...sneakersProducts
    ]
    
    setAllProducts(combinedProducts)
    
    // Get trending products
    const trending = combinedProducts.filter(product => product.trending).slice(0, 8)
    setTrendingProducts(trending)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Get best selling products
  const bestSellingProducts = allProducts
    .filter(product => product.bestseller)
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Banner */}
      <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                <div className="container mx-auto px-6">
                  <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white mb-8 opacity-90">
                      {slide.description}
                    </p>
                    <Link
                      to={slide.buttonLink}
                      className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-110' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop By Category
            </h2>
            <p className="text-lg text-gray-600">
              Explore our diverse collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sports Category */}
            <Link
              to="/sports"
              className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-600 to-purple-700"
            >
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white w-full">
                  <h3 className="text-2xl font-bold mb-2">Sports</h3>
                  <p className="text-lg opacity-90">Performance & Athletic</p>
                  <div className="mt-3 text-red-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Shop Now →
                  </div>
                </div>
              </div>
            </Link>

            {/* Comet Category */}
            <Link
              to="/comet"
              className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white w-full">
                  <h3 className="text-2xl font-bold mb-2">Comet</h3>
                  <p className="text-lg opacity-90">Stylish & Trending</p>
                  <div className="mt-3 text-red-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Shop Now →
                  </div>
                </div>
              </div>
            </Link>

            {/* High Dunks Category */}
            <Link
              to="/highdunks"
              className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white w-full">
                  <h3 className="text-2xl font-bold mb-2">High Dunks</h3>
                  <p className="text-lg opacity-90">Classic & Premium</p>
                  <div className="mt-3 text-red-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Shop Now →
                  </div>
                </div>
              </div>
            </Link>

            {/* Sneakers Category */}
            <Link
              to="/sneakers"
              className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white w-full">
                  <h3 className="text-2xl font-bold mb-2">Sneakers</h3>
                  <p className="text-lg opacity-90">Casual & Comfort</p>
                  <div className="mt-3 text-red-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Shop Now →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Sellers
            </h2>
            <p className="text-lg text-gray-600">
              Customer favorites flying off the shelves
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore All Collections
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Discover our complete range of premium footwear
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {allProducts.slice(0, 12).map((product) => (
              <div key={product.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-red-500 font-bold text-sm">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REPLACE THE EXISTING NEWSLETTER SECTION WITH THIS */}
      <Newsletter />
      
    </div>
  )
}

export default Home
