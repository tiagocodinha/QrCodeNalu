import React, { useState } from 'react';
import { useData, QrCode } from '../contexts/DataContext';
import { saveAs } from 'file-saver';
import { Download, Search, CheckCircle, XCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const QrCodeTable: React.FC = () => {
  const { qrCodes } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUsed, setFilterUsed] = useState<boolean | null>(null);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard');
  };
  
  // Export to CSV
  const exportToCSV = () => {
    // Create CSV headers
    const headers = ['QR Code ID', 'Name', 'Contact', 'Created Date', 'Status', 'Used Date'];
    
    // Convert data to CSV format
    const csvData = qrCodes.map(code => [
      code.id,
      code.name,
      code.contact,
      new Date(code.createdAt).toLocaleString(),
      code.isUsed ? 'Used' : 'Not Used',
      code.usedAt ? new Date(code.usedAt).toLocaleString() : ''
    ]);
    
    // Combine headers and data
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `nalu-qrcodes-${new Date().toISOString().slice(0, 10)}.csv`);
  };
  
  // Filter and sort QR codes
  const filteredCodes = qrCodes
    .filter(code => {
      // Filter by search term
      const matchesSearch = 
        code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by used/unused status
      const matchesStatus = 
        filterUsed === null || 
        code.isUsed === filterUsed;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">QR Code List</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          
          <select
            value={filterUsed === null ? 'all' : filterUsed ? 'used' : 'unused'}
            onChange={(e) => {
              if (e.target.value === 'all') setFilterUsed(null);
              else if (e.target.value === 'used') setFilterUsed(true);
              else setFilterUsed(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Codes</option>
            <option value="used">Used Only</option>
            <option value="unused">Unused Only</option>
          </select>
          
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Code ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Used
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCodes.length > 0 ? (
              filteredCodes.map((code: QrCode) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {code.isUsed ? (
                      <span className="flex items-center">
                        <CheckCircle size={18} className="text-green-500 mr-2" />
                        <span className="text-green-600 font-medium">Used</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <XCircle size={18} className="text-blue-500 mr-2" />
                        <span className="text-blue-600 font-medium">Unused</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{code.id}</span>
                      <button
                        onClick={() => copyToClipboard(code.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy code"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{code.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{code.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(code.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {code.usedAt ? new Date(code.usedAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No QR codes found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredCodes.length} of {qrCodes.length} total codes
      </div>
    </div>
  );
};

export default QrCodeTable;