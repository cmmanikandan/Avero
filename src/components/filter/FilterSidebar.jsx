import React, { useState } from 'react';
import { CATEGORIES, UNIVERSAL_FILTERS } from '../../data/categories';
import { ChevronDown, ChevronUp, Search, Star, X, Check } from 'lucide-react';

export default function FilterSidebar({
  selectedCategory,
  activeFilters,
  onFilterChange,
  onClearFilters
}) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    rating: true,
    ram: true,
    storage: true,
    shoeSize: true,
    processor: true
  });

  const [brandSearch, setBrandSearch] = useState('');

  // Get category specific filters
  const categoryConfig = CATEGORIES.find(c => c.id === selectedCategory);
  const dynamicGroups = categoryConfig?.filterGroups || [];

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxToggle = (groupId, option) => {
    const current = activeFilters[groupId] || [];
    const updated = current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option];
    onFilterChange(groupId, updated);
  };

  const activeFilterCount = Object.keys(activeFilters).reduce((sum, key) => {
    const val = activeFilters[key];
    if (Array.isArray(val)) return sum + val.length;
    if (val !== undefined && val !== null && val !== '') return sum + 1;
    return sum;
  }, 0);

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      padding: '16px',
      alignSelf: 'flex-start',
      position: 'sticky',
      top: '84px',
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto'
    }} className="no-scrollbar">
      {/* Header with Clear All */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-divider)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Filters</span>
          {activeFilterCount > 0 && (
            <span style={{
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-600)',
              fontSize: '11px',
              fontWeight: '700',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)'
            }}>
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600' }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Avero Assured Quick Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid var(--border-divider)'
      }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0B56CA' }}>Avero Assured</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Verified quality</span>
        </div>
        <input
          type="checkbox"
          checked={!!activeFilters.assured}
          onChange={(e) => onFilterChange('assured', e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
        />
      </div>

      {/* Dynamic Category Specific Filter Groups */}
      {dynamicGroups.map(group => {
        const isExpanded = expandedSections[group.id] !== false;
        const currentVals = activeFilters[group.id] || [];

        // Searchable filter options (for brands etc)
        const displayOptions = group.searchable && brandSearch.trim()
          ? group.options.filter(opt => opt.toLowerCase().includes(brandSearch.toLowerCase()))
          : group.options;

        return (
          <div key={group.id} style={{ borderBottom: '1px solid var(--border-divider)', padding: '12px 0' }}>
            <button
              onClick={() => toggleSection(group.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: '600',
                fontSize: '13px',
                color: 'var(--text-primary)',
                textAlign: 'left'
              }}
            >
              <span>{group.name}</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isExpanded && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.searchable && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-xs)',
                    padding: '4px 8px',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '4px'
                  }}>
                    <Search size={13} color="var(--text-secondary)" style={{ marginRight: '6px' }} />
                    <input
                      type="text"
                      placeholder={`Search ${group.name}...`}
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      style={{ border: 'none', backgroundColor: 'transparent', fontSize: '12px', width: '100%' }}
                    />
                  </div>
                )}

                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }} className="no-scrollbar">
                  {displayOptions.map(opt => {
                    const isChecked = currentVals.includes(opt);
                    return (
                      <label
                        key={opt}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxToggle(group.id, opt)}
                          style={{ width: '15px', height: '15px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Universal Rating Filter */}
      <div style={{ borderBottom: '1px solid var(--border-divider)', padding: '12px 0' }}>
        <button
          onClick={() => toggleSection('rating')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontWeight: '600',
            fontSize: '13px',
            color: 'var(--text-primary)'
          }}
        >
          <span>Customer Rating</span>
          {expandedSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSections.rating && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[4, 3, 2].map(starVal => (
              <label
                key={starVal}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="ratingFilter"
                  checked={activeFilters.minRating === starVal}
                  onChange={() => onFilterChange('minRating', starVal)}
                  style={{ accentColor: 'var(--primary-600)', cursor: 'pointer' }}
                />
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                  {starVal}★ & above
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Universal Discount Filter */}
      <div style={{ padding: '12px 0' }}>
        <button
          onClick={() => toggleSection('discount')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontWeight: '600',
            fontSize: '13px',
            color: 'var(--text-primary)'
          }}
        >
          <span>Discount</span>
          {expandedSections.discount ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSections.discount && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[50, 40, 30, 20, 10].map(disc => (
              <label
                key={disc}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="discountFilter"
                  checked={activeFilters.minDiscount === disc}
                  onChange={() => onFilterChange('minDiscount', disc)}
                  style={{ accentColor: 'var(--primary-600)', cursor: 'pointer' }}
                />
                <span>{disc}% or more</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
