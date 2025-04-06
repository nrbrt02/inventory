'use client';

import { useState, useRef, useEffect } from 'react';

// Define product name type
type ProductName = string;

interface Product {
  id: number;
  name: ProductName;
  category: 'Raw Material' | 'Semi-Final' | 'Final Product';
  description: string;
  createdAt: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
}

const AddProductModal = ({ isOpen, onClose, onAdd }: AddProductModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [newProduct, setNewProduct] = useState({
    name: 'Super' as ProductName,
    category: 'Raw Material' as Product['category'],
    description: '',
    createdAt: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newProduct.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!newProduct.createdAt) {
      newErrors.createdAt = 'Creation date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd(newProduct);
      onClose();
      setNewProduct({
        name: 'Super',
        category: 'Raw Material',
        description: '',
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-600/0.5 to-gray-900/0.5 backdrop-blur-sm z-10" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div 
          ref={modalRef}
          className="bg-white p-6 rounded-xl w-[550px] max-h-[85vh] overflow-y-auto shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="mb-6 pb-4 border-b">
            <h2 id="modal-title" className="text-2xl font-bold text-gray-800">Add New Product</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as Product['category'] })}
              >
                <option value="Raw Material">Raw Material</option>
                <option value="Semi-Final">Semi-Final</option>
                <option value="Final Product">Final Product</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500`}
                value={newProduct.description}
                onChange={(e) => {
                  setNewProduct({ ...newProduct, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'desc-error' : undefined}
                required
              />
              {errors.description && (
                <p id="desc-error" className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Creation Date</label>
              <input
                type="date"
                className={`w-full px-4 py-2 border ${errors.createdAt ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500`}
                value={newProduct.createdAt}
                onChange={(e) => {
                  setNewProduct({ ...newProduct, createdAt: e.target.value });
                  if (errors.createdAt) setErrors({ ...errors, createdAt: '' });
                }}
                aria-invalid={!!errors.createdAt}
                aria-describedby={errors.createdAt ? 'date-error' : undefined}
                required
              />
              {errors.createdAt && (
                <p id="date-error" className="mt-1 text-sm text-red-600">{errors.createdAt}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
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

// Helper function to get product name color
const getProductNameColor = (name: ProductName): string => {
  switch (name) {
    case 'Super':
      return 'text-blue-600';
    case 'Ordinaire':
      return 'text-green-600';
    case 'Bran':
      return 'text-amber-600';
    default:
      return 'text-gray-600';
  }
};

export default function ProductPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'day' | 'week' | 'month'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Super',
      category: 'Raw Material',
      description: 'Basic raw material for production',
      createdAt: '2025-03-26'
    },
    {
      id: 2,
      name: 'Ordinaire',
      category: 'Semi-Final',
      description: 'Intermediate product for further processing',
      createdAt: '2025-03-27'
    },
    {
      id: 3,
      name: 'Bran',
      category: 'Final Product',
      description: 'Finished product ready for distribution',
      createdAt: '2025-03-28'
    },
    {
      id: 4,
      name: 'Super',
      category: 'Raw Material',
      description: 'High quality raw material',
      createdAt: '2025-03-29'
    },
    {
      id: 5,
      name: 'Ordinaire',
      category: 'Final Product',
      description: 'Standard finished product',
      createdAt: '2025-03-30'
    }
  ]);

  const productsPerPage = 5;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const productDate = new Date(product.createdAt);
    const today = new Date();

    if (dateFilter === 'day') {
      return matchesSearch && productDate.toDateString() === today.toDateString();
    }
    if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return matchesSearch && productDate >= weekAgo;
    }
    if (dateFilter === 'month') {
      return matchesSearch && 
        productDate.getMonth() === today.getMonth() && 
        productDate.getFullYear() === today.getFullYear();
    }
    return matchesSearch;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    // Generate a new ID (using the highest existing ID + 1)
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Prepend the new product to the beginning of the array
    setProducts([{ ...newProduct, id: newId }, ...products]);
    
    // Reset to the first page to show the newly added product
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
      // Adjust current page if needed
      if (currentProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Products Management</h1>
        <p className="text-gray-600">Manage and track all products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Products</div>
          <div className="text-2xl font-bold text-gray-800">{products.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Raw Materials</div>
          <div className="text-2xl font-bold text-blue-600">
            {products.filter(p => p.category === 'Raw Material').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Final Products</div>
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.category === 'Final Product').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value as typeof dateFilter);
              setCurrentPage(1); // Reset to first page when filtering
            }}
          >
            <option value="all">All Time</option>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ml-auto"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Product List</h2>
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </div>
        </div>

        <div className="overflow-x-auto">
          {currentProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products found. Try adjusting your filters or add a new product.
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">ID</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentProducts.map((product, index) => (
                    <tr key={product.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/70`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.id}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getProductNameColor(product.name)}`}>
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                      <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-700">{product.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors duration-150">Edit</button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between items-center gap-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}