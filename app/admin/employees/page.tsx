"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Users, LogOut, Menu, X, TrendingUp, DollarSign, Calendar, BarChart3, Package, ArrowLeft } from 'lucide-react';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/lib/supabaseClient';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminEmployees() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [employeeStats, setEmployeeStats] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadEmployees();
    }
  }, [user]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login?role=admin');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  };

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'employee')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      console.error('Error loading employees:', error);
    }
  };

  const loadEmployeeStats = async (employeeId: string) => {
    try {
      // Get sales stats
      const { data: sales } = await supabase
        .from('sales_records')
        .select('*')
        .eq('employee_id', employeeId);

      // Get attendance stats
      const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', employeeId);

      // Get client interactions
      const { data: interactions } = await supabase
        .from('client_interactions')
        .select('*')
        .eq('employee_id', employeeId);

      const totalSales = sales?.length || 0;
      const totalRevenue = sales?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
      const totalProfit = sales?.reduce((sum, s) => sum + (s.profit || 0), 0) || 0;
      const totalHours = attendance?.reduce((sum, a) => sum + (a.total_hours || 0), 0) || 0;
      const clientsContacted = interactions?.filter(i => i.status === 'contacted').length || 0;
      const clientsAccepted = interactions?.filter(i => i.status === 'accepted').length || 0;

      setEmployeeStats({
        totalSales,
        totalRevenue,
        totalProfit,
        totalHours,
        clientsContacted,
        clientsAccepted,
        acceptanceRate: clientsContacted > 0 ? (clientsAccepted / clientsContacted * 100).toFixed(1) : 0,
      });
    } catch (error: any) {
      console.error('Error loading employee stats:', error);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logoutUser();
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

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
          <p className="text-sm text-slate-400 mt-1">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/employees" className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
            <Users size={20} />
            <span>Employees</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <TrendingUp size={20} />
            <span>Analytics</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="bg-slate-800 border-b border-slate-700 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold">Employee Management</h1>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Employees List */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4">All Employees ({employees.length})</h2>
                <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thin">
                  {employees.map((emp) => (
                    <motion.div
                      key={emp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        loadEmployeeStats(emp.id);
                        // Scroll to details panel only if it's not visible
                        setTimeout(() => {
                          const detailsPanel = document.getElementById('employee-details-panel');
                          if (detailsPanel) {
                            const rect = detailsPanel.getBoundingClientRect();
                            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                            if (!isVisible) {
                              detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                          }
                        }, 100);
                      }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedEmployee?.id === emp.id
                          ? 'bg-indigo-600/20 border-indigo-500'
                          : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{emp.name || 'Unknown'}</h3>
                          <p className="text-slate-400 text-sm">{emp.email}</p>
                          <p className="text-slate-400 text-sm mt-1">
                            Experience: {emp.experience_years || 0} years
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">Joined</p>
                          <p className="text-sm">
                            {emp.created_at ? new Date(emp.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Employee Details */}
            <div id="employee-details-panel" className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start">
              {selectedEmployee && employeeStats ? (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{selectedEmployee.name}</h3>
                    <p className="text-slate-400 text-sm">{selectedEmployee.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Total Sales</p>
                      <p className="text-2xl font-bold">{employeeStats.totalSales}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Revenue</p>
                      <p className="text-2xl font-bold">₹{(employeeStats.totalRevenue / 100000).toFixed(1)}L</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Total Hours</p>
                      <p className="text-2xl font-bold">{employeeStats.totalHours.toFixed(1)}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Acceptance Rate</p>
                      <p className="text-2xl font-bold">{employeeStats.acceptanceRate}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Clients Contacted</span>
                      <span className="font-semibold">{employeeStats.clientsContacted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Clients Accepted</span>
                      <span className="font-semibold">{employeeStats.clientsAccepted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Profit</span>
                      <span className="font-semibold">₹{employeeStats.totalProfit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center text-slate-400">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select an employee to view details</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

