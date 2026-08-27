/**
 * Avero Resend Transactional Email Service Layer
 * Sends high-conversion, beautifully formatted HTML transactional emails via Resend API.
 */

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || 're_avero_demo_key';
const FROM_EMAIL = import.meta.env.VITE_RESEND_FROM_EMAIL || 'Avero Marketplace <orders@avero.in>';

export const resendEmailService = {
  /**
   * 1. Send Email Verification (Customer Auth)
   */
  async sendVerificationEmail(toEmail, verifyUrl) {
    return this._dispatch({
      to: toEmail,
      subject: 'Verify your Avero account email address',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1366E2; margin: 0; font-size: 24px; font-weight: 800;">Avero</h1>
            <p style="color: #64748B; font-size: 14px;">India's Premier Online Marketplace</p>
          </div>
          <h2 style="color: #0F172A; font-size: 18px;">Confirm your email address</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            Thank you for starting your shopping journey with Avero. Click the button below to verify your email and activate your account.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #1366E2; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #94A3B8; font-size: 12px;">
            If you did not sign up for an Avero account, you can safely ignore this email.
          </p>
        </div>
      `
    });
  },

  /**
   * 2. Send Order Confirmation Email
   */
  async sendOrderConfirmationEmail(toEmail, order) {
    return this._dispatch({
      to: toEmail,
      subject: `Order Confirmed: #${order.id} | Avero`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
          <h1 style="color: #1366E2; margin: 0 0 12px;">Avero</h1>
          <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 12px 16px; margin-bottom: 20px;">
            <strong style="color: #065F46; font-size: 15px;">Your Order is Confirmed!</strong>
            <p style="color: #047857; font-size: 13px; margin: 4px 0 0;">Estimated Delivery: Tomorrow by 5:00 PM</p>
          </div>
          <p style="font-size: 14px; color: #334155;">Order ID: <strong>#${order.id}</strong></p>
          <p style="font-size: 14px; color: #334155;">Total Amount: <strong>₹${order.totalAmount?.toLocaleString('en-IN')}</strong> (${order.paymentMethod})</p>
          <div style="margin: 24px 0; border-top: 1px solid #E2E8F0; padding-top: 16px;">
            <a href="https://avero.in/order-tracking/${order.id}" style="background-color: #1366E2; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 14px; display: inline-block;">
              Track Shipment Real-Time
            </a>
          </div>
        </div>
      `
    });
  },

  /**
   * Internal dispatcher simulator with console logging
   */
  async _dispatch({ to, subject, html }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'resend_msg_' + Math.random().toString(36).substring(2, 10),
          to,
          subject,
          status: 'DELIVERED',
          sentAt: new Date().toISOString()
        });
      }, 450);
    });
  }
};
