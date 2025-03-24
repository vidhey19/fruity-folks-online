export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  image: string;
  description: string;
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  stock: number;
  weight: string;
  origin: string;
};

export type SearchResult = Pick<Product, 'id' | 'name' | 'price' | 'salePrice' | 'image' | 'category'>;

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Alphonso Mangoes",
    category: "mangoes",
    price: 1499,
    salePrice: 1299,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Indulge in the exquisite taste of premium Alphonso mangoes, known as the 'King of Mangoes'. These golden-yellow fruits offer a rich, creamy texture with a sweet, aromatic flavor that's simply unmatched. Each mango is carefully hand-picked at peak ripeness to ensure the perfect balance of sweetness and tanginess.",
    tags: ["seasonal", "premium", "gift"],
    featured: true,
    bestSeller: true,
    stock: 50,
    weight: "2kg box (5-6 mangoes)",
    origin: "Maharashtra, India"
  },
  {
    id: 2,
    name: "Organic Kesar Mangoes",
    category: "mangoes",
    price: 1299,
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Experience the distinct taste of Kesar mangoes, grown organically with sustainable farming practices. These saffron-hued delights are known for their sweet, aromatic flavor and fiber-free pulp. Perfect for smoothies, desserts, or enjoying fresh.",
    tags: ["organic", "seasonal"],
    featured: true,
    bestSeller: false,
    stock: 35,
    weight: "2kg box (6-7 mangoes)",
    origin: "Gujarat, India"
  },
  {
    id: 3,
    name: "Honey Ataulfo Mangoes",
    category: "mangoes",
    price: 999,
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Ataulfo mangoes, also known as honey mangoes, are a sweet and creamy variety with a buttery, non-fibrous texture. Their vibrant yellow flesh is perfect for both eating fresh and using in recipes.",
    tags: ["imported", "premium"],
    featured: false,
    bestSeller: true,
    stock: 40,
    weight: "2kg box (8-10 mangoes)",
    origin: "Mexico"
  },
  {
    id: 4,
    name: "Tommy Atkins Mangoes",
    category: "mangoes",
    price: 899,
    image: "https://images.unsplash.com/photo-1519096845289-95806ee03a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Tommy Atkins mangoes are the most widely grown commercial variety. They have a mild, sweet flavor with a firm, fibrous flesh. Their durability makes them perfect for mango salads and salsas.",
    tags: ["popular", "recipe"],
    featured: false,
    bestSeller: false,
    stock: 60,
    weight: "2kg box (4-5 mangoes)",
    origin: "Brazil"
  },
  {
    id: 5,
    name: "Green Apple",
    category: "fruits",
    price: 399,
    image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Crisp and tart green apples, perfect for snacking or baking. These Granny Smith apples have a bright, acidic flavor that balances sweetness in recipes.",
    tags: ["fresh", "daily"],
    featured: false,
    bestSeller: false,
    stock: 100,
    weight: "1kg (4-5 apples)",
    origin: "Himachal Pradesh, India"
  },
  {
    id: 6,
    name: "Organic Bananas",
    category: "fruits",
    price: 149,
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Naturally sweet and perfectly ripe organic bananas. A convenient and nutritious snack packed with potassium and fiber.",
    tags: ["organic", "daily"],
    featured: false,
    bestSeller: true,
    stock: 150,
    weight: "1kg (5-6 bananas)",
    origin: "Kerala, India"
  },
  {
    id: 7,
    name: "Fresh Strawberries",
    category: "fruits",
    price: 399,
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Juicy, sweet strawberries picked at the peak of ripeness. Perfect for desserts, smoothies, or enjoying fresh.",
    tags: ["seasonal", "berry"],
    featured: true,
    bestSeller: false,
    stock: 40,
    weight: "500g",
    origin: "Mahabaleshwar, India"
  },
  {
    id: 8,
    name: "Organic Avocados",
    category: "fruits",
    price: 599,
    image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Creamy, organic Hass avocados. Rich in healthy fats and perfect for guacamole, salads, or spreading on toast.",
    tags: ["organic", "superfood"],
    featured: false,
    bestSeller: true,
    stock: 45,
    weight: "1kg (4-5 avocados)",
    origin: "Karnataka, India"
  },
  {
    id: 9,
    name: "Fresh Carrots",
    category: "vegetables",
    price: 99,
    image: "https://images.unsplash.com/photo-1598170845058-25772afcbdac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Crunchy, sweet carrots perfect for snacking, cooking, or juicing. Packed with beta-carotene and other nutrients.",
    tags: ["fresh", "daily"],
    featured: false,
    bestSeller: false,
    stock: 80,
    weight: "1kg",
    origin: "Local Farm, India"
  },
  {
    id: 10,
    name: "Organic Spinach",
    category: "vegetables",
    price: 129,
    image: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Fresh, organic baby spinach leaves. Versatile and nutritious, perfect for salads, smoothies, or cooking.",
    tags: ["organic", "leafy"],
    featured: false,
    bestSeller: false,
    stock: 50,
    weight: "250g",
    origin: "Local Farm, India"
  },
  {
    id: 11,
    name: "Bell Peppers Mix",
    category: "vegetables",
    price: 199,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Colorful mix of red, yellow, and green bell peppers. Sweet and crunchy, perfect for salads, stir-fries, or grilling.",
    tags: ["fresh", "colorful"],
    featured: false,
    bestSeller: false,
    stock: 60,
    weight: "750g (3 peppers)",
    origin: "Local Farm, India"
  },
  {
    id: 12,
    name: "Cherry Tomatoes",
    category: "vegetables",
    price: 159,
    image: "https://images.unsplash.com/photo-1562093772-c66f2afd1d50?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Sweet and juicy cherry tomatoes. Perfect for salads, snacking, or quick pasta dishes.",
    tags: ["fresh", "daily"],
    featured: false,
    bestSeller: false,
    stock: 70,
    weight: "500g",
    origin: "Local Farm, India"
  }
];

export const categories = [
  { id: "all", name: "All Products" },
  { id: "mangoes", name: "Mangoes" },
  { id: "fruits", name: "Other Fruits" },
  { id: "vegetables", name: "Vegetables" }
];

export const getProductsByCategory = (categoryId: string) => {
  if (categoryId === "all") return products;
  return products.filter(product => product.category === categoryId);
};

export const getFeaturedProducts = () => {
  return products.filter(product => product.featured);
};

export const getBestSellerProducts = () => {
  return products.filter(product => product.bestSeller);
};

export const getRelatedProducts = (productId: number) => {
  const currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return [];
  
  return products
    .filter(p => p.id !== productId && p.category === currentProduct.category)
    .slice(0, 4);
};

export const searchProducts = (query: string): SearchResult[] => {
  const searchTerm = query.toLowerCase();
  
  return products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
    .map(({ id, name, price, salePrice, image, category }) => ({
      id, name, price, salePrice, image, category
    }));
};
