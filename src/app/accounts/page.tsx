'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Plus, Wallet, Trash2, Edit2, X } from 'lucide-react';

export default function AccountsPage() {
  const { accounts, addAccount, deleteAccount, updateAccount } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Bank',
    balance: 0,
    status: 'Active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount) {
      updateAccount(editingAccount.id, formData);
    } else {
      addAccount(formData);
    }
    setIsModalOpen(false);
    setEditingAccount(null);
    setFormData({ name: '', type: 'Bank', balance: 0, status: 'Active' });
  };

  const openEditModal = (acc: any) => {
    setEditingAccount(acc);
    setFormData({ name: acc.name, type: acc.type, balance: acc.balance, status: acc.status });
    setIsModalOpen(true);
  };

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Accounts</h1>
        <button 
          className="btn-primary" 
          style={{ padding: '0.5rem 1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {accounts.map(acc => (
          <div key={acc.id} className="glass-card" style={{ padding: '1.25rem', position: 'relative' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
                  <Wallet size={20} style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{acc.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{acc.type}</p>
                </div>
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{acc.balance.toLocaleString()}</p>
            </div>
            <div className="flex-between" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: acc.status === 'Active' ? '#10b981' : '#ef4444' }}>
                ● {acc.status}
              </span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => openEditModal(acc)} style={{ color: 'rgba(255,255,255,0.5)' }}><Edit2 size={16} /></button>
                <button onClick={() => deleteAccount(acc.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Wallet size={48} style={{ opacity: 0.2 }} />
            <p className="text-muted">No accounts added yet.</p>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Add your first account</button>
          </div>
        )}
      </div>

      {/* Basic Modal Implementation */}
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingAccount ? 'Edit Account' : 'Add Account'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingAccount(null); }} style={{ color: 'rgba(255,255,255,0.5)' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Account Name</label>
                <input 
                  type="text" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                  placeholder="e.g. SBI Savings"
                />
              </div>
              
              <div>
                <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Account Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                >
                  <option value="Bank">Bank Account</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="UPI">UPI / Wallet</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', display: 'block' }}>Initial Balance (₹)</label>
                <input 
                  type="number" required value={formData.balance}
                  onChange={e => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', color: 'white', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                {editingAccount ? 'Update Account' : 'Save Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
