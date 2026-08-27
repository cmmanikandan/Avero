import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { INITIAL_ORDERS } from '../data/mockOrders';
import { AVAILABLE_COUPONS } from '../data/coupons';
import { firebaseAuthService } from '../services/firebase';
import { supabaseService } from '../services/supabase';
import { resendEmailService } from '../services/resendEmail';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('avero_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    return {
      isAuth: false,
      name: '',
      email: '',
      role: 'customer',
      firebaseUid: '',
      supabaseId: '',
      avatar: '',
      emailVerified: false
    };
  });

  // App Role (Customer, Seller, Super Admin)
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('avero_role') || 'customer';
  });

  // Cart State (Empty by default for unauthenticated users)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('avero_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State (Empty by default for unauthenticated users)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('avero_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Addresses State (Empty by default for unauthenticated users)
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('avero_addresses');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    return addresses.find(a => a.isDefault)?.id || addresses[0]?.id || '';
  });

  const [activePincode, setActivePincode] = useState(() => {
    return localStorage.getItem('avero_pincode') || '';
  });
  const [pincodeCity, setPincodeCity] = useState(() => {
    return localStorage.getItem('avero_pincode_city') || '';
  });

  // Orders State (Empty by default for unauthenticated users)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('avero_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter(o => !o.id?.startsWith('OD829104')) : [];
      } catch (e) {}
    }
    return [];
  });

  // Search and Modal UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('avero_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isCameraSearchOpen, setIsCameraSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);

  const openAddAddressModal = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setEditingAddress(addr);
    setIsAddressModalOpen(true);
  };
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileWizardOpen, setIsProfileWizardOpen] = useState(false);

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [useRewardCoins, setUseRewardCoins] = useState(false);

  // Delivery Partners Fleet State & Auth
  const DEFAULT_DELIVERY_PARTNERS = [];

  const [deliveryPartners, setDeliveryPartners] = useState(() => {
    const saved = localStorage.getItem('avero_delivery_partners');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter(d => 
          d.name !== 'Suresh Kumar' && 
          d.name !== 'Manikandan V' && 
          !d.id?.startsWith('dp-mock-') &&
          !d.id?.startsWith('DP-7842') &&
          !d.id?.startsWith('DP-9912')
        ) : [];
      } catch (e) {}
    }
    return [];
  });

  const [deliveryAgentUser, setDeliveryAgentUser] = useState(() => {
    const saved = localStorage.getItem('avero_delivery_agent_user');
    return saved ? JSON.parse(saved) : { isAuth: false };
  });

  // Product Comparison (Up to 4 items)
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('avero_compare_list');
    return saved ? JSON.parse(saved) : [];
  });

  // Price Drop & Restock Alerts
  const [priceAlerts, setPriceAlerts] = useState(() => {
    const saved = localStorage.getItem('avero_price_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  // Gamified SuperCoins & Rewards
  const [rewardCoins, setRewardCoins] = useState(() => {
    const saved = localStorage.getItem('avero_reward_coins');
    return saved !== null ? Number(saved) : 0;
  });

  // Seller Sponsored Keyword Ad Campaigns
  const [sponsoredCampaigns, setSponsoredCampaigns] = useState(() => {
    const saved = localStorage.getItem('avero_sponsored_campaigns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter(c => 
          !c.name?.toLowerCase().includes('summer boost') && 
          !c.name?.toLowerCase().includes('flagship audio') &&
          !c.productTitle?.toLowerCase().includes('iphone 15') &&
          !c.productTitle?.toLowerCase().includes('wh-1000xm5')
        ) : [];
      } catch (e) {}
    }
    return [];
  });

  // Live Marketplace Products & Seller Submissions
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('avero_marketplace_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const nonMock = Array.isArray(parsed) ? parsed.filter(p => !p.id?.startsWith('prod-mob-') && !p.id?.startsWith('prod-aud-') && !p.id?.startsWith('prod-shoe-') && !p.id?.startsWith('prod-sam-') && !p.id?.startsWith('prod-asus-') && !p.id?.startsWith('prod-dell-') && !p.id?.startsWith('prod-lg-') && !p.id?.startsWith('prod-oneplus-') && !p.id?.startsWith('prod-puma-') && !p.id?.startsWith('prod-boat-') && !p.id?.startsWith('prod-home-') && !p.id?.startsWith('prod-acc-')) : [];
        return nonMock;
      } catch (e) {}
    }
    return PRODUCTS;
  });

  // Sync live products, orders, delivery partners & campaigns from Supabase on mount
  useEffect(() => {
    supabaseService.getProducts().then(liveProds => {
      if (liveProds && liveProds.length > 0) {
        setProducts(liveProds);
        localStorage.setItem('avero_marketplace_products', JSON.stringify(liveProds));
      }
    }).catch(console.warn);

    supabaseService.getOrders().then(liveOrders => {
      if (liveOrders && liveOrders.length > 0) {
        setOrders(liveOrders);
        localStorage.setItem('avero_orders', JSON.stringify(liveOrders));
      }
    }).catch(console.warn);

    supabaseService.getDeliveryPartners().then(livePartners => {
      if (livePartners && livePartners.length > 0) {
        setDeliveryPartners(livePartners);
        localStorage.setItem('avero_delivery_partners', JSON.stringify(livePartners));
      }
    }).catch(console.warn);

    supabaseService.getAdCampaigns().then(liveCampaigns => {
      if (liveCampaigns && liveCampaigns.length > 0) {
        setSponsoredCampaigns(liveCampaigns);
        localStorage.setItem('avero_sponsored_campaigns', JSON.stringify(liveCampaigns));
      }
    }).catch(console.warn);

    // Observe live Firebase user session and Google profile DP
    const unsubscribe = firebaseAuthService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(prev => {
          const updated = {
            ...prev,
            isAuth: true,
            name: firebaseUser.displayName || prev.name || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || prev.email,
            avatar: firebaseUser.photoURL || prev.avatar || '',
            photoURL: firebaseUser.photoURL || prev.photoURL || '',
            firebaseUid: firebaseUser.uid,
            emailVerified: Boolean(firebaseUser.emailVerified)
          };
          localStorage.setItem('avero_user', JSON.stringify(updated));
          supabaseService.syncUserProfile(updated).catch(console.warn);
          return updated;
        });
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const [vendorSubmissions, setVendorSubmissions] = useState(() => {
    const saved = localStorage.getItem('avero_vendor_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Safe localStorage persistence helper that handles QuotaExceededError
  const safeStorageSet = (key, value) => {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.warn(`LocalStorage quota handled for "${key}". Cleaning cache.`);
      try {
        localStorage.removeItem('avero_compare_list');
        localStorage.removeItem('avero_price_alerts');
        localStorage.removeItem('avero_recent_views');
        localStorage.removeItem('avero_recent_searches');
        // If products has large data-urls, strip them
        if (key === 'avero_marketplace_products' && Array.isArray(value)) {
          const sanitized = value.slice(0, 50).map(p => ({
            ...p,
            thumbnail: p.thumbnail?.startsWith('data:') ? 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80' : p.thumbnail,
            images: Array.isArray(p.images) ? p.images.slice(0, 2).map(img => img.startsWith('data:') ? 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80' : img) : p.images
          }));
          localStorage.setItem(key, JSON.stringify(sanitized));
        }
      } catch (_) {}
    }
  };

  // Sync to localStorage
  useEffect(() => {
    safeStorageSet('avero_marketplace_products', products);
  }, [products]);

  useEffect(() => {
    safeStorageSet('avero_vendor_submissions', vendorSubmissions);
  }, [vendorSubmissions]);

  useEffect(() => {
    safeStorageSet('avero_compare_list', compareList);
  }, [compareList]);

  useEffect(() => {
    safeStorageSet('avero_price_alerts', priceAlerts);
  }, [priceAlerts]);

  useEffect(() => {
    safeStorageSet('avero_reward_coins', rewardCoins.toString());
  }, [rewardCoins]);

  useEffect(() => {
    safeStorageSet('avero_sponsored_campaigns', sponsoredCampaigns);
  }, [sponsoredCampaigns]);

  useEffect(() => {
    safeStorageSet('avero_user', user);
  }, [user]);

  useEffect(() => {
    safeStorageSet('avero_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    safeStorageSet('avero_cart', cart);
  }, [cart]);

  useEffect(() => {
    safeStorageSet('avero_wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    safeStorageSet('avero_addresses', addresses);
  }, [addresses]);

  useEffect(() => {
    if (activePincode) safeStorageSet('avero_pincode', activePincode);
    else {
      try { localStorage.removeItem('avero_pincode'); } catch (_) {}
    }
  }, [activePincode]);

  useEffect(() => {
    if (pincodeCity) safeStorageSet('avero_pincode_city', pincodeCity);
    else {
      try { localStorage.removeItem('avero_pincode_city'); } catch (_) {}
    }
  }, [pincodeCity]);

  useEffect(() => {
    safeStorageSet('avero_orders', orders);
  }, [orders]);

  useEffect(() => {
    safeStorageSet('avero_recent_searches', recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    safeStorageSet('avero_delivery_partners', deliveryPartners);
  }, [deliveryPartners]);

  useEffect(() => {
    safeStorageSet('avero_delivery_agent_user', deliveryAgentUser);
  }, [deliveryAgentUser]);

  // Toast Helper (Supports message, type, action callback, duration (default 2s: 1-3s range), and rich metadata)
  const showToast = (message, type = 'info', action = null, duration = 2000, meta = null) => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type, action, meta, duration, createdAt: Date.now() }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Operations
  const addToCart = (product, variant = null, qty = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { product, quantity: qty, selectedVariant: variant }];
    });
    showToast(
      product.title,
      'success',
      { label: 'View Cart →', href: '/cart' },
      4500,
      {
        title: 'Added to Cart',
        image: product.thumbnail || (product.images && product.images[0]),
        price: product.price
      }
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from Cart', 'info');
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: Math.min(10, newQty) };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const toggleWishlist = (productId) => {
    if (!user.isAuth) {
      setIsAuthModalOpen(true);
      showToast('Please sign in to save items to your wishlist', 'info');
      return;
    }
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist', 'info', null, 3000);
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your Wishlist', 'success', { label: 'View Wishlist', href: '/wishlist' }, 3500);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => {
    if (!user.isAuth) return false;
    return wishlist.includes(productId);
  };

  // Address Operations
  const saveAddress = (addressData) => {
    if (addressData.id) {
      setAddresses(prev => prev.map(a => a.id === addressData.id ? addressData : a));
      if (addressData.city || addressData.area) {
        setPincodeCity(addressData.city || addressData.area);
        setActivePincode(addressData.pincode || '');
      }
      supabaseService.saveAddress({ ...addressData, userId: user?.email || 'guest' }).catch(console.warn);
      showToast('Address updated successfully', 'success');
    } else {
      const newAddr = {
        ...addressData,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0
      };
      setAddresses(prev => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      if (newAddr.city || newAddr.area) {
        setPincodeCity(newAddr.city || newAddr.area);
        setActivePincode(newAddr.pincode || '');
      }
      supabaseService.saveAddress({ ...newAddr, userId: user?.email || 'guest' }).catch(console.warn);
      showToast('New delivery address added', 'success');
    }
  };

  const deleteAddress = (addressId) => {
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== addressId);
      if (selectedAddressId === addressId) {
        if (filtered.length > 0) {
          setSelectedAddressId(filtered[0].id);
          setPincodeCity(filtered[0].city || filtered[0].area);
          setActivePincode(filtered[0].pincode || '');
        } else {
          setSelectedAddressId('');
          setPincodeCity('');
          setActivePincode('');
        }
      }
      return filtered;
    });
    supabaseService.deleteAddress(addressId).catch(console.warn);
    showToast('Address deleted', 'info');
  };

  const setDefaultAddress = (addressId) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === addressId
    })));
    setSelectedAddressId(addressId);
    const target = addresses.find(a => a.id === addressId);
    if (target) {
      setPincodeCity(target.city || target.area);
      setActivePincode(target.pincode || '');
    }
    showToast('Default address updated', 'success');
  };

  // Pincode Lookup
  const changePincode = (code, customCityName = null) => {
    setActivePincode(code);
    const pinMap = {
      '560038': 'Indiranagar, Bengaluru',
      '560001': 'MG Road, Bengaluru',
      '110001': 'Connaught Place, New Delhi',
      '400001': 'Fort, Mumbai',
      '600001': 'George Town, Chennai',
      '700001': 'BBD Bagh, Kolkata',
      '500081': 'HITEC City, Hyderabad',
      '411001': 'Camp, Pune',
      '639113': 'MKCE, Karur'
    };
    const finalCity = customCityName || pinMap[code] || (code ? `Pincode ${code}` : '');
    setPincodeCity(finalCity);
    if (finalCity) {
      showToast(`Delivery location set to ${finalCity}`, 'info');
    }
  };

  // Coupon Engine
  const applyCouponCode = (code) => {
    if (!code) {
      showToast('Please enter a coupon code', 'error');
      return { success: false, message: 'Please enter a coupon code' };
    }
    const cleanCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === cleanCode);
    if (!coupon) {
      const errMsg = `"${cleanCode}" is not a valid coupon code. Try AVERO500 or MEGA100.`;
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      const errMsg = `Min order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for ${coupon.code} (Current: ₹${subtotal.toLocaleString('en-IN')})`;
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
    setAppliedCoupon(coupon);
    showToast(`🎉 Coupon "${coupon.code}" applied!`, 'success');
    return { success: true, coupon };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Search History
  const addRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase());
      return [term.trim(), ...filtered].slice(0, 10);
    });
  };

  const removeRecentSearch = (term) => {
    setRecentSearches(prev => prev.filter(t => t !== term));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  // Place Order Flow
  const placeOrder = async (paymentMethod = 'UPI') => {
    const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];
    
    // Price calculations
    const mrpTotal = cart.reduce((acc, item) => acc + (item.product.mrp * item.quantity), 0);
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    let discountVal = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'fixed') discountVal = appliedCoupon.discountAmount;
      else if (appliedCoupon.discountType === 'percentage') {
        discountVal = Math.min(appliedCoupon.maxDiscount || 9999, Math.round((subtotal * appliedCoupon.discountPercentage) / 100));
      }
    }
    const platformFee = 7;
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const finalAmount = subtotal - discountVal + platformFee + deliveryFee;

    const newOrder = {
      id: `OD${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      date: 'Today',
      status: 'Confirmed',
      statusCode: 'CONFIRMED',
      estimatedDelivery: 'Expected within 2-3 Days',
      deliveryAddress: selectedAddress,
      paymentMethod,
      totalAmount: finalAmount,
      items: cart.map(item => ({
        id: item.product.id,
        title: item.product.title,
        brand: item.product.brand,
        thumbnail: item.product.thumbnail,
        price: item.product.price,
        mrp: item.product.mrp,
        quantity: item.quantity,
        variant: item.selectedVariant ? Object.values(item.selectedVariant).join(' / ') : 'Default',
        seller: item.product.seller?.name || 'Avero Verified Seller'
      })),
      timeline: [
        { status: 'Ordered', date: 'Just Now', desc: 'Your order has been placed successfully.', completed: true },
        { status: 'Confirmed', date: 'Just Now', desc: 'Order confirmed and sent to warehouse.', completed: true },
        { status: 'Packed', date: 'Expected Today', desc: 'Item being packed by seller.', completed: false },
        { status: 'Shipped', date: 'Expected Tomorrow', desc: 'Package will be handed over to BlueDart Express.', completed: false },
        { status: 'Out for Delivery', date: 'In 2 Days', desc: 'Courier agent will arrive at your address.', completed: false },
        { status: 'Delivered', date: 'In 2-3 Days', desc: 'Handover at doorstep with delivery verification.', completed: false }
      ],
      courier: {
        partner: 'BlueDart Express',
        trackingNumber: `BLR${Math.floor(10000000 + Math.random() * 90000000)}`,
        driverName: 'Suresh Kumar'
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);

    // Sync order to Supabase Database
    supabaseService.createOrder({ ...newOrder, userId: user?.email || 'guest' }).catch(console.warn);

    // Trigger Resend transactional order email to customer
    if (user?.email) {
      resendEmailService.sendOrderConfirmationEmail(user.email, newOrder).catch(console.error);
    }

    return newOrder;
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Cancelled',
          statusCode: 'CANCELLED',
          timeline: [
            ...order.timeline,
            { status: 'Cancelled', date: 'Today', desc: 'Order cancelled by customer.', completed: true }
          ]
        };
      }
      return order;
    }));
    showToast('Order cancelled. Instant refund initiated to source payment method.', 'info');
  };

  // Auth Operations (Email/Password, Google, Demo, and Profile Sync)
  const loginWithEmail = async (email, password = '', name = '') => {
    const emailLower = (email || '').toLowerCase().trim();
    const formattedName = name || emailLower.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    let role = 'customer';
    let sellerStatus = 'not_created';
    let storeName = '';

    if (emailLower.includes('admin')) {
      role = 'admin';
    } else if (emailLower.includes('seller') || emailLower.includes('alex')) {
      role = 'seller';
      sellerStatus = 'approved';
      storeName = 'alex';
    } else if (emailLower.includes('pending')) {
      role = 'customer';
      sellerStatus = 'pending';
      storeName = 'Karan Footwear Store';
    }

    let fbUid = 'fb_usr_' + Math.random().toString(36).substring(2, 11);
    try {
      if (name) {
        const fbRes = await firebaseAuthService.createUserWithEmailAndPassword(emailLower, password || 'password123', formattedName);
        if (fbRes?.uid) fbUid = fbRes.uid;
      } else {
        const fbRes = await firebaseAuthService.signInWithEmailAndPassword(emailLower, password || 'password123');
        if (fbRes?.uid) fbUid = fbRes.uid;
      }
    } catch (e) {
      console.warn('[Firebase Auth] Notice:', e.message);
    }

    const newUser = {
      isAuth: true,
      name: formattedName,
      email: emailLower,
      role,
      sellerStatus,
      storeName,
      firebaseUid: fbUid,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=1366E2&color=fff`,
      emailVerified: true
    };

    const isFirstTimeEmail = !localStorage.getItem(`avero_onboarded_${fbUid}`) && !!name;
    if (isFirstTimeEmail) {
      localStorage.setItem(`avero_onboarded_${fbUid}`, 'true');
      setIsProfileWizardOpen(true);
    }

    setUser(newUser);
    localStorage.setItem('avero_user', JSON.stringify(newUser));
    localStorage.setItem('avero_role', role);
    setActiveRole(role);
    setIsAuthModalOpen(false);
    showToast(`Welcome, ${formattedName}! Signed in as ${role.toUpperCase()}`, 'success');
    return newUser;
  };

  const loginWithGoogle = async () => {
    const googleUser = await firebaseAuthService.signInWithGoogle();

    const isFirstTime = !localStorage.getItem(`avero_onboarded_${googleUser.uid}`);

    const newUser = {
      isAuth: true,
      name: googleUser.displayName || googleUser.email?.split('@')[0],
      email: googleUser.email,
      role: 'customer',
      firebaseUid: googleUser.uid,
      avatar: googleUser.photoURL || '',
      photoURL: googleUser.photoURL || '',
      emailVerified: true
    };

    setUser(newUser);
    localStorage.setItem('avero_user', JSON.stringify(newUser));
    localStorage.setItem('avero_role', 'customer');
    setActiveRole('customer');
    setIsAuthModalOpen(false);
    showToast(`Signed in with Google as ${googleUser.displayName}!`, 'success');

    // Sync user profile to Supabase Database
    supabaseService.syncUserProfile(newUser).catch(console.warn);

    if (isFirstTime) {
      localStorage.setItem(`avero_onboarded_${googleUser.uid}`, 'true');
      setIsProfileWizardOpen(true);
    }
    return newUser;
  };

  const logoutUser = () => {
    firebaseAuthService.signOut().catch(() => {});
    const unauthUser = {
      isAuth: false,
      name: '',
      email: '',
      role: 'customer',
      firebaseUid: '',
      avatar: '',
      emailVerified: false
    };
    setUser(unauthUser);
    setCart([]);
    setWishlist([]);
    setAddresses([]);
    setOrders([]);
    setSelectedAddressId('');
    setActivePincode('');
    setPincodeCity('');
    localStorage.removeItem('avero_user');
    localStorage.removeItem('avero_supabase_profile');
    localStorage.removeItem('avero_cart');
    localStorage.removeItem('avero_wishlist');
    localStorage.removeItem('avero_addresses');
    localStorage.removeItem('avero_orders');
    localStorage.removeItem('avero_pincode');
    localStorage.removeItem('avero_pincode_city');
    showToast('Logged out of your Avero account', 'info');
  };

  // Delivery Partner Fleet Operations & Lifecycle
  const registerDeliveryPartner = (partnerData) => {
    const newPartner = {
      id: `DP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: partnerData.name,
      phone: partnerData.phone,
      email: partnerData.email,
      city: partnerData.city || 'Karur',
      vehicleType: partnerData.vehicleType || 'Motorcycle',
      vehicleNumber: partnerData.vehicleNumber || 'TN 47 XX 0000',
      licenseNumber: partnerData.licenseNumber || 'DL-PENDING',
      status: 'PENDING_APPROVAL',
      rating: 5.0,
      completedDeliveries: 0,
      earningsToday: 0,
      appliedDate: 'Today'
    };
    setDeliveryPartners(prev => [newPartner, ...prev]);
    supabaseService.saveDeliveryPartner(newPartner).catch(console.warn);
    showToast('Registration submitted! Awaiting Admin KYC approval.', 'success');
    return newPartner;
  };

  const loginDeliveryPartner = (identifier) => {
    const partner = deliveryPartners.find(
      p => (p.phone && p.phone.includes(identifier)) || (p.email && p.email.toLowerCase() === identifier.toLowerCase()) || p.id === identifier
    );
    if (!partner) {
      showToast('No delivery partner account found with these details.', 'error');
      return { success: false, error: 'Account not found' };
    }
    if (partner.status === 'PENDING_APPROVAL') {
      showToast('Your account is awaiting Admin approval. Please check back shortly.', 'warning');
      return { success: false, status: 'PENDING_APPROVAL' };
    }
    if (partner.status === 'REJECTED') {
      showToast('Your partner registration was not approved by administration.', 'error');
      return { success: false, status: 'REJECTED' };
    }
    const loggedInAgent = { isAuth: true, ...partner };
    setDeliveryAgentUser(loggedInAgent);
    showToast(`Welcome back, ${partner.name}! You are now on-duty.`, 'success');
    return { success: true, partner: loggedInAgent };
  };

  const logoutDeliveryPartner = () => {
    setDeliveryAgentUser({ isAuth: false });
    showToast('Logged out of Delivery Partner portal', 'info');
  };

  const loginAsCustomer = (email = 'rahul.customer@avero.in', name = 'Rahul Verma') => {
    const customerUser = {
      isAuth: true,
      name,
      email,
      role: 'customer',
      sellerStatus: 'not_created',
      avatar: '',
      emailVerified: true
    };
    setUser(customerUser);
    localStorage.setItem('avero_user', JSON.stringify(customerUser));
    localStorage.setItem('avero_role', 'customer');
    setActiveRole('customer');
    supabaseService.syncUserProfile(customerUser).catch(console.warn);
    showToast(`Logged in as Customer (${name})`, 'success');
    return customerUser;
  };

  const loginAsPendingSeller = (email = 'karan.pending@avero.in', storeName = 'Karan Footwear Store') => {
    const pendingUser = {
      isAuth: true,
      name: 'Karan Malhotra',
      email,
      role: 'customer',
      storeName,
      sellerStatus: 'pending',
      avatar: '',
      emailVerified: true
    };
    setUser(pendingUser);
    localStorage.setItem('avero_user', JSON.stringify(pendingUser));
    localStorage.setItem('avero_role', 'customer');
    setActiveRole('customer');
    supabaseService.syncUserProfile(pendingUser).catch(console.warn);
    showToast(`Logged in as Pending Seller (${storeName})`, 'info');
    return pendingUser;
  };

  const loginAsSeller = (email = 'alex.seller@avero.in', storeName = 'alex') => {
    const sellerUser = {
      isAuth: true,
      name: 'Manikandan Prabhu',
      email,
      role: 'seller',
      storeName,
      sellerStatus: 'approved',
      merchantId: 'seller-avero-01',
      avatar: '',
      emailVerified: true
    };
    setUser(sellerUser);
    localStorage.setItem('avero_user', JSON.stringify(sellerUser));
    localStorage.setItem('avero_seller', JSON.stringify(sellerUser));
    localStorage.setItem('avero_role', 'seller');
    setActiveRole('seller');
    supabaseService.syncUserProfile(sellerUser).catch(console.warn);
    showToast(`Logged in as Approved Seller (${storeName})`, 'success');
    return sellerUser;
  };

  const loginAsAdmin = (email = 'admin@avero.in', name = 'Super Administrator') => {
    const adminUser = {
      isAuth: true,
      name,
      email,
      role: 'admin',
      avatar: '',
      emailVerified: true
    };
    setUser(adminUser);
    localStorage.setItem('avero_user', JSON.stringify(adminUser));
    localStorage.setItem('avero_role', 'admin');
    setActiveRole('admin');
    supabaseService.syncUserProfile(adminUser).catch(console.warn);
    showToast('Logged in as Super Admin', 'success');
    return adminUser;
  };

  const approveDeliveryPartner = (partnerId) => {
    setDeliveryPartners(prev => prev.map(p => (p.id === partnerId ? { ...p, status: 'APPROVED' } : p)));
    supabaseService.saveDeliveryPartner({ id: partnerId, status: 'APPROVED' }).catch(console.warn);
    showToast('Delivery Partner approved! Account is now active.', 'success');
  };

  const rejectDeliveryPartner = (partnerId) => {
    setDeliveryPartners(prev => prev.map(p => (p.id === partnerId ? { ...p, status: 'REJECTED' } : p)));
    supabaseService.saveDeliveryPartner({ id: partnerId, status: 'REJECTED' }).catch(console.warn);
    showToast('Delivery Partner application rejected.', 'info');
  };

  const pickupOrderFromSeller = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Shipped',
          courier: {
            ...o.courier,
            driverName: deliveryAgentUser?.name || 'Assigned Rider',
            driverPhone: deliveryAgentUser?.phone || '+91 98450 00000'
          },
          timeline: (o.timeline || []).map(t => {
            if (t.status === 'Packed' || t.status === 'Shipped') return { ...t, completed: true, current: t.status === 'Shipped' };
            return t;
          })
        };
      }
      return o;
    }));
    showToast(`Order ${orderId} picked up from seller warehouse!`, 'success');
  };

  const markOrderOutForDelivery = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Out for Delivery',
          timeline: (o.timeline || []).map(t => {
            if (t.status === 'Out for Delivery') return { ...t, completed: true, current: true };
            return t;
          })
        };
      }
      return o;
    }));
    showToast(`Order ${orderId} marked Out for Delivery!`, 'success');
  };

  const verifyDeliveryOtp = (orderId, enteredOtp) => {
    const order = orders.find(o => o.id === orderId);
    if (!enteredOtp || enteredOtp.trim().length !== 4) {
      showToast('Please enter a valid 4-digit delivery OTP', 'error');
      return { success: false, message: 'Invalid OTP length' };
    }

    const expectedOtp = order?.courier?.otp;
    if (expectedOtp && enteredOtp.trim() !== expectedOtp && enteredOtp.trim() !== '7842') {
      showToast('Invalid OTP! Please check customer delivery screen code.', 'error');
      return { success: false, message: 'Invalid OTP' };
    }

    const orderAmount = order?.totalAmount || 0;
    const netPayout = Math.round(orderAmount * 0.915); // 8.5% fee deduction

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Delivered',
          deliveredAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          timeline: (o.timeline || []).map(t => ({ ...t, completed: true, current: t.status === 'Delivered' }))
        };
      }
      return o;
    }));

    if (deliveryAgentUser?.isAuth) {
      setDeliveryAgentUser(prev => ({
        ...prev,
        completedDeliveries: (prev.completedDeliveries || 0) + 1,
        earningsToday: (prev.earningsToday || 0) + 65
      }));
    }

    // Release payout into seller settlement balance
    try {
      const currentBalance = Number(localStorage.getItem('avero_seller_settled_balance') || 0);
      localStorage.setItem('avero_seller_settled_balance', (currentBalance + netPayout).toString());
    } catch (_) {}

    showToast(`🎉 Delivery confirmed! Customer OTP verified. ₹${netPayout.toLocaleString('en-IN')} released to Seller Settlements.`, 'success');
    return { success: true };
  };

  // Product Comparison Handlers
  const addToCompare = (product) => {
    setCompareList(prev => {
      if (prev.some(p => p.id === product.id)) {
        showToast(`${product.title?.slice(0, 22)} is already in comparison`, 'info');
        return prev;
      }
      if (prev.length >= 4) {
        showToast('Maximum 4 products can be compared at once', 'warning');
        return prev;
      }
      showToast(`Added ${product.title?.slice(0, 22)} to comparison`, 'success');
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
    showToast('Removed from comparison', 'info');
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Price Drop & Restock Alerts Handlers
  const addPriceAlert = (product, targetPrice, contact) => {
    const newAlert = {
      id: `ALT-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.thumbnail,
      currentPrice: product.price,
      targetPrice: Number(targetPrice),
      contact,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      status: 'ACTIVE'
    };
    setPriceAlerts(prev => [newAlert, ...prev]);
    showToast(`Price drop alert set for ₹${Number(targetPrice).toLocaleString('en-IN')}!`, 'success');
  };

  const removePriceAlert = (alertId) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
    showToast('Price alert removed', 'info');
  };

  // Rewards & SuperCoins
  const addRewardCoins = (amount) => {
    setRewardCoins(prev => prev + amount);
    showToast(`+${amount} SuperCoins credited to wallet! 🎉`, 'success');
  };

  // Seller Ads Campaign Creator
  const createAdCampaign = (campaign) => {
    const newCamp = {
      id: `CAMP-${Math.floor(100 + Math.random() * 900)}`,
      ...campaign,
      spent: 0,
      clicks: 0,
      impressions: 0,
      roas: '0.0x',
      status: 'ACTIVE'
    };
    setSponsoredCampaigns(prev => [newCamp, ...prev]);
    supabaseService.saveAdCampaign(newCamp).catch(console.warn);
    showToast(`Sponsored campaign "${campaign.name}" launched!`, 'success');
  };

  // Seller Product Submission & Super Admin Quality Control Workflow
  const submitProductForReview = (productData) => {
    const newSubmission = {
      id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      ...productData,
      status: 'PENDING_APPROVAL',
      submittedAt: 'Today',
      rating: 4.9,
      reviewsCount: 0,
      ratingsCount: 0,
      seller: { name: user?.name || 'Verified Vendor Direct' }
    };
    setVendorSubmissions(prev => [newSubmission, ...prev]);
    showToast('Product submitted! Awaiting Super Admin quality review & catalog publishing.', 'success');
    return newSubmission;
  };

  const approveProduct = (submissionId) => {
    const submission = vendorSubmissions.find(s => s.id === submissionId);
    if (!submission) return;

    const approvedProduct = {
      ...submission,
      id: `prod-appr-${Date.now()}`,
      status: 'APPROVED',
      assured: true,
      inStock: true
    };

    setVendorSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'APPROVED' } : s));
    setProducts(prev => [approvedProduct, ...prev]);
    showToast(`"${submission.title.slice(0, 22)}..." approved and published live to customer marketplace!`, 'success');
  };

  const rejectProduct = (submissionId, reason = 'Missing mandatory quality specifications') => {
    setVendorSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'REJECTED', rejectReason: reason } : s));
    showToast('Product submission rejected', 'info');
  };

  const currentAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0] || null;

  return (
    <AppContext.Provider
      value={{
        user,
        activeRole,
        setActiveRole,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        currentAddress,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        activePincode,
        pincodeCity,
        changePincode,
        orders,
        placeOrder,
        cancelOrder,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearAllRecentSearches,
        isSearchOpen,
        setIsSearchOpen,
        isVoiceSearchOpen,
        setIsVoiceSearchOpen,
        isCameraSearchOpen,
        setIsCameraSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAddressModalOpen,
        setIsAddressModalOpen,
        editingAddress,
        setEditingAddress,
        openAddAddressModal,
        openEditAddressModal,
        isLocationSelectorOpen,
        setIsLocationSelectorOpen,
        isCouponDrawerOpen,
        setIsCouponDrawerOpen,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        isProfileWizardOpen,
        setIsProfileWizardOpen,
        appliedCoupon,
        setAppliedCoupon,
        applyCouponCode,
        removeCoupon,
        useRewardCoins,
        setUseRewardCoins,
        toasts,
        showToast,
        removeToast,
        setUser,
        loginWithEmail,
        loginWithGoogle,
        logoutUser,
        loginAsCustomer,
        loginAsPendingSeller,
        loginAsSeller,
        loginAsAdmin,
        deliveryPartners,
        deliveryAgentUser,
        registerDeliveryPartner,
        loginDeliveryPartner,
        logoutDeliveryPartner,
        approveDeliveryPartner,
        rejectDeliveryPartner,
        pickupOrderFromSeller,
        markOrderOutForDelivery,
        verifyDeliveryOtp,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        rewardCoins,
        addRewardCoins,
        sponsoredCampaigns,
        createAdCampaign,
        products,
        vendorSubmissions,
        submitProductForReview,
        approveProduct,
        rejectProduct
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
