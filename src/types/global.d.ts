
// Define interfaces for global objects

// For Google Analytics
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  Razorpay: any;
}

// Update the User type to include our custom fields
declare module 'firebase/auth' {
  interface User {
    isAdmin?: boolean;
    name?: string;
    uid: string;
    email?: string | null;
    displayName?: string | null;
  }
}
