import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart, Search, ChevronRight, Star, MapPin, Briefcase,
  Layers, Shield, Zap, Home, Building2, Droplets, UtensilsCrossed,
  Wind, Fence, Package, Wrench, ChevronDown, X, Check, Download,
  ArrowRight, Menu, Phone, Mail, Clock, Truck, Award, Info,
  SlidersHorizontal, Calculator,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// SECTION 1 MOCK DATA
// ─────────────────────────────────────────────────────────────

const ROLES = [
  { id: "homeowner",   label: "Homeowner" },
  { id: "architect",   label: "Architect" },
  { id: "builder",     label: "Builder" },
  { id: "glass_dealer",label: "Glass Dealer" },
];

const ROLE_HEADLINES = {
  homeowner:    "Beautiful Glass for Every Room in Your Home",
  architect:    "Precision Glass Solutions for Architectural Excellence",
  builder:      "Bulk Glass Supply & Fast Delivery Across India",
  glass_dealer: "Source Directly from Verified Glass Manufacturers",
};

const TICKER_RATES = [
  { name: "Clear Float",  price: "₹52/sqft" },
  { name: "Toughened",    price: "₹140/sqft" },
  { name: "Laminated",    price: "₹210/sqft" },
  { name: "DGU",          price: "₹420/sqft" },
  { name: "Low-E",        price: "₹250/sqft" },
  { name: "Mirror",       price: "₹90/sqft" },
  { name: "Frosted",      price: "₹95/sqft" },
  { name: "Reflective",   price: "₹130/sqft" },
];

const USE_CASES = [
  {
    icon: <Droplets className="w-7 h-7" />,
    title: "Shower Enclosures",
    desc: "Frameless & semi-frameless wet area glass systems",
    keyword: "shower",
  },
  {
    icon: <Fence className="w-7 h-7" />,
    title: "Balcony Railings",
    desc: "Structural glass railings for apartments & villas",
    keyword: "balcony",
  },
  {
    icon: <Briefcase className="w-7 h-7" />,
    title: "Office Partitions",
    desc: "Frosted & clear partitions for modern workplaces",
    keyword: "partition",
  },
  {
    icon: <Home className="w-7 h-7" />,
    title: "Home Windows",
    desc: "Energy-efficient UPVC & aluminium window glazing",
    keyword: "window",
  },
  {
    icon: <Building2 className="w-7 h-7" />,
    title: "Building Facades",
    desc: "Curtain wall & spider fitting facade systems",
    keyword: "facade",
  },
  {
    icon: <UtensilsCrossed className="w-7 h-7" />,
    title: "Kitchen Backsplash",
    desc: "Back-painted lacquered glass for modern kitchens",
    keyword: "kitchen",
  },
];

// ─────────────────────────────────────────────────────────────
// SECTION 2 — SMART GLASS FINDER DATA
// ─────────────────────────────────────────────────────────────

const QUICK_CHIPS = [
  "Window", "Shower", "Railing", "Partition", "Facade", "Kitchen", "Skylight",
];

const PLACEHOLDER_EXAMPLES = [
  "glass for bathroom shower",
  "soundproof office cabin partition",
  "balcony railing 15th floor",
  "energy saving facade south-facing",
  "kitchen backsplash decorative",
];

function matchGlass(query) {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 3) return [];
  const results = [];

  if (/shower|bathroom|wet.?area/.test(q)) {
    results.push({
      id: "toughened-8mm",
      name: "8mm Toughened Tempered Glass",
      reason: "Mandatory for wet areas by National Building Code — maximum safety and water resistance.",
      specs: { thickness: "8mm", process: "Heat Toughened (EN-12150)", application: "Shower Enclosures / Wet Areas" },
      priceRange: "₹120–160/sqft",
      ratePerSqft: 140,
    });
  }
  if (/soundproof|office|cabin|acoustic/.test(q)) {
    results.push({
      id: "laminated-10mm",
      name: "10mm Laminated Acoustic Glass",
      reason: "PVB interlayer reduces sound transmission by 35–42 dB — ideal for conference rooms and cabins.",
      specs: { thickness: "10mm", process: "Laminated (PVB 0.76mm)", application: "Office Cabins / Conference Rooms" },
      priceRange: "₹180–280/sqft",
      ratePerSqft: 230,
    });
    results.push({
      id: "dgu-acoustic",
      name: "DGU Acoustic 6+12+6mm",
      reason: "Double glazed unit with argon fill provides both thermal and acoustic insulation.",
      specs: { thickness: "24mm total", process: "Insulated Glass Unit (IGU)", application: "Office & Commercial Spaces" },
      priceRange: "₹280–350/sqft",
      ratePerSqft: 315,
    });
  }
  if (/balcony|railing|height|high.?rise/.test(q)) {
    results.push({
      id: "toughened-laminated-12mm",
      name: "12mm Toughened + Laminated Glass",
      reason: "Dual treatment ensures if glass breaks, fragments stay held by PVB — critical for elevated installations.",
      specs: { thickness: "12mm", process: "Toughened + Laminated", application: "Balcony Railings / Structural Glass" },
      priceRange: "₹200–260/sqft",
      ratePerSqft: 230,
    });
  }
  if (/energy|facade|south.?facing|curtain.?wall|low.?e/.test(q)) {
    results.push({
      id: "low-e-dgu",
      name: "Low-E DGU 6+12+6mm",
      reason: "Low-Emissivity coating reflects 72% of solar heat, dramatically reducing HVAC costs.",
      specs: { thickness: "24mm total", process: "Low-E Coated + Argon Filled IGU", application: "Building Facades / Curtain Walls" },
      priceRange: "₹200–300/sqft",
      ratePerSqft: 250,
    });
  }
  if (/kitchen|backsplash|decorative|back.?painted|lacquer/.test(q)) {
    results.push({
      id: "back-painted-8mm",
      name: "8mm Back-Painted Lacquered Glass",
      reason: "Non-porous surface is heat and moisture resistant — available in 200+ custom colours.",
      specs: { thickness: "8mm", process: "Lacquer Back-Painted (RAL Colours)", application: "Kitchen Backsplash / Feature Walls" },
      priceRange: "₹150–220/sqft",
      ratePerSqft: 185,
    });
  }
  if (/privacy|partition|conference|frosted|acid.?etch/.test(q)) {
    results.push({
      id: "frosted-6mm",
      name: "6mm Frosted Acid Etched Glass",
      reason: "Chemical etching creates a permanent satin finish for privacy without blocking natural light.",
      specs: { thickness: "6mm", process: "Acid Etched / Sandblasted", application: "Office Partitions / Privacy Screens" },
      priceRange: "₹85–110/sqft",
      ratePerSqft: 97,
    });
  }
  if (/window|glazing|clear|float|door|shopfront/.test(q)) {
    results.push({
      id: "clear-float-5mm",
      name: "5mm Clear Float Glass",
      reason: "Standard glazing grade — optically clear with minimal distortion for everyday window applications.",
      specs: { thickness: "5mm", process: "Float (Asahi / Saint-Gobain Grade)", application: "Windows / Doors / Shopfronts" },
      priceRange: "₹45–60/sqft",
      ratePerSqft: 52,
    });
  }
  if (/skylight|roof|overhead/.test(q)) {
    results.push({
      id: "laminated-skylight",
      name: "10mm Toughened Laminated (Skylight)",
      reason: "Overhead glazing requires laminated glass so fragments are retained by PVB on breakage.",
      specs: { thickness: "10mm", process: "Toughened + Laminated (overhead grade)", application: "Skylights / Roof Glazing" },
      priceRange: "₹190–270/sqft",
      ratePerSqft: 230,
    });
  }
  // No keyword matched → return empty (caller shows "no match" UI)
  return results.slice(0, 3);
}

// ─────────────────────────────────────────────────────────────
// SECTION 3 — CUSTOMIZER DATA
// ─────────────────────────────────────────────────────────────

const GLASS_TYPES = [
  "5mm Clear Float", "8mm Toughened Tempered", "10mm Laminated Acoustic",
  "12mm Toughened + Laminated", "Low-E DGU 6+12+6mm", "6mm Frosted Acid Etched",
  "8mm Back-Painted Lacquered", "DGU Acoustic 6+12+6mm",
];

const THICKNESSES = ["4mm", "5mm", "6mm", "8mm", "10mm", "12mm"];
const FINISHES = ["Clear", "Tinted", "Frosted", "Reflective", "Back-Painted"];
const EDGES = ["Plain", "Bevelled", "Polished", "Chamfered"];

const VENDORS = [
  {
    id: "A",
    name: "ClearVision Glass Works",
    location: "Mumbai",
    rating: 4.7,
    delivery: "3–5 days",
    priceMultiplier: 1.0,
    badge: "Trusted Supplier",
    jobs: 864,
  },
  {
    id: "B",
    name: "PrecisionGlaze India",
    location: "Pune",
    rating: 4.9,
    delivery: "2–3 days",
    priceMultiplier: 1.08,
    badge: "Top Rated",
    jobs: 1342,
  },
  {
    id: "C",
    name: "GlassHub Direct",
    location: "Delhi",
    rating: 4.3,
    delivery: "5–7 days",
    priceMultiplier: 0.95,
    badge: "Value Pick",
    jobs: 512,
  },
];

// ─────────────────────────────────────────────────────────────
// SECTION 4 — ALLIED PRODUCTS DATA
// ─────────────────────────────────────────────────────────────

const ALLIED_CATEGORIES = [
  {
    category: "Hardware & Fittings",
    icon: <Wrench className="w-5 h-5" />,
    products: [
      { id: "sf1", name: "Spider Fitting Set", price: 2400, unit: "set", desc: "For structural glass facades" },
      { id: "sf2", name: "Patch Fitting (Top+Bottom)", price: 1800, unit: "pair", desc: "For frameless doors" },
      { id: "sf3", name: "SS Hinges (Heavy Duty)", price: 650, unit: "piece", desc: "For shower enclosures" },
    ],
  },
  {
    category: "Sealants & Chemicals",
    icon: <Droplets className="w-5 h-5" />,
    products: [
      { id: "sc1", name: "Structural Silicone 600ml", price: 480, unit: "tube", desc: "Dow Corning / GE" },
      { id: "sc2", name: "Weather Seal Gasket", price: 120, unit: "meter", desc: "EPDM rubber, UV resistant" },
    ],
  },
  {
    category: "Frames & Profiles",
    icon: <Layers className="w-5 h-5" />,
    products: [
      { id: "fp1", name: "Aluminium U-Channel", price: 380, unit: "meter", desc: "For glass railing base" },
      { id: "fp2", name: "UPVC Window Frame", price: 520, unit: "meter", desc: "White, 60mm series" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// SECTION 5 — SERVICE PARTNERS DATA
// ─────────────────────────────────────────────────────────────

const SERVICE_PARTNERS = [
  {
    id: "sp1",
    name: "Rajesh Kumar",
    role: "Glass Installer",
    location: "Pune, Maharashtra",
    rating: 4.8,
    jobs: 142,
    specialization: "Shower enclosures, frameless doors",
    avatar: "RK",
    exp: "8 yrs exp.",
  },
  {
    id: "sp2",
    name: "Anita Sharma",
    role: "Measurement Expert",
    location: "Mumbai, Maharashtra",
    rating: 4.9,
    jobs: 218,
    specialization: "Curtain walls, facade systems",
    avatar: "AS",
    exp: "11 yrs exp.",
  },
  {
    id: "sp3",
    name: "Vikram Singh",
    role: "Site Supervisor",
    location: "Bangalore, Karnataka",
    rating: 4.7,
    jobs: 96,
    specialization: "Office partitions, AGP glass",
    avatar: "VS",
    exp: "6 yrs exp.",
  },
];

// ─────────────────────────────────────────────────────────────
// HELPER — StarRating
// ─────────────────────────────────────────────────────────────

function StarRating({ value }) {
  return (
    <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
      <Star className="w-3.5 h-3.5 fill-amber-400" />
      {value}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────

function Navbar({ cartCount, onScrollTo, onCartClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [
    { label: "Marketplace", section: "finder" },
    { label: "Products",    section: "allied" },
    { label: "Services",    section: "services" },
  ];

  return (
    <header className="border-b border-[#1e3a5f]/60 bg-[#0F172A]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onScrollTo("hero")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold gradient-text">AmalGus</span>
            <p className="text-[9px] text-slate-500 leading-none -mt-0.5">Smart Glass Marketplace</p>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <button
              key={l.section}
              onClick={() => onScrollTo(l.section)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Rates Active
          </div>
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-xl bg-white/5 border border-[#1e3a5f]/60 hover:border-blue-500/50 transition-all"
          >
            <ShoppingCart className="w-5 h-5 text-slate-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-blue-500 rounded-full flex items-center justify-center text-white px-1">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2 rounded-xl bg-white/5 border border-[#1e3a5f]/60"
            onClick={() => setMobileOpen(v => !v)}
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e3a5f]/40 bg-[#0F172A] px-4 py-3 flex flex-col gap-1 animate-slide-down">
          {navLinks.map(l => (
            <button
              key={l.section}
              onClick={() => { onScrollTo(l.section); setMobileOpen(false); }}
              className="py-2.5 px-3 text-sm text-slate-300 hover:text-white text-left rounded-lg hover:bg-white/5"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 1 — HERO + TICKER + USE CASES
// ─────────────────────────────────────────────────────────────

function HeroSection({ onScrollTo, onUsecaseClick }) {
  const [activeRole, setActiveRole] = useState("homeowner");

  return (
    <section id="hero" className="hero-bg">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-full px-4 py-1.5 text-xs text-blue-400 mb-6 animate-fade-in">
          <Zap className="w-3.5 h-3.5" />
          India's #1 B2B2C Glass & Allied Products Marketplace
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight animate-slide-up">
          India's First{" "}
          <span className="gradient-text">Smart Glass</span>{" "}
          Marketplace
        </h1>

        <p
          key={activeRole}
          className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 animate-fade-in"
        >
          {ROLE_HEADLINES[activeRole]}
        </p>

        {/* Role selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span className="text-sm text-slate-500 self-center mr-1">I am a...</span>
          {ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeRole === r.id
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "border-[#1e3a5f]/70 text-slate-400 hover:border-blue-500/50 hover:text-slate-200 bg-white/5"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onScrollTo("finder")}
          className="btn-primary inline-flex items-center gap-2 text-base shadow-2xl shadow-blue-500/25"
        >
          Find Your Glass <ArrowRight className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Ticker */}
      <div className="bg-[#0a1628]/80 border-y border-[#1e3a5f]/50 py-2.5 overflow-hidden">
        <div className="flex items-center gap-3 px-4 mb-0">
          <span className="shrink-0 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-full">
            Live Rates
          </span>
        </div>
        <div className="ticker-wrap mt-1">
          <div className="ticker-track">
            {[...TICKER_RATES, ...TICKER_RATES].map((r, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-6 text-sm">
                <span className="text-slate-300 font-medium">{r.name}</span>
                <span className="gradient-text-gold font-bold">{r.price}</span>
                <span className="text-slate-600 text-xs">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-400 mb-6">How It Works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { n: "1", label: "Describe Need", sub: "Plain language or quick chip", icon: <Search className="w-5 h-5" /> },
            { n: "2", label: "Get Matched",   sub: "AI surfaces best glass types",  icon: <Zap className="w-5 h-5" /> },
            { n: "3", label: "Order & Install",sub: "Compare vendors, book pros",   icon: <Truck className="w-5 h-5" /> },
          ].map((s, i) => (
            <div key={i} className="flex flex-col sm:items-center gap-3 glass-card rounded-2xl p-5 hover:!transform-none group">
              <div className="step-number">{s.n}</div>
              <div className="sm:text-center">
                <p className="font-semibold text-white text-sm">{s.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Use Case Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-400 mb-6">Browse by Use Case</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {USE_CASES.map(uc => (
            <button
              key={uc.title}
              onClick={() => onUsecaseClick(uc.keyword)}
              className="glass-card rounded-2xl p-4 text-left flex flex-col gap-3 cursor-pointer group hover:!border-blue-500/50"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                {uc.icon}
              </div>
              <div>
                <p className="font-semibold text-white text-sm leading-tight">{uc.title}</p>
                <p className="text-slate-500 text-xs mt-1 leading-snug">{uc.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// RECOMMENDATION CARD
// ─────────────────────────────────────────────────────────────

function RecommendationCard({ rec, onCustomize }) {
  return (
    <div className="glass-card rounded-2xl p-5 animate-slide-up flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-400 font-medium mb-2">
            <Award className="w-3 h-3" /> AI Recommended
          </div>
          <h3 className="text-white font-bold text-base">{rec.name}</h3>
          <p className="text-slate-400 text-sm mt-1">{rec.reason}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="gradient-text-gold font-bold text-base">{rec.priceRange}</p>
          <p className="text-slate-500 text-[11px]">per sqft</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Object.entries(rec.specs).map(([k, v]) => (
          <div key={k} className="bg-white/4 rounded-xl p-2.5 text-center border border-[#1e3a5f]/40">
            <p className="text-slate-500 text-[10px] capitalize mb-0.5">{k}</p>
            <p className="text-slate-200 text-xs font-medium leading-tight">{v}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onCustomize(rec)}
        className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
      >
        <SlidersHorizontal className="w-4 h-4" /> Customize & Quote
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 2 — SMART GLASS FINDER
// ─────────────────────────────────────────────────────────────

function GlassFinderSection({ initialQuery, onCustomize }) {
  const [query, setQuery] = useState(initialQuery || "");
  const [recommendations, setRecommendations] = useState([]);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [searched, setSearched] = useState(false);

  // Cycle placeholder text
  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDER_EXAMPLES.length), 2800);
    return () => clearInterval(t);
  }, []);

  // If initial query fired from use-case cards
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      const res = matchGlass(initialQuery);
      setRecommendations(res);
      setSearched(true);
    }
  }, [initialQuery]);

  const handleSearch = (q) => {
    const qFinal = (q !== undefined ? q : query).trim();
    if (!qFinal || qFinal.length < 2) return;
    const res = matchGlass(qFinal);
    setRecommendations(res);
    setSearched(true);
  };

  const handleChip = (chip) => {
    const q = chip.toLowerCase();
    setQuery(q);
    const res = matchGlass(q);
    setRecommendations(res);
    setSearched(true);
  };

  return (
    <section id="finder" className="py-16 bg-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Smart Glass Finder</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            AI-Powered{" "}<span className="gradient-text">Glass Recommendations</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Describe your project in plain language — our engine matches thickness, process, and application instantly.
          </p>
        </div>

        {/* Search box */}
        <div className="search-glow rounded-2xl bg-[#0d1526] border border-[#1e3a5f]/70 flex items-center gap-3 px-4 py-3 mb-4 transition-all">
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-slate-200 text-base placeholder-slate-600"
            placeholder={PLACEHOLDER_EXAMPLES[placeholderIdx]}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          {query && (
            <button onClick={() => { setQuery(""); setRecommendations([]); setSearched(false); }}>
              <X className="w-4 h-4 text-slate-500 hover:text-slate-300" />
            </button>
          )}
          <button
            onClick={() => handleSearch()}
            className="btn-primary py-2 px-5 text-sm"
          >
            Search
          </button>
        </div>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {QUICK_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                query.toLowerCase() === chip.toLowerCase()
                  ? "chip-active"
                  : "border-[#1e3a5f]/70 text-slate-400 hover:border-blue-500/50 hover:text-slate-200 bg-white/5"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Results */}
        {searched && recommendations.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 text-center mb-2">
              Showing <span className="text-white font-medium">{recommendations.length}</span> recommendation{recommendations.length > 1 ? "s" : ""} for{" "}
              <em className="text-blue-400">"{query}"</em>
            </p>
            {recommendations.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} onCustomize={onCustomize} />
            ))}
          </div>
        )}

        {/* No match after search */}
        {searched && recommendations.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Info className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">Couldn't Match a Glass Type</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-5">
              We couldn't identify a glass requirement from <em className="text-slate-300">"{query}"</em>. Try describing the usage — e.g. <em className="text-blue-400">shower</em>, <em className="text-blue-400">balcony railing</em>, <em className="text-blue-400">office partition</em>, or <em className="text-blue-400">kitchen backsplash</em>.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleChip(chip)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#1e3a5f]/70 text-slate-400 hover:border-blue-500/50 hover:text-slate-200 bg-white/5 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center py-10 text-slate-600 text-sm">
            <Search className="w-10 h-10 mx-auto mb-3 text-[#1e3a5f]" />
            Type your requirement above or click a chip to get started
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 3 — PRODUCT CUSTOMIZER & QUOTE
// ─────────────────────────────────────────────────────────────

function CustomizerSection({ selectedRec, onClose }) {
  const [glassType, setGlassType] = useState(selectedRec?.name || GLASS_TYPES[0]);
  const [thickness, setThickness] = useState("8mm");
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(2100);
  const [qty, setQty] = useState(1);
  const [finish, setFinish] = useState("Clear");
  const [edge, setEdge] = useState("Polished");
  const [customText, setCustomText] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("B");
  const [step, setStep] = useState("A"); // A, B, C
  const [visitRequested, setVisitRequested] = useState(false);

  const ratePerSqft = selectedRec?.ratePerSqft || 140;
  const sqftW = width / 304.8;
  const sqftH = height / 304.8;
  const area = sqftW * sqftH * qty;
  const vendor = VENDORS.find(v => v.id === selectedVendor);
  const unitPrice = ratePerSqft * vendor.priceMultiplier;
  const total = area * unitPrice;
  const gst = total * 0.18;
  const grandTotal = total + gst;

  const fmtINR = n => `₹${Math.round(n).toLocaleString("en-IN")}`;

  const selectEl = "w-full glass-input rounded-xl px-3 py-2.5 text-sm";
  const labelEl = "text-xs text-slate-500 font-medium mb-1 block uppercase tracking-wide";

  return (
    <section id="customizer" className="py-16 bg-gradient-to-b from-[#0F172A] to-[#0a1628]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-1">Customizer</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Product Customizer & <span className="gradient-text">Quote Generator</span>
            </h2>
          </div>
          <button onClick={onClose} className="btn-secondary flex items-center gap-1.5 text-sm">
            <X className="w-4 h-4" /> Close
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 bg-[#0a1628] border border-[#1e3a5f]/50 rounded-2xl p-1 mb-8">
          {[
            { id: "A", label: "Glass Config" },
            { id: "B", label: "Vendor Compare" },
            { id: "C", label: "Quote Summary" },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                step === s.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Step {s.id} — {s.label}
            </button>
          ))}
        </div>

        {/* ── STEP A: Glass Config ── */}
        {step === "A" && (
          <div className="animate-scale-in space-y-5">
            <div className="glass-card rounded-2xl p-6 space-y-5 hover:!transform-none">
              <h3 className="font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4.5 h-4.5 text-blue-400" /> Glass Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Glass type */}
                <div className="sm:col-span-2">
                  <label className={labelEl}>Glass Type</label>
                  <select className={selectEl} value={glassType} onChange={e => setGlassType(e.target.value)}>
                    {GLASS_TYPES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                {/* Thickness */}
                <div>
                  <label className={labelEl}>Thickness</label>
                  <select className={selectEl} value={thickness} onChange={e => setThickness(e.target.value)}>
                    {THICKNESSES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Finish */}
                <div>
                  <label className={labelEl}>Finish</label>
                  <select className={selectEl} value={finish} onChange={e => setFinish(e.target.value)}>
                    {FINISHES.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>

                {/* Width */}
                <div>
                  <label className={labelEl}>Width (mm)</label>
                  <input
                    type="number" min="100" max="6000"
                    className={selectEl}
                    value={width}
                    onChange={e => setWidth(Number(e.target.value))}
                  />
                </div>

                {/* Height */}
                <div>
                  <label className={labelEl}>Height (mm)</label>
                  <input
                    type="number" min="100" max="6000"
                    className={selectEl}
                    value={height}
                    onChange={e => setHeight(Number(e.target.value))}
                  />
                </div>

                {/* Qty */}
                <div>
                  <label className={labelEl}>Quantity</label>
                  <input
                    type="number" min="1" max="1000"
                    className={selectEl}
                    value={qty}
                    onChange={e => setQty(Number(e.target.value))}
                  />
                </div>

                {/* Edge */}
                <div>
                  <label className={labelEl}>Edge Treatment</label>
                  <select className={selectEl} value={edge} onChange={e => setEdge(e.target.value)}>
                    {EDGES.map(ed => <option key={ed}>{ed}</option>)}
                  </select>
                </div>

                {/* Custom Text */}
                <div className="sm:col-span-2">
                  <label className={labelEl}>Custom Text / Etching (optional)</label>
                  <input
                    type="text"
                    placeholder='e.g. "Design Studio" or company logo text'
                    className={selectEl}
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Live Price Calculator */}
            <div className="glass-card rounded-2xl p-6 border !border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 hover:!transform-none">
              <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <Calculator className="w-4.5 h-4.5 text-blue-400" /> Live Price Calculator
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/4 rounded-xl p-3 text-center border border-[#1e3a5f]/50">
                  <p className="text-slate-500 text-[11px] mb-1">Area (sqft)</p>
                  <p className="text-white font-bold text-lg">{area.toFixed(2)}</p>
                </div>
                <div className="bg-white/4 rounded-xl p-3 text-center border border-[#1e3a5f]/50">
                  <p className="text-slate-500 text-[11px] mb-1">Rate/sqft</p>
                  <p className="text-white font-bold text-lg">{fmtINR(unitPrice)}</p>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-3 text-center border border-blue-500/30">
                  <p className="text-blue-400 text-[11px] mb-1">Total (ex GST)</p>
                  <p className="gradient-text font-bold text-lg">{fmtINR(total)}</p>
                </div>
              </div>
              <p className="text-slate-600 text-[11px] mt-3 text-center">
                Formula: (W÷304.8) × (H÷304.8) × Qty × ₹{Math.round(unitPrice)}/sqft
              </p>
            </div>

            <button onClick={() => setStep("B")} className="btn-primary w-full flex items-center justify-center gap-2">
              Compare Vendors <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP B: Vendor Comparison ── */}
        {step === "B" && (
          <div className="animate-scale-in space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2 mb-2">
              <Truck className="w-4.5 h-4.5 text-blue-400" /> Vendor Comparison
            </h3>
            {VENDORS.map(v => {
              const vTotal = area * ratePerSqft * v.priceMultiplier;
              const isSelected = selectedVendor === v.id;
              return (
                <div
                  key={v.id}
                  className={`glass-card rounded-2xl p-5 hover:!transform-none transition-all cursor-pointer ${isSelected ? "vendor-selected" : ""}`}
                  onClick={() => setSelectedVendor(v.id)}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isSelected ? "bg-blue-600 text-white" : "bg-[#1e3a5f]/50 text-slate-400"}`}>
                        {v.id}
                      </div>
                      <div>
                        <p className="font-bold text-white">{v.name}</p>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MapPin className="w-3 h-3" /> {v.location}
                          </span>
                          <StarRating value={v.rating} />
                          <span className="text-xs text-slate-500">{v.jobs} jobs</span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                          {v.badge}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-base">{fmtINR(vTotal)}</p>
                      <p className="text-slate-500 text-xs">ex-GST</p>
                      <div className="flex items-center gap-1 text-slate-400 text-xs mt-1 justify-end">
                        <Clock className="w-3 h-3" /> {v.delivery}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1.5 text-blue-400 text-xs font-medium">
                      <Check className="w-3.5 h-3.5" /> Selected
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex gap-3">
              <button onClick={() => setStep("A")} className="btn-secondary flex-1">← Back</button>
              <button onClick={() => setStep("C")} className="btn-primary flex-1 flex items-center justify-center gap-2">
                View Quote <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP C: Quote Summary ── */}
        {step === "C" && (
          <div className="animate-scale-in">
            <div className="quote-card">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <Check className="w-4.5 h-4.5 text-green-400" />
                </div>
                <h3 className="font-bold text-white text-lg">Quote Summary</h3>
                <span className="ml-auto text-xs text-slate-500 font-mono">
                  #{Math.random().toString(36).slice(2,8).toUpperCase()}
                </span>
              </div>

              {/* Product details */}
              <div className="bg-white/3 rounded-xl p-4 mb-4 border border-[#1e3a5f]/40">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Product</p>
                <p className="text-white font-semibold">{glassType}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                  {[
                    { k: "Thickness", v: thickness },
                    { k: "Finish", v: finish },
                    { k: "Edge", v: edge },
                    { k: "Qty", v: qty },
                  ].map(({ k, v: val }) => (
                    <div key={k}>
                      <p className="text-[10px] text-slate-600">{k}</p>
                      <p className="text-slate-200 text-xs font-medium">{val}</p>
                    </div>
                  ))}
                </div>
                {customText && (
                  <p className="mt-3 text-xs text-slate-400">
                    Custom etching: <span className="text-blue-400 font-medium">"{customText}"</span>
                  </p>
                )}
              </div>

              {/* Vendor */}
              <div className="bg-white/3 rounded-xl p-4 mb-4 border border-[#1e3a5f]/40">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Selected Vendor</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{vendor.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {vendor.location} · <Clock className="w-3 h-3" /> Delivery: {vendor.delivery}
                    </p>
                  </div>
                  <StarRating value={vendor.rating} />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Area ({area.toFixed(2)} sqft × {fmtINR(unitPrice)}/sqft)</span>
                  <span className="text-slate-200">{fmtINR(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">GST @ 18%</span>
                  <span className="text-slate-200">{fmtINR(gst)}</span>
                </div>
                <div className="h-px bg-[#1e3a5f]/60 my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-white">Grand Total</span>
                  <span className="gradient-text text-lg">{fmtINR(grandTotal)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => alert("📄 Quote PDF download triggered (mock).\nIn production this generates a branded PDF with all specs.")}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Quote (PDF)
                </button>
                <button
                  onClick={() => {
                    setVisitRequested(true);
                    setTimeout(() => alert("✅ Order placed!\nOur team will confirm within 2 hours."), 100);
                  }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {visitRequested ? <><Check className="w-4 h-4" /> Ordered!</> : <><ArrowRight className="w-4 h-4" /> Proceed to Order</>}
                </button>
              </div>
            </div>

            <button onClick={() => setStep("B")} className="btn-secondary w-full mt-3">← Back to Vendors</button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 4 — ALLIED PRODUCTS
// ─────────────────────────────────────────────────────────────

function AlliedSection({ onAddToCart }) {
  const [addedItems, setAddedItems] = useState({});

  const handleAdd = (product) => {
    const newQty = (addedItems[product.id] || 0) + 1;
    setAddedItems(prev => ({ ...prev, [product.id]: newQty }));
    onAddToCart(product, newQty);
  };

  return (
    <section id="allied" className="py-16 bg-[#0a1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Allied Products</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Complete Your <span className="gradient-text">Glass System</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Hardware, sealants, and profiles from verified suppliers — everything to finish the job.
          </p>
        </div>

        <div className="space-y-10">
          {ALLIED_CATEGORIES.map(cat => (
            <div key={cat.category}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  {cat.icon}
                </div>
                <h3 className="text-white font-bold text-lg">{cat.category}</h3>
              </div>
              <div className="scroll-x pb-2">
                <div className="flex gap-4" style={{ minWidth: "max-content" }}>
                  {cat.products.map(product => (
                    <div
                      key={product.id}
                      className="glass-card rounded-2xl p-5 flex flex-col gap-3"
                      style={{ width: "260px" }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm leading-snug">{product.name}</p>
                        <p className="text-slate-500 text-xs mt-1">{product.desc}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="gradient-text-gold font-bold text-base">₹{product.price.toLocaleString("en-IN")}</p>
                          <p className="text-slate-600 text-[11px]">per {product.unit}</p>
                        </div>
                        <button
                          onClick={() => handleAdd(product)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                            addedItems[product.id]
                              ? "bg-green-500/15 border border-green-500/30 text-green-400"
                              : "bg-blue-600 hover:bg-blue-500 text-white"
                          }`}
                        >
                          {addedItems[product.id] ? `✓ ${addedItems[product.id]}` : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION 5 — SERVICE PARTNERS
// ─────────────────────────────────────────────────────────────

function ServiceSection() {
  const [requested, setRequested] = useState({});

  return (
    <section id="services" className="py-16 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Service Partners</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Get It Installed by{" "}
            <span className="gradient-text">Verified Professionals</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Pre-vetted glass installers, measurement experts and site supervisors across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {SERVICE_PARTNERS.map(p => (
            <div key={p.id} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-500/25 shrink-0">
                  {p.avatar}
                </div>
                <div>
                  <p className="font-bold text-white">{p.name}</p>
                  <p className="text-xs text-blue-400 font-medium">{p.role}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating value={p.rating} />
                <span className="text-xs text-slate-500">{p.jobs} jobs</span>
                <span className="text-xs text-slate-500 font-medium">{p.exp}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {p.location}
              </div>

              <div className="bg-white/3 rounded-xl p-3 border border-[#1e3a5f]/40">
                <p className="text-[10px] text-slate-600 uppercase tracking-wide mb-1">Specialization</p>
                <p className="text-slate-300 text-xs">{p.specialization}</p>
              </div>

              <button
                onClick={() => setRequested(prev => ({ ...prev, [p.id]: true }))}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  requested[p.id]
                    ? "bg-green-500/15 border border-green-500/30 text-green-400"
                    : "btn-primary"
                }`}
              >
                {requested[p.id] ? (
                  <span className="flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Visit Requested</span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Request Visit</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────

function Footer({ onScrollTo }) {
  return (
    <footer className="border-t border-[#1e3a5f]/50 bg-[#0a1628] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold gradient-text text-base">AmalGus</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[160px]">
              India's first smart glass marketplace connecting the entire supply chain.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-3 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Platform Live
            </div>
          </div>

          {[
            {
              title: "Marketplace",
              links: ["Glass Finder", "Product Catalog", "Daily Rates", "Bulk Orders"],
            },
            {
              title: "Services",
              links: ["Find Installer", "Measurement Visit", "Project Estimate", "Warranty"],
            },
            {
              title: "Company",
              links: ["About AmalGus", "For Vendors", "Blog", "Contact"],
            },
          ].map(col => (
            <div key={col.title}>
              <p className="text-white font-semibold text-sm mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-slate-500 text-xs hover:text-blue-400 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1e3a5f]/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© 2025 AmalGus Technologies Pvt. Ltd. · All rights reserved · Made in India 🇮🇳</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// CART PAGE
// ─────────────────────────────────────────────────────────────

function CartPage({ cartItems, onClose, onUpdateQty, onRemove }) {
  const [ordered, setOrdered] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;
  const fmtINR = n => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0F172A]/95 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-400" /> Your Cart
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="btn-secondary flex items-center gap-1.5 text-sm">
            <X className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-[#1e3a5f] mx-auto mb-4" />
            <p className="text-slate-400 text-base font-medium">Your cart is empty</p>
            <p className="text-slate-600 text-sm mt-1">Add products from the marketplace to get started.</p>
            <button onClick={onClose} className="btn-primary mt-6 inline-flex items-center gap-2">
              <ArrowRight className="w-4 h-4" /> Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map(item => (
                <div key={item.product.id} className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:!transform-none">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{item.product.name}</p>
                    <p className="text-slate-500 text-xs">{item.product.desc}</p>
                    <p className="text-blue-400 text-xs font-medium mt-0.5">{fmtINR(item.product.price)} / {item.product.unit}</p>
                  </div>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUpdateQty(item.product.id, item.qty - 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-[#1e3a5f]/60 text-slate-300 hover:border-blue-500/50 hover:text-white flex items-center justify-center text-base font-bold transition-all"
                    >
                      −
                    </button>
                    <span className="text-white font-bold text-sm w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item.product.id, item.qty + 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-[#1e3a5f]/60 text-slate-300 hover:border-blue-500/50 hover:text-white flex items-center justify-center text-base font-bold transition-all"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-bold text-sm">{fmtINR(item.product.price * item.qty)}</p>
                  </div>
                  <button onClick={() => onRemove(item.product.id)} className="text-slate-600 hover:text-red-400 transition-colors ml-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="quote-card mb-6">
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <Calculator className="w-4.5 h-4.5 text-blue-400" /> Order Summary
              </h3>
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-slate-400">{item.product.name} × {item.qty}</span>
                    <span className="text-slate-200">{fmtINR(item.product.price * item.qty)}</span>
                  </div>
                ))}
                <div className="h-px bg-[#1e3a5f]/60 my-1" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-200">{fmtINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">GST @ 18%</span>
                  <span className="text-slate-200">{fmtINR(gst)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Delivery</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="h-px bg-[#1e3a5f]/60 my-1" />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-white">Grand Total</span>
                  <span className="gradient-text text-lg">{fmtINR(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            {!ordered ? (
              <button
                onClick={() => setOrdered(true)}
                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" /> Proceed to Payment — {fmtINR(grandTotal)}
              </button>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center border !border-green-500/30 bg-green-500/5 hover:!transform-none animate-scale-in">
                <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-white font-bold text-base">Order Placed Successfully!</p>
                <p className="text-slate-400 text-sm mt-1">Our team will confirm within 2 hours. Check your email for the invoice.</p>
                <p className="gradient-text-gold font-bold text-lg mt-3">{fmtINR(grandTotal)} paid</p>
                <button onClick={onClose} className="btn-secondary mt-4 mx-auto flex items-center gap-2">
                  Back to Marketplace
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────

export default function App() {
  const [cartItems, setCartItems] = useState([]); // [{ product, qty }]
  const [showCart, setShowCart] = useState(false);
  const [activeFinder, setActiveFinder] = useState(null);
  const [customizerRec, setCustomizerRec] = useState(null);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const scrollTo = (section) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleUsecaseClick = (keyword) => {
    setActiveFinder(keyword);
    setTimeout(() => scrollTo("finder"), 50);
  };

  const handleCustomize = (rec) => {
    setCustomizerRec(rec);
    setTimeout(() => scrollTo("customizer"), 80);
  };

  const handleCloseCustomizer = () => {
    setCustomizerRec(null);
  };

  // Called from AlliedSection when user clicks "Add to Cart"
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
    setShowCart(true); // open cart page immediately
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty <= 0) {
      setCartItems(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setCartItems(prev => prev.map(i => i.product.id === productId ? { ...i, qty: newQty } : i));
    }
  };

  const handleRemove = (productId) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  return (
    <div className="min-h-screen">
      {/* Cart Page Overlay */}
      {showCart && (
        <CartPage
          cartItems={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
        />
      )}

      {/* Navbar */}
      <Navbar cartCount={cartCount} onScrollTo={scrollTo} onCartClick={() => setShowCart(true)} />

      {/* Section 1 — Hero, Ticker, Use Cases */}
      <HeroSection onScrollTo={scrollTo} onUsecaseClick={handleUsecaseClick} />

      <div className="section-divider" />

      {/* Section 2 — Smart Glass Finder */}
      <GlassFinderSection
        initialQuery={activeFinder}
        onCustomize={handleCustomize}
      />

      <div className="section-divider" />

      {/* Section 3 — Customizer (shown when user clicks "Customize & Quote") */}
      {customizerRec && (
        <>
          <CustomizerSection
            selectedRec={customizerRec}
            onClose={handleCloseCustomizer}
          />
          <div className="section-divider" />
        </>
      )}

      {/* Section 4 — Allied Products */}
      <AlliedSection onAddToCart={handleAddToCart} />

      <div className="section-divider" />

      {/* Section 5 — Service Partners */}
      <ServiceSection />

      <div className="section-divider" />

      {/* Footer */}
      <Footer onScrollTo={scrollTo} />
    </div>
  );
}
