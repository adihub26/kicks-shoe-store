import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

const Orders = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();
  const { getUserOrders, simulateTrackingUpdate } = useOrder();

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('kicksUser') || '{}');
    if (!userData.uid) {
      navigate('/login?redirect=orders');
      return;
    }
    
    setUser(userData);
    
    // Load user's orders
    const userOrders = getUserOrders(userData.uid);
    setOrders(userOrders);
    setLoading(false);

    // Refresh orders every 30 seconds for live updates
    const interval = setInterval(() => {
      const updatedOrders = getUserOrders(userData.uid);
      setOrders(updatedOrders);
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate, getUserOrders]);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '🔄';
      case 'ordered': return '📦';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateOrderTotal = (order) => {
    return order.total || (order.subtotal + order.shippingFee + order.tax);
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleSimulateUpdate = (orderId) => {
    simulateTrackingUpdate(orderId);
    // Refresh orders after simulation
    const updatedOrders = getUserOrders(user?.uid);
    setOrders(updatedOrders);
  };

  const getDeliveryProgress = (order) => {
    const statusFlow = ['ordered', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusFlow.indexOf(order.status);
    return ((currentIndex + 1) / statusFlow.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Live order tracking - Status updates automatically</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Delivered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Shipped</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Processing</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h3>
              <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">Placed on {formatDate(order.date)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{calculateOrderTotal(order).toLocaleString()}
                      </p>
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Ordered</span>
                      <span>Processing</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getDeliveryProgress(order)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="p-6 border-t border-gray-200">
                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <img
                              src={item.image || 'https://cdn-icons-png.flaticon.com/512/869/869636.png'}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-gray-600">Size: {item.size}</p>
                              <p className="text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Shipping Information</h4>
                        <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Tracking Number:</strong> {order.trackingNumber}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Payment Information</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Payment Method:</strong> {order.paymentMethod}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Payment ID:</strong> {order.paymentId}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Order Total:</strong> ₹{calculateOrderTotal(order).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Live Tracking Updates */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Live Tracking Updates</h4>
                        {order.status !== 'delivered' && (
                          <button
                            onClick={() => handleSimulateUpdate(order.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Simulate Update
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {order.trackingUpdates?.map((update, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              update.status === 'delivered' ? 'bg-green-500' :
                              update.status === 'shipped' ? 'bg-blue-500' :
                              update.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                            } text-white`}>
                              {getStatusIcon(update.status)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{update.description}</p>
                              <p className="text-sm text-gray-600">{update.location}</p>
                              <p className="text-xs text-gray-500">{formatDate(update.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.status === 'delivered' && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-green-600 text-lg mr-2">✅</span>
                            <p className="text-green-800 font-medium">Order successfully delivered!</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Live Tracking Info */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">🎯 Live Tracking Demo</h4>
          <p className="text-sm text-yellow-700">
            This is a simulation! Orders automatically progress through statuses:
            <strong> Processing → Shipped → Delivered</strong>. Click "Simulate Update" to manually advance an order.
            Real orders would connect to actual carrier APIs like FedEx, UPS, or DHL.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Orders;