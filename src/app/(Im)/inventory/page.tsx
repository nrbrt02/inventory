'use client';

import { useState } from 'react';

// Add this near the top of your file, after imports
const PRODUCTS = [
  { id: 1, name: 'Ordinaire' },
  { id: 2, name: 'Bran' },
  // Add more products as needed
];

// Add DateFilterType
type DateFilterType = 'all' | 'day' | 'week' | 'month' | 'custom';

// Update the InventoryItem interface to restrict category types
interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  Stocks: 'Kicukiro' | 'Kamonyi' | 'Rwamagana';  // Update this line
  createdAt: string; // Add this field
  CurrentStock:number; // Add this field
}

// Add this interface after the InventoryItem interface
interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, 'id'>) => void;
  inventory: InventoryItem[]; // Add this line
}

// Update the AddInventoryModal component
const AddInventoryModal = ({ isOpen, onClose, onAdd, inventory }: AddInventoryModalProps) => {
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    Stocks: 'Kicukiro' as InventoryItem['Stocks'],
    CurrentStock: 0,
    createdAt: new Date().toISOString().split('T')[0]
  });

  // Find existing item's current stock
  const existingItem = inventory.find(item => item.name === newItem.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate new current stock by adding quantity to existing stock
    const updatedCurrentStock = (existingItem?.CurrentStock || 0) + newItem.quantity;
    
    onAdd({
      ...newItem,
      CurrentStock: updatedCurrentStock
    });
    
    onClose();
    // Reset form
    setNewItem({
      name: '',
      quantity: 0,
      Stocks: 'Kicukiro' as InventoryItem['Stocks'],
      CurrentStock: 0,
      createdAt: new Date().toISOString().split('T')[0]
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-600/70 to-gray-900/70 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-[550px] max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-green-500 px-3 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl px-38 font-bold text-white">Add New Inventory</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Selection Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 hover:bg-white"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
              >
                <option value="">Select a product</option>
                {PRODUCTS.map(product => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Current Stock (Read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Stock</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                  value={existingItem?.CurrentStock || 0}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Stock</label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 hover:bg-white"
                  value={newItem.Stocks}
                  onChange={(e) => setNewItem({ ...newItem, Stocks: e.target.value as InventoryItem['Stocks'] })}
                  required
                >
                  <option value="Kicukiro">Kicukiro</option>
                  <option value="Kamonyi">Kamonyi</option>
                  <option value="Rwamagana">Rwamagana</option>
                </select>
              </div>
            </div>

            {/* Add Inventory Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Add Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity to add"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 hover:bg-white"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                required
                min="1"
              />
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
                className="px-6 py-2.5 bg-green-500 text-white b hover:bg-green-600 transition-all duration-200 font-medium shadow-lg shadow-green-500/30 flex items-center gap-2"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Add this new component after the AddInventoryModal component
const EditInventoryModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  item 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (item: InventoryItem) => void; 
  item: InventoryItem; 
}) => {
  const [editedItem, setEditedItem] = useState(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedItem);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-600/70 to-gray-900/70 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-[550px] max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-green-500 px-3 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl px-40 font-bold text-white">Edit Inventory</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                placeholder="Enter item name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 hover:bg-white"
                value={editedItem.name}
                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Stock</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 hover:bg-white"
                  value={editedItem.CurrentStock}
                  onChange={(e) => setEditedItem({ ...editedItem, CurrentStock: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Location</label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 hover:bg-white"
                  value={editedItem.Stocks}
                  onChange={(e) => setEditedItem({ ...editedItem, Stocks: e.target.value as InventoryItem['Stocks'] })}
                  required
                >
                  <option value="Kicukiro">Kicukiro</option>
                  <option value="Kamonyi">Kamonyi</option>
                  <option value="Rwamagana">Rwamagana</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-gray-50 hover:bg-white"
                value={editedItem.quantity}
                onChange={(e) => setEditedItem({ ...editedItem, quantity: Number(e.target.value) })}
                required
              />
            </div>

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
                className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-medium shadow-lg shadow-green-500/30"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { 
      id: 1, 
      name: 'Ordinaire', 
      quantity: 100, 
      Stocks: 'Kicukiro',
      CurrentStock: 80,
      createdAt: '2025-03-22'
    },
    { 
      id: 2, 
      name: 'Bran', 
      quantity: 50, 
      Stocks: 'Kamonyi', 
      CurrentStock: 1500,
      createdAt: '2025-03-21'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customDate, setCustomDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | InventoryItem['Stocks']>('all');

  // Add these new states after existing useState declarations
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Add date filtering function
  const getFilteredByDate = (items: InventoryItem[]) => {
    const today = new Date();
    const itemDate = (date: string) => new Date(date);

    switch (dateFilter) {
      case 'day':
        return items.filter(item => 
          itemDate(item.createdAt).toDateString() === today.toDateString()
        );
      case 'week':
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return items.filter(item => {
          const date = itemDate(item.createdAt);
          return date >= lastWeek && date <= today;
        });
      case 'month':
        return items.filter(item => {
          const date = itemDate(item.createdAt);
          return date.getMonth() === today.getMonth() && 
                 date.getFullYear() === today.getFullYear();
        });
      case 'custom':
        return items.filter(item => item.createdAt === customDate);
      default:
        return items;
    }
  };

  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const existingItemIndex = inventory.findIndex(item => item.name === newItem.name);

    if (existingItemIndex !== -1) {
      // Update existing item
      const updatedInventory = [...inventory];
      updatedInventory[existingItemIndex] = {
        ...updatedInventory[existingItemIndex],
        quantity: newItem.quantity,
        CurrentStock: newItem.CurrentStock,
        Stocks: newItem.Stocks,
        createdAt: newItem.createdAt
      };
      setInventory(updatedInventory);
    } else {
      // Add new item
      setInventory([
        ...inventory,
        {
          ...newItem,
          id: inventory.length + 1,
        }
      ]);
    }
  };

  // Add these new handlers before the return statement
  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const handleEditSave = (updatedItem: InventoryItem) => {
    setInventory(inventory.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  // Update filteredItems to use date filter
  const filteredItems = getFilteredByDate(
    inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (stockFilter === 'all' || item.Stocks === stockFilter)
    )
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Factory Inventory Management</h1>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Inventory
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Add this new stock filter select */}
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as 'all' | InventoryItem['Stocks'])}
          >
            <option value="all">All Stocks</option>
            <option value="Kicukiro">Kicukiro</option>
            <option value="Kamonyi">Kamonyi</option>
            <option value="Rwamagana">Rwamagana</option>
          </select>
          
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilterType)}
          >
            <option value="all">All Time</option>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Date</option>
          </select>

          {dateFilter === 'custom' && (
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">ID</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current stock</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.map((item, index) => (
              <tr key={item.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/70`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.CurrentStock.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.quantity.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.Stocks.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button 
                    onClick={() => handleEditClick(item)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-green-600 transition-colors duration-150"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-150"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
        inventory={inventory} // Add this line
      />

      {selectedItem && (
        <EditInventoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleEditSave}
          item={selectedItem}
        />
      )}
    </div>
  );
}
