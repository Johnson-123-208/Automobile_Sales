"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Users, TrendingUp, DollarSign, LogOut, Menu, X, BarChart3, Package, Settings, Heart, ArrowLeft } from 'lucide-react';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/lib/supabaseClient';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalVehicles: 0,
    totalSpareParts: 0,
    totalProfit: 0,
    avgSalePrice: 0,
    recentSales: [] as any[],
    topEmployees: [] as any[],
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login?role=admin');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      // Get total employees
      const { count: employeeCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'employee');

      // Get total sales
      const { count: salesCount } = await supabase
        .from('sales_records')
        .select('*', { count: 'exact', head: true });

      // Get sales data with more details
      const { data: sales } = await supabase
        .from('sales_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const revenue = sales?.reduce((sum, sale) => sum + (sale.price || 0), 0) || 0;
      const profit = sales?.reduce((sum, sale) => sum + (sale.profit || 0), 0) || 0;
      const avgSalePrice = sales && sales.length > 0 ? revenue / sales.length : 0;

      // Get top employees by sales
      const { data: allSales } = await supabase
        .from('sales_records')
        .select('employee_id, price');

      const employeeSales: { [key: string]: { count: number; revenue: number } } = {};
      allSales?.forEach(sale => {
        if (!employeeSales[sale.employee_id]) {
          employeeSales[sale.employee_id] = { count: 0, revenue: 0 };
        }
        employeeSales[sale.employee_id].count++;
        employeeSales[sale.employee_id].revenue += sale.price || 0;
      });

      const topEmployeesList = Object.entries(employeeSales)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5)
        .map(([id, data]) => ({ id, ...data }));

      // Get employee names
      const employeeIds = topEmployeesList.map(e => e.id);
      const { data: employees } = await supabase
        .from('users')
        .select('id, name')
        .in('id', employeeIds);

      const topEmployees = topEmployeesList.map(emp => ({
        ...emp,
        name: employees?.find(e => e.id === emp.id)?.name || 'Unknown',
      }));

      // Get total vehicles
      const { count: vehicleCount } = await supabase
        .from('vehicle_products')
        .select('*', { count: 'exact', head: true });

      // Get total spare parts
      const { count: partsCount } = await supabase
        .from('spare_parts')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalEmployees: employeeCount || 0,
        totalSales: salesCount || 0,
        totalRevenue: revenue,
        totalVehicles: vehicleCount || 0,
        totalSpareParts: partsCount || 0,
        totalProfit: profit,
        avgSalePrice: avgSalePrice,
        recentSales: sales || [],
        topEmployees: topEmployees,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Employees', value: stats.totalEmployees, color: 'blue' },
    { icon: TrendingUp, label: 'Total Sales', value: stats.totalSales, color: 'green' },
    { icon: DollarSign, label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, color: 'yellow' },
    { icon: DollarSign, label: 'Total Profit', value: `₹${(stats.totalProfit / 100000).toFixed(1)}L`, color: 'green' },
    { icon: Car, label: 'Vehicles', value: stats.totalVehicles, color: 'red' },
    { icon: Package, label: 'Spare Parts', value: stats.totalSpareParts, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-40 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <Car className="text-indigo-400" size={32} />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              JEN Automobiles
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white"
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/employees"
            className="flex items-center space-x-3 p-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Users size={20} />
            <span>Employees</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center space-x-3 p-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center space-x-3 p-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <TrendingUp size={20} />
            <span>Analytics</span>
          </Link>
          <Link
            href="/favorites"
            className="flex items-center space-x-3 p-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Heart size={20} />
            <span>Favorites</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <span className="text-gray-300">Welcome, {user?.name || 'Admin'}</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-red-500 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`text-${stat.color}-500`} size={32} />
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Sales & Top Employees */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Sales */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Recent Sales</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                  {stats.recentSales.length > 0 ? (
                    stats.recentSales.map((sale, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg min-h-[60px] w-full">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-sm text-slate-400 mb-1">
                            {sale.type === 'vehicle' ? 'Vehicle' : 'Spare Part'}
                          </p>
                          <p className="text-white font-semibold text-base">
                            ₹{sale.price?.toLocaleString('en-IN') || 0}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-auto">
                          <p className="text-xs text-slate-400 mb-1 whitespace-nowrap">
                            {sale.sale_date ? new Date(sale.sale_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </p>
                          <p className="text-green-400 text-sm font-semibold whitespace-nowrap">
                            +₹{sale.profit?.toLocaleString('en-IN') || 0}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-4">No recent sales</p>
                  )}
                </div>
              </div>

              {/* Top Employees */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Top Performers</h2>
                <div className="space-y-3">
                  {stats.topEmployees.length > 0 ? (
                    stats.topEmployees.map((emp, idx) => (
                      <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{emp.name}</p>
                            <p className="text-xs text-slate-400">{emp.count} sales</p>
                          </div>
                        </div>
                        <p className="text-green-400 font-semibold">₹{(emp.revenue / 1000).toFixed(0)}K</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-center py-4">No data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/employees"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <Users size={32} className="mx-auto mb-2 text-blue-500" />
                  <span>Manage Employees</span>
                </Link>
                <Link
                  href="/admin/products"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <Package size={32} className="mx-auto mb-2 text-purple-500" />
                  <span>Manage Products</span>
                </Link>
                <Link
                  href="/admin/analytics"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <TrendingUp size={32} className="mx-auto mb-2 text-green-500" />
                  <span>View Analytics</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your dashboard."
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonColor="from-red-600 to-red-700"
      />
    </div>
  );
}

