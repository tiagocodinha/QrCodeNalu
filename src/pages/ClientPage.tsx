import React from 'react';
import { Link } from 'react-router-dom';
import NaluLogo from '../components/NaluLogo';
import ClientForm from '../components/ClientForm';

const ClientPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Background waves */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <img src="/src/assets/waves.svg" alt="" className="w-full" />
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <NaluLogo size="large" />
          <h2 className="mt-4 text-xl text-blue-800 font-medium">
            50% Off Your First Drink
          </h2>
        </div>
        
        <div className="max-w-md mx-auto">
          <ClientForm />
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500 max-w-md mx-auto">
          <p>
            By submitting this form, you agree to receive promotional messages from Nalu Beach Club.
            You can unsubscribe at any time.
          </p>
          <Link 
            to="/admin/login" 
            className="mt-8 inline-block text-[10px] text-gray-400 hover:text-gray-500 transition-colors"
          >
            Staff Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;