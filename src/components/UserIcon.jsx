import React, { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useNavigate, Link } from 'react-router-dom'

const UserIcon = () => {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // ✅ Load user from localStorage immediately
    const loadUserFromStorage = () => {
      const userData = localStorage.getItem('kicksUser')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }

    loadUserFromStorage()

    // ✅ Listen for storage changes (when login happens)
    const handleStorageChange = (e) => {
      if (e.key === 'kicksUser') {
        const userData = e.newValue ? JSON.parse(e.newValue) : null
        setUser(userData)
      }
    }

    // ✅ Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Check if we have user data in localStorage
        const storedUser = localStorage.getItem('kicksUser')
        if (!storedUser) {
          // Create user data if not exists
          const userData = {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            uid: firebaseUser.uid
          }
          localStorage.setItem('kicksUser', JSON.stringify(userData))
          setUser(userData)
        }
      } else {
        // User signed out
        localStorage.removeItem('kicksUser')
        setUser(null)
      }
    })

    // Add event listeners
    window.addEventListener('storage', handleStorageChange)

    return () => {
      unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('kicksUser')
      setUser(null)
      setShowDropdown(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!user) {
    return (
      <Link 
        to="/login" 
        className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md text-sm transition-colors"
      >
        Sign In
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
      >
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.name} 
            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className={`w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm ${user.photoURL ? 'hidden' : 'flex'}`}>
          {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden md:inline text-sm font-medium max-w-24 truncate">
          {user.name || user.email?.split('@')[0] || 'User'}
        </span>
        <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || 'Welcome!'}
              </p>
              <p className="text-xs text-gray-500 truncate mt-1">
                {user.email}
              </p>
            </div>
            
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </Link>
            
            <Link
              to="/orders"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              My Orders
            </Link>
            
            <div className="border-t border-gray-100 my-1" />
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default UserIcon