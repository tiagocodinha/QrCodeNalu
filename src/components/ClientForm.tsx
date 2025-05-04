import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';
import QrCodeDisplay from './QrCodeDisplay';

const ClientForm: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [generatedQrCode, setGeneratedQrCode] = useState<any>(null);
  const { addQrCode } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !contact.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s-()]{8,}$/;
    if (!phoneRegex.test(contact.trim())) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    try {
      const newQrCode = addQrCode(name.trim(), contact.trim());
      setGeneratedQrCode(newQrCode);
      setFormSubmitted(true);
      toast.success('QR code generated successfully!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  if (formSubmitted && generatedQrCode) {
    return <QrCodeDisplay qrCode={generatedQrCode} onReset={null} />;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Get 50% Off Your First Drink!</h2>
      
      <p className="text-gray-600 mb-6">
        Enter your details to receive a special QR code for 50% off your first drink at Nalu Beach Club.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
            required
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Generate My Discount
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;