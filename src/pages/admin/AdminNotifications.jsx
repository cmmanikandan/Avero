
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Send, Users, Store, Smartphone, Mail, MessageSquare, Clock, CheckCircle2, Megaphone } from 'lucide-react';

const INITIAL_LOG = [
  { id: 'notif-1', title: 'Monsoon Sale — 70% Off Electronics', audience: 'ALL_BUYERS', channel: 'PUSH', sentAt: '22 Aug 2026, 10:30 AM', reach: 84290, opened: 41200 },
  { id: 'notif-2', title: 'Commission rate update for Fashion category', audience: 'ALL_SELLERS', channel: 'EMAIL', sentAt: '21 Aug 2026, 3:15 PM', reach: 1420, opened: 1100 },
  { id: 'notif-3', title: 'New delivery zone: Tier-3 cities added', audience: 'DELIVERY_AGENTS', channel: 'SMS', sentAt: '20 Aug 2026, 9:00 AM', reach: 340, opened: 310 },
];

const AUDIENCES = [
  { value: 'ALL_BUYERS', label: 'All Buyers (84,290)', icon: '👥' },
  { value: 'ALL_SELLERS', label: 'All Sellers (1,420)', icon: '🏪' },
  { value: 'PREMIUM_BUYERS', label: 'Premium Subscribers', icon: '⭐' },
  { value: 'DELIVERY_AGENTS', label: 'Delivery Agents (340)', icon: '🚴' },
];

const CHANNELS = [
  { value: 'PUSH', label: 'Push Notification', icon: Smartphone },
  { value: 'EMAIL', label: 'Email Campaign', icon: Mail },
  { value: 'SMS', label: 'SMS Alert', icon: MessageSquare },
];

const INP = { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#1E293B', backgroundColor: '#F8FAFC', outline: 'none', boxSizing: 'border-box' };

export default function AdminNotifications() {
  const { showToast } = useApp();
  const [audience, setAudience] = useState('ALL_BUYERS');
  const [channel, setChannel] = useState('PUSH');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [log, setLog] = useState(INITIAL_LOG);
  const [activeTab, setActiveTab] = useState('compose');

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) { showToast('Please enter title and message', 'error'); return; }
    const aud = AUDIENCES.find(a => a.value === audience);
    const reach = audience === 'ALL_BUYERS' ? 84290 : audience === 'ALL_SELLERS' ? 1420 : audience === 'DELIVERY_AGENTS' ? 340 : 12800;
    setLog(prev => [{
      id: 'notif-' + Date.now(), title, audience, channel,
      sentAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      reach, opened: Math.floor(reach * 0.48)
    }, ...prev]);
    showToast('Broadcast dispatched to ' + aud.label + ' via ' + channel + '!', 'success');
    setTitle(''); setMessage('');
    setActiveTab('history');
  };

  const tabStyle = (t) => ({
    padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700',
    backgroundColor: activeTab === t ? '#2563EB' : 'transparent',
    color: activeTab === t ? '#fff' : '#64748B',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0F172A' }}>Broadcast Notifications & Alerts</h1>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>Send Push, SMS, and Email notifications to buyers, sellers, or delivery agents</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Sent This Month', value: log.length + 41, color: '#2563EB' },
          { label: 'Total Reached', value: (log.reduce((s,l) => s + l.reach, 0) + 180000).toLocaleString('en-IN'), color: '#7C3AED' },
          { label: 'Avg Open Rate', value: '48.2%', color: '#16A34A' },
          { label: 'Unsubscribes', value: '0.3%', color: '#64748B' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px 16px' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '6px' }}>
          <button type="button" style={tabStyle('compose')} onClick={() => setActiveTab('compose')}><Megaphone size={14} style={{ display: 'inline', marginRight: '5px' }} /> Compose</button>
          <button type="button" style={tabStyle('history')} onClick={() => setActiveTab('history')}><Clock size={14} style={{ display: 'inline', marginRight: '5px' }} /> Sent History ({log.length})</button>
        </div>

        {activeTab === 'compose' ? (
          <form onSubmit={handleBroadcast} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Audience & Channel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>Target Audience</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {AUDIENCES.map(a => (
                    <label key={a.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: '1px solid ' + (audience === a.value ? '#BFDBFE' : '#E2E8F0'), backgroundColor: audience === a.value ? '#EFF6FF' : '#F8FAFC', cursor: 'pointer', fontSize: '13px', fontWeight: audience === a.value ? '700' : '500', color: audience === a.value ? '#1D4ED8' : '#374151' }}>
                      <input type="radio" name="audience" value={a.value} checked={audience === a.value} onChange={() => setAudience(a.value)} style={{ display: 'none' }} />
                      <span>{a.icon}</span> {a.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>Delivery Channel</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {CHANNELS.map(c => {
                    const Icon = c.icon;
                    return (
                      <label key={c.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: '1px solid ' + (channel === c.value ? '#BFDBFE' : '#E2E8F0'), backgroundColor: channel === c.value ? '#EFF6FF' : '#F8FAFC', cursor: 'pointer', fontSize: '13px', fontWeight: channel === c.value ? '700' : '500', color: channel === c.value ? '#1D4ED8' : '#374151' }}>
                        <input type="radio" name="channel" value={c.value} checked={channel === c.value} onChange={() => setChannel(c.value)} style={{ display: 'none' }} />
                        <Icon size={15} /> {c.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>Notification Title *</label>
              <input style={INP} placeholder="e.g. Flash Sale — 70% Off Today Only!" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '5px' }}>Message Body *</label>
              <textarea style={{ ...INP, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} placeholder="Write your notification message..." value={message} onChange={e => setMessage(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#2563EB', color: '#fff', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
                <Send size={15} /> Send Broadcast
              </button>
            </div>
          </form>
        ) : (
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {log.map(entry => (
                <div key={entry.id} style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', marginBottom: '4px' }}>{entry.title}</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>{entry.channel}</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#F0FDF4', color: '#16A34A' }}>{AUDIENCES.find(a => a.value === entry.audience)?.label || entry.audience}</span>
                        <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={11} /> {entry.sentAt}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{entry.reach.toLocaleString('en-IN')} reached</div>
                      <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '600' }}><CheckCircle2 size={11} style={{ display: 'inline' }} /> {entry.opened.toLocaleString('en-IN')} opened ({Math.round(entry.opened / entry.reach * 100)}%)</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
