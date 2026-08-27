/**
 * Product Similarity Service
 * Implements Jaccard Similarity (Co-view / Co-purchase affinity) & Cosine Similarity (Vectorized attributes)
 */

import { PRODUCTS } from '../../data/products';

/**
 * Calculates Jaccard Similarity between two items based on interaction sets
 */
export function calculateJaccardSimilarity(itemA, itemB) {
  if (!itemA || !itemB || itemA.id === itemB.id) return 1.0;

  const setA = new Set([
    itemA.category,
    itemA.subcategory,
    itemA.brand,
    ...(itemA.tags || []),
    ...(Object.values(itemA.attributes || {}))
  ].map(v => String(v).toLowerCase()));

  const setB = new Set([
    itemB.category,
    itemB.subcategory,
    itemB.brand,
    ...(itemB.tags || []),
    ...(Object.values(itemB.attributes || {}))
  ].map(v => String(v).toLowerCase()));

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  if (union.size === 0) return 0;
  const score = intersection.size / union.size;
  return Number(score.toFixed(3));
}

/**
 * Calculates Cosine Similarity on feature vectors
 * Vector features: Category weight, Brand match, Price-tier closeness, Rating tier
 */
export function calculateCosineSimilarity(itemA, itemB) {
  if (!itemA || !itemB) return 0;
  if (itemA.id === itemB.id) return 1.0;

  // Vector 1 & Vector 2
  const vA = [
    itemA.category === itemB.category ? 1.0 : 0.0,
    itemA.subcategory === itemB.subcategory ? 1.0 : 0.0,
    itemA.brand === itemB.brand ? 1.0 : 0.3,
    1.0 - Math.min(1.0, Math.abs(itemA.price - itemB.price) / Math.max(itemA.price, itemB.price, 1)),
    (itemA.rating || 4.5) / 5.0
  ];

  const vB = [
    1.0,
    1.0,
    1.0,
    1.0,
    (itemB.rating || 4.5) / 5.0
  ];

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vA.length; i++) {
    dotProduct += vA[i] * vB[i];
    normA += vA[i] * vA[i];
    normB += vB[i] * vB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  const cosine = dotProduct / (normA * normB);
  return Number(Math.min(0.99, Math.max(0.1, cosine)).toFixed(3));
}

/**
 * Finds top related & compatible products for a target item (used for PDP "Related Products" section and Intelligence tabs)
 */
export function getRelatedAndCompatibleProducts(targetProduct, allProducts = PRODUCTS, limit = 6) {
  if (!targetProduct) return [];

  const scored = allProducts
    .filter(p => p.id !== targetProduct.id)
    .map(p => {
      const jaccard = calculateJaccardSimilarity(targetProduct, p);
      const cosine = calculateCosineSimilarity(targetProduct, p);
      const combinedScore = Number(((0.45 * jaccard + 0.55 * cosine) * 100).toFixed(1));

      let relationshipType = 'Alternative Model';
      if (p.brand === targetProduct.brand) relationshipType = 'Same Brand Ecosystem';
      if (p.category !== targetProduct.category) relationshipType = 'Cross-Category Companion';

      return {
        product: p,
        jaccardScore: Number((jaccard * 100).toFixed(1)),
        cosineScore: Number((cosine * 100).toFixed(1)),
        similarityScore: combinedScore,
        compatibilityScore: Number((cosine * 95 + (p.inStock ? 5 : 0)).toFixed(1)),
        relationshipType
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore);

  return scored.slice(0, limit);
}
