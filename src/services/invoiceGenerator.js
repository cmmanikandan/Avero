/**
 * Generates and triggers download / print of official Avero Tax Invoice
 */
export function generateTaxInvoice(order) {
  if (!order) return;

  const invoiceNumber = `INV-${order.id.replace(/\D/g, '').slice(-8) || Math.floor(10000000 + Math.random() * 90000000)}`;
  const invoiceDate = order.date === 'Today' ? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : order.date;
  const address = order.deliveryAddress || {
    name: 'Customer',
    flat: 'Residential Address',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038'
  };

  const items = order.items && order.items.length > 0 ? order.items : [
    { title: 'Avero Marketplace Product', quantity: 1, price: order.totalAmount, variant: 'Standard' }
  ];

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxAmount = Math.round(subtotal * 0.18 / 1.18);
  const baseAmount = subtotal - taxAmount;

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Tax Invoice - ${order.id}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        body { padding: 40px; color: #1E293B; background: #FFFFFF; font-size: 13px; line-height: 1.5; }
        .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #E2E8F0; padding: 32px; border-radius: 8px; }
        .header-row { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1366E2; padding-bottom: 20px; margin-bottom: 24px; }
        .brand-title { font-size: 24px; font-weight: 800; color: #1366E2; letter-spacing: -0.5px; }
        .tax-badge { font-size: 14px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .section-title { font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .table th { background-color: #F8FAFC; text-align: left; padding: 10px 12px; font-size: 12px; font-weight: 700; color: #475569; border-bottom: 1px solid #CBD5E1; }
        .table td { padding: 12px; border-bottom: 1px solid #E2E8F0; font-size: 13px; }
        .text-right { text-align: right; }
        .total-box { margin-left: auto; width: 320px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin-bottom: 24px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
        .grand-total { font-size: 16px; font-weight: 800; color: #0F172A; border-top: 1px solid #CBD5E1; padding-top: 8px; margin-top: 6px; }
        .footer { font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px dashed #E2E8F0; padding-top: 16px; }
        .no-print { margin-bottom: 20px; text-align: right; }
        .btn { background: #1366E2; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        @media print { .no-print { display: none; } body { padding: 0; } .invoice-card { border: none; } }
      </style>
    </head>
    <body>
      <div class="no-print">
        <button class="btn" onclick="window.print()">Print / Save PDF</button>
      </div>
      <div class="invoice-card">
        <div class="header-row">
          <div>
            <div class="brand-title">Avero</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 2px;">India's Premier High-Speed Marketplace</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">GSTIN: 29AABCA9812K1ZT • CIN: U72900KA2026PTC109822</div>
          </div>
          <div class="text-right">
            <div class="tax-badge">TAX INVOICE</div>
            <div style="font-size: 12px; font-weight: 700; margin-top: 4px;">Invoice #: ${invoiceNumber}</div>
            <div style="font-size: 12px; color: #64748B;">Date: ${invoiceDate}</div>
            <div style="font-size: 12px; color: #64748B;">Order ID: ${order.id}</div>
          </div>
        </div>

        <div class="grid-2">
          <div>
            <div class="section-title">Billed & Shipped To</div>
            <strong style="font-size: 14px;">${address.name}</strong>
            <div style="color: #475569; margin-top: 4px;">
              ${address.flat}<br>
              ${address.area || ''}<br>
              ${address.city}, ${address.state} - ${address.pincode}
            </div>
            <div style="margin-top: 4px; color: #64748B;">State Code: 29 (Karnataka)</div>
          </div>
          <div>
            <div class="section-title">Seller & Order Details</div>
            <strong>${order.seller?.name || 'Avero Verified Retail Partners'}</strong>
            <div style="color: #475569; margin-top: 4px;">
              Payment Method: <strong>${order.paymentMethod || 'UPI / Prepaid'}</strong><br>
              Transaction Status: <span style="color: #166534; font-weight: 700;">Completed (₹${order.totalAmount?.toLocaleString('en-IN')})</span><br>
              Delivery Carrier: ${order.courier?.partner || 'BlueDart Express'} (${order.courier?.trackingNumber || 'BLR892104'})
            </div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Description</th>
              <th>Variant</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Rate</th>
              <th class="text-right">GST (18%)</th>
              <th class="text-right">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => {
              const itemTotal = item.price * item.quantity;
              const itemGst = Math.round(itemTotal * 0.18 / 1.18);
              const itemBase = itemTotal - itemGst;

              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <strong>${item.title}</strong>
                    <div style="font-size: 11px; color: #64748B;">HSN: 8517 • 100% Genuine Certified</div>
                  </td>
                  <td>${item.variant || 'Standard'}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">₹${Math.round(itemBase / item.quantity).toLocaleString('en-IN')}</td>
                  <td class="text-right">₹${itemGst.toLocaleString('en-IN')}</td>
                  <td class="text-right"><strong>₹${itemTotal.toLocaleString('en-IN')}</strong></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row">
            <span>Taxable Amount:</span>
            <span>₹${baseAmount.toLocaleString('en-IN')}</span>
          </div>
          <div class="total-row">
            <span>IGST / CGST+SGST (18%):</span>
            <span>₹${taxAmount.toLocaleString('en-IN')}</span>
          </div>
          <div class="total-row">
            <span>Shipping & Delivery:</span>
            <span style="color: #166534; font-weight: 700;">FREE</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Payable:</span>
            <span>₹${order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="footer">
          <p>This is a computer-generated tax invoice and does not require physical signature under the Information Technology Act, 2000.</p>
          <p style="margin-top: 4px;">Thank you for shopping with Avero! For returns, warranties, and queries visit avero.in/orders</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.focus();
  }
}
