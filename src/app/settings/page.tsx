'use client';

import React, { useRef, useState } from 'react';
import { useFinance, Category } from '@/context/FinanceContext';
import { Download, Upload, Trash2, Shield, Info, ArrowLeft, Layers, X, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { exportData, importData, clearAllData, categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: 'Layers',
    color: '#8b5cf6'
  });

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

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
    } else {
      addCategory({ ...categoryForm, type: 'Expense' });
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({ name: '', icon: 'Layers', color: '#8b5cf6' });
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, icon: cat.icon, color: cat.color });
    setIsCategoryModalOpen(true);
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
        {/* Categories Section */}
        <section>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} /> Manage Categories
            </h2>
            <button 
              onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', icon: 'Layers', color: '#8b5cf6' }); setIsCategoryModalOpen(true); }}
              style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--primary))', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              + Add Category
            </button>
          </div>
          
          <div className="glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', padding: '1rem' }}>
            {categories.filter(c => c.type === 'Expense').map(cat => (
              <div 
                key={cat.id} 
                className="category-chip"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${cat.color}20`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={16} /> 
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cat.name}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEditCategory(cat)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }}>
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => deleteCategory(cat.id)} style={{ background: 'none', border: 'none', color: 'rgba(239, 68, 68, 0.3)', cursor: 'pointer', padding: 0 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

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
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Version 1.1.0</p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              A premium personal finance tracker designed for speed and privacy.
              Your data stays on your device.
            </p>
          </div>
        </section>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', 
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} style={{ color: 'rgba(255,255,255,0.5)' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Category Name</label>
                <input 
                  type="text" required value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                  placeholder="e.g. Gym"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Color</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1', '#94a3b8'].map(color => (
                    <button 
                      key={color}
                      type="button"
                      onClick={() => setCategoryForm({ ...categoryForm, color })}
                      style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', background: color, border: categoryForm.color === color ? '2px solid white' : 'none', cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                {editingCategory ? 'Update Category' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}

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
