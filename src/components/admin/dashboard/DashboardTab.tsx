
import { useState } from "react";
import { ArrowRight, Edit } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Product } from "@/data/products";

interface DashboardTabProps {
  setActiveTab: (tab: string) => void;
  orders: any[];
  products: Product[];
  openProductDialog: (product?: Product) => void;
  formatPrice: (price: number) => string;
}

const DashboardTab = ({ setActiveTab, orders, products, openProductDialog, formatPrice }: DashboardTabProps) => {
  return (
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
  );
};

export default DashboardTab;
