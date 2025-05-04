import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface QrCode {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  used_at: string | null;
  is_used: boolean;
}

interface DataContextType {
  qrCodes: QrCode[];
  addQrCode: (name: string, phone: string) => Promise<QrCode | null>;
  validateQrCode: (id: string) => Promise<{ isValid: boolean; message: string }>;
  getQrCodeById: (id: string) => Promise<QrCode | undefined>;
  getStatistics: () => {
    total: number;
    used: number;
    unused: number;
    lastWeekGenerated: number;
    lastWeekUsed: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);

  // Load data from Supabase on mount
  useEffect(() => {
    const fetchQrCodes = async () => {
      try {
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setQrCodes(data || []);
      } catch (error) {
        console.error('Error fetching QR codes:', error);
        toast.error('Failed to load QR codes');
      }
    };

    fetchQrCodes();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('qr_codes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'qr_codes' }, (payload) => {
        // Refresh the QR codes list when changes occur
        fetchQrCodes();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addQrCode = async (name: string, phone: string): Promise<QrCode | null> => {
    try {
      const newCode = {
        id: uuidv4(),
        name,
        phone,
        created_at: new Date().toISOString(),
        used_at: null,
        is_used: false
      };

      const { data, error } = await supabase
        .from('qr_codes')
        .insert([newCode])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setQrCodes(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding QR code:', error);
      toast.error('Failed to generate QR code');
      return null;
    }
  };

  const validateQrCode = async (id: string): Promise<{ isValid: boolean; message: string }> => {
    try {
      // First check if the QR code exists and its status
      const { data: qrCode, error: fetchError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !qrCode) {
        return { isValid: false, message: 'QR code not found' };
      }

      if (qrCode.is_used) {
        return { isValid: false, message: 'QR code has already been used' };
      }

      // Mark as used
      const { error: updateError } = await supabase
        .from('qr_codes')
        .update({
          is_used: true,
          used_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setQrCodes(prev =>
        prev.map(code =>
          code.id === id
            ? { ...code, is_used: true, used_at: new Date().toISOString() }
            : code
        )
      );

      return { isValid: true, message: 'Valid - discount applied' };
    } catch (error) {
      console.error('Error validating QR code:', error);
      toast.error('Failed to validate QR code');
      return { isValid: false, message: 'Error validating QR code' };
    }
  };

  const getQrCodeById = async (id: string): Promise<QrCode | undefined> => {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching QR code:', error);
      return undefined;
    }
  };

  const getStatistics = () => {
    const total = qrCodes.length;
    const used = qrCodes.filter(code => code.is_used).length;
    const unused = total - used;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();
    
    const lastWeekGenerated = qrCodes.filter(code => code.created_at >= oneWeekAgoISO).length;
    const lastWeekUsed = qrCodes.filter(code => code.is_used && code.used_at && code.used_at >= oneWeekAgoISO).length;
    
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