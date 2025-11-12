import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoginPage from './pages/LoginPage';
import ServerDashboardPage from './pages/ServerDashboardPage';
import BeneficiaryPortalPage from './pages/BeneficiaryPortalPage';
import SecretaryDashboardPage from './pages/SecretaryDashboardPage';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import BeneficiaryListPage from './pages/admin/BeneficiaryListPage';
import BeneficiaryProfilePage from './pages/admin/BeneficiaryProfilePage';
import ProgramManagementPage from './pages/admin/ProgramManagementPage';
import NewsPage from './pages/news/NewsPage';
import SingleNewsPage from './pages/news/SingleNewsPage';
import SchedulePage from './pages/schedule/SchedulePage';
import ReportsPage from './pages/admin/ReportsPage';
import CRASManagementPage from './pages/cras/CRASManagementPage';
import CREASManagementPage from './pages/creas/CREASManagementPage';
import BenefitsManagementPage from './pages/benefits/BenefitsManagementPage';
import IADashboardPage from './pages/ia/IADashboardPage';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {!user ? (
        // Usuário não logado - mostrar apenas rotas públicas
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/news" element={<Layout><NewsPage /></Layout>} />
          <Route path="/news/:id" element={<Layout><SingleNewsPage /></Layout>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        // Usuário logado - rotas baseadas no cargo
        <>
          {user.cargo === 'secretario' && (
            <>
              <Route path="/" element={<Navigate to="/secretary" />} />
              <Route path="/secretary" element={<Layout><SecretaryDashboardPage /></Layout>} />
              <Route path="/admin/beneficiaries" element={<Layout><BeneficiaryListPage /></Layout>} />
              <Route path="/admin/beneficiaries/:id" element={<Layout><BeneficiaryProfilePage /></Layout>} />
              <Route path="/admin/programs" element={<Layout><ProgramManagementPage /></Layout>} />
              <Route path="/admin/reports" element={<Layout><ReportsPage /></Layout>} />
              <Route path="/schedule" element={<Layout><SchedulePage /></Layout>} />
              <Route path="/cras" element={<Layout><CRASManagementPage /></Layout>} />
              <Route path="/creas" element={<Layout><CREASManagementPage /></Layout>} />
              <Route path="/benefits" element={<Layout><BenefitsManagementPage /></Layout>} />
              <Route path="/ia" element={<Layout><IADashboardPage /></Layout>} />
            </>
          )}
          
          {user.cargo === 'servidor' && (
            <>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Layout><ServerDashboardPage /></Layout>} />
              <Route path="/admin/beneficiaries" element={<Layout><BeneficiaryListPage /></Layout>} />
              <Route path="/admin/beneficiaries/:id" element={<Layout><BeneficiaryProfilePage /></Layout>} />
              <Route path="/schedule" element={<Layout><SchedulePage /></Layout>} />
              <Route path="/cras" element={<Layout><CRASManagementPage /></Layout>} />
              <Route path="/creas" element={<Layout><CREASManagementPage /></Layout>} />
              <Route path="/benefits" element={<Layout><BenefitsManagementPage /></Layout>} />
              <Route path="/ia" element={<Layout><IADashboardPage /></Layout>} />
            </>
          )}
          
          {user.cargo === 'beneficiario' && (
            <>
              <Route path="/" element={<Navigate to="/portal" />} />
              <Route path="/portal" element={<Layout><BeneficiaryPortalPage /></Layout>} />
            </>
          )}
          
          {/* Rotas comuns para todos os usuários logados */}
          <Route path="/home" element={<Layout><HomePage /></Layout>} />
          <Route path="/news" element={<Layout><NewsPage /></Layout>} />
          <Route path="/news/:id" element={<Layout><SingleNewsPage /></Layout>} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
