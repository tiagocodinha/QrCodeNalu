import React, { useEffect, useState } from 'react';
import AdminNav from '../components/AdminNav';
import { useData } from '../contexts/DataContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics: React.FC = () => {
  const { qrCodes, getStatistics } = useData();
  const stats = getStatistics();
  const [weeklyData, setWeeklyData] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });
  const [usageByHour, setUsageByHour] = useState<{ labels: string[]; values: number[] }>({
    labels: [],
    values: [],
  });

  // Process weekly data
  useEffect(() => {
    if (qrCodes.length === 0) return;

    // Get the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    // Format dates and count codes created on each day
    const labels = last7Days.map(d => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }));
    const values = last7Days.map(day => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      return qrCodes.filter(code => {
        const createdDate = new Date(code.createdAt);
        return createdDate >= dayStart && createdDate <= dayEnd;
      }).length;
    });

    setWeeklyData({ labels, values });

    // Calculate usage by hour
    const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const hourValues = Array(24).fill(0);

    qrCodes.forEach(code => {
      if (code.isUsed && code.usedAt) {
        const hour = new Date(code.usedAt).getHours();
        hourValues[hour]++;
      }
    });

    setUsageByHour({ labels: hourLabels, values: hourValues });
  }, [qrCodes]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Statistics</h1>
          <p className="text-gray-600">Analyze QR code generation and usage trends</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Weekly QR Code Generation */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly QR Code Generation</h3>
            {weeklyData.labels.length > 0 ? (
              <Bar 
                data={{
                  labels: weeklyData.labels,
                  datasets: [
                    {
                      label: 'QR Codes Generated',
                      data: weeklyData.values,
                      backgroundColor: 'rgba(59, 130, 246, 0.5)',
                      borderColor: 'rgb(59, 130, 246)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
          
          {/* QR Code Usage Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">QR Code Usage Status</h3>
            {qrCodes.length > 0 ? (
              <Doughnut
                data={{
                  labels: ['Used', 'Unused'],
                  datasets: [
                    {
                      data: [stats.used, stats.unused],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.6)',
                        'rgba(59, 130, 246, 0.6)',
                      ],
                      borderColor: [
                        'rgb(34, 197, 94)',
                        'rgb(59, 130, 246)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                }}
              />
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
          
          {/* Usage by Hour of Day */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage by Hour of Day</h3>
            {usageByHour.values.some(v => v > 0) ? (
              <Bar 
                data={{
                  labels: usageByHour.labels,
                  datasets: [
                    {
                      label: 'QR Codes Used',
                      data: usageByHour.values,
                      backgroundColor: 'rgba(34, 197, 94, 0.5)',
                      borderColor: 'rgb(34, 197, 94)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No usage data available yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500">Total Codes</h4>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500">Redemption Rate</h4>
              <p className="text-2xl font-bold text-green-600">
                {stats.total > 0 ? Math.round((stats.used / stats.total) * 100) : 0}%
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500">Weekly Growth</h4>
              <p className="text-2xl font-bold text-purple-600">
                {stats.lastWeekGenerated}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;