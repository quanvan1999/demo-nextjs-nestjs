'use client';

import { Button } from '@/components/ui/button';
import { ProductCard, Product } from '@/components/products/product-card';

const products: Product[] = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 299.99,
    stock: 45,
    category: 'Electronics',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 49.99,
    stock: 120,
    category: 'Accessories',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    price: 129.99,
    stock: 30,
    category: 'Accessories',
    image: 'https://via.placeholder.com/150',
  },
];

export const ProductsUI = () => {
  const handleEdit = (product: Product) => {
    console.log('Edit product:', product);
  };

  const handleDelete = (product: Product) => {
    console.log('Delete product:', product);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>Add Product</Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};
