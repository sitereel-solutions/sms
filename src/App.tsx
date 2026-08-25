import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SocietyProvider } from './context/SocietyContext';
import { LoginPage } from './pages/auth/LoginPage';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Super Admin SaaS Platform Page
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';

// Admin Pages
import { DashboardPage } from './pages/admin/DashboardPage';
import { FlatsPage } from './pages/admin/FlatsPage';
import { ResidentsPage } from './pages/admin/ResidentsPage';
import { MaintenancePage } from './pages/admin/MaintenancePage';
import { PaymentsPage } from './pages/admin/PaymentsPage';
import { ExpensesPage } from './pages/admin/ExpensesPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { NoticesPage } from './pages/admin/NoticesPage';
import { ComplaintsPage } from './pages/admin/ComplaintsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Resident Pages
import { ResidentDashboardPage } from './pages/resident/ResidentDashboardPage';
import { ResidentMyFlatPage } from './pages/resident/ResidentMyFlatPage';
import { ResidentMaintenancePage } from './pages/resident/ResidentMaintenancePage';
import { ResidentPaymentsPage } from './pages/resident/ResidentPaymentsPage';
import { ResidentNoticesPage } from './pages/resident/ResidentNoticesPage';
import { ResidentComplaintsPage } from './pages/resident/ResidentComplaintsPage';
import { ResidentProfilePage } from './pages/resident/ResidentProfilePage';

export const App: React.FC = () => {
  return (
    <SocietyProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Super Admin SaaS Route (Strictly ROLE_SUPER_ADMIN) */}
          <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
            <Route path="/super-admin" element={<MainLayout />}>
              <Route index element={<SuperAdminDashboard />} />
            </Route>
          </Route>

          {/* Society Admin Routes (ROLE_ADMIN & ROLE_SUPER_ADMIN) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="flats" element={<FlatsPage />} />
              <Route path="residents" element={<ResidentsPage />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="notices" element={<NoticesPage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Resident Routes (ROLE_RESIDENT, ROLE_ADMIN, ROLE_SUPER_ADMIN) */}
          <Route element={<ProtectedRoute allowedRoles={['resident', 'admin', 'super_admin']} />}>
            <Route path="/resident" element={<MainLayout />}>
              <Route index element={<ResidentDashboardPage />} />
              <Route path="my-flat" element={<ResidentMyFlatPage />} />
              <Route path="maintenance" element={<ResidentMaintenancePage />} />
              <Route path="payments" element={<ResidentPaymentsPage />} />
              <Route path="notices" element={<ResidentNoticesPage />} />
              <Route path="complaints" element={<ResidentComplaintsPage />} />
              <Route path="profile" element={<ResidentProfilePage />} />
            </Route>
          </Route>

          {/* Fallback to Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </SocietyProvider>
  );
};

export default App;
