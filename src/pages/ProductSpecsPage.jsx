import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldCheck,
  Building,
  Info,
  Package
} from 'lucide-react';

export default function ProductSpecsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products = [] } = useApp();

  const allAvailable = products;
  const product = allAvailable.find((p) => String(p.id) === String(id)) || null;

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState({});

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 16px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Specifications Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
          We could not find the requested product specifications.
        </p>
        <button type="button" onClick={() => navigate('/products')} className="btn btn-primary">
          Explore Products
        </button>
      </div>
    );
  }

  // Ensure rich specification groups exist for any product
  const specificationGroups = useMemo(() => {
    const baseSpecs = product.specifications && product.specifications.length > 0
      ? product.specifications
      : [
          {
            group: 'General',
            items: [
              { key: 'Brand', value: product.brand || 'Avero Brand' },
              { key: 'Model Name', value: product.title || 'Standard Model' },
              { key: 'Category', value: product.category || 'General' },
              { key: 'Color', value: product.attributes?.color || 'Standard' },
              { key: 'In The Box', value: 'Primary Unit, Quick Start Guide, Charging / Access Cable, Warranty Card' }
            ]
          },
          {
            group: 'Hardware & Performance',
            items: [
              { key: 'Processor / Engine', value: product.attributes?.processor || 'High-performance Avero Certified Architecture' },
              { key: 'RAM', value: product.attributes?.ram || 'Standard configuration' },
              { key: 'Internal Storage', value: product.attributes?.storage || 'Standard configuration' },
              { key: 'Connectivity', value: product.attributes?.network || 'Bluetooth 5.3, Wi-Fi 6E, USB-C' }
            ]
          },
          {
            group: 'Display & Design',
            items: [
              { key: 'Screen Size / Dimensions', value: product.attributes?.screenSize || 'Standard market standard' },
              { key: 'Finish', value: 'Scratch-resistant oleophobic coating' },
              { key: 'Water Resistance', value: 'IP68 Dust and Water Resistant' }
            ]
          }
        ];

    // Add Warranty and Manufacturer Info if missing
    const hasWarranty = baseSpecs.some((g) => g.group.toLowerCase().includes('warranty'));
    const hasMfg = baseSpecs.some((g) => g.group.toLowerCase().includes('manufacturer'));

    const fullSpecs = [...baseSpecs];

    if (!hasWarranty) {
      fullSpecs.push({
        group: 'Warranty & Support',
        items: [
          { key: 'Warranty Summary', value: '1 Year Comprehensive Manufacturer Brand Warranty' },
          { key: 'Warranty Service Type', value: 'Carry-in / On-site brand authorized service center' },
          { key: 'Covered in Warranty', value: 'Manufacturing and workmanship defects' },
          { key: 'Not Covered in Warranty', value: 'Physical damage, liquid damage, or unauthorized tampering' }
        ]
      });
    }

    if (!hasMfg) {
      fullSpecs.push({
        group: 'Manufacturing & Compliance Details',
        items: [
          { key: 'Country of Origin', value: 'India / Assembled in India' },
          { key: 'Manufactured By', value: `${product.brand} Technologies Private Limited` },
          { key: 'Imported & Packed By', value: 'Avero Retail Fulfillment Logistics Hub, Bengaluru 560066' },
          { key: 'Generic Name', value: product.category || 'Consumer Product' }
        ]
      });
    }

    return fullSpecs;
  }, [product]);

  // Filter groups and items by search query
  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return specificationGroups;

    return specificationGroups
      .map((group) => {
        const matchesGroupName = group.group.toLowerCase().includes(q);
        const matchedItems = group.items.filter(
          (item) =>
            item.key.toLowerCase().includes(q) || item.value.toLowerCase().includes(q)
        );

        if (matchesGroupName) return group;
        if (matchedItems.length > 0) return { ...group, items: matchedItems };
        return null;
      })
      .filter(Boolean);
  }, [specificationGroups, searchQuery]);

  const toggleGroup = (groupName) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '16px 16px 80px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
            className="pdp-floating-btn"
            aria-label="Back to product"
            style={{ width: '38px', height: '38px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Full Specifications
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {product.title}
            </div>
          </div>
        </div>
      </div>

      {/* Live Search Bar */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search
          size={18}
          color="var(--text-secondary)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search specifications (e.g. processor, battery, display, warranty)..."
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
            fontSize: '14px',
            boxShadow: 'var(--shadow-xs)'
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: 'var(--primary-600)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Specification Groups Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, gIdx) => {
            const isCollapsed = collapsedGroups[group.group];

            return (
              <div
                key={gIdx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                {/* Group Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.group)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    backgroundColor: '#F8FAFC',
                    borderBottom: isCollapsed ? 'none' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} color="var(--primary-600)" />
                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {group.group}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      ({group.items.length} details)
                    </span>
                  </div>

                  <div style={{ color: 'var(--text-secondary)' }}>
                    {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </div>
                </button>

                {/* Table Rows */}
                {!isCollapsed && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <tbody>
                      {group.items.map((item, iIdx) => (
                        <tr
                          key={iIdx}
                          style={{
                            borderBottom: iIdx === group.items.length - 1 ? 'none' : '1px solid var(--border-divider)',
                            backgroundColor: iIdx % 2 === 0 ? '#ffffff' : '#FAFCFF'
                          }}
                        >
                          <td
                            style={{
                              width: '35%',
                              padding: '12px 20px',
                              color: 'var(--text-secondary)',
                              fontWeight: '600',
                              verticalAlign: 'top'
                            }}
                          >
                            {item.key}
                          </td>
                          <td
                            style={{
                              padding: '12px 20px',
                              color: 'var(--text-primary)',
                              fontWeight: '500',
                              lineHeight: '1.5'
                            }}
                          >
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })
        ) : (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            No specifications found matching "{searchQuery}". Try a different keyword.
          </div>
        )}
      </div>
    </div>
  );
}
