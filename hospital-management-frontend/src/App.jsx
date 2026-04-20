import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AdminDoctorLogin from './pages/auth/AdminDoctorLogin';
import PatientLogin from './pages/auth/PatientLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import './index.css';

const AppRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = ['/login', '/admin-login'].includes(location.pathname);

  return (
    <>
      {user && !isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/admin-login" element={<AdminDoctorLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to={user ? `/${user.role?.toLowerCase()}` : '/login'} />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
