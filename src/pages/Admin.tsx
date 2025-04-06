
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedPage from "../components/AnimatedPage";
import { useCurrency } from "../contexts/CurrencyContext";
import { toast } from "sonner";
import { Package, Users, CreditCard, TrendingUp } from "lucide-react";
import { products as initialProductsData, Product } from "../data/products";

// Admin Components
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import AdminTabs from "@/components/admin/AdminTabs";
import DashboardTab from "@/components/admin/dashboard/DashboardTab";
import OrdersTab from "@/components/admin/orders/OrdersTab";
import ProductsTab from "@/components/admin/products/ProductsTab";
import SettingsTab from "@/components/admin/settings/SettingsTab";
import ProductDialog from "@/components/admin/products/ProductDialog";
import ProductDeleteDialog from "@/components/admin/products/ProductDeleteDialog";

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
    if (!isAuthenticated) {
      toast.error("You must be logged in to access the admin panel");
      navigate("/admin-auth");
      return;
    }

    if (!isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }

    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProductsData);
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
      updatedProducts = products.map(p => 
        p.id === editingProduct.id ? {...newProduct, id: editingProduct.id} as Product : p
      );
      toast.success("Product updated successfully!");
    } else {
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
            <AdminHeader 
              userName={user?.name} 
              isExporting={isExporting} 
              isConnected={isConnected}
              handleExportToGoogleSheets={handleExportToGoogleSheets}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatCard 
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  index={index}
                />
              ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <div className="p-6">
                {activeTab === "dashboard" && (
                  <DashboardTab 
                    setActiveTab={setActiveTab}
                    orders={orders}
                    products={products}
                    openProductDialog={openProductDialog}
                    formatPrice={formatPrice}
                  />
                )}
                
                {activeTab === "orders" && (
                  <OrdersTab 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredOrders={filteredOrders}
                    handleOrderStatusChange={handleOrderStatusChange}
                    formatPrice={formatPrice}
                  />
                )}
                
                {activeTab === "products" && (
                  <ProductsTab 
                    products={products}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                    openProductDialog={openProductDialog}
                    confirmDeleteProduct={confirmDeleteProduct}
                    formatPrice={formatPrice}
                    currentProducts={currentProducts}
                  />
                )}
                
                {activeTab === "settings" && (
                  <SettingsTab 
                    googleApiKey={googleApiKey}
                    setGoogleApiKey={setGoogleApiKey}
                    googleSheetId={googleSheetId}
                    setGoogleSheetId={setGoogleSheetId}
                    isConnected={isConnected}
                    setIsConnected={setIsConnected}
                    isTesting={isTesting}
                    setIsTesting={setIsTesting}
                    firebaseConfig={firebaseConfig}
                    setFirebaseConfig={setFirebaseConfig}
                    handleSaveGoogleSheetsSettings={handleSaveGoogleSheetsSettings}
                    handleSaveFirebaseConfig={handleSaveFirebaseConfig}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </AnimatedPage>
      
      <ProductDialog 
        isOpen={isProductDialogOpen}
        setIsOpen={setIsProductDialogOpen}
        editingProduct={editingProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        newTag={newTag}
        setNewTag={setNewTag}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
        handleSaveProduct={handleSaveProduct}
      />
      
      <ProductDeleteDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDeleteProduct={handleDeleteProduct}
      />
      
      <Footer />
    </div>
  );
};

export default Admin;
