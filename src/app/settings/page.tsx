'use client';

import React, { useRef } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Download, Upload, Trash2, Shield, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { exportData, importData, clearAllData } = useFinance();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <main className="container" style={{ paddingBottom: '5rem' }}>
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} />
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Settings</h1>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Data Management Section */}
        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} /> Data Management
          </h2>
          
          <div className="glass" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.03)' }}>
            
            <button 
              onClick={exportData}
              className="settings-item"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                width: '100%', 
                padding: '1rem', 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' }}>
                <Download size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>Backup Data (JSON)</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Export all your accounts and expenses</p>
              </div>
            </button>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 1rem' }} />

            <button 
              onClick={handleImportClick}
              className="settings-item"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                width: '100%', 
                padding: '1rem', 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                <Upload size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>Restore Data</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Import a previously saved backup file</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                style={{ display: 'none' }} 
              />
            </button>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 1rem' }} />

            <button 
              onClick={clearAllData}
              className="settings-item"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                width: '100%', 
                padding: '1rem', 
                background: 'none', 
                border: 'none', 
                color: '#ef4444', 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                <Trash2 size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>Reset Application</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(239, 68, 68, 0.6)' }}>Delete everything and start fresh</p>
              </div>
            </button>
          </div>
        </section>

        {/* Info Section */}
        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} /> About SpendY
          </h2>
          <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 900,
              boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
            }}>
              S
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>SpendY PWA</h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Version 1.0.0</p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              A premium personal finance tracker designed for speed and privacy.
              Your data stays on your device.
            </p>
          </div>
        </section>
      </div>

      <style jsx>{`
        .settings-item:hover {
          background: rgba(255,255,255,0.05) !important;
        }
        .settings-item {
          transition: background 0.2s ease;
        }
      `}</style>
    </main>
  );
}
