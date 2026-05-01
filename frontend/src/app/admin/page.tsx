'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, Users, FileText, BarChart2, Shield, Eye } from 'lucide-react';
import { getAdminStats } from '@/lib/api';

export default function Admin() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Access denied');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={18} color="white" />
          </motion.div>
          <span style={{ fontSize: 18, fontWeight: 700, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MediScan AI</span>
          <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>ADMIN</span>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', fontSize: 13 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </motion.button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 32px 60px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <Shield size={28} style={{ color: '#ef4444' }} />
            <h1 style={{ fontSize: 36, fontWeight: 800 }}>
              Admin <span style={{ background: 'linear-gradient(135deg, #ef4444, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
            </h1>
          </div>
          <p style={{ color: '#718096', fontSize: 15 }}>System overview and user management</p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 48, height: 48, border: '3px solid rgba(239,68,68,0.2)', borderTop: '3px solid #ef4444', borderRadius: '50%' }} />
          </div>
        )}

        {/* Error - Access Denied */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🚫</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: '#ef4444' }}>Access Denied</h2>
            <p style={{ color: '#718096', fontSize: 15 }}>{error}</p>
          </motion.div>
        )}

        {/* Stats */}
        {stats && !loading && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Total Users', value: stats.total_users, color: '#4f8ef7', icon: <Users size={20} /> },
                { label: 'Total Reports', value: stats.total_reports, color: '#8b5cf6', icon: <FileText size={20} /> },
                { label: 'Avg Reports/User', value: stats.total_users > 0 ? (stats.total_reports / stats.total_users).toFixed(1) : 0, color: '#10b981', icon: <BarChart2 size={20} /> },
                { label: 'System Status', value: 'Online ✓', color: '#06b6d4', icon: <Activity size={20} /> },
              ].map((s, i) => (
                <motion.div key={i} whileHover={{ y: -3 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    {s.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#718096', marginBottom: 3 }}>{s.label}</p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {[
                { key: 'users', label: '👥 Users', count: stats.total_users },
                { key: 'reports', label: '📄 Recent Reports', count: stats.recent_reports?.length },
              ].map((tab) => (
                <motion.button key={tab.key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{ padding: '10px 20px', borderRadius: 12, border: `1px solid ${activeTab === tab.key ? '#4f8ef7' : 'rgba(255,255,255,0.1)'}`, background: activeTab === tab.key ? 'rgba(79,142,247,0.1)' : 'transparent', color: activeTab === tab.key ? '#4f8ef7' : '#a0aec0', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                  {tab.label} ({tab.count})
                </motion.button>
              ))}
            </div>

            {/* Users Table */}
            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: 16 }}>
                  {['Name', 'Email', 'Reports', 'ID'].map((h, i) => (
                    <p key={i} style={{ fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</p>
                  ))}
                </div>
                {stats.recent_users?.map((user: any, i: number) => (
                  <motion.div key={i} whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                    style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: 16, alignItems: 'center', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</p>
                    </div>
                    <p style={{ fontSize: 13, color: '#a0aec0' }}>{user.email}</p>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)', color: '#4f8ef7', display: 'inline-block' }}>
                      {user.report_count} reports
                    </span>
                    <p style={{ fontSize: 11, color: '#4a5568', fontFamily: 'monospace' }}>{user._id?.slice(-8)}...</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Reports Table */}
            {activeTab === 'reports' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: 16 }}>
                  {['Filename', 'User ID', 'Date', 'Tests'].map((h, i) => (
                    <p key={i} style={{ fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</p>
                  ))}
                </div>
                {stats.recent_reports?.map((report: any, i: number) => (
                  <motion.div key={i} whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                    style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: 16, alignItems: 'center', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(139,92,246,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={14} style={{ color: '#4f8ef7' }} />
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{report.filename}</p>
                    </div>
                    <p style={{ fontSize: 11, color: '#4a5568', fontFamily: 'monospace' }}>{report.user_id?.slice(-12)}...</p>
                    <p style={{ fontSize: 12, color: '#a0aec0' }}>{report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}</p>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', display: 'inline-block' }}>
                      {report.result?.tests?.length || 0} tests
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}