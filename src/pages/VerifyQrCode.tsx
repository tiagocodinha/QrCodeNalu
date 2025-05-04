import React from 'react';
import AdminNav from '../components/AdminNav';
import QrCodeValidator from '../components/QrCodeValidator';

const VerifyQrCode: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Verify QR Code</h1>
          <p className="text-gray-600">Validate customer QR codes and apply discounts</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <QrCodeValidator />
        </div>
      </div>
    </div>
  );
};

export default VerifyQrCode;