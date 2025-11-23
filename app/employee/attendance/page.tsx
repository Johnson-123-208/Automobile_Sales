"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Clock, Calendar, MapPin, TrendingUp, Menu, X, Package, LogOut, ArrowLeft } from 'lucide-react';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { User, Attendance } from '@/lib/supabaseClient';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EmployeeAttendance() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadAttendanceHistory();
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

  const loadAttendanceHistory = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setAttendanceHistory(data || []);
    } catch (error: any) {
      console.error('Error loading attendance:', error);
    }
  };

  const checkTodayAttendance = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (data) {
        setTodayAttendance(data);
        setIsLoggedIn(!!data.login_time && !data.logout_time);
      }
    } catch (error: any) {
      // No attendance record for today
      setTodayAttendance(null);
      setIsLoggedIn(false);
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
        loadAttendanceHistory();
      } else {
        alert('Error marking attendance: ' + error.message);
      }
    } catch (error: any) {
      alert('Failed to get location. Please enable location services.');
    }
  };

  const handleLogout = async () => {
    if (!user || !todayAttendance) return;
    try {
      const logoutTime = new Date().toISOString();
      const loginTime = new Date(todayAttendance.login_time!);
      const totalHours = (new Date(logoutTime).getTime() - new Date(loginTime).getTime()) / (1000 * 60 * 60);

      const { error } = await supabase
        .from('attendance')
        .update({
          logout_time: logoutTime,
          total_hours: totalHours,
        })
        .eq('id', todayAttendance.id);

      if (!error) {
        checkTodayAttendance();
        loadAttendanceHistory();
      }
    } catch (error: any) {
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
          <p className="text-sm text-slate-400 mt-1">Employee Portal</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/employee/dashboard" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <TrendingUp size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/employee/products" className="flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link href="/employee/attendance" className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white">
            <Calendar size={20} />
            <span>Attendance</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
          <button onClick={handleAppLogout} className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
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
              <h1 className="text-2xl font-bold">Attendance</h1>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {/* Today's Attendance */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
            <h2 className="text-xl font-bold mb-4">Today's Attendance</h2>
            {todayAttendance ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Login Time</p>
                    <p className="font-semibold">
                      {todayAttendance.login_time 
                        ? new Date(todayAttendance.login_time).toLocaleTimeString('en-IN')
                        : 'Not logged in'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Logout Time</p>
                    <p className="font-semibold">
                      {todayAttendance.logout_time 
                        ? new Date(todayAttendance.logout_time).toLocaleTimeString('en-IN')
                        : 'Still logged in'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Total Hours</p>
                    <p className="font-semibold">
                      {todayAttendance.total_hours 
                        ? `${todayAttendance.total_hours.toFixed(2)} hrs`
                        : 'Calculating...'}
                    </p>
                  </div>
                </div>
                {todayAttendance.city && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Location</p>
                    <p className="font-semibold flex items-center space-x-2">
                      <MapPin size={16} />
                      <span>{todayAttendance.city}</span>
                    </p>
                  </div>
                )}
                {!todayAttendance.logout_time && (
                  <button
                    onClick={handleLogout}
                    className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all font-semibold"
                  >
                    Mark Logout
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p className="text-slate-400 mb-4">No attendance marked for today</p>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all font-semibold"
                >
                  Mark Login
                </button>
              </div>
            )}
          </div>

          {/* Attendance History */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Attendance History (Last 30 Days)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-3 text-slate-400">Date</th>
                    <th className="text-left p-3 text-slate-400">Login</th>
                    <th className="text-left p-3 text-slate-400">Logout</th>
                    <th className="text-left p-3 text-slate-400">Hours</th>
                    <th className="text-left p-3 text-slate-400">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="p-3">
                        {new Date(record.date).toLocaleDateString('en-IN', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="p-3">
                        {record.login_time 
                          ? new Date(record.login_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                          : '-'}
                      </td>
                      <td className="p-3">
                        {record.logout_time 
                          ? new Date(record.logout_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                          : '-'}
                      </td>
                      <td className="p-3">
                        {record.total_hours 
                          ? `${record.total_hours.toFixed(2)} hrs`
                          : '-'}
                      </td>
                      <td className="p-3">
                        {record.city || '-'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {attendanceHistory.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No attendance records found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

