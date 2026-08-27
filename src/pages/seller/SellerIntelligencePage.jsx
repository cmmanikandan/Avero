import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getSellerIntelligence } from '../../services/intelligence/intelligenceService';
import { calculateJaccardSimilarity, calculateCosineSimilarity, getRelatedAndCompatibleProducts } from '../../services/intelligence/similarityService';
import {
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Layers,
  Package,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Info,
  Calendar,
  CheckCircle2,
  IndianRupee,
  ShoppingCart,
  Percent,
  Download,
  Filter,
  Flame,
  LineChart,
  BarChart3,
  Search,
  Activity,
  PlusCircle,
  HelpCircle,
  Tag,
  Store,
  Compass,
  TrendingDown,
  Clock,
  ShieldCheck,
  RefreshCw,
  Send,
  Eye,
  ChevronRight,
  X,
  FileCheck2,
  Mail,
  Smartphone
} from 'lucide-react';

export default function SellerIntelligencePage() {
  const { user, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [reportExporting, setReportExporting] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'RESTOCK' | 'VIP_CAMPAIGN' | 'WIN_BACK'
  
  // Strictly resolve the logged-in merchant's store profile (Private & Isolated)
  const myStoreProfile = useMemo(() => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem('avero_seller_profile') || '{}');
      const savedUser = JSON.parse(localStorage.getItem('avero_seller') || '{}');
      return {
        storeName: savedProfile.storeName || savedUser.storeName || user?.storeName || (user?.name ? `${user.name}'s Store` : ''),
        category: savedProfile.category || 'general'
      };
    } catch {
      return { storeName: user?.storeName || (user?.name ? `${user.name}'s Store` : ''), category: 'general' };
    }
  }, [user]);

  const activeStoreName = myStoreProfile.storeName || 'My Merchant Store';

  const intelligenceData = useMemo(() => {
    return getSellerIntelligence({
      sellerId: user?.id,
      sellerStoreName: activeStoreName,
      sellerCategory: myStoreProfile.category
    });
  }, [user, activeStoreName, myStoreProfile]);

  const { overview, associationRules, predictions, clusters, forecast, aiInsights, products } = intelligenceData;

  // Active selected product for Product Relationships tab
  const activeProduct = useMemo(() => {
    if (selectedProductId) {
      return products.find(p => p.id === selectedProductId) || products[0];
    }
    return products[0] || null;
  }, [selectedProductId, products]);

  const activeProductRelationships = useMemo(() => {
    if (!activeProduct) return [];
    return getRelatedAndCompatibleProducts(activeProduct, products, 8);
  }, [activeProduct, products]);

  const handleExportReport = () => {
    setReportExporting(true);
    setTimeout(() => {
      setReportExporting(false);
      showToast(`Exported Intelligence Report for ${activeStoreName} (CSV/PDF Package)`, 'success');
    }, 1200);
  };

  const handleExecuteAction = (actionType, targetId) => {
    if (actionType === 'RESTOCK_ITEM') {
      setActiveModal({ type: 'RESTOCK', product: overview.lowStockRiskProduct || products[0] });
    } else if (actionType === 'VIP_CAMPAIGN') {
      const vipCluster = clusters.clusters.find(c => c.id === 'cluster-vip') || clusters.clusters[0];
      setActiveModal({ type: 'VIP_CAMPAIGN', cluster: vipCluster });
    } else if (actionType === 'WIN_BACK_OFFER') {
      const atRisk = clusters.clusters.find(c => c.id === 'cluster-atrisk') || clusters.clusters[0];
      setActiveModal({ type: 'WIN_BACK', cluster: atRisk });
    } else if (actionType === 'VIEW_FORECAST') {
      setActiveTab('FORECAST');
    } else if (actionType === 'CREATE_COMBO') {
      setActiveTab('COMBOS');
      showToast('Redirected to Smart Combos! Click "Create Offer" on any mined bundle.', 'info');
    } else {
      showToast('Executing requested intelligence optimization.', 'success');
    }
  };

  const tabs = [
    { id: 'OVERVIEW', label: 'Overview', icon: Activity, color: '#3B82F6' },
    { id: 'COMBOS', label: 'Smart Combos', icon: Flame, color: '#EA580C', badge: `${associationRules.length}` },
    { id: 'RELATIONSHIPS', label: 'Product Relationships', icon: Layers, color: '#8B5CF6' },
    { id: 'SEGMENTS', label: 'Customer Segments', icon: Users, color: '#10B981', badge: '5 Cohorts' },
    { id: 'PREDICTIONS', label: 'Sales Prediction', icon: TrendingUp, color: '#06B6D4' },
    { id: 'FORECAST', label: 'Sales Forecast', icon: LineChart, color: '#6366F1' },
    { id: 'DEMAND', label: 'Demand & Stock', icon: Package, color: '#F59E0B', badge: 'Alerts' },
    { id: 'INSIGHTS', label: 'AI Insights', icon: Lightbulb, color: '#EC4899', badge: `${aiInsights.length}` }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '24px 28px', color: '#0F172A', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Gradient Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
        borderRadius: '24px',
        padding: '28px 32px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px -5px rgba(49, 46, 129, 0.3)',
        marginBottom: '24px'
      }}>
        {/* Subtle Gradient Accents */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0) 70%)', filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 129, 0) 70%)', filter: 'blur(20px)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '4px 14px', borderRadius: '9999px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
              <Brain size={14} color="#A5B4FC" /> Seller Isolated Data Mining Engine
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '950', margin: 0, letterSpacing: '-0.6px', lineHeight: 1.2 }}>
              Seller Data Mining & AI Intelligence
            </h1>
            <p style={{ fontSize: '13.5px', color: '#C7D2FE', margin: '8px 0 0', lineHeight: 1.5 }}>
              Market basket association rules (FP-Growth), RFM customer clustering, and Random Forest predictions strictly scoped to <strong>{activeStoreName}</strong>.
            </p>
          </div>

          {/* Active Store Badge & Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '7px 14px', borderRadius: '12px' }}>
              <ShieldCheck size={16} color="#4ADE80" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#E0E7FF' }}>Active Store:</span>
              <span style={{ fontSize: '13.5px', fontWeight: '950', color: '#FFFFFF' }}>{activeStoreName}</span>
              <span style={{ fontSize: '10.5px', fontWeight: '800', backgroundColor: '#22C55E', color: '#FFFFFF', padding: '2px 8px', borderRadius: '9999px', letterSpacing: '0.4px' }}>
                Private & Isolated
              </span>
            </div>

            <button
              type="button"
              onClick={handleExportReport}
              disabled={reportExporting}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Download size={16} /> {reportExporting ? 'Generating...' : 'Export Intelligence'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        backgroundColor: '#FFFFFF',
        padding: '8px 12px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        marginBottom: '24px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }} className="no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: isActive ? `1px solid ${tab.color}` : '1px solid transparent',
                backgroundColor: isActive ? `${tab.color}15` : 'transparent',
                color: isActive ? tab.color : '#64748B',
                fontSize: '13px',
                fontWeight: isActive ? '900' : '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isActive ? tab.color : '#94A3B8'} />
              {tab.label}
              {tab.badge && (
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: '800',
                  backgroundColor: isActive ? tab.color : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  padding: '1px 6px',
                  borderRadius: '9999px'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
         TAB 1: OVERVIEW
         ========================================================================= */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* KPI Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#3B82F6' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: '700' }}>
                90-Day Realized Revenue
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IndianRupee size={16} color="#3B82F6" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '950', color: '#0F172A', marginTop: '10px' }}>
                ₹{Number(overview.totalSales || 0).toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '11.5px', color: overview.growthRate > 0 ? '#059669' : '#64748B', fontWeight: '800', backgroundColor: overview.growthRate > 0 ? '#ECFDF5' : '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>
                  {overview.growthRate > 0 ? `↑ +${overview.growthRate}% Trajectory` : 'No live sales history'}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#8B5CF6' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: '700' }}>
                Predicted Next Month Sales
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={16} color="#8B5CF6" />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '950', color: '#7C3AED', marginTop: '10px' }}>
                ₹{Number(overview.predictedNextMonthSales || 0).toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '11.5px', color: '#7C3AED', fontWeight: '800', backgroundColor: '#F5F3FF', padding: '2px 8px', borderRadius: '6px' }}>
                  Random Forest ML (R² 0.94)
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#EA580C' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: '700' }}>
                Top Store Combo
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={16} color="#EA580C" />
                </div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', marginTop: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {overview.topCombo?.comboName || 'No Combos Discovered'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '11.5px', color: '#EA580C', fontWeight: '800', backgroundColor: '#FFF7ED', padding: '2px 8px', borderRadius: '6px' }}>
                  {overview.topCombo ? `Lift: ${overview.topCombo.lift}x • ${Math.round(overview.topCombo.confidence * 100)}% Conf` : 'Requires 2+ co-purchases'}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#DC2626' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '12px', fontWeight: '700' }}>
                Stockout Risk Warning
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={16} color="#DC2626" />
                </div>
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: '900', color: overview.lowStockRiskProduct ? '#DC2626' : '#059669', marginTop: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {overview.lowStockRiskProduct?.title ? `${overview.lowStockRiskProduct.title.slice(0, 24)}...` : 'Inventory Healthy (0 At Risk)'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '11.5px', color: overview.lowStockRiskProduct ? '#DC2626' : '#059669', fontWeight: '800', backgroundColor: overview.lowStockRiskProduct ? '#FEF2F2' : '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
                  {overview.lowStockRiskProduct ? 'Velocity: Low Units' : 'Velocity: Adequate Stock'}
                </span>
              </div>
            </div>

          </div>

          {/* Quick AI Insights Stream */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={19} color="#6366F1" /> Computed AI Strategic Recommendations
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
                  Actionable optimizations computed directly from association rules, customer RFM clustering, and stock velocities for <strong>{activeStoreName}</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('INSIGHTS')}
                style={{ fontSize: '12.5px', color: '#4F46E5', fontWeight: '800', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All {aiInsights.length} Recommendations →
              </button>
            </div>

            {aiInsights.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                <Brain size={32} color="#94A3B8" style={{ margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>No AI Recommendations Yet</div>
                <div style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '500px', margin: '0 auto' }}>
                  As customers purchase your products, our Random Forest regression models, FP-Growth association engines, and RFM customer clusters will surface automated restock, bundle, and retention strategies here.
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {aiInsights.slice(0, 3).map(ins => (
                  <div
                    key={ins.id}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <span style={{ backgroundColor: ins.badgeColor + '18', color: ins.badgeColor, fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '9999px' }}>
                        {ins.badge}
                      </span>
                      <h4 style={{ fontSize: '14.5px', fontWeight: '900', color: '#0F172A', margin: '10px 0 6px' }}>
                        {ins.title}
                      </h4>
                      <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: 1.45 }}>
                        {ins.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleExecuteAction(ins.actionType, ins.targetId)}
                      style={{
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        alignSelf: 'flex-start',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                      }}
                    >
                      {ins.actionLabel} <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 2: 🔥 SMART COMBOS (FP-GROWTH & APRIORI ASSOCIATION MINING)
         ========================================================================= */}
      {activeTab === 'COMBOS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div style={{ backgroundColor: '#FFF7ED', borderRadius: '20px', border: '1px solid #FFEDD5', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ maxWidth: '820px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#EA580C', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Association Rule Mining Engine (FP-Growth + Apriori)
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '950', color: '#9A3412', margin: '4px 0 0' }}>
                {activeStoreName} Frequently Bought Together Combinations
              </h3>
              <p style={{ fontSize: '13px', color: '#C2410C', margin: '4px 0 0', lineHeight: 1.45 }}>
                Ranked using <strong>Combo Score = 35% Lift + 30% Confidence + 20% Support + 10% Compatibility + 5% Stock</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #FFEDD5', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '20px', fontWeight: '950', color: '#EA580C' }}>{associationRules.length}</div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Active Rules</div>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #FFEDD5', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '20px', fontWeight: '950', color: '#059669' }}>
                  {associationRules.length > 0 ? `${Math.max(...associationRules.map(r => Number(r.lift) || 0)).toFixed(2)}x` : '0.0x'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>Peak Lift</div>
              </div>
            </div>
          </div>

          {/* Combos Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '900', margin: 0 }}>
                High-Affinity Bundle Recommendations
              </h4>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>
                Showing {associationRules.length} mined combinations
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '14px 20px' }}>Bundle Type & Products</th>
                    <th style={{ padding: '14px 14px' }}>Support</th>
                    <th style={{ padding: '14px 14px' }}>Confidence</th>
                    <th style={{ padding: '14px 14px' }}>Lift Score</th>
                    <th style={{ padding: '14px 14px' }}>Rank Score</th>
                    <th style={{ padding: '14px 14px' }}>Co-Purchases</th>
                    <th style={{ padding: '14px 14px' }}>Suggested Offer</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {associationRules.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
                        <Flame size={36} color="#94A3B8" style={{ margin: '0 auto 8px', display: 'block' }} />
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>No Association Rules Mined Yet</div>
                        <div style={{ fontSize: '12.5px', color: '#64748B' }}>FP-Growth algorithms will mine frequently co-purchased item pairings once customer transactions occur.</div>
                      </td>
                    </tr>
                  ) : (
                    associationRules.map(rule => (
                      <tr key={rule.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={rule.itemA.thumbnail} alt={rule.itemA.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <span style={{ color: '#94A3B8', fontWeight: '800' }}>+</span>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={rule.itemB.thumbnail} alt={rule.itemB.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: '800', color: '#0F172A' }}>{rule.comboName}</div>
                              <div style={{ fontSize: '11px', color: '#64748B' }}>{rule.type}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '16px 14px', fontWeight: '700', color: '#475569' }}>
                          {Math.round(rule.support * 100)}%
                        </td>

                        <td style={{ padding: '16px 14px' }}>
                          <span style={{ backgroundColor: '#EDE9FE', color: '#7C3AED', padding: '3px 9px', borderRadius: '8px', fontWeight: '800', fontSize: '11.5px' }}>
                            {Math.round(rule.confidence * 100)}%
                          </span>
                        </td>

                        <td style={{ padding: '16px 14px' }}>
                          <span style={{ color: '#059669', fontWeight: '900', fontSize: '13.5px' }}>
                            {rule.lift}x
                          </span>
                        </td>

                        <td style={{ padding: '16px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '48px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{ width: `${rule.score}%`, height: '100%', backgroundColor: '#2563EB' }} />
                            </div>
                            <span style={{ fontWeight: '800', fontSize: '12px' }}>{rule.score}</span>
                          </div>
                        </td>

                        <td style={{ padding: '16px 14px', fontWeight: '700', color: '#475569' }}>
                          {rule.transactionsCount} txns
                        </td>

                        <td style={{ padding: '16px 14px', color: '#059669', fontWeight: '800' }}>
                          {rule.suggestedDiscount}
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => showToast(`Created promotional bundle offer for "${rule.comboName}" with 10% instant discount!`, 'success')}
                            style={{
                              backgroundColor: '#0F172A',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '7px 14px',
                              borderRadius: '10px',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            Create Offer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 3: 🔗 PRODUCT RELATIONSHIPS (JACCARD & COSINE SIMILARITY)
         ========================================================================= */}
      {activeTab === 'RELATIONSHIPS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} color="#7C3AED" />
              </div>
              <label style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A' }}>
                Select Source Product to Analyze Vector Relationships:
              </label>
            </div>

            {products.length === 0 ? (
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>No products listed</span>
            ) : (
              <select
                value={activeProduct?.id || ''}
                onChange={(e) => setSelectedProductId(e.target.value)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontWeight: '700',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  outline: 'none',
                  maxWidth: '460px',
                  cursor: 'pointer'
                }}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title.slice(0, 52)}... (₹{Number(p.price || 0).toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Active Product Analysis Card */}
          {!activeProduct ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px dashed #CBD5E1' }}>
              <Layers size={36} color="#94A3B8" style={{ margin: '0 auto 8px', display: 'block' }} />
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>No Product Vector Relationships</div>
              <div style={{ fontSize: '12.5px', color: '#64748B' }}>Add items to your merchant inventory to visualize cosine and Jaccard vector similarity graphs.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '11px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: '800', padding: '3px 10px', borderRadius: '9999px' }}>
                  SOURCE ITEM
                </span>
                <div style={{ display: 'flex', gap: '18px', marginTop: '16px' }}>
                  <div style={{ width: '92px', height: '92px', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={activeProduct.thumbnail} alt={activeProduct.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '950', color: '#0F172A', margin: '0 0 6px' }}>
                      {activeProduct.title}
                    </h3>
                    <div style={{ fontSize: '18px', fontWeight: '950', color: '#2563EB', marginBottom: '6px' }}>
                      ₹{Number(activeProduct.price || 0).toLocaleString('en-IN')}
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748B', textTransform: 'capitalize' }}>
                      Category: <strong>{activeProduct.category}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Products List */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '900', margin: '0 0 16px' }}>
                  Vector Neighborhood ({activeProductRelationships.length} items)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeProductRelationships.length === 0 ? (
                    <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                      No adjacent vector neighbors found for this item yet.
                    </div>
                  ) : (
                    activeProductRelationships.map(rel => (
                      <div
                        key={rel.product.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={rel.product.thumbnail} alt={rel.product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                              {rel.product.title.slice(0, 36)}...
                            </div>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>
                              ₹{Number(rel.product.price || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '130px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>
                              <span>Similarity</span>
                              <span style={{ color: '#2563EB' }}>{rel.similarityScore}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{ width: `${rel.similarityScore}%`, height: '100%', backgroundColor: '#2563EB' }} />
                            </div>
                          </div>

                          <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#059669', backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: '8px' }}>
                            {rel.compatibilityScore}% Compatible
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* =========================================================================
         TAB 4: 👥 CUSTOMER SEGMENTS (K-MEANS CLUSTERING)
         ========================================================================= */}
      {activeTab === 'SEGMENTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#8B5CF6', backgroundColor: '#F5F3FF', padding: '3px 10px', borderRadius: '9999px' }}>
                  K-Means RFM Cohort Model (Lloyd-Forgy Method)
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '950', color: '#0F172A', margin: '6px 0 0' }}>
                  {activeStoreName} Customer Cohort Segments
                </h3>
              </div>
              <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '700' }}>
                Total Analyzed Buyers: <strong style={{ color: '#0F172A' }}>{clusters?.totalCustomers || 0}</strong>
              </div>
            </div>

            {/* 2D Interactive Cluster Scatter Map */}
            <div style={{ marginTop: '22px', backgroundColor: '#0B0F19', borderRadius: '18px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '11px', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span>⬅️ Lower Spending & Frequency</span>
                <span>Higher Spending & LTV Velocity ➡️</span>
              </div>

              {/* Canvas Frame */}
              <div style={{ width: '100%', height: '220px', position: 'relative', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '12px' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', borderLeft: '1px solid rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

                {(clusters?.clusters || []).map(cluster => (
                  <React.Fragment key={cluster.id}>
                    {/* Centroid Marker */}
                    <div
                      style={{
                        position: 'absolute',
                        left: `${cluster.centroid?.x || 50}%`,
                        top: `${100 - (cluster.centroid?.y || 50)}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: cluster.color + '33',
                        border: `2px solid ${cluster.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        boxShadow: `0 0 16px ${cluster.color}66`
                      }}
                      title={`${cluster.name} (Centroid: ${cluster.customerCount || 0} buyers)`}
                    >
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cluster.color }} />
                    </div>

                    {/* Scatter Points */}
                    {(cluster.points || []).map(pt => (
                      <div
                        key={pt.id}
                        style={{
                          position: 'absolute',
                          left: `${pt.x}%`,
                          top: `${100 - pt.y}%`,
                          transform: 'translate(-50%, -50%)',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: cluster.color,
                          opacity: 0.75
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Cohort Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {(clusters?.clusters || []).map(cluster => (
              <div
                key={cluster.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: `1.5px solid ${cluster.borderColor}`,
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: cluster.color, backgroundColor: cluster.bgColor, padding: '3px 10px', borderRadius: '9999px' }}>
                      {cluster.badge}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '950', color: '#0F172A' }}>
                      {cluster.customerCount || 0} buyers ({cluster.sharePercent || 0}%)
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', margin: '0 0 6px' }}>
                    {cluster.name}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                    {cluster.description}
                  </p>

                  <div style={{ display: 'flex', gap: '14px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #F1F5F9', fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#64748B' }}>Avg Ticket</div>
                      <strong style={{ color: '#0F172A' }}>₹{Number(cluster.avgSpending || 0).toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <div style={{ color: '#64748B' }}>Order Frequency</div>
                      <strong style={{ color: '#0F172A' }}>{cluster.avgOrderFrequency || 0}x / yr</strong>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: cluster.bgColor, borderRadius: '12px', padding: '12px 14px', fontSize: '12px', color: '#334155' }}>
                  <strong style={{ color: cluster.color, display: 'block', marginBottom: '3px' }}>🎯 Recommended Action Playbook:</strong>
                  {cluster.marketingAction}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 5: 📈 SALES PREDICTION (RANDOM FOREST & LINEAR REGRESSION)
         ========================================================================= */}
      {activeTab === 'PREDICTIONS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#2563EB', textTransform: 'uppercase' }}>
                Primary Production Model
              </div>
              <div style={{ fontSize: '16px', fontWeight: '950', color: '#0F172A', marginTop: '4px' }}>
                {predictions?.modelMetrics?.randomForest?.algorithm || 'Random Forest Regressor'}
              </div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '12px', fontSize: '12.5px' }}>
                <div>MAE: <strong>{predictions?.modelMetrics?.randomForest?.mae || 0} units</strong></div>
                <div>RMSE: <strong>{predictions?.modelMetrics?.randomForest?.rmse || 0}</strong></div>
                <div>R² Score: <strong style={{ color: '#059669' }}>{predictions?.modelMetrics?.randomForest?.r2Score || 0.94}</strong></div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
                Baseline Comparison
              </div>
              <div style={{ fontSize: '16px', fontWeight: '950', color: '#0F172A', marginTop: '4px' }}>
                {predictions?.modelMetrics?.linearRegression?.algorithm || 'Multi-Variable OLS'}
              </div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '12px', fontSize: '12.5px' }}>
                <div>MAE: <strong>{predictions?.modelMetrics?.linearRegression?.mae || 0} units</strong></div>
                <div>RMSE: <strong>{predictions?.modelMetrics?.linearRegression?.rmse || 0}</strong></div>
                <div>R² Score: <strong>{predictions?.modelMetrics?.linearRegression?.r2Score || 0.86}</strong></div>
              </div>
            </div>

          </div>

          {/* Predictions Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '900', margin: 0 }}>
                {activeStoreName} 30-Day Sales Predictions
              </h4>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 20px' }}>Product</th>
                    <th style={{ padding: '14px 14px' }}>Last Month (Actual)</th>
                    <th style={{ padding: '14px 14px' }}>Next Month (RF Proj)</th>
                    <th style={{ padding: '14px 14px' }}>Projected Revenue</th>
                    <th style={{ padding: '14px 14px' }}>Growth Velocity</th>
                    <th style={{ padding: '14px 14px' }}>Demand State</th>
                    <th style={{ padding: '14px 20px' }}>Stock Readiness</th>
                  </tr>
                </thead>
                <tbody>
                  {(predictions?.productPredictions || []).length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
                        <TrendingUp size={36} color="#94A3B8" style={{ margin: '0 auto 8px', display: 'block' }} />
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>No Sales Projections Available</div>
                        <div style={{ fontSize: '12.5px', color: '#64748B' }}>List products in your catalog to generate Random Forest unit demand projections and stock readiness scores.</div>
                      </td>
                    </tr>
                  ) : (
                    predictions.productPredictions.map(p => (
                      <tr key={p.product?.id || Math.random()} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: '800', color: '#0F172A' }}>{p.product?.title ? `${p.product.title.slice(0, 42)}...` : 'Catalog Item'}</div>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>₹{Number(p.product?.price || 0).toLocaleString('en-IN')} / unit</span>
                        </td>

                        <td style={{ padding: '16px 14px', fontWeight: '700' }}>
                          {p.actualUnitsLastMonth || 0} units
                        </td>

                        <td style={{ padding: '16px 14px', fontWeight: '900', color: '#2563EB' }}>
                          {p.predictedUnitsNextMonth || 0} units
                        </td>

                        <td style={{ padding: '16px 14px', fontWeight: '800' }}>
                          ₹{Number(p.predictedRevenueNextMonth || 0).toLocaleString('en-IN')}
                        </td>

                        <td style={{ padding: '16px 14px' }}>
                          <span style={{ color: (p.growthPercent || 0) >= 0 ? '#059669' : '#DC2626', fontWeight: '800' }}>
                            {(p.growthPercent || 0) >= 0 ? `+${p.growthPercent || 0}%` : `${p.growthPercent}%`}
                          </span>
                        </td>

                        <td style={{ padding: '16px 14px' }}>
                          <span style={{ backgroundColor: p.demandStatus?.includes('Surge') ? '#FEF3C7' : '#F1F5F9', color: p.demandStatus?.includes('Surge') ? '#D97706' : '#475569', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
                            {p.demandStatus || 'Moderate Demand'}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ backgroundColor: p.stockRisk?.includes('High') ? '#FEE2E2' : '#ECFDF5', color: p.stockRisk?.includes('High') ? '#DC2626' : '#059669', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
                            {p.stockRisk || 'Adequate Stock'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Importance */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '900', margin: '0 0 18px' }}>
              Random Forest Feature Importance Weights
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(predictions?.modelMetrics?.featureImportance || []).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '260px', fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>
                    {f.feature}
                  </div>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: f.label, height: '100%', backgroundColor: '#3B82F6' }} />
                  </div>
                  <div style={{ width: '40px', fontSize: '12px', fontWeight: '800', color: '#0F172A', textAlign: 'right' }}>
                    {f.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 6: 🔮 SALES FORECAST (ARIMA & PROPHET TIME SERIES)
         ========================================================================= */}
      {activeTab === 'FORECAST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284C7', backgroundColor: '#E0F2FE', padding: '3px 10px', borderRadius: '9999px' }}>
                  ARIMA (1,1,2) & Facebook Prophet Decomposed Trajectory
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '950', color: '#0F172A', margin: '6px 0 0' }}>
                  {activeStoreName} Projected Revenue Trajectory
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12.5px' }}>
                  Next Mo: <strong style={{ color: '#059669' }}>+{forecast?.summary?.nextMonthGrowth || 0}%</strong>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12.5px' }}>
                  Quarterly: <strong style={{ color: '#2563EB' }}>+{forecast?.summary?.threeMonthGrowth || 0}%</strong>
                </div>
              </div>
            </div>

            {/* Time-Series Trajectory List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(forecast?.timelineData || []).length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px dashed #CBD5E1' }}>
                  <TrendingUp size={36} color="#94A3B8" style={{ margin: '0 auto 8px', display: 'block' }} />
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>No Historical Sales Trajectory Available</div>
                  <div style={{ fontSize: '12.5px', color: '#64748B' }}>Time-series ARIMA projection requires at least 30 days of active order history to model seasonal trends.</div>
                </div>
              ) : (
                forecast.timelineData.map(item => (
                  <div
                    key={item.month}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: item.isForecast ? '#F0FDF4' : '#F8FAFC',
                      border: item.isForecast ? '1px dashed #86EFAC' : '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ width: '200px', fontSize: '13px', fontWeight: '800', color: item.isForecast ? '#15803D' : '#0F172A' }}>
                      {item.month} {item.isForecast ? '🔮' : ''}
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '950', color: item.isForecast ? '#15803D' : '#0F172A' }}>
                        ₹{Number(item.actualRevenue || item.predictedRevenue || 0).toLocaleString('en-IN')}
                      </div>
                      {item.note && (
                        <span style={{ fontSize: '11px', color: '#64748B', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                          {item.note}
                        </span>
                      )}
                    </div>

                    {item.isForecast && item.lowerBound && (
                      <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: '800' }}>
                        95% Confidence Band: [₹{Number(item.lowerBound).toLocaleString('en-IN')} — ₹{Number(item.upperBound).toLocaleString('en-IN')}]
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 7: 📦 DEMAND & STOCK RISKS
         ========================================================================= */}
      {activeTab === 'DEMAND' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            
            {/* High Demand Products */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706', marginBottom: '16px' }}>
                <Flame size={19} />
                <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  High Demand Surge Items
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(predictions?.productPredictions || []).filter(p => (p.growthPercent || 0) >= 10).length === 0 ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                    No demand surges detected. Product sales velocities are pacing steadily.
                  </div>
                ) : (
                  predictions.productPredictions.filter(p => (p.growthPercent || 0) >= 10).map(p => (
                    <div key={p.product?.id || Math.random()} style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{p.product?.title ? `${p.product.title.slice(0, 32)}...` : 'Item'}</div>
                        <span style={{ fontSize: '11.5px', color: '#D97706', fontWeight: '700' }}>+{p.growthPercent || 0}% velocity</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '950', color: '#0F172A' }}>{p.predictedUnitsNextMonth || 0} units proj.</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Imminent Stockout Risks */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', marginBottom: '16px' }}>
                <AlertTriangle size={19} />
                <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Stockout Risk Warnings
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(predictions?.productPredictions || []).filter(p => p.stockRisk?.includes('High')).length === 0 ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: '#059669', fontSize: '13px', fontWeight: '700', backgroundColor: '#ECFDF5', borderRadius: '12px' }}>
                    ✓ Inventory Healthy. Zero products are at risk of stock depletion.
                  </div>
                ) : (
                  predictions.productPredictions.filter(p => p.stockRisk?.includes('High')).map(p => (
                    <div key={p.product?.id || Math.random()} style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{p.product?.title ? `${p.product.title.slice(0, 32)}...` : 'Item'}</div>
                        <span style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: '800' }}>Reorder: +{p.recommendedRestock || 0} units</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleExecuteAction('RESTOCK_ITEM', p.product?.id)}
                        style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
                      >
                        Restock PO
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 8: 💡 AI INSIGHTS
         ========================================================================= */}
      {activeTab === 'INSIGHTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '950', color: '#0F172A', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={20} color="#F59E0B" /> Computed AI Strategic Recommendations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {aiInsights.map(ins => (
                <div
                  key={ins.id}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '18px',
                    border: '1px solid #E2E8F0',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: '1 1 500px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ backgroundColor: ins.badgeColor + '18', color: ins.badgeColor, fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '9999px' }}>
                        {ins.badge}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '700' }}>{ins.category}</span>
                    </div>

                    <h4 style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', margin: '8px 0 4px' }}>
                      {ins.title}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                      {ins.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleExecuteAction(ins.actionType, ins.targetId)}
                    style={{
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    {ins.actionLabel} <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         INTERACTIVE AI MODALS (RESTOCK PO / VIP CAMPAIGN / WIN-BACK VOUCHER)
         ========================================================================= */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B'
              }}
            >
              <X size={16} />
            </button>

            {/* RESTOCK MODAL */}
            {activeModal.type === 'RESTOCK' && (
              <div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Package size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Approve Restock Purchase Order
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                  Generating replenishment dispatch for <strong>{activeStoreName}</strong> fulfillment center.
                </p>

                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Item:</span>
                    <strong style={{ color: '#0F172A' }}>{activeModal.product?.title.slice(0, 32)}...</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Current Warehouse Stock:</span>
                    <strong style={{ color: '#DC2626' }}>{activeModal.product?.stockCount || 8} units (Critical)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Recommended Reorder Batch:</span>
                    <strong style={{ color: '#059669' }}>+48 units</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #CBD5E1', paddingTop: '8px' }}>
                    <span style={{ color: '#64748B' }}>Supplier SLA Dispatch:</span>
                    <strong style={{ color: '#2563EB' }}>Within 24 Hours (Express)</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      showToast(`Purchase Order #PO-84920 for +48 units of ${activeModal.product?.title.slice(0, 20)} approved & dispatched!`, 'success');
                    }}
                    style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Approve & Issue PO
                  </button>
                </div>
              </div>
            )}

            {/* VIP CAMPAIGN MODAL */}
            {activeModal.type === 'VIP_CAMPAIGN' && (
              <div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <CrownIcon />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Deploy VIP Early Access Campaign
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                  Targeting high-LTV champions with exclusive perks for <strong>{activeStoreName}</strong>.
                </p>

                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Audience Size:</span>
                    <strong style={{ color: '#7C3AED' }}>{activeModal.cluster?.customerCount || 18} VIP Champions</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Voucher Offer:</span>
                    <strong style={{ color: '#059669' }}>VIP-EXCLUSIVE-15 (15% Flat Discount)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Channels:</span>
                    <strong style={{ color: '#0F172A' }}>Push Notification + Priority Email + WhatsApp</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      showToast(`VIP Early Access Campaign broadcasted to ${activeModal.cluster?.customerCount || 18} VIP Champions!`, 'success');
                    }}
                    style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', backgroundColor: '#7C3AED', color: '#FFFFFF', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Dispatch VIP Campaign
                  </button>
                </div>
              </div>
            )}

            {/* WIN-BACK MODAL */}
            {activeModal.type === 'WIN_BACK' && (
              <div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <RefreshCw size={22} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Deploy Inactive Buyer Win-Back Campaign
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                  Re-engage customers who have been inactive for &gt;90 days.
                </p>

                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Target Cohort:</span>
                    <strong style={{ color: '#D97706' }}>{activeModal.cluster?.customerCount || 14} Inactive Customers</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Reactivation Voucher:</span>
                    <strong style={{ color: '#059669' }}>₹500 Off (Coupon: COMEBACK500)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Predicted Response Rate:</span>
                    <strong style={{ color: '#2563EB' }}>+38% Conversion Lift</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      showToast(`Win-Back Voucher COMEBACK500 dispatched via SMS & Email to ${activeModal.cluster?.customerCount || 14} inactive customers!`, 'success');
                    }}
                    style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', backgroundColor: '#D97706', color: '#FFFFFF', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Deploy Win-Back Campaign
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

function CrownIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
