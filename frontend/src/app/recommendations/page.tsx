'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, Heart, Utensils, Dumbbell, Stethoscope, FlaskConical, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';
import { getReports, getRecommendations } from '@/lib/api';

export default function Recommendations() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
        const latest = res.data.reports[res.data.reports.length - 1];
        setSelectedReport(latest);
        await fetchRecommendations(latest);
      }
    } catch (e) { console.error(e); }
    setFetching(false);
  };

  const fetchRecommendations = async (report: any) => {
    setLoading(true);
    setRecommendations(null);
    try {
      const reportData = report.result?.tests 
        ? JSON.stringify(report.result)
        : report.result?.raw 
        ? report.result.raw 
        : JSON.stringify(report.result);
      const res = await getRecommendations(reportData);
      console.log('Recommendations response:', res.data);
      if (res.data.recommendations) {
        setRecommendations(res.data.recommendations);
      } else if (res.data.raw) {
        console.log('Raw response:', res.data.raw);
        try {
          const parsed = JSON.parse(res.data.raw);
          setRecommendations(parsed);
        } catch(e) {
          console.error('Parse error:', e);
        }
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  
  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'Immediate') return '#ef4444';
    if (urgency === 'Soon') return '#f59e0b';
    return '#10b981';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'High') return '#ef4444';
    if (priority === 'Medium') return '#f59e0b';
    return '#10b981';
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

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 32px 60px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6 }}>
            AI <span style={{ background: 'linear-gradient(135deg, #10b981, #4f8ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Recommendations</span>
          </h1>
          <p style={{ color: '#718096', fontSize: 15 }}>Personalized health recommendations based on your report</p>
        </motion.div>

        {/* Report selector */}
        {reports.length > 1 && (
          <div style={{ marginBottom: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {reports.map((r: any, i: number) => (
              <motion.button key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setSelectedReport(r); fetchRecommendations(r); }}
                style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${selectedReport === r ? '#10b981' : 'rgba(255,255,255,0.1)'}`, background: selectedReport === r ? 'rgba(16,185,129,0.1)' : 'transparent', color: selectedReport === r ? '#10b981' : '#a0aec0', cursor: 'pointer', fontSize: 13 }}>
                {r.filename} — {new Date(r.created_at).toLocaleDateString()}
              </motion.button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 20 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 56, height: 56, border: '3px solid rgba(16,185,129,0.2)', borderTop: '3px solid #10b981', borderRadius: '50%' }} />
            <p style={{ color: '#718096', fontSize: 15 }}>AI is generating your personalized recommendations...</p>
          </div>
        )}

        {/* No reports */}
        {!fetching && reports.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#718096', fontSize: 18, marginBottom: 20 }}>No reports found. Upload a report first!</p>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => router.push('/dashboard')}
              style={{ padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Go to Dashboard
            </motion.button>
          </div>
        )}

        {/* Recommendations */}
        <AnimatePresence>
          {recommendations && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Overall status */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 24, padding: '20px 24px', borderRadius: 20, background: recommendations.overall_status === 'Good' ? 'rgba(16,185,129,0.08)' : recommendations.overall_status === 'Fair' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${recommendations.overall_status === 'Good' ? 'rgba(16,185,129,0.2)' : recommendations.overall_status === 'Fair' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 40 }}>{recommendations.overall_status === 'Good' ? '✅' : recommendations.overall_status === 'Fair' ? '⚠️' : '🚨'}</div>
                <div>
                  <p style={{ fontSize: 13, color: '#718096', marginBottom: 2 }}>Overall Health Status</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: recommendations.overall_status === 'Good' ? '#10b981' : recommendations.overall_status === 'Fair' ? '#f59e0b' : '#ef4444' }}>{recommendations.overall_status}</p>
                </div>
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                {/* Lifestyle */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(79,142,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={20} style={{ color: '#4f8ef7' }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Lifestyle Changes</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {recommendations.lifestyle?.map((item: any, i: number) => (
                      <div key={i} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{item.title}</p>
                          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600, background: `${getPriorityColor(item.priority)}15`, color: getPriorityColor(item.priority) }}>{item.priority}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#718096', lineHeight: 1.5 }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Diet */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Utensils size={20} style={{ color: '#10b981' }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Diet Recommendations</h3>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#10b981', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle size={13} /> Foods to Eat
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {recommendations.diet?.foods_to_eat?.map((food: string, i: number) => (
                        <span key={i} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>{food}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <XCircle size={13} /> Foods to Avoid
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {recommendations.diet?.foods_to_avoid?.map((food: string, i: number) => (
                        <span key={i} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>{food}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Exercise */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Dumbbell size={20} style={{ color: '#8b5cf6' }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Exercise Plan</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {recommendations.exercise?.map((item: any, i: number) => (
                      <div key={i} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{item.title}</p>
                          <span style={{ fontSize: 11, color: '#8b5cf6' }}>{item.frequency}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#718096', lineHeight: 1.5 }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Doctor Visit */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Stethoscope size={20} style={{ color: '#f59e0b' }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Doctor Visit</h3>
                  </div>
                  <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 12, background: `${getUrgencyColor(recommendations.doctor_visit?.urgency)}10`, border: `1px solid ${getUrgencyColor(recommendations.doctor_visit?.urgency)}25` }}>
                    <p style={{ fontSize: 12, color: '#718096', marginBottom: 2 }}>Urgency Level</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: getUrgencyColor(recommendations.doctor_visit?.urgency) }}>{recommendations.doctor_visit?.urgency}</p>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#a0aec0', marginBottom: 8 }}>Reasons:</p>
                    {recommendations.doctor_visit?.reasons?.map((r: string, i: number) => (
                      <p key={i} style={{ fontSize: 12, color: '#718096', marginBottom: 4, paddingLeft: 12, borderLeft: '2px solid rgba(245,158,11,0.3)' }}>• {r}</p>
                    ))}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#a0aec0', marginBottom: 8 }}>Recommended Specialists:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {recommendations.doctor_visit?.specialists?.map((s: string, i: number) => (
                        <span key={i} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Follow-up Tests */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FlaskConical size={20} style={{ color: '#06b6d4' }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recommended Follow-up Tests</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {recommendations.followup_tests?.map((test: string, i: number) => (
                    <motion.div key={i} whileHover={{ y: -2 }}
                      style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4', fontSize: 13, fontWeight: 500 }}>
                      🔬 {test}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}