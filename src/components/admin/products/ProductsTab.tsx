
import { FilePlus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";

interface ProductsTabProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
  openProductDialog: (product?: Product) => void;
  confirmDeleteProduct: (productId: number) => void;
  formatPrice: (price: number) => string;
  currentProducts: Product[];
}

const ProductsTab = ({ 
  products,
  currentPage,
  totalPages,
  paginate,
  openProductDialog,
  confirmDeleteProduct,
  formatPrice,
  currentProducts
}: ProductsTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Products</h2>
        <Button 
          className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center gap-2"
          onClick={() => openProductDialog()}
        >
          <FilePlus size={16} />
          Add Product
        </Button>
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
  );
};

export default ProductsTab;
