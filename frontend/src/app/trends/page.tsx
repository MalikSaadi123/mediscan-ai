'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getTrends } from '@/lib/api';

export default function Trends() {
  const router = useRouter();
  const [trends, setTrends] = useState<any>({});
  const [dates, setDates] = useState<string[]>([]);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const res = await getTrends();
      setTrends(res.data.trends);
      setDates(res.data.dates);
      setTotalReports(res.data.total_reports);
      const keys = Object.keys(res.data.trends);
      if (keys.length > 0) setSelectedTest(keys[0]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    if (status === 'High') return '#ef4444';
    if (status === 'Low') return '#f59e0b';
    return '#10b981';
  };

  const getTrend = (data: any[]) => {
    if (data.length < 2) return 'stable';
    const last = data[data.length - 1].value;
    const prev = data[data.length - 2].value;
    if (last > prev) return 'up';
    if (last < prev) return 'down';
    return 'stable';
  };

  const chartData = selectedTest && trends[selectedTest]
    ? trends[selectedTest].map((d: any) => ({
        date: d.date,
        value: d.value,
        status: d.status,
      }))
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const status = payload[0]?.payload?.status;
      return (
        <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px' }}>
          <p style={{ color: '#a0aec0', fontSize: 11, marginBottom: 4 }}>{label}</p>
          <p style={{ color: getStatusColor(status), fontWeight: 700, fontSize: 16 }}>{payload[0]?.value}</p>
          <p style={{ color: getStatusColor(status), fontSize: 11 }}>{status}</p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = getStatusColor(payload.status);
    return <circle cx={cx} cy={cy} r={6} fill={color} stroke="#0a0a0f" strokeWidth={2} />;
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
            Health <span style={{ background: 'linear-gradient(135deg, #06b6d4, #4f8ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Trends</span>
          </h1>
          <p style={{ color: '#718096', fontSize: 15 }}>Track how your health values change over time</p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 48, height: 48, border: '3px solid rgba(6,182,212,0.2)', borderTop: '3px solid #06b6d4', borderRadius: '50%' }} />
          </div>
        ) : totalReports < 2 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>📊</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Need More Reports</h2>
            <p style={{ color: '#718096', fontSize: 15, marginBottom: 24 }}>
              You need at least 2 reports to see trends. You currently have {totalReports} report.
            </p>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => router.push('/dashboard')}
              style={{ padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Upload Another Report
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Total Reports', value: totalReports, color: '#06b6d4' },
                { label: 'Tests Tracked', value: Object.keys(trends).length, color: '#4f8ef7' },
                { label: 'Date Range', value: `${dates[0]} — ${dates[dates.length - 1]}`, color: '#8b5cf6' },
              ].map((s, i) => (
                <motion.div key={i} whileHover={{ y: -3 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px 24px' }}>
                  <p style={{ fontSize: 12, color: '#718096', marginBottom: 6 }}>{s.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Test selector */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#a0aec0', marginBottom: 12 }}>Select Test to View Trend:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.keys(trends).map((test, i) => {
                  const data = trends[test];
                  const lastStatus = data[data.length - 1]?.status;
                  return (
                    <motion.button key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedTest(test)}
                      style={{
                        padding: '8px 16px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
                        border: `1px solid ${selectedTest === test ? getStatusColor(lastStatus) : 'rgba(255,255,255,0.1)'}`,
                        background: selectedTest === test ? `${getStatusColor(lastStatus)}15` : 'transparent',
                        color: selectedTest === test ? getStatusColor(lastStatus) : '#a0aec0'
                      }}>
                      {test.split(' ')[0]}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Main Chart */}
            {selectedTest && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>{selectedTest}</p>
                    <p style={{ fontSize: 12, color: '#718096' }}>Values across {chartData.length} reports</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {getTrend(trends[selectedTest]) === 'up' && <TrendingUp size={20} style={{ color: '#ef4444' }} />}
                    {getTrend(trends[selectedTest]) === 'down' && <TrendingDown size={20} style={{ color: '#f59e0b' }} />}
                    {getTrend(trends[selectedTest]) === 'stable' && <Minus size={20} style={{ color: '#10b981' }} />}
                    <span style={{ fontSize: 13, color: '#a0aec0', textTransform: 'capitalize' }}>
                      {getTrend(trends[selectedTest])} trend
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#718096', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#718096', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#4f8ef7" strokeWidth={3}
                      dot={<CustomDot />} activeDot={{ r: 8, fill: '#4f8ef7' }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* All tests overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>All Tests Overview</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {Object.keys(trends).map((test, i) => {
                  const data = trends[test];
                  const latest = data[data.length - 1];
                  const trend = getTrend(data);
                  const color = getStatusColor(latest?.status);
                  return (
                    <motion.div key={i} whileHover={{ y: -4 }}
                      onClick={() => setSelectedTest(test)}
                      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${selectedTest === test ? color : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: 18, cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', maxWidth: '70%' }}>{test}</p>
                        <span style={{ padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600, background: `${color}15`, color }}>
                          {latest?.status}
                        </span>
                      </div>
                      <p style={{ fontSize: 24, fontWeight: 800, color, marginBottom: 8 }}>{latest?.raw_value}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {trend === 'up' && <TrendingUp size={14} style={{ color: '#ef4444' }} />}
                        {trend === 'down' && <TrendingDown size={14} style={{ color: '#f59e0b' }} />}
                        {trend === 'stable' && <Minus size={14} style={{ color: '#10b981' }} />}
                        <span style={{ fontSize: 11, color: '#718096', textTransform: 'capitalize' }}>{trend} over {data.length} reports</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}