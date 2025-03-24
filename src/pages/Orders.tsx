
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Mock order data
const mockOrders = [
  {
    id: "ORD-12345",
    date: "2023-10-15",
    status: "Delivered",
    total: 2549.00,
    items: [
      { id: 1, name: "Alphonso Mango (1kg)", price: 849.00, quantity: 2 },
      { id: 2, name: "Fresh Apples (1kg)", price: 299.00, quantity: 1 },
      { id: 3, name: "Mixed Vegetables Pack", price: 552.00, quantity: 1 }
    ],
    paymentMethod: "UPI",
    deliveryAddress: "123 Main St, Mumbai, Maharashtra, 400001"
  },
  {
    id: "ORD-12346",
    date: "2023-10-05",
    status: "Delivered",
    total: 1299.00,
    items: [
      { id: 1, name: "Kesar Mango (1kg)", price: 649.00, quantity: 2 }
    ],
    paymentMethod: "Credit Card",
    deliveryAddress: "123 Main St, Mumbai, Maharashtra, 400001"
  },
  {
    id: "ORD-12347",
    date: "2023-10-25",
    status: "Processing",
    total: 3689.00,
    items: [
      { id: 1, name: "Organic Bananas (1kg)", price: 199.00, quantity: 1 },
      { id: 2, name: "Premium Mango Gift Box", price: 2499.00, quantity: 1 },
      { id: 3, name: "Fresh Coconut Water (Pack of 3)", price: 299.00, quantity: 1 },
      { id: 4, name: "Organic Vegetables Box", price: 692.00, quantity: 1 }
    ],
    paymentMethod: "Net Banking",
    deliveryAddress: "123 Main St, Mumbai, Maharashtra, 400001"
  },
  {
    id: "ORD-12348",
    date: "2023-09-15",
    status: "Cancelled",
    total: 1249.00,
    items: [
      { id: 1, name: "Assorted Fruit Basket", price: 1249.00, quantity: 1 }
    ],
    paymentMethod: "Google Pay",
    deliveryAddress: "123 Main St, Mumbai, Maharashtra, 400001"
  }
];

type Order = typeof mockOrders[0];

const Orders = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    // Simulate API call to fetch orders
    const fetchOrders = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setOrders(mockOrders);
    };
    
    fetchOrders();
  }, []);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth?redirect=orders");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "Processing":
        return <Clock size={16} className="text-amber-500" />;
      case "Shipped":
        return <Truck size={16} className="text-blue-500" />;
      case "Cancelled":
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-100";
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };
  
  const filteredOrders = orders.filter(order => {
    return (
      (statusFilter === "all" || order.status === statusFilter) &&
      (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-muted/10">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your past and current orders
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders by ID or product name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div 
                    className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <div className="flex items-center">
                        <Package size={18} className="text-primary mr-2" />
                        <span className="font-medium">{order.id}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-2 sm:mt-0">
                      <div className="mr-4 font-medium">₹{order.total.toFixed(2)}</div>
                      {expandedOrderId === order.id ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </div>
                  </div>
                  
                  {/* Order Details */}
                  {expandedOrderId === order.id && (
                    <div className="p-4 bg-muted/5">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">ORDER DETAILS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm mb-1"><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                            <p className="text-sm"><span className="font-medium">Delivery Address:</span></p>
                            <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                          </div>
                          <div className="flex flex-col md:items-end">
                            <Button variant="outline" size="sm" className="flex items-center mt-2 md:mt-0">
                              <FileText size={16} className="mr-1" />
                              Invoice
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">ITEMS</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              <th className="py-2">Item</th>
                              <th className="py-2 text-right">Price</th>
                              <th className="py-2 text-right">Quantity</th>
                              <th className="py-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                              <tr key={item.id}>
                                <td className="py-3">{item.name}</td>
                                <td className="py-3 text-right">₹{item.price.toFixed(2)}</td>
                                <td className="py-3 text-right">{item.quantity}</td>
                                <td className="py-3 text-right font-medium">₹{(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="border-t">
                            <tr>
                              <td colSpan={3} className="py-3 text-right font-medium">Order Total:</td>
                              <td className="py-3 text-right font-medium">₹{order.total.toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      
                      {order.status === "Delivered" && (
                        <div className="mt-4 flex justify-end">
                          <Button variant="default" size="sm">
                            <Eye size={16} className="mr-1" />
                            Write a Review
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <Package size={64} className="text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "Try changing your search or filter criteria"
                  : "You haven't placed any orders yet"}
              </p>
              <Link to="/shop">
                <Button>Browse Products</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Orders;
