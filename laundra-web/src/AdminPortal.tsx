import React, { useState, useEffect } from 'react';
import { useDatabase, type Order, type Service, type Customer, type User, type Expense } from './DatabaseContext';
import { PortalLayout } from './components/PortalLayout';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AdminPortal: React.FC = () => {
  const { db, saveDB } = useDatabase();

  // Active Module tab state
  const [activeModule, setActiveModule] = useState<string>(() => {
    return localStorage.getItem('ll_active_admin_module') || 'sales-overview';
  });

  useEffect(() => {
    localStorage.setItem('ll_active_admin_module', activeModule);
  }, [activeModule]);

  // Adjust module tab based on role permissions on load
  useEffect(() => {
    if (db.activeRole === 'Delivery Boy') {
      const allowed = ['pending-orders', 'your-orders', 'daily-orders', 'delivery-status'];
      if (!allowed.includes(activeModule)) {
        setActiveModule('pending-orders');
      }
    }
  }, [db.activeRole]);

  // General Modal States
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  
  // Service Catalog Modals
  const [addingService, setAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Expense Modals
  const [addingExpense, setAddingExpense] = useState(false);

  // CRM Modals
  const [adjustingWalletCust, setAdjustingWalletCust] = useState<Customer | null>(null);

  // POS State
  const [posCategory, setPosCategory] = useState('All');
  const [posSearch, setPosSearch] = useState('');
  const [posExpress, setPosExpress] = useState(false);
  const [posCart, setPosCart] = useState<{ service: Service; qty: number; express: boolean }[]>([]);
  const [posCustId, setPosCustId] = useState('');
  const [posPayMethod, setPosPayMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Wallet'>('Cash');
  const [activeReceipt, setActiveReceipt] = useState<Order | null>(null);

  // Users Management form inputs
  const [uName, setUName] = useState('');
  const [uRole, setURole] = useState<'admin' | 'delivery' | 'customer'>('delivery');
  const [uEmail, setUEmail] = useState('');
  const [uPhone, setUPhone] = useState('');
  const [uAddress, setUAddress] = useState('');
  const [uPassword, setUPassword] = useState('');

  // Service form inputs
  const [sName, setSName] = useState('');
  const [sCategory, setSCategory] = useState('Wash & Fold');
  const [sPrice, setSPrice] = useState('');
  const [sSurcharge, setSSurcharge] = useState('50');

  // Expense form inputs
  const [eCategory, setECategory] = useState('Chemicals & Detergents');
  const [eDesc, setEDesc] = useState('');
  const [eSource, setESource] = useState('Drawer Cash');
  const [eAmount, setEAmount] = useState('');

  // Wallet adjustment inputs
  const [walletAmt, setWalletAmt] = useState('');
  const [walletDir, setWalletDir] = useState<'in' | 'out'>('in');

  // Daily Orders search & filter state
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersBranchFilter, setOrdersBranchFilter] = useState('All');

  // Dynamic Chart Configurations
  const salesChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Gross Sales (QR)',
      data: [420.50, 680.00, 550.00, 910.00, 840.00, 1100.20, 1280.50],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      borderWidth: 3,
      pointBackgroundColor: '#ec4899',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      fill: true,
      tension: 0.4
    }]
  };

  const doughnutChartData = {
    labels: ['Wash & Fold', 'Dry Cleaning', 'Steam Press', 'Premium Services'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  // KPI calculations
  const todaySales = db.orders.filter(o => o.date === '2026-07-01').reduce((acc, curr) => acc + (curr.totalAmount || curr.total || 0), 0);
  const activeDeliveries = db.orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const activeCouriersCount = db.orders.filter(o => o.status === 'Out for Delivery').length;

  const getServicePrice = (srv: Service | null, plan: 'normal' | 'express') => {
    if (!srv) return 0;
    let base = srv.price;
    if (plan === 'express') {
      base = base * 1.5;
    }
    return base;
  };

  // --- ACTIONS ---

  // Order Details Status update
  const handleUpdateOrderStatus = (orderId: string, nextStatus: any, nextDeliveryStatus: string) => {
    const updated = db.orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus, deliveryStatus: nextDeliveryStatus };
      }
      return o;
    });
    saveDB({ orders: updated });
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder({ ...viewingOrder, status: nextStatus, deliveryStatus: nextDeliveryStatus });
    }
  };

  const handleUpdateOrderCourier = (orderId: string, courierName: string) => {
    const updated = db.orders.map(o => {
      if (o.id === orderId) {
        return { ...o, courier: courierName, deliveryStatus: 'Assigned to Courier' };
      }
      return o;
    });
    saveDB({ orders: updated });
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder({ ...viewingOrder, courier: courierName, deliveryStatus: 'Assigned to Courier' });
    }
  };

  const handleAcceptOrder = (order: Order) => {
    const courier = db.currentDeliveryBoy || 'John Doe';
    const updated = db.orders.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          courier: courier,
          status: 'Accepted' as const,
          deliveryStatus: 'Accepted by Courier'
        };
      }
      return o;
    });
    saveDB({ orders: updated });
    // Redirect to Your Orders
    setActiveModule('your-orders');
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Delete order #' + orderId + '?')) {
      const updated = db.orders.filter(o => o.id !== orderId);
      saveDB({ orders: updated });
      setViewingOrder(null);
    }
  };

  // User Management actions
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: 'u-' + (db.users.length + 1),
      name: uName,
      role: uRole,
      email: uEmail,
      phone: uPhone,
      address: uAddress,
      password: uPassword || 'password',
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    saveDB({ users: [...db.users, newUser] });
    setAddingUser(false);
    // Reset forms
    setUName('');
    setUEmail('');
    setUPhone('');
    setUAddress('');
    setUPassword('');
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const updated = db.users.map(u => {
      if (u.id === editingUser.id) {
        return { ...u, name: uName, role: uRole, email: uEmail, phone: uPhone, address: uAddress };
      }
      return u;
    });
    saveDB({ users: updated });
    setEditingUser(null);
  };

  // Service Catalog actions
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: Service = {
      id: 'srv-' + (db.services.length + 1),
      name: sName,
      category: sCategory,
      price: parseFloat(sPrice) || 0,
      expressSurcharge: parseInt(sSurcharge) || 50,
      active: true
    };
    saveDB({ services: [...db.services, newService] });
    setAddingService(false);
    setSName('');
    setSPrice('');
  };

  const handleSaveEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = db.services.map(s => {
      if (s.id === editingService.id) {
        return { ...s, name: sName, category: sCategory, price: parseFloat(sPrice) || 0, expressSurcharge: parseInt(sSurcharge) || 50 };
      }
      return s;
    });
    saveDB({ services: updated });
    setEditingService(null);
  };

  // Expense actions
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(eAmount) || 0;
    const newExpense: Expense = {
      date: new Date().toISOString().split('T')[0],
      category: eCategory,
      description: eDesc,
      source: eSource,
      loggedBy: db.activeRole + ' Agent',
      amount: amt
    };
    saveDB({
      expenses: [...db.expenses, newExpense],
      drawerCash: eSource === 'Drawer Cash' ? db.drawerCash - amt : db.drawerCash
    });
    setAddingExpense(false);
    setEDesc('');
    setEAmount('');
  };

  // Wallet adjustment
  const handleAdjustWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingWalletCust) return;
    const amt = parseFloat(walletAmt) || 0;
    const diff = walletDir === 'in' ? amt : -amt;

    const updated = db.customers.map(c => {
      if (c.id === adjustingWalletCust.id) {
        return { ...c, walletBalance: Math.max(0, c.walletBalance + diff) };
      }
      return c;
    });
    saveDB({ customers: updated });
    setAdjustingWalletCust(null);
    setWalletAmt('');
  };

  // --- POS CART ACTIONS ---
  const handleAddCartItem = (srv: Service) => {
    const existing = posCart.find(item => item.service.id === srv.id && item.express === posExpress);
    if (existing) {
      setPosCart(posCart.map(item => item.service.id === srv.id && item.express === posExpress ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setPosCart([...posCart, { service: srv, qty: 1, express: posExpress }]);
    }
  };

  const handleUpdateCartQty = (idx: number, delta: number) => {
    const updated = posCart.map((item, i) => {
      if (i === idx) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    });
    setPosCart(updated);
  };

  const handleRemoveCartItem = (idx: number) => {
    setPosCart(posCart.filter((_, i) => i !== idx));
  };

  const getPOSCartTotal = () => {
    return posCart.reduce((sum, item) => {
      let base = item.service.price;
      if (item.express) base = base * 1.5;
      return sum + (base * item.qty);
    }, 0);
  };

  const handleCheckoutPOS = () => {
    if (posCart.length === 0) return;
    
    const isGuest = !posCustId;
    const total = getPOSCartTotal();
    
    let updatedCustomers = db.customers;
    let customerId = 'guest';
    let customerName = 'Guest Customer';

    if (!isGuest) {
      const cust = db.customers.find(c => c.id === posCustId)!;
      customerId = cust.id;
      customerName = cust.name;

      if (posPayMethod === 'Wallet') {
        if (cust.walletBalance < total) {
          alert('Insufficient customer wallet balance!');
          return;
        }
        updatedCustomers = db.customers.map(c => {
          if (c.id === cust.id) {
            return { ...c, walletBalance: c.walletBalance - total };
          }
          return c;
        });
      }
    } else {
      if (posPayMethod === 'Wallet') {
        alert('Wallet payment is not available for Guest checkout!');
        return;
      }
    }

    const orderId = 'OR-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: orderId,
      customerId: customerId,
      customerName: customerName,
      branch: db.activeBranch,
      date: new Date().toISOString().split('T')[0],
      weightItems: `${posCart.reduce((s, c) => s + c.qty, 0)} Items (POS checkout)`,
      paymentMethod: posPayMethod,
      status: 'Ready',
      courier: null,
      deliveryStatus: 'Pending Assignment',
      totalAmount: total,
      total: total
    };

    saveDB({
      orders: [...db.orders, newOrder],
      drawerCash: posPayMethod === 'Cash' ? db.drawerCash + total : db.drawerCash,
      customers: updatedCustomers
    });

    setPosCart([]);
    setActiveReceipt(newOrder);
  };

  return (
    <PortalLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      
      {/* 1. SALES OVERVIEW MODULE */}
      {activeModule === 'sales-overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Stats KPI grid */}
          <div className="stats-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="stat-card-premium" style={{ background: 'linear-gradient(135deg, #4f46e5, #ec4899)', color: 'white', borderRadius: '16px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.82rem', opacity: 0.9 }}>GROSS SALES</h4>
              <div style={{ fontSize: '2.2rem', fontWeight: '800' }}>QR {todaySales.toFixed(2)}</div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>+14.5% vs yesterday</span>
            </div>
            <div className="stat-card-premium" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '16px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#64748b' }}>REGISTER CASH</h4>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a' }}>QR {db.drawerCash.toFixed(2)}</div>
            </div>
            <div className="stat-card-premium" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '16px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#64748b' }}>ACTIVE ORDERS</h4>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#3b82f6' }}>{activeDeliveries}</div>
            </div>
            <div className="stat-card-premium" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '16px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#64748b' }}>ACTIVE COURIERS</h4>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#a855f7' }}>{activeCouriersCount} En Route</div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: '800' }}>Revenue Trend</h3>
              <div style={{ height: '260px' }}>
                <Line data={salesChartData} options={chartOptions} />
              </div>
            </div>
            <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: '800' }}>Categories Share</h3>
              <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
                <Doughnut data={doughnutChartData} options={{ ...chartOptions, plugins: { legend: { display: true, position: 'bottom' } } }} />
              </div>
            </div>
          </div>

          {/* Drawer summary table */}
          <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '800' }}>Today's Drawer Summary</h3>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Order ID</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Payment</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {db.orders.filter(o => o.date === '2026-07-01').map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>#{o.id}</td>
                    <td style={{ padding: '12px' }}>{o.customerName}</td>
                    <td style={{ padding: '12px' }}>{o.paymentMethod}</td>
                    <td style={{ padding: '12px', fontWeight: '700' }}>QR {(o.totalAmount || o.total || 0).toFixed(2)}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="live-badge" style={{ background: '#e6fdf4', color: '#10b981' }}>Recorded</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 2. DAILY ORDERS MODULE */}
      {activeModule === 'daily-orders' && (
        <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          
          {/* Filters row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Search order ID, customer name..." 
              value={ordersSearch}
              onChange={(e) => setOrdersSearch(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
            <select 
              value={ordersBranchFilter} 
              onChange={(e) => setOrdersBranchFilter(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value="All">All Branches</option>
              <option value="Downtown HQ">Downtown HQ</option>
              <option value="Uptown Premium">Uptown Premium</option>
            </select>
          </div>

          {/* Orders Table */}
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Branch</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {db.orders
                .filter(o => {
                  const matchesSearch = o.id.toLowerCase().includes(ordersSearch.toLowerCase()) || o.customerName.toLowerCase().includes(ordersSearch.toLowerCase());
                  const matchesBranch = ordersBranchFilter === 'All' || o.branch === ordersBranchFilter;
                  return matchesSearch && matchesBranch;
                })
                .map(o => {
                  const displayStatus = o.status === 'Received' ? 'Picked Up' : o.status;
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: '700' }}>#{o.id}</td>
                      <td style={{ padding: '12px' }}>{o.customerName}</td>
                      <td style={{ padding: '12px' }}>{o.branch}</td>
                      <td style={{ padding: '12px' }}>{o.date}</td>
                      <td style={{ padding: '12px', fontWeight: '700' }}>${(o.totalAmount || o.total || 0).toFixed(2)}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`status-badge status-${displayStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button onClick={() => setViewingOrder(o)} className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. PENDING ORDERS MODULE */}
      {activeModule === 'pending-orders' && (
        <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '800' }}>Available Deliveries / Pickups</h3>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Items Details</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Logistics Status</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {db.orders
                .filter(o => !o.courier) // Only unassigned orders
                .map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>#{o.id}</td>
                    <td style={{ padding: '12px' }}>{o.customerName}</td>
                    <td style={{ padding: '12px' }}>{o.weightItems}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="live-badge" style={{ background: '#fef3c7', color: '#d97706' }}>{o.deliveryStatus}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button onClick={() => handleAcceptOrder(o)} className="primary-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#3b82f6', color: 'white', border: 'none' }}>
                        Accept Delivery
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. YOUR ORDERS MODULE */}
      {activeModule === 'your-orders' && (
        <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '800' }}>Orders Assigned to You</h3>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Items</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Progress</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {db.orders
                .filter(o => o.courier === (db.currentDeliveryBoy || 'John Doe'))
                .map(o => {
                  const displayStatus = o.status === 'Received' ? 'Picked Up' : o.status;
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: '700' }}>#{o.id}</td>
                      <td style={{ padding: '12px' }}>{o.customerName}</td>
                      <td style={{ padding: '12px' }}>{o.weightItems}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`status-badge status-${displayStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {o.status === 'Pending' && (
                          <button 
                            onClick={() => handleUpdateOrderStatus(o.id, 'Received', 'Picked Up')} 
                            className="primary-btn" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#10b981', border: 'none', color: 'white' }}
                          >
                            Picked Up
                          </button>
                        )}
                        {o.status === 'Ready' && (
                          <button 
                            onClick={() => handleUpdateOrderStatus(o.id, 'Out for Delivery', 'Out for Delivery')} 
                            className="primary-btn" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#f59e0b', border: 'none', color: 'white' }}
                          >
                            Out for Delivery
                          </button>
                        )}
                        {o.status === 'Out for Delivery' && (
                          <button 
                            onClick={() => {
                              handleUpdateOrderStatus(o.id, 'Delivered', 'Delivered');
                              if ((window as any).confetti) (window as any).confetti();
                            }} 
                            className="primary-btn" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#10b981', border: 'none', color: 'white' }}
                          >
                            Mark Delivered
                          </button>
                        )}
                        {['Received', 'Washing', 'Ironing', 'Processing'].includes(o.status) && (
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Washing in progress...</span>
                        )}
                        {o.status === 'Delivered' && (
                          <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '700' }}>✓ Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. DELIVERY STATUS MODULE */}
      {activeModule === 'delivery-status' && (
        <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '800' }}>Active Courier tracking</h3>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Courier</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Destination</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {db.orders
                .filter(o => o.courier)
                .map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>#{o.id}</td>
                    <td style={{ padding: '12px' }}>👤 {o.courier}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{o.address || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`status-badge status-${o.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. USER MANAGEMENT MODULE */}
      {activeModule === 'user-management' && (
        <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Staff Members</h3>
            <button onClick={() => setAddingUser(true)} className="primary-btn" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px' }}>
              + Add User
            </button>
          </div>
          
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Phone</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {db.users.filter(u => u.role !== 'customer').map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: '700' }}>{u.name}</td>
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>{u.role}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>{u.phone || 'N/A'}</td>
                  <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button onClick={() => { setSelectedUser(u); }} className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.85rem' }}>View</button>
                    <button onClick={() => { setEditingUser(u); setUName(u.name); setURole(u.role); setUEmail(u.email); setUPhone(u.phone || ''); setUAddress(u.address || ''); }} className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.85rem' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 7. CUSTOMER USERS MODULE */}
      {activeModule === 'customer-users' && (
        <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '800' }}>Registered Customer Accounts</h3>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Customer ID</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Password</th>
              </tr>
            </thead>
            <tbody>
              {db.users.filter(u => u.role === 'customer').map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: '700' }}>{u.id}</td>
                  <td style={{ padding: '12px' }}>{u.name}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>{u.password || 'password'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}



      {/* 11. SERVICES CATALOG MODULE */}
      {activeModule === 'services' && (
        <div className="glass-card" style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Catalog Items</h3>
            <button onClick={() => setAddingService(true)} className="primary-btn" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px' }}>
              + Add Service
            </button>
          </div>

          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Service Name</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Rate</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Express Surcharge</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {db.services.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: '700' }}>{s.name}</td>
                  <td style={{ padding: '12px' }}>{s.category}</td>
                  <td style={{ padding: '12px', fontWeight: '700' }}>QR {s.price.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>{s.expressSurcharge}%</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => { setEditingService(s); setSName(s.name); setSCategory(s.category); setSPrice(s.price.toString()); setSSurcharge(s.expressSurcharge.toString()); }} className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 12. POS BILLING MODULE */}
      {activeModule === 'pos' && (
        <div className="pos-workspace-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
          
          <div className="pos-catalog-wrapper" style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div className="pos-category-scroller" style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '8px' }}>
              {['All', 'Wash & Fold', 'Dry Cleaning', 'Steam Press', 'Premium Services', 'Express Services', 'Hotel Laundry', 'Commercial Laundry'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setPosCategory(cat)}
                  className={`pos-category-btn ${posCategory === cat ? 'active' : ''}`}
                  style={{ whiteSpace: 'nowrap', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="pos-search-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={posSearch}
                onChange={(e) => setPosSearch(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}>
                <input type="checkbox" checked={posExpress} onChange={(e) => setPosExpress(e.target.checked)} />
                <span>Express Surcharge (+50%)</span>
              </label>
            </div>

              <div className="pos-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
                {db.services
                  .filter(s => {
                  const matchSearch = s.name.toLowerCase().includes(posSearch.toLowerCase());
                  const matchCategory = posCategory === 'All' || s.category === posCategory;
                  return s.active && matchSearch && matchCategory;
                })
                .map(s => (
                  <div key={s.id} onClick={() => handleAddCartItem(s)} style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px', cursor: 'pointer', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{s.name}</div>
                    <div style={{ color: '#2563eb', fontWeight: '800', marginTop: 'auto' }}>
                      QR {getServicePrice(s, posExpress ? 'express' : 'normal').toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
          </div>

          <div className="pos-cart-panel" style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>POS Cart</h3>
            
            <select 
              value={posCustId} 
              onChange={(e) => setPosCustId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value="">-- Guest Checkout --</option>
              {db.customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} (QR {c.walletBalance.toFixed(2)})</option>
              ))}
            </select>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '200px' }}>
              {posCart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.service.name}</div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {item.express ? 'Express' : 'Normal'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => handleUpdateCartQty(idx, -1)} style={{ padding: '2px 8px' }}>-</button>
                    <span style={{ fontWeight: '700' }}>{item.qty}</span>
                    <button onClick={() => handleUpdateCartQty(idx, 1)} style={{ padding: '2px 8px' }}>+</button>
                    <button onClick={() => handleRemoveCartItem(idx)} style={{ color: '#ef4444', border: 'none', background: 'transparent' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.2rem', marginBottom: '16px' }}>
                <span>Total Amount:</span>
                <span>QR {getPOSCartTotal().toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {['Cash', 'Card', 'UPI', 'Wallet'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setPosPayMethod(m as any)}
                    className={`secondary-btn ${posPayMethod === m ? 'active' : ''}`}
                    style={{ flex: 1, padding: '8px 0', fontSize: '0.8rem' }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleCheckoutPOS}
                disabled={posCart.length === 0}
                className="primary-btn" 
                style={{ width: '100%', justifyContent: 'center', height: '44px', background: '#2563eb', color: 'white', border: 'none' }}
              >
                Checkout & Print Invoice
              </button>
            </div>
          </div>

        </div>
      )}

      {/* --- MODAL: VIEW / ASSIGN ORDER DETAILS --- */}
      {viewingOrder && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '480px', borderRadius: '16px', overflow: 'hidden', padding: 0, background: 'white' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px 24px', color: 'white', position: 'relative' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>Operations Desk - Order Details</h3>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '0.85rem' }}>Order ID: #{viewingOrder.id}</p>
              <button onClick={() => setViewingOrder(null)} className="icon-btn" style={{ position: 'absolute', right: '16px', top: '16px', color: 'white', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Customer</label>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{viewingOrder.customerName}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Amount</label>
                  <div style={{ fontWeight: '700', color: '#2563eb', fontSize: '1.1rem' }}>QR {(viewingOrder.totalAmount || viewingOrder.total || 0).toFixed(2)}</div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Status</label>
                <div style={{ marginTop: '2px', display: 'flex', gap: '6px' }}>
                  <select 
                    value={viewingOrder.status}
                    onChange={(e) => handleUpdateOrderStatus(viewingOrder.id, e.target.value as any, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Received">Picked Up</option>
                    <option value="Washing">Washing</option>
                    <option value="Ironing">Ironing</option>
                    <option value="Ready">Ready</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Assign Courier</label>
                <select 
                  value={viewingOrder.courier || ''}
                  onChange={(e) => handleUpdateOrderCourier(viewingOrder.id, e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                >
                  <option value="">-- Unassigned --</option>
                  {db.users.filter(u => u.role === 'delivery').map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => handleDeleteOrder(viewingOrder.id)} className="secondary-btn" style={{ borderColor: '#ef4444', color: '#ef4444', padding: '6px 12px' }}>
                  Delete Order
                </button>
                <button onClick={() => setViewingOrder(null)} className="primary-btn" style={{ padding: '6px 16px' }}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: STAFF MANAGEMENT --- */}
      {(addingUser || editingUser) && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: 0, background: 'white' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px 24px', color: 'white', position: 'relative' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>{addingUser ? 'Add Staff Member' : 'Edit Staff Member'}</h3>
              <button onClick={() => { setAddingUser(false); setEditingUser(null); }} className="icon-btn" style={{ position: 'absolute', right: '16px', top: '16px', color: 'white', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            
            <form onSubmit={addingUser ? handleCreateUser : handleSaveEditUser} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={uName} onChange={(e) => setUName(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={uRole} onChange={(e) => setURole(e.target.value as any)} className="form-input" required>
                  <option value="admin">Admin</option>
                  <option value="delivery">Delivery staff</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={uEmail} onChange={(e) => setUEmail(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" value={uPhone} onChange={(e) => setUPhone(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={uAddress} onChange={(e) => setUAddress(e.target.value)} className="form-input" />
              </div>
              {addingUser && (
                <div className="form-group">
                  <label>Login Password</label>
                  <input type="password" value={uPassword} onChange={(e) => setUPassword(e.target.value)} className="form-input" placeholder="password" />
                </div>
              )}
              
              <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center', height: '44px', background: '#2563eb', color: 'white', border: 'none' }}>
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: STAFF DETAILS VIEWER --- */}
      {selectedUser && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: 0, background: 'white' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px 24px', color: 'white', position: 'relative' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>Staff Profile Details</h3>
              <button onClick={() => setSelectedUser(null)} className="icon-btn" style={{ position: 'absolute', right: '16px', top: '16px', color: 'white', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Full Name</label>
                <div style={{ fontWeight: '600', fontSize: '1rem', marginTop: '2px' }}>{selectedUser.name}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Role</label>
                <div style={{ fontWeight: '600', textTransform: 'capitalize', marginTop: '2px' }}>{selectedUser.role}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Email Address</label>
                <div style={{ fontWeight: '600', marginTop: '2px' }}>{selectedUser.email}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Phone</label>
                <div style={{ fontWeight: '600', marginTop: '2px' }}>{selectedUser.phone || 'N/A'}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Address</label>
                <div style={{ fontWeight: '600', marginTop: '2px' }}>{selectedUser.address || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: SERVICES CATALOG --- */}
      {(addingService || editingService) && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: 0, background: 'white' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px 24px', color: 'white', position: 'relative' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>{addingService ? 'Add Catalog Service' : 'Edit Catalog Service'}</h3>
              <button onClick={() => { setAddingService(false); setEditingService(null); }} className="icon-btn" style={{ position: 'absolute', right: '16px', top: '16px', color: 'white', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            
            <form onSubmit={addingService ? handleCreateService : handleSaveEditService} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Service Name</label>
                <input type="text" value={sName} onChange={(e) => setSName(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={sCategory} onChange={(e) => setSCategory(e.target.value)} className="form-input" required>
                  <option value="Wash & Fold">Wash & Fold</option>
                  <option value="Dry Cleaning">Dry Cleaning</option>
                  <option value="Steam Press">Steam Press</option>
                  <option value="Premium Services">Premium Services</option>
                  <option value="Express Services">Express Services</option>
                </select>
              </div>
              <div className="form-group">
                <label>Base Price (QR)</label>
                <input type="text" value={sPrice} onChange={(e) => setSPrice(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Express Surcharge (%)</label>
                <input type="number" value={sSurcharge} onChange={(e) => setSSurcharge(e.target.value)} className="form-input" required />
              </div>
              
              <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center', height: '44px', background: '#2563eb', color: 'white', border: 'none' }}>
                Save Service
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: LOG EXPENSE --- */}
      {addingExpense && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: 0, background: 'white' }}>
            <div style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)', padding: '20px 24px', color: 'white', position: 'relative' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>Log New Expense</h3>
              <button onClick={() => setAddingExpense(false)} className="icon-btn" style={{ position: 'absolute', right: '16px', top: '16px', color: 'white', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            
            <form onSubmit={handleCreateExpense} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Category</label>
                <select value={eCategory} onChange={(e) => setECategory(e.target.value)} className="form-input" required>
                  <option value="Chemicals & Detergents">Chemicals & Detergents</option>
                  <option value="Machinery Rent/Repair">Machinery Rent/Repair</option>
                  <option value="Logistics Fuel">Logistics Fuel</option>
                  <option value="Marketing Promotions">Marketing Promotions</option>
                  <option value="Utility Bills">Utility Bills</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description Details</label>
                <input type="text" value={eDesc} onChange={(e) => setEDesc(e.target.value)} className="form-input" required placeholder="Press safety latch fix..." />
              </div>
              <div className="form-group">
                <label>Source Account</label>
                <select value={eSource} onChange={(e) => setESource(e.target.value)} className="form-input" required>
                  <option value="Drawer Cash">Drawer Cash</option>
                  <option value="Bank Account">Bank Account</option>
                </select>
              </div>
              <div className="form-group">
                <label>Expense Amount (QR)</label>
                <input type="text" value={eAmount} onChange={(e) => setEAmount(e.target.value)} className="form-input" required placeholder="0.00" />
              </div>
              
              <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center', height: '44px', background: '#ef4444', color: 'white', border: 'none' }}>
                Log Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: WALLET ADJUSTMENT --- */}
      {adjustingWalletCust && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: 0, background: 'white' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '20px 24px', color: 'white', position: 'relative' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>Adjust Wallet Balance</h3>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '0.85rem' }}>Customer: {adjustingWalletCust.name}</p>
              <button onClick={() => setAdjustingWalletCust(null)} className="icon-btn" style={{ position: 'absolute', right: '16px', top: '16px', color: 'white', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            
            <form onSubmit={handleAdjustWallet} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Adjustment Direction</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setWalletDir('in')} className={`secondary-btn ${walletDir === 'in' ? 'active' : ''}`} style={{ flex: 1, padding: '8px 0' }}>Add Cash (Deposit)</button>
                  <button type="button" onClick={() => setWalletDir('out')} className={`secondary-btn ${walletDir === 'out' ? 'active' : ''}`} style={{ flex: 1, padding: '8px 0' }}>Debit Cash (Withdraw)</button>
                </div>
              </div>
              <div className="form-group">
                <label>Amount (QR)</label>
                <input type="text" value={walletAmt} onChange={(e) => setWalletAmt(e.target.value)} className="form-input" required placeholder="0.00" />
              </div>
              <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center', height: '44px', background: '#2563eb', color: 'white', border: 'none' }}>
                Save Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: INVOICE RECEIPT VIEWER --- */}
      {activeReceipt && (
        <div className="modal-overlay active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content receipt-modal" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: '24px', background: 'white' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#1e40af', fontWeight: '800' }}>Laundra</h2>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Operations Desk Invoice</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Order ID:</span>
                <strong style={{ color: '#0f172a' }}>#{activeReceipt.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Date:</span>
                <span>{activeReceipt.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Customer:</span>
                <span>{activeReceipt.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Branch:</span>
                <span>{activeReceipt.branch}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment Type:</span>
                <span>{activeReceipt.paymentMethod}</span>
              </div>
              
              <div style={{ borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '12px 0', margin: '8px 0', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem', color: '#2563eb' }}>
                <span>Grand Total:</span>
                <span>QR {(activeReceipt.totalAmount || activeReceipt.total || 0).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => { if ((window as any).print) window.print(); }} className="secondary-btn" style={{ flex: 1, height: '40px', justifyContent: 'center' }}>Print Invoice</button>
              <button onClick={() => setActiveReceipt(null)} className="primary-btn" style={{ flex: 1, height: '40px', justifyContent: 'center', background: '#2563eb', color: 'white', border: 'none' }}>Close</button>
            </div>
          </div>
        </div>
      )}

    </PortalLayout>
  );
};
