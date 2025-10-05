// services/newsletterService.js
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

export const subscribeToNewsletter = async (email) => {
  try {
    // Check if email already exists
    const q = query(collection(db, 'subscribers'), where('email', '==', email))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      return { success: false, error: 'Email already subscribed!' }
    }

    // Add new subscriber
    await addDoc(collection(db, 'subscribers'), {
      email: email,
      subscribedAt: serverTimestamp(),
      active: true
    })
    
    return { success: true, message: 'Successfully subscribed!' }
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return { success: false, error: 'Subscription failed. Please try again.' }
  }
}