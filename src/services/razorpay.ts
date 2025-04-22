
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import { toast } from 'sonner';

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (amount: number, receipt: string) => {
  try {
    const createOrderFn = httpsCallable(functions, 'createOrder');
    
    const response = await createOrderFn({
      amount,
      receipt,
      notes: {
        source: 'AmritNaturals Website'
      }
    });
    
    return response.data as { success: boolean; order: any };
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to create order. Please try again.');
    throw error;
  }
};

// Open Razorpay checkout
export const openRazorpayCheckout = (options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const rzp = new (window as any).Razorpay(options);
    
    rzp.on('payment.success', (response: any) => {
      resolve(response);
    });
    
    rzp.on('payment.error', (error: any) => {
      reject(error);
    });
    
    rzp.open();
  });
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (
  paymentData: any,
  orderDetails: any
) => {
  try {
    const verifyPaymentFn = httpsCallable(functions, 'verifyPayment');
    
    const response = await verifyPaymentFn({
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      orderDetails
    });
    
    return response.data as { success: boolean; message: string; orderId: string };
  } catch (error) {
    console.error('Error verifying payment:', error);
    toast.error('Failed to verify payment. Please contact support.');
    throw error;
  }
};
