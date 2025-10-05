import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('kicksUser') || '{}');
    if (!userData.uid) {
      navigate('/login?redirect=profile');
      return;
    }
    
    setUser(userData);
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
    });

    // Load saved addresses
    const savedAddresses = JSON.parse(localStorage.getItem('kicksUserAddresses') || '[]');
    setAddresses(savedAddresses);
  }, [navigate]);

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      ...formData
    };
    
    // Update localStorage
    localStorage.setItem('kicksUser', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('storage'));
    
    setUser(updatedUser);
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Address Management Functions
  const handleAddAddress = () => {
    if (newAddress.trim() === '') {
      alert('Please enter an address');
      return;
    }

    const updatedAddresses = [...addresses, newAddress.trim()];
    setAddresses(updatedAddresses);
    localStorage.setItem('kicksUserAddresses', JSON.stringify(updatedAddresses));
    setNewAddress('');
    alert('Address added successfully!');
  };

  const handleEditAddress = (index) => {
    setEditingAddressIndex(index);
    setNewAddress(addresses[index]);
  };

  const handleUpdateAddress = () => {
    if (newAddress.trim() === '') {
      alert('Please enter an address');
      return;
    }

    const updatedAddresses = [...addresses];
    updatedAddresses[editingAddressIndex] = newAddress.trim();
    setAddresses(updatedAddresses);
    localStorage.setItem('kicksUserAddresses', JSON.stringify(updatedAddresses));
    setNewAddress('');
    setEditingAddressIndex(null);
    alert('Address updated successfully!');
  };

  const handleDeleteAddress = (index) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(updatedAddresses);
      localStorage.setItem('kicksUserAddresses', JSON.stringify(updatedAddresses));
      alert('Address deleted successfully!');
    }
  };

  const handleSetDefaultAddress = (index) => {
    const updatedAddresses = [...addresses];
    const [defaultAddress] = updatedAddresses.splice(index, 1);
    updatedAddresses.unshift(defaultAddress);
    setAddresses(updatedAddresses);
    localStorage.setItem('kicksUserAddresses', JSON.stringify(updatedAddresses));
    alert('Default address updated!');
  };

  const cancelAddressEdit = () => {
    setEditingAddressIndex(null);
    setNewAddress('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500 text-sm">Member since {formatDate(new Date().toISOString())}</p>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
            
            {editMode ? (
              <div className="max-w-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-lg text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="mt-1 text-lg text-gray-900">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Management */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Addresses</h2>
            
            {/* Add/Edit Address Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter your complete address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {editingAddressIndex !== null ? (
                  <>
                    <button
                      onClick={handleUpdateAddress}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={cancelAddressEdit}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAddAddress}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Address
                  </button>
                )}
              </div>
            </div>

            {/* Address List */}
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                  <p className="text-gray-500">Add your first address above to enable checkout</p>
                </div>
              ) : (
                addresses.map((address, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {index === 0 && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                            Default Address
                          </span>
                        )}
                        <p className="text-gray-900">{address}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {index !== 0 && (
                          <button
                            onClick={() => handleSetDefaultAddress(index)}
                            className="text-green-600 hover:text-green-800 text-sm"
                            title="Set as default"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEditAddress(index)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          title="Edit address"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          title="Delete address"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;