'use client';

import { useState } from 'react';
import { 
  Package, 
  Factory, 
  DollarSign, 
  PlusCircle,
  Edit,
  Trash,
  Eye,
  WalletCards
} from 'lucide-react';

// Define interfaces
interface RawMaterial {
  name: string;
  quantityUsed: number;
  unitCost: number;
  totalCost: number;
  supplierName: string;
}

interface ProductProduced {
  name: string;
  quantity: number;
  unitCost: number;
}

interface ProductionBatch {
  id: number;
  batchNumber: string;
  startDate: string;
  endDate: string | null;
  status: 'In Progress' | 'Completed' | 'On Hold';
  rawMaterials: RawMaterial[];
  laborCost: number;
  overheadCost: number;
  totalProductionCost: number;
  productsProduced: ProductProduced[];
}

export default function ProductionPage() {
  // States
  const [productions, setProductions] = useState<ProductionBatch[]>([
    {
      id: 1,
      batchNumber: 'PROD-001',
      startDate: '2025-03-26',
      endDate: null,
      status: 'In Progress',
      rawMaterials: [
        { 
          name: 'Raw Material A', 
          quantityUsed: 100, 
          unitCost: 5, 
          totalCost: 500,
          supplierName: 'Supplier A'
        },
        { 
          name: 'Raw Material B', 
          quantityUsed: 50, 
          unitCost: 10, 
          totalCost: 500,
          supplierName: 'Supplier B'
        }
      ],
      laborCost: 200,
      overheadCost: 100,
      totalProductionCost: 1300,
      productsProduced: [
        { name: 'Product X', quantity: 75, unitCost: 17.33 }
      ]
    }
  ]);

  const [filterConfig, setFilterConfig] = useState({
    searchTerm: '',
    status: 'all' as 'all' | ProductionBatch['status'],
    sortBy: 'date' as 'date' | 'cost' | 'status' | 'supplier'
  });

  // Filtering and sorting logic
  const filteredProductions = productions
    .filter(batch => {
      const searchLower = filterConfig.searchTerm.toLowerCase();
      const matchesSearch = 
        batch.batchNumber.toLowerCase().includes(searchLower) ||
        batch.rawMaterials.some(mat => 
          mat.name.toLowerCase().includes(searchLower) ||
          mat.supplierName.toLowerCase().includes(searchLower)
        );
      
      const matchesStatus = filterConfig.status === 'all' || batch.status === filterConfig.status;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (filterConfig.sortBy) {
        case 'date':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'cost':
          return b.totalProductionCost - a.totalProductionCost;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'supplier':
          return a.rawMaterials[0]?.supplierName.localeCompare(b.rawMaterials[0]?.supplierName || '');
        default:
          return 0;
      }
    });

  // Stats calculations
  const stats = {
    totalMaterials: productions.reduce((acc, prod) => 
      acc + prod.rawMaterials.reduce((sum, mat) => sum + mat.quantityUsed, 0), 0
    ),
    totalProducts: productions.reduce((acc, prod) => 
      acc + prod.productsProduced.reduce((sum, prod) => sum + prod.quantity, 0), 0
    ),
    totalCost: productions.reduce((acc, prod) => acc + prod.totalProductionCost, 0),
    activeBatches: productions.filter(p => p.status === 'In Progress').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Production Management</h1>
        <p className="text-gray-600">Track production batches, materials usage, and costs</p>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Package className="w-6 h-6 text-blue-600" />}
          title="Raw Materials Used"
          value={stats.totalMaterials}
          textColor="text-blue-600"
        />
        <StatCard
          icon={<Factory className="w-6 h-6 text-green-600" />}
          title="Products Produced"
          value={stats.totalProducts}
          textColor="text-green-600"
        />
        <StatCard
          icon={<WalletCards className="w-6 h-6 text-yellow-600" />}
          title="Total Production Cost"
          value={`frw ${stats.totalCost.toFixed(2)}`}
          textColor="text-yellow-600"
        />
        <StatCard
          icon={<Factory className="w-6 h-6 text-purple-600" />}
          title="Active Batches"
          value={stats.activeBatches}
          textColor="text-purple-600"
        />
      </div>

      {/* Enhanced Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by batch, material, or supplier..."
            value={filterConfig.searchTerm}
            onChange={(e) => setFilterConfig({ ...filterConfig, searchTerm: e.target.value })}
            className="flex-1 min-w-[200px] p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <select
            value={filterConfig.status}
            onChange={(e) => setFilterConfig({ ...filterConfig, status: e.target.value as any })}
            className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <select
            value={filterConfig.sortBy}
            onChange={(e) => setFilterConfig({ ...filterConfig, sortBy: e.target.value as any })}
            className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="date">Sort by Date</option>
            <option value="cost">Sort by Cost</option>
            <option value="status">Sort by Status</option>
            <option value="supplier">Sort by Supplier</option>
          </select>
        </div>
      </div>

      {/* Production Batches Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Production Batches</h2>
          <button className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
            <PlusCircle className="w-5 h-5 mr-2" />
            New Batch
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raw Materials</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products Produced</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProductions.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{batch.batchNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.endDate || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {batch.rawMaterials.length} types
                      <span className="text-gray-500 ml-1">
                        ({batch.rawMaterials.reduce((acc, mat) => acc + mat.quantityUsed, 0)} units)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {batch.productsProduced.reduce((acc, prod) => acc + prod.quantity, 0)} units
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    frw {batch.totalProductionCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      batch.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      batch.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  textColor: string;
}

const StatCard = ({ icon, title, value, textColor }: StatCardProps) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      {icon}
      <span className="text-sm text-gray-500">{title}</span>
    </div>
    <div className={`text-2xl font-bold ${textColor}`}>
      {value}
    </div>
  </div>
);