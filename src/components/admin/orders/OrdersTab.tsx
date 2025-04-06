
import { Search, ExternalLink } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface OrdersTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredOrders: any[];
  handleOrderStatusChange: (orderId: string, newStatus: string) => void;
  formatPrice: (price: number) => string;
}

const OrdersTab = ({ 
  searchQuery, 
  setSearchQuery, 
  filteredOrders,
  handleOrderStatusChange,
  formatPrice 
}: OrdersTabProps) => {
  return (
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
  );
};

export default OrdersTab;
