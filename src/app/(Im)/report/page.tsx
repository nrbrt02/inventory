'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Type declarations
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head: string[][];
      body: string[][];
      startY: number;
      theme?: string;
      styles?: {
        fontSize?: number;
        cellPadding?: number;
        textColor?: number[];
        fillColor?: number[];
      };
      headStyles?: {
        fillColor?: number[];
        textColor?: number[];
        fontSize?: number;
      };
      columnStyles?: {
        [key: number]: {
          cellWidth?: number;
          fontSize?: number;
        };
      };
    }) => void;
  }
}

interface ReportData {
  period: string;
  sales: number;
  production: number;
  inventory: number;
  revenue: number;
}

export default function ReportPage() {
  const [dateRange, setDateRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [reportType, setReportType] = useState<'sales' | 'production' | 'inventory'>('sales');

  // Sample data - replace with actual data from your backend
  const reportData: ReportData[] = [
    { period: 'Jan', sales: 1500, production: 2000, inventory: 500, revenue: 75000 },
    { period: 'Feb', sales: 1800, production: 1900, inventory: 600, revenue: 90000 },
    { period: 'Mar', sales: 2000, production: 2200, inventory: 800, revenue: 100000 },
    // Add more months...
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Maize Factory Report', 20, 20);
    
    // Add metadata
    doc.setFontSize(12);
    doc.text(`Report Type: ${reportType.toUpperCase()}`, 20, 30);
    doc.text(`Date Range: ${dateRange.toUpperCase()}`, 20, 40);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Add table
    const headers = ['Period', 'Sales (tons)', 'Production (tons)', 'Inventory (tons)', 'Revenue (frw)'];
    const data = reportData.map(item => [
      item.period,
      item.sales.toString(),
      item.production.toString(),
      item.inventory.toString(),
      `${item.revenue.toLocaleString()} frw`
    ]);

    // Updated autoTable call with proper typing
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 60,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 30 },
        4: { cellWidth: 40 }
      }
    });
    
    // Add chart as image
    const chartCanvas = document.querySelector('canvas');
    if (chartCanvas) {
      const chartImage = chartCanvas.toDataURL('image/png');
      doc.addPage();
      doc.text('Report Chart', 20, 20);
      doc.addImage(chartImage, 'PNG', 20, 30, 170, 100);
    }
    
    doc.save(`maize-factory-report-${dateRange}-${reportType}.pdf`);
  };

  const chartData = {
    labels: reportData.map(data => data.period),
    datasets: [
      {
        label: reportType.charAt(0).toUpperCase() + reportType.slice(1),
        data: reportData.map(data => data[reportType]),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Maize Factory Report',
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section with Download Button */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Maize Factory Report</h1>
            <p className="text-gray-600 mt-1">View and analyze factory performance metrics</p>
          </div>
          <div>
            <button
              onClick={downloadPDF}
              className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'daily' | 'weekly' | 'monthly')}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'sales' | 'production' | 'inventory')}
            >
              <option value="sales">Sales Report</option>
              <option value="production">Production Report</option>
              <option value="inventory">Inventory Report</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">5,300 tons</p>
          <span className="text-green-500 text-sm font-medium">↑ 12% increase</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Production</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">6,100 tons</p>
          <span className="text-green-500 text-sm font-medium">↑ 8% increase</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Current Inventory</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">800 tons</p>
          <span className="text-yellow-500 text-sm font-medium">→ Stable</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">265,000 frw</p>
          <span className="text-green-500 text-sm font-medium">↑ 15% increase</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Bar options={options} data={chartData} height={80} />
      </div>

      {/* Detailed Report Table */}
      <div className="mt-6 bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales (tons)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production (tons)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory (tons)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue (frw)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.map((data, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{data.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.production}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.inventory}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.revenue.toLocaleString()} frw</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
