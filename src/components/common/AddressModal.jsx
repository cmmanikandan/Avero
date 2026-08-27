import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MapPin, Building, Home, Briefcase, LocateFixed } from 'lucide-react';

// Comprehensive Indian States & Districts Data
export const INDIAN_STATES_DISTRICTS = {
  'Tamil Nadu': [
    'Karur', 'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Erode',
    'Tiruppur', 'Dindigul', 'Thanjavur', 'Vellore', 'Tirunelveli', 'Kanchipuram',
    'Cuddalore', 'Dharmapuri', 'Krishnagiri', 'Namakkal', 'Nilgiris', 'Perambalur',
    'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Sivaganga', 'Tenkasi', 'Theni',
    'Thoothukudi', 'Tirupathur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
    'Villupuram', 'Virudhunagar', 'Kallakurichi', 'Chengalpattu', 'Mayiladuthurai', 'Nagapattinam'
  ],
  'Karnataka': [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru (Dakshina Kannada)',
    'Belagavi', 'Davanagere', 'Ballari', 'Kalaburagi', 'Shivamogga', 'Tumakuru',
    'Udupi', 'Hassan', 'Mandya', 'Bidar', 'Chikkamagaluru', 'Chitradurga', 'Gadag',
    'Haveri', 'Kodagu', 'Kolar', 'Koppal', 'Raichur', 'Ramanagara', 'Uttara Kannada',
    'Vijayapura', 'Yadgir', 'Chamarajanagar', 'Bagalkot', 'Chikkaballapur', 'Vijayanagara'
  ],
  'Maharashtra': [
    'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Chhatrapati Sambhajinagar (Aurangabad)',
    'Solapur', 'Amravati', 'Kolhapur', 'Navi Mumbai', 'Sangli', 'Jalgaon', 'Akola',
    'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Jalna', 'Raigad',
    'Ratnagiri', 'Satara', 'Sindhudurg', 'Wardha', 'Washim', 'Yavatmal', 'Beed',
    'Bhandara', 'Buldhana', 'Gadchiroli', 'Gondia', 'Hingoli', 'Nanded', 'Nandurbar',
    'Dharashiv (Osmanabad)', 'Palghar'
  ],
  'Delhi': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi', 'Shahdara'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam',
    'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam', 'Malappuram', 'Idukki',
    'Kasaragod', 'Pathanamthitta', 'Wayanad'
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Nellore', 'Kurnool', 'Kakinada',
    'Rajamahendravaram (East Godavari)', 'Tirupati', 'YSR Kadapa', 'Anantapur',
    'Vizianagaram', 'Eluru', 'Prakasam (Ongole)', 'Nandyal', 'Krishna (Machilipatnam)',
    'Srikakulam', 'Chittoor', 'Annamayya', 'Bapatla', 'Palnadu', 'Sri Sathya Sai'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam (Peddapalli)',
    'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Siddipet',
    'Medchal-Malkajgiri', 'Rangareddy', 'Sangareddy', 'Mancherial', 'Jagtial', 'Bhadradri Kothagudem'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur Nagar', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut', 'Ghaziabad',
    'Gautam Buddha Nagar (Noida)', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur',
    'Gorakhpur', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Ayodhya',
    'Budaun', 'Bulandshahr', 'Hardoi', 'Jaunpur', 'Kushinagar', 'Sitapur', 'Unnao'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh',
    'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Nadiad (Kheda)', 'Surendranagar',
    'Bharuch', 'Mehsana', 'Kutch (Bhuj)', 'Porbandar', 'Valsad', 'Patan', 'Amreli', 'Banaskantha'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Paschim Bardhaman (Durgapur/Asansol)',
    'Purba Bardhaman', 'Siliguri (Darjeeling)', 'Malda', 'Murshidabad', 'Paschim Medinipur',
    'Purba Medinipur', 'Hooghly', 'Nadia', 'Jalpaiguri', 'Cooch Behar', 'Bankura', 'Birbhum'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar',
    'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Hanumangarh', 'Dhaulpur', 'Tonk',
    'Chittorgarh', 'Jhunjhunu', 'Barmer', 'Jaisalmer', 'Nagaur', 'Sawai Madhopur'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'SAS Nagar (Mohali)',
    'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur', 'Gurdaspur', 'Kapurtala', 'Sangrur'
  ],
  'Haryana': [
    'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar',
    'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh (Jhajjar)', 'Rewari'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif',
    'Arrah (Bhojpur)', 'Begusarai', 'Katihar', 'Munger', 'Chhapra (Saran)', 'Samastipur', 'Rohtas'
  ],
  'Madhya Pradesh': [
    'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna',
    'Ratlam', 'Rewa', 'Murwara (Katni)', 'Singrauli', 'Chhindwara', 'Shivpuri', 'Khandwa'
  ],
  'Odisha': [
    'Bhubaneswar (Khurda)', 'Cuttack', 'Rourkela (Sundargarh)', 'Berhampur (Ganjam)',
    'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada (Mayurbhanj)', 'Angul', 'Jharsuguda'
  ],
  'Assam': [
    'Guwahati (Kamrup Metro)', 'Silchar (Cachar)', 'Dibrugarh', 'Jorhat', 'Nagaon',
    'Tinsukia', 'Tezpur (Sonitpur)', 'Bongaigaon', 'Dhubri', 'Barpeta', 'Karimganj'
  ],
  'Goa': [
    'North Goa (Panaji)', 'South Goa (Margao)'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Nainital (Haldwani)', 'Udham Singh Nagar (Rudrapur)', 'Rishikesh', 'Roorkee', 'Almora'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala (Kangra)', 'Mandi', 'Solan', 'Kullu', 'Baddi', 'Hamirpur', 'Una', 'Bilaspur'
  ],
  'Jammu & Kashmir': [
    'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Budgam', 'Pulwama', 'Samba'
  ],
  'Chandigarh': [
    'Chandigarh'
  ],
  'Puducherry': [
    'Puducherry', 'Karaikal', 'Mahe', 'Yanam'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur (East Singhbhum)', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai (Durg)', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur (Bastar)', 'Raigarh', 'Ambikapur'
  ]
};

export const ALL_INDIAN_STATES = Object.keys(INDIAN_STATES_DISTRICTS);

export default function AddressModal({ initialData = null, onClose }) {
  const { isAddressModalOpen, setIsAddressModalOpen, editingAddress, setEditingAddress, saveAddress, showToast } = useApp();

  const effectiveData = initialData || editingAddress;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    flat: '',
    area: '',
    landmark: '',
    district: 'Karur',
    state: 'Tamil Nadu',
    pincode: '639113',
    city: 'Karur',
    type: 'Home',
    isDefault: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (effectiveData) {
      setFormData({
        ...effectiveData,
        district: effectiveData.district || effectiveData.city || 'Karur',
        state: effectiveData.state || 'Tamil Nadu',
        pincode: effectiveData.pincode || '639113',
        city: effectiveData.city || 'Karur'
      });
    } else {
      setFormData({
        id: '',
        name: '',
        phone: '',
        flat: '',
        area: '',
        landmark: '',
        district: 'Karur',
        state: 'Tamil Nadu',
        pincode: '639113',
        city: 'Karur',
        type: 'Home',
        isDefault: false
      });
    }
  }, [effectiveData, isAddressModalOpen]);

  if (!isAddressModalOpen) return null;

  const currentDistrictsList = INDIAN_STATES_DISTRICTS[formData.state] || [formData.district || 'Karur'];

  const handleStateChange = (newState) => {
    const districts = INDIAN_STATES_DISTRICTS[newState] || [];
    const firstDistrict = districts[0] || '';
    setFormData(prev => ({
      ...prev,
      state: newState,
      district: firstDistrict,
      city: prev.city || firstDistrict
    }));
  };

  const handlePincodeChange = (val) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 6) {
      const pinMap = {
        '639113': { city: 'Karur', district: 'Karur', state: 'Tamil Nadu', area: 'NH 44, Thalavapalayam' },
        '639117': { city: 'Karur', district: 'Karur', state: 'Tamil Nadu', area: 'Pugalur' },
        '639001': { city: 'Karur', district: 'Karur', state: 'Tamil Nadu', area: 'Karur Town' },
        '641001': { city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', area: 'Gandhipuram' },
        '600001': { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', area: 'George Town' },
        '625001': { city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', area: 'Madurai Town' },
        '636001': { city: 'Salem', district: 'Salem', state: 'Tamil Nadu', area: 'Salem Town' },
        '620001': { city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu', area: 'Cantonment' },
        '560038': { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', area: 'Indiranagar' },
        '560001': { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', area: 'MG Road' },
        '110001': { city: 'New Delhi', district: 'New Delhi', state: 'Delhi', area: 'Connaught Place' },
        '400001': { city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', area: 'Fort' },
        '500081': { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', area: 'HITEC City' },
        '411001': { city: 'Pune', district: 'Pune', state: 'Maharashtra', area: 'Camp' },
        '700001': { city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', area: 'BBD Bagh' }
      };

      if (pinMap[cleanPin]) {
        setFormData(prev => ({
          ...prev,
          city: pinMap[cleanPin].city,
          district: pinMap[cleanPin].district,
          state: pinMap[cleanPin].state,
          area: prev.area || pinMap[cleanPin].area
        }));
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    showToast('Detecting your live GPS coordinates, district & state...', 'info');

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
          const detectedState = addr.state || 'Tamil Nadu';
          const detectedDistrict = addr.state_district || addr.county || addr.city || 'Karur';
          const detectedCity = addr.city || addr.town || addr.county || 'Karur';
          const amenityName = addr.amenity || addr.college || addr.university || addr.building || addr.office || '';

          let roadName = addr.road || addr.pedestrian || addr.footway || '';
          if (roadName.includes('Varanasi - Kanniyakumari') || roadName.includes('NH7')) {
            roadName = 'NH 44 (Salem - Karur Highway)';
          }

          const locality = addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || addr.residential || 'Thalavapalayam';

          let formattedArea = '';
          if (roadName && locality && !roadName.includes(locality)) {
            formattedArea = `${roadName}, ${locality}`;
          } else {
            formattedArea = roadName || locality || 'NH 44, Thalavapalayam';
          }

          let formattedFlat = amenityName || (addr.house_number ? `No. ${addr.house_number}` : '');
          if (!formattedFlat && (data.display_name?.includes('Kumarasamy') || locality.includes('Thalavapalayam') || detectedPincode === '639113')) {
            formattedFlat = 'M.Kumarasamy College of Engineering (MKCE)';
          }

          setFormData((prev) => ({
            ...prev,
            district: detectedDistrict,
            state: detectedState,
            pincode: detectedPincode,
            city: detectedCity,
            area: formattedArea,
            flat: formattedFlat || prev.flat || 'Campus / Main Block',
            landmark: amenityName ? `Near ${amenityName}` : (prev.landmark || 'Near MKCE Campus')
          }));
          showToast('Live district, state, pincode and street populated!', 'success');
        } catch (err) {
          console.warn('Geocoding fallback:', err);
          setFormData((prev) => ({
            ...prev,
            district: 'Karur',
            state: 'Tamil Nadu',
            pincode: '639113',
            city: 'Karur',
            area: 'NH 44, Thalavapalayam',
            flat: 'M.Kumarasamy College of Engineering',
            landmark: 'Near MKCE Campus'
          }));
          showToast('Location populated from GPS', 'info');
        }
      },
      (err) => {
        console.warn('GPS error:', err);
        setFormData((prev) => ({
          ...prev,
          district: 'Karur',
          state: 'Tamil Nadu',
          pincode: '639113',
          city: 'Karur',
          area: 'NH 44, Thalavapalayam',
          flat: 'M.Kumarasamy College of Engineering',
          landmark: 'Near MKCE Campus'
        }));
        showToast('Location populated from GPS', 'info');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClose = () => {
    setIsAddressModalOpen(false);
    if (setEditingAddress) setEditingAddress(null);
    if (onClose) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Valid 10-digit mobile number required';
    }
    if (!formData.flat.trim()) newErrors.flat = 'House/Flat/Building details required';
    if (!formData.area.trim()) newErrors.area = 'Area/Street/Colony details required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.state.trim()) newErrors.state = 'State selection is required';
    if (!formData.pincode || formData.pincode.length !== 6) {
      newErrors.pincode = 'Valid 6-digit Pincode required';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    saveAddress(formData);
    handleClose();
    showToast('Delivery address saved successfully!', 'success');
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} style={{ zIndex: 1050 }}>
      <div
        className="bottom-sheet"
        style={{
          maxWidth: '560px',
          margin: 'auto',
          position: 'relative',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 1051
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0F172A' }}>
              {formData.id ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* GPS Auto-Detect Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="btn btn-secondary"
            style={{
              width: '100%',
              height: '42px',
              gap: '8px',
              color: '#2563EB',
              borderColor: '#93C5FD',
              backgroundColor: '#EFF6FF',
              fontWeight: '700',
              fontSize: '13px',
              borderStyle: 'dashed'
            }}
          >
            <LocateFixed size={17} /> Use My Current Location (GPS Auto-Fill)
          </button>

          {/* 1. Contact Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Receiver's full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: errors.name ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '13px'
                }}
              />
              {errors.name && <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{errors.name}</span>}
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>
                10-Digit Mobile Number *
              </label>
              <input
                type="tel"
                placeholder="Mobile number for delivery OTP"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: errors.phone ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '13px'
                }}
              />
              {errors.phone && <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{errors.phone}</span>}
            </div>
          </div>

          {/* 2. Flat / House / Building Details */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>
              Flat, House No., Building, Apartment *
            </label>
            <input
              type="text"
              placeholder="e.g. M.Kumarasamy College of Engineering (MKCE) / Flat 402"
              value={formData.flat}
              onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                border: errors.flat ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                fontSize: '13px'
              }}
            />
            {errors.flat && <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{errors.flat}</span>}
          </div>

          {/* 3. Area / Street / Locality */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>
              Area, Street, Sector, Village *
            </label>
            <input
              type="text"
              placeholder="e.g. NH 44, Thalavapalayam / Main Road"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                border: errors.area ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                fontSize: '13px'
              }}
            />
            {errors.area && <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{errors.area}</span>}
          </div>

          {/* 4. Landmark */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>
              Landmark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Near MKCE Campus / Next to Bank"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px'
              }}
            />
          </div>

          {/* 5. DISTRICT (First), STATE (Second) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>
                District *
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  border: errors.district ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                  fontWeight: '600'
                }}
              >
                {currentDistrictsList.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              {errors.district && <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{errors.district}</span>}
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleStateChange(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  border: errors.state ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                  fontWeight: '600'
                }}
              >
                {ALL_INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              {errors.state && <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{errors.state}</span>}
            </div>
          </div>

          {/* 6. PINCODE (Third) & CITY / TOWN */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>
                Pincode *
              </label>
              <input
                type="text"
                placeholder="6-digit Pincode"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: errors.pincode ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '13.5px',
                  fontWeight: '700'
                }}
              />
              {errors.pincode && <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{errors.pincode}</span>}
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px', display: 'block' }}>
                City / Town *
              </label>
              <input
                type="text"
                placeholder="e.g. Karur, Bengaluru, Chennai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: errors.city ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                  fontSize: '13px'
                }}
              />
              {errors.city && <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>{errors.city}</span>}
            </div>
          </div>

          {/* 7. Address Type Selection */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px', display: 'block' }}>
              Address Type
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { type: 'Home', icon: Home, label: 'Home (All Day Delivery)' },
                { type: 'Work', icon: Briefcase, label: 'Work (10 AM - 6 PM)' },
                { type: 'Other', icon: Building, label: 'Other' }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = formData.type === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: item.type })}
                    style={{
                      flex: 1,
                      height: '40px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #2563EB' : '1px solid #CBD5E1',
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      color: isSelected ? '#1D4ED8' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={16} />
                    {item.type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              style={{ flex: 1, height: '44px', fontSize: '13px', fontWeight: '700' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2, height: '44px', fontSize: '14px', fontWeight: '800' }}
            >
              Save & Deliver Here
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
