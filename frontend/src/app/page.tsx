'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Activity, Brain, Shield, Zap, ArrowRight, FileText, ChevronDown } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    { icon: Brain, title: 'AI-Powered Analysis', desc: 'Advanced LLM analyzes every blood value with medical precision', color: '#4f8ef7' },
    { icon: Shield, title: 'Privacy First', desc: 'Your medical data is encrypted end-to-end and never shared', color: '#8b5cf6' },
    { icon: Zap, title: 'Instant Results', desc: 'Get comprehensive insights in under 30 seconds', color: '#06b6d4' },
    { icon: FileText, title: 'Plain Language', desc: 'Complex medical terms explained in simple words', color: '#10b981' },
  ];

  const stats = [
    { value: '99.2%', label: 'Accuracy Rate' },
    { value: '<30s', label: 'Analysis Time' },
    { value: '50+', label: 'Blood Markers' },
    { value: '24/7', label: 'Available' },
  ];

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} color="white" />
          </motion.div>
          <span style={{ fontSize: 20, fontWeight: 700, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MediScan AI</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/login')}
            style={{ padding: '8px 20px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#a0aec0', cursor: 'pointer', fontSize: 14 }}>
            Login
          </motion.button>
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(79,142,247,0.5)' }} whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            style={{ padding: '8px 20px', borderRadius: 999, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Get Started Free
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 32px 80px', textAlign: 'center', position: 'relative' }}>
        {/* Orbs */}
        <motion.div animate={{ x: [0, 60, 0], y: [0, -60, 0] }} transition={{ duration: 20, repeat: Infinity }}
          style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%)', top: '10%', left: '10%', pointerEvents: 'none' }} />
        <motion.div animate={{ x: [0, -60, 0], y: [0, 60, 0] }} transition={{ duration: 25, repeat: Infinity }}
          style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', bottom: '10%', right: '10%', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', color: '#4f8ef7', fontSize: 13, fontWeight: 500, marginBottom: 32 }}>
          <Zap size={13} /> Powered by Advanced AI — Instant Medical Insights
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: 'clamp(48px, 10vw, 100px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24 }}>
          Know Your<br />
          <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Health.</span><br />
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.55em' }}>Instantly.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          style={{ fontSize: 18, color: '#718096', maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
          Upload your blood test PDF and receive a comprehensive AI analysis with plain-language explanations and flagged values in seconds.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          style={{ display: 'flex', gap: 16, marginBottom: 64, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(79,142,247,0.4)' }} whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 16, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 17, fontWeight: 600 }}>
            Start Free Analysis <ArrowRight size={20} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: 17, fontWeight: 600 }}>
            Sign In
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 560, width: '100%' }}>
          {stats.map((s, i) => (
            <motion.div key={i} whileHover={{ y: -4 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <p style={{ fontSize: 22, fontWeight: 700, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#718096', marginTop: 4 }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#4a5568' }}>
          <span style={{ fontSize: 11 }}>Scroll to explore</span>
          <ChevronDown size={16} />
        </motion.div>
      </div>

      {/* Features */}
      <div style={{ padding: '100px 32px', background: '#0d0d14' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#4f8ef7', letterSpacing: '0.15em', marginBottom: 16 }}>WHY MEDISCAN AI</p>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.2 }}>
              Healthcare intelligence,<br />
              <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>simplified.</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8, boxShadow: `0 30px 80px ${f.color}20` }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${f.color}18`, border: `1px solid ${f.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon size={24} style={{ color: f.color }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#718096', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '100px 32px', background: '#0a0a0f' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, rgba(79,142,247,0.06), rgba(139,92,246,0.06))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: '80px 48px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
            Ready to understand<br />
            <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your health?</span>
          </h2>
          <p style={{ fontSize: 17, color: '#718096', marginBottom: 40 }}>
            Join thousands of users who trust MediScan AI for instant blood report analysis.
          </p>
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(79,142,247,0.4)' }} whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 40px', borderRadius: 16, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>
            Get Started — It&apos;s Free <ArrowRight size={22} />
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={{ padding: '32px', textAlign: 'center', color: '#4a5568', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#0a0a0f' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <Activity size={16} style={{ color: '#4f8ef7' }} />
          <span style={{ fontWeight: 600, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MediScan AI</span>
        </div>
        <p style={{ fontSize: 13 }}>© 2024 MediScan AI — Built for better healthcare</p>
      </div>
    </div>
  );
}