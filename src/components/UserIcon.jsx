import React, { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useNavigate, Link } from 'react-router-dom'

const UserIcon = () => {
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for user in localStorage
    const userData = localStorage.getItem('kicksUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData = localStorage.getItem('kicksUser')
        if (userData) {
          setUser(JSON.parse(userData))
        } else {
          // Create basic user data if not exists
          const basicUserData = {
            name: firebaseUser.displayName || firebaseUser.email,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            uid: firebaseUser.uid
          }
          localStorage.setItem('kicksUser', JSON.stringify(basicUserData))
          setUser(basicUserData)
        }
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
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
      <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
        Sign In
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.name} 
            className="w-8 h-8 rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden md:inline text-sm font-medium">{user.name || user.email.split('@')[0]}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setShowDropdown(false)}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserIcon