import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from './DatabaseContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { db, saveDB } = useDatabase();

  // Carousel State
  const [slideIndex, setSlideIndex] = useState(0);
  const heroSlides = ['hero_slide1.png', 'hero_slide2.png', 'hero_slide3.png'];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Modal States
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  // Form inputs - Signup
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAddress, setSignupAddress] = useState('');

  // Form inputs - Login
  const [loginRole, setLoginRole] = useState('admin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form inputs - PIN/Staff Auth
  const [signInRole, setSignInRole] = useState('Admin');
  const [signInPin, setSignInPin] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPass, setSignInPass] = useState('');

  // Order Tracking State
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState('');

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupName) return;

    // Check if user already exists
    const emailLower = signupEmail.trim().toLowerCase();
    const existing = db.users.find((u) => u.email.toLowerCase() === emailLower);
    if (existing) {
      alert('Email already registered.');
      return;
    }

    const newId = 'cust-' + (db.customers.length + 1);
    const newCustomer = {
      id: newId,
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
      address: signupAddress,
      walletBalance: 0,
      loyaltyPoints: 0,
      creditBalance: 0,
      notes: 'New account created via landing sign up',
      password: signupPassword,
    };

    const newUser = {
      id: 'u-' + (db.users.length + 1),
      name: signupName,
      role: 'customer' as const,
      email: signupEmail,
      password: signupPassword,
      phone: signupPhone,
      address: signupAddress,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    saveDB({
      customers: [...db.customers, newCustomer],
      users: [...db.users, newUser],
    });

    // Auto log in customer
    localStorage.setItem('ll_active_customer_id', newCustomer.id);
    localStorage.setItem('ll_active_workspace', 'customer');
    setShowSignUp(false);
    navigate('/customer');
  };

  const handleLogInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const pass = loginPassword;
    const role = loginRole;

    // Admin credentials bypass / strict check
    if (email === 'admin@laundra.com' && pass === 'admin' && role === 'admin') {
      saveDB({ activeRole: 'Admin', currentDeliveryBoy: null });
      localStorage.setItem('ll_activerole', 'Admin');
      localStorage.removeItem('ll_active_delivery_boy');
      localStorage.setItem('ll_active_workspace', 'admin');
      setShowLogIn(false);
      navigate('/admin');
      return;
    }

    // Normal check
    const user = db.users.find(
      (u) => u.email.trim().toLowerCase() === email && u.password === pass && u.role === role
    );

    if (!user) {
      alert('Invalid Email or Password for the selected Portal.');
      return;
    }

    setShowLogIn(false);

    if (role === 'admin') {
      saveDB({ activeRole: 'Admin', currentDeliveryBoy: null });
      localStorage.setItem('ll_activerole', 'Admin');
      localStorage.removeItem('ll_active_delivery_boy');
      localStorage.setItem('ll_active_workspace', 'admin');
      navigate('/admin');
    } else if (role === 'delivery') {
      saveDB({ activeRole: 'Delivery Boy', currentDeliveryBoy: user.name });
      localStorage.setItem('ll_activerole', 'Delivery Boy');
      localStorage.setItem('ll_active_delivery_boy', user.name);
      localStorage.setItem('ll_active_workspace', 'admin');
      navigate('/admin');
    } else if (role === 'customer') {
      const customer = db.customers.find((c) => c.email.trim().toLowerCase() === email);
      if (customer) {
        localStorage.setItem('ll_active_customer_id', customer.id);
        localStorage.setItem('ll_active_workspace', 'customer');
        navigate('/customer');
      } else {
        alert('Customer record not found.');
      }
    }
  };

  const handleStaffSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInRole === 'Customer') {
      const email = signInEmail.trim().toLowerCase();
      const pass = signInPass;
      const cust = db.customers.find((c) => c.email === email && c.password === pass);
      if (!cust) {
        alert('Invalid Customer Email or Password.');
        return;
      }
      setShowSignIn(false);
      localStorage.setItem('ll_active_customer_id', cust.id);
      localStorage.setItem('ll_active_workspace', 'customer');
      navigate('/customer');
      return;
    }

    // Staff Pin sign-in
    if (signInPin.trim() !== '') {
      setShowSignIn(false);
      if (signInRole === 'Delivery Boy') {
        saveDB({ activeRole: 'Delivery Boy', currentDeliveryBoy: 'John Doe' });
        localStorage.setItem('ll_activerole', 'Delivery Boy');
        localStorage.setItem('ll_active_delivery_boy', 'John Doe');
        localStorage.setItem('ll_active_workspace', 'admin');
        navigate('/admin');
      } else if (signInRole === 'Cashier') {
        saveDB({ activeRole: 'Cashier', currentDeliveryBoy: null });
        localStorage.setItem('ll_activerole', 'Cashier');
        localStorage.removeItem('ll_active_delivery_boy');
        localStorage.setItem('ll_active_workspace', 'admin');
        navigate('/admin');
      } else {
        saveDB({ activeRole: 'Admin', currentDeliveryBoy: null });
        localStorage.setItem('ll_activerole', 'Admin');
        localStorage.removeItem('ll_active_delivery_boy');
        localStorage.setItem('ll_active_workspace', 'admin');
        navigate('/admin');
      }
    }
  };

  const handleTrackOrder = () => {
    setTrackError('');
    setTrackResult(null);

    const matchId = trackInput.trim().toUpperCase().replace('#', '');
    if (!matchId) return;

    const order = db.orders.find((o) => o.id === matchId || o.id === 'OR-' + matchId);
    if (!order) {
      setTrackError(`No order found matching ID: #${matchId}`);
      return;
    }

    // Map internal "Received" status to "Picked Up" for customer visualization
    const displayStatus = order.status === 'Received' ? 'Picked Up' : order.status;
    setTrackResult({ ...order, displayStatus });
  };

  const openOrderWizard = () => {
    // Navigate to customer portal which automatically opens order wizard or customer dashboard
    const activeCustId = localStorage.getItem('ll_active_customer_id');
    if (activeCustId) {
      navigate('/customer');
    } else {
      setShowLogIn(true);
      setLoginRole('customer');
    }
  };

  const handleLandingCardClick = (targetPortal: string, _subsection?: string) => {
    const isGuest = !localStorage.getItem('ll_activerole') && !localStorage.getItem('ll_active_customer_id');
    if (isGuest) {
      setShowLogIn(true);
      setLoginRole(targetPortal === 'customer' ? 'customer' : targetPortal === 'delivery' ? 'delivery' : 'admin');
      alert('Please log in to access this workspace.');
    } else {
      if (targetPortal === 'customer') {
        navigate('/customer');
      } else {
        navigate('/admin');
      }
    }
  };

  return (
    <div className="landing-container" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Landing Header */}
      <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 8%', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ color: '#1d4ed8', fontSize: '1.6rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>Laundra</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" onClick={() => setShowSignIn(true)} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.88rem' }}>PIN Sign In</button>
          <button className="secondary-btn" onClick={() => setShowLogIn(true)} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.88rem' }}>Portal Login</button>
          <button className="primary-btn" onClick={() => setShowSignUp(true)} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.88rem', background: '#2563eb', color: 'white' }}>Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section hero-split" style={{ display: 'flex', gap: '40px', padding: '80px 8%', alignItems: 'center' }}>
        <div className="hero-left" style={{ flex: 1 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '20px', color: '#0f172a' }}>The operating system for modern garment care.</h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '32px' }}>Run your entire laundry business from one place — POS, orders, delivery, pricing, promotions and analytics. Built for retail counters, multi-branch operators and commercial laundries.</p>
          <div className="cta-row">
            <button className="primary-btn" onClick={openOrderWizard} style={{ fontSize: '1.05rem', padding: '14px 32px', borderRadius: '12px', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', boxShadow: '0 6px 20px rgba(37,99,235,0.4)', fontWeight: '800', border: 'none', color: 'white', cursor: 'pointer' }}>
              🛒 &nbsp;Place an Order
            </button>
          </div>
        </div>
        <div className="hero-image-container" style={{ flex: 1, position: 'relative', height: '400px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
          {heroSlides.map((slide, idx) => (
            <img
              key={slide}
              src={`/${slide}`}
              alt={`Laundra Dashboard Slide ${idx + 1}`}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: idx === slideIndex ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
              }}
            />
          ))}
        </div>
      </section>

      {/* Modules Grid */}
      <section className="modules-section" id="modules" style={{ padding: '60px 8%' }}>
        <div className="modules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="module-card" onClick={() => handleLandingCardClick('admin', 'pricing')} style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
            <div className="module-icon-box" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '20px' }}>🏷️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Smart pricing</h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>Category, customer, bulk and hotel pricing with seasonal offers — configured once, applied everywhere.</p>
          </div>
          <div className="module-card" onClick={() => handleLandingCardClick('admin', 'customers')} style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
            <div className="module-icon-box" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '20px' }}>👥</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Customer CRM</h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>Wallet, credit, history, loyalty points and personal notes — a complete profile behind every order.</p>
          </div>
          <div className="module-card" onClick={() => handleLandingCardClick('admin')} style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
            <div className="module-icon-box" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '20px' }}>📢</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Promotions & campaigns</h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>Festival offers, promo codes, SMS/WhatsApp campaigns and birthday wishes to keep customers coming back.</p>
          </div>
          <div className="module-card" onClick={() => handleLandingCardClick('admin', 'reports')} style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
            <div className="module-icon-box" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#faf5ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '20px' }}>📊</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Reports & analytics</h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>Sales, collections, expenses, profit, GST and branch reports with daily closing summaries.</p>
          </div>
          <div className="module-card" onClick={() => handleLandingCardClick('admin', 'expenses')} style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
            <div className="module-icon-box" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fffbeb', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '20px' }}>💼</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Expense & day book</h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>Track daily expenses by category and review a clean day book for every branch you operate.</p>
          </div>
          <div className="module-card" onClick={() => handleLandingCardClick('admin')} style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
            <div className="module-icon-box" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '20px' }}>🛡️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Roles & audit logs</h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.5 }}>Admin, cashier, delivery boy, manager — permission-based access with full audit trails.</p>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="services-section" style={{ padding: '60px 8%', background: 'white' }}>
        <div className="services-head" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Every service category, priced and tracked.</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6 }}>Configure categories, bulk contracts and hotel pricing once. Rules apply automatically at the POS, on the customer portal and across every delivery.</p>
        </div>
        
        <div className="service-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {['Wash & Fold', 'Dry Cleaning', 'Steam Press', 'Premium Services', 'Express Services', 'Hotel Laundry', 'Commercial Laundry'].map((cat, idx) => {
            const thumbs = [
              'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=300'
            ];
            return (
              <div key={cat} className="service-category-card" onClick={() => handleLandingCardClick('admin')} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                <img src={thumbs[idx]} alt={cat} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontWeight: '700', fontSize: '1rem', margin: '0 0 8px 0' }}>{cat}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Priced, packed and processed safely under laundry standards.</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Order Tracking section */}
      <section id="tracking" style={{ padding: '80px 8%', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center', maxWidth: '1100px', margin: '0 auto' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', lineHeight: 1.2 }}>Live Order Tracking for Every Customer</h2>
            <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.7, marginBottom: '28px' }}>Customers receive SMS updates and can track their garment's journey from pickup → washing → pressing → delivery on a real-time progress map.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: '600' }}>
                <span style={{ width: '28px', height: '28px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem' }}>✓</span>
                Real-time GPS courier location
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: '600' }}>
                <span style={{ width: '28px', height: '28px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem' }}>✓</span>
                Auto SMS + WhatsApp status alerts
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: '600' }}>
                <span style={{ width: '28px', height: '28px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem' }}>✓</span>
                6-stage pipeline tracker on customer portal
              </li>
            </ul>
          </div>
          
          <div style={{ background: '#f0f7ff', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1.5px solid #bfdbfe', boxShadow: '0 10px 25px -5px rgba(59,130,246,0.05)' }}>
            <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#2563eb', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Track Order Status</div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>Enter your Order ID below to track your garment's live journey.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="e.g. #OR-8842"
                style={{ flex: 1, padding: '12px 16px', border: '2px solid #cbd5e1', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTrackOrder(); }}
              />
              <button onClick={handleTrackOrder} className="primary-btn" style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', background: '#2563eb', color: 'white', border: 'none' }}>
                Track
              </button>
            </div>
            
            {trackError && <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: '600' }}>⚠️ {trackError}</div>}
            
            {trackResult && (
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '800' }}>#{trackResult.id}</span>
                  <span className={`status-badge status-${trackResult.displayStatus.toLowerCase().replace(/\s+/g,'-')}`} style={{ fontSize: '0.78rem' }}>
                    {trackResult.displayStatus}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Customer:</strong> {trackResult.customerName}</div>
                  <div><strong>Branch:</strong> {trackResult.branch}</div>
                  <div><strong>Items:</strong> {trackResult.weightItems}</div>
                  {trackResult.courier && <div><strong>Courier:</strong> {trackResult.courier}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SAAS Closing Statistics Banner */}
      <section className="analytics-banner" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', padding: '80px 8%', background: '#0f172a', color: 'white' }}>
        <div className="analytics-left" style={{ flex: 1.5 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px', lineHeight: 1.2 }}>Close the day with confidence.</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>Sales, collections, pending orders, expenses, profit and GST — daily closing reports generated automatically, exportable to Excel and PDF, ready for every branch.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="primary-btn" style={{ background: 'white', color: '#0f172a', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '700' }} onClick={() => handleLandingCardClick('admin', 'reports')}>Book a walkthrough</button>
            <button className="secondary-btn" style={{ border: '1px solid #475569', color: 'white', background: 'transparent', padding: '12px 24px', borderRadius: '8px', fontWeight: '700' }} onClick={() => alert('Brochure download (TODO)')}>Download brochure</button>
          </div>
        </div>
        <div className="analytics-right-grid" style={{ flex: 1.2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>SALES THIS MONTH</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '8px' }}>QR 128,940</div>
          </div>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>ORDERS PROCESSED</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '8px' }}>6,214</div>
          </div>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>LOYALTY MEMBERS</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '8px' }}>3,480</div>
          </div>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>ON-TIME RATE</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginTop: '8px' }}>99.4%</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f1f5f9', padding: '60px 8%', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Laundra</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>The operating system for modern garment care.</p>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '24px' }}>© 2026 Laundra Technologies. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontWeight: '800', fontSize: '0.88rem', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>Platform</h4>
              <a onClick={() => handleLandingCardClick('admin')} style={{ color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>Security</a>
              <a onClick={() => alert('Privacy policy loaded')} style={{ color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>Privacy</a>
              <a onClick={() => alert('Terms of service loaded')} style={{ color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>Terms</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontWeight: '800', fontSize: '0.88rem', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>Company</h4>
              <a style={{ color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>About us</a>
              <a onClick={() => alert('Careers board')} style={{ color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>Careers</a>
              <a style={{ color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODAL: CUSTOMER SIGN UP --- */}
      {showSignUp && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: 0, background: 'white' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #14b8a6)', padding: '24px', color: 'white', position: 'relative' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Create Account</h2>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>Join Laundra for modern garment care.</p>
              <button onClick={() => setShowSignUp(false)} className="icon-btn" style={{ position: 'absolute', right: '16px', top: '16px', color: 'white', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleSignUpSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="form-input" required placeholder="e.g. Selena Gomez" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="form-input" required placeholder="selena@example.com" />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Phone</label>
                  <input type="tel" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} className="form-input" required placeholder="555-0144" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Password</label>
                  <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="form-input" required placeholder="••••••••" />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={signupAddress} onChange={(e) => setSignupAddress(e.target.value)} className="form-input" required placeholder="102 Ocean View Apt" />
              </div>
              <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px', borderRadius: '8px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>Create Account</button>
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Already have an account?</span> &nbsp;
                <a onClick={() => { setShowSignUp(false); setShowLogIn(true); }} style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>Log In</a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: PORTAL LOG IN --- */}
      {showLogIn && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: 0, background: 'white' }}>
            <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', padding: '24px', color: 'white', position: 'relative' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Secure Login</h2>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>Select your portal and enter credentials.</p>
              <button onClick={() => setShowLogIn(false)} className="icon-btn" style={{ position: 'absolute', right: '16px', top: '16px', color: 'white', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleLogInSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label style={{ fontWeight: '700', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Select Portal</label>
                <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)} className="form-input" required style={{ height: '48px', fontWeight: '600' }}>
                  <option value="admin">Admin Portal</option>
                  <option value="delivery">Delivery Portal</option>
                  <option value="customer">Customer Portal</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontWeight: '700', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Email Address</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="form-input" required placeholder="name@domain.com" style={{ height: '48px', fontWeight: 500 }} />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: '700', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="form-input" required placeholder="••••••••" style={{ height: '48px', fontWeight: 500 }} />
              </div>
              <button type="submit" className="primary-btn" style={{ height: '52px', fontSize: '1.05rem', marginTop: '8px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>Authenticate</button>
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Don't have a customer account?</span> &nbsp;
                <a onClick={() => { setShowLogIn(false); setShowSignUp(true); }} style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>Sign Up</a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: PIN / STAFF AUTH --- */}
      {showSignIn && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content colorful-modal" style={{ maxWidth: '800px', padding: 0, borderRadius: '16px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'row', background: 'white' }}>
            <button onClick={() => setShowSignIn(false)} className="icon-btn" style={{ position: 'absolute', right: '20px', top: '20px', zIndex: 10, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            
            {/* Colorful Left Side */}
            <div className="colorful-modal-left" style={{ flex: 1.2, background: 'linear-gradient(135deg, #1d4ed8, #7c3aed, #ec4899)', padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', color: 'white' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>✨</div>
               <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 16px 0', color: 'white', lineHeight: 1.1 }}>Welcome<br />Back</h2>
               <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>Sign in to access your Laundra dashboard. Manage orders, customers, and operations all in one seamless workspace.</p>
            </div>

            {/* Right Side Form */}
            <div className="colorful-modal-right" style={{ flex: 1.5, padding: '50px 40px', background: 'white' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0' }}>Authentication</h3>

              <form onSubmit={handleStaffSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="signInRole" style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Account Type</label>
                  <select id="signInRole" value={signInRole} onChange={(e) => setSignInRole(e.target.value)} required style={{ width: '100%', borderRadius: '8px', border: '1.5px solid #cbd5e1', height: '48px', padding: '0 14px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#f8fafc' }}>
                    <option value="Admin">Administrator</option>
                    <option value="Cashier">Cashier Agent</option>
                    <option value="Delivery Boy">Delivery Staff</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
                
                {signInRole !== 'Customer' ? (
                  <div id="signInStaffFields" className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="signInPin" style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Security PIN</label>
                    <input type="password" value={signInPin} onChange={(e) => setSignInPin(e.target.value)} id="signInPin" placeholder="••••" style={{ width: '100%', letterSpacing: '12px', textAlign: 'center', fontSize: '1.5rem', height: '54px', fontWeight: '800', borderRadius: '8px', border: '1.5px solid #cbd5e1' }} />
                    <span style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '8px', textAlign: 'center', fontWeight: '700', display: 'block', background: '#eff6ff', padding: '6px', borderRadius: '6px' }}>Demo Hint: Enter any PIN (e.g. 1234)</span>
                  </div>
                ) : (
                  <div id="signInCustomerFields" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="signInEmail" style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Email Address</label>
                      <input type="email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} id="signInEmail" placeholder="you@example.com" style={{ width: '100%', height: '48px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: '600', padding: '0 14px' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="signInPass" style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>Password</label>
                      <input type="password" value={signInPass} onChange={(e) => setSignInPass(e.target.value)} id="signInPass" placeholder="••••••••" style={{ width: '100%', height: '48px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontWeight: '600', padding: '0 14px' }} />
                    </div>
                  </div>
                )}
                
                <div className="modal-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px', marginTop: '16px', border: 'none', padding: 0 }}>
                  <button type="button" onClick={() => setShowSignIn(false)} className="secondary-btn" style={{ justifyContent: 'center', height: '48px', padding: 0, fontSize: '1rem', fontWeight: '700' }}>Cancel</button>
                  <button type="submit" className="primary-btn" style={{ justifyContent: 'center', height: '48px', padding: 0, fontSize: '1rem', fontWeight: '800', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)', color: 'white', border: 'none', cursor: 'pointer' }}>Sign In</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
