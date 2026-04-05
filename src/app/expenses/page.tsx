'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Plus, Trash2, Edit2, X, Search, Filter } from 'lucide-react';

export default function ExpensesPage() {
  const { expenses, accounts, categories, addExpense, deleteExpense, updateExpense } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const expenseCategories = categories.filter(c => c.type === 'Expense');

  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    category: expenseCategories[0]?.name || 'Miscellaneous',
    date: new Date().toISOString().split('T')[0],
    description: '',
    accountId: accounts[0]?.id || '',
  });

  // Update default category when categories change if not already set
  useEffect(() => {
    if (!formData.category && expenseCategories.length > 0) {
      setFormData(prev => ({ ...prev, category: expenseCategories[0].name }));
    }
  }, [expenseCategories, formData.category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
    } else {
      addExpense(formData);
    }
    setIsModalOpen(false);
    setEditingExpense(null);
    setFormData({ 
      name: '', amount: 0, category: expenseCategories[0]?.name || 'Miscellaneous', 
      date: new Date().toISOString().split('T')[0], description: '',
      accountId: accounts[0]?.id || ''
    });
  };

  const openEditModal = (exp: any) => {
    setEditingExpense(exp);
    setFormData({ 
      name: exp.name, amount: exp.amount, category: exp.category, 
      date: exp.date, description: exp.description, accountId: exp.accountId 
    });
    setIsModalOpen(true);
  };

  const filteredExpenses = expenses
    .filter(exp => exp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <header className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Expenses</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Log Expense</button>
      </header>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
        <input 
          type="text" placeholder="Search transactions..." 
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', color: 'white', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredExpenses.map(exp => {
          const account = accounts.find(a => a.id === exp.accountId);
          const categoryObj = categories.find(c => c.name === exp.category);
          return (
            <div key={exp.id} className="glass" style={{ padding: '1rem' }}>
              <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{exp.name}</h3>
                <p className={exp.type === 'Transfer In' ? 'text-success' : 'text-danger'} style={{ fontWeight: 700 }}>
                  {exp.type === 'Transfer In' ? '+' : '-'}₹{exp.amount}
                </p>
              </div>
              <div className="flex-between">
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: categoryObj?.color || 'inherit' }}>● </span>
                    {exp.category} • {exp.date}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'hsl(var(--primary))' }}>{account?.name || 'Unknown Account'}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {exp.category !== 'Internal' && (
                    <>
                      <button onClick={() => openEditModal(exp)} style={{ color: 'rgba(255,255,255,0.3)' }}><Edit2 size={14} /></button>
                      <button onClick={() => deleteExpense(exp.id)} style={{ color: 'rgba(239, 68, 68, 0.5)' }}><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredExpenses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.4 }}>
            <p>No transactions found.</p>
          </div>
        )}
      </div>

      {/* Expense Modal */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', 
          zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' 
        }}>
          <div className="glass" style={{ 
            width: '100%', maxWidth: '600px', padding: '2rem', borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
            borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem', overflowY: 'auto', maxHeight: '80vh'
          }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingExpense ? 'Edit Expense' : 'Log New Expense'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingExpense(null); }} style={{ color: 'rgba(255,255,255,0.5)' }}><X size={24} /></button>
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
                <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Expense Name</label>
                <input 
                  type="text" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                  placeholder="e.g. Grocery Shopping"
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
                  <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Date</label>
                  <input 
                    type="date" required value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Paid From</label>
                <select 
                  required
                  value={formData.accountId}
                  onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                >
                  <option value="" disabled>Select Account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} (₹{acc.balance.toLocaleString()})</option>
                  ))}
                </select>
                {accounts.length === 0 && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>Please add an account first.</p>}
              </div>

              <button type="submit" className="btn-primary" disabled={accounts.length === 0} style={{ marginTop: '1rem', width: '100%' }}>
                {editingExpense ? 'Update Transaction' : 'Confirm Payment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
