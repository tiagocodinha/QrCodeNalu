import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { QrCode } from '../contexts/DataContext';

interface QrCodeDisplayProps {
  qrCode: QrCode;
  onReset: (() => void) | null;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ qrCode, onReset }) => {
  const downloadQrCode = () => {
    const canvas = document.createElement('canvas');
    const qrCodeElement = document.querySelector('.qrcode');
    
    if (!qrCodeElement) {
      console.error('QR code element not found');
      return;
    }
    
    const svgData = new XMLSerializer().serializeToString(qrCodeElement);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Canvas context not available');
        return;
      }
      
      // Draw white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `nalu-discount-${qrCode.id}.png`);
        }
      });
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Your Discount QR Code</h2>
      
      <p className="text-gray-600 mb-6">
        Present this QR code at Nalu Beach Club to receive 50% off your first drink!
      </p>
      
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <QRCodeSVG
            value={qrCode.id}
            size={200}
            level="H"
            className="qrcode"
            includeMargin={true}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={downloadQrCode}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
        >
          <Download size={20} />
          Download QR Code
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>This QR code can only be used once.</p>
        <p>No need to print - just show it on your device!</p>
      </div>
    </div>
  );
};

export default QrCodeDisplay;