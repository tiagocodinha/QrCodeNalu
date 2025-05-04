import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface QrCode {
  id: string;
  name: string;
  contact: string;
  createdAt: string;
  usedAt: string | null;
  isUsed: boolean;
}

interface DataContextType {
  qrCodes: QrCode[];
  addQrCode: (name: string, contact: string) => QrCode;
  validateQrCode: (id: string) => { isValid: boolean; message: string };
  getQrCodeById: (id: string) => QrCode | undefined;
  getStatistics: () => {
    total: number;
    used: number;
    unused: number;
    lastWeekGenerated: number;
    lastWeekUsed: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'nalu_qrcodes';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setQrCodes(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved QR codes:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(qrCodes));
  }, [qrCodes]);

  const addQrCode = (name: string, contact: string): QrCode => {
    const newCode: QrCode = {
      id: uuidv4(),
      name,
      contact,
      createdAt: new Date().toISOString(),
      usedAt: null,
      isUsed: false
    };
    
    setQrCodes(prev => [...prev, newCode]);
    return newCode;
  };

  const validateQrCode = (id: string): { isValid: boolean; message: string } => {
    const qrCode = qrCodes.find(code => code.id === id);
    
    if (!qrCode) {
      return { isValid: false, message: 'QR code not found' };
    }
    
    if (qrCode.isUsed) {
      return { isValid: false, message: 'QR code has already been used' };
    }
    
    // Mark as used
    setQrCodes(prev => 
      prev.map(code => 
        code.id === id 
          ? { ...code, isUsed: true, usedAt: new Date().toISOString() } 
          : code
      )
    );
    
    return { isValid: true, message: 'Valid - discount applied' };
  };

  const getQrCodeById = (id: string): QrCode | undefined => {
    return qrCodes.find(code => code.id === id);
  };

  const getStatistics = () => {
    const total = qrCodes.length;
    const used = qrCodes.filter(code => code.isUsed).length;
    const unused = total - used;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();
    
    const lastWeekGenerated = qrCodes.filter(code => code.createdAt >= oneWeekAgoISO).length;
    const lastWeekUsed = qrCodes.filter(code => code.isUsed && code.usedAt && code.usedAt >= oneWeekAgoISO).length;
    
    return {
      total,
      used,
      unused,
      lastWeekGenerated,
      lastWeekUsed
    };
  };

  return (
    <DataContext.Provider value={{ 
      qrCodes, 
      addQrCode, 
      validateQrCode, 
      getQrCodeById,
      getStatistics
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};