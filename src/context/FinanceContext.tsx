'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Category {
  id: string;
  name: string;
  type: 'Expense' | 'Income' | 'Internal'; // Internal for transfers
  icon: string;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: 'INR';
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  accountId: string;
  status: 'Cleared' | 'Pending';
  type: 'Expense' | 'Transfer Out' | 'Transfer In';
  createdAt: string;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  category: string;
  month: string;
  description: string;
  status: 'Active' | 'Completed';
  createdAt: string;
}

interface FinanceContextType {
  accounts: Account[];
  expenses: Expense[];
  budgets: Budget[];
  categories: Category[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'currency'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'status' | 'type'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'status'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  transferAmount: (fromId: string, toId: string, amount: number, description?: string) => void;
  exportData: () => void;
  importData: (jsonData: string) => void;
  clearAllData: () => void;
  totalBalance: number;
  monthlySpend: number;
  monthlyBudget: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', type: 'Expense', icon: 'Utensils', color: '#ef4444' },
  { id: '2', name: 'Housing & Rent', type: 'Expense', icon: 'Home', color: '#3b82f6' },
  { id: '3', name: 'Transportation', type: 'Expense', icon: 'Car', color: '#10b981' },
  { id: '4', name: 'Entertainment', type: 'Expense', icon: 'Tv', color: '#8b5cf6' },
  { id: '5', name: 'Shopping', type: 'Expense', icon: 'ShoppingBag', color: '#f59e0b' },
  { id: '6', name: 'Health', type: 'Expense', icon: 'Activity', color: '#ec4899' },
  { id: '7', name: 'Utilities', type: 'Expense', icon: 'Zap', color: '#6366f1' },
  { id: '8', name: 'Miscellaneous', type: 'Expense', icon: 'Layers', color: '#94a3b8' },
];

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('spendy_accounts');
    const savedExpenses = localStorage.getItem('spendy_expenses');
    const savedBudgets = localStorage.getItem('spendy_budgets');
    const savedCategories = localStorage.getItem('spendy_categories');

    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
    
    setInitialized(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('spendy_accounts', JSON.stringify(accounts));
      localStorage.setItem('spendy_expenses', JSON.stringify(expenses));
      localStorage.setItem('spendy_budgets', JSON.stringify(budgets));
      localStorage.setItem('spendy_categories', JSON.stringify(categories));
    }
  }, [accounts, expenses, budgets, categories, initialized]);

  const addAccount = (acc: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'currency'>) => {
    const newAcc: Account = {
      ...acc,
      id: crypto.randomUUID(),
      currency: 'INR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAccounts([...accounts, newAcc]);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, ...updates, updatedAt: new Date().toISOString() } : acc
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const addExpense = (exp: Omit<Expense, 'id' | 'createdAt' | 'status' | 'type'>) => {
    const newExp: Expense = {
      ...exp,
      id: crypto.randomUUID(),
      status: 'Cleared',
      type: 'Expense',
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [...prev, newExp]);

    // Update account balance
    const account = accounts.find(a => a.id === exp.accountId);
    if (account) {
      updateAccount(account.id, { balance: account.balance - exp.amount });
    }
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const deleteExpense = (id: string) => {
    const exp = expenses.find(e => e.id === id);
    if (exp) {
      const account = accounts.find(a => a.id === exp.accountId);
      if (account) {
        updateAccount(account.id, { balance: account.balance + exp.amount });
      }
    }
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const addBudget = (bud: Omit<Budget, 'id' | 'createdAt' | 'status'>) => {
    const newBud: Budget = {
      ...bud,
      id: crypto.randomUUID(),
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setBudgets(prev => [...prev, newBud]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(prev => prev.map(bud => bud.id === id ? { ...bud, ...updates } : bud));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(bud => bud.id !== id));
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: crypto.randomUUID() };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const transferAmount = (fromId: string, toId: string, amount: number, description: string = 'Account Transfer') => {
    const fromAccount = accounts.find(a => a.id === fromId);
    const toAccount = accounts.find(a => a.id === toId);

    if (!fromAccount || !toAccount) return;

    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();

    // Create records for history
    const outRecord: Expense = {
      id: crypto.randomUUID(),
      name: `Transfer to ${toAccount.name}`,
      amount: amount,
      category: 'Internal',
      date,
      description,
      accountId: fromId,
      status: 'Cleared',
      type: 'Transfer Out',
      createdAt: timestamp,
    };

    const inRecord: Expense = {
      id: crypto.randomUUID(),
      name: `Transfer from ${fromAccount.name}`,
      amount: amount,
      category: 'Internal',
      date,
      description,
      accountId: toId,
      status: 'Cleared',
      type: 'Transfer In',
      createdAt: timestamp,
    };

    setExpenses(prev => [...prev, outRecord, inRecord]);

    // Update balances
    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromId) return { ...acc, balance: acc.balance - amount, updatedAt: timestamp };
      if (acc.id === toId) return { ...acc, balance: acc.balance + amount, updatedAt: timestamp };
      return acc;
    }));
  };

  const exportData = () => {
    const data = {
      accounts,
      expenses,
      budgets,
      categories,
      exportedAt: new Date().toISOString(),
      version: '1.1'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spendy_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.accounts) setAccounts(data.accounts);
      if (data.expenses) setExpenses(data.expenses);
      if (data.budgets) setBudgets(data.budgets);
      if (data.categories) setCategories(data.categories);
      alert('Data imported successfully!');
    } catch (e) {
      alert('Failed to import data. Please ensure the file is a valid SpendY backup.');
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      setAccounts([]);
      setExpenses([]);
      setBudgets([]);
      setCategories(DEFAULT_CATEGORIES);
      localStorage.removeItem('spendy_accounts');
      localStorage.removeItem('spendy_expenses');
      localStorage.removeItem('spendy_budgets');
      localStorage.removeItem('spendy_categories');
    }
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlySpend = expenses
    .filter(e => e.date.startsWith(currentMonth) && e.type === 'Expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const monthlyBudget = budgets
    .filter(b => b.month === currentMonth)
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <FinanceContext.Provider value={{
      accounts, expenses, budgets, categories,
      addAccount, updateAccount, deleteAccount,
      addExpense, updateExpense, deleteExpense,
      addBudget, updateBudget, deleteBudget,
      addCategory, updateCategory, deleteCategory,
      transferAmount,
      exportData, importData, clearAllData,
      totalBalance, monthlySpend, monthlyBudget
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
}
