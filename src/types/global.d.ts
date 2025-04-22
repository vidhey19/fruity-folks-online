
// For Google Analytics
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

// For Razorpay
interface Window {
  Razorpay: any;
}
