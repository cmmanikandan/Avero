import React, { useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  Upload,
  Sparkles,
  Tag,
  ShieldCheck,
  Clock,
  Layers,
  Camera,
  Truck,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  Star,
  Zap,
  Info,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  Bot,
  Wand2,
  Palette,
  ExternalLink
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Natural Titanium', hex: '#9A9895', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80' },
  { name: 'Space Black', hex: '#1E293B', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
  { name: 'Starlight White', hex: '#F8FAFC', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80' },
  { name: 'Pacific Blue', hex: '#2563EB', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
  { name: 'Emerald Green', hex: '#059669', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80' },
  { name: 'Crimson Red', hex: '#DC2626', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { name: 'Sunset Gold', hex: '#D97706', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { name: 'Deep Purple', hex: '#7C3AED', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80' }
];



const DEFAULT_CATEGORY_SPECS = {
  mobiles: [
    { key: 'Processor / Chipset', value: 'Apple A17 Pro (3nm)' },
    { key: 'RAM & Storage', value: '8 GB RAM / 256 GB' },
    { key: 'Display', value: '6.7" 120Hz Super Retina XDR OLED' },
    { key: 'Rear & Front Camera', value: '48MP + 12MP + 12MP / 12MP' },
    { key: 'Battery & Charging', value: '4422 mAh / 25W Fast Charge' },
    { key: 'Warranty Policy', value: '1 Year Apple Brand Warranty' }
  ],
  audio: [
    { key: 'Sound Output / Wattage', value: '330W RMS (Peak 380W)' },
    { key: 'Channel Configuration', value: '3.1.2 Channel Dolby Atmos & DTS:X' },
    { key: 'Connectivity Ports', value: 'HDMI eARC, Optical In, Bluetooth 5.3, WiFi' },
    { key: 'Subwoofer & Drivers', value: 'Wireless 8-inch Active Subwoofer + 9 Drivers' },
    { key: 'Smart Audio Features', value: 'Q-Symphony, SpaceFit Sound Pro, Voice Amplify' },
    { key: 'Warranty Policy', value: '2 Years Manufacturer Warranty' }
  ],
  laptops: [
    { key: 'Processor (CPU)', value: 'Intel Core Ultra 9 185H (16 Cores, up to 5.1 GHz)' },
    { key: 'Graphics (GPU)', value: 'NVIDIA GeForce RTX 4070 8GB GDDR6' },
    { key: 'RAM & Storage', value: '32 GB LPDDR5X / 1 TB NVMe PCIe 4.0 SSD' },
    { key: 'Display & Refresh Rate', value: '16-inch 2.5K OLED (2560x1600) 240Hz 0.2ms' },
    { key: 'Operating System', value: 'Windows 11 Home with MS Office 2024' },
    { key: 'Battery & Weight', value: '90 Wh Battery / 1.85 kg Ultra-slim' },
    { key: 'Warranty Policy', value: '2 Years International Onsite Warranty' }
  ],
  electronics: [
    { key: 'Processor / Engine', value: 'Cognitive Processor XR' },
    { key: 'Display & Resolution', value: '55-inch 4K Ultra HD OLED 120Hz' },
    { key: 'Audio & Speakers', value: 'Acoustic Surface Audio+ 50W Dolby Atmos' },
    { key: 'Ports & Wireless', value: '4x HDMI 2.1, 2x USB, eARC, WiFi 6, Bluetooth' },
    { key: 'Smart TV OS', value: 'Google TV with Google Assistant' },
    { key: 'Warranty Policy', value: '3 Years Comprehensive Brand Warranty' }
  ],
  footwear: [
    { key: 'Available Sizes', value: 'UK 6, UK 7, UK 8, UK 9, UK 10, UK 11' },
    { key: 'Upper / Outer Material', value: 'Breathable Engineered Mesh & Flywire' },
    { key: 'Sole & Cushioning', value: 'Nike Zoom Air Unit + React Foam Midsole' },
    { key: 'Closure Type', value: 'Lace-Up with Padded Collar' },
    { key: 'Ideal Activity', value: 'Road Running, Cross Training, Everyday Casual' },
    { key: 'Warranty Policy', value: '3 Months Brand Manufacturing Defect Warranty' }
  ],
  fashion: [
    { key: 'Sizes Available', value: 'S, M, L, XL, XXL' },
    { key: 'Fabric Composition', value: '100% Combed Compact Cotton (220 GSM)' },
    { key: 'Fit & Pattern', value: 'Oversized Streetwear Fit / Typography Print' },
    { key: 'Neck & Sleeve', value: 'Ribbed Round Crew Neck / Half Sleeve' },
    { key: 'Care Instructions', value: 'Machine wash cold inside-out, do not iron print' },
    { key: 'Return Policy', value: '7-Day Doorstep Replacement / Return' }
  ],
  appliances: [
    { key: 'Capacity / Volume', value: '1.5 Ton / 350 Litres / 8 kg' },
    { key: 'Energy Star Rating', value: '5 Star BEE Inverter Rating' },
    { key: 'Power Consumption', value: '1150 Watts / Annual 650 kWh' },
    { key: 'Special Technology', value: 'AI Dual Inverter, Wi-Fi Smart Control, Anti-Bacterial' },
    { key: 'Compressor / Motor Warranty', value: '10 Years on Inverter Compressor' },
    { key: 'Comprehensive Warranty', value: '1 Year Full Unit Warranty' }
  ]
};

export default function SellerProducts({ isAddMode = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, products = [], vendorSubmissions = [], submitProductForReview, showToast } = useApp();
  const activeStoreName = user?.storeName || (user?.name ? `${user.name}'s Store` : '');

  // Mode: 'list' or 'create'
  const [viewMode, setViewMode] = useState(
    isAddMode || location.pathname.includes('/add') || location.pathname.includes('/new') || location.search.includes('add=1') ? 'create' : 'list'
  );

  React.useEffect(() => {
    if (location.search.includes('add=1') || location.pathname.includes('/add') || location.pathname.includes('/new') || isAddMode) {
      setViewMode('create');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.search, location.pathname, isAddMode]);

  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [cardLayoutPreview, setCardLayoutPreview] = useState('grid'); // 'grid' | 'list'

  const fileInputRef = useRef(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isAiFilling, setIsAiFilling] = useState(false);
  const [aiSearchPrompt, setAiSearchPrompt] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedPrimaryImageIndex, setSelectedPrimaryImageIndex] = useState(0);

  // Dynamic Category Specifications List
  const [specList, setSpecList] = useState(DEFAULT_CATEGORY_SPECS.mobiles);

  // Dynamic Color Variants List (with color cards)
  const [colorVariants, setColorVariants] = useState([]);

  // Dynamic Size / Storage Variants List
  const [sizeVariants, setSizeVariants] = useState([]);

  const [selectedPreviewColorIndex, setSelectedPreviewColorIndex] = useState(0);
  const [selectedPreviewSizeIndex, setSelectedPreviewSizeIndex] = useState(0);

  // Rich Product Form State
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'mobiles',
    subcategory: '',
    price: '',
    mrp: '',
    stockCount: 10,
    deliveryDays: 2,
    freeDelivery: true,
    sku: '',
    tag: '',
    highlightsText: ''
  });

  const calculatedDiscount = formData.mrp && formData.price && Number(formData.mrp) > Number(formData.price)
    ? Math.round(((Number(formData.mrp) - Number(formData.price)) / Number(formData.mrp)) * 100)
    : 0;

  // Image Upload Handlers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [event.target.result, ...prev]);
          setSelectedPrimaryImageIndex(0);
          showToast('Image uploaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!customImageUrl.trim()) return;
    setUploadedImages(prev => [customImageUrl.trim(), ...prev]);
    setSelectedPrimaryImageIndex(0);
    setCustomImageUrl('');
    showToast('Image added to gallery!', 'success');
  };

  const handleRemoveImage = (indexToRemove) => {
    if (uploadedImages.length <= 1) {
      showToast('You must keep at least 1 image for the product', 'info');
      return;
    }
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    if (selectedPrimaryImageIndex >= indexToRemove && selectedPrimaryImageIndex > 0) {
      setSelectedPrimaryImageIndex(prev => prev - 1);
    }
  };

  const handleAiAutoFill = async (overrideQuery) => {
    const query = (overrideQuery || aiSearchPrompt || formData.title || '').trim();
    if (!query) {
      showToast('Please enter a product name to search with AI', 'warning');
      return;
    }

    setIsAiFilling(true);
    showToast(`✨ AI is querying e-commerce catalog knowledge for "${query.slice(0, 25)}..."`, 'info');

    try {
      const aiData = await aiService.generateProductDetails(query);
      if (aiData) {
        const detectedCategory = aiData.category ? aiData.category.toLowerCase() : formData.category;

        setFormData(prev => ({
          ...prev,
          title: aiData.title || prev.title,
          brand: aiData.brand || prev.brand,
          category: detectedCategory,
          subcategory: aiData.subcategory || prev.subcategory,
          price: aiData.price || prev.price,
          mrp: aiData.mrp || prev.mrp,
          sku: aiData.sku || prev.sku,
          tag: aiData.tag || prev.tag,
          highlightsText: aiData.highlightsText || (Array.isArray(aiData.highlights) ? aiData.highlights.join('\n') : prev.highlightsText)
        }));

        // Dynamic category specifications extraction from AI response
        if (aiData.specifications && typeof aiData.specifications === 'object') {
          const parsedSpecs = Object.entries(aiData.specifications).map(([k, v]) => ({
            key: k,
            value: String(v)
          }));
          setSpecList(parsedSpecs);
        } else if (DEFAULT_CATEGORY_SPECS[detectedCategory]) {
          setSpecList(DEFAULT_CATEGORY_SPECS[detectedCategory]);
        }

        setAiSearchPrompt('');
        showToast(`🎉 AI Autocompleted specifications, MRP, highlights & warranty for "${aiData.title || query}"!`, 'success');
      }
    } catch (err) {
      console.warn('AI lookup error:', err);
      showToast('AI service response error. Keeping form values.', 'error');
    } finally {
      setIsAiFilling(false);
    }
  };

  const handleCategoryChange = (newCat) => {
    setFormData(prev => ({ ...prev, category: newCat }));
    if (DEFAULT_CATEGORY_SPECS[newCat]) {
      setSpecList(DEFAULT_CATEGORY_SPECS[newCat]);
    }
  };

  const handleUpdateSpec = (index, field, val) => {
    setSpecList(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleAddCustomSpec = (customKey = '', customVal = '') => {
    setSpecList(prev => [...prev, { key: customKey || 'Custom Specification', value: customVal || '' }]);
  };

  const handleRemoveSpec = (index) => {
    setSpecList(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddColorVariant = (preset = null) => {
    const newId = `var-col-${Date.now()}`;
    const newCol = preset ? {
      id: newId,
      name: preset.name,
      hex: preset.hex,
      image: preset.image || primaryImgUrl,
      sku: `${formData.sku || 'AVR'}-${preset.name.slice(0, 3).toUpperCase()}`,
      price: Number(formData.price) || 999,
      stock: 10
    } : {
      id: newId,
      name: 'Custom Color',
      hex: '#3B82F6',
      image: primaryImgUrl,
      sku: `${formData.sku || 'AVR'}-COL`,
      price: Number(formData.price) || 999,
      stock: 10
    };
    setColorVariants(prev => [...prev, newCol]);
    showToast(`Added color variant "${newCol.name}"`, 'success');
  };

  const handleUpdateColorVariant = (index, field, val) => {
    setColorVariants(prev => prev.map((c, i) => i === index ? { ...c, [field]: val } : c));
  };

  const handleRemoveColorVariant = (index) => {
    if (colorVariants.length <= 1) {
      showToast('At least 1 color variant is required', 'warning');
      return;
    }
    setColorVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSizeVariant = (name = 'New Size / Capacity') => {
    const newId = `var-size-${Date.now()}`;
    setSizeVariants(prev => [...prev, { id: newId, name, priceDelta: 0, stock: 10 }]);
    showToast(`Added variant option "${name}"`, 'success');
  };

  const handleUpdateSizeVariant = (index, field, val) => {
    setSizeVariants(prev => prev.map((s, i) => i === index ? { ...s, [field]: val } : s));
  };

  const handleRemoveSizeVariant = (index) => {
    setSizeVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleApplyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      brand: preset.brand,
      price: preset.price,
      mrp: preset.mrp
    }));
    setUploadedImages([preset.image]);
    setSelectedPrimaryImageIndex(0);
    showToast(`Loaded template for ${preset.title.slice(0, 30)}...`, 'info');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price) {
      showToast('Please provide a product title and valid selling price', 'error');
      return;
    }

    // Convert spec array back to key-value object
    const finalSpecs = {};
    specList.forEach(s => {
      if (s.key && s.key.trim()) {
        finalSpecs[s.key.trim()] = s.value || '';
      }
    });

    const newProduct = {
      id: `prod-vendor-${Date.now()}`,
      title: formData.title.trim(),
      brand: formData.brand.trim() || 'Avero Brand',
      category: formData.category,
      subcategory: formData.subcategory,
      price: Number(formData.price),
      mrp: Number(formData.mrp) || Number(formData.price) * 1.25,
      rating: 4.8,
      reviewsCount: 12,
      discount: calculatedDiscount,
      thumbnail: primaryImgUrl,
      images: uploadedImages,
      stockCount: Number(formData.stockCount) || 10,
      sku: formData.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      deliveryDays: Number(formData.deliveryDays) || 1,
      freeDelivery: formData.freeDelivery,
      tags: formData.tag ? [formData.tag] : ['New Arrival'],
      highlights: formData.highlightsText.split('\n').filter(h => h.trim().length > 0),
      description: formData.highlightsText,
      specs: finalSpecs,
      attributes: finalSpecs,
      colors: colorVariants,
      sizes: sizeVariants,
      variants: {
        colors: colorVariants,
        sizes: sizeVariants
      },
      seller: {
        name: 'You (Direct Verified Store)',
        rating: 4.9,
        verified: true
      }
    };

    submitProductForReview(newProduct);
    showToast(`🎉 Product "${formData.title.slice(0, 25)}..." submitted with ${colorVariants.length} color variants!`, 'success');
    setViewMode('list');
  };

  // Filter products that belong specifically to this seller
  const allSellerListings = [
    ...vendorSubmissions.filter(s => s.submittedBy === user?.email || s.sellerEmail === user?.email || s.seller === activeStoreName),
    ...products.filter(p => 
      (activeStoreName && (p.seller === activeStoreName || p.brand === activeStoreName || p.seller?.name === activeStoreName)) ||
      (user?.email && (p.sellerEmail === user?.email || p.submittedBy === user?.email)) ||
      (user?.merchantId && p.merchantId === user?.merchantId) ||
      p.isCustomCreated
    )
  ];

  const filteredProducts = allSellerListings.filter(p => {
    if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return p.title?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
    }
    return true;
  });

  const activeCategoryConfig = CATEGORIES.find(c => c.id === formData.category);
  const primaryImgUrl = uploadedImages[selectedPrimaryImageIndex] || uploadedImages[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80';

  return (
    <div className="seller-products-page" style={{ width: '100%', boxSizing: 'border-box' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: FULL-PAGE ADD / EDIT PRODUCT STUDIO
      ─────────────────────────────────────────────────────────────── */}
      {viewMode === 'create' ? (
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Top Sticky Header with Back & Publish Button */}
          <div
            className="seller-action-header"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="btn btn-secondary"
                style={{ height: '38px', padding: '0 14px', fontSize: '13px', fontWeight: '700', gap: '6px' }}
              >
                <ArrowLeft size={16} /> Back to Catalog
              </button>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Add New Product Listing
                </h1>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Upload photos, set pricing, and preview your live marketplace card in real-time
                </span>
              </div>
            </div>

            <div className="seller-action-buttons" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="btn btn-secondary"
                style={{ height: '40px', padding: '0 16px', fontSize: '13px' }}
              >
                Discard Draft
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                className="btn btn-primary"
                style={{ height: '40px', padding: '0 20px', fontSize: '13px', fontWeight: '800', gap: '6px' }}
              >
                <Check size={16} /> Submit & Publish Product
              </button>
            </div>
          </div>

          {/* Main 2-Column Split: Form (Left 65%) + Live Output Card (Right 35%) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '20px', alignItems: 'start' }} className="seller-add-grid">
            
            {/* ── LEFT COLUMN: Product Creation Form ── */}
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 1. Image Upload & Multi-Photo Gallery */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Camera size={18} color="#2563EB" /> Product Photos & Media Gallery
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>Upload high-resolution PNG, JPG or WebP images (Minimum 1 required)</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>
                    {uploadedImages.length} Image{uploadedImages.length > 1 ? 's' : ''} Ready
                  </span>
                </div>

                {/* Drag & Drop Upload Dropzone */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #93C5FD',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '16px'
                  }}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    if (e.dataTransfer.files) {
                      handleFileUpload({ target: { files: e.dataTransfer.files } });
                    }
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <Upload size={22} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                    Click to browse files or Drag & Drop product photos here
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Supports PNG, JPG, JPEG, WEBP up to 10MB per file
                  </div>
                </div>

                {/* Or Add Via URL Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input
                    type="url"
                    placeholder="Or paste external image URL (https://...)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    style={{ flex: 1, height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="btn btn-secondary"
                    style={{ height: '40px', padding: '0 16px', fontSize: '13px', fontWeight: '700' }}
                  >
                    + Add URL
                  </button>
                </div>

                {/* Uploaded Gallery Thumbnails with Primary Badge Selector */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>
                    Gallery Preview (Click photo to set as Primary Card Thumbnail):
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {uploadedImages.map((imgSrc, idx) => {
                      const isPrimary = selectedPrimaryImageIndex === idx;

                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedPrimaryImageIndex(idx)}
                          style={{
                            width: '84px',
                            height: '84px',
                            borderRadius: '10px',
                            border: isPrimary ? '3px solid #2563EB' : '1px solid #E2E8F0',
                            padding: '3px',
                            backgroundColor: '#FFFFFF',
                            position: 'relative',
                            cursor: 'pointer',
                            boxShadow: isPrimary ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none'
                          }}
                        >
                          <img
                            src={imgSrc}
                            alt={`Preview ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }}
                          />

                          {isPrimary && (
                            <span style={{
                              position: 'absolute',
                              bottom: '-6px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: '#2563EB',
                              color: '#FFFFFF',
                              fontSize: '9px',
                              fontWeight: '900',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              whiteSpace: 'nowrap'
                            }}>
                              PRIMARY
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: '#EF4444',
                              color: '#FFFFFF',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              padding: 0
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ✨ AI Product Intelligence Auto-Fill Card */}
              <div style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)',
                borderRadius: '16px',
                padding: '20px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px -6px rgba(15, 23, 42, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(99, 102, 241, 0.3)',
                      color: '#A5B4FC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                        AI Product Catalog Auto-Fill
                      </h3>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Enter any product name to automatically fetch Indian market pricing, specifications, warranty & bullet highlights
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: 'rgba(255,255,255,0.15)', color: '#818CF8', padding: '3px 8px', borderRadius: '10px' }}>
                    GROQ AI INFERENCE
                  </span>
                </div>

                {/* AI Search & Auto-Fill Input Form */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <input
                    type="text"
                    placeholder="e.g. Sony WH-1000XM5, Nothing Phone (2a), MacBook Air M3, Nike Pegasus 40..."
                    value={aiSearchPrompt}
                    onChange={(e) => setAiSearchPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAiAutoFill(aiSearchPrompt);
                      }
                    }}
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      padding: '0 14px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    disabled={isAiFilling}
                    onClick={() => handleAiAutoFill(aiSearchPrompt)}
                    style={{
                      padding: '0 20px',
                      borderRadius: '8px',
                      backgroundColor: isAiFilling ? '#4F46E5' : '#6366F1',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: isAiFilling ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isAiFilling ? (
                      <>
                        <RefreshCw size={15} className="spin-slow" /> Scanning AI Source...
                      </>
                    ) : (
                      <>
                        <Wand2 size={15} /> Auto-Fill with AI
                      </>
                    )}
                  </button>
                </div>

                {/* Quick 1-Click Example Chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Try 1-Click:</span>
                  {[
                    'Sony WH-1000XM5',
                    'Nothing Phone (2a)',
                    'MacBook Air M3',
                    'Nike Pegasus 40',
                    'Samsung Galaxy S24 Ultra',
                    'ASUS ROG Zephyrus G16'
                  ].map((presetName) => (
                    <button
                      key={presetName}
                      type="button"
                      onClick={() => {
                        setAiSearchPrompt(presetName);
                        handleAiAutoFill(presetName);
                      }}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#E2E8F0',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      {presetName}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Basic Information */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Package size={18} color="#2563EB" /> Product Information
                  </h3>

                  <button
                    type="button"
                    disabled={isAiFilling || !formData.title.trim()}
                    onClick={() => handleAiAutoFill(formData.title)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      color: '#4F46E5',
                      backgroundColor: '#EEF2FF',
                      border: '1px solid #C7D2FE',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Sparkles size={13} /> Re-scan Title with AI
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Product Full Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apple iPhone 15 Pro Max (Natural Titanium, 256 GB)"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                        Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apple, Samsung, Sony, Nike"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                        Product SKU Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AVR-SKU-9921"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                        Marketplace Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                        Subcategory Tag
                      </label>
                      <select
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                      >
                        {(activeCategoryConfig?.subcategories || ['Standard Item']).map((sub, sIdx) => (
                          <option key={sIdx} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Pricing, Inventory & Delivery SLAs */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={18} color="#2563EB" /> Pricing & Inventory
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 134900"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: '700' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Maximum Retail Price (MRP ₹)
                    </label>
                    <input
                      type="number"
                      min={1}
                      placeholder="e.g. 159900"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Available Stock Units *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stockCount}
                      onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                      style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} color="#2563EB" />
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0F172A' }}>Free Express Delivery</strong>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Offer free shipping to boost product buy-box rank</div>
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.freeDelivery}
                      onChange={(e) => setFormData({ ...formData, freeDelivery: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#2563EB' }}
                    />
                  </label>
                </div>
              </div>

              {/* 4. Category Highlights & Dynamic Specifications */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={18} color="#2563EB" /> Key Highlights & Specifications
                  </h3>

                  <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '3px 10px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {formData.category} Mode
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Bullet Highlights (1 per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.highlightsText}
                    onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontFamily: 'inherit', lineHeight: '1.4' }}
                  />
                </div>

                {/* Dynamic Category Specification Fields */}
                <div style={{ marginTop: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', display: 'block' }}>
                        Category Technical Specifications ({specList.length} Fields)
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Tailored attributes for {formData.category} products • Edit names, values, or add custom fields
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddCustomSpec()}
                      style={{
                        fontSize: '11.5px',
                        fontWeight: '800',
                        color: '#2563EB',
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus size={13} /> Add Custom Spec Field
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {specList.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(140px, 200px) 1fr 34px',
                          gap: '8px',
                          alignItems: 'center'
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Spec Name"
                          value={spec.key}
                          onChange={(e) => handleUpdateSpec(sIdx, 'key', e.target.value)}
                          style={{
                            height: '38px',
                            padding: '0 10px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '12px',
                            fontWeight: '700',
                            backgroundColor: '#F8FAFC',
                            color: '#334155'
                          }}
                        />

                        <input
                          type="text"
                          placeholder="Spec Value (e.g. 330W RMS, Dolby Atmos, UK 9...)"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(sIdx, 'value', e.target.value)}
                          style={{
                            height: '38px',
                            padding: '0 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '12.5px',
                            backgroundColor: '#FFFFFF',
                            color: '#0F172A'
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(sIdx)}
                          title="Delete Spec"
                          style={{
                            width: '34px',
                            height: '38px',
                            borderRadius: '6px',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: '700'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Product Color Cards & Multi-Variant Matrix */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Palette size={18} color="#2563EB" /> Product Colors & Multi-Variant Options
                    </h3>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      Add color cards with distinct product photos, specific SKUs, prices, and sizes/storage options
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddColorVariant()}
                    style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      color: '#2563EB',
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> + Add Color Variant
                  </button>
                </div>

                {/* Preset Color Chips */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                    Quick Preset Color Swatches:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {PRESET_COLORS.map(pCol => (
                      <button
                        key={pCol.name}
                        type="button"
                        onClick={() => handleAddColorVariant(pCol)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#F8FAFC',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: pCol.hex, border: '1px solid rgba(0,0,0,0.15)' }} />
                        <span>+ {pCol.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Variant Cards Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {colorVariants.map((col, cIdx) => (
                    <div
                      key={col.id || cIdx}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '14px',
                        display: 'grid',
                        gridTemplateColumns: 'auto minmax(140px, 1fr) minmax(180px, 1.4fr) 100px 80px auto',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}
                    >
                      {/* Color Swatch & Hex Picker */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="color"
                          value={col.hex}
                          onChange={(e) => handleUpdateColorVariant(cIdx, 'hex', e.target.value)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: '2px solid #CBD5E1',
                            cursor: 'pointer',
                            padding: 0,
                            backgroundColor: 'transparent'
                          }}
                          title="Choose Color Hex"
                        />
                      </div>

                      {/* Color Name */}
                      <div>
                        <label style={{ fontSize: '10.5px', fontWeight: '700', color: '#64748B', display: 'block' }}>Color Name</label>
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) => handleUpdateColorVariant(cIdx, 'name', e.target.value)}
                          placeholder="e.g. Natural Titanium"
                          style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: '700' }}
                        />
                      </div>

                      {/* Variant Image URL */}
                      <div>
                        <label style={{ fontSize: '10.5px', fontWeight: '700', color: '#64748B', display: 'block' }}>Color Image URL</label>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <img
                            src={col.image || primaryImgUrl}
                            alt={col.name}
                            style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'contain', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', flexShrink: 0 }}
                          />
                          <input
                            type="text"
                            value={col.image}
                            onChange={(e) => handleUpdateColorVariant(cIdx, 'image', e.target.value)}
                            placeholder="Image URL"
                            style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11px' }}
                          />
                        </div>
                      </div>

                      {/* Variant Price */}
                      <div>
                        <label style={{ fontSize: '10.5px', fontWeight: '700', color: '#64748B', display: 'block' }}>Price (₹)</label>
                        <input
                          type="number"
                          value={col.price}
                          onChange={(e) => handleUpdateColorVariant(cIdx, 'price', Number(e.target.value))}
                          style={{ width: '100%', height: '34px', padding: '0 6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: '700' }}
                        />
                      </div>

                      {/* Variant Stock */}
                      <div>
                        <label style={{ fontSize: '10.5px', fontWeight: '700', color: '#64748B', display: 'block' }}>Stock</label>
                        <input
                          type="number"
                          value={col.stock}
                          onChange={(e) => handleUpdateColorVariant(cIdx, 'stock', Number(e.target.value))}
                          style={{ width: '100%', height: '34px', padding: '0 6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                        />
                      </div>

                      {/* Delete Action */}
                      <div>
                        <label style={{ fontSize: '10.5px', display: 'block', color: 'transparent' }}>X</label>
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariant(cIdx)}
                          style={{
                            width: '32px',
                            height: '34px',
                            borderRadius: '6px',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: '700'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Size / Storage / Capacity Variants */}
                <div style={{ paddingTop: '16px', borderTop: '1px dashed #CBD5E1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                        Size / Storage / Capacity Options ({sizeVariants.length})
                      </h4>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        e.g. 256 GB, 512 GB, 1 TB or UK 7, UK 8, UK 9 or S, M, L, XL
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSizeVariant()}
                      style={{
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: '#4F46E5',
                        backgroundColor: '#EEF2FF',
                        border: '1px solid #C7D2FE',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Option
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {sizeVariants.map((sz, sIdx) => (
                      <div
                        key={sz.id || sIdx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <input
                          type="text"
                          value={sz.name}
                          onChange={(e) => handleUpdateSizeVariant(sIdx, 'name', e.target.value)}
                          style={{ width: '80px', height: '28px', padding: '0 6px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '11.5px', fontWeight: '800' }}
                        />
                        <span style={{ fontSize: '11px', color: '#64748B' }}>+₹</span>
                        <input
                          type="number"
                          value={sz.priceDelta}
                          onChange={(e) => handleUpdateSizeVariant(sIdx, 'priceDelta', Number(e.target.value))}
                          placeholder="Delta"
                          style={{ width: '60px', height: '28px', padding: '0 4px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '11.5px' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSizeVariant(sIdx)}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: '900', fontSize: '12px' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </form>

            {/* ── RIGHT COLUMN: LIVE OUTPUT CARD / REAL-TIME PRODUCT PREVIEW ── */}
            <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Preview Mode Selector */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                  <Eye size={16} color="#2563EB" /> Live Output Card Preview
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setCardLayoutPreview('grid')}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: cardLayoutPreview === 'grid' ? '#EFF6FF' : 'transparent',
                      color: cardLayoutPreview === 'grid' ? '#2563EB' : '#64748B',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Grid Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardLayoutPreview('list')}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: cardLayoutPreview === 'list' ? '#EFF6FF' : 'transparent',
                      color: cardLayoutPreview === 'list' ? '#2563EB' : '#64748B',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Search List
                  </button>
                </div>
              </div>

              {/* Real-time Customer Product Card Mockup with Interactive Color Cards */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #CBD5E1',
                  padding: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Simulated Bestseller Tag */}
                {formData.tag && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      zIndex: 2,
                      fontSize: '10px',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      backgroundColor: '#2563EB',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px'
                    }}
                  >
                    {formData.tag}
                  </span>
                )}

                {/* Product Image Container (Updates when color variant is clicked) */}
                <div
                  style={{
                    height: '210px',
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginBottom: '12px',
                    border: '1px solid #F1F5F9'
                  }}
                >
                  <img
                    src={colorVariants[selectedPreviewColorIndex]?.image || primaryImgUrl}
                    alt={formData.title}
                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', transition: 'all 0.2s ease' }}
                  />
                </div>

                {/* Color Variants Interactive Strip */}
                {colorVariants.length > 0 && (
                  <div style={{ marginBottom: '10px', backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>🎨 Color: <strong style={{ color: '#0F172A' }}>{colorVariants[selectedPreviewColorIndex]?.name}</strong></span>
                      <span style={{ fontSize: '10px' }}>{colorVariants.length} Colors</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {colorVariants.map((col, idx) => {
                        const isSelected = selectedPreviewColorIndex === idx;
                        return (
                          <button
                            key={col.id || idx}
                            type="button"
                            onClick={() => setSelectedPreviewColorIndex(idx)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 6px',
                              borderRadius: '6px',
                              border: isSelected ? '2px solid #2563EB' : '1px solid #CBD5E1',
                              backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                              cursor: 'pointer',
                              fontSize: '10.5px',
                              fontWeight: isSelected ? '800' : '600',
                              color: isSelected ? '#1D4ED8' : '#334155'
                            }}
                          >
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: col.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                            <span>{col.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size / Storage Interactive Strip */}
                {sizeVariants.length > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>
                      📏 Option: <strong style={{ color: '#0F172A' }}>{sizeVariants[selectedPreviewSizeIndex]?.name}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {sizeVariants.map((sz, idx) => {
                        const isSelected = selectedPreviewSizeIndex === idx;
                        return (
                          <button
                            key={sz.id || idx}
                            type="button"
                            onClick={() => setSelectedPreviewSizeIndex(idx)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: isSelected ? '2px solid #2563EB' : '1px solid #CBD5E1',
                              backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                              color: isSelected ? '#1D4ED8' : '#475569',
                              fontSize: '11px',
                              fontWeight: isSelected ? '800' : '600',
                              cursor: 'pointer'
                            }}
                          >
                            {sz.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {formData.brand || 'BRAND'}
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', lineHeight: '1.3', minHeight: '38px' }}>
                    {formData.title || 'Product Title Appears Here'}
                  </div>

                  {/* Rating + Assured Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{
                      backgroundColor: '#15803D',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      4.8 <Star size={10} fill="#FFFFFF" />
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>(1,248)</span>

                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      color: '#1D4ED8',
                      backgroundColor: '#EFF6FF',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <ShieldCheck size={11} /> Assured
                    </span>
                  </div>

                  {/* Price Row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A' }}>
                      ₹{(Number(colorVariants[selectedPreviewColorIndex]?.price || formData.price || 0) + Number(sizeVariants[selectedPreviewSizeIndex]?.priceDelta || 0)).toLocaleString('en-IN')}
                    </span>
                    {formData.mrp && Number(formData.mrp) > Number(formData.price) && (
                      <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through' }}>
                        ₹{Number(formData.mrp).toLocaleString('en-IN')}
                      </span>
                    )}
                    {calculatedDiscount > 0 && (
                      <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#16A34A' }}>
                        {calculatedDiscount}% off
                      </span>
                    )}
                  </div>

                  {/* Delivery & Stock Scarcity */}
                  <div style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Truck size={13} /> {formData.freeDelivery ? 'Free Delivery' : 'Standard Delivery'} • Tomorrow by 5 PM
                  </div>

                  {formData.stockCount > 0 && formData.stockCount <= 5 && (
                    <div style={{ fontSize: '11px', color: '#EA580C', fontWeight: '800' }}>
                      🔥 Only {formData.stockCount} left in stock - order soon
                    </div>
                  )}

                  {/* Action Buttons Mockup */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      disabled
                      style={{
                        flex: 1,
                        height: '38px',
                        backgroundColor: '#FF9F00',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                    <button
                      type="button"
                      disabled
                      style={{
                        flex: 1,
                        height: '38px',
                        backgroundColor: '#FB641B',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Zap size={14} /> Buy Now
                    </button>
                  </div>

                  {/* Live Category Specifications Sheet Preview */}
                  {specList.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #E2E8F0' }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>PDP Technical Specs</span>
                        <span style={{ fontSize: '9.5px', color: '#6366F1' }}>{formData.category}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '140px', overflowY: 'auto' }}>
                        {specList.slice(0, 5).map((s, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', padding: '2px 0' }}>
                            <span style={{ color: '#64748B', fontWeight: '600', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.key}:</span>
                            <span style={{ color: '#0F172A', fontWeight: '700', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{s.value || '—'}</span>
                          </div>
                        ))}
                        {specList.length > 5 && (
                          <span style={{ fontSize: '9.5px', color: '#2563EB', fontWeight: '700', textAlign: 'center', marginTop: '2px' }}>
                            +{specList.length - 5} more attributes configured
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Bottom Verification Note */}
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '11.5px', color: '#64748B', lineHeight: '1.4' }}>
                💡 <strong>Seller Note:</strong> Category-specific attributes and specs automatically sync to customer filter facets and product details page.
              </div>

            </div>

          </div>
        </div>
      ) : (

        /* ─────────────────────────────────────────────────────────────
            VIEW 2: SELLER PRODUCT INVENTORY LIST
        ─────────────────────────────────────────────────────────────── */
        <div>
          {/* Header */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px 24px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={22} color="#2563EB" /> Product Catalog & Listings
              </h1>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', margin: '4px 0 0' }}>
                Manage live SKUs, inventory counts, selling prices, and submit new items
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('create')}
              className="btn btn-primary"
              style={{ padding: '0 20px', height: '42px', fontSize: '13px', fontWeight: '800', gap: '6px' }}
            >
              <Plus size={16} /> + Add Single Product
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by title, brand, SKU..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ width: '100%', height: '38px', paddingLeft: '36px', paddingRight: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
              >
                <option value="ALL">All Categories ({allSellerListings.length})</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <div className="no-scrollbar" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px' }}>Product</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Price & MRP</th>
                    <th style={{ padding: '12px 16px' }}>Stock</th>
                    <th style={{ padding: '12px 16px' }}>QC Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center' }}>
                        <Package size={40} color="#94A3B8" style={{ margin: '0 auto 12px', display: 'block' }} />
                        <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px' }}>No Products Listed Yet</h3>
                        <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '420px', margin: '0 auto 16px' }}>
                          You have not listed any products in your seller catalog yet. Add your first item or use bulk upload to begin selling on Avero.
                        </p>
                        <button
                          type="button"
                          onClick={() => setViewMode('create')}
                          className="btn btn-primary"
                          style={{ padding: '0 18px', height: '38px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Plus size={15} /> + Add Your First Product
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod, idx) => {
                      const isPending = prod.status === 'PENDING_APPROVAL';

                      return (
                      <tr key={prod.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '2px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <img src={prod.thumbnail} alt={prod.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <div>
                              <Link
                                to={`/product/${prod.id}`}
                                style={{
                                  fontWeight: '800',
                                  color: '#0F172A',
                                  maxWidth: '320px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#0F172A'}
                              >
                                <span>{prod.title}</span>
                                <ExternalLink size={12} color="#94A3B8" />
                              </Link>
                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                                Brand: <strong>{prod.brand}</strong> • SKU: {prod.sku || `AVR-${idx + 100}`}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', color: '#475569', textTransform: 'capitalize' }}>
                          {prod.category}
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <strong style={{ color: '#0F172A' }}>₹{prod.price?.toLocaleString('en-IN')}</strong>
                          {prod.mrp && (
                            <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '6px', textDecoration: 'line-through' }}>
                              ₹{prod.mrp?.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '800',
                            backgroundColor: (prod.stockCount || 15) > 5 ? '#DCFCE7' : '#FEF3C7',
                            color: (prod.stockCount || 15) > 5 ? '#166534' : '#92400E'
                          }}>
                            {prod.stockCount || 15} Units
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          {isPending ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '12px' }}>
                              <Clock size={12} /> Under Review
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '12px' }}>
                              <CheckCircle2 size={12} /> Live in Catalog
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                title: prod.title || '',
                                brand: prod.brand || '',
                                category: prod.category || 'mobiles',
                                subcategory: prod.subcategory || 'Standard Item',
                                price: prod.price || 999,
                                mrp: prod.mrp || (prod.price ? prod.price * 1.25 : 1299),
                                stockCount: prod.stockCount || 20,
                                deliveryDays: prod.deliveryDays || 1,
                                freeDelivery: prod.freeDelivery !== false,
                                sku: prod.sku || `AVR-${idx + 100}`,
                                tag: prod.tags?.[0] || 'Bestseller',
                                highlightsText: Array.isArray(prod.highlights) ? prod.highlights.join('\n') : (prod.description || '')
                              });
                              if (prod.images && prod.images.length > 0) {
                                setUploadedImages(prod.images);
                              } else if (prod.thumbnail) {
                                setUploadedImages([prod.thumbnail]);
                              }
                              if (prod.specs && typeof prod.specs === 'object') {
                                setSpecList(Object.entries(prod.specs).map(([k, v]) => ({ key: k, value: String(v) })));
                              } else if (DEFAULT_CATEGORY_SPECS[prod.category]) {
                                setSpecList(DEFAULT_CATEGORY_SPECS[prod.category]);
                              }
                              setViewMode('create');
                              showToast(`Editing "${prod.title.slice(0, 24)}..."`, 'info');
                            }}
                            style={{ padding: '4px 10px', fontSize: '12px', fontWeight: '700', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .seller-add-grid {
            grid-template-columns: 1fr !important;
          }
          .seller-sticky-preview {
            position: static !important;
            width: 100% !important;
            margin-top: 16px;
          }
          .seller-action-header {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .seller-action-buttons {
            width: 100% !important;
            justifyContent: space-between !important;
          }
          .seller-action-buttons button {
            flex: 1 !important;
          }
        }
        @media (max-width: 640px) {
          .seller-products-page {
            padding: 0 !important;
          }
          .seller-spec-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
      `}</style>
    </div>
  );
}
