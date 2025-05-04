import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { QrCode, CheckCircle, XCircle, SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const QrCodeValidator: React.FC = () => {
  const [qrCodeId, setQrCodeId] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    qrCode?: any;
  } | null>(null);
  const { validateQrCode, getQrCodeById } = useData();

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qrCodeId.trim()) {
      toast.error('Please enter a QR code ID');
      return;
    }
    
    const result = validateQrCode(qrCodeId.trim());
    const qrCode = getQrCodeById(qrCodeId.trim());
    
    setValidationResult({
      ...result,
      qrCode
    });
    
    // Clear input after validation
    setQrCodeId('');
  };

  const resetValidation = () => {
    setValidationResult(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {!validationResult ? (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <QrCode size={24} className="mr-2 text-blue-600" />
            Validate QR Code
          </h2>
          
          <form onSubmit={handleValidate} className="space-y-4">
            <div>
              <label htmlFor="qrCodeId" className="block text-sm font-medium text-gray-700 mb-1">
                QR Code ID
              </label>
              <input
                type="text"
                id="qrCodeId"
                value={qrCodeId}
                onChange={(e) => setQrCodeId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter QR code ID"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                <SearchIcon size={20} />
                Validate
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600">
              Enter the QR code ID to check if it's valid and apply the discount.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center">
          {validationResult.isValid ? (
            <div className="space-y-4">
              <CheckCircle size={64} className="mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-green-600">Valid - Discount Applied</h2>
              {validationResult.qrCode && (
                <div className="bg-gray-50 p-4 rounded-lg text-left mt-4">
                  <p><span className="font-medium">Name:</span> {validationResult.qrCode.name}</p>
                  <p><span className="font-medium">Contact:</span> {validationResult.qrCode.contact}</p>
                  <p><span className="font-medium">Created:</span> {new Date(validationResult.qrCode.createdAt).toLocaleString()}</p>
                  <p><span className="font-medium">Validated:</span> {new Date().toLocaleString()}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <XCircle size={64} className="mx-auto text-red-500" />
              <h2 className="text-2xl font-bold text-red-600">Invalid - {validationResult.message}</h2>
              {validationResult.qrCode && (
                <div className="bg-gray-50 p-4 rounded-lg text-left mt-4">
                  <p><span className="font-medium">Name:</span> {validationResult.qrCode.name}</p>
                  <p><span className="font-medium">Contact:</span> {validationResult.qrCode.contact}</p>
                  <p><span className="font-medium">Created:</span> {new Date(validationResult.qrCode.createdAt).toLocaleString()}</p>
                  {validationResult.qrCode.usedAt && (
                    <p><span className="font-medium">Used:</span> {new Date(validationResult.qrCode.usedAt).toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={resetValidation}
            className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Validate Another Code
          </button>
        </div>
      )}
    </div>
  );
};

export default QrCodeValidator;