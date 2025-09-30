import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, processRazorpayPayment } = useCart()
  const navigate = useNavigate()
  const [paymentLoading, setPaymentLoading] = useState(false)

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity < 1) return
    updateQuantity(productId, size, newQuantity)
  }

  const calculateTotal = () => {
    const subtotal = getCartTotal()
    const shipping = subtotal > 5000 ? 0 : 99
    const tax = subtotal * 0.18
    return (subtotal + shipping + tax).toFixed(2)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setPaymentLoading(true)

    try {
      await processRazorpayPayment(
        parseFloat(calculateTotal()),
        cart,
        (response) => { // Only one parameter now
          // Payment success
          setPaymentLoading(false)
          console.log('SUCCESS - Payment response:', response);
          alert('Payment successful! Your order has been placed.')
          clearCart()
          // You can navigate to order success page here
          // navigate('/order-success')
        },
        (error) => {
          // Payment failed
          setPaymentLoading(false)
          if (error.message.includes('cancelled')) {
            alert('Payment was cancelled. Please try again.')
          } else {
            alert('Payment failed. Please try again.')
          }
        }
      )
    } catch (error) {
      setPaymentLoading(false)
      alert('Payment processing error. Please try again.')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to see them here.</p>
            <Link
              to="/sports"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">Size: UK {item.size}</p>
                        <p className="text-green-600 font-semibold mt-1">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {getCartTotal() > 5000 ? 'FREE' : '₹99'}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">₹{(getCartTotal() * 0.18).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-6 space-y-4">
              <button
                onClick={handleCheckout}
                disabled={paymentLoading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentLoading ? 'Processing Payment...' : `Pay ₹${calculateTotal()} with Razorpay`}
              </button>
              <Link
                to="/sports"
                className="block w-full text-center bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Razorpay Test Info */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Test Payment Information</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>💳 <strong>Card Number:</strong> 4111 1111 1111 1111</p>
                <p>📅 <strong>Expiry Date:</strong> Any future date</p>
                <p>🔐 <strong>CVV:</strong> Any 3 digits</p>
                <p>📧 <strong>OTP:</strong> 123456</p>
              </div>
            </div>

            {/* Security Badges */}
            <div className="mt-6 flex justify-center space-x-6">
              <div className="text-center">
                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
              <div className="text-center">
                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-xs text-gray-600">Free Shipping Over ₹5000</p>
              </div>
              <div className="text-center">
                <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart