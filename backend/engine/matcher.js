/**
 * AmalGus Hybrid Matching Engine
 * 
 * Final Score = (0.5 × semantic) + (0.2 × category) + (0.15 × thickness) + (0.15 × keyword)
 * Each component scored 0–100, final normalized to 0–100.
 */

const CATEGORY_ALIASES = {
  tempered: ["tempered", "toughened", "safety glass", "tsg", "clearshield", "aquaguard", "tempsafe"],
  laminated: ["laminated", "pvb", "acoustic", "security laminate", "soundguard", "safewalk", "securemax"],
  float: ["float", "clear glass", "plain glass", "annealed", "floatclear", "solarshield", "bioshield"],
  IGU: ["igu", "double glazed", "insulated", "double glazing", "triple glazed", "dgu", "tgu", "energypro", "visionplus"],
  mirror: ["mirror", "reflective", "silvered", "mirroredge"],
  decorative: ["frosted", "acid etched", "decorative", "satin", "artistic", "frostart"],
  "fire-rated": ["fire rated", "fire resistant", "fire glass", "fireproof", "fw", "ew", "firestop", "fire stop", "fire door"],
  spandrel: ["spandrel", "opaque", "curtain wall panel", "spandrelcolor", "ceramic frit"],
};

const FEATURE_KEYWORDS = {
  "UV protection": ["uv", "ultraviolet", "sun protection"],
  "energy efficient": ["energy", "thermal", "low-e", "lowe", "insulation", "hvac"],
  safety: ["safety", "safe", "shatterproof", "impact", "protect"],
  acoustic: ["acoustic", "sound", "noise", "soundproof"],
  privacy: ["privacy", "frosted", "opaque", "obscure"],
  security: ["security", "burglar", "burglary", "anti-theft", "break-in"],
  antimicrobial: ["antimicrobial", "antibacterial", "hygiene", "hospital"],
  "fire rated": ["fire", "fireproof", "fire rated", "flame"],
  solar: ["solar", "heat", "glare", "tinted", "bronze"],
  structural: ["structural", "load bearing", "walkable", "floor"],
};

const USE_CASE_MAP = {
  balcony: ["balcony", "railing", "parapet", "terrace", "high-rise", "highrise", "outdoor barrier"],
  partition: ["partition", "divider", "office wall", "conference room", "office partition"],
  window: ["window", "fenestration", "glazing", "windows"],
  shower: ["shower", "bathroom", "wet area", "bath", "enclosure"],
  facade: ["facade", "cladding", "exterior", "curtain wall", "commercial"],
  floor: ["floor", "walkway", "mezzanine", "sky bridge", "structural", "walk-on"],
  door: ["door", "entrance", "entry", "storefront", "atm", "bank"],
  "sound insulation": ["sound", "acoustic", "noise", "studio", "hotel", "hospital", "recording"],
  overhead: ["overhead", "canopy", "skylight", "roof glazing", "canopies"],
  security: ["security", "burglar", "jewelry", "atm", "safe"],
  healthcare: ["hospital", "lab", "laboratory", "clean room", "healthcare", "medical"],
};

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function extractQueryFeatures(query) {
  const q = query.toLowerCase();
  const tokens = tokenize(q);

  const thicknessMatch = q.match(/(\d+(?:\.\d+)?)\s*mm/);
  const thickness = thicknessMatch ? parseFloat(thicknessMatch[1]) : null;

  let category = null;
  for (const [cat, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some((a) => q.includes(a))) {
      category = cat;
      break;
    }
  }

  const features = [];
  for (const [feat, kws] of Object.entries(FEATURE_KEYWORDS)) {
    if (kws.some((k) => q.includes(k))) {
      features.push(feat);
    }
  }

  const useCases = [];
  for (const [uc, kws] of Object.entries(USE_CASE_MAP)) {
    if (kws.some((k) => q.includes(k))) {
      useCases.push(uc);
    }
  }

  return { thickness, category, features, useCases, tokens };
}

function buildDocumentVector(tokens, vocabulary) {
  const tf = {};
  for (const t of tokens) {
    tf[t] = (tf[t] || 0) + 1;
  }
  return vocabulary.map((v) => tf[v] || 0);
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] ** 2;
    magB += vecB[i] ** 2;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Blended semantic score:
 * 50% TF-IDF cosine (full product text) +
 * 50% direct name-token overlap (so exact/near-exact name searches score high)
 */
function computeSemanticScore(queryTokens, product, vocabulary) {
  const productFullText = [
    product.name, product.description,
    ...product.use_cases, ...product.features, product.coating
  ].join(" ");
  const productFullTokens = tokenize(productFullText);

  // TF-IDF cosine against full product text
  const qVec = buildDocumentVector(queryTokens, vocabulary);
  const pVec = buildDocumentVector(productFullTokens, vocabulary);
  const cosine = cosineSimilarity(qVec, pVec) * 100;

  // Direct name token overlap: what % of query tokens appear in the product name?
  const nameTokens = new Set(tokenize(product.name));
  let nameHits = 0;
  for (const t of queryTokens) {
    if (nameTokens.has(t)) nameHits++;
  }
  const nameOverlap = queryTokens.length > 0 ? (nameHits / queryTokens.length) * 100 : 0;

  // Also check reverse: what % of name tokens are in the query?
  const querySet = new Set(queryTokens);
  let reverseHits = 0;
  for (const t of nameTokens) {
    if (querySet.has(t)) reverseHits++;
  }
  const reverseOverlap = nameTokens.size > 0 ? (reverseHits / nameTokens.size) * 100 : 0;

  // Best name match signal
  const nameScore = Math.max(nameOverlap, reverseOverlap);

  // Blend: 50% cosine + 50% name overlap
  return Math.min(0.5 * cosine + 0.5 * nameScore, 100);
}

function computeCategoryScore(parsed, product) {
  if (!parsed.category) return 30;
  return parsed.category === product.category ? 100 : 0;
}

function computeThicknessScore(parsed, product) {
  if (parsed.thickness === null) return 50;
  const diff = Math.abs(parsed.thickness - product.thickness);
  if (diff === 0) return 100;
  if (diff <= 2) return 70;
  if (diff <= 4) return 40;
  return 0;
}

function computeKeywordScore(parsed, product) {
  const productText = [
    product.description,
    ...product.use_cases,
    ...product.features,
    product.coating,
    product.edge_finish,
  ].join(" ").toLowerCase();

  const productTokens = new Set(tokenize(productText));
  const queryTokens = [...parsed.tokens, ...parsed.features, ...parsed.useCases];

  let matchCount = 0;
  for (const t of queryTokens) {
    if (productTokens.has(t)) matchCount++;
  }

  return queryTokens.length === 0 ? 50 : Math.min((matchCount / queryTokens.length) * 100, 100);
}

function generateExplanation(parsed, product, scores) {
  const parts = [];

  if (parsed.thickness !== null) {
    const diffOk = Math.abs(parsed.thickness - product.thickness) <= 2;
    if (product.thickness === parsed.thickness) {
      parts.push(`exact ${product.thickness}mm thickness match`);
    } else if (diffOk) {
      parts.push(`close thickness match (${product.thickness}mm vs your requested ${parsed.thickness}mm)`);
    }
  } else {
    parts.push(`${product.thickness}mm ${product.category} glass`);
  }

  if (parsed.category && product.category === parsed.category) {
    parts.push(`confirmed ${product.category} category`);
  } else if (product.category) {
    parts.push(`${product.category} glass type`);
  }

  const useCaseMatches = product.use_cases.filter((uc) =>
    parsed.useCases.some((q) => uc.includes(q) || q.includes(uc))
  );
  if (useCaseMatches.length > 0) {
    parts.push(`suitable for ${useCaseMatches.slice(0, 2).join(" and ")}`);
  } else if (product.use_cases.length > 0) {
    parts.push(`designed for ${product.use_cases.slice(0, 2).join(" and ")}`);
  }

  const featMatches = product.features.filter((f) =>
    parsed.features.includes(f) || parsed.tokens.some((t) => f.toLowerCase().includes(t))
  );
  if (featMatches.length > 0) {
    parts.push(`includes ${featMatches.slice(0, 2).join(" and ")} features`);
  } else {
    parts.push(`${product.edge_finish.toLowerCase()} edge finish`);
  }

  if (product.coating && product.coating !== "None") {
    parts.push(`${product.coating.toLowerCase()} coating`);
  }

  if (product.certifications.length > 0) {
    parts.push(`certified to ${product.certifications.slice(0, 2).join(", ")}`);
  }

  const explanation =
    `Matches your requirement — ${parts.slice(0, 4).join(", ")}. ` +
    `Price: ₹${product.price_per_sqft}/sqft from ${product.supplier}.`;

  return explanation;
}

function buildVocabulary(queryTokens, products) {
  const vocab = new Set([...queryTokens]);
  for (const p of products) {
    const productText = [p.name, p.description, ...p.use_cases, ...p.features, p.coating].join(" ");
    tokenize(productText).forEach((t) => vocab.add(t));
  }
  return [...vocab];
}

function matchProducts(query, products, topN = 5) {
  const parsed = extractQueryFeatures(query);
  const queryTokens = tokenize(query.toLowerCase());

  const vocabulary = buildVocabulary(queryTokens, products);

  const results = products.map((product) => {
    // Semantic now uses full product object for name-overlap
    const semanticScore = computeSemanticScore(queryTokens, product, vocabulary);
    const categoryScore = computeCategoryScore(parsed, product);
    const thicknessScore = computeThicknessScore(parsed, product);
    const keywordScore = computeKeywordScore(parsed, product);

    let finalScore =
      0.5 * semanticScore +
      0.2 * categoryScore +
      0.15 * thicknessScore +
      0.15 * keywordScore;

    // Smart floors: prevent great structural matches being dragged down by semantic noise
    // Floor 1: category + thickness both perfect → at least 78
    if (categoryScore === 100 && thicknessScore === 100) {
      finalScore = Math.max(finalScore, 78);
    }
    // Floor 2: category + thickness perfect AND keyword strong → at least 88
    if (categoryScore === 100 && thicknessScore === 100 && keywordScore >= 60) {
      finalScore = Math.max(finalScore, 88);
    }
    // Floor 3: all three structural signals perfect → at least 93
    if (categoryScore === 100 && thicknessScore === 100 && keywordScore >= 90) {
      finalScore = Math.max(finalScore, 93);
    }
    // Floor 4: name is almost identical to query (high semantic from name-overlap) → at least 90
    if (semanticScore >= 80 && categoryScore >= 80) {
      finalScore = Math.max(finalScore, 90);
    }

    const scores = { semanticScore, categoryScore, thicknessScore, keywordScore };
    const explanation = generateExplanation(parsed, product, scores);

    return {
      product,
      match_score: Math.round(Math.min(finalScore, 100)),
      explanation,
      score_breakdown: {
        semantic: Math.round(semanticScore),
        category: Math.round(categoryScore),
        thickness: Math.round(thicknessScore),
        keyword: Math.round(keywordScore),
      },
    };
  });

  results.sort((a, b) => b.match_score - a.match_score);
  return results.slice(0, topN);
}

module.exports = { matchProducts, extractQueryFeatures };
