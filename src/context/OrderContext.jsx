import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('kicksOrders') || '[]');
    
    // If no orders exist, create sample data for testing
    if (savedOrders.length === 0) {
      const user = JSON.parse(localStorage.getItem('kicksUser') || '{}');
      if (user.uid) {
        const sampleOrders = createSampleOrders(user.uid);
        setOrders(sampleOrders);
        localStorage.setItem('kicksOrders', JSON.stringify(sampleOrders));
      } else {
        setOrders([]);
      }
    } else {
      setOrders(savedOrders);
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('kicksOrders', JSON.stringify(orders));
  }, [orders]);

  // Auto-update order statuses for live tracking simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          const orderAge = Date.now() - new Date(order.date).getTime();
          let newStatus = order.status;

          // Simulate real order progression
          if (order.status === 'processing' && orderAge > 2 * 60 * 1000) { // 2 minutes
            newStatus = 'shipped';
          } else if (order.status === 'shipped' && orderAge > 5 * 60 * 1000) { // 5 minutes
            newStatus = 'delivered';
          } else if (order.status === 'processing' && orderAge > 30 * 1000) { // 30 seconds
            // Add some random processing time variation
            if (Math.random() > 0.7) {
              newStatus = 'shipped';
            }
          }

          if (newStatus !== order.status) {
            console.log(`🔄 Order ${order.id} status updated: ${order.status} → ${newStatus}`);
            return { ...order, status: newStatus };
          }
          return order;
        })
      );
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Create sample orders for testing
  const createSampleOrders = (userId) => {
    const sampleOrders = [
      {
        id: 'ORD-' + (Date.now() - 86400000),
        userId: userId,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        items: [
          {
            id: 1,
            name: 'Nike Air Max 270',
            price: 12999,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150',
            size: '8'
          },
          {
            id: 2,
            name: 'Running Socks',
            price: 499,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1586351934193-6b655403ca71?w=150',
            size: 'M'
          }
        ],
        shippingAddress: '123 Main Street, Mumbai, Maharashtra 400001',
        paymentMethod: 'Razorpay',
        paymentId: 'pay_sample123',
        orderId: 'order_sample123',
        subtotal: 13997,
        shippingFee: 99,
        tax: 2519.46,
        total: 16615.46,
        trackingNumber: 'TRK123456789',
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        trackingUpdates: [
          {
            status: 'ordered',
            description: 'Order placed successfully',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Online Store'
          },
          {
            status: 'processing',
            description: 'Order confirmed and being processed',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            location: 'Warehouse'
          },
          {
            status: 'shipped',
            description: 'Order shipped via Express Delivery',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Mumbai Sorting Facility'
          },
          {
            status: 'delivered',
            description: 'Order delivered successfully',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
            location: 'Customer Address'
          }
        ]
      },
      {
        id: 'ORD-' + (Date.now() - 172800000),
        userId: userId,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'shipped',
        items: [
          {
            id: 3,
            name: 'Adidas Ultraboost',
            price: 15999,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150',
            size: '9'
          }
        ],
        shippingAddress: '456 Park Avenue, Delhi, Delhi 110001',
        paymentMethod: 'Razorpay',
        paymentId: 'pay_sample456',
        orderId: 'order_sample456',
        subtotal: 15999,
        shippingFee: 99,
        tax: 2879.82,
        total: 18977.82,
        trackingNumber: 'TRK987654321',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        trackingUpdates: [
          {
            status: 'ordered',
            description: 'Order placed successfully',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Online Store'
          },
          {
            status: 'processing',
            description: 'Order confirmed and being processed',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
            location: 'Warehouse'
          },
          {
            status: 'shipped',
            description: 'Order shipped via Standard Delivery',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Delhi Sorting Facility'
          }
        ]
      },
      {
        id: 'ORD-' + (Date.now() - 3600000),
        userId: userId,
        date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'processing',
        items: [
          {
            id: 4,
            name: 'Puma RS-X',
            price: 8999,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=150',
            size: '7'
          }
        ],
        shippingAddress: '789 Beach Road, Chennai, Tamil Nadu 600001',
        paymentMethod: 'Razorpay',
        paymentId: 'pay_sample789',
        orderId: 'order_sample789',
        subtotal: 8999,
        shippingFee: 99,
        tax: 1619.82,
        total: 10717.82,
        trackingNumber: 'TRK555888999',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        trackingUpdates: [
          {
            status: 'ordered',
            description: 'Order placed successfully',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            location: 'Online Store'
          },
          {
            status: 'processing',
            description: 'Order confirmed and being processed',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            location: 'Warehouse'
          }
        ]
      }
    ];
    return sampleOrders;
  };

  const createOrder = (orderData) => {
    const user = JSON.parse(localStorage.getItem('kicksUser') || '{}');
    
    const newOrder = {
      id: 'ORD-' + Date.now(),
      userId: user.uid,
      date: new Date().toISOString(),
      status: 'processing',
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentId: orderData.paymentId,
      orderId: orderData.orderId,
      subtotal: orderData.subtotal,
      shippingFee: orderData.shippingFee || 0,
      tax: orderData.tax || 0,
      total: orderData.total,
      trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      trackingUpdates: [
        {
          status: 'ordered',
          description: 'Order placed successfully',
          timestamp: new Date().toISOString(),
          location: 'Online Store'
        }
      ]
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    
    // Simulate processing start after 30 seconds
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'processing', 'Order confirmed and being processed', 'Warehouse');
    }, 30000);

    // Simulate shipping after 2 minutes
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'shipped', 'Order shipped via Express Delivery', 'Sorting Facility');
    }, 120000);

    // Simulate delivery after 5 minutes
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'delivered', 'Order delivered successfully', 'Customer Address');
    }, 300000);

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, description = '', location = '') => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          const newTrackingUpdate = {
            status: newStatus,
            description: description || `Order ${newStatus}`,
            timestamp: new Date().toISOString(),
            location: location || 'Processing Center'
          };

          return {
            ...order,
            status: newStatus,
            trackingUpdates: [...(order.trackingUpdates || []), newTrackingUpdate]
          };
        }
        return order;
      })
    );
  };

  const getUserOrders = (userId) => {
    console.log('Getting orders for user:', userId);
    
    const userOrders = orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log('Filtered user orders:', userOrders);
    return userOrders;
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const simulateTrackingUpdate = (orderId) => {
    const order = getOrderById(orderId);
    if (!order) return;

    const statusFlow = ['processing', 'shipped', 'delivered'];
    const currentIndex = statusFlow.indexOf(order.status);
    
    if (currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      const descriptions = {
        'processing': 'Order confirmed and being processed at warehouse',
        'shipped': 'Order shipped and in transit',
        'delivered': 'Order delivered successfully'
      };
      const locations = {
        'processing': 'Warehouse',
        'shipped': 'Sorting Facility',
        'delivered': 'Customer Address'
      };

      updateOrderStatus(orderId, nextStatus, descriptions[nextStatus], locations[nextStatus]);
    }
  };

  const value = {
    orders,
    createOrder,
    getUserOrders,
    updateOrderStatus,
    getOrderById,
    simulateTrackingUpdate
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};