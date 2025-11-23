"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Clock, TrendingUp, DollarSign, LogOut, Menu, X, Calendar, Target, Users, ArrowLeft } from 'lucide-react';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { User, Attendance } from '@/lib/supabaseClient';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({
    monthlySales: 0,
    weeklySales: 0,
    totalVisits: 0,
    clientsContacted: 0,
    clientsAccepted: 0,
    acceptanceRate: 0,
    totalProfit: 0,
    recentSales: [] as any[],
    salesTrend: [] as any[],
    monthlyGoal: 500000, // Default goal
    goalProgress: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadStats();
      checkTodayAttendance();
    }
  }, [user]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'employee') {
      router.push('/login?role=employee');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  };

  const checkTodayAttendance = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (data) {
      setAttendance(data);
      setIsLoggedIn(!!data.login_time && !data.logout_time);
    }
  };

  const loadStats = async () => {
    if (!user) return;
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

      // Monthly sales with profit
      const { data: monthlySales } = await supabase
        .from('sales_records')
        .select('*')
        .eq('employee_id', user.id)
        .gte('sale_date', startOfMonth.toISOString().split('T')[0]);

      const monthlyTotal = monthlySales?.reduce((sum, sale) => sum + (Number(sale.price) || 0), 0) || 0;
      const monthlyProfit = monthlySales?.reduce((sum, sale) => sum + (Number(sale.profit) || 0), 0) || 0;

      // Weekly sales - fix date calculation
      const nowForWeek = new Date();
      const dayOfWeek = nowForWeek.getDay();
      const diff = nowForWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
      const startOfWeekDate = new Date(nowForWeek.setDate(diff));
      startOfWeekDate.setHours(0, 0, 0, 0);

      const { data: weeklySales } = await supabase
        .from('sales_records')
        .select('*')
        .eq('employee_id', user.id)
        .gte('sale_date', startOfWeekDate.toISOString().split('T')[0]);

      const weeklyTotal = weeklySales?.reduce((sum, sale) => sum + (Number(sale.price) || 0), 0) || 0;

      // Recent sales (last 10)
      const { data: recentSales } = await supabase
        .from('sales_records')
        .select('*')
        .eq('employee_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Sales trend (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      // Get all sales for trend calculation (last 7 days)
      const { data: allSalesForTrend, error: trendError } = await supabase
        .from('sales_records')
        .select('*')
        .eq('employee_id', user.id)
        .gte('sale_date', last7Days[0])
        .lte('sale_date', last7Days[last7Days.length - 1]);

      if (trendError) {
        console.error('Error loading sales trend:', trendError);
      }

      console.log('Sales trend data:', allSalesForTrend?.length || 0, 'sales found');

      const salesTrend = last7Days.map(date => {
        const daySales = allSalesForTrend?.filter(s => {
          if (!s.sale_date) return false;
          let saleDateStr: string;
          if (typeof s.sale_date === 'string') {
            saleDateStr = s.sale_date.split('T')[0].split(' ')[0];
          } else {
            saleDateStr = new Date(s.sale_date).toISOString().split('T')[0];
          }
          return saleDateStr === date;
        }) || [];
        
        const revenue = daySales.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
        
        return {
          date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          sales: daySales.length,
          revenue: revenue,
        };
      });

      console.log('Sales trend calculated:', salesTrend);

      // Client interactions
      const { data: interactions } = await supabase
        .from('client_interactions')
        .select('*')
        .eq('employee_id', user.id);

      const contacted = interactions?.filter(i => i.status === 'contacted').length || 0;
      const accepted = interactions?.filter(i => i.status === 'accepted').length || 0;
      const visits = interactions?.reduce((sum, i) => sum + (i.visits || 0), 0) || 0;

      const monthlyGoal = 500000; // Can be made dynamic later
      const goalProgress = monthlyGoal > 0 ? (monthlyTotal / monthlyGoal) * 100 : 0;

      setStats({
        monthlySales: monthlyTotal,
        weeklySales: weeklyTotal,
        totalVisits: visits,
        clientsContacted: contacted,
        clientsAccepted: accepted,
        acceptanceRate: contacted > 0 ? (accepted / contacted) * 100 : 0,
        totalProfit: monthlyProfit,
        recentSales: recentSales || [],
        salesTrend: salesTrend,
        monthlyGoal: monthlyGoal,
        goalProgress: goalProgress > 100 ? 100 : goalProgress,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogin = async () => {
    if (!user) return;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { data: city } = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
      ).then(res => res.json()).catch(() => ({ city: 'Unknown' }));

      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('attendance')
        .upsert({
          user_id: user.id,
          date: today,
          login_time: new Date().toISOString(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: city.city || 'Unknown',
        }, {
          onConflict: 'user_id,date',
        });

      if (!error) {
        checkTodayAttendance();
      }
    } catch (error) {
      alert('Failed to get location. Please enable location services.');
    }
  };

  const handleLogout = async () => {
    if (!user || !attendance) return;
    try {
      const logoutTime = new Date().toISOString();
      const loginTime = new Date(attendance.login_time!);
      const totalHours = (new Date(logoutTime).getTime() - new Date(loginTime).getTime()) / (1000 * 60 * 60);

      await supabase
        .from('attendance')
        .update({
          logout_time: logoutTime,
          total_hours: totalHours,
        })
        .eq('id', attendance.id);

      checkTodayAttendance();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAppLogout = async () => {
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
          <p className="text-sm text-gray-400 mt-1">Employee Portal</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/employee/dashboard"
            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white"
          >
            <TrendingUp size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/employee/products"
            className="flex items-center space-x-3 p-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Car size={20} />
            <span>Products</span>
          </Link>
          <Link
            href="/employee/attendance"
            className="flex items-center space-x-3 p-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Calendar size={20} />
            <span>Attendance</span>
          </Link>
          <Link
            href="/favorites"
            className="flex items-center space-x-3 p-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Target size={20} />
            <span>Favorites</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
          <button
            onClick={handleAppLogout}
            className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              {user?.name} • {user?.experience_years || 0} years experience
            </span>
          </div>
        </header>

        <main className="p-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-8">Employee Dashboard</h1>

            {/* Attendance Card */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Clock size={24} className="text-red-500" />
                <span>Today's Attendance</span>
              </h2>
              {!isLoggedIn ? (
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all"
                >
                  Mark Login
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Login Time:</span>
                    <span className="text-white">
                      {attendance?.login_time ? new Date(attendance.login_time).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                  {attendance?.logout_time && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Logout Time:</span>
                      <span className="text-white">
                        {new Date(attendance.logout_time).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {attendance?.total_hours && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Hours:</span>
                      <span className="text-white">{attendance.total_hours.toFixed(2)} hrs</span>
                    </div>
                  )}
                  {!attendance?.logout_time && (
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
                    >
                      Mark Logout
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <DollarSign className="text-green-500 mb-4" size={32} />
                <p className="text-gray-400 mb-2">Monthly Sales</p>
                <p className="text-3xl font-bold">₹{stats.monthlySales.toLocaleString()}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <TrendingUp className="text-blue-500 mb-4" size={32} />
                <p className="text-gray-400 mb-2">Weekly Sales</p>
                <p className="text-3xl font-bold">₹{stats.weeklySales.toLocaleString()}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <Users className="text-purple-500 mb-4" size={32} />
                <p className="text-gray-400 mb-2">Client Visits</p>
                <p className="text-3xl font-bold">{stats.totalVisits}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <Target className="text-yellow-500 mb-4" size={32} />
                <p className="text-gray-400 mb-2">Acceptance Rate</p>
                <p className="text-3xl font-bold">{stats.acceptanceRate.toFixed(1)}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <Users className="text-cyan-500 mb-4" size={32} />
                <p className="text-gray-400 mb-2">Clients Contacted</p>
                <p className="text-3xl font-bold">{stats.clientsContacted}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <Users className="text-green-500 mb-4" size={32} />
                <p className="text-gray-400 mb-2">Clients Accepted</p>
                <p className="text-3xl font-bold">{stats.clientsAccepted}</p>
              </motion.div>
            </div>

            {/* Goal Progress & Recent Sales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Monthly Goal Progress */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Target size={24} className="text-yellow-500" />
                  <span>Monthly Goal Progress</span>
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Target: ₹{stats.monthlyGoal.toLocaleString('en-IN')}</span>
                      <span className="text-white font-semibold">{stats.goalProgress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.goalProgress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${
                          stats.goalProgress >= 100 ? 'bg-green-500' :
                          stats.goalProgress >= 75 ? 'bg-yellow-500' :
                          stats.goalProgress >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      Current: ₹{stats.monthlySales.toLocaleString('en-IN')} • Profit: ₹{stats.totalProfit.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Sales */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <TrendingUp size={24} className="text-green-500" />
                  <span>Recent Sales</span>
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                  {stats.recentSales.length > 0 ? (
                    stats.recentSales.map((sale, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg min-h-[60px] w-full">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-sm text-slate-400 mb-1">
                            {sale.type === 'vehicle' ? '🚗 Vehicle' : '🔧 Spare Part'}
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
                    <p className="text-slate-400 text-center py-4">No sales yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sales Trend Chart */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
              <h2 className="text-xl font-bold mb-4">Sales Trend (Last 7 Days)</h2>
              {stats.salesTrend.length > 0 ? (
                <div className="grid grid-cols-7 gap-2">
                  {stats.salesTrend.map((day, idx) => {
                    const maxRevenue = Math.max(...stats.salesTrend.map(d => d.revenue || 0), 1);
                    const heightPercent = day.revenue > 0 
                      ? Math.min((day.revenue / maxRevenue) * 100, 100) 
                      : 0;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-full bg-slate-700 rounded-t-lg relative h-32 flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`w-full rounded-t-lg ${
                              heightPercent > 0 
                                ? 'bg-gradient-to-t from-indigo-600 to-purple-600' 
                                : 'bg-slate-600'
                            }`}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-center">{day.date}</p>
                        <p className="text-xs text-white font-semibold">{day.sales} sales</p>
                        <p className="text-xs text-green-400">₹{(day.revenue / 1000).toFixed(0)}K</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>No sales data available for the last 7 days</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/employee/products"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <Car size={32} className="mx-auto mb-2 text-indigo-500" />
                  <span>View Products</span>
                </Link>
                <Link
                  href="/employee/attendance"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <Calendar size={32} className="mx-auto mb-2 text-blue-500" />
                  <span>Attendance</span>
                </Link>
                <Link
                  href="/favorites"
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-center"
                >
                  <Target size={32} className="mx-auto mb-2 text-red-500" />
                  <span>My Favorites</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

