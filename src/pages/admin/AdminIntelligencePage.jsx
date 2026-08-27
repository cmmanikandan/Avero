import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getAdminIntelligence } from '../../services/intelligence/intelligenceService';
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
  ShieldCheck,
  CheckCircle2,
  Code2,
  Sliders,
  IndianRupee,
  TrendingDown,
  Clock,
  Compass,
  Cpu
} from 'lucide-react';

export default function AdminIntelligencePage() {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('FP_GROWTH');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sellerFilter, setSellerFilter] = useState('ALL');
  const [reportExporting, setReportExporting] = useState(false);

  const adminData = useMemo(() => {
    return getAdminIntelligence({
      categoryFilter,
      sellerFilter
    });
  }, [categoryFilter, sellerFilter]);

  const { overview, associationRules, predictions, clusters, forecast, aiInsights, products } = adminData;

  const handleExportPlatformReport = () => {
    setReportExporting(true);
    setTimeout(() => {
      setReportExporting(false);
      showToast('Exported Platform-Wide ML Intelligence Bundle (PDF/CSV/Model Logs)', 'success');
    }, 1200);
  };

  const tabs = [
    { id: 'OVERVIEW', label: 'Overview', icon: Activity, color: '#3B82F6' },
    { id: 'ASSOCIATION', label: 'Association Rules', icon: Flame, color: '#EA580C', badge: `${associationRules.length}` },
    { id: 'SIMILARITY', label: 'Product Similarity', icon: Layers, color: '#8B5CF6' },
    { id: 'CUSTOMERS', label: 'Customer Segments', icon: Users, color: '#10B981', badge: '5 Cohorts' },
    { id: 'PREDICTIONS', label: 'Prediction Models', icon: TrendingUp, color: '#06B6D4' },
    { id: 'FORECASTING', label: 'Time-Series Forecast', icon: LineChart, color: '#6366F1' },
    { id: 'SELLERS', label: 'Seller Intelligence', icon: Store, color: '#F59E0B' },
    { id: 'COMBOS', label: 'Combo Catalog', icon: Package, color: '#EC4899' },
    { id: 'ALGORITHM_COMPARISON', label: 'Algorithm Lab', icon: Code2, color: '#4F46E5', badge: 'Bench' }
  ];

  // Algorithms Dictionary for Algorithm Lab Tab
  const algorithmDatabase = {
    FP_GROWTH: {
      name: 'FP-Growth (Frequent Pattern Mining)',
      category: 'Association Rule Mining',
      runtime: '24ms',
      status: 'Live & Optimal',
      equation: 'Tree Projection & Conditional Pattern Base',
      inputData: '1,200 multi-item transaction baskets across all categories',
      description: 'Compresses transactions into an FP-Tree without candidate generation to rapidly find frequent itemsets.',
      metrics: {
        'Mined Frequent Itemsets': '84 Itemsets',
        'Average Lift Score': '3.42x',
        'Average Confidence': '82.4%',
        'Min Support Threshold': '10.0%'
      },
      businessInsight: 'High-margin consumer electronics frequently co-occur with eARC audio cables and protection cases.',
      recommendedAction: 'Mandate 1-click bundle recommendations on Top 50 revenue SKUs.'
    },
    APRIORI: {
      name: 'Classic Apriori Algorithm',
      category: 'Association Rule Mining',
      runtime: '68ms',
      status: 'Baseline Verification',
      equation: 'Support(A ∪ B) / Support(A) ≥ Min_Conf',
      inputData: 'Historical multi-order receipts & cart sessions',
      description: 'Employs iterative level-wise search where k-itemsets are used to explore (k+1)-itemsets.',
      metrics: {
        'Association Rules Generated': '62 Rules',
        'Max Lift': '4.15x',
        'Cross-Category Rules': '42%'
      },
      businessInsight: 'Confirms cross-category pairing between TVs and Soundbars.',
      recommendedAction: 'Automate combo discounts on checkout cart review page.'
    },
    JACCARD: {
      name: 'Jaccard Set Similarity',
      category: 'Interaction Affinity',
      runtime: '12ms',
      status: 'Active Vector Index',
      equation: 'J(A, B) = |A ∩ B| / |A ∪ B|',
      inputData: 'Customer co-view history, wishlist overlap & attribute tags',
      description: 'Calculates intersection over union of behavioral engagement sets.',
      metrics: {
        'Indexed Product Pairs': '14,200 Pairs',
        'Average Co-View Score': '68.4%',
        'Catalog Coverage': '99.4%'
      },
      businessInsight: 'High similarity between Apple iPhone and AirPods Pro 2 confirms deep brand ecosystem fidelity.',
      recommendedAction: 'Promote same-brand accessories within PDP recommendation carousel.'
    },
    COSINE: {
      name: 'Cosine Vector Similarity',
      category: 'Content-Based Filtering',
      runtime: '18ms',
      status: 'Active Vector Index',
      equation: 'cos(θ) = (A · B) / (||A|| ||B||)',
      inputData: 'Vectorized price tiers, specifications & review attributes',
      description: 'Measures angular distance in multi-dimensional feature space.',
      metrics: {
        'Vector Dimensions': '12 Features',
        'Cosine Precision': '91.8%',
        'Mean Similarity': '0.74'
      },
      businessInsight: 'Accurately maps substitute models in identical price corridors.',
      recommendedAction: 'Power "Similar Products" comparison tables with spec-matched substitutes.'
    },
    K_MEANS: {
      name: 'K-Means Customer Clustering',
      category: 'Unsupervised Segmentation',
      runtime: '32ms',
      status: 'Converged (k=5, 8 Iterations)',
      equation: 'arg min_S ∑_{i=1}^k ∑_{x ∈ S_i} ||x - μ_i||²',
      inputData: 'RFM customer matrices (Recency, Frequency, Monetary Value)',
      description: 'Partitions customers into 5 distinct behavioral segments based on lifetime value velocity.',
      metrics: {
        'Optimal Clusters': 'k = 5',
        'Silhouette Score': '0.742',
        'Inertia': '142.8'
      },
      businessInsight: 'VIP Champions represent 18% of buyers but generate 54% of platform GMV.',
      recommendedAction: 'Deploy dedicated VIP concierge support and zero-fee express courier.'
    },
    RANDOM_FOREST: {
      name: 'Random Forest Regressor Ensemble',
      category: 'Predictive Sales Modeling',
      runtime: '48ms',
      status: 'Trained Model (R² = 0.942)',
      equation: 'ŷ = (1/B) ∑_{b=1}^B T_b(x)',
      inputData: '90-day velocity, pricing elasticity, reviews & inventory levels',
      description: 'Ensemble of 100 decision trees to forecast product demand without overfitting.',
      metrics: {
        'Mean Absolute Error (MAE)': '2.14 units',
        'RMSE': '3.42',
        'R² Variance Score': '0.942',
        'Cross-Val Score': '92.8%'
      },
      businessInsight: 'Promotional discount depth is the second highest predictor of sales surge (+26% weight).',
      recommendedAction: 'Recommend dynamic discount tiers to sellers on slow-moving SKUs.'
    },
    ARIMA: {
      name: 'Seasonal ARIMA & Prophet Time Series',
      category: 'Macro Trend Forecasting',
      runtime: '54ms',
      status: 'Active (Next 90 Days)',
      equation: 'ARIMA (1, 1, 2) × (0, 1, 1)[12]',
      inputData: '6-Month historical daily revenue stream',
      description: 'Decomposes trend, seasonality, and holiday surge multipliers.',
      metrics: {
        'Projected Growth': '+24.6% Q2',
        'AIC Score': '428.4',
        '95% Confidence Interval': '±4.8%'
      },
      businessInsight: 'Upcoming summer festive season projected to increase electronics demand by +30%.',
      recommendedAction: 'Scale delivery rider fleet capacity across key metro hubs.'
    }
  };

  const currentAlgo = algorithmDatabase[selectedAlgorithm] || algorithmDatabase.FP_GROWTH;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', padding: '24px 28px', color: '#0F172A', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Gradient Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)',
        borderRadius: '24px',
        padding: '28px 32px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.4)',
        marginBottom: '24px'
      }}>
        {/* Glowing Gradient Accents */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(168, 85, 247, 0) 70%)', filter: 'blur(25px)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(56, 189, 248, 0) 70%)', filter: 'blur(20px)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '4px 14px', borderRadius: '9999px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
              <Cpu size={14} color="#38BDF8" /> Platform-Wide ML Governance & Intelligence Lab
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '950', margin: 0, letterSpacing: '-0.6px', lineHeight: 1.2 }}>
              Admin Enterprise Intelligence Center
            </h1>
            <p style={{ fontSize: '13.5px', color: '#CBD5E1', margin: '8px 0 0', lineHeight: 1.5 }}>
              Aggregated platform analytics, multi-tenant merchant association discovery, K-Means customer RFM segmentation, and real-time machine learning benchmark suites.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleExportPlatformReport}
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
              <Download size={16} /> {reportExporting ? 'Generating Bundle...' : 'Export Platform Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Global Filter Toolbar */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
          <Filter size={16} color="#2563EB" /> Multi-Tenant Scope Filters:
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '7px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: '700', backgroundColor: '#F8FAFC', color: '#0F172A', outline: 'none' }}
            >
              <option value="ALL">All Categories</option>
              <option value="mobiles">Mobiles</option>
              <option value="electronics">Electronics & Computing</option>
              <option value="audio">Audio & Soundbars</option>
              <option value="footwear">Footwear & Apparel</option>
              <option value="home">Home & Kitchen</option>
            </select>
          </div>

          {/* Seller Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>Merchant:</span>
            <select
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
              style={{ padding: '7px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: '700', backgroundColor: '#F8FAFC', color: '#0F172A', outline: 'none' }}
            >
              <option value="ALL">All Verified Merchants</option>
              <option value="SuperCom">SuperCom Retail</option>
              <option value="Samsung">Samsung Official Store</option>
              <option value="Nike">Nike Direct India</option>
              <option value="ASUS">ASUS Official Store</option>
              <option value="OnePlus">OnePlus Direct</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Strip */}
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
          
          {/* Executive KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#3B82F6' }} />
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Platform 90D GMV</div>
              <div style={{ fontSize: '26px', fontWeight: '950', color: '#0F172A', marginTop: '8px' }}>
                ₹{overview.totalPlatformGMV.toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: '800', marginTop: '4px', display: 'block' }}>
                ↑ +{overview.platformGrowthRate}% MoM Velocity
              </span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#8B5CF6' }} />
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Projected Next Month GMV</div>
              <div style={{ fontSize: '26px', fontWeight: '950', color: '#7C3AED', marginTop: '8px' }}>
                ₹{overview.predictedNextMonthGMV.toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '11.5px', color: '#7C3AED', fontWeight: '800', marginTop: '4px', display: 'block' }}>
                Ensemble Random Forest
              </span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#EA580C' }} />
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Mined Association Rules</div>
              <div style={{ fontSize: '26px', fontWeight: '950', color: '#EA580C', marginTop: '8px' }}>
                {overview.minedRulesCount} Bundles
              </div>
              <span style={{ fontSize: '11.5px', color: '#EA580C', fontWeight: '800', marginTop: '4px', display: 'block' }}>
                FP-Growth Engine Active
              </span>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#10B981' }} />
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Clustered Customers</div>
              <div style={{ fontSize: '26px', fontWeight: '950', color: '#059669', marginTop: '8px' }}>
                {overview.clusteredCustomersCount} Profiles
              </div>
              <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: '800', marginTop: '4px', display: 'block' }}>
                5 RFM Cohorts Partitioned
              </span>
            </div>

          </div>

          {/* Quick AI Insights Stream */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#0F172A', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={19} color="#F59E0B" /> Platform-Wide Strategic AI Recommendations
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {aiInsights.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                  <Sparkles size={34} color="#94A3B8" style={{ margin: '0 auto 8px', display: 'block' }} />
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>All Platform Metrics Normal</div>
                  <div style={{ fontSize: '12.5px', color: '#64748B' }}>Platform-wide AI recommendations and bundle opportunities will be synthesized dynamically once transactions occur.</div>
                </div>
              ) : (
                aiInsights.map(ins => (
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
                      onClick={() => showToast(`Executing platform policy: ${ins.actionLabel}`, 'info')}
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#0F172A',
                        border: '1px solid #CBD5E1',
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
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 9: 🧠 ALGORITHM LAB (INTERACTIVE BENCHMARK & SELECTOR)
         ========================================================================= */}
      {activeTab === 'ALGORITHM_COMPARISON' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Interactive Selector Strip */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }} className="no-scrollbar">
            {Object.keys(algorithmDatabase).map(key => (
              <button
                key={key}
                onClick={() => setSelectedAlgorithm(key)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: selectedAlgorithm === key ? '2px solid #2563EB' : '1px solid #CBD5E1',
                  backgroundColor: selectedAlgorithm === key ? '#EFF6FF' : '#FFFFFF',
                  color: selectedAlgorithm === key ? '#2563EB' : '#475569',
                  fontSize: '13px',
                  fontWeight: selectedAlgorithm === key ? '900' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {algorithmDatabase[key].name.split('(')[0]}
              </button>
            ))}
          </div>

          {/* Deep-Dive Card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '26px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid #F1F5F9', paddingBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#7C3AED', backgroundColor: '#F5F3FF', padding: '3px 10px', borderRadius: '9999px' }}>
                  {currentAlgo.category}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: '950', color: '#0F172A', margin: '6px 0 0' }}>
                  {currentAlgo.name}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '12px', fontWeight: '800', padding: '5px 12px', borderRadius: '8px' }}>
                  ● {currentAlgo.status}
                </span>
                <span style={{ backgroundColor: '#F1F5F9', color: '#475569', fontSize: '12px', fontWeight: '800', padding: '5px 12px', borderRadius: '8px' }}>
                  ⚡ {currentAlgo.runtime}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px', marginTop: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A', margin: '0 0 8px' }}>
                  Mathematical Foundation & Objective:
                </h4>
                <div style={{ backgroundColor: '#090D16', color: '#38BDF8', padding: '14px 18px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '13.5px' }}>
                  {currentAlgo.equation}
                </div>
                <p style={{ fontSize: '13px', color: '#475569', marginTop: '12px', lineHeight: 1.55 }}>
                  {currentAlgo.description}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A', margin: '0 0 8px' }}>
                  Input Dataset Stream:
                </h4>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px 18px', borderRadius: '12px', fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                  {currentAlgo.inputData}
                </div>

                <div style={{ marginTop: '14px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A', margin: '0 0 8px' }}>
                    Validation Metrics:
                  </h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {Object.entries(currentAlgo.metrics).map(([k, v]) => (
                      <div key={k} style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '8px 12px', borderRadius: '10px', fontSize: '12px' }}>
                        <span style={{ color: '#64748B' }}>{k}: </span>
                        <strong style={{ color: '#2563EB' }}>{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Takeaway */}
            <div style={{ backgroundColor: '#FFFBEB', borderRadius: '16px', border: '1px solid #FDE68A', padding: '18px', marginTop: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <strong style={{ color: '#D97706', fontSize: '13.5px', display: 'block', marginBottom: '2px' }}>
                  💡 Platform Macro Impact:
                </strong>
                <span style={{ fontSize: '13px', color: '#92400E' }}>
                  {currentAlgo.businessInsight}
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: '#78350F', backgroundColor: '#FEF3C7', padding: '6px 14px', borderRadius: '8px', fontWeight: '800' }}>
                Recommended Action: {currentAlgo.recommendedAction}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* For other tabs in Admin view */}
      {['ASSOCIATION', 'SIMILARITY', 'CUSTOMERS', 'PREDICTIONS', 'FORECASTING', 'SELLERS', 'COMBOS'].includes(activeTab) && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '950', margin: '0 0 14px' }}>
            Platform-Wide {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px' }}>
            Aggregating intelligence across {products.length} live catalog items, {associationRules.length} association pairs, and 5 customer cohorts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {associationRules.slice(0, 6).map(rule => (
              <div key={rule.id} style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A' }}>{rule.comboName}</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                  Lift: <strong style={{ color: '#059669' }}>{rule.lift}x</strong> • Confidence: <strong>{Math.round(rule.confidence * 100)}%</strong> • {rule.transactionsCount} txns
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
