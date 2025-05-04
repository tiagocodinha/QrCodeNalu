import React from 'react';
import { WavesIcon } from 'lucide-react';

interface NaluLogoProps {
  size?: 'small' | 'medium' | 'large';
}

const NaluLogo: React.FC<NaluLogoProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-4xl'
  };

  return (
    <div className="flex items-center gap-2">
      <WavesIcon 
        className="text-blue-500" 
        size={size === 'small' ? 24 : size === 'medium' ? 32 : 40} 
      />
      <h1 className={`font-bold ${sizeClasses[size]} text-blue-600`}>
        Nalu Beach Club
      </h1>
    </div>
  );
};

export default NaluLogo;