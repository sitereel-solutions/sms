import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/ToastContainer';
import { PaymentReceiptModal } from '../modals/PaymentReceiptModal';
import { QuickPayModal } from '../modals/QuickPayModal';
import { ExpenseDetailModal } from '../modals/ExpenseDetailModal';
import { FlatDetailModal } from '../modals/FlatDetailModal';
import { ResidentDetailModal } from '../modals/ResidentDetailModal';
import { NoticeDetailModal } from '../modals/NoticeDetailModal';
import { ComplaintDetailModal } from '../modals/ComplaintDetailModal';
import { GlobalSearchModal } from '../modals/GlobalSearchModal';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0 transition-all duration-200">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <PaymentReceiptModal />
      <QuickPayModal />
      <ExpenseDetailModal />
      <FlatDetailModal />
      <ResidentDetailModal />
      <NoticeDetailModal />
      <ComplaintDetailModal />
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};
