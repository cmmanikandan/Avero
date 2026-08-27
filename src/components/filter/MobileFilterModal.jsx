import React, { useState } from 'react';
import { CATEGORIES } from '../../data/categories';
import { X, Check, Search } from 'lucide-react';

export default function MobileFilterModal({
  isOpen,
  onClose,
  selectedCategory,
  activeFilters,
  onFilterChange,
  onClearFilters
}) {
  const [selectedTab, setSelectedTab] = useState('brand');
  const [brandSearch, setBrandSearch] = useState('');

  if (!isOpen) return null;

  const categoryConfig = CATEGORIES.find(c => c.id === selectedCategory);
  const dynamicGroups = categoryConfig?.filterGroups || [];

  const filterTabs = [
    { id: 'assured', label: 'Avero Assured' },
    ...dynamicGroups.map(g => ({ id: g.id, label: g.name, config: g })),
    { id: 'rating', label: 'Rating' },
    { id: 'discount', label: 'Discount' }
  ];

  const handleCheckboxToggle = (groupId, option) => {
    const current = activeFilters[groupId] || [];
    const updated = current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option];
    onFilterChange(groupId, updated);
  };

  const activeGroup = dynamicGroups.find(g => g.id === selectedTab);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="bottom-sheet"
        style={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Filters</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClearFilters}
              style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600' }}
            >
              Clear All
            </button>
            <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Dual Pane Layout (Left Tabs, Right Options) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Tabs */}
          <div style={{
            width: '130px',
            backgroundColor: '#F8FAFC',
            borderRight: '1px solid var(--border-divider)',
            overflowY: 'auto'
          }}>
            {filterTabs.map(tab => {
              const isSelected = selectedTab === tab.id;
              const hasActive = activeFilters[tab.id]?.length > 0 || (tab.id === 'assured' && activeFilters.assured);

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  style={{
                    width: '100%',
                    padding: '14px 12px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: isSelected ? '700' : '500',
                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? 'var(--primary-600)' : 'var(--text-primary)',
                    borderLeft: isSelected ? '3px solid var(--primary-600)' : '3px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{tab.label}</span>
                  {hasActive && (
                    <span style={{ width: '6px', height: '6px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-600)' }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Filter Options Pane */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
            {selectedTab === 'assured' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={!!activeFilters.assured}
                  onChange={(e) => onFilterChange('assured', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                />
                <span>Avero Assured Quality Certified Only</span>
              </label>
            )}

            {activeGroup && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeGroup.searchable && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F1F5F9',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 10px',
                    marginBottom: '6px'
                  }}>
                    <Search size={14} color="var(--text-secondary)" style={{ marginRight: '6px' }} />
                    <input
                      type="text"
                      placeholder={`Search ${activeGroup.name}...`}
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      style={{ border: 'none', backgroundColor: 'transparent', fontSize: '12px', width: '100%' }}
                    />
                  </div>
                )}

                {activeGroup.options
                  .filter(opt => !activeGroup.searchable || !brandSearch || opt.toLowerCase().includes(brandSearch.toLowerCase()))
                  .map(opt => {
                    const isChecked = (activeFilters[activeGroup.id] || []).includes(opt);
                    return (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxToggle(activeGroup.id, opt)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
              </div>
            )}

            {selectedTab === 'rating' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[4, 3, 2].map(starVal => (
                  <label key={starVal} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <input
                      type="radio"
                      name="mRating"
                      checked={activeFilters.minRating === starVal}
                      onChange={() => onFilterChange('minRating', starVal)}
                      style={{ accentColor: 'var(--primary-600)' }}
                    />
                    <span>{starVal}★ & above</span>
                  </label>
                ))}
              </div>
            )}

            {selectedTab === 'discount' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[50, 40, 30, 20, 10].map(disc => (
                  <label key={disc} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <input
                      type="radio"
                      name="mDisc"
                      checked={activeFilters.minDiscount === disc}
                      onChange={() => onFilterChange('minDiscount', disc)}
                      style={{ accentColor: 'var(--primary-600)' }}
                    />
                    <span>{disc}% or more</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Apply Bar */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-divider)',
          display: 'flex',
          gap: '12px',
          backgroundColor: '#ffffff'
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary"
            style={{ width: '100%', height: '44px' }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
