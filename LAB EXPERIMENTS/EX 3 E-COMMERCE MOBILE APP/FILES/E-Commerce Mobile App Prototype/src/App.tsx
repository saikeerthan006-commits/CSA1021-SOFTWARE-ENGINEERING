import { useState } from "react";

type Screen =
  | "welcome"
  | "home"
  | "explore"
  | "details"
  | "cart"
  | "checkout"
  | "success"
  | "wishlist"
  | "profile";

const images = {
  hero: "https://images.unsplash.com/photo-1682364853446-db043f643207?auto=format&fit=crop&w=1000&q=85",
  sneaker: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=900&q=85",
  runner: "https://images.unsplash.com/photo-1518656306295-aa28b28b2504?auto=format&fit=crop&w=900&q=85",
  orange: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=85",
  headphones: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=85",
  watch: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=85",
  glasses: "https://images.unsplash.com/photo-1587304883252-dc18e6a7cbc8?auto=format&fit=crop&w=900&q=85",
  bag: "https://images.unsplash.com/photo-1680789526833-9b09dee3d68e?auto=format&fit=crop&w=900&q=85",
  perfume: "https://images.unsplash.com/photo-1641659671200-250fdb343b97?auto=format&fit=crop&w=900&q=85",
};

const products = [
  { name: "AirFlex Runner", category: "Shoes", image: images.sneaker, price: "₹3,499", old: "₹5,999", off: "42% OFF", rating: "4.8" },
  { name: "Aura Headphones", category: "Electronics", image: images.headphones, price: "₹4,299", old: "₹6,999", off: "38% OFF", rating: "4.7" },
  { name: "Pulse Smartwatch", category: "Electronics", image: images.watch, price: "₹5,499", old: "₹7,999", off: "31% OFF", rating: "4.6" },
  { name: "Cloud White 01", category: "Shoes", image: images.runner, price: "₹2,899", old: "₹4,499", off: "35% OFF", rating: "4.9" },
  { name: "Studio Carryall", category: "Fashion", image: images.bag, price: "₹2,199", old: "₹3,499", off: "37% OFF", rating: "4.5" },
  { name: "Noir Sunglasses", category: "Accessories", image: images.glasses, price: "₹1,499", old: "₹2,299", off: "34% OFF", rating: "4.7" },
  { name: "Velocity Orange", category: "Shoes", image: images.orange, price: "₹3,799", old: "₹5,499", off: "31% OFF", rating: "4.6" },
  { name: "Sonic Pro Headset", category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", price: "₹3,999", old: "₹5,799", off: "31% OFF", rating: "4.8" },
  { name: "Classic Steel Watch", category: "Watches", image: "https://images.unsplash.com/photo-1616640045164-deb3b104c4b6?auto=format&fit=crop&w=900&q=85", price: "₹6,499", old: "₹8,999", off: "28% OFF", rating: "4.7" },
  { name: "Élan No. 08", category: "Beauty", image: images.perfume, price: "₹2,599", old: "₹3,799", off: "32% OFF", rating: "4.5" },
  { name: "Urban Black Runner", category: "Shoes", image: "https://images.unsplash.com/photo-1632497775897-815042a13216?auto=format&fit=crop&w=900&q=85", price: "₹4,199", old: "₹6,499", off: "35% OFF", rating: "4.6" },
  { name: "Rose Audio Max", category: "Electronics", image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=900&q=85", price: "₹4,899", old: "₹7,299", off: "33% OFF", rating: "4.9" },
];

function Icon({ name, size = 20, filled = false }: { name: string; size?: number; filled?: boolean }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    bag: <><path d="M6 8h12l1 13H5L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    share: <><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Action({ children, onClick, variant = "primary", className = "" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost"; className?: string }) {
  return <button className={`action action-${variant} ${className}`} onClick={onClick}>{children}</button>;
}

function TopBar({ title, back, right }: { title: string; back?: () => void; right?: React.ReactNode }) {
  return <div className="topbar">
    {back ? <button className="icon-button" onClick={back} aria-label="Back"><Icon name="back" /></button> : <span className="top-spacer" />}
    <div className="screen-title">{title}</div>
    <div className="top-action">{right || <span className="top-spacer" />}</div>
  </div>;
}

function Search({ onClick }: { onClick?: () => void }) {
  return <button className="searchbar" onClick={onClick}><Icon name="search" size={19} /><span>Search products, brands and categories...</span></button>;
}

function ProductCard({ product, compact = false, onClick, wishlist = false }: { product: typeof products[0]; compact?: boolean; onClick?: () => void; wishlist?: boolean }) {
  const [liked, setLiked] = useState(wishlist);
  const [added, setAdded] = useState(false);
  return <article className={`product-card ${compact ? "compact" : ""}`} onClick={onClick}>
    <div className="product-image-wrap">
      <img src={product.image} alt={product.name} className="product-image" />
      <button className={`heart-button ${liked ? "active" : ""}`} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"} onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}><Icon name="heart" size={17} filled={liked} /></button>
      <span className="discount-chip">{product.off}</span>
    </div>
    <div className="product-copy">
      <div className="product-name">{product.name}</div>
      <div className="rating"><span>★</span> {product.rating} <small>(128)</small></div>
      <div className="price-row"><strong>{product.price}</strong><del>{product.old}</del>{compact && <button className={`mini-add ${added ? "added" : ""}`} onClick={(e) => { e.stopPropagation(); setAdded(!added); }}>{added ? "Added ✓" : "Add"}</button>}</div>
    </div>
  </article>;
}

function BottomNav({ current, go }: { current: Screen; go: (s: Screen) => void }) {
  const tabs: { label: string; icon: string; screen: Screen }[] = [
    { label: "Home", icon: "home", screen: "home" }, { label: "Explore", icon: "grid", screen: "explore" },
    { label: "Wishlist", icon: "heart", screen: "wishlist" }, { label: "Cart", icon: "bag", screen: "cart" },
    { label: "Profile", icon: "user", screen: "profile" },
  ];
  return <nav className="bottom-nav">{tabs.map((tab) => <button key={tab.label} className={current === tab.screen ? "active" : ""} onClick={() => go(tab.screen)}><Icon name={tab.icon} size={20} filled={current === tab.screen && tab.icon === "heart"} /><span>{tab.label}</span>{tab.label === "Cart" && <i>2</i>}</button>)}</nav>;
}

function Welcome({ go }: { go: (s: Screen) => void }) {
  return <div className="welcome screen">
    <div className="brand"><span className="brand-mark">S</span><span>shoply</span></div>
    <div className="welcome-visual">
      <img src={images.hero} alt="Curated fashion accessories" />
      <span className="float-tag tag-one">New arrivals</span><span className="float-tag tag-two">Free delivery</span>
    </div>
    <div className="welcome-copy">
      <span className="eyebrow">CURATED FOR YOU</span>
      <h1>Everything You Love,<br />In One Place.</h1>
      <p>Discover products you'll love, delivered right to your door.</p>
      <Action onClick={() => go("home")} className="full">Start Shopping <span>→</span></Action>
      <button className="signin">Already have an account? <strong>Sign In</strong></button>
    </div>
  </div>;
}

function Home({ go }: { go: (s: Screen) => void }) {
  const [version, setVersion] = useState<"A" | "B">("A");
  return <div className="screen with-nav">
    <div className="home-head">
      <div><span>Good morning</span><h2>Find something<br />you'll love.</h2></div>
      <div className="head-actions"><button className="icon-button"><Icon name="bell" size={19} /></button><button className="avatar">AJ</button></div>
    </div>
    <div className="direction-switch">
      <button className={version === "A" ? "selected" : ""} onClick={() => setVersion("A")}><b>A</b> Visual / Premium</button>
      <button className={version === "B" ? "selected" : ""} onClick={() => setVersion("B")}><b>B</b> Shopping Efficiency</button>
    </div>
    <div className="direction-label">Design Direction {version} — {version === "A" ? "Visual / Premium" : "Information / Shopping Efficiency"}</div>
    <Search onClick={() => go("explore")} />
    {version === "A" ? <VisualHome go={go} /> : <EfficientHome go={go} />}
    <BottomNav current="home" go={go} />
  </div>;
}

const categories = ["Fashion", "Electronics", "Beauty", "Shoes", "Watches", "Accessories"];

function VisualHome({ go }: { go: (s: Screen) => void }) {
  return <>
    <section className="promo visual-promo">
      <div><span>MEGA SALE</span><h3>Up to 50%<br />OFF</h3><button onClick={() => go("explore")}>Shop Now <b>→</b></button></div>
      <img src={images.orange} alt="Featured sneaker" />
    </section>
    <div className="section-heading"><h3>Shop by category</h3><button onClick={() => go("explore")}>See all</button></div>
    <div className="categories">{categories.map((cat, i) => <button onClick={() => go("explore")} key={cat}><span><img src={products[i % products.length].image} alt="" /></span>{cat}</button>)}</div>
    <div className="section-heading"><h3>Trending Now</h3><button onClick={() => go("explore")}>See all</button></div>
    <div className="product-scroll">{products.slice(0, 4).map((p) => <ProductCard key={p.name} product={p} onClick={() => go("details")} />)}</div>
  </>;
}

function EfficientHome({ go }: { go: (s: Screen) => void }) {
  const [category, setCategory] = useState("All");
  const visible = category === "All" ? products.slice(0, 6) : products.filter((product) => product.category === category).slice(0, 6);
  return <>
    <div className="quick-categories">{["All", ...categories].map((x) => <button onClick={() => setCategory(x)} className={category === x ? "active" : ""} key={x}>{x}</button>)}</div>
    <section className="promo compact-promo"><div><span>MEGA SALE</span><h3>Top deals, up to 50% off</h3><button onClick={() => go("explore")}>View deals →</button></div><img src={images.sneaker} alt="Sale sneaker" /></section>
    <div className="info-strip"><span><b>Free</b> delivery</span><span><b>Easy</b> returns</span><span><b>Secure</b> pay</span></div>
    <div className="section-heading"><h3>Recommended for you</h3><button onClick={() => go("explore")}><Icon name="filter" size={16} /> Filter</button></div>
    <div className="efficient-grid">{visible.map((p) => <ProductCard compact key={p.name} product={p} onClick={() => go("details")} />)}</div>
  </>;
}

function Explore({ go }: { go: (s: Screen) => void }) {
  const [filter, setFilter] = useState(false);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Recommended");
  const categoryOptions = ["All", "Fashion", "Electronics", "Shoes", "Beauty", "Watches", "Accessories"];
  const sortOptions = ["Recommended", "Price: Low", "Price: High", "Top Rated"];
  const filtered = category === "All" ? products : products.filter((product) => product.category === category);
  const visibleProducts = [...filtered].sort((a, b) => {
    const price = (value: string) => Number(value.replace(/[₹,]/g, ""));
    if (sort === "Price: Low") return price(a.price) - price(b.price);
    if (sort === "Price: High") return price(b.price) - price(a.price);
    if (sort === "Top Rated") return Number(b.rating) - Number(a.rating);
    return 0;
  });
  return <div className="screen with-nav">
    <TopBar title="Explore" right={<button className="icon-button"><Icon name="bag" size={19} /></button>} />
    <Search />
    <div className="filter-row"><button className={category !== "All" ? "selected-filter" : ""} onClick={() => setCategory(categoryOptions[(categoryOptions.indexOf(category) + 1) % categoryOptions.length])}>{category === "All" ? "Categories" : category} <span>⌄</span></button><button onClick={() => setFilter(true)}><Icon name="filter" size={15} /> Filter</button><button className={sort !== "Recommended" ? "selected-filter" : ""} onClick={() => setSort(sortOptions[(sortOptions.indexOf(sort) + 1) % sortOptions.length])}>{sort === "Recommended" ? "Sort By" : sort} <span>⌄</span></button></div>
    <div className="result-row"><strong>{category === "All" ? "Popular products" : category}</strong><span>{visibleProducts.length} items</span></div>
    <div className="product-grid">{visibleProducts.map((p) => <ProductCard compact key={p.name} product={p} onClick={() => go("details")} />)}</div>
    <BottomNav current="explore" go={go} />
    {filter && <FilterSheet close={() => setFilter(false)} />}
  </div>;
}

function FilterSheet({ close }: { close: () => void }) {
  const [category, setCategory] = useState("Shoes");
  const [size, setSize] = useState("M");
  const [sort, setSort] = useState("Recommended");
  return <div className="sheet-overlay" onClick={close}><div className="sheet" onClick={(e) => e.stopPropagation()}>
    <div className="sheet-handle" />
    <div className="sheet-head"><h2>Filters & Sort</h2><button onClick={close}>×</button></div>
    <h4>Categories</h4><div className="choice-grid">{["Fashion", "Electronics", "Shoes", "Beauty", "Accessories"].map((x) => <button className={category === x ? "active" : ""} onClick={() => setCategory(x)} key={x}>{x}</button>)}</div>
    <div className="filter-title"><h4>Price Range</h4><strong>₹500 — ₹10,000</strong></div><div className="range"><span /><i /><b /><em /></div>
    <h4>Rating</h4><div className="ratings">{["★★★★★  4.5 & up", "★★★★☆  4.0 & up", "★★★☆☆  3.0 & up"].map((x, i) => <button className={i === 0 ? "active" : ""} key={x}>{x}</button>)}</div>
    <h4>Size</h4><div className="sizes">{["S", "M", "L", "XL"].map((x) => <button onClick={() => setSize(x)} className={size === x ? "active" : ""} key={x}>{x}</button>)}</div>
    <h4>Sort By</h4><div className="sort-list">{["Recommended", "Price: Low to High", "Price: High to Low", "Customer Rating", "Newest"].map((x) => <button onClick={() => setSort(x)} key={x}><span className={sort === x ? "radio on" : "radio"} />{x}</button>)}</div>
    <div className="sheet-actions"><Action variant="secondary" onClick={close}>Reset</Action><Action onClick={close}>Apply Filters</Action></div>
  </div></div>;
}

function Details({ go }: { go: (s: Screen) => void }) {
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  return <div className="screen detail-screen">
    <div className="detail-image">
      <img src={images.sneaker} alt="AirFlex Runner white sneaker" />
      <div className="detail-controls"><button onClick={() => go("home")}><Icon name="back" /></button><div><button><Icon name="heart" /></button><button><Icon name="share" /></button></div></div>
      <div className="dots"><b /><span /><span /></div>
    </div>
    <main className="detail-copy">
      <div className="detail-brand">STRIDE · PERFORMANCE</div><h1>AirFlex Runner</h1>
      <div className="detail-rating"><span>★ 4.8</span><u>1,284 reviews</u></div>
      <div className="detail-price"><strong>₹3,499</strong><del>₹5,999</del><span>42% OFF</span></div>
      <div className="benefits"><div><b>✓</b><span>Free<br />delivery</span></div><div><b>↺</b><span>7-day easy<br />returns</span></div><div><b>⌁</b><span>Secure<br />payment</span></div></div>
      <section><h3>Product details</h3><p>Lightweight everyday running shoes designed for comfort, durability and all-day performance.</p></section>
      <div className="select-head"><h3>Select Size</h3><button>Size guide</button></div>
      <div className="sizes large">{["S", "M", "L", "XL"].map((x) => <button onClick={() => setSize(x)} className={size === x ? "active" : ""} key={x}>{x}</button>)}</div>
      <div className="quantity-row"><h3>Quantity</h3><div><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span><button onClick={() => setQty(qty + 1)}>+</button></div></div>
      <div className="section-heading"><h3>You may also like</h3><button>See all</button></div>
      <div className="product-scroll small">{products.slice(1, 4).map((p) => <ProductCard key={p.name} product={p} />)}</div>
    </main>
    <div className="sticky-actions"><Action variant="secondary" onClick={() => go("cart")}>Add to Cart</Action><Action onClick={() => go("checkout")}>Buy Now</Action></div>
  </div>;
}

function Qty() {
  const [qty, setQty] = useState(1);
  return <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span>{qty}</span><button onClick={() => setQty(qty + 1)}>+</button></div>;
}

function Cart({ go }: { go: (s: Screen) => void }) {
  return <div className="screen with-nav cart-screen">
    <TopBar title="Your Cart" back={() => go("home")} right={<span className="muted">2 items</span>} />
    <div className="cart-items">{products.slice(0, 2).map((p, i) => <div className="cart-item" key={p.name}><img src={p.image} alt={p.name} /><div className="cart-copy"><div><h3>{p.name}</h3><button><Icon name="trash" size={17} /></button></div><p>{i ? "Color: Midnight" : "Size: 9 · White"}</p><strong>{p.price}</strong><Qty /></div></div>)}</div>
    <div className="coupon"><h3>Have a coupon?</h3><div><input placeholder="Enter promo code" /><button>Apply</button></div></div>
    <div className="summary"><h3>Order summary</h3><p><span>Subtotal</span><b>₹7,798</b></p><p className="saving"><span>Discount</span><b>−₹1,800</b></p><p><span>Delivery</span><b className="green">FREE</b></p><hr /><p className="total"><span>Total</span><b>₹5,998</b></p><small>You saved ₹1,800 on this order</small></div>
    <div className="cart-cta"><Action className="full" onClick={() => go("checkout")}>Proceed to Checkout <span>₹5,998 →</span></Action></div>
    <BottomNav current="cart" go={go} />
  </div>;
}

function Checkout({ go }: { go: (s: Screen) => void }) {
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("card");
  const [upiId, setUpiId] = useState("");
  const [upiStatus, setUpiStatus] = useState<"idle" | "error" | "verified">("idle");
  const verifyUpi = () => {
    setUpiStatus(/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim()) ? "verified" : "error");
  };
  const canPlaceOrder = payment !== "upi" || upiStatus === "verified";
  return <div className="screen checkout-screen">
    <TopBar title="Checkout" back={() => go("cart")} right={<span className="secure">Secure</span>} />
    <section className="checkout-section"><div className="section-heading"><h3>Delivery Address</h3><button>Change</button></div><div className="address-card"><span className="round-icon"><Icon name="pin" /></span><div><b>Home</b><p>Alex Johnson<br />123, Example Street<br />Chennai, Tamil Nadu 600018</p></div><span className="check"><Icon name="check" size={14} /></span></div></section>
    <section className="checkout-section"><h3>Delivery Method</h3><label className={delivery === "standard" ? "option-card selected" : "option-card"}><input type="radio" checked={delivery === "standard"} onChange={() => setDelivery("standard")} /><span className="delivery-symbol">↗</span><div><b>Standard Delivery</b><small>3–5 business days</small></div><strong>FREE</strong></label><label className={delivery === "express" ? "option-card selected" : "option-card"}><input type="radio" checked={delivery === "express"} onChange={() => setDelivery("express")} /><span className="delivery-symbol">ϟ</span><div><b>Express Delivery</b><small>1–2 business days</small></div><strong>₹99</strong></label></section>
    <section className="checkout-section"><h3>Payment Method</h3>{[["card", "card", "Credit / Debit Card", "•••• 4821"], ["upi", "grid", "UPI", "Google Pay, PhonePe & more"], ["cod", "box", "Cash on Delivery", "Pay when your order arrives"]].map(([id, icon, title, sub]) => <div key={id}>
      <label className={payment === id ? "option-card selected" : "option-card"}><input type="radio" checked={payment === id} onChange={() => setPayment(id)} /><span className="round-icon"><Icon name={icon} size={18} /></span><div><b>{title}</b><small>{sub}</small></div><span className={payment === id ? "radio on" : "radio"} /></label>
      {id === "upi" && payment === "upi" && <div className={`upi-panel ${upiStatus}`}>
        <label htmlFor="upi-id">Enter your UPI ID</label>
        <div className="upi-entry">
          <input id="upi-id" value={upiId} onChange={(event) => { setUpiId(event.target.value); setUpiStatus("idle"); }} onKeyDown={(event) => event.key === "Enter" && verifyUpi()} placeholder="name@bank" autoComplete="off" />
          <button onClick={verifyUpi}>{upiStatus === "verified" ? "Verified" : "Verify"}</button>
        </div>
        {upiStatus === "error" && <p>Please enter a valid UPI ID, for example alex@okaxis.</p>}
        {upiStatus === "verified" && <p><Icon name="check" size={13} /> UPI ID verified. You can place your order.</p>}
        <small>Payment request will be sent to the UPI app linked to this ID.</small>
      </div>}
    </div>)}</section>
    <section className="summary checkout-summary"><h3>Order Total</h3><p><span>Subtotal</span><b>₹7,798</b></p><p><span>Delivery</span><b className="green">FREE</b></p><p className="saving"><span>Discount</span><b>−₹1,800</b></p><hr /><p className="total"><span>Total</span><b>₹5,998</b></p></section>
    <div className="checkout-cta"><button className="action action-primary full" disabled={!canPlaceOrder} onClick={() => canPlaceOrder && go("success")}>{canPlaceOrder ? "Place Order — ₹5,998" : "Verify UPI ID to continue"} <span>→</span></button><small>By placing your order, you agree to our terms and privacy policy.</small></div>
  </div>;
}

function Success({ go }: { go: (s: Screen) => void }) {
  return <div className="screen success-screen">
    <div className="success-brand"><span className="brand-mark">S</span></div>
    <div className="success-visual"><div className="success-ring"><Icon name="check" size={38} /></div><i className="confetti c1" /><i className="confetti c2" /><i className="confetti c3" /><i className="confetti c4" /></div>
    <h1>Order Confirmed! <span>🎉</span></h1><p>Your order has been successfully placed.</p>
    <div className="order-card"><div><span>ORDER NUMBER</span><strong>#EC20261005</strong></div><div className="order-products"><img src={images.sneaker} alt="Sneaker" /><img src={images.headphones} alt="Headphones" /><span>+2</span></div><hr /><div className="delivery-date"><span className="round-icon"><Icon name="box" /></span><p>Expected delivery<strong>October 8–10</strong></p></div></div>
    <div className="success-actions"><Action className="full">Track Order</Action><Action className="full" variant="secondary" onClick={() => go("home")}>Continue Shopping</Action></div>
  </div>;
}

function Wishlist({ go }: { go: (s: Screen) => void }) {
  return <div className="screen with-nav">
    <TopBar title="My Wishlist" right={<span className="muted">6 items</span>} />
    <div className="wishlist-note"><span><Icon name="heart" size={17} filled /></span><p><b>Your saved finds</b><small>Prices may change. Shop them before they're gone.</small></p></div>
    <div className="product-grid wishlist-grid">{products.slice(0, 8).map((p) => <div key={p.name}><ProductCard compact wishlist product={p} onClick={() => go("details")} /><Action className="full" variant="secondary" onClick={() => go("cart")}>Add to Cart</Action></div>)}</div>
    <BottomNav current="wishlist" go={go} />
  </div>;
}

function Profile({ go }: { go: (s: Screen) => void }) {
  const menu = [["box", "My Orders", "Track, return or buy again"], ["heart", "Wishlist", "6 saved items"], ["pin", "Saved Addresses", "2 delivery addresses"], ["card", "Payment Methods", "Cards, UPI & more"], ["bell", "Notifications", "Offers and order updates"], ["user", "Help & Support", "We're here for you"], ["settings", "Settings", "Privacy and preferences"]];
  return <div className="screen with-nav profile-screen">
    <TopBar title="Profile" right={<button className="icon-button"><Icon name="settings" size={18} /></button>} />
    <div className="profile-head"><div className="large-avatar">AJ<span /></div><h2>Alex Johnson</h2><p>alex@example.com</p><button>Edit profile</button></div>
    <div className="profile-stats"><div><strong>12</strong><span>Orders</span></div><div><strong>6</strong><span>Wishlist</span></div><div><strong>480</strong><span>Reward points</span></div></div>
    <div className="profile-menu">{menu.map(([icon, title, sub]) => <button key={title} onClick={() => title === "Wishlist" && go("wishlist")}><span className="menu-icon"><Icon name={icon} size={19} /></span><p><b>{title}</b><small>{sub}</small></p><Icon name="chevron" size={17} /></button>)}</div>
    <BottomNav current="profile" go={go} />
  </div>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const screens = { welcome: <Welcome go={setScreen} />, home: <Home go={setScreen} />, explore: <Explore go={setScreen} />, details: <Details go={setScreen} />, cart: <Cart go={setScreen} />, checkout: <Checkout go={setScreen} />, success: <Success go={setScreen} />, wishlist: <Wishlist go={setScreen} />, profile: <Profile go={setScreen} /> };
  return <div className="prototype-stage"><div className="phone-shell">{screens[screen]}</div><aside className="review-note"><span>STAKEHOLDER REVIEW PROTOTYPE</span><h2>Shoply Mobile<br />Commerce</h2><p>Explore the complete purchase journey and compare both home design directions.</p><div><i /><span>Interactive prototype</span></div></aside></div>;
}
