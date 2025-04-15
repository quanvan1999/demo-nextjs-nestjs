'use client';

import { Button } from '@/components/ui/button';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 aspect-square overflow-hidden rounded-lg">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <h2 className="mb-2 text-xl font-semibold">{product.name}</h2>
      <p className="mb-2 text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{product.category}</span>
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            product.stock > 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {product.stock} in stock
        </span>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => onEdit(product)}>
          Edit
        </Button>
        <Button variant="destructive" className="flex-1" onClick={() => onDelete(product)}>
          Delete
        </Button>
      </div>
    </div>
  );
};
