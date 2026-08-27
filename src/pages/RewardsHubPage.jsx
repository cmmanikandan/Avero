import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ScratchCardModal from '../components/rewards/ScratchCardModal';
import {
  Sparkles,
  Gift,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  History,
  ShieldCheck,
  ShoppingBag,
  Zap,
  ArrowRight,
  Lock
} from 'lucide-react';

export default function RewardsHubPage() {
  const { rewardCoins, setRewardCoins, user, showToast } = useApp();
  const [isScratchOpen, setIsScratchOpen] = useState(false);
  const [checkedDays, setCheckedDays] = useState([true, true, true, false, false, false, false]);
  const [claimedToday, setClaimedToday] = useState(false);

  const totalCoins = rewardCoins || 350;

  const handleClaimDailyCheckin = () => {
    if (claimedToday) {
      showToast('You have already claimed today\'s check-in bonus!', 'info');
      return;
    }
    setClaimedToday(true);
    setCheckedDays(prev => {
      const next = [...prev];
      const nextIdx = next.findIndex(d => !d);
      if (nextIdx !== -1) next[nextIdx] = true;
      return next;
    });
    setRewardCoins(prev => (prev || 350) + 15);
    showToast('🎉 +15 SuperCoins added to your balance!', 'success');
  };

  const rewardsStore = [
    {
      id: 'rwd-1',
      title: 'Flat ₹100 Off on Next Order',
      coins: 100,
      value: '₹100 Value',
      category: 'Discount Voucher',
      icon: '🏷️',
      color: '#EFF6FF',
      borderColor: '#BFDBFE'
    },
    {
      id: 'rwd-2',
      title: 'SonyLIV 1-Month Premium Subscription',
      coins: 250,
      value: '₹299 Value',
      category: 'OTT & Entertainment',
      icon: '🎬',
      color: '#FEF3C7',
      borderColor: '#FDE68A'
    },
    {
      id: 'rwd-3',
      title: 'Gaana Plus 3-Month Ad-Free Music',
      coins: 180,
      value: '₹199 Value',
      category: 'Music & Audio',
      icon: '🎵',
      color: '#F3E8FF',
      borderColor: '#E9D5FF'
    },
    {
      id: 'rwd-4',
      title: 'Domino’s Pizza ₹200 e-Voucher',
      coins: 200,
      value: '₹200 Value',
      category: 'Food & Dining',
      icon: '🍕',
      color: '#FEE2E2',
      borderColor: '#FECACA'
    },
    {
      id: 'rwd-5',
      title: 'Myntra ₹500 Fashion Gift Card',
      coins: 500,
      value: '₹500 Value',
      category: 'Fashion Voucher',
      icon: '👗',
      color: '#ECFDF5',
      borderColor: '#A7F3D0'
    },
    {
      id: 'rwd-6',
      title: 'Free Priority Doorstep Delivery for 30 Days',
      coins: 150,
      value: '₹160 Value',
      category: 'Avero VIP Perks',
      icon: '⚡',
      color: '#EFF6FF',
      borderColor: '#BFDBFE'
    }
  ];

  const coinPassbook = [
    { type: 'EARNED', desc: 'Order #OD23436488233 Completed', date: 'Yesterday, 4:30 PM', coins: '+45' },
    { type: 'EARNED', desc: 'Daily Check-in Bonus Streak', date: '2 days ago', coins: '+15' },
    { type: 'SPENT', desc: 'Redeemed ₹50 Discount on Checkout', date: '3 days ago', coins: '-50' },
    { type: 'EARNED', desc: 'Review & Photo Upload on Nothing Phone (2)', date: '5 days ago', coins: '+25' },
    { type: 'EARNED', desc: 'Welcome Bonus for Avero Registration', date: '10 days ago', coins: '+100' }
  ];

  const handleRedeemReward = (reward) => {
    if (totalCoins < reward.coins) {
      showToast(`You need ${reward.coins - totalCoins} more SuperCoins to claim this reward!`, 'error');
      return;
    }
    setRewardCoins(prev => prev - reward.coins);
    showToast(`🎉 Success! ${reward.title} has been claimed. Voucher sent to your email!`, 'success');
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '60px', paddingTop: '20px' }}>
      <div className="container" style={{ maxWidth: '920px', margin: '0 auto' }}>

        {/* Hero SuperCoins Balance Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #78350F 0%, #D97706 50%, #F59E0B 100%)',
            borderRadius: '20px',
            padding: '28px 24px',
            color: '#FFFFFF',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(217, 119, 6, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#FEF3C7', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              🪙 Avero SuperCoins Club • VIP Tier
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
              <span style={{ fontSize: '42px', fontWeight: '900', color: '#FFFFFF', lineHeight: 1 }}>
                {totalCoins}
              </span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#FEF3C7' }}>
                SuperCoins
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#FEF3C7', margin: '6px 0 0' }}>
              1 SuperCoin = ₹1 INR. Redeem instant discounts during checkout or claim OTT passes & vouchers below.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsScratchOpen(true)}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#92400E',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '900',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={18} color="#D97706" /> Scratch & Win ✨
          </button>
        </div>

        {/* 7-Day Daily Check-in Streak */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={18} color="#2563EB" /> 7-Day Daily Check-in Streak
              </h2>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Check in daily to earn guaranteed SuperCoins and surprise gift cards</span>
            </div>

            <button
              type="button"
              onClick={handleClaimDailyCheckin}
              disabled={claimedToday}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: claimedToday ? '#10B981' : '#2563EB',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: claimedToday ? 'default' : 'pointer'
              }}
            >
              {claimedToday ? '✓ Claimed Today' : 'Claim +15 Coins'}
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px'
            }}
          >
            {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((day, idx) => {
              const isDone = checkedDays[idx];
              const coins = idx === 6 ? '+50 🎁' : `+${10 + idx * 2}`;

              return (
                <div
                  key={day}
                  style={{
                    backgroundColor: isDone ? '#EFF6FF' : '#F8FAFC',
                    border: isDone ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '10px 4px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isDone ? '#1D4ED8' : '#64748B' }}>
                    {day}
                  </span>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? '#2563EB' : '#E2E8F0',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '900'
                  }}>
                    {isDone ? <CheckCircle2 size={15} /> : '🪙'}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: isDone ? '#2563EB' : '#475569' }}>
                    {coins}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SuperCoins Rewards Store Grid */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gift size={18} color="#D97706" /> SuperCoins Rewards Store
              </h2>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Exchange your accumulated SuperCoins for digital passes, vouchers & memberships</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563EB' }}>
              6 Rewards Available
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '14px'
            }}
          >
            {rewardsStore.map((rwd) => {
              const canRedeem = totalCoins >= rwd.coins;

              return (
                <div
                  key={rwd.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: `1px solid ${rwd.borderColor}`,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: rwd.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0
                    }}>
                      {rwd.icon}
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
                        {rwd.category}
                      </span>
                      <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A', margin: '2px 0 0', lineHeight: '1.3' }}>
                        {rwd.title}
                      </h4>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '900', color: '#D97706' }}>🪙 {rwd.coins}</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>({rwd.value})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRedeemReward(rwd)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: canRedeem ? '#D97706' : '#E2E8F0',
                        color: canRedeem ? '#FFFFFF' : '#94A3B8',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: canRedeem ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {canRedeem ? 'Redeem Now' : 'Need More Coins'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SuperCoins Passbook / Transaction History */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <History size={18} color="#475569" /> Coins Activity & Passbook
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {coinPassbook.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                    {item.desc}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    {item.date}
                  </div>
                </div>

                <span style={{
                  fontSize: '14px',
                  fontWeight: '900',
                  color: item.type === 'EARNED' ? '#059669' : '#DC2626'
                }}>
                  {item.coins} Coins
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ScratchCardModal
        isOpen={isScratchOpen}
        onClose={() => setIsScratchOpen(false)}
        onClaim={(coins) => setRewardCoins(prev => (prev || 350) + coins)}
      />
    </div>
  );
}
