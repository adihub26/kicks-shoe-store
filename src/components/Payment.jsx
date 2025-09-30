import React, { useState } from 'react';
import { loadRazorpay, RAZORPAY_CONFIG } from '../utils/razorpay';

const Payment = ({ amount, onSuccess, onFailure, cartItems }) => {
  const [loading, setLoading] = useState(false);

  // Dummy order creation (in real app, this would be your backend API)
  const createOrder = async (amount) => {
    // This is a dummy implementation
    // In production, call your backend to create order
    return {
      id: `order_${Date.now()}`,
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
    };
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load');
        return;
      }

      // Create order
      const order = await createOrder(amount);

      // Razorpay options
      const options = {
        key: RAZORPAY_CONFIG.key,
        amount: order.amount,
        currency: order.currency,
        name: RAZORPAY_CONFIG.name,
        description: `Payment for ${cartItems.length} item(s)`,
        order_id: order.id,
        
        // Dummy handler functions
        handler: function (response) {
          console.log('Payment successful:', response);
          if (onSuccess) {
            onSuccess(response);
          }
        },
        
        prefill: {
          name: 'John Doe', // Dummy data
          email: 'john.doe@example.com',
          contact: '9999999999'
        },
        
        theme: {
          color: '#2563eb' // Blue color matching your theme
        },
        
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setLoading(false);
          }
        }
      };

      // Initialize Razorpay payment
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      if (onFailure) {
        onFailure(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
      
      <div className="mb-4">
        <p className="text-gray-600">Total Amount: ₹{amount}</p>
        <p className="text-sm text-gray-500">Items: {cartItems.length}</p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Test Card: 4111 1111 1111 1111 | CVV: Any | Expiry: Any future date
      </p>
    </div>
  );
};

export default Payment;