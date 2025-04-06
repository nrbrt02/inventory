'use client';

import { 
  ShoppingCart, 
  Package, 
  Tag, 
  Wallet, 
  Users 
} from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Add these interfaces at the top
interface MetricData {
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  details: {
    label: string;
    value: string | number;
  }[];
}

interface DashboardData {
  sales: MetricData;
  stock: MetricData;
  orders: MetricData;
  payments: MetricData;
}

interface AlertNotification {
  id: number;
  type: 'warning' | 'danger' | 'info';
  message: string;
  timestamp: string;
}

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Summary Card Component
const SummaryCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  change, 
  onClick,
  alertCount = 0 
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  onClick?: () => void;
  alertCount?: number;
}) => (
  <div 
    onClick={onClick}
    className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-blue-500 
               transition-colors cursor-pointer relative"
  >
    <div className="flex items-center justify-between">
      <Icon className="w-8 h-8 text-gray-600" />
      {alertCount > 0 && (
        <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 
                        flex items-center justify-center text-xs">
          {alertCount}
        </span>
      )}
    </div>
    <div className="mt-2">
      <h3 className="text-sm uppercase text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {trend && (
        <div className={`flex items-center mt-1 ${
          trend === 'up' ? 'text-green-500' : 
          trend === 'down' ? 'text-red-500' : 'text-gray-500'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'}
          <span className="ml-1">{change}%</span>
        </div>
      )}
    </div>
  </div>
);

// Donut Chart Component
const DonutChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => `${item.label} (${item.value}%)`),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label.split(' ')[0]}: ${context.raw}%`,
        },
      },
    },
    cutout: '70%',
  };

  return <Doughnut data={chartData} options={options} />;
};

// Histogram Chart Component
const HistogramChart = ({ data, colors }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Series 1',
        data: data.map(item => item.values[0]),
        backgroundColor: colors[0],
        barThickness: 20,
      },
      {
        label: 'Series 2',
        data: data.map(item => item.values[1]),
        backgroundColor: colors[1],
        barThickness: 20,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: '#D1D5DB', // Darker gray for contrast
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend for cleaner look
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label: any; }; raw: any; }) => `${context.dataset.label}: ${context.raw}%`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

const MetricsModal = ({ 
  isOpen,
  onClose, 
  title, 
  data 
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: MetricData;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {data.details.map((detail, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-600">{detail.label}</span>
              <span className="font-semibold">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  // Sample data with more meaningful metrics
  const summaryData = [
    { 
      title: 'Total Sales', 
      value: 'frw 125,000', 
      icon: ShoppingCart,
      trend: 'up',
      change: 12,
      alertCount: 3
    },
    { 
      title: 'Stock Value', 
      value: 'frw 450,000', 
      icon: Package,
      trend: 'down',
      change: 5,
      alertCount: 2
    },
    { 
      title: 'Active Orders', 
      value: '38', 
      icon: Tag,
      trend: 'up',
      change: 8,
      alertCount: 0
    },
    { 
      title: 'Revenue', 
      value: 'frw 89,000', 
      icon: Wallet,
      trend: 'up',
      change: 15,
      alertCount: 0
    }
  ];

  const donutData = [
    { label: 'Raw Materials', value: 40, color: '#2563EB' },
    { label: 'In Production', value: 35, color: '#10B981' },
    { label: 'Finished Goods', value: 25, color: '#F59E0B' }
  ];

  const histogramData = [
    { month: 'Jan', values: [65, 85] },
    { month: 'Feb', values: [55, 75] },
    { month: 'Mar', values: [75, 65] },
    { month: 'Apr', values: [85, 95] },
    { month: 'May', values: [65, 75] },
    { month: 'Jun', values: [55, 65] }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in Maize Factory</p>
      </div>

      {/* Summary Cards with Improved Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryData.map((item, index) => (
          <SummaryCard 
            key={index}
            {...item}
            onClick={() => {/* Handle card click */}}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Stock Distribution Chart */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Stock Distribution</h2>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
            </select>
          </div>
          <DonutChart data={donutData} />
        </div>

        {/* Monthly Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Sales vs Orders</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Sales</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
            </div>
          </div>
          <HistogramChart 
            data={histogramData} 
            colors={['#2563EB', '#F59E0B']} 
          />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {/* Activity items */}
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New order received</p>
                  <p className="text-sm text-gray-500">Order #1234 - frw 1,230</p>
                </div>
                <span className="ml-auto text-sm text-gray-500">2 min ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'New Sale', icon: ShoppingCart, color: 'bg-blue-500' },
              { title: 'Add Product', icon: Package, color: 'bg-green-500' },
              { title: 'Generate Report', icon: Tag, color: 'bg-amber-500' },
              { title: 'View Inventory', icon: Wallet, color: 'bg-purple-500' }
            ].map((action, i) => (
              <button
                key={i}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


