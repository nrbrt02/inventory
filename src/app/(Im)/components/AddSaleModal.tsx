'use client';

import { useState } from 'react';

interface Sale {
  id: number;
  orderNumber: string;
  customerName: string;
  product: string;
  quantity: number;
  totalAmount: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  date: string;
}

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sale: Omit<Sale, 'id'>) => void;
}

export default function AddSaleModal({ isOpen, onClose, onAdd }: AddSaleModalProps) {
  const [newSale, setNewSale] = useState({
    orderNumber: '',
    customerName: '',
    product: '',
    quantity: 0,
    totalAmount: 0,
    status: 'Pending' as Sale['status'],
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newSale);
    setNewSale({
      orderNumber: '',
      customerName: '',
      product: '',
      quantity: 0,
      totalAmount: 0,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-green-500  px-50 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">New Sale</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order and Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order Number</label>
              <input
                type="text"
                placeholder="Enter order number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                value={newSale.orderNumber}
                onChange={(e) => setNewSale({ ...newSale, orderNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                placeholder="Enter customer name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                value={newSale.customerName}
                onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Product and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                value={newSale.product}
                onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                value={newSale.quantity || ''}
                onChange={(e) => setNewSale({ ...newSale, quantity: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Total Amount and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 hover:bg-white"
                  value={newSale.totalAmount || ''}
                  onChange={(e) => setNewSale({ ...newSale, totalAmount: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 hover:bg-white"
                value={newSale.status}
                onChange={(e) => setNewSale({ ...newSale, status: e.target.value as Sale['status'] })}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-green-500 text-white rounded-lg  hover:bg-green-600 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}