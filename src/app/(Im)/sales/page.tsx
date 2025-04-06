'use client';

import { useState } from 'react';

// Types and Interfaces
type ProductName = 'Super' | 'Ordinaire' | 'Bran';
type PaymentType = 'Now' | 'Later';

interface OrderItem {
  product: ProductName;
  quantity: number;
  quantityCarried: number;
  quantityRemained: number;
  pricePerUnit: number;
  subtotal: number;
}

interface Sale {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  amountPaid: number;
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Fully Paid';
  paymentTiming: PaymentType;
  status: 'Pending' | 'Completed';
  date: string;
}

interface Payment {
  id: number;
  saleId: number;
  amountPaid: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Mobile Money';
  paymentDate: string;
  reference?: string;
}

// Helper functions
const calculateStatus = (items: OrderItem[]): Sale['status'] => {
  return items.every(item => item.quantityRemained === 0) ? 'Completed' : 'Pending';
};

const calculatePaymentStatus = (totalAmount: number, amountPaid: number): Sale['paymentStatus'] => {
  if (amountPaid === 0) return 'Unpaid';
  if (amountPaid < totalAmount) return 'Partially Paid';
  return 'Fully Paid';
};

const getStatusColor = (status: Sale['status']) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: Sale['paymentStatus']) => {
  switch (status) {
    case 'Fully Paid':
      return 'bg-green-100 text-green-800';
    case 'Partially Paid':
      return 'bg-yellow-100 text-yellow-800';
    case 'Unpaid':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const generateOrderNumber = (lastNumber: string): string => {
  if (!lastNumber) return 'S001';
  const num = parseInt(lastNumber.substring(1)) + 1;
  return `S${num.toString().padStart(3, '0')}`;
};

export default function SalesPage() {
  // States
  const [sales, setSales] = useState<Sale[]>([
    {
      id: 1,
      orderNumber: "S001",
      items: [
        {
          product: "Super",
          quantity: 50,
          quantityCarried: 50,
          quantityRemained: 0,
          pricePerUnit: 1200,
          subtotal: 60000
        }
      ],
      totalAmount: 60000,
      amountPaid: 60000,
      paymentStatus: "Fully Paid",
      paymentTiming: "Now",
      status: "Completed",
      date: "2023-11-15"
    },
    {
      id: 2,
      orderNumber: "S002",
      items: [
        {
          product: "Ordinaire",
          quantity: 30,
          quantityCarried: 20,
          quantityRemained: 10,
          pricePerUnit: 1000,
          subtotal: 30000
        },
        {
          product: "Bran",
          quantity: 15,
          quantityCarried: 15,
          quantityRemained: 0,
          pricePerUnit: 800,
          subtotal: 12000
        }
      ],
      totalAmount: 42000,
      amountPaid: 30000,
      paymentStatus: "Partially Paid",
      paymentTiming: "Later",
      status: "Pending",
      date: "2023-11-20"
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'order' | 'payment'>('order');
  const [orderData, setOrderData] = useState<Omit<Sale, 'id'> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Sale['status']>('all');
  const [currentSaleForPayment, setCurrentSaleForPayment] = useState<Sale | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    items: [
      {
        product: 'Super' as ProductName,
        quantity: 0,
        quantityCarried: 0,
        quantityRemained: 0,
        pricePerUnit: 0,
        subtotal: 0
      }
    ],
    paymentTiming: 'Now' as PaymentType,
    date: new Date().toISOString().split('T')[0]
  });

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'Cash' as Payment['paymentMethod'],
    amountPaid: 0,
    reference: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  // Check for duplicate products
  const hasDuplicateProducts = (items: OrderItem[]): boolean => {
    const products = items.map(item => item.product);
    return new Set(products).size !== products.length;
  };

  // Handlers
  const handleAddItem = () => {
    setError(null);
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        product: 'Super',
        quantity: 0,
        quantityCarried: 0,
        quantityRemained: 0,
        pricePerUnit: 0,
        subtotal: 0
      }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length === 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: number | ProductName) => {
    setError(null);
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updates: Partial<OrderItem> = { [field]: value };
          
          if (field === 'quantity') {
            const quantity = Number(value);
            updates.quantityRemained = quantity - (item.quantityCarried || 0);
            updates.subtotal = quantity * item.pricePerUnit;
          } else if (field === 'quantityCarried') {
            updates.quantityRemained = item.quantity - Number(value);
          } else if (field === 'pricePerUnit') {
            const pricePerUnit = Number(value);
            updates.subtotal = item.quantity * pricePerUnit;
          }
          
          return { ...item, ...updates };
        }
        return item;
      })
    }));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate products
    if (hasDuplicateProducts(formData.items)) {
      setError('Each product can only be added once to an order. Please remove duplicates.');
      return;
    }

    const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
    
    // Generate order number based on the latest sale
    const latestOrderNumber = sales.length > 0 ? sales[0].orderNumber : 'S000';
    const orderNumber = generateOrderNumber(latestOrderNumber);
    
    const newOrder: Omit<Sale, 'id'> = {
      orderNumber,
      ...formData,
      totalAmount,
      amountPaid: 0,
      paymentStatus: 'Unpaid',
      status: calculateStatus(formData.items)
    };

    setOrderData(newOrder);
    
    if (formData.paymentTiming === 'Now') {
      setCurrentStep('payment');
    } else {
      handleSaleComplete(newOrder);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData && !currentSaleForPayment) return;

    if (currentSaleForPayment) {
      // Handling payment for existing sale
      const updatedSales = sales.map(sale => {
        if (sale.id === currentSaleForPayment.id) {
          const newAmountPaid = sale.amountPaid + paymentData.amountPaid;
          return {
            ...sale,
            amountPaid: newAmountPaid,
            paymentStatus: calculatePaymentStatus(sale.totalAmount, newAmountPaid)
          };
        }
        return sale;
      });
      setSales(updatedSales);
    } else if (orderData) {
      // Handling payment for new sale
      const newSale: Sale = {
        ...orderData,
        id: sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1,
        amountPaid: paymentData.amountPaid,
        paymentStatus: calculatePaymentStatus(orderData.totalAmount, paymentData.amountPaid)
      };
      // Add new sale to the beginning of the array
      setSales(prev => [newSale, ...prev]);
    }

    setIsModalOpen(false);
    setCurrentStep('order');
    setOrderData(null);
    setCurrentSaleForPayment(null);
    resetForms();
  };

  const handleSaleComplete = (orderData: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...orderData,
      id: sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1
    };
    
    // Add new sale to the beginning of the array
    setSales(prev => [newSale, ...prev]);
    setIsModalOpen(false);
    setCurrentStep('order');
    setOrderData(null);
    resetForms();
  };

  const resetForms = () => {
    setFormData({
      items: [{
        product: 'Super',
        quantity: 0,
        quantityCarried: 0,
        quantityRemained: 0,
        pricePerUnit: 0,
        subtotal: 0
      }],
      paymentTiming: 'Now',
      date: new Date().toISOString().split('T')[0]
    });

    setPaymentData({
      paymentMethod: 'Cash',
      amountPaid: 0,
      reference: '',
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setError(null);
  };

  // Filter sales
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    const saleDate = new Date(sale.date);
    const today = new Date();

    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = saleDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today.setDate(today.getDate() - 7));
      matchesDate = saleDate >= weekAgo;
    } else if (dateFilter === 'month') {
      matchesDate = saleDate.getMonth() === today.getMonth() && 
        saleDate.getFullYear() === today.getFullYear();
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewSale = (sale: Sale) => {
    // Implement view logic here
    console.log('Viewing sale:', sale);
  };

  const handleMakePayment = (sale: Sale) => {
    setCurrentSaleForPayment(sale);
    setIsModalOpen(true);
    setCurrentStep('payment');
    // Pre-fill payment amount with remaining balance
    setPaymentData(prev => ({
      ...prev,
      amountPaid: sale.totalAmount - sale.amountPaid
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sales Management</h1>
        <p className="text-gray-600">Manage and track all sales transactions</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Sales</div>
          <div className="text-2xl font-bold text-gray-800">{sales.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-green-600">
            frw {sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Pending Orders</div>
          <div className="text-2xl font-bold text-yellow-600">
            {sales.filter(sale => sale.status === 'Pending').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Completed Orders</div>
          <div className="text-2xl font-bold text-blue-600">
            {sales.filter(sale => sale.status === 'Completed').length}
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4">
            <input
              type="text"
              placeholder="Search by order number..."
              className="flex-1 px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setCurrentStep('order');
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            New Order
          </button>
        </div>
      </div> 

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Order #</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredSales.map((sale, index) => (
              <tr key={sale.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/70`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                  #{sale.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {sale.items.length} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                  frw {sale.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                  frw {sale.amountPaid.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(sale.paymentStatus)}`}>
                    {sale.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(sale.status)}`}>
                    {sale.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button 
                    onClick={() => handleViewSale(sale)}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                  >
                    View
                  </button>
                  {sale.paymentStatus !== 'Fully Paid' && (
                    <button 
                      onClick={() => handleMakePayment(sale)}
                      className="text-green-600 hover:text-green-800 transition-colors duration-150"
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-gradient-to-br from-gray-600/70 to-gray-900/70 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[800px] max-h-[85vh] overflow-y-auto">
              {currentStep === 'order' ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">New Sale Order</h2>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleOrderSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Timing</label>
                        <select
                          className="w-full px-4 py-2 border rounded-lg"
                          value={formData.paymentTiming}
                          onChange={(e) => setFormData({ ...formData, paymentTiming: e.target.value as PaymentType })}
                          required
                        >
                          <option value="Now">Pay Now</option>
                          <option value="Later">Pay Later</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Products</h3>
                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          disabled={formData.items.length >= 3} // Limit to 3 products
                        >
                          Add Product
                        </button>
                      </div>

                      {formData.items.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                              <select
                                className="w-full px-4 py-2 border rounded-lg"
                                value={item.product}
                                onChange={(e) => handleItemChange(index, 'product', e.target.value as ProductName)}
                                required
                              >
                                <option value="">Select product</option>
                                <option value="Super">Super</option>
                                <option value="Ordinaire">Ordinaire</option>
                                <option value="Bran">Bran</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                              <input
                                type="number"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                min="0"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit</label>
                              <input
                                type="number"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={item.pricePerUnit}
                                onChange={(e) => handleItemChange(index, 'pricePerUnit', Number(e.target.value))}
                                min="0"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
                              <input
                                type="number"
                                className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                                value={item.subtotal}
                                readOnly
                              />
                            </div>
                          </div>
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove Item
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <div className="text-lg font-medium">
                        Total Amount: frw {formData.items.reduce((sum, item) => sum + (item.subtotal || 0), 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          resetForms();
                        }}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        {formData.paymentTiming === 'Now' ? 'Continue to Payment' : 'Save Order'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay</label>
                      <input
                        type="number"
                        className="w-full px-4 py-2 border rounded-lg"
                        value={paymentData.amountPaid}
                        onChange={(e) => setPaymentData({ ...paymentData, amountPaid: Number(e.target.value) })}
                        max={orderData?.totalAmount || currentSaleForPayment?.totalAmount}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        className="w-full px-4 py-2 border rounded-lg"
                        value={paymentData.paymentMethod}
                        onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value as Payment['paymentMethod'] })}
                        required
                      >
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Mobile Money">Mobile Money</option>
                      </select>
                    </div>

                    {paymentData.paymentMethod !== 'Cash' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg"
                          value={paymentData.reference}
                          onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                          required
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('order')}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Complete Payment
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}