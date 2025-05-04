import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { QrCode, CheckCircle, XCircle, Camera, SearchIcon } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { validate as validateUUID } from 'uuid';

const QrCodeValidator: React.FC = () => {
  const [qrCodeId, setQrCodeId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    qrCode?: any;
  } | null>(null);
  const { validateQrCode, getQrCodeById } = useData();
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const handleValidate = async (id: string) => {
    try {
      const validId = id.trim();
      
      // Basic validation
      if (!validId) {
        toast.error('Please enter a QR code ID');
        return;
      }

      // UUID format validation
      if (!validateUUID(validId)) {
        toast.error('Invalid QR code format');
        return;
      }

      // Get QR code details
      const qrCode = await getQrCodeById(validId);
      if (!qrCode) {
        setValidationResult({
          isValid: false,
          message: 'QR code not found',
          qrCode: null
        });
        return;
      }

      // Validate the QR code
      const result = await validateQrCode(validId);
      setValidationResult({
        ...result,
        qrCode
      });

      // Clear input and scanner
      setQrCodeId('');
      if (scannerRef.current) {
        scannerRef.current.clear();
        setShowScanner(false);
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate QR code');
    }
  };

  const resetValidation = () => {
    setValidationResult(null);
    setShowScanner(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
  };

  const startScanner = () => {
    setShowScanner(true);
    setValidationResult(null);

    setTimeout(() => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }

      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true
        },
        false
      );

      scannerRef.current.render(
        async (decodedText: string) => {
          // Stop scanning once we get a result
          if (scannerRef.current) {
            scannerRef.current.pause();
          }

          // Process the scanned QR code
          await handleValidate(decodedText);
        },
        (error: any) => {
          // Ignore scanning errors
          console.debug('QR Scan error:', error);
        }
      );
    }, 100);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {!validationResult && !showScanner ? (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <QrCode size={24} className="mr-2 text-blue-600" />
            Validate QR Code
          </h2>
          
          <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); handleValidate(qrCodeId); }} className="space-y-4">
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
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                  <SearchIcon size={20} />
                  Validate
                </button>
                
                <button
                  type="button"
                  onClick={startScanner}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                  <Camera size={20} />
                  Scan QR
                </button>
              </div>
            </form>
          </div>
        </>
      ) : showScanner ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Camera size={24} className="mr-2 text-green-600" />
            Scan QR Code
          </h2>
          
          <div id="qr-reader" className="w-full max-w-sm mx-auto"></div>
          
          <button
            onClick={resetValidation}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Cancel Scanning
          </button>
        </div>
      ) : (
        <div className="text-center">
          {validationResult.isValid ? (
            <div className="space-y-4">
              <CheckCircle size={64} className="mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-green-600">Valid - Discount Applied</h2>
              {validationResult.qrCode && (
                <div className="bg-gray-50 p-4 rounded-lg text-left mt-4">
                  <p><span className="font-medium">Name:</span> {validationResult.qrCode.name}</p>
                  <p><span className="font-medium">Contact:</span> {validationResult.qrCode.phone}</p>
                  <p><span className="font-medium">Created:</span> {new Date(validationResult.qrCode.created_at).toLocaleString()}</p>
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
                  <p><span className="font-medium">Contact:</span> {validationResult.qrCode.phone}</p>
                  <p><span className="font-medium">Created:</span> {new Date(validationResult.qrCode.created_at).toLocaleString()}</p>
                  {validationResult.qrCode.used_at && (
                    <p><span className="font-medium">Used:</span> {new Date(validationResult.qrCode.used_at).toLocaleString()}</p>
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