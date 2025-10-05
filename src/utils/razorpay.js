export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('✅ Razorpay SDK loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// ✅ UPDATED: Use this working test key
export const RAZORPAY_CONFIG = {
  key: 'rzp_test_RNZkQbVXzrFcEy', // Known working test key
  currency: 'INR',
  name: 'KICKS Shoe Store',
  description: 'Premium Footwear',
};