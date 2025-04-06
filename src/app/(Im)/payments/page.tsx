'use client';

import { useState } from 'react';
import { 
   Edit, Trash2, Plus, Eye, X, Search 
} from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  date: string;
  customerName: string;
  type: 'income' | 'expense';
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank transfer';
  description: string;
}

export default function PaymentActions() {
  // States
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-03-25',
      customerName: 'John Doe',
      type: 'income',
      amount: 1500.00,
      paymentMethod: 'cash',
      description: 'Payment for Invoice #1234'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    type: 'income' as 'income' | 'expense',
    amount: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'bank transfer',
    description: ''
  });

  // Handlers
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      ...formData,
      amount: parseFloat(formData.amount)
    };
    setTransactions(prev => [...prev, newTransaction]);
    setIsModalOpen(false);
    toast.success('Transaction added successfully');
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      type: 'income',
      amount: '',
      paymentMethod: 'cash',
      description: ''
    });
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction deleted successfully');
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.includes(searchTerm);
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Other Payment Actions</h1>
          <p className="text-gray-600">Manage and track all Other payment</p>
        </div>
        
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Changed to 3 columns */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search transactions..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <select
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
      value={filterType}
      onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
    >
      <option value="all">All Types</option>
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>
    <button
      className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
      onClick={() => setIsModalOpen(true)}
    >
      <Plus size={20} />
      Other Payments
    </button>
  </div>
</div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-500">Total Income</div>
            <div className="p-2 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">
            frw {transactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            From {transactions.filter(t => t.type === 'income').length} transactions
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-500">Total Expenses</div>
            <div className="p-2 bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600">
            frw {transactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            From {transactions.filter(t => t.type === 'expense').length} transactions
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-500">Net Balance</div>
            <div className="p-2 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            frw {(transactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0) - 
              transactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0))
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            From {transactions.length} total transactions
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">ID</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredTransactions.map((transaction, index) => (
              <tr key={transaction.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/70`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">#{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    frw{transaction.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                      onClick={() => handleViewDetails(transaction)}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                      onClick={() => {/* Add edit logic */}}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800 transition-colors duration-150"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-gradient-to-br from-gray-600/70 to-gray-900/70 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Transaction</h3>
                <button 
                  className="text-gray-500 hover:text-gray-800"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTransaction}>
                <div className="mb-4">
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    id="customerName"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-green-600"
                        name="type"
                        value="income"
                        checked={formData.type === 'income'}
                        onChange={() => setFormData({ ...formData, type: 'income' })}
                      />
                      <span className="ml-2">Income</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-red-600"
                        name="type"
                        value="expense"
                        checked={formData.type === 'expense'}
                        onChange={() => setFormData({ ...formData, type: 'expense' })}
                      />
                      <span className="ml-2">Expense</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    id="paymentMethod"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'cash' | 'card' | 'bank transfer' })}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    rows={3}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedTransaction && (
        <>
          <div className="fixed inset-0 bg-gradient-to-br from-gray-600/70 to-gray-900/70 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Transaction Details</h3>
                <button 
                  className="text-gray-500 hover:text-gray-800"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <p><strong>ID:</strong> {selectedTransaction.id}</p>
                <p><strong>Customer:</strong> {selectedTransaction.customerName}</p>
                <p>
                  <strong>Type:</strong> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    selectedTransaction.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedTransaction.type}
                  </span>
                </p>
                <p>
                  <strong>Amount:</strong> 
                  <span className={`ml-2 ${selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    frw{selectedTransaction.amount.toLocaleString()}
                  </span>
                </p>
                <p><strong>Description:</strong> {selectedTransaction.description}</p>
                <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
                <p><strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleDateString()}</p>
              </div>

              <div className="mt-4 flex justify-end">
                <button 
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}