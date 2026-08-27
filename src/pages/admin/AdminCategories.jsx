import React, { useState } from 'react';
import { CATEGORIES } from '../../data/categories';
import { useApp } from '../../context/AppContext';
import { Layers, Plus, Edit2, Percent, CheckCircle2 } from 'lucide-react';

export default function AdminCategories() {
  const { showToast } = useApp();
  const [categories, setCategories] = useState(CATEGORIES);
  const [commissionRates, setCommissionRates] = useState({
    mobiles: 6.5,
    electronics: 8.0,
    audio: 12.0,
    fashion: 15.0,
    footwear: 14.0,
    appliances: 7.5,
    watches: 12.5,
    beauty: 18.0,
    home: 10.0,
    grocery: 5.0
  });

  const handleRateChange = (catId, newRate) => {
    setCommissionRates(prev => ({
      ...prev,
      [catId]: Number(newRate)
    }));
    showToast(`Commission rate for ${catId} updated to ${newRate}%`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #E2E8F0',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
            Marketplace Category Governance & Commission Rates
          </h1>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
            Set category-specific vendor transaction take rates and manage subcategory trees
          </span>
        </div>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#374151' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '12px 16px' }}>Category Name</th>
                <th style={{ padding: '12px 16px' }}>Subcategories</th>
                <th style={{ padding: '12px 16px' }}>Dynamic Filter Facets</th>
                <th style={{ padding: '12px 16px' }}>Platform Take Rate (%)</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ color: '#0F172A' }}>{cat.name}</strong>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>Slug: /{cat.id}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      {cat.subcategories?.slice(0, 3).join(', ')} (+{cat.subcategories?.length - 3} more)
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', color: '#38BDF8' }}>
                      {cat.filterGroups?.map(g => g.name).join(', ')}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        step="0.5"
                        value={commissionRates[cat.id] || 8.0}
                        onChange={(e) => handleRateChange(cat.id, e.target.value)}
                        style={{
                          width: '60px',
                          padding: '4px 6px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#F8FAFC',
                          color: '#34D399',
                          fontWeight: '700',
                          textAlign: 'center'
                        }}
                      />
                      <span style={{ fontWeight: '700', color: '#34D399' }}>%</span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span style={{ color: '#34D399', backgroundColor: '#064E3B', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontSize: '11px', fontWeight: '700' }}>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
