import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { firebaseAuthService } from '../services/firebase';
import AddressModal from '../components/common/AddressModal';
import UserAvatar from '../components/common/UserAvatar';
import {
  User,
  Package,
  Heart,
  MapPin,
  HelpCircle,
  LogOut,
  LogIn,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Store,
  ShieldCheck,
  KeyRound,
  Truck,
  Camera,
  Tag,
  Gift,
  Sparkles
} from 'lucide-react';

export default function AccountPage() {
  const navigate = useNavigate();
  const {
    user,
    addresses,
    deleteAddress,
    setDefaultAddress,
    openAddAddressModal,
    openEditAddressModal,
    setIsAuthModalOpen,
    logoutUser,
    showToast
  } = useApp();

  const handleEditAddr = (addr) => {
    openEditAddressModal(addr);
  };

  const handleAddNewAddr = () => {
    openAddAddressModal();
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    await firebaseAuthService.sendPasswordResetEmail(user.email);
    showToast(`Password reset link sent to ${user.email}`, 'success');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '16px', maxWidth: '880px', margin: '0 auto' }}>
      
      {/* Top Profile Header Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Avatar with Google DP / Custom Photo */}
          <Link
            to={user.isAuth ? "/account/edit" : "/login"}
            style={{
              position: 'relative',
              display: 'inline-block',
              textDecoration: 'none'
            }}
            title={user.isAuth ? "Click to Edit Profile & Display Picture" : "Sign In"}
          >
            <UserAvatar user={user} size={68} fontSize={22} border="2px solid var(--primary-500)" boxShadow="0 2px 8px rgba(19, 102, 226, 0.15)" />

            {user.isAuth && (
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                backgroundColor: 'var(--primary-600)',
                color: '#ffffff',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }}>
                <Camera size={11} />
              </div>
            )}
          </Link>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {user.isAuth ? user.name : 'Welcome to Avero'}
              </h1>
              {user.isAuth && (
                <span style={{ fontSize: '11px', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {user.isAuth ? (
                <span>{user.email} {user.phone ? `• ${user.phone}` : ''}</span>
              ) : (
                'Sign in to access your orders, wishlist, and saved delivery addresses'
              )}
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {user.isAuth ? (
            <>
              <Link
                to="/account/edit"
                className="btn btn-primary"
                style={{ padding: '8px 14px', minHeight: '38px', fontSize: '13px', gap: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                <Edit2 size={14} /> Edit Profile
              </Link>
              <button
                type="button"
                onClick={handleResetPassword}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', minHeight: '38px', fontSize: '13px', gap: '6px' }}
                title="Send Password Reset Email"
              >
                <KeyRound size={14} /> Reset Password
              </button>
              <button
                type="button"
                onClick={logoutUser}
                className="btn btn-secondary"
                style={{ color: '#DC2626', borderColor: '#FCA5A5', padding: '8px 16px', minHeight: '38px', gap: '6px' }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="btn btn-primary"
              style={{ padding: '10px 24px', minHeight: '44px', gap: '8px', fontSize: '14px', fontWeight: '700' }}
            >
              <LogIn size={16} /> Sign In / Register
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <Link
          to="/orders"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-xs)',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-full)', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
            <Package size={20} />
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>My Orders</span>
        </Link>

        <Link
          to="/wishlist"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-xs)',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-full)', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
            <Heart size={20} />
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>Wishlist</span>
        </Link>

        <Link
          to="/coupons"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-xs)',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-full)', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
            <Tag size={20} />
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>Coupons & Offers</span>
        </Link>

        <Link
          to={user.role === 'seller' ? '/seller' : '/become-seller'}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-xs)',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-full)', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <Store size={20} />
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {user.role === 'seller' ? 'Seller Hub' : 'Become Seller'}
          </span>
        </Link>
      </div>

      {/* Saved Addresses Section */}
      {user.isAuth ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--primary-600)" /> Saved Addresses ({addresses.length})
            </h2>

            <button
              type="button"
              onClick={handleAddNewAddr}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '12px', minHeight: '36px', gap: '6px' }}
            >
              <Plus size={14} /> Add New Address
            </button>
          </div>

          {addresses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{addr.name}</strong>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: addr.type === 'Home' ? '#E0F2FE' : '#FEF3C7',
                        color: addr.type === 'Home' ? '#0369A1' : '#92400E',
                        fontWeight: '700'
                      }}>
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span style={{ fontSize: '10px', color: 'var(--savings-green)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <CheckCircle2 size={10} /> Default
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {addr.flat}, {addr.area}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Phone: <strong>{addr.phone}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="btn btn-tertiary"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEditAddr(addr)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-600)', cursor: 'pointer', padding: '4px' }}
                      title="Edit Address"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                      title="Delete Address"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
              No addresses saved yet. Add your home or office address for fast 1-click checkout.
            </div>
          )}
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '32px 20px',
          textAlign: 'center',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#E0F2FE',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Unlock Full Profile Features
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '6px auto 16px', lineHeight: '1.5' }}>
            Sign in to save multiple delivery addresses, track real-time orders, manage returns, and save products to your personal wishlist.
          </p>
          <Link
            to="/login"
            className="btn btn-primary"
            style={{ height: '42px', padding: '0 24px', fontSize: '13px', fontWeight: '700', gap: '6px', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <LogIn size={15} /> Sign In to Avero
          </Link>
        </div>
      )}

      {/* Merchant / Seller Ecosystem Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={18} color="#D97706" /> Seller & Merchant Central
        </h2>

        {user.isAuth && user.role === 'seller' ? (
          <div style={{ backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FDE68A', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontWeight: '800', fontSize: '14px' }}>
                <ShieldCheck size={16} /> Verified Active Merchant
              </div>
              <p style={{ fontSize: '12px', color: '#92400E', margin: '2px 0 0' }}>
                Your store is live. Access your vendor catalog, inventory, and order fulfillment dashboard.
              </p>
            </div>
            <Link
              to="/seller"
              className="btn btn-primary"
              style={{ height: '38px', padding: '0 18px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', backgroundColor: '#D97706', borderColor: '#D97706' }}
            >
              Open Seller Dashboard →
            </Link>
          </div>
        ) : (
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-subtle)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>
                Want to sell on Avero Marketplace?
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Complete the 5-step KYC verification (GSTIN, PAN & Bank Details) to start selling.
              </p>
            </div>
            <Link
              to="/become-seller"
              className="btn btn-primary"
              style={{ height: '38px', padding: '0 18px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}
            >
              Start Seller Verification →
            </Link>
          </div>
        )}
      </div>

      {/* Help & Support Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '20px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={18} color="var(--primary-600)" /> Customer Help & Policies
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/help" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-divider)', fontSize: '13px', color: 'var(--text-primary)', textDecoration: 'none' }}>
            <span>Frequently Asked Questions & Returns</span>
            <ChevronRight size={16} color="var(--text-secondary)" />
          </Link>
          <Link to="/terms" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-divider)', fontSize: '13px', color: 'var(--text-primary)', textDecoration: 'none' }}>
            <span>Terms of Use & Privacy Policy</span>
            <ChevronRight size={16} color="var(--text-secondary)" />
          </Link>
          <Link to="/contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', color: 'var(--text-primary)', textDecoration: 'none' }}>
            <span>24x7 Customer Support Helpline: <strong>support@avero.in</strong></span>
            <span style={{ fontSize: '12px', color: 'var(--savings-green)', fontWeight: '600' }}>Contact Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
