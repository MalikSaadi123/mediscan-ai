'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Activity, ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { getReports } from '@/lib/api';

export default function Analytics() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getReports();
      setReports(res.data.reports);
      if (res.data.reports.length > 0) {
        setSelectedReport(res.data.reports[res.data.reports.length - 1]);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const calculateHealthScore = (tests: any[]) => {
    if (!tests || tests.length === 0) return 0;
    const normal = tests.filter(t => t.status === 'Normal').length;
    return Math.round((normal / tests.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const tests = selectedReport?.result?.tests || [];
  const healthScore = calculateHealthScore(tests);
  const scoreColor = getScoreColor(healthScore);

  const chartData = tests.map((t: any) => ({
    name: t.name.split(' ')[0],
    fullName: t.name,
    value: parseFloat(t.value) || 0,
    status: t.status,
  }));

  const statusCounts = {
    normal: tests.filter((t: any) => t.status === 'Normal').length,
    high: tests.filter((t: any) => t.status === 'High').length,
    low: tests.filter((t: any) => t.status === 'Low').length,
  };

  const radialData = [{ name: 'Score', value: healthScore, fill: scoreColor }];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px' }}>
          <p style={{ color: 'white', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{d.fullName}</p>
          <p style={{ color: '#a0aec0', fontSize: 12 }}>Value: {d.value}</p>
          <p style={{ color: d.status === 'High' ? '#ef4444' : d.status === 'Low' ? '#f59e0b' : '#10b981', fontSize: 12, fontWeight: 600 }}>{d.status}</p>
        </div>
      );
    }
    return null;
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
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6 }}>
            Health <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics</span>
          </h1>
          <p style={{ color: '#718096', fontSize: 15 }}>Deep insights into your blood report results</p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 48, height: 48, border: '3px solid rgba(79,142,247,0.2)', borderTop: '3px solid #4f8ef7', borderRadius: '50%' }} />
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#718096', fontSize: 18 }}>No reports found. Upload a report first!</p>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => router.push('/dashboard')}
              style={{ marginTop: 20, padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Go to Dashboard
            </motion.button>
          </div>
        ) : (
          <>
            {/* Report selector */}
            {reports.length > 1 && (
              <div style={{ marginBottom: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {reports.map((r: any, i: number) => (
                  <motion.button key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedReport(r)}
                    style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${selectedReport === r ? '#4f8ef7' : 'rgba(255,255,255,0.1)'}`, background: selectedReport === r ? 'rgba(79,142,247,0.1)' : 'transparent', color: selectedReport === r ? '#4f8ef7' : '#a0aec0', cursor: 'pointer', fontSize: 13 }}>
                    {r.filename} — {new Date(r.created_at).toLocaleDateString()}
                  </motion.button>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>

              {/* Health Score */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24, textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#a0aec0', marginBottom: 16 }}>Health Score</p>
                <div style={{ height: 160, position: 'relative', minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'rgba(255,255,255,0.05)' }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <p style={{ fontSize: 32, fontWeight: 800, color: scoreColor, margin: 0 }}>{healthScore}</p>
                    <p style={{ fontSize: 11, color: '#718096', margin: 0 }}>/ 100</p>
                  </div>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: scoreColor, marginTop: 8 }}>{getScoreLabel(healthScore)}</p>
              </motion.div>

              {/* Status breakdown */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#a0aec0', marginBottom: 20 }}>Status Breakdown</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { label: 'Normal', count: statusCounts.normal, color: '#10b981', icon: <CheckCircle size={18} /> },
                    { label: 'High', count: statusCounts.high, color: '#ef4444', icon: <XCircle size={18} /> },
                    { label: 'Low', count: statusCounts.low, color: '#f59e0b', icon: <AlertTriangle size={18} /> },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ color: s.color }}>{s.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, color: '#e2e8f0' }}>{s.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.count}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${tests.length > 0 ? (s.count / tests.length) * 100 : 0}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            style={{ height: '100%', borderRadius: 3, background: s.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Risk Assessment */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#a0aec0', marginBottom: 20 }}>Risk Assessment</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {tests.filter((t: any) => t.status !== 'Normal').length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <CheckCircle size={40} style={{ color: '#10b981', margin: '0 auto 10px' }} />
                      <p style={{ color: '#10b981', fontWeight: 600 }}>All values normal!</p>
                    </div>
                  ) : (
                    tests.filter((t: any) => t.status !== 'Normal').map((test: any, i: number) => (
                      <div key={i} style={{ padding: '10px 14px', borderRadius: 12, background: test.status === 'High' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${test.status === 'High' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {test.status === 'High' ? <TrendingUp size={14} style={{ color: '#ef4444' }} /> : <TrendingDown size={14} style={{ color: '#f59e0b' }} />}
                          <span style={{ fontSize: 13, fontWeight: 600, color: test.status === 'High' ? '#ef4444' : '#f59e0b' }}>{test.name}</span>
                        </div>
                        <p style={{ fontSize: 11, color: '#718096', marginTop: 4 }}>{test.value} — {test.status}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Bar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24, marginBottom: 24 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>Test Values Overview</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fill: '#718096', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#718096', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.status === 'High' ? '#ef4444' : entry.status === 'Low' ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Detailed test cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>Detailed Results</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {tests.map((test: any, i: number) => (
                  <motion.div key={i} whileHover={{ y: -4 }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${test.status === 'High' ? 'rgba(239,68,68,0.2)' : test.status === 'Low' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`, borderRadius: 16, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', maxWidth: '70%' }}>{test.name}</p>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: test.status === 'High' ? 'rgba(239,68,68,0.12)' : test.status === 'Low' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)', color: test.status === 'High' ? '#ef4444' : test.status === 'Low' ? '#f59e0b' : '#10b981' }}>
                        {test.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 24, fontWeight: 800, color: test.status === 'High' ? '#ef4444' : test.status === 'Low' ? '#f59e0b' : '#10b981', marginBottom: 4 }}>{test.value}</p>
                    <p style={{ fontSize: 11, color: '#718096', marginBottom: 8 }}>Normal: {test.normal_range}</p>
                    <p style={{ fontSize: 12, color: '#a0aec0', lineHeight: 1.5 }}>{test.explanation}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}