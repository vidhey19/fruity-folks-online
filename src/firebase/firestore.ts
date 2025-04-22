
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';
import { Product } from '../data/products';

// Convert Firestore document to Product
const productConverter = {
  toFirestore: (product: Product): DocumentData => {
    return {
      name: product.name,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image,
      description: product.description,
      tags: product.tags,
      featured: product.featured,
      bestSeller: product.bestSeller,
      stock: product.stock,
      weight: product.weight,
      origin: product.origin,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Product => {
    const data = snapshot.data();
    return {
      id: parseInt(snapshot.id),
      name: data.name,
      category: data.category,
      price: data.price,
      salePrice: data.salePrice,
      image: data.image,
      description: data.description,
      tags: data.tags,
      featured: data.featured || false,
      bestSeller: data.bestSeller || false,
      stock: data.stock || 0,
      weight: data.weight || '',
      origin: data.origin || ''
    };
  }
};

// Products
export const getProducts = async () => {
  try {
    const productsQuery = query(
      collection(db, 'products'), 
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(productsQuery);
    return snapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProductById = async (id: number) => {
  try {
    const docRef = doc(db, 'products', id.toString());
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: parseInt(docSnap.id), ...docSnap.data() } as Product;
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { id: parseInt(docRef.id), ...product };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, product: Partial<Product>) => {
  try {
    const docRef = doc(db, 'products', id.toString());
    await updateDoc(docRef, {
      ...product,
      updatedAt: serverTimestamp()
    });
    
    return { id, ...product };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const docRef = doc(db, 'products', id.toString());
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Orders
export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  products: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  paymentId: string;
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: any;
}

export const getOrders = async () => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'), 
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

export const getOrdersByUser = async (userId: string) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  try {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { 
      status,
      updatedAt: serverTimestamp()
    });
    
    return { id, status };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Users
export const getUsers = async () => {
  try {
    const usersQuery = query(collection(db, 'users'));
    const snapshot = await getDocs(usersQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};
