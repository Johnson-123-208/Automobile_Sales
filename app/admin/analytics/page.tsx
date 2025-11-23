"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, BarChart3, TrendingUp, DollarSign, Users, Package, Menu, X, LogOut, Heart, ArrowLeft } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/lib/supabaseClient';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminAnalytics() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProfit: 0,
    avgSalePrice: 0,
    totalEmployees: 0,
    totalVehicles: 0,
    totalSpareParts: 0,
  });
  const [chartData, setChartData] = useState({
    salesOverTime: [] as any[],
    revenueByType: [] as any[],
    topVehicles: [] as any[],
    employeePerformance: [] as any[],
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadAnalytics();
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

  const loadAnalytics = async () => {
    try {
      // Get sales data - get all sales, not just recent ones
      const { data: sales, error: salesError } = await supabase
        .from('sales_records')
        .select('*')
        .order('sale_date', { ascending: false });

      if (salesError) {
        console.error('Error fetching sales:', salesError);
      }

      console.log('Total sales fetched:', sales?.length || 0);
      if (sales && sales.length > 0) {
        console.log('Sample sale:', sales[0]);
        console.log('Sale date type:', typeof sales[0].sale_date);
        console.log('Sale date value:', sales[0].sale_date);
      }

      // Get employees count
      const { count: employeeCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'employee');

      // Get products count
      const { count: vehicleCount } = await supabase
        .from('vehicle_products')
        .select('*', { count: 'exact', head: true });

      const { count: spareCount } = await supabase
        .from('spare_parts')
        .select('*', { count: 'exact', head: true });

      const totalRevenue = sales?.reduce((sum, s) => sum + (Number(s.price) || 0), 0) || 0;
      const totalProfit = sales?.reduce((sum, s) => sum + (Number(s.profit) || 0), 0) || 0;
      const totalSales = sales?.length || 0;
      const avgSalePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

      setStats({
        totalRevenue,
        totalSales,
        totalProfit,
        avgSalePrice,
        totalEmployees: employeeCount || 0,
        totalVehicles: vehicleCount || 0,
        totalSpareParts: spareCount || 0,
      });

      // Prepare chart data
      if (sales && sales.length > 0) {
        // Get all unique sale dates and sort them
        const allSaleDates = sales
          .map(s => {
            if (!s.sale_date) return null;
            let dateStr: string;
            if (typeof s.sale_date === 'string') {
              dateStr = s.sale_date.split('T')[0].split(' ')[0];
            } else {
              dateStr = new Date(s.sale_date).toISOString().split('T')[0];
            }
            return dateStr;
          })
          .filter((d): d is string => d !== null)
          .sort()
          .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

        // Get the most recent 30 days with data, or last 30 calendar days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        
        // Use the most recent date range that has data
        const recentDates = allSaleDates.filter(d => {
          const saleDate = new Date(d);
          saleDate.setHours(0, 0, 0, 0);
          return saleDate >= thirtyDaysAgo && saleDate <= today;
        });

        // If we have sales in the last 30 days, use those dates
        // Otherwise, use the most recent 30 days of sales data
        const datesToUse = recentDates.length > 0 
          ? recentDates.slice(-30) // Last 30 days with data
          : allSaleDates.slice(-30); // Most recent 30 days of sales

        // Create a map of date -> sales for quick lookup
        const salesByDate = new Map<string, typeof sales>();
        sales.forEach(s => {
          if (!s.sale_date) return;
          let dateStr: string;
          if (typeof s.sale_date === 'string') {
            dateStr = s.sale_date.split('T')[0].split(' ')[0];
          } else {
            dateStr = new Date(s.sale_date).toISOString().split('T')[0];
          }
          
          if (!salesByDate.has(dateStr)) {
            salesByDate.set(dateStr, []);
          }
          salesByDate.get(dateStr)!.push(s);
        });

        // Build the chart data
        const salesOverTime = datesToUse.map(dateStr => {
          const daySales = salesByDate.get(dateStr) || [];
          const date = new Date(dateStr);
          
          return {
            date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            sales: daySales.length,
            revenue: daySales.reduce((sum, s) => sum + (Number(s.price) || 0), 0),
          };
        });

        // If we still have no data, create last 30 calendar days with zero values
        if (salesOverTime.length === 0) {
          const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (29 - i));
            return {
              date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
              sales: 0,
              revenue: 0,
            };
          });
          salesOverTime.push(...last30Days);
        }

        console.log('Sales over time data:', salesOverTime.slice(0, 5));
        console.log('Total sales in chart:', salesOverTime.reduce((sum, d) => sum + d.sales, 0));

        // Revenue by type - ensure we have data
        const vehicleSales = sales.filter(s => s.type === 'vehicle');
        const sparePartSales = sales.filter(s => s.type === 'spare_part');
        
        const vehicleRevenue = vehicleSales.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
        const sparePartRevenue = sparePartSales.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
        
        console.log('Vehicle sales count:', vehicleSales.length);
        console.log('Spare part sales count:', sparePartSales.length);
        console.log('Vehicle revenue:', vehicleRevenue);
        console.log('Spare part revenue:', sparePartRevenue);
        console.log('Sample vehicle sale:', vehicleSales[0]);
        console.log('Sample spare part sale:', sparePartSales[0]);
        
        // Only show segments with actual revenue
        const revenueByType = [];
        if (vehicleRevenue > 0) {
          revenueByType.push({
            name: 'Vehicles',
            value: vehicleRevenue,
          });
        }
        if (sparePartRevenue > 0) {
          revenueByType.push({
            name: 'Spare Parts',
            value: sparePartRevenue,
          });
        }
        
        // If no revenue at all, show placeholder
        if (revenueByType.length === 0) {
          revenueByType.push(
            { name: 'Vehicles', value: 1 },
            { name: 'Spare Parts', value: 1 }
          );
        }

        // Top vehicles - fetch actual vehicle names (reuse vehicleSales from above)
        const vehicleIds = [...new Set(vehicleSales.map(s => s.product_id))];
        
        // Fetch vehicle details
        const { data: vehicles } = await supabase
          .from('vehicle_products')
          .select('id, brand, model')
          .in('id', vehicleIds);
        
        const vehicleCounts: { [key: string]: number } = {};
        vehicleSales.forEach(s => {
          vehicleCounts[s.product_id] = (vehicleCounts[s.product_id] || 0) + 1;
        });
        
        const topVehicles = Object.entries(vehicleCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id, count]) => {
            const vehicle = vehicles?.find(v => v.id === id);
            const name = vehicle ? `${vehicle.brand} ${vehicle.model}` : `Vehicle ${id.slice(0, 8)}`;
            return { name, sales: count };
          });

        // Employee performance
        const { data: employees } = await supabase
          .from('users')
          .select('id, name')
          .eq('role', 'employee');

        const employeePerformance = employees?.map(emp => {
          const empSales = sales.filter(s => s.employee_id === emp.id);
          return {
            name: emp.name || 'Unknown',
            sales: empSales.length,
            revenue: empSales.reduce((sum, s) => sum + (Number(s.price) || 0), 0),
          };
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 10) || [];
        
        console.log('Chart data set:', {
          salesOverTimeCount: salesOverTime.length,
          revenueByType,
          topVehiclesCount: topVehicles.length,
          employeePerformanceCount: employeePerformance.length,
        });

        setChartData({
          salesOverTime,
          revenueByType,
          topVehicles,
          employeePerformance,
        });
      } else {
        // If no sales data, show empty/default data for charts
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            sales: 0,
            revenue: 0,
          };
        });

        setChartData({
          salesOverTime: last30Days,
          revenueByType: [
            { name: 'Vehicles', value: 0 },
            { name: 'Spare Parts', value: 0 },
          ],
          topVehicles: [],
          employeePerformance: [],
        });
      }
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      // Set empty data on error
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          sales: 0,
          revenue: 0,
        };
      });

      setChartData({
        salesOverTime: last30Days,
        revenueByType: [
          { name: 'Vehicles', value: 0 },
          { name: 'Spare Parts', value: 0 },
        ],
        topVehicles: [],
        employeePerformance: [],
      });
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
          <Link href="/admin/employees" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <Users size={20} />
            <span>Employees</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
            <TrendingUp size={20} />
            <span>Analytics</span>
          </Link>
          <Link href="/favorites" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <Heart size={20} />
            <span>Favorites</span>
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
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="text-green-400" size={32} />
                <span className="text-slate-400 text-sm">Total Revenue</span>
              </div>
              <p className="text-3xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="text-blue-400" size={32} />
                <span className="text-slate-400 text-sm">Total Sales</span>
              </div>
              <p className="text-3xl font-bold">{stats.totalSales}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="text-purple-400" size={32} />
                <span className="text-slate-400 text-sm">Total Profit</span>
              </div>
              <p className="text-3xl font-bold">₹{(stats.totalProfit / 100000).toFixed(1)}L</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="text-indigo-400" size={32} />
                <span className="text-slate-400 text-sm">Avg Sale Price</span>
              </div>
              <p className="text-3xl font-bold">₹{(stats.avgSalePrice / 1000).toFixed(0)}K</p>
            </motion.div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Users className="text-blue-400 mb-4" size={32} />
              <p className="text-slate-400 text-sm mb-2">Total Employees</p>
              <p className="text-3xl font-bold">{stats.totalEmployees}</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Car className="text-green-400 mb-4" size={32} />
              <p className="text-slate-400 text-sm mb-2">Total Vehicles</p>
              <p className="text-3xl font-bold">{stats.totalVehicles}</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Package className="text-purple-400 mb-4" size={32} />
              <p className="text-slate-400 text-sm mb-2">Total Spare Parts</p>
              <p className="text-3xl font-bold">{stats.totalSpareParts}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-8 space-y-6">
            {/* Sales Over Time */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Sales Over Time (Last 30 Days)</h2>
              {chartData.salesOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.salesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#9CA3AF' }}
                      domain={['dataMin - 1', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6' }}
                      formatter={(value: number, name: string) => {
                        if (name === 'Revenue (₹)') {
                          return [`₹${value.toLocaleString('en-IN')}`, name];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#818CF8" 
                      strokeWidth={2} 
                      name="Sales Count"
                      dot={{ fill: '#818CF8', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#A78BFA" 
                      strokeWidth={2} 
                      name="Revenue (₹)"
                      dot={{ fill: '#A78BFA', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  <p>No sales data available</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Breakdown */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Revenue Breakdown</h2>
                {chartData.revenueByType.length > 0 && chartData.revenueByType.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.revenueByType.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.revenueByType.filter(d => d.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#818CF8' : '#A78BFA'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        formatter={(value: number) => {
                          if (value >= 100000) {
                            return `₹${(value / 100000).toFixed(1)}L`;
                          } else if (value >= 1000) {
                            return `₹${(value / 1000).toFixed(1)}K`;
                          }
                          return `₹${value.toLocaleString('en-IN')}`;
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-400">
                    <p>No revenue data available</p>
                  </div>
                )}
              </div>

              {/* Top Selling Vehicles */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold mb-4">Top Selling Vehicles</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.topVehicles}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="sales" fill="#818CF8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employee Performance */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Employee Performance Ranking</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.employeePerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                    formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#818CF8" radius={[0, 8, 8, 0]} name="Revenue (₹)" />
                  <Bar dataKey="sales" fill="#A78BFA" radius={[0, 8, 8, 0]} name="Sales Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

