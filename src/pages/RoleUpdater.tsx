
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminRoleUpdater from '@/components/admin/AdminRoleUpdater';

const RoleUpdater = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Role Updater</h1>
          <p className="text-center text-gray-600 mb-8">
            Use this page to check and update your user role to admin so you can access the admin dashboard.
          </p>
          <AdminRoleUpdater />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoleUpdater;
