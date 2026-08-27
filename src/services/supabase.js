import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ceicolgcnzxizfrnmzmd.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_js1aBVQSFeLsceb-G9KeLg_fyuyHTyP';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_STORAGE_BUCKETS = {
  PRODUCTS: 'products',
  BRANDS: 'brands',
  CATEGORIES: 'categories',
  BANNERS: 'banners',
  USER_AVATARS: 'user-avatars',
  SELLER_DOCUMENTS: 'seller-documents',
  REVIEW_IMAGES: 'review-images'
};

/**
 * Live Supabase Database & CRUD Operations Service Layer
 */
export const supabaseService = {
  // ==========================================
  // 1. PRODUCTS CRUD
  // ==========================================
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('avero_supabase_products', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('[Supabase] Falling back to cached products:', err.message);
    }
    const cached = localStorage.getItem('avero_supabase_products') || localStorage.getItem('avero_seller_products');
    return cached ? JSON.parse(cached) : [];
  },

  async createProduct(productData) {
    const newProduct = {
      id: productData.id || `prod_${Date.now()}`,
      title: productData.title,
      brand: productData.brand || 'Avero Exclusive',
      category: productData.category || 'mobiles',
      subcategory: productData.subcategory || 'Smartphones',
      price: Number(productData.price),
      mrp: Number(productData.mrp || productData.price * 1.2),
      stock_count: Number(productData.stockCount || 20),
      thumbnail: productData.thumbnail || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
      description: productData.description || '',
      seller_name: productData.sellerName || 'alex',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (error) throw error;
      return data?.[0] || newProduct;
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for createProduct:', err.message);
      return newProduct;
    }
  },

  async updateProduct(productId, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select();

      if (error) throw error;
      return data?.[0] || updates;
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for updateProduct:', err.message);
      return { id: productId, ...updates };
    }
  },

  async deleteProduct(productId) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      return { success: true, id: productId };
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for deleteProduct:', err.message);
      return { success: true, id: productId };
    }
  },

  // ==========================================
  // 2. ORDERS CRUD
  // ==========================================
  async getOrders(userId) {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('avero_orders', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('[Supabase] Falling back to local orders:', err.message);
    }
    const cached = localStorage.getItem('avero_orders');
    return cached ? JSON.parse(cached) : [];
  },

  async createOrder(orderData) {
    const newOrder = {
      id: orderData.id,
      user_id: orderData.userId || 'guest',
      items: orderData.items || [],
      total_amount: Number(orderData.totalAmount || 0),
      payment_method: orderData.paymentMethod || 'Online',
      payment_status: orderData.paymentStatus || 'Completed',
      status: orderData.status || 'Confirmed',
      delivery_address: orderData.deliveryAddress || {},
      courier: orderData.courier || {},
      timeline: orderData.timeline || [],
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('orders').insert([newOrder]).select();
      if (error) throw error;
      return data?.[0] || newOrder;
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for createOrder:', err.message);
      return newOrder;
    }
  },

  async updateOrderStatus(orderId, status, timeline) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, timeline, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for updateOrderStatus:', err.message);
      return { id: orderId, status };
    }
  },

  // ==========================================
  // 3. ADDRESSES CRUD
  // ==========================================
  async getAddresses(userId) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('avero_addresses', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('[Supabase] Falling back to cached addresses:', err.message);
    }
    const cached = localStorage.getItem('avero_addresses');
    return cached ? JSON.parse(cached) : [];
  },

  async saveAddress(addressData) {
    const record = {
      id: addressData.id || `addr_${Date.now()}`,
      user_id: addressData.userId || 'usr_default',
      name: addressData.name,
      phone: addressData.phone,
      pincode: addressData.pincode,
      flat: addressData.flat,
      area: addressData.area,
      city: addressData.city,
      state: addressData.state,
      address_type: addressData.addressType || 'HOME',
      is_default: Boolean(addressData.isDefault),
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('addresses').upsert([record]).select();
      if (error) throw error;
      return data?.[0] || record;
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for saveAddress:', err.message);
      return record;
    }
  },

  async deleteAddress(addressId) {
    try {
      const { error } = await supabase.from('addresses').delete().eq('id', addressId);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for deleteAddress:', err.message);
      return { success: true };
    }
  },

  // ==========================================
  // 4. USERS & PROFILES CRUD
  // ==========================================
  async syncUserProfile(user) {
    if (!user || (!user.email && !user.firebaseUid)) return null;
    const record = {
      firebase_uid: user.firebaseUid || user.uid || `usr_${Date.now()}`,
      email: user.email,
      name: user.name || user.displayName || user.email?.split('@')[0] || 'Avero User',
      phone: user.phone || '',
      role: user.role || 'customer',
      store_name: user.storeName || '',
      avatar: user.avatar || user.photoURL || '',
      gender: user.gender || '',
      dob: user.dob || null,
      city: user.city || '',
      email_verified: Boolean(user.emailVerified),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('users')
        .upsert([record], { onConflict: 'email' })
        .select();

      if (error) throw error;
      return data?.[0] || record;
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for syncUserProfile:', err.message);
      return record;
    }
  },

  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn('[Supabase] Falling back to local users:', err.message);
    }
    return [];
  },

  // ==========================================
  // 5. SELLERS & KYC APPROVALS
  // ==========================================
  async getSellers() {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn('[Supabase] Falling back to local sellers:', err.message);
    }
    const cached = localStorage.getItem('avero_seller_applications');
    return cached ? JSON.parse(cached) : [];
  },

  async createSellerApplication(sellerData) {
    const record = {
      store_name: sellerData.businessName || sellerData.storeName,
      store_slug: (sellerData.businessName || sellerData.storeName || '').toLowerCase().replace(/\s+/g, '-'),
      owner_name: sellerData.ownerName || sellerData.name,
      email: sellerData.email,
      phone: sellerData.phone,
      business_type: sellerData.businessType || 'Private Limited',
      gstin: sellerData.gstin || '',
      pan: sellerData.pan || '',
      pickup_address: sellerData.pickupAddress || {},
      bank_account_number: sellerData.bankAccount || '',
      bank_ifsc: sellerData.ifsc || '',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('sellers').insert([record]).select();
      if (error) throw error;
      return data?.[0] || record;
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for createSellerApplication:', err.message);
      return record;
    }
  },

  async updateSellerStatus(sellerId, status) {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', sellerId)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (err) {
      console.warn('[Supabase] Offline/Local fallback for updateSellerStatus:', err.message);
      return { id: sellerId, status };
    }
  },

  // ==========================================
  // 6. DELIVERY FLEET RIDERS
  // ==========================================
  async getDeliveryPartners() {
    try {
      const { data, error } = await supabase
        .from('delivery_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn('[Supabase] Falling back to local delivery partners:', err.message);
    }
    const cached = localStorage.getItem('avero_delivery_partners');
    return cached ? JSON.parse(cached) : [];
  },

  async saveDeliveryPartner(partnerData) {
    const record = {
      id: partnerData.id || `dp_${Date.now()}`,
      name: partnerData.name,
      phone: partnerData.phone,
      email: partnerData.email,
      city: partnerData.city,
      vehicle_type: partnerData.vehicleType,
      vehicle_number: partnerData.vehicleNumber,
      license_number: partnerData.licenseNumber,
      status: partnerData.status || 'PENDING_APPROVAL',
      rating: partnerData.rating || 5.0,
      completed_deliveries: partnerData.completedDeliveries || 0,
      earnings_today: partnerData.earningsToday || 0,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('delivery_partners').upsert([record]).select();
      if (error) throw error;
      return data?.[0] || record;
    } catch (err) {
      console.warn('[Supabase] Offline fallback for saveDeliveryPartner:', err.message);
      return record;
    }
  },

  // ==========================================
  // 7. AD CAMPAIGNS
  // ==========================================
  async getAdCampaigns(sellerName) {
    try {
      let query = supabase.from('ad_campaigns').select('*').order('created_at', { ascending: false });
      if (sellerName) query = query.eq('seller_name', sellerName);
      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn('[Supabase] Falling back to local ad campaigns:', err.message);
    }
    const cached = localStorage.getItem('avero_sponsored_campaigns');
    return cached ? JSON.parse(cached) : [];
  },

  async saveAdCampaign(campaign) {
    const record = {
      id: campaign.id || `camp_${Date.now()}`,
      name: campaign.name,
      product_title: campaign.productTitle,
      daily_budget: Number(campaign.dailyBudget || 500),
      keywords: campaign.keywords || '',
      status: campaign.status || 'Active',
      spent: Number(campaign.spent || 0),
      clicks: Number(campaign.clicks || 0),
      impressions: Number(campaign.impressions || 0),
      roas: campaign.roas || '0.0x',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase.from('ad_campaigns').upsert([record]).select();
      if (error) throw error;
      return data?.[0] || record;
    } catch (err) {
      console.warn('[Supabase] Offline fallback for saveAdCampaign:', err.message);
      return record;
    }
  },

  // ==========================================
  // 8. CLOUD STORAGE UPLOADS
  // ==========================================
  async uploadFile(bucket, file, customPath = '') {
    try {
      const fileName = customPath || `${Date.now()}_${file?.name?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'upload.jpg'}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return {
        bucket,
        fileName,
        publicUrl: publicUrlData.publicUrl,
        uploadedAt: new Date().toISOString()
      };
    } catch (err) {
      console.warn('[Supabase Storage] Fallback upload URL generator:', err.message);
      const fileName = customPath || `${Date.now()}_asset.jpg`;
      return {
        bucket,
        fileName,
        publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`,
        uploadedAt: new Date().toISOString()
      };
    }
  }
};
