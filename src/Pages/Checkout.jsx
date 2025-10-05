import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import Payment from '../components/Payment';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { createOrder } = useOrder();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const navigate = useNavigate();

  // ✅ Double verification on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('kicksUser') || '{}');
    const addresses = JSON.parse(localStorage.getItem('kicksUserAddresses') || '[]');
    
    // Check if user is logged in
    if (!user.uid) {
      alert('Please login to access checkout');
      navigate('/login?redirect=checkout');
      return;
    }

    // Check if user has addresses
    if (addresses.length === 0) {
      alert('Please add a shipping address in your profile before checkout');
      navigate('/profile');
      return;
    }

    setUserAddresses(addresses);
    setSelectedAddress(addresses[0]); // Set default address
  }, [navigate]);

  // ✅ Debug log
  console.log('🛒 Checkout rendered, cartItems:', cartItems);

  // ✅ Safety check
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart items...</p>
        </div>
      </div>
    );
  }

  const totalAmount = getCartTotal();
  console.log('💰 Total amount:', totalAmount);

  const handlePaymentSuccess = (response) => {
    console.log('✅ Payment Success Handler Called:', response);
    
    // Get user data
    const user = JSON.parse(localStorage.getItem('kicksUser') || '{}');
    console.log('👤 User data:', user);
    
    // Create order data
    const orderData = {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size
      })),
      shippingAddress: selectedAddress || 'Address not provided',
      paymentMethod: 'Razorpay',
      paymentId: response.razorpay_payment_id || 'simulated_payment_id',
      orderId: response.razorpay_order_id || 'simulated_order_id',
      subtotal: totalAmount,
      shippingFee: 99,
      tax: Math.round(totalAmount * 0.18),
      total: totalAmount + 99 + Math.round(totalAmount * 0.18)
    };

    console.log('📦 Order data prepared:', orderData);

    try {
      console.log('🔄 Creating order...');
      
      // Create order in the system
      const newOrder = createOrder(orderData);
      console.log('🎉 Order created successfully:', newOrder);
      
      console.log('🔄 Clearing cart...');
      // Clear cart
      clearCart();
      console.log('🛒 Cart cleared');
      
      console.log('🔄 Setting payment success state...');
      // Set success state
      setPaymentSuccess(true);
      console.log('✅ Payment success state set to true');
      
      console.log('💾 Saving last order ID...');
      // Save order reference
      localStorage.setItem('lastOrderId', newOrder.id);
      console.log('📋 Last order ID saved:', newOrder.id);
      
      console.log('🎊 SUCCESS: Payment flow completed!');
      
      // ✅ AUTOMATIC REDIRECT TO HOME AFTER 3 SECONDS
      setTimeout(() => {
        console.log('🏠 Redirecting to home page...');
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error in payment success handler:', error);
      alert('Order creation failed. Please contact support.');
    }
  };

  const handlePaymentFailure = (error) => {
    console.error('❌ Payment Failed:', error);
    alert('Payment failed. Please try again.');
  };

  if (paymentSuccess) {
    console.log('🎊 Rendering Success Screen');
    const lastOrderId = localStorage.getItem('lastOrderId');
    console.log('📋 Last order ID from storage:', lastOrderId);
    
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
            <p className="text-gray-600 mb-4">Thank you for your order. Your payment has been processed successfully.</p>
            
            {lastOrderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-gray-900">{lastOrderId}</p>
              </div>
            )}

            {/* ✅ ADDED: Auto-redirect message */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                🔄 Redirecting to home page in 3 seconds...
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  console.log('📱 Navigating to profile');
                  navigate('/profile');
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View Your Orders
              </button>
              
              <button
                onClick={() => {
                  console.log('🏠 Navigating to home');
                  navigate('/');
                }}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Continue Shopping
              </button>
            </div>
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
          {/* Order Summary & Address Selection */}
          <div className="space-y-6">
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
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%):</span>
                  <span>₹{Math.round(totalAmount * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{(totalAmount + 99 + Math.round(totalAmount * 0.18)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Address Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-3">
                {userAddresses.map((address, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id={`address-${index}`}
                      name="shippingAddress"
                      checked={selectedAddress === address}
                      onChange={() => setSelectedAddress(address)}
                      className="mt-1"
                    />
                    <label htmlFor={`address-${index}`} className="flex-1">
                      <div className={`p-3 border rounded-lg ${selectedAddress === address ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <p className="text-gray-900">{address}</p>
                        {index === 0 && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Manage Addresses
              </button>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            {console.log('🎯 Rendering Payment component with amount:', totalAmount)}
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