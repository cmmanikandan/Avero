import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MapPin, Check, Plus, LogIn, LocateFixed } from 'lucide-react';

export default function LocationModal() {
  const {
    user,
    isLocationSelectorOpen,
    setIsLocationSelectorOpen,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    activePincode,
    changePincode,
    setIsAddressModalOpen,
    setIsAuthModalOpen,
    showToast
  } = useApp();

  const [customPin, setCustomPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  if (!isLocationSelectorOpen) return null;

  const handleApplyPincode = (e) => {
    e.preventDefault();
    if (!customPin || customPin.length !== 6) {
      setPinError('Enter a valid 6-digit Pincode');
      return;
    }
    changePincode(customPin);
    setIsLocationSelectorOpen(false);
  };

  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsDetectingLocation(true);
    showToast('Detecting your live GPS location...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};
          const detectedPincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '639113';
          const detectedCity = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district || 'Karur';
          const fullLabel = addr.state ? `${detectedCity}, ${addr.state}` : detectedCity;

          changePincode(detectedPincode, fullLabel);
          setIsDetectingLocation(false);
          setIsLocationSelectorOpen(false);
        } catch (err) {
          console.warn('Geocoding fallback:', err);
          showToast('Could not resolve GPS location. Please choose your pincode.', 'info');
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        console.warn('Geolocation permission error:', err);
        showToast('Please enter your delivery pincode manually.', 'info');
        setIsDetectingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsLocationSelectorOpen(false)}>
      <div
        className="bottom-sheet"
        style={{
          maxWidth: '480px',
          margin: 'auto',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Choose Delivery Location</h3>
          </div>
          <button
            onClick={() => setIsLocationSelectorOpen(false)}
            style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Use My Current Location Live GPS Button */}
          <button
            type="button"
            onClick={handleDetectLiveLocation}
            disabled={isDetectingLocation}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--primary-400)',
              backgroundColor: '#EFF6FF',
              color: 'var(--primary-600)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: isDetectingLocation ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <LocateFixed size={18} />
            <span>{isDetectingLocation ? 'Detecting Live Location...' : 'Use My Current Location'}</span>
          </button>

          {/* Quick Pincode Input */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              Or Enter Pincode for Instant Delivery Availability
            </label>
            <form onSubmit={handleApplyPincode} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 560038"
                value={customPin}
                onChange={(e) => {
                  setCustomPin(e.target.value.replace(/\D/g, ''));
                  setPinError('');
                }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: pinError ? '1.5px solid #EF4444' : '1px solid var(--border-subtle)',
                  fontSize: '14px'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', height: '42px' }}>
                Apply
              </button>
            </form>
            {pinError && <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px', display: 'block' }}>{pinError}</span>}
          </div>

          {/* Saved Addresses Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-divider)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Saved Addresses ({addresses.length})
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-divider)' }} />
          </div>

          {/* Saved Addresses List */}
          {addresses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
              {addresses.map(addr => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      changePincode(addr.pincode);
                      setIsLocationSelectorOpen(false);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{addr.name}</strong>
                        <span style={{
                          fontSize: '10px',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: addr.type === 'Home' ? '#E0F2FE' : '#FEF3C7',
                          color: addr.type === 'Home' ? '#0369A1' : '#92400E',
                          fontWeight: '600'
                        }}>
                          {addr.type}
                        </span>
                        {addr.isDefault && <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>(Default)</span>}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                        {addr.flat}, {addr.area}, {addr.city} - {addr.pincode}
                      </p>
                    </div>
                    {isSelected && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--primary-600)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: 'var(--text-secondary)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)' }}>
              No saved addresses found. Add an address below.
            </div>
          )}

          {/* Add New Address Trigger */}
          <button
            type="button"
            onClick={() => {
              setIsLocationSelectorOpen(false);
              setIsAddressModalOpen(true);
            }}
            className="btn btn-secondary"
            style={{ width: '100%', gap: '8px', height: '42px' }}
          >
            <Plus size={16} /> Add New Address
          </button>

          {!user.isAuth && (
            <div style={{
              backgroundColor: '#F8FAFC',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              alignItems: 'center'
            }}>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                Sign in to sync your saved addresses across devices.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLocationSelectorOpen(false);
                  setIsAuthModalOpen(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-600)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '2px 6px'
                }}
              >
                Sign In to Your Account →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
