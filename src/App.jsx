import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import AllSports from './pages/SportsCategory/AllSports'
import AllComet from './pages/CometCategory/AllComet'
import AllHighDunks from './pages/StyleCategory/AllHighDunks'
import AllSneakers from './pages/StyleCategory/AllSneakers'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Wishlist from './components/Wishlist'
import Login from './components/Login'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sports" element={<AllSports />} />
              <Route path="/comet" element={<AllComet />} />
              <Route path="/style/high-dunks" element={<AllHighDunks />} />
              <Route path="/style/sneakers" element={<AllSneakers />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Layout>
        </Router>
      </WishlistProvider>
    </CartProvider>
  )
}

export default App