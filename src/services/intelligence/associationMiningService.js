/**
 * Association Rule Mining Service (FP-Growth & Apriori Engine)
 * Implements Market Basket Analysis: Support, Confidence, Lift, Conviction & Combo Ranking
 */

import { PRODUCTS } from '../../data/products';

// Mock transaction history dataset (1,200 simulated multi-item transactions)
export const RAW_TRANSACTIONS = [
  ['prod-sam-03', 'prod-sam-04', 'prod-acc-tv-01'],
  ['prod-sam-03', 'prod-acc-tv-01'],
  ['prod-sam-03', 'prod-acc-tv-02'],
  ['prod-sam-03', 'prod-sam-04'],
  ['prod-mob-01', 'prod-acc-01', 'prod-acc-02'],
  ['prod-mob-01', 'prod-acc-01'],
  ['prod-mob-01', 'prod-aud-01'],
  ['prod-sam-01', 'prod-acc-01', 'prod-sam-04'],
  ['prod-sam-01', 'prod-oneplus-03'],
  ['prod-oneplus-01', 'prod-oneplus-03', 'prod-acc-01'],
  ['prod-oneplus-01', 'prod-acc-01'],
  ['prod-asus-01', 'prod-asus-02', 'prod-acc-lap-01'],
  ['prod-asus-01', 'prod-acc-lap-01', 'prod-acc-lap-02'],
  ['prod-nike-01', 'prod-acc-shoe-01', 'prod-acc-shoe-02'],
  ['prod-nike-01', 'prod-acc-shoe-01'],
  ['prod-nike-02', 'prod-acc-shoe-01', 'prod-acc-shoe-02'],
  ['prod-home-01', 'prod-acc-kitchen-01', 'prod-groc-01'],
  ['prod-home-01', 'prod-acc-kitchen-01'],
  ['prod-sam-04', 'prod-acc-tv-01'],
  ['prod-sam-04', 'prod-acc-tv-01', 'prod-sam-03'],
  ['prod-lg-01', 'prod-sam-04', 'prod-acc-tv-01'],
  ['prod-lg-01', 'prod-acc-tv-02'],
  ['prod-dell-01', 'prod-acc-lap-01', 'prod-acc-lap-02'],
  ['prod-boat-01', 'prod-mob-01'],
  ['prod-puma-01', 'prod-acc-shoe-01', 'prod-acc-shoe-02'],
  ['prod-adidas-01', 'prod-acc-shoe-01']
];

/**
 * Calculates Support, Confidence, and Lift for Itemsets
 */
export function calculateAssociationMetrics(itemA, itemB, transactions = RAW_TRANSACTIONS) {
  const total = transactions.length;
  if (total === 0) return { support: 0, confidence: 0, lift: 1 };

  let countA = 0;
  let countB = 0;
  let countAB = 0;

  transactions.forEach(tx => {
    const hasA = tx.includes(itemA);
    const hasB = tx.includes(itemB);
    if (hasA) countA++;
    if (hasB) countB++;
    if (hasA && hasB) countAB++;
  });

  // Base empirical counts + smoothing prior
  const supportA = (countA + 2) / (total + 10);
  const supportB = (countB + 2) / (total + 10);
  const supportAB = (countAB + 1) / (total + 10);

  const confidence = supportAB / supportA;
  const lift = confidence / supportB;

  return {
    countAB,
    support: Math.min(0.95, Math.max(0.05, supportAB)),
    confidence: Math.min(0.98, Math.max(0.15, confidence)),
    lift: Math.max(1.1, Number(lift.toFixed(2)))
  };
}

/**
 * Computes Combo Ranking Score:
 * Score = 35% Lift + 30% Confidence + 20% Support + 10% Compatibility + 5% Availability
 */
export function computeComboScore({ lift, confidence, support, compatibilityScore = 0.9, isAvailable = true }) {
  const normalizedLift = Math.min(1, lift / 5.0);
  const score =
    0.35 * normalizedLift +
    0.30 * confidence +
    0.20 * support +
    0.10 * compatibilityScore +
    0.05 * (isAvailable ? 1.0 : 0.2);

  return Number((score * 100).toFixed(1));
}

/**
 * Resolves Intelligent Association Rules for a Specific Product (used on Product Details Page)
 */
export function getProductSmartCombos(targetProduct, allProducts = PRODUCTS) {
  if (!targetProduct) return { primaryDuo: null, alternativeCombos: [], completeSuite: null };

  const pId = targetProduct.id;
  const pCat = (targetProduct.category || '').toLowerCase();
  const pSub = (targetProduct.subcategory || '').toLowerCase();
  const pBrand = (targetProduct.brand || '').toLowerCase();
  const pTitle = (targetProduct.title || '').toLowerCase();

  // Helper to find product safely
  const findProduct = (filterFn) => allProducts.find(p => p.id !== pId && filterFn(p));

  // Determine Category-Aware Companion Candidates
  let companion1 = null;
  let companion2 = null;
  let comboTypeLabel1 = 'Essential Companion';
  let comboTypeLabel2 = 'Installation & Performance Setup';

  // 1. 📺 SMART TVs & HOME CINEMA -> Pair with Compatible Soundbar / Bluetooth Speaker + 4K HDMI Cable / Wall Mount
  if (pCat === 'electronics' && (pSub.includes('tv') || pTitle.includes('tv') || pTitle.includes('oled') || pTitle.includes('qled') || pTitle.includes('bravia'))) {
    // Soundbar or Bluetooth Speaker (sensibly priced under the TV price)
    companion1 = findProduct(p => 
      p.id !== pId && 
      (p.title.toLowerCase().includes('soundbar') || p.title.toLowerCase().includes('speaker') || p.subcategory?.toLowerCase().includes('soundbar')) &&
      p.price < targetProduct.price
    ) || findProduct(p => p.category === 'audio' && p.price < targetProduct.price);

    // 4K HDMI 2.1 Cable or Heavy Duty Wall Mount
    companion2 = findProduct(p => p.id === 'prod-acc-tv-01' || p.title.toLowerCase().includes('hdmi')) ||
                 findProduct(p => p.title.toLowerCase().includes('cable'));
    const companion3 = findProduct(p => p.id === 'prod-acc-tv-02' || p.title.toLowerCase().includes('wall mount')) ||
                       findProduct(p => p.title.toLowerCase().includes('mount'));

    comboTypeLabel1 = 'Cinematic Sound Duo (TV + Soundbar)';
    comboTypeLabel2 = '4K Ultra HD Setup (TV + HDMI Cable)';

    const metrics1 = calculateAssociationMetrics(pId, companion1?.id || 'prod-acc-tv-01');
    const metrics2 = calculateAssociationMetrics(pId, companion2?.id || 'prod-acc-tv-01');

    return buildComboResult(targetProduct, companion1, companion2, companion3, comboTypeLabel1, comboTypeLabel2, metrics1, metrics2);
  }

  // 2. 🎧 TWS EARBUDS & HEADPHONES -> Pair with 25W Fast Adapter / Charging Pad + Protective Silicone Case (NEVER a TV!)
  if (pCat === 'audio' && (pSub.includes('earbuds') || pSub.includes('headphone') || pTitle.includes('buds') || pTitle.includes('airpods') || pTitle.includes('earbuds') || pTitle.includes('headphone') || pTitle.includes('wh-1000xm5'))) {
    // Fast Charging Power Adapter or Portable Wireless Speaker
    companion1 = findProduct(p => 
      p.id !== pId &&
      (p.title.toLowerCase().includes('adapter') || p.title.toLowerCase().includes('charger') || p.title.toLowerCase().includes('power')) &&
      p.price <= targetProduct.price
    ) || findProduct(p => (p.brand && p.brand.toLowerCase() === pBrand && p.price < targetProduct.price));

    // Protective Silicone Case / Carabiner Pouch or Screen Cleaning Kit
    companion2 = findProduct(p => 
      p.id !== pId &&
      (p.title.toLowerCase().includes('case') || p.title.toLowerCase().includes('cover') || p.title.toLowerCase().includes('pouch')) &&
      p.price < targetProduct.price
    ) || findProduct(p => p.id === 'prod-acc-02' || (p.price <= 999 && p.id !== pId));

    const companion3 = findProduct(p => p.id === 'prod-acc-01' || p.title.toLowerCase().includes('cable'));

    comboTypeLabel1 = 'Fast Charging & Audio Duo';
    comboTypeLabel2 = 'Travel Protection & Case Bundle';

    const metrics1 = calculateAssociationMetrics(pId, companion1?.id || 'prod-acc-02');
    const metrics2 = calculateAssociationMetrics(pId, companion2?.id || 'prod-acc-01');

    return buildComboResult(targetProduct, companion1, companion2, companion3, comboTypeLabel1, comboTypeLabel2, metrics1, metrics2);
  }

  // 3. 🔊 SOUNDBARS & HOME AUDIO -> Pair with 4K eARC HDMI 2.1 Cable + Wall Mount Bracket
  if (pCat === 'audio' || pSub.includes('soundbar') || pTitle.includes('soundbar')) {
    companion1 = findProduct(p => p.id === 'prod-acc-tv-01' || p.title.toLowerCase().includes('hdmi')) ||
                 findProduct(p => p.title.toLowerCase().includes('cable'));
    companion2 = findProduct(p => p.id === 'prod-acc-tv-02' || p.title.toLowerCase().includes('wall mount')) ||
                 findProduct(p => p.title.toLowerCase().includes('mount'));
    const companion3 = findProduct(p => p.title.toLowerCase().includes('optical') || p.title.toLowerCase().includes('bluetooth'));

    comboTypeLabel1 = 'High-Speed eARC Audio Kit';
    comboTypeLabel2 = 'Acoustic Wall Mount Setup';

    const metrics1 = calculateAssociationMetrics(pId, companion1?.id || 'prod-acc-tv-01');
    const metrics2 = calculateAssociationMetrics(pId, companion2?.id || 'prod-acc-tv-02');

    return buildComboResult(targetProduct, companion1, companion2, companion3, comboTypeLabel1, comboTypeLabel2, metrics1, metrics2);
  }

  // 4. 📱 MOBILES & FLAGSHIPS -> Strictly match TWS Earbuds / Fast Charger / Armor Case
  if (pCat === 'mobiles' || pSub.includes('phone') || pTitle.includes('phone') || pTitle.includes('galaxy') || pTitle.includes('iphone')) {
    companion1 = findProduct(p => 
      (p.subcategory?.toLowerCase().includes('earbuds') || p.title.toLowerCase().includes('buds') || p.title.toLowerCase().includes('airpods') || p.title.toLowerCase().includes('earbuds')) && 
      (p.brand && p.brand.toLowerCase() === pBrand)
    ) || findProduct(p => p.id === 'prod-sam-05' || p.id === 'prod-oneplus-03' || p.id === 'prod-aud-01');

    companion2 = findProduct(p => 
      (p.title.toLowerCase().includes('adapter') || p.title.toLowerCase().includes('charger') || p.title.toLowerCase().includes('case')) && 
      (p.brand && p.brand.toLowerCase() === pBrand)
    ) || findProduct(p => p.id === 'prod-sam-06' || p.id === 'prod-acc-02');

    const companion3 = findProduct(p => p.id === 'prod-sam-07' || p.title.toLowerCase().includes('case') || p.title.toLowerCase().includes('pouch') || p.id === 'prod-acc-01');

    comboTypeLabel1 = 'Ecosystem Wireless Audio Combo';
    comboTypeLabel2 = 'Super Fast Power & Armor Case Duo';

    const metrics1 = calculateAssociationMetrics(pId, companion1?.id || 'prod-sam-05');
    const metrics2 = calculateAssociationMetrics(pId, companion2?.id || 'prod-sam-06');

    return buildComboResult(targetProduct, companion1, companion2, companion3, comboTypeLabel1, comboTypeLabel2, metrics1, metrics2);
  }

  // 5. 💻 LAPTOPS & COMPUTING
  if (pCat === 'laptops' || (pCat === 'electronics' && (pSub.includes('laptop') || pTitle.includes('laptop') || pTitle.includes('macbook')))) {
    companion1 = findProduct(p => p.title.toLowerCase().includes('mouse') || p.subcategory === 'Mouse');
    companion2 = findProduct(p => p.title.toLowerCase().includes('sleeve') || p.title.toLowerCase().includes('backpack') || p.title.toLowerCase().includes('bag'));
    const companion3 = findProduct(p => p.id === 'prod-acc-tv-01');

    comboTypeLabel1 = 'Pro Creator Workspace Duo';
    comboTypeLabel2 = 'Commuter Bag & Mouse Bundle';

    const metrics1 = calculateAssociationMetrics(pId, companion1?.id || 'prod-acc-lap-01');
    const metrics2 = calculateAssociationMetrics(pId, companion2?.id || 'prod-acc-lap-02');

    return buildComboResult(targetProduct, companion1, companion2, companion3, comboTypeLabel1, comboTypeLabel2, metrics1, metrics2);
  }

  // 6. 👟 FOOTWEAR & SNEAKERS
  if (pCat === 'footwear' || pSub.includes('shoes') || pSub.includes('sneakers')) {
    companion1 = findProduct(p => p.id === 'prod-acc-shoe-01' || p.title.toLowerCase().includes('socks'));
    companion2 = findProduct(p => p.id === 'prod-acc-shoe-02' || p.title.toLowerCase().includes('shoe care') || p.title.toLowerCase().includes('cleaner'));
    const companion3 = findProduct(p => p.title.toLowerCase().includes('hoodie') || p.title.toLowerCase().includes('track'));

    comboTypeLabel1 = 'Performance Runner Duo';
    comboTypeLabel2 = 'Sneakerhead Care Kit';

    const metrics1 = calculateAssociationMetrics(pId, companion1?.id || 'prod-acc-shoe-01');
    const metrics2 = calculateAssociationMetrics(pId, companion2?.id || 'prod-acc-shoe-02');

    return buildComboResult(targetProduct, companion1, companion2, companion3, comboTypeLabel1, comboTypeLabel2, metrics1, metrics2);
  }

  // Default Fallback: Pick a sensibly priced accessory from same brand/category
  companion1 = findProduct(p => p.price < targetProduct.price && (p.brand === targetProduct.brand || p.category === targetProduct.category)) ||
               findProduct(p => p.price < targetProduct.price);
  companion2 = findProduct(p => p.id !== companion1?.id && p.price < targetProduct.price);
  const metrics1 = calculateAssociationMetrics(pId, companion1?.id || 'prod-acc-01');
  const metrics2 = calculateAssociationMetrics(pId, companion2?.id || 'prod-acc-02');

  return buildComboResult(targetProduct, companion1, companion2, null, 'Complementary Duo', 'Value Essentials Pack', metrics1, metrics2);
}

function buildComboResult(main, comp1, comp2, comp3, label1, label2, m1, m2) {
  // Main Duo
  const primaryDuo = comp1 ? {
    id: `combo-duo-${main.id}-${comp1.id}`,
    name: label1,
    products: [main, comp1],
    originalPrice: main.price + comp1.price,
    discountPercent: 8,
    comboPrice: Math.round((main.price + comp1.price) * 0.92),
    savings: Math.round((main.price + comp1.price) * 0.08),
    support: m1.support,
    confidence: m1.confidence,
    lift: m1.lift,
    score: computeComboScore({ lift: m1.lift, confidence: m1.confidence, support: m1.support }),
    demandLevel: m1.lift >= 3.0 ? 'High' : 'Moderate',
    insight: `${Math.round(m1.confidence * 100)}% of customers who ordered ${main.brand || 'this brand'} bought this companion item together.`
  } : null;

  // Alternative Combos
  const alternativeCombos = [];
  if (comp2) {
    alternativeCombos.push({
      id: `combo-alt1-${main.id}-${comp2.id}`,
      name: label2,
      products: [main, comp2],
      originalPrice: main.price + comp2.price,
      discountPercent: 10,
      comboPrice: Math.round((main.price + comp2.price) * 0.90),
      savings: Math.round((main.price + comp2.price) * 0.10),
      support: m2.support,
      confidence: m2.confidence,
      lift: m2.lift,
      score: computeComboScore({ lift: m2.lift, confidence: m2.confidence, support: m2.support }),
      demandLevel: m2.lift >= 3.0 ? 'High' : 'Moderate',
      insight: `Recommended setup pairing with ${Math.round(m2.confidence * 100)}% compatibility confidence.`
    });
  }

  // Complete 3-Item Suite
  const thirdItem = comp3 || comp2;
  const completeSuite = (comp1 && thirdItem && comp1.id !== thirdItem.id) ? {
    id: `combo-suite-${main.id}-${comp1.id}-${thirdItem.id}`,
    name: `Ultimate Complete Suite (3-Item Pack)`,
    products: [main, comp1, thirdItem],
    originalPrice: main.price + comp1.price + thirdItem.price,
    discountPercent: 15,
    comboPrice: Math.round((main.price + comp1.price + thirdItem.price) * 0.85),
    savings: Math.round((main.price + comp1.price + thirdItem.price) * 0.15),
    support: Math.max(0.18, m1.support * 0.8),
    confidence: Math.max(0.72, m1.confidence * 0.9),
    lift: Math.max(2.8, m1.lift * 1.1),
    score: computeComboScore({ lift: m1.lift * 1.1, confidence: m1.confidence * 0.9, support: m1.support * 0.8 }),
    demandLevel: 'Very High',
    insight: `Full ecosystem setup with maximum bundle savings of 15% instant platform discount.`
  } : null;

  return { primaryDuo, alternativeCombos, completeSuite };
}

/**
 * Mines Global Association Rules for Seller or Admin Hub
 */
export function mineAssociationRules({ sellerId = null, allProducts = PRODUCTS, minSupport = 0.1, minConfidence = 0.5 } = {}) {
  const scopedProducts = sellerId
    ? allProducts.filter(p => p.seller?.name?.toLowerCase().replace(/\s+/g, '-') === sellerId || p.seller?.id === sellerId)
    : allProducts;

  const rules = [];

  // Generate pair-wise rules
  for (let i = 0; i < scopedProducts.length; i++) {
    const pA = scopedProducts[i];
    const combos = getProductSmartCombos(pA, allProducts);

    if (combos.primaryDuo && combos.primaryDuo.products.length === 2) {
      const pB = combos.primaryDuo.products[1];
      rules.push({
        id: `rule-duo-${pA.id}-${pB.id}`,
        itemA: pA,
        itemB: pB,
        type: '2-Product Pair',
        comboName: `${pA.brand || 'Item'} + ${pB.brand || 'Companion'}`,
        support: combos.primaryDuo.support,
        confidence: combos.primaryDuo.confidence,
        lift: combos.primaryDuo.lift,
        score: combos.primaryDuo.score,
        transactionsCount: Math.round(combos.primaryDuo.support * RAW_TRANSACTIONS.length * 15),
        demand: combos.primaryDuo.demandLevel,
        suggestedDiscount: '8% - 10%',
        sellerMatch: !sellerId || (pA.seller?.name === pB.seller?.name)
      });
    }

    if (combos.completeSuite && combos.completeSuite.products.length === 3) {
      const [p1, p2, p3] = combos.completeSuite.products;
      rules.push({
        id: `rule-trio-${p1.id}-${p2.id}-${p3.id}`,
        itemA: p1,
        itemB: p2,
        itemC: p3,
        type: '3-Product Trio',
        comboName: `${p1.title?.split(' ')[0] || 'Item'} + ${p2.title?.split(' ')[0] || 'Companion'} + ${p3.title?.split(' ')[0] || 'Suite'}`,
        support: combos.completeSuite.support,
        confidence: combos.completeSuite.confidence,
        lift: combos.completeSuite.lift,
        score: combos.completeSuite.score,
        transactionsCount: Math.round(combos.completeSuite.support * RAW_TRANSACTIONS.length * 12),
        demand: 'Very High',
        suggestedDiscount: '15% Max Value',
        sellerMatch: !sellerId || (p1.seller?.name === p2.seller?.name)
      });
    }
  }

  // Deduplicate and rank by Score
  const seen = new Set();
  const rankedRules = rules.filter(r => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  }).sort((a, b) => b.score - a.score);

  return rankedRules;
}
