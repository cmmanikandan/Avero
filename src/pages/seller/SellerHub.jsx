import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { supabaseService } from '../../services/supabase';
import {
  Store,
  IndianRupee,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Wand2,
  RefreshCw,
  UploadCloud,
  X,
  ShoppingBag
} from 'lucide-react';

export default function SellerHub() {
  const { user, products = [], orders = [], showToast } = useApp();
  const activeStoreName = user?.storeName || (user?.name ? `${user.name}'s Store` : 'My Merchant Store');
  const storeSlug = activeStoreName.toLowerCase().replace(/\s+/g, '-');

  const [sellerProducts, setSellerProducts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('avero_seller_products') || '[]');
      if (saved && saved.length > 0) return saved;
    } catch (_) {}
    return products.filter(p => 
      (activeStoreName && (p.seller === activeStoreName || p.brand === activeStoreName || p.seller?.name === activeStoreName)) ||
      (user?.email && (p.sellerEmail === user?.email || p.submittedBy === user?.email)) ||
      (user?.merchantId && p.merchantId === user?.merchantId) ||
      p.isCustomCreated
    );
  });

  const sellerOrders = orders.filter(o =>
    o.items?.some(it => 
      (activeStoreName && (it.seller === activeStoreName || it.brand === activeStoreName || it.seller?.name === activeStoreName)) ||
      (user?.email && (it.sellerEmail === user?.email || it.submittedBy === user?.email)) ||
      (user?.merchantId && it.merchantId === user?.merchantId)
    )
  );

  const [ordersList, setOrdersList] = useState(sellerOrders);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    title: '',
    brand: activeStoreName,
    category: 'mobiles',
    price: '',
    mrp: '',
    stockCount: 20,
    thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80'
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    showToast('Uploading product image to Cloudinary CDN...', 'info');

    try {
      const res = await uploadToCloudinary(file);
      if (res?.secureUrl) {
        setNewProduct(prev => ({ ...prev, thumbnail: res.secureUrl }));
        showToast('Image uploaded successfully to Cloudinary!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload image', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAiAutoFill = async (productTitle) => {
    const query = (productTitle || newProduct.title || '').trim();
    if (!query) {
      showToast('Please enter a product title to search with AI', 'info');
      return;
    }

    setIsAiSearching(true);
    showToast(`✨ AI is scanning catalog specs for "${query.slice(0, 20)}..."`, 'info');

    try {
      const aiData = await aiService.generateProductDetails(query);
      if (aiData) {
        setNewProduct(prev => ({
          ...prev,
          title: aiData.title || prev.title,
          brand: aiData.brand || activeStoreName,
          category: aiData.category ? aiData.category.toLowerCase() : prev.category,
          price: aiData.price || prev.price,
          mrp: aiData.mrp || prev.mrp
        }));
        showToast(`✨ AI auto-filled price, category & title for "${aiData.title || query}"!`, 'success');
      }
    } catch (err) {
      showToast('AI auto-fill failed, keeping manual inputs', 'error');
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleDispatchOrder = (orderId) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Dispatched via BlueDart' } : o));
    showToast(`Order #${orderId} marked as Dispatched`, 'success');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title.trim() || !newProduct.price) {
      showToast('Please provide a title and price', 'error');
      return;
    }

    const created = {
      id: `prod-custom-${Date.now()}`,
      title: newProduct.title,
      brand: newProduct.brand || activeStoreName,
      category: newProduct.category,
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp) || Number(newProduct.price) * 1.2,
      discount: 15,
      rating: 4.9,
      reviewsCount: 1,
      inStock: true,
      stockCount: Number(newProduct.stockCount),
      assured: true,
      thumbnail: newProduct.thumbnail
    };

    const updated = [created, ...sellerProducts];
    setSellerProducts(updated);
    try {
      localStorage.setItem('avero_seller_products', JSON.stringify(updated));
    } catch (_) {}

    // Sync product to Supabase Database
    supabaseService.createProduct(created).catch(console.warn);

    setIsAddModalOpen(false);
    showToast(`"${created.title.slice(0, 20)}..." added to your catalog and synced to Supabase!`, 'success');
    setNewProduct({
      title: '',
      brand: activeStoreName,
      category: 'mobiles',
      price: '',
      mrp: '',
      stockCount: 20,
      thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80'
    });
  };

  return (
    <div className="container" style={{ paddingBottom: '60px', paddingTop: '20px' }}>
      {/* Seller Header Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {activeStoreName}
              </h1>
              <span style={{ fontSize: '11px', color: '#0369A1', backgroundColor: '#E0F2FE', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={12} /> KYC Verified
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Seller ID: {user?.merchantId || 'SLR-LIVE'} • GSTIN: {user?.gstin || '29ABCDE1234F1Z5'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to={`/brand/${storeSlug}`}
            className="btn btn-secondary"
            style={{ gap: '6px', fontSize: '13px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0F172A' }}
          >
            <ExternalLink size={15} /> View Live Brand Store
          </Link>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
            style={{ gap: '6px' }}
          >
            <Plus size={16} /> List New Product
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL REVENUE</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-price)', marginTop: '4px' }}>
            ₹{sellerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--savings-green)', fontWeight: '600' }}>Live sales volume</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>STORE ORDERS</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-price)', marginTop: '4px' }}>
            {sellerOrders.length}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {sellerOrders.filter(o => o.status === 'Confirmed' || o.status === 'Packed').length} pending dispatch
          </span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>SELLER RATING</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--savings-green)', marginTop: '4px' }}>
            5.0 ★
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Avero Assured Merchant</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>INVENTORY ALERT</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-red)', marginTop: '4px' }}>
            {sellerProducts.filter(p => (p.stockCount || 10) < 5).length} Items
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent-red)', fontWeight: '600' }}>Low stock threshold</span>
        </div>
      </div>

      {/* Catalog Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-divider)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Active Store Catalog ({sellerProducts.length})</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Live on Avero Marketplace</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {sellerProducts.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B' }}>
              <Package size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: '800', fontSize: '15px', color: '#0F172A' }}>No Products Listed Yet</div>
              <div style={{ fontSize: '12px', marginTop: '2px', marginBottom: '14px' }}>Click "List New Product" to publish your first SKU to Avero.</div>
              <button type="button" onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 16px' }}>
                <Plus size={14} /> Add First Product
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px' }}>Product</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Price</th>
                  <th style={{ padding: '12px 16px' }}>Stock</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sellerProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={p.thumbnail} alt={p.title} style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#F8FAFC' }} />
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{p.category}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700' }}>₹{p.price.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: (p.stockCount || 10) < 5 ? '#DC2626' : '#059669', fontWeight: '600' }}>
                        {p.stockCount || 10} Units
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', color: '#047857', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 'var(--radius-xs)', fontWeight: '700' }}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-divider)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Recent Orders to Fulfill ({ordersList.length})</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ordersList.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B' }}>
              <ShoppingBag size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: '800', fontSize: '15px', color: '#0F172A' }}>No Store Orders Yet</div>
              <div style={{ fontSize: '12px', marginTop: '2px' }}>New customer orders placed for your products will appear here in real time.</div>
            </div>
          ) : (
            ordersList.map((ord) => (
              <div
                key={ord.id}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>
                    Order #{ord.id} • {ord.items?.[0]?.title || 'Store Product'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Buyer: {ord.deliveryAddress?.name || ord.buyerName || 'Customer'} • ₹{(ord.totalAmount || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  {ord.status === 'Confirmed' || ord.status === 'Packed' ? (
                    <button
                      type="button"
                      onClick={() => handleDispatchOrder(ord.id)}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px', minHeight: '32px' }}
                    >
                      Dispatch Shipment
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--savings-green)', backgroundColor: '#E8F5E9', padding: '4px 8px', borderRadius: 'var(--radius-xs)' }}>
                      {ord.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Product Modal with AI Auto-Fill */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="bottom-sheet"
            style={{
              maxWidth: '520px',
              margin: 'auto',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} color="#2563EB" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>List New Product to Marketplace</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddProduct} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* ✨ AI Auto-Fill Card */}
              <div style={{
                backgroundColor: '#EEF2FF',
                border: '1px solid #C7D2FE',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#4F46E5" />
                  <div>
                    <strong style={{ fontSize: '12.5px', color: '#312E81', display: 'block' }}>AI Smart Catalog Fill</strong>
                    <span style={{ fontSize: '11px', color: '#4338CA' }}>Type product name below and tap Auto-Fill</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAiSearching || !newProduct.title.trim()}
                  onClick={() => handleAiAutoFill(newProduct.title)}
                  style={{
                    backgroundColor: '#4F46E5',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: isAiSearching || !newProduct.title.trim() ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isAiSearching ? <RefreshCw size={13} className="spin-slow" /> : <Wand2 size={13} />}
                  Auto-Fill
                </button>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px', color: '#334155' }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sony WH-1000XM5 or Nothing Phone (2a)..."
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px', color: '#334155' }}>Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF', outline: 'none' }}
                  >
                    <option value="mobiles">Mobiles</option>
                    <option value="electronics">Laptops & Electronics</option>
                    <option value="audio">Audio & Sound</option>
                    <option value="footwear">Footwear & Shoes</option>
                    <option value="fashion">Fashion</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px', color: '#334155' }}>Initial Stock</label>
                  <input
                    type="number"
                    value={newProduct.stockCount}
                    onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                    style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px', color: '#334155' }}>Selling Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 29990"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px', color: '#334155' }}>MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 34990"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                    style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Cloudinary Image Upload & Preview */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px', color: '#334155' }}>
                  Product Image (Direct Cloudinary Upload)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '10px',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {newProduct.thumbnail ? (
                      <img src={newProduct.thumbnail} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={20} color="#94A3B8" />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <label
                      htmlFor="seller-img-upload"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#F8FAFC',
                        border: '1px dashed #94A3B8',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#2563EB',
                        cursor: isUploadingImage ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <UploadCloud size={16} />
                      {isUploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image from Computer'}
                    </label>
                    <input
                      id="seller-img-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
                      Auto-hosted on Cloudinary CDN
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '8px', height: '44px', fontWeight: '800', fontSize: '13.5px', borderRadius: '10px' }}
              >
                Submit & List on Marketplace
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
