import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Common Global Shell Components
import ScrollToTop from './components/common/ScrollToTop';
import DesktopHeader from './components/navigation/DesktopHeader';
import MobileHeader from './components/navigation/MobileHeader';
import MobileBottomNav from './components/navigation/MobileBottomNav';
import MobileNavigationDrawer from './components/navigation/MobileNavigationDrawer';

// Global Overlays & Modals
import AuthModal from './components/common/AuthModal';
import ProfileSetupWizardModal from './components/auth/ProfileSetupWizardModal';
import LocationModal from './components/common/LocationModal';
import AddressModal from './components/common/AddressModal';
import SearchExperienceModal from './components/search/SearchExperienceModal';
import Toast from './components/common/Toast';
import CompareDrawer from './components/common/CompareDrawer';
import AiShoppingBot from './components/common/AiShoppingBot';
import SplashScreen from './components/common/SplashScreen';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';

// Customer Panel Pages
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductComparePage from './pages/ProductComparePage';
import FlashDealsPage from './pages/FlashDealsPage';
import ProductReviewsPage from './pages/ProductReviewsPage';
import ProductSpecsPage from './pages/ProductSpecsPage';
import ProductQuestionsPage from './pages/ProductQuestionsPage.jsx';
import SimilarProductsPage from './pages/SimilarProductsPage.jsx';
import RecommendedProductsPage from './pages/RecommendedProductsPage.jsx';
import SellerProfilePage from './pages/SellerProfilePage';
import BrandPage from './pages/BrandPage';
import BrandsDirectoryPage from './pages/BrandsDirectoryPage';
import OfferDetailsPage from './pages/OfferDetailsPage';
import CategoriesPage from './pages/CategoriesPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutFlow from './pages/CheckoutFlow';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersListPage from './pages/OrdersListPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AccountPage from './pages/AccountPage';
import EditProfilePage from './pages/EditProfilePage';
import CouponsVouchersPage from './pages/CouponsVouchersPage';

// Seller Panel (Vendor) Layout & Pages
import SellerLayout from './layouts/SellerLayout';
import SellerDashboardView from './pages/seller/SellerDashboardView';
import SellerAuth from './pages/seller/SellerAuth';
import SellerProducts from './pages/seller/SellerProducts';
import SellerBulkUpload from './pages/seller/SellerBulkUpload';
import SellerAdCampaigns from './pages/seller/SellerAdCampaigns';
import SellerInventory from './pages/seller/SellerInventory';
import SellerOrders from './pages/seller/SellerOrders';
import SellerReturns from './pages/seller/SellerReturns';
import SellerCoupons from './pages/seller/SellerCoupons';
import SellerSettlements from './pages/seller/SellerSettlements';
import SellerReviewsQA from './pages/seller/SellerReviewsQA';
import SellerAnalytics from './pages/seller/SellerAnalytics';
import SellerIntelligencePage from './pages/seller/SellerIntelligencePage';
import SellerSettings from './pages/seller/SellerSettings';
import BecomeSellerPage from './pages/seller/BecomeSellerPage';

// Footer Policy & Help Pages
import AboutUsPage from './pages/footer/AboutUsPage';
import ContactUsPage from './pages/footer/ContactUsPage';
import HelpCenterPage from './pages/footer/HelpCenterPage';
import PaymentsPricingPage from './pages/footer/PaymentsPricingPage';
import ShippingTrackingHelpPage from './pages/footer/ShippingTrackingHelpPage';
import CancellationsReturnsPage from './pages/footer/CancellationsReturnsPage';
import TermsOfUsePage from './pages/footer/TermsOfUsePage';
import PrivacyPolicyPage from './pages/footer/PrivacyPolicyPage';
import GrievanceRedressalPage from './pages/footer/GrievanceRedressalPage';
import EprCompliancePage from './pages/footer/EprCompliancePage';
import LoginPage from './pages/auth/LoginPage';

// Delivery Partner Fleet Layout & Pages
import DeliveryAuth from './pages/delivery/DeliveryAuth';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

// Super Admin Panel Layout & Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardView from './pages/admin/AdminDashboardView';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSellerApprovals from './pages/admin/AdminSellerApprovals';
import AdminProductModeration from './pages/admin/AdminProductModeration';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrdersControl from './pages/admin/AdminOrdersControl';
import AdminPayments from './pages/admin/AdminPayments';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBanners from './pages/admin/AdminBanners';
import AdminDelivery from './pages/admin/AdminDelivery';
import AdminReviewsModeration from './pages/admin/AdminReviewsModeration';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminReports from './pages/admin/AdminReports';
import AdminIntelligencePage from './pages/admin/AdminIntelligencePage';
import AdminSettings from './pages/admin/AdminSettings';

// RBAC Route Guards & Gates
import ProtectedRoute from './components/auth/ProtectedRoute';
import SellerRoute from './components/auth/SellerRoute';
import AdminRoute from './components/auth/AdminRoute';
import DeliveryRoute from './components/auth/DeliveryRoute';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';

export default function App() {
  const { isProfileWizardOpen, setIsProfileWizardOpen } = useApp();
  const location = useLocation();
  const isDeliveryRoute = location.pathname.startsWith('/delivery');
  const isSellerPortalRoute = location.pathname.startsWith('/seller');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />

      {/* RENDER DELIVERY PARTNER PORTAL IF ON /delivery/* */}
      {isDeliveryRoute ? (
        <Routes>
          <Route path="/delivery/auth" element={<DeliveryAuth />} />
          <Route
            path="/delivery"
            element={
              <DeliveryRoute>
                <DeliveryDashboard />
              </DeliveryRoute>
            }
          />
          <Route
            path="/delivery/:tab"
            element={
              <DeliveryRoute>
                <DeliveryDashboard />
              </DeliveryRoute>
            }
          />
          <Route path="/delivery/*" element={<Navigate to="/delivery" replace />} />
        </Routes>
      ) : isSellerPortalRoute ? (
        <SellerRoute>
          <Routes>
            <Route path="/seller" element={<SellerDashboardView />} />
            <Route path="/seller/dashboard" element={<SellerDashboardView />} />
            <Route path="/seller/auth" element={<SellerAuth />} />
            <Route path="/seller/products" element={<SellerProducts />} />
            <Route path="/seller/products/add" element={<SellerProducts isAddMode={true} />} />
            <Route path="/seller/products/new" element={<SellerProducts isAddMode={true} />} />
            <Route path="/seller/inventory" element={<SellerInventory />} />
            <Route path="/seller/bulk-upload" element={<SellerBulkUpload />} />
            <Route path="/seller/ads" element={<SellerAdCampaigns />} />
            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/seller/returns" element={<SellerReturns />} />
            <Route path="/seller/coupons" element={<SellerCoupons />} />
            <Route path="/seller/settlements" element={<SellerSettlements />} />
            <Route path="/seller/payouts" element={<SellerSettlements />} />
            <Route path="/seller/reviews" element={<SellerReviewsQA />} />
            <Route path="/seller/analytics" element={<SellerAnalytics />} />
            <Route path="/seller/intelligence" element={<SellerIntelligencePage />} />
            <Route path="/seller/settings" element={<SellerSettings />} />
            <Route path="/seller/*" element={<Navigate to="/seller" replace />} />
          </Routes>
        </SellerRoute>
      ) : isAdminRoute ? (
        /* RENDER SUPER ADMIN PANEL IF ON /admin/* */
        <AdminRoute>
          <Routes>
            <Route path="/admin" element={<AdminDashboardView />} />
            <Route path="/admin/dashboard" element={<AdminDashboardView />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/customers" element={<AdminUsers />} />
            <Route path="/admin/sellers" element={<AdminSellerApprovals />} />
            <Route path="/admin/approvals" element={<AdminSellerApprovals />} />
            <Route path="/admin/products" element={<AdminProductModeration />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrdersControl />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/delivery" element={<AdminDelivery />} />
            <Route path="/admin/reviews" element={<AdminReviewsModeration />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/intelligence" element={<AdminIntelligencePage />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </AdminRoute>
      ) : (
        /* RENDER CUSTOMER (BUYER) MARKETPLACE */
        <>
          <div className="desktop-header-wrap">
            <DesktopHeader />
          </div>
          <div className="mobile-header-wrap">
            <MobileHeader />
          </div>

          <main className="app-main" style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/search" element={<ProductListingPage />} />
              <Route path="/catalog" element={<ProductListingPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/product/:id/reviews" element={<ProductReviewsPage />} />
              <Route path="/product/:id/specifications" element={<ProductSpecsPage />} />
              <Route path="/product/:id/questions" element={<ProductQuestionsPage />} />
              <Route path="/product/:id/similar" element={<SimilarProductsPage />} />
              <Route path="/product/:id/recommended" element={<RecommendedProductsPage />} />
              <Route path="/seller/:sellerId" element={<SellerProfilePage />} />
              <Route path="/store/:sellerId" element={<SellerProfilePage />} />
              <Route path="/brand/:brandName" element={<BrandPage />} />
              <Route path="/brands" element={<BrandsDirectoryPage />} />
              <Route path="/offers/:offerId" element={<OfferDetailsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/compare" element={<ProductComparePage />} />
              <Route path="/deals" element={<FlashDealsPage />} />
              <Route path="/flash-deals" element={<FlashDealsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutFlow />} />
              <Route path="/order/success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/orders" element={<OrdersListPage />} />
              <Route path="/orders/:id" element={<OrderTrackingPage />} />
              <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/edit" element={<EditProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/coupons" element={<CouponsVouchersPage />} />
              <Route path="/account/coupons" element={<CouponsVouchersPage />} />
              <Route path="/become-seller" element={<BecomeSellerPage />} />
              <Route path="/seller/register" element={<BecomeSellerPage />} />
              <Route path="/seller/onboarding" element={<BecomeSellerPage />} />

              {/* Customer Authentication & RBAC Gates */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<LoginPage />} />
              <Route path="/auth" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage requiredRole="admin" />} />

              {/* Policy & Help Routes */}
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/faq" element={<HelpCenterPage />} />
              <Route path="/payments" element={<PaymentsPricingPage />} />
              <Route path="/help/payments" element={<PaymentsPricingPage />} />
              <Route path="/shipping" element={<ShippingTrackingHelpPage />} />
              <Route path="/help/shipping" element={<ShippingTrackingHelpPage />} />
              <Route path="/cancellations" element={<CancellationsReturnsPage />} />
              <Route path="/returns" element={<CancellationsReturnsPage />} />
              <Route path="/help/cancellations" element={<CancellationsReturnsPage />} />
              <Route path="/terms" element={<TermsOfUsePage />} />
              <Route path="/policy/terms" element={<TermsOfUsePage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/policy/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/grievance" element={<GrievanceRedressalPage />} />
              <Route path="/policy/grievance" element={<GrievanceRedressalPage />} />
              <Route path="/epr" element={<EprCompliancePage />} />
              <Route path="/policy/epr" element={<EprCompliancePage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Desktop Footer */}
          <footer className="desktop-footer" style={{
            backgroundColor: '#0F172A',
            color: '#94A3B8',
            borderTop: '1px solid #1E293B',
            marginTop: 'auto',
            padding: '40px 0 24px'
          }}>
            <div className="container">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '30px',
                marginBottom: '32px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <img src="/logo.png" alt="Avero" className="brand-logo-img" style={{ width: '32px', height: '32px' }} />
                    <span className="brand-name-gradient-dark" style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.4px' }}>Avero</span>
                  </div>
                  <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#94A3B8' }}>
                    India's premier high-speed marketplace. Delivering 100% genuine products from top brands and verified sellers across 28,000+ pincodes.
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    ABOUT
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <Link to="/contact" style={{ color: '#94A3B8' }}>Contact Us</Link>
                    <Link to="/about" style={{ color: '#94A3B8' }}>About Avero</Link>
                    <Link to="/become-seller" style={{ color: '#94A3B8' }}>Sell on Avero</Link>
                    <Link to="/delivery/auth" style={{ color: '#94A3B8' }}>Delivery Partner Portal</Link>
                    <Link to="/admin" style={{ color: '#94A3B8' }}>Admin Login (Governance)</Link>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    HELP & SUPPORT
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <Link to="/payments" style={{ color: '#94A3B8' }}>Payments & Pricing</Link>
                    <Link to="/shipping" style={{ color: '#94A3B8' }}>Shipping & Tracking</Link>
                    <Link to="/cancellations" style={{ color: '#94A3B8' }}>Cancellations & Returns</Link>
                    <Link to="/help" style={{ color: '#94A3B8' }}>FAQ & Help Center</Link>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    CONSUMER POLICY
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <Link to="/terms" style={{ color: '#94A3B8' }}>Terms of Use</Link>
                    <Link to="/privacy" style={{ color: '#94A3B8' }}>Security & Privacy</Link>
                    <Link to="/grievance" style={{ color: '#94A3B8' }}>Grievance Redressal</Link>
                    <Link to="/epr" style={{ color: '#94A3B8' }}>EPR Compliance</Link>
                  </div>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid #1E293B',
                paddingTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '12px'
              }}>
                <div>
                  © 2026 Avero Internet Private Limited. All rights reserved.
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>256-Bit SSL Encrypted</span>
                  <span>100% Genuine Certified</span>
                </div>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Navigation (Strictly 4 items: Home | Categories | Account | Cart) */}
          <div className="mobile-bottom-nav-wrap">
            <MobileBottomNav />
          </div>
        </>
      )}

      {/* Global Modals & Toasts */}
      <SplashScreen />
      <PwaInstallPrompt />
      <AuthModal />
      <ProfileSetupWizardModal isOpen={isProfileWizardOpen} onClose={() => setIsProfileWizardOpen(false)} />
      <LocationModal />
      <AddressModal />
      <SearchExperienceModal />
      <Toast />
      <CompareDrawer />
      <AiShoppingBot />
      <MobileNavigationDrawer />

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (min-width: 1024px) {
          .mobile-header-wrap {
            display: none !important;
          }
          .mobile-bottom-nav-wrap {
            display: none !important;
          }
          .desktop-header-wrap {
            display: block !important;
          }
          .desktop-footer {
            display: block !important;
          }
        }
        @media (max-width: 1023px) {
          .desktop-header-wrap {
            display: none !important;
          }
          .desktop-footer {
            display: none !important;
          }
          .mobile-header-wrap {
            display: block !important;
          }
          .mobile-bottom-nav-wrap {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
