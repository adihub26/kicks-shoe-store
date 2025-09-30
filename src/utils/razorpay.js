export const loadRazorpay = () => {
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

// Test/Dummy Razorpay Keys
export const RAZORPAY_CONFIG = {
  key: 'rzp_test_YourTestKeyHere', // You'll get this from Razorpay dashboard
  currency: 'INR',
  name: 'KICKS Shoe Store',
  description: 'Premium Footwear',
};