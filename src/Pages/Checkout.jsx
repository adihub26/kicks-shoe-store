import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Payment from '../components/Payment';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  const totalAmount = getCartTotal();

  const handlePaymentSuccess = (response) => {
    console.log('Payment Successful:', response);
    setPaymentSuccess(true);
    clearCart();
    
    // You can save order details to localStorage or send to backend
    const orderDetails = {
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      amount: totalAmount,
      items: cartItems,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment Failed:', error);
    alert('Payment failed. Please try again.');
  };

  if (cartItems.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for your order. Your payment has been processed successfully.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                </div>
                <p className="font-semibold">₹{item.price}</p>
              </div>
            ))}
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <Payment
              amount={totalAmount}
              cartItems={cartItems}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
            
            {/* Test Payment Information */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Test Payment Information</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>💳 Card Number: <code>4111 1111 1111 1111</code></li>
                <li>📅 Expiry: Any future date</li>
                <li>🔐 CVV: Any 3 digits</li>
                <li>📧 OTP: 123456</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;