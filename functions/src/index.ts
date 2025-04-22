
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

admin.initializeApp();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string
});

// Health check endpoint
export const health = functions.https.onRequest((req, res) => {
  res.status(200).send('OK');
});

// Create Razorpay order
export const createOrder = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { amount, currency = 'INR', receipt, notes } = data;

  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes
    };

    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error creating Razorpay order',
      error
    );
  }
});

// Verify Razorpay payment
export const verifyPayment = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = data;

  // Verify signature
  const text = razorpay_order_id + '|' + razorpay_payment_id;
  const signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
    .update(text)
    .digest('hex');

  const isAuthentic = signature === razorpay_signature;

  if (!isAuthentic) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Payment verification failed'
    );
  }

  try {
    // Get user details
    const user = await admin.auth().getUser(context.auth.uid);
    
    // Save order to Firestore
    const db = admin.firestore();
    const orderData = {
      ...orderDetails,
      userId: context.auth.uid,
      userName: user.displayName || '',
      userEmail: user.email || '',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'processing',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const orderRef = await db.collection('orders').add(orderData);
    
    return { 
      success: true, 
      message: 'Payment verified successfully',
      orderId: orderRef.id
    };
  } catch (error) {
    console.error('Error saving order:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error saving order',
      error
    );
  }
});
