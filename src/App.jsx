import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './Pages/Home'
import AllSports from './Pages/SportsCategory/AllSports'
import AllComet from './Pages/CometCategory/AllComet'
import AllHighDunks from './Pages/StyleCategory/AllHighDunks'
import AllSneakers from './Pages/StyleCategory/AllSneakers'
import ProductDetail from './components/ProductDetail'
import Cart from '/src/components/Cart'
import Wishlist from './components/Wishlist'
import Login from './components/Login'
import Profile from './Pages/Profile'
import Orders from './Pages/Orders' // ✅ Add this import
import Checkout from './Pages/Checkout'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { OrderProvider } from './context/OrderContext'

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <OrderProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sports" element={<AllSports />} />
                <Route path="/comet" element={<AllComet />} />
                <Route path="/highdunks" element={<AllHighDunks />} />
                <Route path="/sneakers" element={<AllSneakers />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={ // ✅ Add this route
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          </Router>
        </OrderProvider>
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
