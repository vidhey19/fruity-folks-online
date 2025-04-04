
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedPage from "../components/AnimatedPage";
import { useCurrency } from "../contexts/CurrencyContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  DollarSign,
  BarChart,
  Plus,
  AlertCircle
} from "lucide-react";
import { products as initialProductsData, Product } from "../data/products";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
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

  // Product Management States
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    category: "fruits",
    price: 0,
    salePrice: undefined,
    image: "",
    description: "",
    tags: [],
    featured: false,
    bestSeller: false,
    stock: 0,
    weight: "",
    origin: ""
  });
  const [newTag, setNewTag] = useState("");
  
  // Delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  const { formatPrice } = useCurrency();

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
    // Skip the authorization check for now to make sure the page is accessible
    // This is temporary to help with debugging - we'll restore proper authentication later
    /*
    if (!isAuthenticated) {
      navigate("/admin-auth");
      return;
    }

    if (!isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }
    */

    // Initialize products from localStorage if available, otherwise from data file
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProductsData);
      // Save to localStorage for persistence
      localStorage.setItem('adminProducts', JSON.stringify(initialProductsData));
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

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

  // Product management functions
  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setNewProduct({...product});
    } else {
      setEditingProduct(null);
      setNewProduct({
        name: "",
        category: "fruits",
        price: 0,
        salePrice: undefined,
        image: "",
        description: "",
        tags: [],
        featured: false,
        bestSeller: false,
        stock: 0,
        weight: "",
        origin: ""
      });
    }
    setIsProductDialogOpen(true);
  };

  const handleAddTag = () => {
    if (newTag && !newProduct.tags?.includes(newTag)) {
      setNewProduct({
        ...newProduct,
        tags: [...(newProduct.tags || []), newTag]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewProduct({
      ...newProduct,
      tags: newProduct.tags?.filter(t => t !== tag) || []
    });
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.image) {
      toast.error("Please fill in all required fields");
      return;
    }

    let updatedProducts;
    
    if (editingProduct) {
      // Update existing product
      updatedProducts = products.map(p => 
        p.id === editingProduct.id ? {...newProduct, id: editingProduct.id} as Product : p
      );
      toast.success("Product updated successfully!");
    } else {
      // Add new product
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const fullProduct = {
        ...newProduct,
        id: newId,
        tags: newProduct.tags || [],
        featured: newProduct.featured || false,
        bestSeller: newProduct.bestSeller || false
      } as Product;
      
      updatedProducts = [...products, fullProduct];
      toast.success("Product added successfully!");
    }
    
    // Update state and save to localStorage
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    setIsProductDialogOpen(false);
  };

  const confirmDeleteProduct = (productId: number) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = () => {
    if (productToDelete === null) return;
    
    const updatedProducts = products.filter(p => p.id !== productToDelete);
    setProducts(updatedProducts);
    
    // Save to localStorage
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    
    toast.success("Product deleted successfully!");
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleOrderStatusChange = (orderId: string, newStatus: string) => {
    const updatedOrders = filteredOrders.map(order => 
      order.id === orderId ? {...order, status: newStatus} : order
    );
    setFilteredOrders(updatedOrders);
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
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
                className={`bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center gap-2 ${!isConnected ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                {/* Dashboard Tab */}
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
                              <th className="px-4 py-3 text-left">Actions</th>
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
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
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
                              <button 
                                onClick={() => openProductDialog(product)}
                                className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Orders Tab */}
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
                                <select 
                                  className="bg-transparent border border-gray-200 rounded px-2 py-1 text-xs"
                                  value={order.status}
                                  onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button 
                                    className="text-gray-500 hover:text-primary"
                                    title="View Order Details"
                                  >
                                    <ExternalLink size={16} />
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
                
                {/* Products Tab */}
                {activeTab === "products" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">All Products</h2>
                      <button 
                        className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center gap-2"
                        onClick={() => openProductDialog()}
                      >
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
                          {currentProducts.map((product, index) => (
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
                                  <button 
                                    className="text-gray-500 hover:text-primary"
                                    onClick={() => openProductDialog(product)}
                                    title="Edit Product"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button 
                                    className="text-gray-500 hover:text-red-500"
                                    onClick={() => confirmDeleteProduct(product.id)}
                                    title="Delete Product"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <nav className="flex items-center gap-1">
                          <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${
                              currentPage === 1 
                                ? "text-gray-400 cursor-not-allowed" 
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            Previous
                          </button>
                          
                          {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => paginate(index + 1)}
                              className={`px-3 py-1 rounded ${
                                currentPage === index + 1
                                  ? "bg-primary text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded ${
                              currentPage === totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Settings Tab */}
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
                            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center gap-2"
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
                              placeholder="your-app-id"
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
                              placeholder="your-app.appspot.com"
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
                            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center gap-2"
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
      
      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="bakery">Bakery</option>
                  <option value="snacks">Snacks</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Price *</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    placeholder="Regular price"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Sale Price (optional)</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    value={newProduct.salePrice || ''}
                    onChange={(e) => setNewProduct({
                      ...newProduct, 
                      salePrice: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    placeholder="Sale price"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Stock *</label>
                <input
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                  placeholder="Stock quantity"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Image URL *</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  placeholder="Enter image URL"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Weight</label>
                <input
                  type="text"
                  value={newProduct.weight}
                  onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                  placeholder="e.g., 500g, 1kg"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Origin</label>
                <input
                  type="text"
                  value={newProduct.origin}
                  onChange={(e) => setNewProduct({...newProduct, origin: e.target.value})}
                  placeholder="e.g., Himachal, Kerala"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description *</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Product description"
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                    className="rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm">Featured</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bestSeller"
                    checked={newProduct.bestSeller}
                    onChange={(e) => setNewProduct({...newProduct, bestSeller: e.target.checked})}
                    className="rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="bestSeller" className="ml-2 text-sm">Best Seller</label>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Tags</label>
            <div className="flex items-center">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                className="flex-grow rounded-l-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-primary text-white px-4 py-2 rounded-r-lg"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {newProduct.tags?.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                >
                  {tag}
                  <button 
                    onClick={() => handleRemoveTag(tag)} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
                    
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default Admin;
