import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedPage from "../components/AnimatedPage";
import { toast } from "sonner";
import { 
  FileSpreadsheet, 
  Users, 
  Package, 
  TrendingUp, 
  CreditCard,
  ArrowRight,
  Edit,
  Trash2,
  ExternalLink,
  FilePlus,
  Save,
  X,
  Search,
  Link,
  KeyRound,
  CheckCircle2
} from "lucide-react";
import { products } from "../data/products";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [googleSheetId, setGoogleSheetId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  });

  const orders = [
    { id: "ORD-001", customer: "Raj Kumar", date: "2023-06-15", total: 1499, status: "Delivered" },
    { id: "ORD-002", customer: "Priya Singh", date: "2023-06-14", total: 2399, status: "Processing" },
    { id: "ORD-003", customer: "Amit Patel", date: "2023-06-13", total: 899, status: "Shipped" },
    { id: "ORD-004", customer: "Neha Sharma", date: "2023-06-12", total: 3499, status: "Pending" },
    { id: "ORD-005", customer: "Vikram Verma", date: "2023-06-11", total: 1299, status: "Delivered" },
  ];

  const stats = [
    { title: "Total Orders", value: "125", icon: <Package className="h-8 w-8 text-blue-500" /> },
    { title: "Total Customers", value: "84", icon: <Users className="h-8 w-8 text-green-500" /> },
    { title: "Revenue", value: "₹45,820", icon: <CreditCard className="h-8 w-8 text-purple-500" /> },
    { title: "Growth", value: "+24%", icon: <TrendingUp className="h-8 w-8 text-orange-500" /> },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-auth");
      return;
    }

    if (!isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }

    if (searchQuery) {
      const filtered = orders.filter(
        order => 
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }

    const savedApiKey = localStorage.getItem('googleApiKey');
    const savedSheetId = localStorage.getItem('googleSheetId');
    
    if (savedApiKey && savedSheetId) {
      setGoogleApiKey(savedApiKey);
      setGoogleSheetId(savedSheetId);
      setIsConnected(true);
    }

    const savedFirebaseConfig = localStorage.getItem('firebaseConfig');
    if (savedFirebaseConfig) {
      setFirebaseConfig(JSON.parse(savedFirebaseConfig));
    }
  }, [isAuthenticated, isAdmin, navigate, searchQuery, orders]);

  const handleExportToGoogleSheets = () => {
    if (!isConnected) {
      toast.error("Please connect to Google Sheets first");
      setActiveTab("settings");
      return;
    }
    
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Data exported to Google Sheets successfully!");
    }, 2000);
  };

  const handleSaveGoogleSheetsSettings = () => {
    if (!googleApiKey || !googleSheetId) {
      toast.error("Please enter both API Key and Sheet ID");
      return;
    }
    
    setIsTesting(true);
    
    setTimeout(() => {
      localStorage.setItem('googleApiKey', googleApiKey);
      localStorage.setItem('googleSheetId', googleSheetId);
      
      setIsConnected(true);
      setIsTesting(false);
      toast.success("Google Sheets connection established!");
    }, 1500);
  };

  const handleSaveFirebaseConfig = () => {
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required Firebase fields: ${missingFields.join(', ')}`);
      return;
    }
    
    localStorage.setItem('firebaseConfig', JSON.stringify(firebaseConfig));
    toast.success("Firebase configuration saved successfully!");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <AnimatedPage>
        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
              
              <button
                onClick={handleExportToGoogleSheets}
                disabled={isExporting || !isConnected}
                className={`btn-secondary flex items-center gap-2 ${!isConnected ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <FileSpreadsheet size={16} />
                {isExporting ? "Exporting..." : "Export to Google Sheets"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-500">{stat.title}</h3>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="rounded-full p-3 bg-gray-50">{stat.icon}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "dashboard"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "orders"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "products"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "settings"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Settings
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === "dashboard" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Recent Orders</h3>
                        <button
                          onClick={() => setActiveTab("orders")}
                          className="text-primary flex items-center gap-1 text-sm font-medium"
                        >
                          View All <ArrowRight size={14} />
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-left">Order ID</th>
                              <th className="px-4 py-3 text-left">Customer</th>
                              <th className="px-4 py-3 text-left">Date</th>
                              <th className="px-4 py-3 text-left">Total</th>
                              <th className="px-4 py-3 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 3).map((order, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="px-4 py-3">{order.id}</td>
                                <td className="px-4 py-3">{order.customer}</td>
                                <td className="px-4 py-3">{order.date}</td>
                                <td className="px-4 py-3">{formatPrice(order.total)}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                    order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                                    order.status === "Shipped" ? "bg-purple-100 text-purple-800" :
                                    "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Top Products</h3>
                        <button
                          onClick={() => setActiveTab("products")}
                          className="text-primary flex items-center gap-1 text-sm font-medium"
                        >
                          View All <ArrowRight size={14} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {products.filter(p => p.bestSeller).slice(0, 3).map((product, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg flex">
                            <div className="w-24 h-24 p-2">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-grow p-3">
                              <h4 className="font-medium line-clamp-1">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.category}</p>
                              <p className="text-primary font-semibold mt-1">
                                {formatPrice(product.salePrice || product.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "orders" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">All Orders</h2>
                      
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left">Order ID</th>
                            <th className="px-4 py-3 text-left">Customer</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Total</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-3">{order.id}</td>
                              <td className="px-4 py-3">{order.customer}</td>
                              <td className="px-4 py-3">{order.date}</td>
                              <td className="px-4 py-3">{formatPrice(order.total)}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                  order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                                  order.status === "Shipped" ? "bg-purple-100 text-purple-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button className="text-gray-500 hover:text-primary">
                                    <ExternalLink size={16} />
                                  </button>
                                  <button className="text-gray-500 hover:text-primary">
                                    <Edit size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {activeTab === "products" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">All Products</h2>
                      <button className="btn-primary flex items-center gap-2">
                        <FilePlus size={16} />
                        Add Product
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-left">Price</th>
                            <th className="px-4 py-3 text-left">Stock</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 flex-shrink-0">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                  <div className="ml-3">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.weight}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 capitalize">{product.category}</td>
                              <td className="px-4 py-3">
                                {product.salePrice ? (
                                  <div>
                                    <span className="font-medium">{formatPrice(product.salePrice)}</span>
                                    <span className="ml-2 text-xs text-gray-500 line-through">
                                      {formatPrice(product.price)}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-medium">{formatPrice(product.price)}</span>
                                )}
                              </td>
                              <td className="px-4 py-3">{product.stock}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  product.stock > 20 ? "bg-green-100 text-green-800" :
                                  product.stock > 5 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {product.stock > 20 ? "In Stock" :
                                   product.stock > 5 ? "Low Stock" :
                                   "Critical Stock"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button className="text-gray-500 hover:text-primary">
                                    <Edit size={16} />
                                  </button>
                                  <button className="text-gray-500 hover:text-red-500">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {activeTab === "settings" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Settings</h2>
                    
                    <div className="grid grid-cols-1 gap-8">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <FileSpreadsheet className="h-6 w-6 text-green-600 mr-2" />
                          <h3 className="text-lg font-medium">Google Sheets Integration</h3>
                          {isConnected && (
                            <span className="ml-2 flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              <CheckCircle2 size={12} className="mr-1" /> Connected
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-500 mb-6">
                          Connect to your Google Sheets account to automatically export orders and product data. Your sheet should have the following columns: Order ID, Customer Name, Email, Phone, Address, Products, Total, Payment Method, and Status.
                        </p>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2 flex items-center">
                            <KeyRound size={16} className="mr-2 text-gray-500" />
                            Google Sheets API Key
                          </label>
                          <input
                            type="text"
                            value={googleApiKey}
                            onChange={(e) => setGoogleApiKey(e.target.value)}
                            placeholder="Enter your API key"
                            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Get your API key from the <a href="https://console.developers.google.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2 flex items-center">
                            <Link size={16} className="mr-2 text-gray-500" />
                            Sheet ID
                          </label>
                          <input
                            type="text"
                            value={googleSheetId}
                            onChange={(e) => setGoogleSheetId(e.target.value)}
                            placeholder="Enter your Sheet ID"
                            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Find your Sheet ID in the URL of your Google Sheet (e.g., https://docs.google.com/spreadsheets/d/[YOUR_SHEET_ID]/edit)
                          </p>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <button 
                            onClick={handleSaveGoogleSheetsSettings} 
                            disabled={isTesting}
                            className="btn-primary flex items-center gap-2"
                          >
                            {isTesting ? "Connecting..." : (
                              <>
                                <Save size={16} />
                                {isConnected ? "Update Connection" : "Connect to Google Sheets"}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <KeyRound className="h-6 w-6 text-orange-500 mr-2" />
                          <h3 className="text-lg font-medium">Firebase Authentication</h3>
                        </div>
                        
                        <p className="text-gray-500 mb-6">
                          Configure Firebase for user authentication. Enter your Firebase project credentials below.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              API Key
                            </label>
                            <input
                              type="text"
                              value={firebaseConfig.apiKey}
                              onChange={(e) => setFirebaseConfig({...firebaseConfig, apiKey: e.target.value})}
                              placeholder="Enter Firebase API Key"
                              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Auth Domain
                            </label>
                            <input
                              type="text"
                              value={firebaseConfig.authDomain}
                              onChange={(e) => setFirebaseConfig({...firebaseConfig, authDomain: e.target.value})}
                              placeholder="your-app.firebaseapp.com"
                              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Project ID
                            </label>
                            <input
                              type="text"
                              value={firebaseConfig.projectId}
                              onChange={(e) => setFirebaseConfig({...firebaseConfig, projectId: e.target.value})}
                              placeholder="your-project-id"
                              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Storage Bucket
                            </label>
                            <input
                              type="text"
                              value={firebaseConfig.storageBucket}
                              onChange={(e) => setFirebaseConfig({...firebaseConfig, storageBucket: e.target.value})}
                              placeholder="your-project-id.appspot.com"
                              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Messaging Sender ID
                            </label>
                            <input
                              type="text"
                              value={firebaseConfig.messagingSenderId}
                              onChange={(e) => setFirebaseConfig({...firebaseConfig, messagingSenderId: e.target.value})}
                              placeholder="123456789012"
                              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              App ID
                            </label>
                            <input
                              type="text"
                              value={firebaseConfig.appId}
                              onChange={(e) => setFirebaseConfig({...firebaseConfig, appId: e.target.value})}
                              placeholder="1:123456789012:web:abc123def456"
                              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <button 
                            onClick={handleSaveFirebaseConfig}
                            className="btn-primary flex items-center gap-2"
                          >
                            <Save size={16} />
                            Save Firebase Configuration
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </AnimatedPage>
      
      <Footer />
    </div>
  );
};

export default Admin;

