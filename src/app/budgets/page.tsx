'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Plus, Trash2, Edit2, X, PieChart } from 'lucide-react';

export default function BudgetsPage() {
  const { budgets, expenses, categories, addBudget, deleteBudget, updateBudget } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const expenseCategories = categories.filter(c => c.type === 'Expense');

  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    category: expenseCategories[0]?.name || 'Miscellaneous',
    month: currentMonth,
    description: '',
  });

  // Update default category when categories change
  useEffect(() => {
    if (!formData.category && expenseCategories.length > 0) {
      setFormData(prev => ({ ...prev, category: expenseCategories[0].name }));
    }
  }, [expenseCategories, formData.category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBudget) {
      updateBudget(editingBudget.id, formData);
    } else {
      addBudget(formData);
    }
    setIsModalOpen(false);
    setEditingBudget(null);
    setFormData({ name: '', amount: 0, category: expenseCategories[0]?.name || 'Miscellaneous', month: currentMonth, description: '' });
  };

  const openEditModal = (bud: any) => {
    setEditingBudget(bud);
    setFormData({ 
      name: bud.name, amount: bud.amount, category: bud.category, 
      month: bud.month, description: bud.description 
    });
    setIsModalOpen(true);
  };

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Budgets</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Set Budget</button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {budgets.map(bud => {
          const spentInCategory = expenses
            .filter(e => e.category === bud.category && e.date.startsWith(bud.month))
            .reduce((acc, curr) => acc + curr.amount, 0);
          const progress = Math.min(100, (spentInCategory / bud.amount) * 100);
          const categoryObj = categories.find(c => c.name === bud.category);

          return (
            <div key={bud.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{bud.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: categoryObj?.color || 'inherit' }}>● </span>
                    {bud.category} • {bud.month}
                  </p>
                </div>
                <p style={{ fontWeight: 700 }}>₹{bud.amount.toLocaleString()}</p>
              </div>
              
              {/* Progress Bar */}
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '0.75rem', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', width: `${progress}%`, 
                  background: progress > 90 ? '#ef4444' : (categoryObj?.color || 'hsl(var(--primary))'),
                  borderRadius: '3px'
                }} />
              </div>
              
              <div className="flex-between" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                <span>Spent: ₹{spentInCategory.toLocaleString()}</span>
                <span>{Math.round(progress)}% of goal</span>
              </div>

              <div className="flex-between" style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: progress > 100 ? '#ef4444' : '#10b981' }}>
                  {progress > 100 ? 'Over budget!' : 'On track'}
                </span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => openEditModal(bud)} style={{ color: 'rgba(255,255,255,0.3)' }}><Edit2 size={14} /></button>
                  <button onClick={() => deleteBudget(bud.id)} style={{ color: 'rgba(239, 68, 68, 0.5)' }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
        {budgets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <PieChart size={48} style={{ opacity: 0.2 }} />
            <p className="text-muted">No budgets set for this month.</p>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Create a budget</button>
          </div>
        )}
      </div>

      {/* Budget Modal */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', 
          zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' 
        }}>
          <div className="glass" style={{ 
            width: '100%', maxWidth: '600px', padding: '2rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
            borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem'
          }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingBudget ? 'Edit Budget' : 'Setup Budget'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingBudget(null); }} style={{ color: 'rgba(255,255,255,0.5)' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Amount (₹)</label>
                <input 
                  type="number" required value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1.5rem', fontWeight: 700 }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Budget Name</label>
                <input 
                  type="text" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                  placeholder="e.g. Monthly Grocery"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                  >
                    {expenseCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Month</label>
                  <input 
                    type="month" required value={formData.month}
                    onChange={e => setFormData({ ...formData, month: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                {editingBudget ? 'Update Budget' : 'Set Budget'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
