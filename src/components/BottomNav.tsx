'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, CreditCard, PieChart, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounts', icon: Wallet },
  { href: '/expenses', label: 'Transactions', icon: CreditCard },
  { href: '/budgets', label: 'Budgets', icon: PieChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="glass" style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      height: '4rem',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      padding: '0 0.5rem',
      borderRadius: '2rem',
    }}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
          }}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 600 : 400 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
