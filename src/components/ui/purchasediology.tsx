// src/components/ui/purchasediology.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types"; 
import React from "react";

interface AddPurchaseDialogProps {
  onSubmit: (data: { purchaseNumber: string; supplierName: string; items: { productId: string; quantity: number; price: number }[] }) => void;
  products: Product[];
}

export function AddPurchaseDialog({ onSubmit, products }: AddPurchaseDialogProps) {
  const [purchaseNumber, setPurchaseNumber] = React.useState('');
  const [supplierName, setSupplierName] = React.useState('');
  const [items, setItems] = React.useState<{ productId: string; quantity: number; price: number }[]>([
    { productId: '', quantity: 1, price: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity' | 'price', value: string | number) => {
    const newItems = items.map((item, i) => i === index ? { ...item, [field]: value } : item);
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      purchaseNumber,
      supplierName,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });
    // Reset form after submission
    setPurchaseNumber('');
    setSupplierName('');
    setItems([{ productId: '', quantity: 1, price: 0 }]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="bg-green-500 hover:bg-green-600 text-white hover:text-white">
        <Button variant="outline">Add Purchase</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Purchase Order</DialogTitle>
          <DialogDescription>
            Fill in the details for the new purchase order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 w-full items-center justify-flex-start bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purchaseNumber" className="text-right">
              Purchase Order Number
            </Label>
            <Input
              id="purchaseNumber"
              value={purchaseNumber}
              onChange={(e) => setPurchaseNumber(e.target.value)}
              placeholder="PO-0001"
              type="text"
              className="col-span-3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplierName" className="text-right">
              Supplier Name
            </Label>
            <Input
              id="supplierName"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Supplier Name"
              type="text"
              className="col-span-3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`productId-${index}`} className="text-right">
                  Product
                </Label>
                <select
                  id={`productId-${index}`}
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  className="col-span-3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`quantity-${index}`} className="text-right">
                  Quantity
                </Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                  className="col-span-3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`price-${index}`} className="text-right">
                  Price per Unit
                </Label>
                <Input
                  id={`price-${index}`}
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                  className="col-span-3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          ))}
          <Button type="button" onClick={addItem} className="bg-blue-500 hover:bg-blue-600 text-white">
            Add Another Item
          </Button>
          <DialogFooter>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Save Purchase</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}