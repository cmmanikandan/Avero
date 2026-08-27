import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  Search,
  Plus,
  Minus,
  RotateCw,
  History,
  Download
} from 'lucide-react';

export default function SellerInventory() {
  const { user, products = [], showToast } = useApp();
  const activeStoreName = user?.storeName || (user?.name ? `${user.name}'s Store` : '');

  const sellerInventoryItems = products.filter(p =>
    (activeStoreName && (p.seller === activeStoreName || p.brand === activeStoreName || p.seller?.name === activeStoreName)) ||
    (user?.email && (p.sellerEmail === user?.email || p.submittedBy === user?.email)) ||
    (user?.merchantId && p.merchantId === user?.merchantId) ||
    p.isCustomCreated
  );

  const [stockMap, setStockMap] = useState(() => {
    const initial = {};
    sellerInventoryItems.forEach(p => {
      initial[p.id] = p.stockCount || p.stock || 18;
    });
    return initial;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  const handleStockDelta = (productId, delta) => {
    setStockMap(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      showToast(`Stock updated to ${next} units`, 'info');
      return { ...prev, [productId]: next };
    });
  };

  const handleBulkRestock = () => {
    setStockMap(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        if (updated[k] < 10) updated[k] += 25;
      });
      return updated;
    });
    showToast('Bulk restocked all low-inventory items (+25 units)', 'success');
  };

  const filteredItems = sellerInventoryItems.filter(p => {
    const stock = stockMap[p.id] || 0;
    if (filterLowStockOnly && stock >= 10) return false;
    if (searchTerm.trim()) {
      return p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const lowStockCount = sellerInventoryItems.filter(p => (stockMap[p.id] || 0) < 10).length;

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      {/* Top Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '16px 20px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            Inventory & Warehouse Stock Control
          </h1>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Real-time stock sync with Avero customer marketplace
          </span>
        </div>

        <button
          type="button"
          onClick={handleBulkRestock}
          className="btn btn-secondary"
          style={{ gap: '6px' }}
        >
          <RotateCw size={15} /> Bulk Restock Low Inventory
        </button>
      </div>

      {/* Filter & Alert Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search SKUs & Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', border: 'none', backgroundColor: 'transparent', fontSize: '13px' }}
          />
        </div>

        <button
          type="button"
          onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
          style={{
            backgroundColor: filterLowStockOnly ? '#FEE2E2' : '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: filterLowStockOnly ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="#DC2626" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: filterLowStockOnly ? '#991B1B' : 'var(--text-primary)' }}>
              Filter Low Stock (&lt; 10 units)
            </span>
          </div>
          <span style={{ fontSize: '11px', color: lowStockCount > 0 ? '#DC2626' : '#64748B', fontWeight: '800' }}>
            {lowStockCount} Item{lowStockCount === 1 ? '' : 's'}
          </span>
        </button>
      </div>

      {/* Inventory Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', borderBottom: '1px solid var(--border-divider)' }}>
                <th style={{ padding: '12px 16px' }}>Item Details</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Available Stock</th>
                <th style={{ padding: '12px 16px' }}>Stock Health</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Quick Adjust</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
                    <Layers size={36} color="#94A3B8" style={{ margin: '0 auto 10px', display: 'block' }} />
                    <strong style={{ display: 'block', fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>No Inventory Records</strong>
                    <span style={{ fontSize: '13px' }}>Listed products will appear here with live stock levels and quick re-order adjustment controls.</span>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const stock = stockMap[item.id] || 0;
                  const isLow = stock < 10;
                  const isCritical = stock <= 3;

                  return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-divider)' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={item.thumbnail} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          {item.brand}
                        </span>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      {item.category}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ fontSize: '15px', color: isCritical ? '#DC2626' : 'var(--text-primary)' }}>
                        {stock} Units
                      </strong>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {isCritical ? (
                        <span style={{ color: '#991B1B', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontSize: '11px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={11} /> Critical Low
                        </span>
                      ) : isLow ? (
                        <span style={{ color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontSize: '11px', fontWeight: '700' }}>
                          Low Inventory
                        </span>
                      ) : (
                        <span style={{ color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontSize: '11px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={11} /> Healthy
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
                        <button
                          type="button"
                          onClick={() => handleStockDelta(item.id, -5)}
                          style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Reduce 5 units"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ width: '32px', textAlign: 'center', fontWeight: '700' }}>{stock}</span>
                        <button
                          type="button"
                          onClick={() => handleStockDelta(item.id, 5)}
                          style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Add 5 units"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
