'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function Dashboard() {
  const { totalBalance, monthlySpend, monthlyBudget, expenses } = useFinance();
  
  const remainingBudget = Math.max(0, monthlyBudget - monthlySpend);
  const budgetPercentage = monthlyBudget > 0 ? Math.min(100, (monthlySpend / monthlyBudget) * 100) : 0;

  // Prepare data for Trend Chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const trendData = last7Days.map(date => {
    const dailySpend = expenses
      .filter(e => e.date === date)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: date.split('-').slice(2).join('/'), spend: dailySpend };
  });

  // Prepare data for Category Pie Chart
  const categoryData = expenses
    .reduce((acc: any[], curr) => {
      const existing = acc.find(a => a.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, [])
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header className="flex-between">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>SpendY</h1>
        <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
           <span role="img" aria-label="user">👤</span>
        </div>
      </header>

      {/* Main Balance Card */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <p className="card-title">Total Balance</p>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>₹{totalBalance.toLocaleString()}</h2>
        <div className="flex-between">
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>This Month</p>
            <p className="text-danger" style={{ fontWeight: 600 }}>-₹{monthlySpend.toLocaleString()}</p>
          </div>
          <TrendingUp size={24} className="text-success" />
        </div>
      </div>

      {/* Monthly Budget Tracker */}
      <div className="glass" style={{ padding: '1.25rem' }}>
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Budget Status</h3>
          <span style={{ fontSize: '0.875rem' }}>{Math.round(budgetPercentage)}%</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${budgetPercentage}%`, 
            background: 'hsl(var(--primary))',
            borderRadius: '4px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' 
          }} />
        </div>
        <div className="flex-between" style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
           <span className="text-muted">Spent: ₹{monthlySpend.toLocaleString()}</span>
           <span className="text-muted">Target: ₹{monthlyBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Spending Trend</h3>
        <div style={{ height: '200px', width: '100%' }}>
          <ResponsiveContainer>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(20,20,20,0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)'
                }}
              />
              <Area type="monotone" dataKey="spend" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <section>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Expenses</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {expenses.slice(-3).reverse().map(exp => (
            <div key={exp.id} className="glass" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600 }}>{exp.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{exp.category}</p>
              </div>
              <p className="text-danger" style={{ fontWeight: 700 }}>-₹{exp.amount}</p>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-muted" style={{ textAlign: 'center', padding: '1rem' }}>No expenses logged yet.</p>}
        </div>
      </section>
    </div>
  );
}
