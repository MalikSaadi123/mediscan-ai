'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Activity, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', fontFamily: 'sans-serif' }}>

      {/* Left side — branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Orbs */}
        <motion.div animate={{ x: [0, 40, 0], y: [0, -40, 0] }} transition={{ duration: 18, repeat: Infinity }}
          style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%)', top: '10%', left: '5%', pointerEvents: 'none' }} />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ duration: 22, repeat: Infinity }}
          style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', bottom: '15%', right: '10%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Activity size={36} color="white" />
          </motion.div>

          <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MediScan AI</span>
          </h1>
          <p style={{ color: '#718096', fontSize: 17, lineHeight: 1.7, maxWidth: 340 }}>
            Your personal AI-powered blood report analyzer. Understand your health instantly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 48, textAlign: 'left' }}>
            {[
              { emoji: '🔬', title: 'Instant Analysis', desc: 'Get results in under 30 seconds' },
              { emoji: '🧠', title: 'AI-Powered', desc: 'Advanced medical AI explanations' },
              { emoji: '🔒', title: 'Secure & Private', desc: 'Your data is always encrypted' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 24 }}>{item.emoji}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: '#718096' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          style={{ width: '100%', maxWidth: 420 }}>

          <button onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', fontSize: 13, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
            ← Back to home
          </button>

          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: 'white' }}>Welcome back</h2>
          <p style={{ color: '#718096', marginBottom: 36, fontSize: 15 }}>Sign in to your account to continue</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 13 }}>
              {error}
            </motion.div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: '#a0aec0', display: 'block', marginBottom: 8, fontWeight: 500 }}>Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4f8ef7' }} />
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '13px 14px 13px 42px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, color: '#a0aec0', display: 'block', marginBottom: 8, fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8b5cf6' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ width: '100%', padding: '13px 42px 13px 42px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              <button onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#718096', cursor: 'pointer', padding: 0 }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(79,142,247,0.3)' }} whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }} />
            ) : (<>Sign In <ArrowRight size={18} /></>)}
          </motion.button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#718096' }}>
            Don&apos;t have an account?{' '}
            <button onClick={() => router.push('/register')}
              style={{ background: 'none', border: 'none', color: '#4f8ef7', cursor: 'pointer', fontWeight: 600, fontSize: 13, padding: 0 }}>
              Sign up free
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}