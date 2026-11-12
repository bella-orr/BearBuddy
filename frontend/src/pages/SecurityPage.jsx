import React, { useState } from 'react';

export default function SecurityPage({ darkMode }) {
  const [habits, setHabits] = useState([
    { id: 1, title: 'Use a unique password', detail: 'Personal email · Reuse flagged in demo', icon: '🔑', status: 'review' },
    { id: 2, title: 'Review two-step sign-in', detail: 'GitHub · Not marked as enabled', icon: '📱', status: 'review' }
  ]);

  const [accounts, setAccounts] = useState([
    { id: 1, name: 'UC account', detail: 'SSO · poudelbp@mail.uc.edu', badge: 'SSO' },
    { id: 2, name: 'Personal email', detail: 'Personal · Sample account', badge: 'Review' },
    { id: 3, name: 'GitHub', detail: 'Coursework · connected', badge: 'Review' }
  ]);

  const handleToggleHabit = (habitId, currentStatus) => {
    const nextStatus = currentStatus === 'done' ? 'review' : 'done';
    setHabits(habits.map(h => h.id === habitId ? { ...h, status: nextStatus } : h));
  };

  const completedCount = habits.filter(h => h.status === 'done').length;

  const bg = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#f3f4f6' : '#111827';
  const cardBg = darkMode ? '#18181b' : '#f9fafb';
  const borderColor = darkMode ? '#27272a' : '#e4e4e7';
  const subText = darkMode ? '#a1a1aa' : '#6b7280';

  return (
    <section className="page" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '16px 20px', boxSizing: 'border-box', overflowY: 'auto', backgroundColor: bg, color: textColor }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '0.62rem', fontWeight: '700', color: '#71717a', letterSpacing: '0.8px' }}>
            SMALL HABITS, STRONGER ACCOUNTS.
          </span>
          <h1 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '2px 0 0 0', color: textColor }}>
            Student security
          </h1>
        </div>
        <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ?
        </button>
      </div>

      {/* Hero Checklist Card */}
      <div style={{ backgroundColor: '#151518', color: '#ffffff', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid #27272a' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: '700', color: '#a1a1aa', letterSpacing: '0.6px', marginBottom: '6px' }}>
          YOUR DEMO CHECKLIST
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px' }}>
          {completedCount} of {habits.length} habits set
        </div>
        <div style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: '1.3' }}>
          A little attention goes a long way. Start with the habits below.
        </div>
      </div>

      {/* Worth a quick look */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: textColor }}>Worth a quick look</span>
        <span style={{ fontSize: '0.75rem', color: '#E00122', fontWeight: '600' }}>
          {habits.filter(h => h.status !== 'done').length} to review
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
        {habits.map((habit) => (
          <div 
            key={habit.id} 
            onClick={() => handleToggleHabit(habit.id, habit.status)}
            style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderRadius: '14px', border: `1px solid ${borderColor}`, backgroundColor: cardBg, gap: '12px', opacity: habit.status === 'done' ? 0.6 : 1, cursor: 'pointer' }}
          >
            <div style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(224, 1, 34, 0.1)' }}>
              {habit.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '2px', color: textColor, textDecoration: habit.status === 'done' ? 'line-through' : 'none' }}>
                {habit.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: subText }}>{habit.detail}</div>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: habit.status === 'done' ? '#10b981' : '#E00122' }}>
              {habit.status === 'done' ? '✓ Done' : 'Review ›'}
            </span>
          </div>
        ))}
      </div>

      {/* Account organizer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: textColor }}>Your account organizer</span>
        <span style={{ fontSize: '0.75rem', color: '#E00122', fontWeight: '600', cursor: 'pointer' }}>+ Add</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
        {accounts.map((acc) => (
          <div key={acc.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderRadius: '14px', border: `1px solid ${borderColor}`, backgroundColor: cardBg, gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '2px', color: textColor }}>{acc.name}</div>
              <div style={{ fontSize: '0.72rem', color: subText }}>{acc.detail}</div>
            </div>
            <span style={{
              fontSize: '0.7rem', fontWeight: '700', padding: '3px 10px', borderRadius: '12px',
              backgroundColor: acc.badge === 'SSO' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: acc.badge === 'SSO' ? '#10b981' : '#f59e0b'
            }}>
              {acc.badge}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}