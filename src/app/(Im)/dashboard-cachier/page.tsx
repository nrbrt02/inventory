'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Clock, 
  CreditCard, 
  ShoppingCart, 
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Transaction {
  id: number;
  type: 'sale' | 'refund';
  amount: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  status: 'completed' | 'pending' | 'failed';
  customerName: string;
  timestamp: string;
  items: number;
}

const sampleTransactions: Transaction[] = [
  {
    id: 1,
    type: 'sale',
    amount: 150.00,
    paymentMethod: 'cash',
    status: 'completed',
    customerName: 'John Doe',
    timestamp: '2025-03-24T09:30:00',
    items: 3
  },
  {
    id: 2,
    type: 'sale',
    amount: 299.99,
    paymentMethod: 'card',
    status: 'pending',
    customerName: 'Jane Smith',
    timestamp: '2025-03-24T10:15:00',
    items: 5
  },
  // Add more sample transactions as needed
];

export default function CashierDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions] = useState<Transaction[]>(sampleTransactions);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/');
        return;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.role !== 'cashier') {
          router.push('/');
        } else {
          setIsLoading(false);
        }
      } catch {
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const getStats = () => {
    const now = new Date();
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.timestamp);
      if (timeFilter === 'today') {
        return transactionDate.toDateString() === now.toDateString();
      }
      if (timeFilter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return transactionDate >= weekAgo;
      }
      if (timeFilter === 'month') {
        return transactionDate.getMonth() === now.getMonth();
      }
      return true;
    });

    return {
      totalSales: filteredTransactions
        .filter(t => t.type === 'sale' && t.status === 'completed')
        .reduce((acc, curr) => acc + curr.amount, 0),
      totalTransactions: filteredTransactions.length,
      pendingTransactions: filteredTransactions.filter(t => t.status === 'pending').length,
      averageTransaction: filteredTransactions.length > 0 
        ? filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0) / filteredTransactions.length
        : 0,
      totalItems: filteredTransactions.reduce((acc, curr) => acc + curr.items, 0)
    };
  };

  const stats = getStats();

  return (
    <ProtectedRoute allowedRoles={['cashier']}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Enhanced Header with Time Filter */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cashier Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here&#39;s your sales overview</p>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            title="Total Sales"
            value={`frw ${stats.totalSales.toLocaleString()}`}
            subtitle="Revenue generated"
            color="green"
          />
          <StatCard
            icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
            title="Total Items"
            value={stats.totalItems.toString()}
            subtitle="Items sold"
            color="blue"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-yellow-600" />}
            title="Pending"
            value={stats.pendingTransactions.toString()}
            subtitle="Transactions to process"
            color="yellow"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            title="Average Sale"
            value={`frw ${stats.averageTransaction.toLocaleString()}`}
            subtitle="Per transaction"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push('/sales/new')}
            className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 mr-3 text-green-600" />
            <span className="text-gray-700 font-medium">New Sale</span>
          </button>
          <button
            onClick={() => router.push('/customers')}
            className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Users className="w-6 h-6 mr-3 text-blue-600" />
            <span className="text-gray-700 font-medium">Customers</span>
          </button>
          <button
            onClick={() => router.push('/reports')}
            className="flex items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-6 h-6 mr-3 text-purple-600" />
            <span className="text-gray-700 font-medium">Daily Report</span>
          </button>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{transaction.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.type === 'sale' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      frw {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: 'green' | 'blue' | 'yellow' | 'purple';
}

const StatCard = ({ icon, title, value, subtitle, color }: StatCardProps) => {
  const colorClasses = {
    green: 'bg-green-50',
    blue: 'bg-blue-50',
    yellow: 'bg-yellow-50',
    purple: 'bg-purple-50'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
    </div>
  );
};