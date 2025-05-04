import React from 'react';
import AdminNav from '../components/AdminNav';
import QrCodeTable from '../components/QrCodeTable';

const QrCodeList: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">QR Code List</h1>
          <p className="text-gray-600">View and export all generated QR codes</p>
        </div>
        
        <QrCodeTable />
      </div>
    </div>
  );
};

export default QrCodeList;