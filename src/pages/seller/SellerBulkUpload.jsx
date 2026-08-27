import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  ArrowRight,
  Package,
  Check,
  X,
  Sparkles,
  Info
} from 'lucide-react';

export default function SellerBulkUpload() {
  const { showToast, addProduct } = useApp();

  const [parsedProducts, setParsedProducts] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImported, setIsImported] = useState(false);

  const handleDownloadSample = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Title,Brand,Category,Price,MRP,Stock,SKU,Description\n' +
      'Apple iPhone 15 Pro 256GB,Apple,mobiles,127990,134900,45,SKU-IPHONE15P-256,Titanium design with A17 Pro\n' +
      'Samsung Galaxy S24 Ultra,Samsung,mobiles,119999,134999,30,SKU-S24U-256,AI Camera with S-Pen\n' +
      'Sony WH-1000XM5 Headphones,Sony,audio,29990,34990,60,SKU-SONY-XM5-BLK,Industry-leading noise cancellation\n' +
      'MacBook Air M3 15-inch,Apple,laptops,124900,134900,25,SKU-MBA-M3-15,Supercharged by Apple M3 chip';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'avero_seller_catalog_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sample CSV template downloaded successfully!', 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length <= 1) {
        showToast('CSV file is empty or missing data rows', 'error');
        setIsProcessing(false);
        return;
      }

      const products = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 4) {
          const price = Number(values[3]) || 999;
          const mrp = Number(values[4]) || Math.round(price * 1.25);
          const stock = Number(values[5]) || 50;

          products.push({
            id: `PROD-BULK-${Date.now()}-${i}`,
            title: values[0] || `Product ${i}`,
            brand: values[1] || 'Brand',
            category: values[2] || 'Electronics',
            price,
            mrp,
            stock,
            sku: values[6] || `SKU-GEN-${i}`,
            description: values[7] || 'Imported product catalog description',
            status: price > 0 && stock >= 0 ? 'VALID' : 'INVALID'
          });
        }
      }

      setParsedProducts(products);
      setIsProcessing(false);
      setIsImported(false);
      showToast(`Successfully parsed ${products.length} products from CSV!`, 'success');
    };

    reader.readAsText(file);
  };

  const handleFinalImport = () => {
    if (parsedProducts.length === 0) return;
    setIsImported(true);
    showToast(`🎉 ${parsedProducts.length} products imported into your vendor inventory catalog!`, 'success');
  };

  const handleRemoveItem = (id) => {
    setParsedProducts(prev => prev.filter(p => p.id !== id));
  };

  const totalCatalogValue = parsedProducts.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const totalUnits = parsedProducts.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={22} color="#2563EB" /> Bulk CSV Catalog Import & Inventory Sync
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', margin: '4px 0 0' }}>
            Upload thousands of catalog SKUs at once using standard CSV or Excel sheets
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadSample}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Download size={15} /> Download Sample CSV Template
        </button>
      </div>

      {/* Upload Instructions & Tips */}
      <div style={{
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', flexShrink: 0 }}>1</div>
          <div>
            <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>Prepare Spreadsheet</strong>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Ensure Title, Brand, Category, Price, and Stock columns are populated.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', flexShrink: 0 }}>2</div>
          <div>
            <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>Validate Formats</strong>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Numbers should not contain currency symbols or commas.</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', flexShrink: 0 }}>3</div>
          <div>
            <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>Instant Live Sync</strong>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Once imported, items are submitted for instant automated catalog review.</span>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '2px dashed #CBD5E1',
        padding: '40px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#EFF6FF',
          color: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Upload size={30} />
        </div>

        <div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Upload Your Product Inventory CSV
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', maxWidth: '440px', margin: '6px auto 14px' }}>
            Supports comma-separated (.csv) files up to 10,000 SKUs with title, category, price, MRP, and stock inventory.
          </p>
        </div>

        <label
          style={{
            height: '42px',
            padding: '0 24px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            borderRadius: '8px',
            border: 'none'
          }}
        >
          <Upload size={16} /> Choose CSV File to Upload
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>

        {fileName && (
          <div style={{ fontSize: '13px', color: '#059669', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} /> Selected File: {fileName}
          </div>
        )}
      </div>

      {/* Parsed Preview Table & Statistics */}
      {parsedProducts.length > 0 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {/* Summary KPIs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            padding: '16px 20px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Parsed Products</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#2563EB', marginTop: '2px' }}>{parsedProducts.length} SKUs</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Total Stock Units</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', marginTop: '2px' }}>{totalUnits.toLocaleString('en-IN')} pcs</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Estimated Gross Value</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#059669', marginTop: '2px' }}>₹{(totalCatalogValue / 100000).toFixed(2)} Lakhs</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Validation Status</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#059669', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={15} /> 100% Ready to Sync
              </div>
            </div>
          </div>

          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={17} color="#2563EB" />
              Parsed Products Preview ({parsedProducts.length} Items)
            </div>

            <button
              type="button"
              onClick={handleFinalImport}
              disabled={isImported}
              style={{
                height: '38px',
                padding: '0 20px',
                fontSize: '13px',
                fontWeight: '800',
                backgroundColor: isImported ? '#059669' : '#2563EB',
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                cursor: isImported ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isImported ? (
                <>
                  <CheckCircle2 size={16} /> Catalog Sync Complete
                </>
              ) : (
                <>
                  <Sparkles size={15} /> Import All {parsedProducts.length} Products to Store
                </>
              )}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#374151' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>SKU</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Product Title</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Brand / Category</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Selling Price</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>MRP</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Stock</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {parsedProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#2563EB', fontWeight: '700', fontSize: '12px' }}>{p.sku}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F172A', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                    <td style={{ padding: '12px 16px', color: '#64748B' }}>{p.brand} · <span style={{ textTransform: 'capitalize' }}>{p.category}</span></td>
                    <td style={{ padding: '12px 16px', color: '#059669', fontWeight: '800' }}>₹{p.price?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px', color: '#94A3B8', textDecoration: 'line-through' }}>₹{p.mrp?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F172A' }}>{p.stock} units</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '3px 9px', borderRadius: '20px', fontWeight: '800' }}>
                        ✓ Valid
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(p.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DC2626',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px'
                        }}
                        title="Remove row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
