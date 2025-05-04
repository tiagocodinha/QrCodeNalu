import React from 'react';
import AdminNav from '../components/AdminNav';
import { useData } from '../contexts/DataContext';
import { QrCode, Users, FileLock as Cocktail, Calendar } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { qrCodes, getStatistics } = useData();
  const stats = getStatistics();
  
  // Calculate simple usage percentage
  const usagePercentage = qrCodes.length > 0 
    ? Math.round((stats.used / qrCodes.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and track discount QR codes</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total QR Codes"
            value={stats.total}
            icon={<QrCode size={24} className="text-blue-600" />}
            color="blue"
          />
          
          <StatsCard
            title="Used Codes"
            value={stats.used}
            icon={<Cocktail size={24} className="text-green-600" />}
            color="green"
            subtitle={`${usagePercentage}% redemption rate`}
          />
          
          <StatsCard
            title="Unused Codes"
            value={stats.unused}
            icon={<QrCode size={24} className="text-amber-600" />}
            color="amber"
          />
          
          <StatsCard
            title="Last 7 Days"
            value={stats.lastWeekGenerated}
            icon={<Calendar size={24} className="text-purple-600" />}
            color="purple"
            subtitle={`${stats.lastWeekUsed} used this week`}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/admin/verify" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <QrCode size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Verify QR Code</h3>
            </div>
            <p className="text-gray-600">
              Validate customer QR codes and apply discounts
            </p>
          </Link>
          
          <Link 
            to="/admin/codes" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Users size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">QR Code List</h3>
            </div>
            <p className="text-gray-600">
              View all generated QR codes and their status
            </p>
          </Link>
          
          <Link 
            to="/admin/statistics" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Calendar size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Statistics</h3>
            </div>
            <p className="text-gray-600">
              View detailed statistics and usage trends
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;