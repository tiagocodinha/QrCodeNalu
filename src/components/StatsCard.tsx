import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title,
  value,
  icon,
  color,
  subtitle
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bgLight: 'bg-blue-100',
          bgDark: 'bg-blue-600',
          text: 'text-blue-600'
        };
      case 'green':
        return {
          bgLight: 'bg-green-100',
          bgDark: 'bg-green-600',
          text: 'text-green-600'
        };
      case 'amber':
        return {
          bgLight: 'bg-amber-100',
          bgDark: 'bg-amber-600',
          text: 'text-amber-600'
        };
      case 'purple':
        return {
          bgLight: 'bg-purple-100',
          bgDark: 'bg-purple-600',
          text: 'text-purple-600'
        };
      default:
        return {
          bgLight: 'bg-gray-100',
          bgDark: 'bg-gray-600',
          text: 'text-gray-600'
        };
    }
  };
  
  const colorClasses = getColorClasses();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${colorClasses.bgLight} mr-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      </div>
      
      <div className="mt-2">
        <div className={`text-3xl font-bold ${colorClasses.text}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;