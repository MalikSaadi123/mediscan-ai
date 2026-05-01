'use client';
import { exportReportPDF } from '@/lib/exportPDF';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Activity, Upload, FileText, LogOut, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, User, BarChart2, Heart, Shield } from 'lucide-react';import { analyzeReport, getReports } from '@/lib/api';
import MediBot from '@/components/MediBot';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeReport, setActiveReport] = useState<any>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    setUser(JSON.parse(userData || '{}'));
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getReports();
      setReports(res.data.reports);
    } catch (e) { console.error(e); }
  };

  const onDrop = useCallback(async (files: File[]) => {
    if (!files[0]) return;
    setAnalyzing(true);
    try {
      const res = await analyzeReport(files[0]);
      setActiveReport(res.data.data);
      await fetchReports();
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Analysis failed');
    }
    setAnalyzing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1
  });

  const logout = () => { localStorage.clear(); router.push('/'); };

  const getStatusColor = (status: string) => {
    if (status === 'High') return '#ef4444';
    if (status === 'Low') return '#f59e0b';
    return '#10b981';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'High') return <TrendingUp size={12} />;
    if (status === 'Low') return <TrendingDown size={12} />;
    return <Minus size={12} />;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <User size={14} style={{ color: '#4f8ef7' }} />
            <span style={{ fontSize: 13, color: '#e2e8f0' }}>{user?.name}</span>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
  onClick={() => router.push('/profile')}
  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b5cf6', cursor: 'pointer', fontSize: 13 }}>
  <User size={14} /> Profile
</motion.button>
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
  onClick={() => router.push('/recommendations')}
  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', cursor: 'pointer', fontSize: 13 }}>
  <Heart size={14} /> Recommendations
</motion.button>

{user?.email === 'saadibrar001@gmail.com' && (
  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
    onClick={() => router.push('/admin')}
    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: 13 }}>
    <Shield size={14} /> Admin
  </motion.button>
)}

<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
  onClick={() => router.push('/trends')}
  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4', cursor: 'pointer', fontSize: 13 }}>
  <TrendingUp size={14} /> Trends
</motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
  onClick={() => router.push('/analytics')}
  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', color: '#4f8ef7', cursor: 'pointer', fontSize: 13 }}>
  <BarChart2 size={14} /> Analytics
</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: 13 }}>
            <LogOut size={14} /> Logout
          </motion.button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 32px 60px' }}>

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6 }}>
            Welcome back, <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color: '#718096', fontSize: 15 }}>Upload a blood report PDF to get instant AI-powered analysis</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Reports', value: reports.length, color: '#4f8ef7', icon: <FileText size={18} /> },
            { label: 'Last Analysis', value: reports.length > 0 ? 'Today' : 'None yet', color: '#8b5cf6', icon: <BarChart2 size={18} /> },
            { label: 'Account Status', value: 'Active ✓', color: '#10b981', icon: <Activity size={18} /> },
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

        {/* Upload + Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>

          {/* Upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: '#e2e8f0' }}>Upload Report</p>
            <div {...getRootProps()}
              style={{ background: isDragActive ? 'rgba(79,142,247,0.08)' : 'rgba(255,255,255,0.02)', border: isDragActive ? '2px solid #4f8ef7' : '2px dashed rgba(255,255,255,0.1)', borderRadius: 24, padding: 40, textAlign: 'center', cursor: 'pointer', minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, transition: 'all 0.3s' }}>
              <input {...getInputProps()} />
              {analyzing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 56, height: 56, border: '3px solid rgba(79,142,247,0.2)', borderTop: '3px solid #4f8ef7', borderRadius: '50%' }} />
                  <p style={{ fontWeight: 600, fontSize: 16, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analyzing your report...</p>
                  <p style={{ color: '#718096', fontSize: 13 }}>AI is processing your blood values</p>
                </>
              ) : (
                <>
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(79,142,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={26} style={{ color: '#4f8ef7' }} />
                  </motion.div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{isDragActive ? '📂 Drop it here!' : 'Drag & drop your PDF'}</p>
                    <p style={{ color: '#718096', fontSize: 13 }}>or click to browse files</p>
                  </div>
                  <span style={{ padding: '4px 14px', borderRadius: 999, background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', color: '#4f8ef7', fontSize: 12 }}>PDF files only</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
  <p style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0' }}>Analysis Results</p>
  {activeReport && activeReport.tests && (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => exportReportPDF(activeReport, user?.name || 'Patient')}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
      ⬇️ Export PDF
    </motion.button>
  )}
</div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24, minHeight: 240 }}>
              <AnimatePresence mode="wait">
                {activeReport ? (
                  <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {activeReport.tests ? (
                      <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                          {activeReport.tests.map((test: any, i: number) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: `${getStatusColor(test.status)}12`, border: `1px solid ${getStatusColor(test.status)}35`, color: getStatusColor(test.status) }}>
                              {getStatusIcon(test.status)} {test.name}: {test.value}
                            </motion.div>
                          ))}
                        </div>
                        {activeReport.summary && (
                          <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(79,142,247,0.04)', border: '1px solid rgba(79,142,247,0.1)', fontSize: 13, color: '#a0aec0', lineHeight: 1.7 }}>
                            <p style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 6, fontSize: 13 }}>📋 Summary</p>
                            {activeReport.summary}
                          </div>
                        )}
                      </>
                    ) : (
                      <p style={{ color: '#718096', fontSize: 13 }}>{activeReport.raw}</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ height: '100%', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={24} style={{ color: '#4a5568' }} />
                    </div>
                    <p style={{ color: '#4a5568', fontSize: 14 }}>Upload a report to see results here</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Report History */}
        {reports.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: '#e2e8f0' }}>Report History</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reports.map((report: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
                  <button onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(139,92,246,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={16} style={{ color: '#4f8ef7' }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{report.filename}</p>
                        <p style={{ fontSize: 12, color: '#718096' }}>{new Date(report.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {expandedIndex === i ? <ChevronUp size={16} style={{ color: '#718096' }} /> : <ChevronDown size={16} style={{ color: '#718096' }} />}
                  </button>
                  <AnimatePresence>
                    {expandedIndex === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                        style={{ padding: '0 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {report.result?.tests?.map((test: any, j: number) => (
                          <span key={j} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, background: `${getStatusColor(test.status)}12`, border: `1px solid ${getStatusColor(test.status)}35`, color: getStatusColor(test.status) }}>
                            {test.name}: {test.value} — {test.status}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <MediBot reportContext={activeReport ? JSON.stringify(activeReport) : ''} />
    </div>
  );
}