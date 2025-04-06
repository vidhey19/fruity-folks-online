
import { Plus, X } from "lucide-react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";

interface ProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingProduct: Product | null;
  newProduct: Partial<Product>;
  setNewProduct: (product: Partial<Product>) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  handleSaveProduct: () => void;
}

const ProductDialog = ({
  isOpen,
  setIsOpen,
  editingProduct,
  newProduct,
  setNewProduct,
  newTag,
  setNewTag,
  handleAddTag,
  handleRemoveTag,
  handleSaveProduct
}: ProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveProduct}>
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
