import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('shoeStoreCart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('shoeStoreCart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, size) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.id === product.id && item.size === size
      )
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...product, size, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId, size) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.id === productId && item.size === size)
    ))
  }

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) return
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('shoeStoreCart')
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Razorpay integration helper methods
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const processRazorpayPayment = async (amount, cartItems, onSuccess, onFailure) => {
    try {
      console.log('Starting payment process...');
      console.log('Amount:', amount);

      // Load Razorpay script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }
      console.log('Razorpay script loaded');

      // Convert amount to paise (remove decimal places)
      const amountInPaise = Math.round(amount * 100);
      
      // Make sure amount is at least 100 paise (₹1)
      if (amountInPaise < 100) {
        throw new Error('Amount must be at least ₹1');
      }

      // Razorpay options - NO order_id, let Razorpay handle it
      const options = {
        key: 'rzp_test_RNZkQbVXzrFcEy', // ← REPLACE WITH YOUR ACTUAL KEY
        amount: amountInPaise,
        currency: 'INR',
        name: 'KICKS Shoe Store',
        description: `Payment for ${cartItems.length} item(s) from KICKS`,
        // REMOVED: order_id - let Razorpay create the order
        
        handler: function (response) {
          console.log('Payment successful!', response);
          onSuccess(response);
        },
        
        prefill: {
          name: 'Test Customer',
          email: 'test@kicks.com',
          contact: '9999999999'
        },
        
        theme: {
          color: '#2563eb'
        },
        
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed by user');
            onFailure(new Error('Payment cancelled by user'));
          }
        }
      };

      console.log('Opening Razorpay modal with options:', options);
      
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        onFailure(new Error(response.error.description || 'Payment failed'));
      });

      razorpay.open();
      
    } catch (error) {
      console.error('Payment processing error:', error);
      onFailure(error);
    }
  };

  const value = {
    cart,
    cartItems: cart, // ✅ ADD THIS LINE - provides cartItems as alias for cart
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    // Razorpay methods
    processRazorpayPayment,
    loadRazorpay
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}