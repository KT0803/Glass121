const express = require("express");
const cors = require("cors");
const { matchProducts } = require("./engine/matcher");
const products = require("./data/products.json");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: [
    "http://localhost:5173",
    /\.vercel\.app$/,           // any *.vercel.app subdomain
    process.env.FRONTEND_URL,   // optional: set in Render dashboard
  ].filter(Boolean),
  methods: ["GET", "POST"],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "AmalGus Matching API is running", version: "1.0.0" });
});

app.get("/products", (req, res) => {
  res.json({ count: products.length, products });
});

app.post("/match", (req, res) => {
  const { query, filters } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "Query must be a non-empty string." });
  }

  if (query.trim().length < 3) {
    return res.status(400).json({ error: "Query must be at least 3 characters." });
  }

  let pool = [...products];

  if (filters) {
    if (filters.category && filters.category !== "all") {
      pool = pool.filter((p) => p.category === filters.category);
    }
    if (filters.max_price && !isNaN(filters.max_price)) {
      pool = pool.filter((p) => p.price_per_sqft <= Number(filters.max_price));
    }
    if (filters.min_price && !isNaN(filters.min_price)) {
      pool = pool.filter((p) => p.price_per_sqft >= Number(filters.min_price));
    }
  }

  if (pool.length === 0) {
    return res.json({
      query,
      results: [],
      message: "No products found matching your filters. Try widening your criteria.",
    });
  }

  try {
    const results = matchProducts(query.trim(), pool, 5);
    res.json({ query, results, total_matched: results.length });
  } catch (err) {
    console.error("Matching error:", err);
    res.status(500).json({ error: "Matching engine failed. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 AmalGus API running at http://localhost:${PORT}`);
  console.log(`📦 ${products.length} products loaded in-memory`);
  console.log(`🔍 POST /match  |  GET /products\n`);
});
