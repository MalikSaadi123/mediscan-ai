'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, User, Mail, Calendar, Heart, Save } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    bloodType: '',
    conditions: '',
    allergies: '',
    medications: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    const savedProfile = JSON.parse(localStorage.getItem('profile') || '{}');
    setProfile(prev => ({
      ...prev,
      name: userData.name || '',
      email: userData.email || '',
      ...savedProfile,
    }));
  }, []);

  const saveProfile = () => {
    localStorage.setItem('profile', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { key: 'age', label: 'Age', placeholder: '25', type: 'number', icon: <Calendar size={15} /> },
    { key: 'gender', label: 'Gender', placeholder: 'Male / Female / Other', type: 'text', icon: <User size={15} /> },
    { key: 'bloodType', label: 'Blood Type', placeholder: 'A+, B-, O+, AB+...', type: 'text', icon: <Heart size={15} /> },
    { key: 'conditions', label: 'Medical Conditions', placeholder: 'Diabetes, Hypertension...', type: 'text', icon: <Activity size={15} /> },
    { key: 'allergies', label: 'Allergies', placeholder: 'Penicillin, Peanuts...', type: 'text', icon: <Activity size={15} /> },
    { key: 'medications', label: 'Current Medications', placeholder: 'Metformin, Aspirin...', type: 'text', icon: <Activity size={15} /> },
  ];

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

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 32px 60px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6 }}>
            Health <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profile</span>
          </h1>
          <p style={{ color: '#718096', fontSize: 15 }}>Your personal health information for better AI analysis</p>
        </motion.div>

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40, padding: 24, borderRadius: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'white' }}>
            {profile.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{profile.name}</h2>
            <p style={{ color: '#718096', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={13} /> {profile.email}
            </p>
            {profile.bloodType && (
              <span style={{ marginTop: 8, display: 'inline-block', padding: '3px 12px', borderRadius: 999, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 12, fontWeight: 600 }}>
                Blood Type: {profile.bloodType}
              </span>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 32, marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#e2e8f0' }}>Personal Information</h3>

          {/* Name & Email readonly */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {[
              { label: 'Full Name', value: profile.name, icon: <User size={15} style={{ color: '#4f8ef7' }} /> },
              { label: 'Email', value: profile.email, icon: <Mail size={15} style={{ color: '#8b5cf6' }} /> },
            ].map((f, i) => (
              <div key={i}>
                <label style={{ fontSize: 13, color: '#a0aec0', display: 'block', marginBottom: 8, fontWeight: 500 }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>{f.icon}</div>
                  <input value={f.value} readOnly
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#718096', fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'not-allowed' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {fields.map((f, i) => (
              <div key={i}>
                <label style={{ fontSize: 13, color: '#a0aec0', display: 'block', marginBottom: 8, fontWeight: 500 }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4f8ef7' }}>{f.icon}</div>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(profile as any)[f.key]}
                    onChange={e => setProfile(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(79,142,247,0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={saveProfile}
          style={{ width: '100%', padding: '16px', borderRadius: 14, background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}>
          <Save size={18} /> {saved ? '✅ Profile Saved!' : 'Save Profile'}
        </motion.button>
      </div>
    </div>
  );
}