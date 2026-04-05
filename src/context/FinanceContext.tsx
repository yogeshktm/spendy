'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'currency'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'status'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'status'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  exportData: () => void;
  importData: (jsonData: string) => void;
  clearAllData: () => void;
  totalBalance: number;
  monthlySpend: number;
  monthlyBudget: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('spendy_accounts');
    const savedExpenses = localStorage.getItem('spendy_expenses');
    const savedBudgets = localStorage.getItem('spendy_budgets');

    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    
    setInitialized(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('spendy_accounts', JSON.stringify(accounts));
      localStorage.setItem('spendy_expenses', JSON.stringify(expenses));
      localStorage.setItem('spendy_budgets', JSON.stringify(budgets));
    }
  }, [accounts, expenses, budgets, initialized]);

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
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, ...updates, updatedAt: new Date().toISOString() } : acc
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const addExpense = (exp: Omit<Expense, 'id' | 'createdAt' | 'status'>) => {
    const newExp: Expense = {
      ...exp,
      id: crypto.randomUUID(),
      status: 'Cleared',
      createdAt: new Date().toISOString(),
    };
    setExpenses([...expenses, newExp]);

    // Update account balance
    const account = accounts.find(a => a.id === exp.accountId);
    if (account) {
      updateAccount(account.id, { balance: account.balance - exp.amount });
    }
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const deleteExpense = (id: string) => {
    const exp = expenses.find(e => e.id === id);
    if (exp) {
      const account = accounts.find(a => a.id === exp.accountId);
      if (account) {
        updateAccount(account.id, { balance: account.balance + exp.amount });
      }
    }
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const addBudget = (bud: Omit<Budget, 'id' | 'createdAt' | 'status'>) => {
    const newBud: Budget = {
      ...bud,
      id: crypto.randomUUID(),
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setBudgets([...budgets, newBud]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(budgets.map(bud => bud.id === id ? { ...bud, ...updates } : bud));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(bud => bud.id !== id));
  };

  const exportData = () => {
    const data = {
      accounts,
      expenses,
      budgets,
      exportedAt: new Date().toISOString(),
      version: '1.0'
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
      localStorage.removeItem('spendy_accounts');
      localStorage.removeItem('spendy_expenses');
      localStorage.removeItem('spendy_budgets');
    }
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlySpend = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const monthlyBudget = budgets
    .filter(b => b.month === currentMonth)
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <FinanceContext.Provider value={{
      accounts, expenses, budgets,
      addAccount, updateAccount, deleteAccount,
      addExpense, updateExpense, deleteExpense,
      addBudget, updateBudget, deleteBudget,
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
