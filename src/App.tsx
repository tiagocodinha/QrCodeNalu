import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Pages
import ClientPage from './pages/ClientPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import VerifyQrCode from './pages/VerifyQrCode';
import Statistics from './pages/Statistics';
import QrCodeList from './pages/QrCodeList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-white">
            <Routes>
              {/* Client Routes */}
              <Route path="/" element={<ClientPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/verify" 
                element={
                  <ProtectedRoute>
                    <VerifyQrCode />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/codes" 
                element={
                  <ProtectedRoute>
                    <QrCodeList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/statistics" 
                element={
                  <ProtectedRoute>
                    <Statistics />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-center" />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;