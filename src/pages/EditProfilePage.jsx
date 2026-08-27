import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { supabaseService } from '../services/supabase';
import {
  User,
  Camera,
  Upload,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, showToast } = useApp();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    gender: user?.gender || '',
    dob: user?.dob || '',
    city: user?.city || ''
  });

  if (!user.isAuth) {
    navigate('/login');
    return null;
  }

  const handleDpFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be under 5MB', 'error');
      return;
    }

    showToast('Uploading avatar to Cloudinary CDN...', 'info');
    try {
      const res = await uploadToCloudinary(file);
      if (res?.secureUrl) {
        setProfileForm(prev => ({ ...prev, avatar: res.secureUrl }));
        showToast('Profile photo uploaded to Cloudinary!', 'success');
      }
    } catch (err) {
      // Fallback to local FileReader if network fails
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileForm(prev => ({ ...prev, avatar: event.target?.result }));
        showToast('Profile photo updated locally!', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setProfileForm(prev => ({ ...prev, avatar: '' }));
    showToast('Profile photo removed. Monogram initials will be used.', 'info');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    const updatedUser = {
      ...user,
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      avatar: profileForm.avatar,
      gender: profileForm.gender,
      dob: profileForm.dob,
      city: profileForm.city
    };

    setUser(updatedUser);
    localStorage.setItem('avero_user', JSON.stringify(updatedUser));
    supabaseService.syncUserProfile(updatedUser).catch(console.warn);
    showToast('Profile details & display picture updated successfully!', 'success');
    navigate('/account');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '16px', maxWidth: '680px', margin: '0 auto' }}>
      
      {/* Top Breadcrumbs & Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
        <button
          type="button"
          onClick={() => navigate('/account')}
          className="pdp-back-btn"
          aria-label="Back to Account"
          title="Back to Account"
        >
          <ArrowLeft size={16} />
        </button>
        <Link to="/account" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Account</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Edit Profile & DP</span>
      </div>

      {/* Main Form Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        {/* Header Title */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              Edit Personal Profile
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px', margin: 0 }}>
              Update your photo, legal name, phone number, and account preferences
            </p>
          </div>

          <span style={{ fontSize: '11px', color: '#166534', backgroundColor: '#DCFCE7', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} /> Verified Account
          </span>
        </div>

        <form onSubmit={handleSaveProfile} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Display Picture (DP) Section */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            {/* DP Circle */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#E0F2FE',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '3px solid var(--primary-500)',
                boxShadow: '0 4px 12px rgba(19, 102, 226, 0.18)'
              }}>
                {profileForm.avatar ? (
                  <img src={profileForm.avatar} alt="Profile DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={42} />
                )}
              </div>

              <label style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                backgroundColor: 'var(--primary-600)',
                color: '#ffffff',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid #ffffff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }} title="Upload Photo">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDpFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* DP Action Buttons */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                Profile Display Picture (DP)
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Upload a custom photo or use your Google profile avatar (PNG, JPG max 3MB).
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                <label
                  className="btn btn-secondary"
                  style={{
                    fontSize: '12px',
                    padding: '6px 14px',
                    height: '34px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Upload size={14} /> Upload New Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDpFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                {profileForm.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    style={{
                      background: 'none',
                      border: '1px solid #FECACA',
                      borderRadius: 'var(--radius-xs)',
                      padding: '6px 12px',
                      color: '#DC2626',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      height: '34px'
                    }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Full Name */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Rohan Sharma"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Mobile Phone & Email 2-Col Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                  Mobile Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98450 12345"
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                  Registered Email (Verified)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="email"
                    disabled
                    value={profileForm.email}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #E2E8F0',
                      backgroundColor: '#F1F5F9',
                      color: '#64748B',
                      fontSize: '14px',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Gender & Date of Birth */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '8px' }}>
                  Gender
                </label>
                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#334155', paddingTop: '4px' }}>
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '600' }}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={profileForm.gender === g}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', display: 'block', marginBottom: '6px' }}>
                  Date of Birth
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="date"
                    value={profileForm.dob}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, dob: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Form Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid var(--border-divider)',
            paddingTop: '20px',
            marginTop: '10px'
          }}>
            <button
              type="button"
              onClick={() => navigate('/account')}
              className="btn btn-secondary"
              style={{ height: '44px', padding: '0 20px', fontSize: '14px' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ height: '44px', padding: '0 28px', fontSize: '14px', fontWeight: '800', gap: '8px' }}
            >
              <Save size={16} /> Save Profile Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
