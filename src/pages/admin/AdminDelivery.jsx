import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  ShieldCheck,
  UserCheck,
  Phone,
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react';

export default function AdminDelivery() {
  const { deliveryPartners, approveDeliveryPartner, rejectDeliveryPartner, showToast } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('PARTNERS'); // 'PARTNERS' | 'CARRIERS'

  const [partners, setPartners] = useState([
    { name: 'BlueDart Express', type: 'Air Express', status: 'ACTIVE', avgSla: '24-48 Hrs', coverage: '18,500+ Pincodes' },
    { name: 'Delhivery Logistics', type: 'Surface & Heavy Goods', status: 'ACTIVE', avgSla: '48-72 Hrs', coverage: '24,000+ Pincodes' },
    { name: 'Ekart Logistics', type: 'Last-Mile Tier 2/3', status: 'ACTIVE', avgSla: '24-36 Hrs', coverage: '28,000+ Pincodes' }
  ]);

  const [shippingThreshold, setShippingThreshold] = useState(500);
  const [flatFee, setFlatFee] = useState(40);

  const handleSaveRates = (e) => {
    e.preventDefault();
    showToast('Delivery thresholds & shipping rates saved platform-wide!', 'success');
  };

  const pendingAgents = deliveryPartners.filter(p => p.status === 'PENDING_APPROVAL');
  const activeAgents = deliveryPartners.filter(p => p.status === 'APPROVED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={22} color="#2563EB" /> Delivery Fleet & Nationwide Logistics Management
          </h1>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', margin: 0 }}>
            Review delivery agent KYC applications, approve last-mile partners, and configure carrier SLA zones
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '3px', border: '1px solid #E2E8F0' }}>
          <button
            type="button"
            onClick={() => setActiveAdminTab('PARTNERS')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeAdminTab === 'PARTNERS' ? '#2563EB' : 'transparent',
              color: activeAdminTab === 'PARTNERS' ? '#FFFFFF' : '#475569',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Delivery Partner KYC Approvals ({pendingAgents.length} Pending)
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab('CARRIERS')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeAdminTab === 'CARRIERS' ? '#2563EB' : 'transparent',
              color: activeAdminTab === 'CARRIERS' ? '#FFFFFF' : '#475569',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Carrier Networks & Rates
          </button>
        </div>
      </div>

      {/* TAB 1: DELIVERY PARTNER KYC & APPROVALS */}
      {activeAdminTab === 'PARTNERS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Pending Applications Section */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#D97706" />
                <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Pending Delivery Agent Applications ({pendingAgents.length})
                </h2>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Review driving license & vehicle registration before approving
              </span>
            </div>

            {pendingAgents.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                ✓ All delivery partner registrations have been reviewed and approved!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingAgents.map((agent) => (
                  <div
                    key={agent.id}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#FEF3C7',
                        color: '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Truck size={20} />
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                          {agent.name} • <span style={{ color: '#2563EB', fontSize: '12px' }}>{agent.id}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                          Phone: <strong style={{ color: '#0F172A' }}>{agent.phone}</strong> • Email: {agent.email || 'N/A'} • Hub: <strong style={{ color: '#0F172A' }}>{agent.city}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                          Vehicle: <strong>{agent.vehicleType} ({agent.vehicleNumber})</strong> | Driving License: <strong style={{ color: '#D97706' }}>{agent.licenseNumber}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Action Approval Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => rejectDeliveryPartner(agent.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #FECACA',
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        ✕ Reject
                      </button>

                      <button
                        type="button"
                        onClick={() => approveDeliveryPartner(agent.id)}
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '800', height: '34px', gap: '4px', backgroundColor: '#059669', borderColor: '#059669' }}
                      >
                        <CheckCircle2 size={14} /> Approve Agent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Delivery Partners Fleet */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F8FAFC' }}>
              <ShieldCheck size={18} color="#059669" />
              <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Active Verified Delivery Partners ({activeAgents.length})
              </h2>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#0F172A' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Driver Partner</th>
                  <th style={{ padding: '12px 16px' }}>Phone / Hub</th>
                  <th style={{ padding: '12px 16px' }}>Vehicle Details</th>
                  <th style={{ padding: '12px 16px' }}>Driving License</th>
                  <th style={{ padding: '12px 16px' }}>Deliveries Completed</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeAgents.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '44px 20px', textAlign: 'center', color: '#64748B' }}>
                      <Truck size={36} color="#94A3B8" style={{ margin: '0 auto 8px', display: 'block' }} />
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>No Active Verified Delivery Partners</div>
                      <div style={{ fontSize: '12.5px', color: '#64748B' }}>When delivery riders register and get KYC approved, their real-time duty status will appear here.</div>
                    </td>
                  </tr>
                ) : (
                  activeAgents.map((agent) => (
                    <tr key={agent.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '700' }}>
                        <div style={{ color: '#0F172A' }}>{agent.name}</div>
                        <div style={{ fontSize: '11px', color: '#2563EB' }}>{agent.id}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>
                        <div>{agent.phone}</div>
                        <div style={{ fontSize: '11px', color: '#0F172A', fontWeight: '600' }}>{agent.city}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>
                        <div>{agent.vehicleType}</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>{agent.vehicleNumber}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: '700', color: '#0F172A' }}>
                        {agent.licenseNumber}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#059669' }}>
                        {agent.completedTrips || agent.completedDeliveries || 0} Deliveries
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>
                          ● Active on Duty
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: CARRIER NETWORKS & SHIPPING RATES */}
      {activeAdminTab === 'CARRIERS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Integrated National 3PL Carriers */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: '0 0 14px' }}>
              Integrated 3PL Carrier Partners
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {partners.map(p => (
                <div
                  key={p.name}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '13px' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{p.type} • {p.coverage}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Rates & Free Threshold Config */}
          <form
            onSubmit={handleSaveRates}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Nationwide Shipping Fee Thresholds
            </h2>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                Free Delivery Minimum Cart Value (₹)
              </label>
              <input
                type="number"
                value={shippingThreshold}
                onChange={(e) => setShippingThreshold(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                Standard Flat Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={flatFee}
                onChange={(e) => setFlatFee(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '8px', height: '40px', fontSize: '13px', fontWeight: '800' }}
            >
              Save Shipping Rate Rules
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
