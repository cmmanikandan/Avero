/**
 * Avero AI Service Layer
 * Ultra-fast inference powered by Groq (GPT-OSS-120B / Qwen 27B) with fallback.
 */

const GROQ_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';

// Helper to strip thinking tokens and convert raw markdown tables into mobile-friendly bullet points
function cleanAiResponse(text) {
  if (!text) return '';
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Convert any markdown pipe tables into clear mobile bullets
  if (cleaned.includes('|')) {
    const lines = cleaned.split('\n');
    const resultLines = [];
    let headers = [];
    let isTable = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        const cells = line
          .split('|')
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
          .map(c => c.trim().replace(/\*\*/g, ''));

        // Skip divider row |---|---|
        if (cells.every(c => /^[-:\s]+$/.test(c))) {
          continue;
        }

        if (!isTable) {
          isTable = true;
          headers = cells;
          resultLines.push(`📊 **${cells.join(' vs ')}**\n`);
        } else {
          const rowTitle = cells[0];
          const items = cells.slice(1);
          if (items.length > 0 && headers.length > 1) {
            const formattedRow = items
              .map((val, i) => `**${headers[i + 1] || 'Option'}**: ${val}`)
              .join(' • ');
            resultLines.push(`• **${rowTitle}**: ${formattedRow}`);
          } else {
            resultLines.push(`• ${cells.join(' - ')}`);
          }
        }
      } else {
        isTable = false;
        resultLines.push(rawLine);
      }
    }
    cleaned = resultLines.join('\n');
  }

  return cleaned.trim();
}

export const aiService = {
  /**
   * Send chat query to Groq LLM with context & prompt engineering
   */
  async askShoppingAssistant({ query, context = {}, history = [] }) {
    if (GROQ_API_KEY) {
      try {
        const systemPrompt = `You are Avero AI, a friendly, concise e-commerce expert for Avero (India's premier marketplace).
Strict Rules:
- DO NOT generate markdown tables (no | table | pipes).
- ALWAYS format comparisons and advice using clean bullet points (•) and bold titles (**Product**).
- Provide exact INR prices with ₹.
- Keep responses compact, easy to read on mobile chat bubbles, under 140 words.`;

        const messages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-4).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          { role: 'user', content: query }
        ];

        // Try primary model: openai/gpt-oss-120b, fallback to openai/gpt-oss-20b or qwen/qwen3.6-27b
        const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b'];

        for (const model of models) {
          try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model,
                messages,
                temperature: 0.7,
                max_tokens: 380
              })
            });

            if (res.ok) {
              const data = await res.json();
              const content = data.choices?.[0]?.message?.content;
              const cleaned = cleanAiResponse(content);
              if (cleaned) return cleaned;
            }
          } catch (modelErr) {
            console.warn(`Groq model ${model} failed, trying next:`, modelErr);
          }
        }
      } catch (err) {
        console.warn('Groq AI API call failed, using local telemetry fallback:', err);
      }
    }

    // Fallback response generator
    return aiService.generateLocalResponse(query, context);
  },

  /**
   * AI Auto-Filler Engine: Extracts complete e-commerce catalog specifications tailored by category
   */
  async generateProductDetails(productName) {
    if (!productName || !productName.trim()) return null;

    if (GROQ_API_KEY) {
      try {
        const systemPrompt = `You are an AI catalog assistant for Indian e-commerce marketplace Avero.
Given a product name, detect its category and generate realistic Indian market specs. Return ONLY a valid JSON object with NO surrounding markdown or backticks.
Keys:
{
  "title": "Clean full product title with color/variant",
  "brand": "Brand name (e.g. Sony, Apple, Samsung, Nothing, Nike, Asus, OnePlus)",
  "category": "mobiles" | "electronics" | "audio" | "footwear" | "laptops" | "appliances" | "fashion" | "beauty" | "home",
  "subcategory": "Category descriptor e.g. Soundbar, Flagship ANC Headphones, Gaming Laptop, Road Running Shoes",
  "price": integer price in INR (e.g. 44999),
  "mrp": integer MRP in INR (e.g. 49999),
  "tag": "Bestseller" | "Top Rated" | "Trending" | "New Launch",
  "sku": "Unique short SKU code e.g. AVR-SMG-HWQ800A",
  "highlightsText": "3-4 concise bullet points separated by newline",
  "specifications": {
    // 4 to 6 CATEGORY-TAILORED key-value pairs appropriate for this item:
    // For audio/soundbars: "Sound Output": "340W", "Channel Configuration": "3.1.2 Dolby Atmos", "Connectivity": "HDMI eARC, Optical, Bluetooth 5.3", "Subwoofer": "Wireless Active Subwoofer", "Warranty": "2 Years Brand Warranty"
    // For mobiles: "Processor": "Snapdragon 8 Gen 3", "RAM & Storage": "12 GB / 256 GB", "Display": "6.7\" 120Hz LTPO AMOLED", "Camera": "50MP + 50MP + 12MP", "Battery": "5000 mAh 80W Fast Charge", "Warranty": "1 Year Brand Warranty"
    // For laptops: "Processor": "Intel Core Ultra 9", "Graphics": "NVIDIA RTX 4070 8GB", "RAM & Storage": "32 GB DDR5 / 1 TB SSD", "Display": "16\" OLED 240Hz", "Weight": "1.85 kg", "Warranty": "2 Years Onsite Warranty"
    // For footwear: "UK Sizes": "UK 6, 7, 8, 9, 10, 11", "Upper Material": "Breathable Engineered Mesh", "Sole Material": "Zoom Air Cushion Rubber", "Ideal For": "Road Running & Training", "Warranty": "3 Months Brand Warranty"
    // For appliances: "Capacity": "1.5 Ton / 300 Litres", "Energy Rating": "5 Star Inverter", "Power": "1400W", "Warranty": "10 Years on Compressor"
  }
}`;

        const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b'];
        for (const model of models) {
          try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: `Product Name: ${productName}` }
                ],
                temperature: 0.2,
                max_tokens: 650
              })
            });

            if (res.ok) {
              const data = await res.json();
              const raw = cleanAiResponse(data.choices?.[0]?.message?.content);
              const jsonMatch = raw.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                parsed.price = Number(parsed.price) || 999;
                parsed.mrp = Number(parsed.mrp) || Math.round(parsed.price * 1.25);
                if (Array.isArray(parsed.highlights)) {
                  parsed.highlightsText = parsed.highlights.join('\n');
                } else if (typeof parsed.highlights === 'string') {
                  parsed.highlightsText = parsed.highlights;
                }
                return parsed;
              }
            }
          } catch (modelErr) {
            console.warn(`Groq model ${model} failed in generateProductDetails:`, modelErr);
          }
        }
      } catch (err) {
        console.warn('AI product generation failed, using fallback:', err);
      }
    }

    // Local heuristic fallback
    return {
      title: productName.charAt(0).toUpperCase() + productName.slice(1),
      brand: productName.split(' ')[0] || 'Avero Select',
      category: 'audio',
      subcategory: 'Sound Systems',
      price: 29990,
      mrp: 34990,
      tag: 'Bestseller',
      sku: `AVR-${productName.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      highlightsText: 'High fidelity studio acoustic architecture\nWireless connectivity with seamless low-latency sync\n100% Genuine Certified on Avero',
      specifications: {
        'Sound Output': '300W RMS',
        'Channel Configuration': '3.1 Channel Dolby Atmos',
        'Connectivity': 'HDMI eARC, Optical, Bluetooth 5.3',
        'Warranty': '1 Year Brand Manufacturer Warranty'
      }
    };
  },

  /**
   * Ask product-specific question on Product Detail Page (PDP)
   */
  async askProductQuestion({ product, question }) {
    if (GROQ_API_KEY) {
      try {
        const prompt = `You are an expert product advisor on Avero Marketplace for: "${product.title}" (${product.category}, ₹${product.price}).
Highlights: ${product.highlights?.join(', ') || 'High quality build'}.
Attributes: ${JSON.stringify(product.attributes || {})}.
Answer the customer's question: "${question}".
Be clear, accurate, concise (under 100 words), and provide helpful buying advice.`;

        const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.6-27b'];
        for (const model of models) {
          try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.6,
                max_tokens: 280
              })
            });

            if (res.ok) {
              const data = await res.json();
              const content = data.choices?.[0]?.message?.content;
              const cleaned = cleanAiResponse(content);
              if (cleaned) return cleaned;
            }
          } catch (mErr) {
            console.warn(`Groq product model ${model} failed:`, mErr);
          }
        }
      } catch (err) {
        console.warn('Product AI API failed, using fallback:', err);
      }
    }

    return `✨ **Avero AI Analysis for ${product.title}**: Verified for genuine quality and high endurance. Backed by 1-Year Brand Warranty and 7-day hassle-free replacement on Avero.`;
  },

  /**
   * Local Smart Response Fallback
   */
  generateLocalResponse(query, context = {}) {
    const q = query.toLowerCase();
    if (q.includes('track') || q.includes('order') || q.includes('status')) {
      const latestOrder = context.orders?.[0];
      if (latestOrder) {
        return `📦 Order #${latestOrder.id} is **${latestOrder.status}**. Delivery expected **Tomorrow by 5 PM**. Doorstep OTP: **${latestOrder.courier?.otp || '7842'}**.`;
      }
      return `You don't have any active orders right now. Explore our catalog to place your first order!`;
    } else if (q.includes('compare') || (q.includes('nothing') && q.includes('apple'))) {
      return `📱 **Nothing Phone (2) vs Apple iPhone 15 Pro**:\n• **Design**: Nothing has unique transparent Glyph LED lighting; iPhone features aerospace titanium.\n• **Performance**: Nothing runs Snapdragon 8+ Gen 1; iPhone runs high-end A17 Pro.\n• **Price**: Nothing starts at **₹36,999** (Value King), whereas iPhone 15 Pro starts at **₹1,27,990** (Flagship).`;
    } else if (q.includes('phone') || q.includes('mobile') || q.includes('5g')) {
      return `📱 **Top Recommended 5G Smartphones**:\n• **Nothing Phone (2)** (₹36,999) - Glyph Interface & Snapdragon 8+ Gen 1\n• **Apple iPhone 15 Pro** (₹1,27,990) - Aerospace Grade Titanium\n• **OnePlus 12 5G** (₹64,999) - 100W SuperVOOC & Snapdragon 8 Gen 3.`;
    } else if (q.includes('return') || q.includes('refund')) {
      return `↩️ All products on Avero come with a **7-Day Instant Replacement & Return Guarantee** with free doorstep pickup.`;
    }
    return `✨ I am your Avero AI Assistant. Ask me about smartphones, laptops, flash deals, order tracking, or comparisons!`;
  }
};
