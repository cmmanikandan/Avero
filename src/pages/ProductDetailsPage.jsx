import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductGallery from '../components/product/ProductGallery';
import VariantSelector from '../components/product/VariantSelector';
import DeliveryCard from '../components/product/DeliveryCard';
import SectionNavCard from '../components/product/SectionNavCard';
import FrequentlyBoughtTogether from '../components/product/FrequentlyBoughtTogether';
import MoreSmartCombos from '../components/product/MoreSmartCombos';
import ProductCard from '../components/product/ProductCard';
import PriceAlertModal from '../components/product/PriceAlertModal';
import ReviewModalWithMedia from '../components/reviews/ReviewModalWithMedia';
import ProductQnASection from '../components/product/ProductQnASection';
import AiProductAdvisor from '../components/product/AiProductAdvisor';
import { getProductSmartCombos } from '../services/intelligence/associationMiningService';
import { getRelatedAndCompatibleProducts } from '../services/intelligence/similarityService';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Tag,
  ChevronRight,
  Zap,
  ShoppingCart,
  Layers,
  MessageSquare,
  HelpCircle,
  Store,
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  Clock,
  Truck,
  RotateCcw,
  Shield,
  Bell,
  Camera,
  Scale,
  Package
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setIsAuthModalOpen, addToCart, activePincode, addToCompare, compareList, showToast, products = [], vendorSubmissions = [] } = useApp();
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Combine live catalog and vendor submissions
  const allAvailableProducts = useMemo(() => {
    const combined = [...products, ...vendorSubmissions];
    const map = new Map();
    combined.forEach(p => {
      if (p && p.id && !map.has(String(p.id))) {
        map.set(String(p.id), p);
      }
    });
    return Array.from(map.values());
  }, [products, vendorSubmissions]);

  // Find exact product by id or title slug
  const product = useMemo(() => {
    if (!id) return null;
    const targetId = String(id).trim();
    
    // 1. Direct match by ID
    const found = allAvailableProducts.find((p) => String(p.id) === targetId);
    if (found) return found;

    // 2. Match by title slug
    const foundBySlug = allAvailableProducts.find(
      (p) => p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetId.toLowerCase()
    );
    if (foundBySlug) return foundBySlug;

    return null;
  }, [id, allAvailableProducts]);

  // Variant Selection State
  const [selectedVariant, setSelectedVariant] = useState({
    color: product?.variants?.colors?.[0]?.name || product?.attributes?.color || '',
    storage: product?.variants?.storage?.find((s) => s.selected)?.label || product?.variants?.storage?.[0]?.label || '',
    size: product?.variants?.sizes?.find((s) => s.selected)?.label || product?.variants?.sizes?.[0]?.label || ''
  });

  // Re-sync variant when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant({
        color: product?.variants?.colors?.[0]?.name || product?.attributes?.color || '',
        storage: product?.variants?.storage?.find((s) => s.selected)?.label || product?.variants?.storage?.[0]?.label || '',
        size: product?.variants?.sizes?.find((s) => s.selected)?.label || product?.variants?.sizes?.[0]?.label || ''
      });
    }
  }, [product?.id]);

  // Recommended Tabs State
  const [activeRecTab, setActiveRecTab] = useState('RELATED'); // 'RELATED' | 'TRENDING' | 'BESTSELLER' | 'RECENT'

  // Dynamic Price from selected variant if available
  const activeStorageObj = product?.variants?.storage?.find((s) => s.label === selectedVariant.storage);
  const currentPrice = activeStorageObj?.price || product?.price || 0;
  const currentMrp = activeStorageObj?.mrp || product?.mrp || 0;
  const currentDiscount = currentMrp > currentPrice ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : (product?.discount || 0);
  const currentSavings = Math.max(0, currentMrp - currentPrice);

  const handleSelectVariant = (type, val) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [type]: val
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, 1);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, 1);
    if (!user?.isAuth) {
      showToast('Please sign in to your account to place your order.', 'warning');
      setIsAuthModalOpen(true);
      return;
    }
    navigate('/checkout');
  };

  // Data Mining Market Basket Association Rules for Combos (FP-Growth & Apriori)
  const smartCombos = useMemo(() => {
    return getProductSmartCombos(product, allAvailableProducts);
  }, [product, allAvailableProducts]);

  // Jaccard & Cosine Similarity for Related Products
  const relatedProductsWithScores = useMemo(() => {
    return getRelatedAndCompatibleProducts(product, allAvailableProducts, 5);
  }, [product, allAvailableProducts]);

  const similarProducts = useMemo(() => {
    return relatedProductsWithScores.map(r => r.product);
  }, [relatedProductsWithScores]);

  // Recommended Products Pools
  const relatedPool = useMemo(() => {
    if (!product) return [];
    return allAvailableProducts.filter((p) => (p.category === product.category || p.brand === product.brand) && p.id !== product.id).slice(0, 5);
  }, [product, allAvailableProducts]);

  const trendingPool = useMemo(() => {
    if (!product) return [];
    const inCatTrending = allAvailableProducts.filter((p) => p.category === product.category && (p.tags?.includes('Hot Deal') || p.discount >= 10) && p.id !== product.id);
    if (inCatTrending.length >= 4) return inCatTrending.slice(0, 5);
    return allAvailableProducts.filter((p) => (p.tags?.includes('Hot Deal') || p.discount >= 15) && p.id !== product.id).slice(0, 5);
  }, [product, allAvailableProducts]);

  const bestSellerPool = useMemo(() => {
    if (!product) return [];
    const inCatBestseller = allAvailableProducts.filter((p) => p.category === product.category && (p.tags?.includes('Bestseller') || p.rating >= 4.7) && p.id !== product.id);
    if (inCatBestseller.length >= 4) return inCatBestseller.slice(0, 5);
    return allAvailableProducts.filter((p) => (p.tags?.includes('Bestseller') || p.rating >= 4.7) && p.id !== product.id).slice(0, 5);
  }, [product, allAvailableProducts]);

  const recentPool = useMemo(() => {
    if (!product) return [];
    return allAvailableProducts.filter((p) => p.id !== product.id).slice(0, 5);
  }, [product, allAvailableProducts]);

  const activeRecommendedList = useMemo(() => {
    switch (activeRecTab) {
      case 'TRENDING':
        return trendingPool.length > 0 ? trendingPool : relatedPool;
      case 'BESTSELLER':
        return bestSellerPool.length > 0 ? bestSellerPool : relatedPool;
      case 'RECENT':
        return recentPool.length > 0 ? recentPool : relatedPool;
      case 'RELATED':
      default:
        return relatedPool.length > 0 ? relatedPool : allAvailableProducts.slice(0, 5);
    }
  }, [activeRecTab, relatedPool, trendingPool, bestSellerPool, recentPool, allAvailableProducts]);

  // Intelligent Category-Aware Companion Bundle Engine for Frequently Bought Together
  const bundleCandidates = useMemo(() => {
    if (!product) return [];

    const pTitle = (product.title || '').toLowerCase();
    const pCat = (product.category || '').toLowerCase();
    const pSub = (product.subcategory || '').toLowerCase();
    const pBrand = (product.brand || '').toLowerCase();

    // 1. 📺 SMART TVs & TELEVISIONS -> Pair with Compatible Soundbar / Home Theater + 4K HDMI 2.1 Cable / Heavy Duty Wall Mount
    if (pCat === 'electronics' && (pSub.includes('tv') || pTitle.includes('tv') || pTitle.includes('oled') || pTitle.includes('qled') || pTitle.includes('bravia'))) {
      const sameBrandSoundbar = allAvailableProducts.find(
        p => p.id !== product.id && ((p.brand && p.brand.toLowerCase() === pBrand && (p.category === 'audio' || p.title.toLowerCase().includes('soundbar'))) || p.title.toLowerCase().includes('soundbar'))
      );
      const companionHdmi = allAvailableProducts.find(p => p.id === 'prod-acc-tv-01' || p.title.toLowerCase().includes('hdmi'));
      const companionWallMount = allAvailableProducts.find(p => p.id === 'prod-acc-tv-02' || p.title.toLowerCase().includes('wall mount'));

      return [sameBrandSoundbar, companionHdmi || companionWallMount].filter(Boolean);
    }

    // 2. 🎧 TWS EARBUDS & HEADPHONES -> Pair with Fast Power Adapter + Protective Case (NEVER a TV)
    if (pCat === 'audio' && (pSub.includes('earbuds') || pSub.includes('headphone') || pTitle.includes('buds') || pTitle.includes('airpods') || pTitle.includes('earbuds') || pTitle.includes('headphone'))) {
      const companionCharger = allAvailableProducts.find(
        p => p.id !== product.id && (p.title.toLowerCase().includes('adapter') || p.title.toLowerCase().includes('charger')) && p.price <= product.price
      );
      const companionCase = allAvailableProducts.find(
        p => p.id !== product.id && (p.title.toLowerCase().includes('case') || p.title.toLowerCase().includes('cover') || p.title.toLowerCase().includes('pouch')) && p.price < product.price
      );
      const companionCable = allAvailableProducts.find(p => p.id === 'prod-acc-01' || p.title.toLowerCase().includes('cable'));

      return [companionCharger || companionCable, companionCase || companionCable].filter(Boolean).slice(0, 2);
    }

    // 3. 🔊 SOUNDBARS & HOME THEATER -> Pair with 4K eARC HDMI 2.1 Cable + Wall Mount Bracket
    if (pCat === 'audio' || pSub.includes('soundbar') || pTitle.includes('soundbar')) {
      const companionHdmi = allAvailableProducts.find(p => p.id === 'prod-acc-tv-01' || p.title.toLowerCase().includes('hdmi'));
      const companionWallMount = allAvailableProducts.find(p => p.id === 'prod-acc-tv-02' || p.title.toLowerCase().includes('wall mount'));
      return [companionHdmi, companionWallMount].filter(Boolean);
    }

    // 3. 📱 MOBILES & FLAGSHIP SMARTPHONES -> Pair with Same-Brand TWS Earbuds + Fast Power Adapter / Shockproof Case
    if (pCat === 'mobiles' || pSub.includes('phone') || pTitle.includes('phone') || pTitle.includes('galaxy') || pTitle.includes('iphone') || pTitle.includes('oneplus')) {
      const sameBrandTws = allAvailableProducts.find(
        p => p.id !== product.id && (p.category === 'audio' || p.title.toLowerCase().includes('buds') || p.title.toLowerCase().includes('airpods') || p.title.toLowerCase().includes('earbuds')) && (p.brand && p.brand.toLowerCase() === pBrand)
      );
      const companionCharger = allAvailableProducts.find(
        p => p.id !== product.id && (p.title.toLowerCase().includes('adapter') || p.title.toLowerCase().includes('charger'))
      );
      const companionCase = allAvailableProducts.find(
        p => p.id !== product.id && (p.title.toLowerCase().includes('case') || p.title.toLowerCase().includes('pouch') || p.title.toLowerCase().includes('spigen'))
      );

      return [sameBrandTws || companionCharger, companionCase || companionCharger].filter(Boolean).slice(0, 2);
    }

    // 4. 💻 LAPTOPS & GAMING COMPUTING -> Pair with Wireless Gaming Mouse + Laptop Sleeve Bag
    if (pCat === 'laptops' || (pCat === 'electronics' && (pSub.includes('laptop') || pTitle.includes('laptop') || pTitle.includes('macbook') || pTitle.includes('zephyrus') || pTitle.includes('xps')))) {
      const companionMouse = allAvailableProducts.find(
        p => p.id !== product.id && (p.title.toLowerCase().includes('mouse') || p.subcategory === 'Mouse')
      );
      const companionBag = allAvailableProducts.find(
        p => p.id !== product.id && (p.title.toLowerCase().includes('sleeve') || p.title.toLowerCase().includes('backpack') || p.title.toLowerCase().includes('pouch'))
      );
      return [companionMouse, companionBag].filter(Boolean);
    }

    // 5. 👟 FOOTWEAR & SNEAKERS -> Pair with Dri-FIT Anti-Blister Cushion Socks + Premium Sneaker Care Kit
    if (pCat === 'footwear' || pSub.includes('shoes') || pSub.includes('sneakers') || pTitle.includes('shoes') || pTitle.includes('sneakers') || pTitle.includes('air max') || pTitle.includes('pegasus') || pTitle.includes('nitro') || pTitle.includes('ultraboost')) {
      const companionSocks = allAvailableProducts.find(p => p.id === 'prod-acc-shoe-01' || p.title.toLowerCase().includes('socks'));
      const companionShoeCare = allAvailableProducts.find(p => p.id === 'prod-acc-shoe-02' || p.title.toLowerCase().includes('shoe care') || p.title.toLowerCase().includes('cleaner'));
      return [companionSocks, companionShoeCare].filter(Boolean);
    }

    // 6. 🍳 KITCHEN & HOME APPLIANCES -> Pair with Food-Grade Silicone Utensil Spatula Set + Artisanal Roast Coffee
    if (pCat === 'home' || pSub.includes('cookware') || pTitle.includes('cooker') || pTitle.includes('cookware') || pTitle.includes('prestige') || pTitle.includes('pan')) {
      const companionSpatula = allAvailableProducts.find(p => p.id === 'prod-acc-kitchen-01' || p.title.toLowerCase().includes('spatula') || p.title.toLowerCase().includes('utensil'));
      const companionCoffee = allAvailableProducts.find(p => p.category === 'grocery' || p.title.toLowerCase().includes('coffee'));
      return [companionSpatula, companionCoffee].filter(Boolean);
    }

    // 7. General Fallback: Pair strictly with matching brand or category items
    const relatedMatches = allAvailableProducts.filter(
      p => p.id !== product.id && (p.brand === product.brand || p.category === product.category)
    );
    return relatedMatches.slice(0, 2);
  }, [product, allAvailableProducts]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 16px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '48px 32px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-600)'
          }}>
            <Package size={40} strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Product Not Found
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
            The requested product is not currently listed in the marketplace catalog.
          </p>
          <Link
            to="/products"
            className="btn btn-primary"
            style={{ marginTop: '8px', height: '44px', padding: '0 28px', fontSize: '14px', fontWeight: '700' }}
          >
            Explore All Departments
          </Link>
        </div>
      </div>
    );
  }

  const brandSlug = product.brand ? product.brand.toLowerCase() : 'apple';
  const brandRoute = `/brand/${encodeURIComponent(brandSlug)}`;
  const sellerId = product.seller?.name ? product.seller.name.toLowerCase().replace(/\s+/g, '-') : 'avero-direct';
  const sellerRoute = `/seller/${sellerId}`;

  return (
    <div className="pdp-container">
      {/* Main PDP 3-Column Hero Grid */}
      <div className="pdp-hero-grid" style={{ paddingTop: '8px' }}>
        
        {/* =========================================================================
           COLUMN 1: Left Gallery (340px Desktop, 280px Tablet, 100% Mobile)
           ========================================================================= */}
        <div className="pdp-gallery-column">
          <ProductGallery
            images={product.images}
            title={product.title}
            productId={product.id}
          />
        </div>

        {/* =========================================================================
           COLUMN 2: Center Flexible Information (~640px Max Width)
           ========================================================================= */}
        <div className="pdp-info-column">
          
          {/* Brand Link & Avero Assured Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <Link
              to={brandRoute}
              style={{
                fontSize: '12px',
                fontWeight: '800',
                color: 'var(--primary-600)',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {product.brand} Official Store
              <ChevronRight size={13} />
            </Link>

            {product.assured && (
              <span className="badge-assured" style={{ fontSize: '11px', padding: '3px 8px' }}>
                <ShieldCheck size={13} /> Avero Assured
              </span>
            )}
          </div>

          {/* Product Title (18px, 700 weight, 1.35 line height) */}
          <h1
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              lineHeight: '1.35',
              margin: 0
            }}
          >
            {product.title}
          </h1>

          {/* Ratings & Reviews Preview Badge (Click opens dedicated reviews page) */}
          <Link
            to={`/product/${product.id}/reviews`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              width: 'fit-content'
            }}
          >
            <span className="badge-rating" style={{ fontSize: '12px', padding: '3px 8px' }}>
              {product.rating} <Star size={11} fill="#ffffff" />
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
              <strong>{(product.ratingsCount || 12000).toLocaleString('en-IN')}</strong> Ratings &{' '}
              <strong>{(product.reviewsCount || 3000).toLocaleString('en-IN')}</strong> Reviews
            </span>
            <ChevronRight size={14} color="var(--text-secondary)" />
          </Link>

          {/* Pricing Card (Full Width, Left-aligned, Clear Savings) */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              padding: '16px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--savings-green)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Special Deal Price
              </div>

              {/* Flash Deal Live Countdown */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800',
                border: '1px solid #FECACA'
              }}>
                <Clock size={12} /> Ends in 03h : 24m : 18s
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-price)' }}>
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {currentMrp > currentPrice && (
                <>
                  <span style={{ fontSize: '15px', color: 'var(--text-strikethrough)', textDecoration: 'line-through' }}>
                    ₹{currentMrp.toLocaleString('en-IN')}
                  </span>
                  <span className="badge-discount" style={{ fontSize: '14px', fontWeight: '800' }}>
                    {currentDiscount}% OFF
                  </span>
                </>
              )}
            </div>

            {currentSavings > 0 && (
              <div style={{ fontSize: '13px', color: 'var(--savings-green)', fontWeight: '700', marginTop: '4px' }}>
                You save ₹{currentSavings.toLocaleString('en-IN')} on this order
              </div>
            )}

            {/* Stock Scarcity Bar */}
            <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: '#FFF7ED', borderRadius: '8px', border: '1px solid #FFEDD5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '800', color: '#9A3412', marginBottom: '4px' }}>
                <span>🔥 84% Sold out</span>
                <span>Only 3 Left at this price</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#FED7AA', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '84%', backgroundColor: '#EA580C', borderRadius: '10px' }} />
              </div>
            </div>

            {/* Bank Offers & Promotional Carousel */}
            <div style={{ marginTop: '14px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                <Tag size={13} color="#2563EB" /> Available Bank & Coupon Offers (4 Offers)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: '1.4' }}>
                  <span style={{ color: '#16A34A', fontWeight: '900' }}>•</span>
                  <span><strong>Bank Offer:</strong> 10% Instant Discount on HDFC Bank Credit Cards up to ₹1,250 on orders above ₹5,000. <span style={{ color: '#2563EB', fontWeight: '700', cursor: 'pointer' }}>T&C</span></span>
                </div>
                <div style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: '1.4' }}>
                  <span style={{ color: '#16A34A', fontWeight: '900' }}>•</span>
                  <span><strong>Special Coupon:</strong> Apply code <strong style={{ color: '#2563EB', backgroundColor: '#EFF6FF', padding: '1px 5px', borderRadius: '4px' }}>AVERO500</strong> for flat ₹500 OFF on checkout.</span>
                </div>
                <div style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: '1.4' }}>
                  <span style={{ color: '#16A34A', fontWeight: '900' }}>•</span>
                  <span><strong>No Cost EMI:</strong> Available starting from ₹{Math.round(currentPrice / 12).toLocaleString('en-IN')}/month on all major credit cards.</span>
                </div>
                <div style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: '1.4' }}>
                  <span style={{ color: '#16A34A', fontWeight: '900' }}>•</span>
                  <span><strong>Instant Promo:</strong> Apply code <strong style={{ color: '#2563EB', backgroundColor: '#EFF6FF', padding: '1px 5px', borderRadius: '4px' }}>MEGA100</strong> for ₹100 instant discount on orders above ₹499.</span>
                </div>
              </div>
            </div>

            {/* Quick Interactive Tool Actions (Compare, Price Alert, Write Review) */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => addToCompare(product)}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: compareList.some(p => p.id === product.id) ? '1px solid #2563EB' : '1px solid #CBD5E1',
                  backgroundColor: compareList.some(p => p.id === product.id) ? '#EFF6FF' : '#FFFFFF',
                  color: compareList.some(p => p.id === product.id) ? '#1D4ED8' : '#334155',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <Scale size={13} /> {compareList.some(p => p.id === product.id) ? 'In Compare ✓' : '+ Compare'}
              </button>

              <button
                type="button"
                onClick={() => setIsPriceAlertOpen(true)}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <Bell size={13} color="#D97706" /> Set Price Alert
              </button>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <Camera size={13} color="#2563EB" /> Add Review & Photo
              </button>
            </div>
          </div>

          {/* Variant Selectors (Pills with instant state updates) */}
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={handleSelectVariant}
          />

          {/* Delivery Card (48px Input & Button Alignment) */}
          <DeliveryCard
            deliveryDays={product.deliveryDays || 1}
            freeDelivery={product.freeDelivery !== false}
          />

          {/* Key Highlights & Features Card */}
          {product.highlights && product.highlights.length > 0 && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                padding: '18px 20px'
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} color="var(--primary-600)" /> Key Highlights & Features
              </h3>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {product.highlights.map((hl, i) => (
                  <li key={i} style={{ listStyleType: 'disc', lineHeight: '1.4' }}>
                    {hl}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* DEDICATED SECTION NAVIGATION CARDS (Direct Routing to Sub-pages) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            
            {/* 1. All Specifications -> /product/:id/specifications */}
            <SectionNavCard
              to={`/product/${product.id}/specifications`}
              icon={Layers}
              title="Product Specifications"
              subtitle="General, Display, Processor, Storage, Dimensions & Warranty details"
              badge={`${product.specifications?.reduce((acc, g) => acc + g.items.length, 0) || 12}+ Specs`}
            />

            {/* 2. Customer Ratings & Reviews -> /product/:id/reviews */}
            <SectionNavCard
              to={`/product/${product.id}/reviews`}
              icon={Star}
              title="Customer Ratings & Reviews"
              subtitle={`Based on ${(product.ratingsCount || 12000).toLocaleString('en-IN')} ratings and ${(product.reviewsCount || 3000).toLocaleString('en-IN')} verified customer reviews`}
              badge={`${product.rating} ★`}
              badgeType="rating"
            />

            {/* 3. Questions & Answers -> /product/:id/questions */}
            <SectionNavCard
              to={`/product/${product.id}/questions`}
              icon={HelpCircle}
              title="Questions & Answers"
              subtitle="Have questions about warranty, compatibility or features? Browse answers or ask."
              badge="Verified Answers"
              badgeType="verified"
            />

            {/* 4. Seller Profile -> /seller/:sellerId */}
            <SectionNavCard
              to={sellerRoute}
              icon={Store}
              title={`Sold by: ${product.seller?.name || 'SuperCom Retail'}`}
              subtitle="4.8 ★ Verified Partner Seller • 98.4% On-time dispatch rate • 100% Genuine"
              badge="Verified Partner"
              badgeType="verified"
            />
          </div>

          {/* Tablet CTA Buttons (Shown on Tablet 768px - 1199px) */}
          <div className="tablet-cta-row" style={{ display: 'none', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn btn-add-cart"
              style={{ minHeight: '48px', height: '48px', fontSize: '15px', fontWeight: '700' }}
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="btn btn-buy-now"
              style={{ minHeight: '48px', height: '48px', fontSize: '15px', fontWeight: '800' }}
            >
              <Zap size={18} fill="#ffffff" /> Buy Now
            </button>
          </div>
        </div>

        {/* =========================================================================
           COLUMN 3: Sticky Buy Box (Dedicated Right Box on Desktop ≥1200px)
           ========================================================================= */}
        <div className="pdp-buybox-column desktop-buybox-only">
          <div className="pdp-buybox-card pdp-buybox-sticky">
            
            {/* Price Summary */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                Total Payable Price
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-price)' }}>
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentMrp > currentPrice && (
                  <>
                    <span style={{ fontSize: '14px', color: 'var(--text-strikethrough)', textDecoration: 'line-through' }}>
                      ₹{currentMrp.toLocaleString('en-IN')}
                    </span>
                    <span className="badge-discount" style={{ fontSize: '13px', fontWeight: '800' }}>
                      {currentDiscount}% OFF
                    </span>
                  </>
                )}
              </div>
              {currentSavings > 0 && (
                <div style={{ fontSize: '12px', color: 'var(--savings-green)', fontWeight: '700', marginTop: '2px' }}>
                  You save ₹{currentSavings.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            {/* In Stock & Delivery Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--savings-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> In Stock ({product.stockCount || 14} units left)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Pin: <strong>{activePincode || '560001'}</strong>
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={13} color="var(--primary-600)" />
                <span>{product.deliveryDays === 1 ? 'Lightning Fast Next-Day Delivery' : 'Standard 2-Day Delivery'}</span>
              </div>
            </div>

            {/* Primary Purchasing CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-luxury-black"
                style={{
                  width: '100%',
                  height: '48px',
                  minHeight: '48px',
                  fontSize: '14.5px',
                  fontWeight: '800',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <ShoppingCart size={17} /> Add to Bag
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                style={{
                  width: '100%',
                  height: '48px',
                  minHeight: '48px',
                  fontSize: '14.5px',
                  fontWeight: '800',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  color: '#FFFFFF',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Zap size={17} fill="#ffffff" /> Instant Checkout
              </button>
            </div>

            {/* Bank Offers Snippet */}
            {product.offers && product.offers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px dashed var(--border-subtle)', paddingTop: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Tag size={13} color="var(--savings-green)" /> Top Offers on this Item
                </div>
                {product.offers.slice(0, 2).map((off, idx) => (
                  <Link
                    key={idx}
                    to={`/offers/${off.code ? off.code.toLowerCase() : 'deal'}`}
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.35',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '4px',
                      textDecoration: 'none'
                    }}
                  >
                    <span style={{ color: 'var(--savings-green)', fontWeight: '700' }}>•</span>
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>{off.title}:</strong> {off.desc.slice(0, 52)}...{' '}
                      <span style={{ color: 'var(--primary-600)', fontWeight: '700' }}>T&C</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Trust Assurances */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <Shield size={16} color="var(--primary-600)" />
                <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)' }}>100% Genuine</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <RotateCcw size={16} color="var(--primary-600)" />
                <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)' }}>7-Day Returns</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <Truck size={16} color="var(--savings-green)" />
                <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)' }}>Free Delivery</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Avero AI Smart Advisor & Stylist Widget */}
      <AiProductAdvisor product={product} />

      {/* 1. 🔥 Frequently Bought Together (FP-Growth & Apriori Top Association Duo) */}
      <FrequentlyBoughtTogether mainProduct={product} comboData={smartCombos} />

      {/* 2. 🛒 More Smart Combos (Alternative Duos & 3-Item Complete Suites) */}
      <MoreSmartCombos comboData={smartCombos} />

      {/* Community Questions & Answers Section */}
      <ProductQnASection product={product} />

      {/* =========================================================================
         3. 🔗 RELATED & COMPATIBLE PRODUCTS (Jaccard & Cosine Vector Similarity)
         ========================================================================= */}
      {similarProducts.length > 0 && (
        <section style={{ marginTop: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={18} color="#6366F1" /> Related & Compatible Products
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Ranked with Jaccard & Cosine Attribute Similarity Match
              </div>
            </div>
            <Link
              to={`/product/${product.id}/similar`}
              style={{ fontSize: '13px', color: 'var(--primary-600)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              View All ({similarProducts.length + 8}) <ChevronRight size={15} />
            </Link>
          </div>

          {/* Desktop 5-Column Grid */}
          <div className="product-grid-5col">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
         RECOMMENDED PRODUCTS (Flipkart Style 5 Cards Desktop & Tabs)
         ========================================================================= */}
      {activeRecommendedList.length > 0 && (
        <section style={{ marginTop: '40px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                Recommended For You
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Based on your shopping trends and interests
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Recommendation Category Tabs */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }} className="no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveRecTab('RELATED')}
                  className={`pdp-pill-btn ${activeRecTab === 'RELATED' ? 'active' : ''}`}
                  style={{ height: '36px', minHeight: '36px', padding: '0 14px', fontSize: '12px' }}
                >
                  <Sparkles size={13} /> Related
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRecTab('TRENDING')}
                  className={`pdp-pill-btn ${activeRecTab === 'TRENDING' ? 'active' : ''}`}
                  style={{ height: '36px', minHeight: '36px', padding: '0 14px', fontSize: '12px' }}
                >
                  <TrendingUp size={13} /> Trending
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRecTab('BESTSELLER')}
                  className={`pdp-pill-btn ${activeRecTab === 'BESTSELLER' ? 'active' : ''}`}
                  style={{ height: '36px', minHeight: '36px', padding: '0 14px', fontSize: '12px' }}
                >
                  <Award size={13} /> Best Sellers
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRecTab('RECENT')}
                  className={`pdp-pill-btn ${activeRecTab === 'RECENT' ? 'active' : ''}`}
                  style={{ height: '36px', minHeight: '36px', padding: '0 14px', fontSize: '12px' }}
                >
                  <Clock size={13} /> Recently Viewed
                </button>
              </div>

              {/* Explore All Link Aligned Right */}
              <Link
                to={`/product/${product.id}/recommended`}
                style={{ fontSize: '13px', color: 'var(--primary-600)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}
              >
                Explore All <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          {/* Desktop 5-Column Grid */}
          <div className="product-grid-5col">
            {activeRecommendedList.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
         STICKY MOBILE BOTTOM CTA BAR (Fixed, Safe Area, Add to Cart & Buy Now)
         ========================================================================= */}
      <div
        className="mobile-sticky-pdp-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '62px',
          backgroundColor: '#ffffff',
          boxShadow: '0 -4px 18px rgba(0, 0, 0, 0.12)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 12px',
          borderTop: '1px solid var(--border-subtle)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)'
        }}
      >
        <button
          type="button"
          onClick={handleAddToCart}
          className="btn btn-luxury-black"
          style={{
            flex: 1,
            height: '46px',
            minHeight: '46px',
            fontSize: '13.5px',
            fontWeight: '800',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <ShoppingCart size={16} /> Add to Bag
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          style={{
            flex: 1.2,
            height: '46px',
            minHeight: '46px',
            fontSize: '13.5px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
            cursor: 'pointer'
          }}
        >
          <Zap size={16} fill="#ffffff" /> Instant Buy
        </button>
      </div>

      {/* Responsive Breakpoint Styles */}
      <style>{`
        @media (min-width: 1200px) {
          .desktop-buybox-only {
            display: block !important;
          }
          .tablet-cta-row {
            display: none !important;
          }
          .mobile-sticky-pdp-bar {
            display: none !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1199px) {
          .desktop-buybox-only {
            display: none !important;
          }
          .tablet-cta-row {
            display: grid !important;
          }
          .mobile-sticky-pdp-bar {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .pdp-page-container {
            padding-bottom: 74px !important;
          }
          .desktop-buybox-only {
            display: none !important;
          }
          .tablet-cta-row {
            display: none !important;
          }
          .mobile-sticky-pdp-bar {
            display: flex !important;
          }
        }
      `}</style>

      {/* Modals */}
      <PriceAlertModal
        product={product}
        isOpen={isPriceAlertOpen}
        onClose={() => setIsPriceAlertOpen(false)}
      />

      <ReviewModalWithMedia
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}
