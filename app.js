/* Laundra OS - Unified Business Logic & Persistence Engine */

// ================= GLOBAL STATE & MOCK DATABASE =================
const DEFAULT_SERVICES = [
  { id: 'srv-1', name: 'Standard Shirt Wash & Fold', category: 'Wash & Fold', price: 3.50, expressSurcharge: 50, active: true },
  { id: 'srv-2', name: 'Premium Suit Dry Cleaning', category: 'Dry Cleaning', price: 18.00, expressSurcharge: 50, active: true },
  { id: 'srv-3', name: 'Silk Dress Dry Cleaning', category: 'Premium Services', price: 25.00, expressSurcharge: 50, active: true },
  { id: 'srv-4', name: 'Bedsheet Laundry & Fold', category: 'Wash & Fold', price: 8.50, expressSurcharge: 50, active: true },
  { id: 'srv-5', name: 'Steam Press Trousers', category: 'Steam Press', price: 2.00, expressSurcharge: 50, active: true },
  { id: 'srv-6', name: 'Designer Wedding Gown Clean', category: 'Premium Services', price: 75.00, expressSurcharge: 50, active: true },
  { id: 'srv-7', name: 'Express Suit & Press', category: 'Express Services', price: 28.00, expressSurcharge: 0, active: true },
  { id: 'srv-8', name: 'Comforter & Blanket Wash', category: 'Wash & Fold', price: 15.00, expressSurcharge: 50, active: true },
  { id: 'srv-9', name: 'Hotel Linen Bulk Wash (per kg)', category: 'Hotel Laundry', price: 4.50, expressSurcharge: 30, active: true },
  { id: 'srv-10', name: 'Hotel Towel Softener Care', category: 'Hotel Laundry', price: 2.50, expressSurcharge: 30, active: true },
  { id: 'srv-11', name: 'Spa & Salon Sheet Washing', category: 'Commercial Laundry', price: 3.00, expressSurcharge: 20, active: true },
  { id: 'srv-12', name: 'Restaurant Tablecloth Care', category: 'Commercial Laundry', price: 3.80, expressSurcharge: 20, active: true }
];

const DEFAULT_CUSTOMERS = [
  { id: 'cust-1', name: 'Selena Gomez', phone: '555-0144', email: 'selena@gomez.com', address: '102 Ocean View Apt, Malibu', walletBalance: 150.00, loyaltyPoints: 1240, creditBalance: 0.00, notes: 'Prefers organic detergent, hang dry silk', subRemaining: 24, subDuration: "1 Month Left" },
  { id: 'cust-2', name: 'David Beckham', phone: '555-0120', email: 'david@beckham.com', address: '77 Old Trafford Ln, London', walletBalance: 45.50, loyaltyPoints: 450, creditBalance: 12.00, notes: 'Heavy starch on shirts, separate collars' },
  { id: 'cust-3', name: 'Emma Watson', phone: '555-0199', email: 'emma@watson.com', address: '42 Oxford Library Way', walletBalance: 320.00, loyaltyPoints: 2400, creditBalance: 0.00, notes: 'Steam press only, delicate lace care' },
  { id: 'cust-4', name: 'Robert Downey Jr.', phone: '555-3000', email: 'tony@stark.com', address: '10880 Malibu Point, CA', walletBalance: 0.00, loyaltyPoints: 95, creditBalance: 145.00, notes: 'Express services preferred. Deliver to assistant.' }
];

const DEFAULT_ORDERS = [
  { id: 'OR-8839', customerId: 'cust-2', customerName: 'David Beckham', branch: 'Downtown HQ', date: '2026-06-29', weightItems: '1 Bag (Wash & Fold)', totalAmount: 22.00, paymentMethod: 'Cash', status: 'Ready', courier: 'Alex Rivera', deliveryStatus: 'Ready for Delivery' },
  { id: 'OR-8841', customerId: 'cust-3', customerName: 'Emma Watson', branch: 'Uptown Premium', date: '2026-06-30', weightItems: '5 Items (Steam Press)', totalAmount: 18.50, paymentMethod: 'Wallet', status: 'Washing', courier: 'Alex Rivera', deliveryStatus: 'Pending Pickup' },
  { id: 'OR-8842', customerId: 'cust-1', customerName: 'Selena Gomez', branch: 'Downtown HQ', date: '2026-07-01', weightItems: '2 Items (Premium Care)', totalAmount: 64.90, paymentMethod: 'UPI', status: 'Received', courier: 'John Doe', deliveryStatus: 'Pending Pickup' }
];

const DEFAULT_EXPENSES = [
  { date: '2026-06-29', category: 'Chemicals & Detergents', description: 'Bought liquid starch', source: 'Drawer Cash', loggedBy: 'Admin User', amount: 35.00 },
  { date: '2026-07-01', category: 'Machinery Rent/Repair', description: 'Press machine safety latch fix', source: 'Drawer Cash', loggedBy: 'Admin User', amount: 45.00 }
];

const DEFAULT_PROMOS = [
  { code: 'FESTIVAL15', type: 'Percentage', value: 15, description: '15% discount for festival laundry bookings', uses: 24 },
  { code: 'WELCOME5', type: 'Flat', value: 5, description: '$5.00 discount for new customer onboarding', uses: 12 },
  { code: 'EXPRESS5', type: 'Percentage', value: 5, description: 'Save 5% on Express delivery options', uses: 8 },
  { code: 'STAYCLEAN', type: 'Flat', value: 10, description: '$10.00 off on bills above $50.00', uses: 35 }
];

const DEFAULT_NOTIFICATIONS = [
  { id: 1, text: "New home pickup requested by Selena Gomez.", time: "10 mins ago", unread: true },
  { id: 2, text: "Cash Drawer transaction: Float Opened $350.00", time: "1 hour ago", unread: true },
  { id: 3, text: "Order #OR-8839 status changed to Ready.", time: "2 hours ago", unread: false }
];

// Initialize Database Object
let db = {
  services: JSON.parse(localStorage.getItem('ll_services')) || DEFAULT_SERVICES,
  customers: JSON.parse(localStorage.getItem('ll_customers')) || DEFAULT_CUSTOMERS,
  orders: JSON.parse(localStorage.getItem('ll_orders')) || DEFAULT_ORDERS,
  expenses: JSON.parse(localStorage.getItem('ll_expenses')) || DEFAULT_EXPENSES,
  promos: JSON.parse(localStorage.getItem('ll_promos')) || DEFAULT_PROMOS,
  notifications: JSON.parse(localStorage.getItem('ll_notifications')) || DEFAULT_NOTIFICATIONS,
  drawerCash: parseFloat(localStorage.getItem('ll_drawercash')) || 350.00,
  activeBranch: localStorage.getItem('ll_activebranch') || 'Downtown HQ',
  activeRole: localStorage.getItem('ll_activerole') || 'Admin'
};

// Database Save Helper
function saveDB() {
  localStorage.setItem('ll_services', JSON.stringify(db.services));
  localStorage.setItem('ll_customers', JSON.stringify(db.customers));
  localStorage.setItem('ll_orders', JSON.stringify(db.orders));
  localStorage.setItem('ll_expenses', JSON.stringify(db.expenses));
  localStorage.setItem('ll_promos', JSON.stringify(db.promos));
  localStorage.setItem('ll_notifications', JSON.stringify(db.notifications));
  localStorage.setItem('ll_drawercash', db.drawerCash.toString());
  localStorage.setItem('ll_activebranch', db.activeBranch);
  localStorage.setItem('ll_activerole', db.activeRole);
}

// ================= ROUTER / PORTAL NAVIGATION =================
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // Bind branch and role selectors
  document.getElementById("branchSelector").value = db.activeBranch;
  document.getElementById("branchSelector").addEventListener("change", (e) => {
    db.activeBranch = e.target.value;
    saveDB();
    showToast(`Switched to branch: ${db.activeBranch}`);
    updateAdminPortal();
  });

  document.getElementById("roleSelector").value = db.activeRole;
  document.getElementById("roleSelector").addEventListener("change", (e) => {
    db.activeRole = e.target.value;
    saveDB();
    applyRolePermissions();
    showToast(`Logged in as: ${db.activeRole}`);
  });

  // Theme toggle listener
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  const currentTheme = localStorage.getItem("ll_theme") || "light"; // Default light theme matching screenshots
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcons(currentTheme);

  // Notificationbell toggle
  document.getElementById("notificationBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("notificationDropdown").classList.toggle("active");
  });
  document.addEventListener("click", () => {
    document.getElementById("notificationDropdown").classList.remove("active");
  });

  // POS payment buttons
  document.querySelectorAll(".pay-method-grid .pay-method-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pay-method-grid .pay-method-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // POS Category filter buttons
  document.querySelectorAll(".pos-category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pos-category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderPOSCatalog();
    });
  });

  // Seed default charts
  initCharts();

  // Populate core database lists
  updateNotifications();
  applyRolePermissions();
  renderPOSCatalog();
  populateCustomerPickers();
  updateAdminPortal();
  updateCustomerPortalView();
  updateDeliveryTasksList();
  updatePromoCouponsTable();

  // Check URL parameters for QR tracking redirect
  const urlParams = new URLSearchParams(window.location.search);
  const trackId = urlParams.get("track");
  if (trackId) {
    launchPortal("customer");
    simulateCustomerTrack(trackId);
  }

  renderIcons();
  startHeroSlideshow();
}

let activeSlideIndex = 0;
function startHeroSlideshow() {
  const slides = document.querySelectorAll(".hero-slide-bg");
  if (!slides.length) return;
  
  setInterval(() => {
    slides[activeSlideIndex].classList.remove("active");
    activeSlideIndex = (activeSlideIndex + 1) % slides.length;
    slides[activeSlideIndex].classList.add("active");
  }, 4000);
}

// Global visual panel routing
function showLandingPage() {
  document.getElementById("landingPage").style.display = "block";
  document.getElementById("workspacePanel").classList.remove("active");
  document.getElementById("mainHeader").style.display = "flex";
  
  // Clear header navigation links
  document.querySelectorAll(".header-nav-link").forEach(l => l.classList.remove("active"));
}

// Scroll to a section on the landing page (shows landing page first if workspace is active)
function scrollToLandingSection(sectionId) {
  const lp = document.getElementById("landingPage");
  const wp = document.getElementById("workspacePanel");
  const mh = document.getElementById("mainHeader");

  if (lp.style.display === "none" || wp.classList.contains("active")) {
    // Switch back to landing page, then scroll
    lp.style.display = "block";
    wp.classList.remove("active");
    mh.style.display = "flex";
    document.querySelectorAll(".header-nav-link").forEach(l => l.classList.remove("active"));
    // Wait a tick for the DOM to repaint
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  } else {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Legacy helper (used in some onclick calls)
function scrollToElement(id) {
  scrollToLandingSection(id);
}

function launchPortal(portalId, subSection) {
  document.getElementById("landingPage").style.display = "none";
  document.getElementById("workspacePanel").classList.add("active");
  document.getElementById("mainHeader").style.display = "none";
  
  // Highlight header links
  document.querySelectorAll(".header-nav-link").forEach(l => {
    l.classList.remove("active");
    if (l.innerText.toLowerCase() === portalId) {
      l.classList.add("active");
    }
  });

  // Map header link directly to corresponding operational tab view
  let tabId = "pos";
  if (portalId === 'operations') {
    tabId = "pos";
  } else if (portalId === 'services') {
    tabId = "services";
  } else if (portalId === 'tracking') {
    tabId = "customer";
  } else if (portalId === 'analytics') {
    tabId = "admin";
  } else {
    tabId = portalId;
  }

  if (subSection === 'pricing') {
    tabId = "services";
  } else if (subSection === 'customers') {
    tabId = "admin";
    setTimeout(() => {
      const custTab = document.querySelector(".table-tab-header button:nth-child(2)");
      if (custTab) custTab.click();
    }, 100);
  } else if (subSection === 'reports') {
    tabId = "admin";
    setTimeout(() => {
      const repTab = document.querySelector(".table-tab-header button:nth-child(4)");
      if (repTab) repTab.click();
    }, 100);
  } else if (subSection === 'expenses') {
    tabId = "admin";
    setTimeout(() => {
      const expTab = document.querySelector(".table-tab-header button:nth-child(3)");
      if (expTab) expTab.click();
    }, 100);
  }

  switchWorkspaceSubTab(tabId);
}

function switchWorkspaceSubTab(tabId) {
  // Toggle workspace view tab panels
  document.querySelectorAll(".workspace-tab-view").forEach(panel => {
    panel.style.display = "none";
  });
  const activePanel = document.getElementById(`workspace-${tabId}`);
  if (activePanel) {
    activePanel.style.display = "block";
  }

  // Set header sub tab CTAs
  document.querySelectorAll(".sub-tab-nav").forEach(b => b.classList.remove("active"));
  const subBtn = document.getElementById(`btn-sub-${tabId}`);
  if (subBtn) subBtn.classList.add("active");

  // Title update
  document.getElementById("workspaceTitle").innerText = `${tabId.toUpperCase()} workspace`;

  // Trigger special functions
  if (tabId === 'admin') {
    updateAdminPortal();
    setTimeout(() => {
      if (salesChartInstance) salesChartInstance.resize();
      if (doughnutChartInstance) doughnutChartInstance.resize();
    }, 100);
  } else if (tabId === 'pos') {
    renderPOSCatalog();
    populateCustomerPickers();
  } else if (tabId === 'customer') {
    updateCustomerPortalView();
  } else if (tabId === 'delivery') {
    updateDeliveryTasksList();
  } else if (tabId === 'services') {
    renderAdminServicesTable();
  }

  renderIcons();
}

function scrollToElement(elemId) {
  const elem = document.getElementById(elemId);
  if (elem) {
    elem.scrollIntoView({ behavior: 'smooth' });
  }
}

// ================= ROLE BASED PERMISSIONS SIMULATOR =================
function applyRolePermissions() {
  const role = db.activeRole;
  const roleEl = document.getElementById("currentProfileRole");
  if (roleEl) roleEl.innerText = role === 'Admin' ? 'Administrator' : `${role} Account`;
  const nameEl = document.getElementById("currentProfileName");
  if (nameEl) nameEl.innerText = `${role} User`;

  // Restrict features visually
  const drawerBtnIn = document.querySelector('[onclick="openCashInOutModal(\'in\')"]');
  const drawerBtnOut = document.querySelector('[onclick="openCashInOutModal(\'out\')"]');
  const addServiceBtn = document.querySelector('[onclick="openNewServiceModal()"]');

  if (role === 'Delivery Boy') {
    if (drawerBtnIn) drawerBtnIn.style.display = "none";
    if (drawerBtnOut) drawerBtnOut.style.display = "none";
    if (addServiceBtn) addServiceBtn.style.display = "none";
  } else {
    if (drawerBtnIn) drawerBtnIn.style.display = "inline";
    if (drawerBtnOut) drawerBtnOut.style.display = "inline";
    if (addServiceBtn) addServiceBtn.style.display = "block";
  }
}

// ================= THEME TOGGLE ENGINE =================
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("ll_theme", newTheme);
  updateThemeIcons(newTheme);
  showToast(`Switched to ${newTheme} Mode`);
  initCharts();
}

function updateThemeIcons(theme) {
  const sun = document.getElementById("themeIconSun");
  const moon = document.getElementById("themeIconMoon");
  if (theme === "dark") {
    if (sun) sun.style.display = "none";
    if (moon) moon.style.display = "block";
  } else {
    if (sun) sun.style.display = "block";
    if (moon) moon.style.display = "none";
  }
}

// ================= NOTIFICATIONS ENGINE =================
function addNotification(text) {
  const newId = db.notifications.length ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
  db.notifications.unshift({
    id: newId,
    text: text,
    time: "Just now",
    unread: true
  });
  saveDB();
  updateNotifications();
}

function updateNotifications() {
  const badge = document.getElementById("notificationBadge");
  const list = document.getElementById("notificationList");
  
  const unreadCount = db.notifications.filter(n => n.unread).length;
  badge.innerText = unreadCount;
  badge.style.display = unreadCount > 0 ? "flex" : "none";

  if (!list) return;
  list.innerHTML = "";
  if (!db.notifications.length) {
    list.innerHTML = `<div class="empty-cart-message" style="padding:10px; font-size:0.8rem;">No notifications.</div>`;
    return;
  }

  db.notifications.forEach(n => {
    const item = document.createElement("div");
    item.className = "pipeline-item";
    item.style.padding = "8px 12px";
    item.style.fontSize = "0.78rem";
    item.innerHTML = `
      <div class="pipeline-item-left">
        <span class="dot ${n.unread ? 'orange' : 'blue'}"></span>
        <span style="font-weight:${n.unread ? '700' : '400'}">${n.text}</span>
      </div>
      <div class="pipeline-item-right" style="font-size:0.7rem;">${n.time}</div>
    `;
    item.addEventListener("click", () => {
      n.unread = false;
      saveDB();
      updateNotifications();
    });
    list.appendChild(item);
  });
}

function clearNotifications() {
  db.notifications = [];
  saveDB();
  updateNotifications();
}

// ================= MODAL DIALOGS =================
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

// ================= MOCK DATABASE ACTIONS =================
function handleNewCustomerSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("custName").value;
  const phone = document.getElementById("custPhone").value;
  const email = document.getElementById("custEmail").value;
  const address = document.getElementById("custAddress").value;
  const walletInit = parseFloat(document.getElementById("custWalletInit").value) || 0;
  const notes = document.getElementById("custNotes").value;

  const newId = `cust-${db.customers.length + 1}`;
  db.customers.push({
    id: newId, name, phone, email, address,
    walletBalance: walletInit, loyaltyPoints: Math.floor(walletInit * 2),
    creditBalance: 0.00, notes: notes || "No specific preferences"
  });

  saveDB();
  closeModal('customerModal');
  e.target.reset();

  populateCustomerPickers();
  updateAdminPortal();
  showToast(`Registered: ${name}`);
  addNotification(`Registered customer: ${name}`);
  
  const posSelect = document.getElementById("posCustomerSelect");
  if (posSelect) {
    posSelect.value = newId;
    onPOSCustomerChange();
  }
}

function openNewServiceModal() { openModal('serviceModal'); }

function handleNewServiceSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("serviceNameInput").value;
  const category = document.getElementById("serviceCategorySelect").value;
  const price = parseFloat(document.getElementById("servicePriceInput").value);
  const surcharge = parseInt(document.getElementById("serviceExpressInput").value) || 0;

  db.services.push({
    id: `srv-${db.services.length + 1}`, name, category, price,
    expressSurcharge: surcharge, active: true
  });

  saveDB();
  closeModal('serviceModal');
  e.target.reset();
  
  updateAdminPortal();
  renderPOSCatalog();
  showToast(`Added service: ${name}`);
}

function openNewExpenseModal() { openModal('expenseModal'); }

function handleNewExpenseSubmit(e) {
  e.preventDefault();
  const category = document.getElementById("expenseCategorySelect").value;
  const amount = parseFloat(document.getElementById("expenseAmountInput").value);
  const desc = document.getElementById("expenseDescInput").value;
  const source = document.getElementById("expenseSourceSelect").value;

  db.expenses.unshift({
    date: new Date().toISOString().split('T')[0],
    category, description: desc, source, loggedBy: `${db.activeRole} User`, amount
  });

  if (source === 'Drawer Cash') {
    db.drawerCash = Math.max(0, db.drawerCash - amount);
  }

  saveDB();
  closeModal('expenseModal');
  e.target.reset();

  updateAdminPortal();
  showToast(`Expense logged: $${amount.toFixed(2)}`);
  addNotification(`Expense logged: $${amount.toFixed(2)}`);
}

function openCashInOutModal(type) {
  document.getElementById("cashTransactionType").value = type;
  document.getElementById("cashInOutModalTitle").innerText = type === 'in' ? 'Drawer Cash In' : 'Drawer Cash Out';
  openModal('cashInOutModal');
}

function handleCashInOutSubmit(e) {
  e.preventDefault();
  const type = document.getElementById("cashTransactionType").value;
  const amount = parseFloat(document.getElementById("cashTransactionAmount").value);
  const reason = document.getElementById("cashTransactionReason").value;

  if (type === 'in') {
    db.drawerCash += amount;
    showToast(`Drawer Added: $${amount.toFixed(2)}`);
  } else {
    db.drawerCash = Math.max(0, db.drawerCash - amount);
    showToast(`Drawer Withdrawal: $${amount.toFixed(2)}`);
  }

  saveDB();
  closeModal('cashInOutModal');
  e.target.reset();
  updateAdminPortal();
}

// ================= POS CART & CHECKOUT ENGINE =================
let posCart = [];
let posAppliedPromo = null;

function populateCustomerPickers() {
  const select = document.getElementById("posCustomerSelect");
  if (!select) return;
  select.innerHTML = '<option value="" disabled selected>Select Customer...</option>';
  db.customers.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.innerText = `${c.name} (${c.phone})`;
    select.appendChild(opt);
  });
}

function onPOSCustomerChange() {
  const custId = document.getElementById("posCustomerSelect").value;
  const cust = db.customers.find(c => c.id === custId);
  const briefInfo = document.getElementById("posCustomerBriefInfo");
  if (cust) {
    briefInfo.classList.remove("hidden");
    document.getElementById("posCustWallet").innerText = `$${cust.walletBalance.toFixed(2)}`;
    document.getElementById("posCustPoints").innerText = cust.loyaltyPoints;
    document.getElementById("posCustCredit").innerText = `$${cust.creditBalance.toFixed(2)}`;
  } else {
    briefInfo.classList.add("hidden");
  }
}

function renderPOSCatalog() {
  const grid = document.getElementById("posItemsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const activeCategory = document.querySelector(".pos-category-btn.active").getAttribute("data-category");
  const searchQuery = document.getElementById("posServiceSearch").value.toLowerCase();
  const expressMode = document.getElementById("posExpressCheckbox").checked;

  let filtered = db.services.filter(s => s.active);

  if (activeCategory !== 'All') {
    filtered = filtered.filter(s => s.category === activeCategory);
  }

  if (searchQuery) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery) || s.category.toLowerCase().includes(searchQuery));
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "pos-item-card";
    card.innerHTML = `
      <div class="pos-item-icon">
        <i class="${getServiceIcon(item.category)}"></i>
      </div>
      <div style="font-size:0.82rem; font-weight:600; color:var(--text-primary); height:32px; overflow:hidden;">${item.name}</div>
      <div style="font-size:0.85rem; color:var(--primary); font-weight:700; margin-top:6px;">$${(expressMode ? item.price * 1.5 : item.price).toFixed(2)}</div>
    `;
    card.addEventListener("click", () => addToPOSCart(item));
    grid.appendChild(card);
  });
  renderIcons();
}

function filterPOSCatalog() { renderPOSCatalog(); }

function getServiceIcon(category) {
  switch (category) {
    case 'Wash & Fold': return 'lucide-waves';
    case 'Dry Cleaning': return 'lucide-sparkles';
    case 'Steam Press': return 'lucide-plug-zap';
    case 'Premium Services': return 'lucide-gem';
    case 'Hotel Laundry': return 'lucide-bed-double';
    case 'Commercial Laundry': return 'lucide-factory';
    default: return 'lucide-shirt';
  }
}

function addToPOSCart(service) {
  const expressMode = document.getElementById("posExpressCheckbox").checked;
  const finalPrice = expressMode ? service.price * 1.5 : service.price;
  
  const existing = posCart.find(i => i.serviceId === service.id && i.isExpress === expressMode);
  if (existing) {
    existing.qty++;
  } else {
    posCart.push({
      serviceId: service.id, name: service.name, category: service.category,
      basePrice: service.price, finalPrice: finalPrice, isExpress: expressMode, qty: 1
    });
  }
  updatePOSCartUI();
}

function updatePOSCartUI() {
  const list = document.getElementById("posCartItemsList");
  if (!list) return;
  list.innerHTML = "";

  if (!posCart.length) {
    list.innerHTML = `
      <div class="empty-cart-message" style="text-align:center; padding:30px; color:var(--text-muted);">
        <i class="lucide-shopping-cart" style="width:32px; height:32px;"></i>
        <p style="font-size:0.8rem; margin-top:8px;">Cart is empty.</p>
      </div>
    `;
    updatePOSCalculations(0, 0);
    return;
  }

  let subtotal = 0;
  let expressSurcharge = 0;

  posCart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "pipeline-item";
    row.style.padding = "8px 12px";
    row.innerHTML = `
      <div class="pipeline-item-left" style="font-size:0.8rem;">
        <span class="dot ${item.isExpress ? 'orange' : 'blue'}"></span>
        <span>${item.name} (${item.qty}x)</span>
      </div>
      <div class="pipeline-item-right" style="display:flex; align-items:center; gap:8px;">
        <span style="font-weight:700;">$${(item.finalPrice * item.qty).toFixed(2)}</span>
        <a onclick="adjustPOSCartQty(${index}, -1)" style="color:var(--danger); cursor:pointer; font-weight:700; font-size:0.95rem;">×</a>
      </div>
    `;
    list.appendChild(row);

    subtotal += item.basePrice * item.qty;
    if (item.isExpress) {
      expressSurcharge += (item.basePrice * 0.5) * item.qty;
    }
  });

  updatePOSCalculations(subtotal, expressSurcharge);
}

function adjustPOSCartQty(index, change) {
  posCart[index].qty += change;
  if (posCart[index].qty <= 0) {
    posCart.splice(index, 1);
  }
  updatePOSCartUI();
}

function clearPOSCart() {
  posCart = [];
  posAppliedPromo = null;
  document.getElementById("posPromoCodeInput").value = "";
  document.getElementById("promoAppliedAlert").classList.add("hidden");
  updatePOSCartUI();
}

function applyPOSPromoCode() {
  const code = document.getElementById("posPromoCodeInput").value.trim().toUpperCase();
  const alert = document.getElementById("promoAppliedAlert");

  if (!code) {
    posAppliedPromo = null;
    alert.classList.add("hidden");
    updatePOSCartUI();
    return;
  }

  const promo = db.promos.find(p => p.code === code);
  if (!promo) {
    showToast("Invalid promo code!");
    posAppliedPromo = null;
    alert.classList.add("hidden");
    updatePOSCartUI();
    return;
  }

  posAppliedPromo = promo;
  alert.classList.remove("hidden");
  alert.innerText = `Coupon: ${promo.code} (${promo.type === 'Percentage' ? promo.value + '%' : '$' + promo.value} Discount)`;
  updatePOSCartUI();
}

function updatePOSCalculations(subtotal, expressSurcharge) {
  let discount = 0;
  let grossAmount = subtotal + expressSurcharge;

  if (posAppliedPromo) {
    if (posAppliedPromo.type === 'Percentage') {
      discount = grossAmount * (posAppliedPromo.value / 100);
    } else {
      discount = Math.min(grossAmount, posAppliedPromo.value);
    }
  }

  const netBeforeTax = Math.max(0, grossAmount - discount);
  const gst = netBeforeTax * 0.18;
  const total = netBeforeTax + gst;

  document.getElementById("posSubtotal").innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById("posExpressSurcharge").innerText = `$${expressSurcharge.toFixed(2)}`;
  document.getElementById("posDiscount").innerText = `-$${discount.toFixed(2)}`;
  document.getElementById("posGST").innerText = `$${gst.toFixed(2)}`;
  document.getElementById("posTotal").innerText = `$${total.toFixed(2)}`;
}

function processPOSCheckout() {
  const custId = document.getElementById("posCustomerSelect").value;
  if (!custId) {
    showToast("Please select a customer.");
    return;
  }
  if (!posCart.length) {
    showToast("Cart is empty.");
    return;
  }

  const customer = db.customers.find(c => c.id === custId);
  const totalAmount = parseFloat(document.getElementById("posTotal").innerText.replace('$', ''));
  const payMethodBtn = document.querySelector(".pay-method-grid .pay-method-btn.active");
  const paymentMethod = payMethodBtn ? payMethodBtn.getAttribute("data-method") : "Cash";

  if (paymentMethod === 'Wallet') {
    if (customer.walletBalance < totalAmount) {
      showToast("Insufficient wallet balance.");
      return;
    }
    customer.walletBalance -= totalAmount;
  } else if (paymentMethod === 'Cash') {
    db.drawerCash += totalAmount;
  }

  customer.loyaltyPoints += Math.floor(totalAmount);

  const orderId = `OR-${db.orders.length ? parseInt(db.orders[db.orders.length - 1].id.split('-')[1]) + 1 : 8843}`;
  const itemsMeta = posCart.map(c => `${c.qty}x ${c.name}`).join(', ');

  const newOrder = {
    id: orderId, customerId: customer.id, customerName: customer.name,
    branch: db.activeBranch, date: new Date().toISOString().split('T')[0],
    weightItems: itemsMeta, totalAmount, paymentMethod,
    status: 'Received', courier: 'John Doe', deliveryStatus: 'Pending Pickup'
  };

  db.orders.push(newOrder);
  if (posAppliedPromo) {
    const promo = db.promos.find(p => p.code === posAppliedPromo.code);
    if (promo) promo.uses++;
  }

  saveDB();
  addNotification(`New Order placed: ${orderId} by ${customer.name}`);

  if (typeof confetti === 'function') {
    confetti({ particleCount: 80, spread: 60 });
  }

  clearPOSCart();
  onPOSCustomerChange();
  openReceiptModal(newOrder);
  updateAdminPortal();
}

function openReceiptModal(order) {
  document.getElementById("receiptOrderId").innerText = `#${order.id}`;
  document.getElementById("receiptDate").innerText = order.date;
  document.getElementById("receiptCustName").innerText = order.customerName;
  
  const customer = db.customers.find(c => c.id === order.customerId);
  document.getElementById("receiptCustPhone").innerText = customer ? customer.phone : 'N/A';
  document.getElementById("receiptBranchName").innerText = `${order.branch} Branch`;
  document.getElementById("receiptStaff").innerText = `${db.activeRole} Account`;
  document.getElementById("receiptDeliveryType").innerText = order.weightItems.includes("Express") ? "Express Delivery" : "Standard Delivery";

  const tbody = document.getElementById("receiptItemsBody");
  tbody.innerHTML = `
    <tr>
      <td style="font-size:0.75rem;">${order.weightItems}</td>
      <td style="text-align:center;">1</td>
      <td style="text-align:right;">$${(order.totalAmount / 1.18).toFixed(2)}</td>
      <td style="text-align:right;">$${(order.totalAmount / 1.18).toFixed(2)}</td>
    </tr>
  `;

  const subtotal = order.totalAmount / 1.18;
  const taxes = order.totalAmount - subtotal;

  document.getElementById("receiptSubtotal").innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById("receiptExpress").innerText = "$0.00";
  document.getElementById("receiptDiscount").innerText = "-$0.00";
  document.getElementById("receiptTaxes").innerText = `$${taxes.toFixed(2)}`;
  document.getElementById("receiptTotal").innerText = `$${order.totalAmount.toFixed(2)}`;

  const qrBox = document.getElementById("receiptQrCode");
  qrBox.innerHTML = "";
  const trackUrl = `${window.location.origin}${window.location.pathname}?track=${order.id}`;
  
  try {
    if (typeof QRCode === 'function') {
      new QRCode(qrBox, { text: trackUrl, width: 72, height: 72 });
    } else {
      throw new Error();
    }
  } catch (err) {
    qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(trackUrl)}" style="width:72px; height:72px;">`;
  }

  openModal('receiptModal');
}

// ================= ADMIN DESK & CHARTS ENGINE (Emerald Theme Colors) =================
let salesChartInstance = null;
let doughnutChartInstance = null;
let activeChartMode = 'revenue';

function initCharts() {
  const theme = document.documentElement.getAttribute("data-theme") || "light";
  const textColor = theme === 'dark' ? '#cbd5e1' : '#475569';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  if (salesChartInstance) salesChartInstance.destroy();
  if (doughnutChartInstance) doughnutChartInstance.destroy();

  const ctxSales = document.getElementById("salesChart");
  if (ctxSales) {
    const salesData = activeChartMode === 'revenue' 
      ? [850, 1120, 950, 1420, 1250, 1680, 1280.50]
      : [22, 28, 25, 38, 30, 42, 34];

    salesChartInstance = new Chart(ctxSales.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', 'Today'],
        datasets: [{
          label: 'Fulfillment Metric',
          data: salesData,
          borderColor: '#2563eb', // Sapphire Blue
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: '#2563eb'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  }

  const ctxDonut = document.getElementById("serviceBreakdownChart");
  if (ctxDonut) {
    doughnutChartInstance = new Chart(ctxDonut.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Wash & Fold', 'Dry Cleaning', 'Steam Press', 'Premium', 'Express'],
        datasets: [{
          data: [45, 25, 15, 10, 5],
          backgroundColor: ['#2563eb', '#14b8a6', '#38bdf8', '#fda4af', '#f59e0b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, boxWidth: 10, font: { size: 10 } }
          }
        }
      }
    });
  }
}

function updateChartType(mode) {
  activeChartMode = mode;
  initCharts();
}

function updateAdminPortal() {
  const todaySales = db.orders.filter(o => o.date === '2026-07-01').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const todayOrdersCount = db.orders.filter(o => o.date === '2026-07-01').length;
  const activeDeliveries = db.orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const activeCouriersCount = db.orders.filter(o => o.status === 'Out for Delivery').length;
  
  document.getElementById("kpiSales").innerText = `$${todaySales.toFixed(2)}`;
  document.getElementById("kpiOrders").innerText = todayOrdersCount;
  document.getElementById("kpiPending").innerText = activeDeliveries;
  document.getElementById("kpiDeliveryStatus").innerText = `${activeCouriersCount} En Route`;
  document.getElementById("drawerCashDisplay").innerText = `$${db.drawerCash.toFixed(2)}`;

  // Update SaaS Landing page Pipeline visual card!
  const pipelineRevenue = document.getElementById("pipelineTodayRevenue");
  if (pipelineRevenue) pipelineRevenue.innerText = `$${todaySales.toFixed(2)}`;

  // Populate hero pipeline list dynamically from actual database!
  const pipelineList = document.getElementById("pipelineListContainer");
  if (pipelineList) {
    pipelineList.innerHTML = "";
    const pipelineOrders = [...db.orders].reverse().slice(0, 3);
    pipelineOrders.forEach(po => {
      let colorClass = "orange";
      if (po.status === 'Washing' || po.status === 'Ironing') colorClass = "blue";
      if (po.status === 'Ready' || po.status === 'Delivered') colorClass = "green";

      const item = document.createElement("div");
      item.className = "pipeline-item";
      item.innerHTML = `
        <div class="pipeline-item-left">
          <span class="dot ${colorClass}"></span>
          <span>Order #${po.id.replace('OR-', '')} • ${po.status}</span>
        </div>
        <div class="pipeline-item-right">${po.weightItems.split(',')[0]}</div>
      `;
      pipelineList.appendChild(item);
    });
  }

  // Today expenses
  const todayExpenses = db.expenses.filter(e => e.date === '2026-07-01').reduce((acc, curr) => acc + curr.amount, 0);
  const expAmt = document.getElementById("todayExpensesAmt");
  if (expAmt) expAmt.innerText = `$${todayExpenses.toFixed(2)}`;

  renderAdminOrdersTable();
  renderAdminCustomersTable();
  renderAdminServicesTable();
  renderAdminExpensesTable();

  renderSalesOverviewDrawerTable();
  renderPendingOrdersSidebarTable();
  renderDeliveryStatusSidebarTable();
}

function renderAdminOrdersTable() {
  const tbody = document.querySelector("#adminOrdersTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const searchQuery = document.getElementById("orderSearchAdmin").value.toLowerCase();
  const statusFilter = document.getElementById("orderStatusFilterAdmin").value;

  let filtered = [...db.orders].reverse();

  if (statusFilter !== 'All') {
    filtered = filtered.filter(o => o.status === statusFilter);
  }

  if (searchQuery) {
    filtered = filtered.filter(o => 
      o.id.toLowerCase().includes(searchQuery) ||
      o.customerName.toLowerCase().includes(searchQuery)
    );
  }

  filtered.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${o.id}</strong></td>
      <td>${o.customerName}</td>
      <td>${o.branch}</td>
      <td>${o.date}</td>
      <td><span style="font-size:0.8rem; color:var(--text-secondary);">${o.weightItems}</span></td>
      <td><strong>$${o.totalAmount.toFixed(2)}</strong></td>
      <td><span class="live-badge" style="background:#e2e8f0; color:#475569;">${o.paymentMethod}</span></td>
      <td>
        <select onchange="updateOrderStatus('${o.id}', this.value)" class="table-select-btn">
          <option value="Received" ${o.status === 'Received' ? 'selected' : ''}>Received</option>
          <option value="Washing" ${o.status === 'Washing' ? 'selected' : ''}>Washing</option>
          <option value="Ironing" ${o.status === 'Ironing' ? 'selected' : ''}>Ironing</option>
          <option value="Ready" ${o.status === 'Ready' ? 'selected' : ''}>Ready</option>
          <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Del</option>
          <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button onclick="openReceiptModalById('${o.id}')" class="secondary-btn" style="padding:6px 12px; font-size:0.72rem;">Receipt</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateOrderStatus(orderId, newStatus) {
  const order = db.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    if (newStatus === 'Delivered') order.deliveryStatus = 'Completed';
    else if (newStatus === 'Out for Delivery') order.deliveryStatus = 'Out for Delivery';
    saveDB();
    updateAdminPortal();
    updateDeliveryTasksList();
    addNotification(`Order #${orderId} is now ${newStatus}`);
    showToast(`Order status updated.`);
  }
}

function openReceiptModalById(orderId) {
  const order = db.orders.find(o => o.id === orderId);
  if (order) openReceiptModal(order);
}

function filterAdminOrders() { renderAdminOrdersTable(); }

function renderAdminCustomersTable() {
  const tbody = document.querySelector("#adminCustomersTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const query = document.getElementById("customerSearchAdmin").value.toLowerCase();
  let filtered = db.customers;

  if (query) {
    filtered = filtered.filter(c => c.name.toLowerCase().includes(query) || c.phone.includes(query));
  }

  filtered.forEach(c => {
    const ordCount = db.orders.filter(o => o.customerId === c.id).length;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${c.name}</strong><br><span style="font-size:0.72rem; color:var(--text-muted);">${c.notes}</span></td>
      <td><span style="font-size:0.8rem;">📞 ${c.phone}</span><br><span style="font-size:0.72rem; color:var(--text-secondary);">✉️ ${c.email}</span></td>
      <td><strong class="text-success">$${c.walletBalance.toFixed(2)}</strong></td>
      <td>⭐ ${c.loyaltyPoints}</td>
      <td><span class="${c.creditBalance > 0 ? 'text-danger' : ''}">$${c.creditBalance.toFixed(2)}</span></td>
      <td>${ordCount} orders</td>
      <td>
        <button onclick="simulateWalletTopupAdmin('${c.id}')" class="secondary-btn" style="padding:6px 12px; font-size:0.72rem;">Topup</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function simulateWalletTopupAdmin(custId) {
  const customer = db.customers.find(c => c.id === custId);
  if (customer) {
    const amountStr = prompt(`Enter wallet topup for ${customer.name}:`, "50");
    const amount = parseFloat(amountStr);
    if (!isNaN(amount) && amount > 0) {
      customer.walletBalance += amount;
      customer.loyaltyPoints += Math.floor(amount * 2);
      saveDB();
      updateAdminPortal();
      showToast(`Topped up $${amount.toFixed(2)}`);
      addNotification(`Topped up $${amount.toFixed(2)} for ${customer.name}`);
    }
  }
}

function filterAdminCustomers() { renderAdminCustomersTable(); }

function renderAdminServicesTable() {
  const tbody = document.querySelector("#adminServicesTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  db.services.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${s.name}</strong></td>
      <td><span class="live-badge" style="background:#eff6ff; color:#2563eb;">${s.category}</span></td>
      <td><strong>$${s.price.toFixed(2)}</strong></td>
      <td>+${s.expressSurcharge}%</td>
      <td><span class="live-badge" style="background:#e6fdf4; color:#10b981;">Active</span></td>
      <td>
        <button onclick="toggleServiceActive('${s.id}')" class="secondary-btn" style="padding:6px; font-size:0.7rem;">Toggle</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleServiceActive(serviceId) {
  const s = db.services.find(srv => srv.id === serviceId);
  if (s) {
    s.active = !s.active;
    saveDB();
    updateAdminPortal();
    renderPOSCatalog();
  }
}

function renderAdminExpensesTable() {
  const tbody = document.querySelector("#adminExpensesTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  db.expenses.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.date}</td>
      <td><span class="live-badge" style="background:#fef2f2; color:#ef4444;">${e.category}</span></td>
      <td><span style="font-size:0.8rem; color:var(--text-secondary);">${e.description}</span></td>
      <td>${e.source}</td>
      <td>${e.loggedBy}</td>
      <td><strong class="text-danger">-$${e.amount.toFixed(2)}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

function switchAdminTab(tabId, btn) {
  document.querySelectorAll(".admin-tab-content").forEach(tab => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".table-tab-header .table-tab").forEach(b => {
    b.classList.remove("active");
  });
  document.getElementById(`tab-${tabId}`).classList.add("active");
  btn.classList.add("active");
}

function exportReport(reportType) {
  let csvContent = "";
  let fileName = "";

  if (reportType === 'daily-sales') {
    fileName = "daily_sales_summary.csv";
    csvContent = "Order ID,Customer Name,Date,Payment Method,Branch,Amount,Status\n";
    db.orders.forEach(o => {
      csvContent += `${o.id},"${o.customerName}",${o.date},${o.paymentMethod},${o.branch},${o.totalAmount.toFixed(2)},${o.status}\n`;
    });
  } else if (reportType === 'customer-credit') {
    fileName = "customer_outstanding_credit.csv";
    csvContent = "Customer Name,Phone,Email,Wallet Balance,Credit Outstanding,Notes\n";
    db.customers.forEach(c => {
      csvContent += `"${c.name}",${c.phone},${c.email},${c.walletBalance.toFixed(2)},${c.creditBalance.toFixed(2)},"${c.notes}"\n`;
    });
  } else if (reportType === 'gst-report') {
    fileName = "gst_tax_summary.csv";
    csvContent = "Order ID,Date,Gross Amount,Taxable Subtotal,CGST (9%),SGST (9%),Total Tax\n";
    db.orders.forEach(o => {
      const subtotal = o.totalAmount / 1.18;
      const cgst = subtotal * 0.09;
      const sgst = subtotal * 0.09;
      const totalTax = o.totalAmount - subtotal;
      csvContent += `${o.id},${o.date},${o.totalAmount.toFixed(2)},${subtotal.toFixed(2)},${cgst.toFixed(2)},${sgst.toFixed(2)},${totalTax.toFixed(2)}\n`;
    });
  } else if (reportType === 'audit-logs') {
    fileName = "security_audit_logs.csv";
    csvContent = "Timestamp,User Event,Severity,Terminal Location\n";
    db.notifications.forEach((n, idx) => {
      csvContent += `2026-07-01 11:00:${idx.toString().padStart(2, '0')},"${n.text}",INFO,Terminal 1\n`;
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported ${fileName}!`);
}

// ================= CUSTOMER PORTAL VIEWS & SIMULATOR =================
function updateCustomerPortalView() {
  const selena = db.customers.find(c => c.id === 'cust-1');
  if (!selena) return;

  document.getElementById("custPortalName").innerText = selena.name;
  document.getElementById("custPortalWallet").innerText = `$${selena.walletBalance.toFixed(2)}`;
  document.getElementById("custPortalPoints").innerText = `${selena.loyaltyPoints} pts`;
  document.getElementById("custPortalSubscription").innerText = `${selena.subRemaining || 30}/30 Clothes`;
  document.getElementById("custPortalSubscriptionDuration").innerText = `${selena.subDuration || "1 Month Left"}`;
  document.getElementById("custPortalCredit").innerText = `$${selena.creditBalance.toFixed(2)}`;

  const payBtn = document.getElementById("payCreditBtn");
  payBtn.style.display = selena.creditBalance > 0 ? "inline-block" : "none";

  const tbody = document.querySelector("#customerHistoryTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const selenaOrders = db.orders.filter(o => o.customerId === selena.id);
  if (!selenaOrders.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-secondary);">No orders.</td></tr>`;
    return;
  }

  selenaOrders.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${o.id}</strong></td>
      <td>${o.date}</td>
      <td><span style="font-size:0.8rem; color:var(--text-secondary);">${o.weightItems}</span></td>
      <td><strong>$${o.totalAmount.toFixed(2)}</strong></td>
      <td><span class="status-badge ${o.status.toLowerCase().replace(/ /g, '')}">${o.status}</span></td>
      <td>
        <button onclick="simulateCustomerTrack('${o.id}')" class="primary-btn" style="padding:6px 12px; font-size:0.72rem;">Track</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function payOutstandingCredit() {
  const selena = db.customers.find(c => c.id === 'cust-1');
  if (selena && selena.creditBalance > 0) {
    if (selena.walletBalance >= selena.creditBalance) {
      selena.walletBalance -= selena.creditBalance;
      selena.creditBalance = 0;
      saveDB();
      updateCustomerPortalView();
      showToast("Settled credit outstanding!");
    } else {
      showToast("Insufficient Wallet balance.");
      openWalletTopupModal();
    }
  }
}

function openWalletTopupModal() { openModal('walletModal'); }

function handleWalletTopupSubmit(e) {
  e.preventDefault();
  const amt = parseFloat(document.getElementById("walletTopupAmount").value);
  const selena = db.customers.find(c => c.id === 'cust-1');

  if (selena && amt > 0) {
    selena.walletBalance += amt;
    selena.loyaltyPoints += Math.floor(amt * 2);
    saveDB();
    closeModal('walletModal');
    updateCustomerPortalView();
    showToast(`Added $${amt.toFixed(2)} to wallet.`);
  }
}

function handlePickupSubmit(e) {
  e.preventDefault();
  const date = document.getElementById("pickupDate").value;
  const time = document.getElementById("pickupTime").value;
  showToast(`Pickup requested for ${date} during ${time}`);
  e.target.reset();
}

let trackedOrderId = "";

function simulateCustomerTrack(orderId) {
  document.getElementById("trackOrderIdInput").value = orderId;
  trackOrderFromInput();
}

function trackOrderFromInput() {
  const orderId = document.getElementById("trackOrderIdInput").value.trim().toUpperCase().replace('#', '');
  const order = db.orders.find(o => o.id === orderId);

  const display = document.getElementById("liveTrackerDisplay");
  const emptyState = document.getElementById("trackerEmptyState");

  if (!order) {
    showToast("Order ID not found.");
    display.classList.add("hidden");
    emptyState.classList.remove("hidden");
    trackedOrderId = "";
    return;
  }

  trackedOrderId = orderId;
  emptyState.classList.add("hidden");
  display.classList.remove("hidden");

  document.getElementById("trackedStatusBadge").className = `status-badge ${order.status.toLowerCase().replace(/ /g, '')}`;
  document.getElementById("trackedStatusBadge").innerText = order.status;
  document.getElementById("trackedOrderMeta").innerText = `Order #${order.id} • ${order.branch}`;

  const qrBox = document.getElementById("trackedOrderQR");
  qrBox.innerHTML = "";
  const trackUrl = `${window.location.origin}${window.location.pathname}?track=${order.id}`;

  try {
    if (typeof QRCode === 'function') {
      new QRCode(qrBox, { text: trackUrl, width: 56, height: 56 });
    } else {
      throw new Error();
    }
  } catch (err) {
    qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(trackUrl)}" style="width:56px; height:56px;">`;
  }

  const states = ['Received', 'Washing', 'Ironing', 'Ready', 'Delivered'];
  const currentIdx = states.indexOf(order.status === 'Cancelled' ? 'Received' : order.status);

  states.forEach((state, idx) => {
    const stepEl = document.getElementById(`step-${state}`);
    if (stepEl) {
      stepEl.classList.remove('completed', 'active');
      if (idx < currentIdx) stepEl.classList.add('completed');
      else if (idx === currentIdx) stepEl.classList.add('active');
    }
  });

  const delRow = document.getElementById("trackerDeliveryTrackingRow");
  if (order.status === 'Out for Delivery' || order.status === 'Delivered') {
    delRow.classList.remove("hidden");
    document.getElementById("trackerDeliveryName").innerText = order.courier;
    document.getElementById("trackerDeliveryStatus").innerText = order.status === 'Delivered' ? 'Completed' : 'En route';
  } else {
    delRow.classList.add("hidden");
  }
}

function downloadTrackedInvoice() {
  if (trackedOrderId) {
    const order = db.orders.find(o => o.id === trackedOrderId);
    if (order) openReceiptModal(order);
  }
}

// ================= DELIVERY COMPANION SIMULATOR =================
let activeDeliveryTab = 'delivery';
let activeSelectedTaskId = "";

function switchDeliveryTab(tabType, btn) {
  activeDeliveryTab = tabType;
  document.querySelectorAll(".delivery-tabs .secondary-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  updateDeliveryTasksList();
}

function updateDeliveryTasksList() {
  const container = document.getElementById("deliveryTasksContainer");
  if (!container) return;
  container.innerHTML = "";

  let tasks = [];
  if (activeDeliveryTab === 'pickup') {
    tasks = db.orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Ready');
  } else {
    tasks = db.orders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery');
  }

  if (!tasks.length) {
    container.innerHTML = `<div class="empty-cart-message" style="text-align:center; padding:20px; color:var(--text-secondary);">No pending logistics.</div>`;
    return;
  }

  tasks.forEach(t => {
    const item = document.createElement("div");
    item.className = `delivery-task-item ${activeSelectedTaskId === t.id ? 'active' : ''}`;
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.85rem;">
        <span>Task #${t.id}</span>
        <span class="live-badge" style="background:#eff6ff; color:#2563eb;">${t.status}</span>
      </div>
      <p style="margin:4px 0; font-size:0.8rem; color:var(--text-secondary);">Client: ${t.customerName}</p>
      <span style="font-size:0.75rem; color:var(--text-muted);">📍 ${t.branch} • $${t.totalAmount.toFixed(2)}</span>
    `;
    item.addEventListener("click", () => selectDeliveryTask(t.id));
    container.appendChild(item);
  });
}

function selectDeliveryTask(orderId) {
  activeSelectedTaskId = orderId;
  updateDeliveryTasksList();
  renderDeliverySimulator(orderId);
}

function renderDeliverySimulator(orderId) {
  const order = db.orders.find(o => o.id === orderId);
  const container = document.getElementById("deliverySimulatorBody");
  if (!order || !container) return;

  const customer = db.customers.find(c => c.id === order.customerId);
  const custAddress = customer ? customer.address : "Default Address";

  container.innerHTML = `
    <div class="form-layout">
      <div>
        <h4 style="margin-bottom:4px;">Task Route #${order.id}</h4>
        <p style="font-size:0.8rem; color:var(--text-secondary);"><strong>Deliver to:</strong> ${custAddress}</p>
      </div>

      <div class="sim-map-area" id="mockMapContainer">
        <div class="sim-map-placeholder">Simulating courier GPS route...</div>
        <div class="map-route-line" style="position:absolute; width:60%; height:3px; background:#cbd5e1; top:50%; left:20%;">
          <div class="map-route-progress" id="mockMapProgress" style="width:0; height:100%; background:var(--primary); transition: width 6s linear;"></div>
        </div>
        <div class="sim-marker" id="mockMapMarker" style="position:absolute; width:12px; height:12px; border-radius:50%; background:#ef4444; top:calc(50% - 4px); left:20%; transition: left 6s linear;"></div>
      </div>

      <div class="calculations-row" style="margin:0;">
        <div class="calc-line"><span>Agent Assigned:</span><strong>${order.courier}</strong></div>
        <div class="calc-line"><span>Current Status:</span><strong>${order.status}</strong></div>
      </div>

      <div class="cta-row" style="width:100%;">
        ${getDeliverySimulatorButtons(order)}
      </div>
    </div>
  `;
}

function getDeliverySimulatorButtons(order) {
  if (order.status === 'Received') {
    return `<button onclick="updateDeliveryTaskStatus('${order.id}', 'Washing')" class="checkout-btn" style="padding:10px;">Load into Washing</button>`;
  } else if (order.status === 'Washing') {
    return `<button onclick="updateDeliveryTaskStatus('${order.id}', 'Ironing')" class="checkout-btn" style="padding:10px;">Pass to Ironing</button>`;
  } else if (order.status === 'Ironing') {
    return `<button onclick="updateDeliveryTaskStatus('${order.id}', 'Ready')" class="checkout-btn" style="padding:10px;">Package and mark Ready</button>`;
  } else if (order.status === 'Ready') {
    return `<button onclick="startDeliveryGPSDrive('${order.id}')" class="checkout-btn" style="padding:10px;"><i class="lucide-navigation"></i> Dispatch Courier</button>`;
  } else if (order.status === 'Out for Delivery') {
    return `<button onclick="promptDeliveryOTPVerification('${order.id}')" class="checkout-btn" style="padding:10px; background:#10b981;">Verify OTP Code & Deliver</button>`;
  } else {
    return `<div style="text-align:center; padding:10px; font-weight:700; color:var(--success); width:100%;">Delivery Completed!</div>`;
  }
}

function updateDeliveryTaskStatus(orderId, newStatus) {
  const order = db.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    if (newStatus === 'Ready') order.deliveryStatus = 'Ready for Delivery';
    saveDB();
    updateAdminPortal();
    updateDeliveryTasksList();
    renderDeliverySimulator(orderId);
    showToast("Status updated.");
  }
}

function startDeliveryGPSDrive(orderId) {
  const order = db.orders.find(o => o.id === orderId);
  if (order) {
    order.status = 'Out for Delivery';
    order.deliveryStatus = 'En route';
    saveDB();
    updateAdminPortal();
    updateDeliveryTasksList();
    renderDeliverySimulator(orderId);

    setTimeout(() => {
      const marker = document.getElementById("mockMapMarker");
      const progress = document.getElementById("mockMapProgress");
      if (marker && progress) {
        marker.style.left = "80%";
        progress.style.width = "100%";
      }
    }, 100);
  }
}

function promptDeliveryOTPVerification(orderId) {
  const otpCode = prompt("Enter 4-Digit Delivery OTP (Sent to Selena, Code: 1234):", "");
  if (otpCode === '1234') {
    const order = db.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'Delivered';
      order.deliveryStatus = 'Completed';
      saveDB();
      if (typeof confetti === 'function') confetti();
      updateAdminPortal();
      updateDeliveryTasksList();
      renderDeliverySimulator(orderId);
      showToast("OTP Verified. Package Handed Over.");
    }
  } else {
    showToast("Incorrect OTP. Enter 1234.");
  }
}

// ================= MARKETING PROMO LOGIC =================
function updatePromoCouponsTable() {
  const tbody = document.querySelector("#adminPromosTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  db.promos.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.code}</strong></td>
      <td>${p.type}</td>
      <td>${p.type === 'Percentage' ? p.value + '%' : '$' + p.value}</td>
      <td><span style="font-size:0.8rem; color:var(--text-secondary);">${p.description}</span></td>
      <td>${p.uses} uses</td>
      <td>
        <button onclick="deletePromoCoupon('${p.code}')" class="secondary-btn" style="padding:4px 8px; font-size:0.7rem; color:var(--danger);">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const counterLabel = document.getElementById("marketingCouponsCount");
  if (counterLabel) counterLabel.innerText = db.promos.length;
}

function handlePromoSubmit(e) {
  e.preventDefault();
  const code = document.getElementById("promoCode").value.trim().toUpperCase();
  const type = document.getElementById("promoType").value;
  const value = parseFloat(document.getElementById("promoValue").value);
  const desc = document.getElementById("promoDescription").value;

  if (db.promos.find(p => p.code === code)) {
    showToast("Promo code already exists.");
    return;
  }

  db.promos.push({ code, type, value, description: desc || `Discount code ${code}`, uses: 0 });
  saveDB();
  e.target.reset();
  updatePromoCouponsTable();
  showToast(`Promo rule created.`);
}

function deletePromoCoupon(code) {
  db.promos = db.promos.filter(p => p.code !== code);
  saveDB();
  updatePromoCouponsTable();
}

function onCampaignTemplateChange() {
  const temp = document.getElementById("campaignTemplate").value;
  const text = document.getElementById("campaignMessage");
  if (temp === 'festival') {
    text.value = "Laundra Alert! Celebrate this festive season with fresh clothes. Use coupon FESTIVAL15 to get 15% off. Book now!";
  } else if (temp === 'birthday') {
    text.value = "Wishing you a stellar Birthday from all of us at Laundra! As a reward, we have credited a free Steam Press coupon directly to your account.";
  } else if (temp === 'dormant') {
    text.value = "We miss you at Laundra! We have topped up your wallet with $10.00 complimentary credits. Book a pickup today!";
  } else {
    text.value = "";
  }
}

function handleCampaignSubmit(e) {
  e.preventDefault();
  const channel = document.getElementById("campaignChannel").value;
  const group = document.getElementById("campaignTarget").value;
  showToast(`Campaign broadcasted to all targets via ${channel}!`);
  if (typeof confetti === 'function') confetti();
  e.target.reset();
}

// ================= TOAST NOTIFICATION UTILITY =================
function showToast(message) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.background = "#2563eb";
  toast.style.color = "white";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "var(--radius-sm)";
  toast.style.fontSize = "0.85rem";
  toast.style.fontWeight = "600";
  toast.style.boxShadow = "var(--shadow-md)";
  toast.style.zIndex = "100000";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(8px)";
  toast.style.transition = "all 0.25s ease";
  
  toast.innerText = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 50);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => { document.body.removeChild(toast); }, 300);
  }, 3500);
}

// ================= HEADER ACTION CONTROLLERS =================
function openSignInModal() {
  openModal('signInModal');
}

function handleStaffSignInSubmit(e) {
  e.preventDefault();
  const role = document.getElementById("signInRole").value;
  const pin = document.getElementById("signInPin").value;

  if (pin.trim() !== "") {
    db.activeRole = role;
    saveDB();
    document.getElementById("roleSelector").value = role;
    applyRolePermissions();
    closeModal('signInModal');
    e.target.reset();
    
    if (role === 'Delivery Boy') {
      launchPortal('tracking');
      switchWorkspaceSubTab('delivery');
    } else if (role === 'Cashier') {
      launchPortal('operations');
      switchWorkspaceSubTab('pos');
    } else {
      launchPortal('analytics');
      switchWorkspaceSubTab('admin');
    }

    showToast(`Staff sign-in successful: ${role}`);
    addNotification(`Staff authenticated: ${role}`);
    if (typeof confetti === 'function') confetti();
  }
}

function onGetStartedClick() {
  const isLandingPageVisible = document.getElementById("landingPage").style.display !== "none";
  if (isLandingPageVisible) {
    launchPortal('operations');
    switchWorkspaceSubTab('pos');
    showToast("POS billing console ready.");
  } else {
    clearPOSCart();
    showToast("Cart cleared. Ready for fresh transaction.");
  }
}

// ================= ADMIN SIDEBAR MODULE CONTROLLER =================
function switchAdminSidebarModule(moduleId) {
  document.querySelectorAll(".admin-sidebar .sidebar-menu-item").forEach(item => {
    item.classList.remove("active");
  });
  const activeItem = document.getElementById(`side-${moduleId}`);
  if (activeItem) {
    activeItem.classList.add("active");
  }

  document.querySelectorAll(".admin-main-content .admin-module-view").forEach(view => {
    view.classList.remove("active");
  });
  const activeView = document.getElementById(`module-${moduleId}`);
  if (activeView) {
    activeView.classList.add("active");
  }

  // Dynamic content header updates
  const titleMap = {
    'sales-overview': 'Sales Overview',
    'daily-orders': 'Daily Orders',
    'pending-orders': 'Pending Orders',
    'delivery-status': 'Delivery Status',
    'revenue-analytics': 'Revenue Analytics',
    'staff-performance': 'Staff Performance',
    'monthly-reports': 'Monthly Reports',
    'customer-crm': 'Customer CRM',
    'expense-daybook': 'Expense Daybook'
  };
  const title = titleMap[moduleId] || 'Manager Desk';
  const titleEl = document.getElementById("adminActiveModuleTitle");
  if (titleEl) titleEl.innerText = title;
  const breadcrumbEl = document.getElementById("adminActiveModuleBreadcrumb");
  if (breadcrumbEl) breadcrumbEl.innerText = `Manager Desk / ${title}`;

  if (moduleId === 'revenue-analytics') {
    setTimeout(() => {
      initCharts();
    }, 100);
  }
}

function renderSalesOverviewDrawerTable() {
  const tbody = document.getElementById("todaySalesDrawerSummaryBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  const todayOrders = db.orders.filter(o => o.date === '2026-07-01');
  if (!todayOrders.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary); padding:16px;">No transactions logged today.</td></tr>`;
    return;
  }
  todayOrders.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${o.id}</strong></td>
      <td>${o.customerName}</td>
      <td><span class="live-badge" style="background:#e2e8f0; color:#475569;">${o.paymentMethod}</span></td>
      <td><strong>$${o.totalAmount.toFixed(2)}</strong></td>
      <td><span class="live-badge" style="background:#e6fdf4; color:#10b981;">Recorded</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPendingOrdersSidebarTable() {
  const tbody = document.querySelector("#adminPendingOrdersTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const pending = db.orders.filter(o => o.status === 'Received' || o.status === 'Washing' || o.status === 'Ironing');
  if (!pending.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary); padding:16px;">No orders in active processing.</td></tr>`;
    return;
  }
  pending.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${o.id}</strong></td>
      <td>${o.customerName}</td>
      <td><span style="font-size:0.8rem; color:var(--text-secondary);">${o.weightItems}</span></td>
      <td><span class="status-badge ${o.status.toLowerCase()}">${o.status}</span></td>
      <td>
        <select onchange="updateOrderStatus('${o.id}', this.value)" class="table-select-btn">
          <option value="Received" ${o.status === 'Received' ? 'selected' : ''}>Received</option>
          <option value="Washing" ${o.status === 'Washing' ? 'selected' : ''}>Washing</option>
          <option value="Ironing" ${o.status === 'Ironing' ? 'selected' : ''}>Ironing</option>
          <option value="Ready" ${o.status === 'Ready' ? 'selected' : ''}>Ready</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDeliveryStatusSidebarTable() {
  const tbody = document.querySelector("#adminDeliveryStatusTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const deliveries = db.orders.filter(o => o.status === 'Out for Delivery' || o.status === 'Ready' || o.status === 'Delivered');
  if (!deliveries.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary); padding:16px;">No active delivery logs.</td></tr>`;
    return;
  }
  deliveries.forEach(o => {
    const customer = db.customers.find(c => c.id === o.customerId);
    const dest = customer ? customer.address : 'Default Address';
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${o.id}</strong></td>
      <td>👤 ${o.courier || 'John Doe'}</td>
      <td><span style="font-size:0.8rem; color:var(--text-secondary);">${dest}</span></td>
      <td><span class="status-badge ${o.status.toLowerCase().replace(/ /g, '')}">${o.status}</span></td>
      <td>
        <button onclick="launchPortal('tracking'); simulateCustomerTrack('${o.id}');" class="secondary-btn" style="padding:4px 8px; font-size:0.72rem;">Track GPS</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderIcons() {
  document.querySelectorAll('i[class*="lucide-"]').forEach(el => {
    const cls = Array.from(el.classList).find(c => c.startsWith("lucide-"));
    if (cls) {
      const name = cls.replace("lucide-", "");
      el.setAttribute("data-lucide", name);
    }
  });
  lucide.createIcons();
}

function handleStaffSignOut() {
  db.activeRole = 'Customer';
  saveDB();
  document.getElementById("roleSelector").value = "Admin";
  applyRolePermissions();
  showLandingPage();
  showToast("Logged out successfully.");
}
