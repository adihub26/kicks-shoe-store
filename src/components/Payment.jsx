import React, { useState } from 'react';
import { loadRazorpay, RAZORPAY_CONFIG } from '../utils/razorpay';

const Payment = ({ amount, onSuccess, onFailure, cartItems }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    console.log('🔄 Starting payment process...');
    console.log('💰 Amount:', amount);

    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpay();
      console.log('📦 Razorpay loaded:', isLoaded);
      
      if (!isLoaded) {
        alert('Razorpay payment gateway failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Convert amount to paise
      const amountInPaise = Math.round(amount * 100);
      
      // Validate amount
      if (amountInPaise < 100) {
        alert('Amount must be at least ₹1');
        setLoading(false);
        return;
      }

      console.log('🔑 Using Razorpay key:', RAZORPAY_CONFIG.key);

      // Razorpay options
      const options = {
        key: RAZORPAY_CONFIG.key,
        amount: amountInPaise,
        currency: 'INR',
        name: 'KICKS Store',
        description: 'Shoe Purchase',
        
        handler: function (response) {
          console.log('✅ Payment Success:', response);
          setLoading(false);
          if (onSuccess) {
            onSuccess(response);
          }
        },
        
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999'
        },
        
        theme: {
          color: '#3B82F6'
        }
      };

      console.log('🎯 Opening Razorpay modal...');

      // Create and open Razorpay instance
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('❌ Payment Failed:', response.error);
        setLoading(false);
        alert(`Payment Failed: ${response.error.description || 'Please try again'}`);
        if (onFailure) {
          onFailure(new Error(response.error.description));
        }
      });

      // Open payment modal
      razorpay.open();
      
    } catch (error) {
      console.error('💥 Payment Error:', error);
      setLoading(false);
      alert('Payment processing error. Please try again.');
      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Complete Your Purchase</h3>
      
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Order Total:</span>
          <span className="text-xl font-bold text-green-700">₹{amount}</span>
        </div>
        <p className="text-sm text-gray-600">{cartItems?.length || 0} items in cart</p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing Payment...
          </>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Test Card Details:</h4>
        <div className="text-xs text-gray-700 space-y-1">
          <p><strong>Card Number:</strong> 4111 1111 1111 1111</p>
          <p><strong>Expiry:</strong> 12/30</p>
          <p><strong>CVV:</strong> 123</p>
          <p><strong>OTP:</strong> 123456</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;