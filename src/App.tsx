import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. DATA MODELS & TYPES
// ==========================================
export type StoreCategory = 
  | 'Restaurant' 
  | 'Grocery Shop' 
  | 'Fish Stall' 
  | 'Mutton Stall' 
  | 'Chicken Stall' 
  | 'Vegetables Stall';

export interface Variant {
  weight: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  rating: number;
  storeName: string;
  storeId: string;
  price: number;
  image: string;
  category: StoreCategory;
  isAvailable: boolean;
  variants?: Variant[];
}

export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  phone: string;
  password: string;
  address: string;
  image: string;
  isOpen: boolean;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  password: string;
  vehicleNumber: string;
  area: string;
  isOnline: boolean;
  assignedOrdersCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: Variant;
}

export interface OrderItem {
  name: string;
  weight?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  category: StoreCategory;
  items: OrderItem[];
  total: number;
  paymentMethod: 'ONLINE' | 'COD';
  status: 'placed' | 'preparing' | 'ready_for_pickup' | 'picked_up' | 'delivered' | 'rejected';
  rejectedBy?: 'merchant' | 'rider';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  assignedRiderId?: string;
  riderName?: string;
  otp: string;
  createdAt: string;
}

// ==========================================
// AUTOMATIC PROFESSIONAL IMAGE ENGINE
// ==========================================
const getAutoProductImage = (name: string, category: StoreCategory): string => {
  const clean = name.toLowerCase().trim();

  if (clean.includes('biryani')) return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500';
  if (clean.includes('roll')) return 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500';
  if (clean.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500';
  if (clean.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
  if (clean.includes('mutton') || clean.includes('khasi')) return 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500';
  if (clean.includes('chicken') || clean.includes('murgi')) return 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500';
  if (clean.includes('fish') || clean.includes('katla') || clean.includes('rohu') || clean.includes('mach')) return 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500';
  if (clean.includes('potato') || clean.includes('alu')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500';
  if (clean.includes('rice') || clean.includes('chal')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500';

  switch (category) {
    case 'Restaurant': return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500';
    case 'Chicken Stall': return 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500';
    case 'Mutton Stall': return 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500';
    case 'Fish Stall': return 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500';
    case 'Vegetables Stall': return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500';
    case 'Grocery Shop': return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500';
    default: return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
  }
};

// ==========================================
// 2. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [role, setRole] = useState<'customer' | 'merchant' | 'rider' | 'admin'>('customer');
  const [showSplash, setShowSplash] = useState(true);

  // Splash Screen timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Global Stores
  const [stores, setStores] = useState<Store[]>([
    {
      id: 'STORE-101',
      name: 'Main Market Fresh Store',
      category: 'Chicken Stall',
      phone: '9876543210',
      password: '123',
      address: 'Suri Main Market',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500',
      isOpen: true
    }
  ]);

  // Global Riders for Equal 50/50 Distribution
  const [riders, setRiders] = useState<Rider[]>([
    {
      id: 'RIDER-501',
      name: 'Rajesh Mukherjee',
      phone: '9832100001',
      password: '123',
      vehicleNumber: 'WB-54-A-1234',
      area: 'Suri Town',
      isOnline: true,
      assignedOrdersCount: 0
    },
    {
      id: 'RIDER-502',
      name: 'Amit Mondal',
      phone: '9832100002',
      password: '123',
      vehicleNumber: 'WB-54-B-5678',
      area: 'Station Area, Suri',
      isOnline: true,
      assignedOrdersCount: 0
    }
  ]);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Sound Engine
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenIntervalRef = useRef<any>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playOrderAlarmTone = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const toneSequence = [
        { freq: 1046.50, time: 0.00, dur: 0.12 },
        { freq: 783.99,  time: 0.12, dur: 0.14 },
        { freq: 1046.50, time: 0.28, dur: 0.35 }
      ];

      toneSequence.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);
        gain.gain.setValueAtTime(0.9, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch (err) {
      console.log('Audio error', err);
    }
  };

  const stopLoopingAlarm = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
  };

  const startLoopingAlarm = () => {
    if (sirenIntervalRef.current) return;
    playOrderAlarmTone();
    sirenIntervalRef.current = setInterval(() => {
      playOrderAlarmTone();
    }, 1100);
  };

  // Fair Dispatch Logic
  const assignOrderFairlyToRider = (orderId: string) => {
    const onlineRiders = riders.filter(r => r.isOnline);
    if (onlineRiders.length === 0) {
      alert('Order is ready, but no delivery rider is currently ONLINE!');
      return;
    }

    const busyRiderIds = orders
      .filter(o => ['ready_for_pickup', 'picked_up'].includes(o.status) && o.assignedRiderId)
      .map(o => o.assignedRiderId);

    const eligibleRiders = onlineRiders.filter(r => !busyRiderIds.includes(r.id));

    if (eligibleRiders.length === 0) {
      alert('All online riders are currently delivering active orders. Order queued.');
      return;
    }

    eligibleRiders.sort((a, b) => a.assignedOrdersCount - b.assignedOrdersCount);
    const chosenRider = eligibleRiders[0];

    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      assignedRiderId: chosenRider.id,
      riderName: chosenRider.name
    } : o));

    setRiders(prev => prev.map(r => r.id === chosenRider.id ? {
      ...r,
      assignedOrdersCount: r.assignedOrdersCount + 1
    } : r));

    alert(`Order ${orderId} fairly dispatched to ${chosenRider.name} (Assigned Count: ${chosenRider.assignedOrdersCount + 1})`);
  };

  // Customer Module State
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerOtp, setCustomerOtp] = useState('');
  const [generatedCustomerOtp, setGeneratedCustomerOtp] = useState<string | null>(null);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerOtpStep, setCustomerOtpStep] = useState(false);

  const [customerCategory, setCustomerCategory] = useState<string>('All');
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [customerCart, setCustomerCart] = useState<CartItem[]>([]);
  const [customerTab, setCustomerTab] = useState<'home' | 'cart' | 'orders'>('home');
  const [customerVariants, setCustomerVariants] = useState<{ [prodId: number]: number }>({});
  
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [hasUsedFirstOrderCoupon, setHasUsedFirstOrderCoupon] = useState(false);

  const handleSendCustomerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number!');
      return;
    }
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCustomerOtp(mockOtp);
    setCustomerOtpStep(true);
    alert(`[Localo OTP Verification]\nYour OTP is: ${mockOtp}`);
  };

  const handleVerifyCustomerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerOtp.trim() === generatedCustomerOtp) {
      setIsCustomerLoggedIn(true);
      setCustomerOtpStep(false);
      setGeneratedCustomerOtp(null);
    } else {
      alert('Invalid OTP! Please check the 4-digit code.');
    }
  };

  const customerChips = [
    { id: 'All', label: 'All', icon: '⚡' },
    { id: 'Food', label: 'Food', icon: '🍔' },
    { id: 'Groceries', label: 'Groceries', icon: '🛒' },
    { id: 'Meat', label: 'Meat', icon: '🍗' },
    { id: 'Vegetables', label: 'Vegetables', icon: '🥬' },
    { id: 'Fish', label: 'Fish', icon: '🐟' },
  ];

  const getProductVariantIdx = (prodId: number) => customerVariants[prodId] || 0;
  const handleSelectProductVariant = (prodId: number, idx: number) => {
    setCustomerVariants(prev => ({ ...prev, [prodId]: idx }));
  };

  const getCartQuantity = (productId: number) => {
    const vIdx = getProductVariantIdx(productId);
    const prod = products.find(p => p.id === productId);
    const currentWeight = prod?.variants ? prod.variants[vIdx].weight : undefined;
    const item = customerCart.find(i => i.product.id === productId && i.selectedVariant?.weight === currentWeight);
    return item ? item.quantity : 0;
  };

  const handleModifyCart = (product: Product, delta: number) => {
    const storeObj = stores.find(s => s.id === product.storeId);
    if (storeObj && !storeObj.isOpen) {
      alert('This store is currently CLOSED. Cannot add items.');
      return;
    }

    const vIdx = getProductVariantIdx(product.id);
    const selectedVariant = product.variants ? product.variants[vIdx] : undefined;

    setCustomerCart(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.selectedVariant?.weight === selectedVariant?.weight
      );

      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(item => item !== existing);
        return prev.map(item => item === existing ? { ...item, quantity: newQty } : item);
      }

      if (delta > 0) {
        return [...prev, { product, quantity: 1, selectedVariant }];
      }
      return prev;
    });
  };

  const getCartSubtotal = () => {
    return customerCart.reduce((sum, item) => {
      const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const getCartDiscount = () => {
    if (appliedCoupon === 'FIRST30' && !hasUsedFirstOrderCoupon) {
      return Math.min(Math.round(getCartSubtotal() * 0.3), 100);
    }
    return 0;
  };

  const getCartFinalTotal = () => {
    return Math.max(getCartSubtotal() - getCartDiscount(), 0);
  };

  const getTotalCartItemsCount = () => {
    return customerCart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleApplyCoupon = () => {
    if (hasUsedFirstOrderCoupon) {
      setCouponError('You have already redeemed your first-order discount.');
      return;
    }
    if (couponCode.trim().toUpperCase() === 'FIRST30') {
      setAppliedCoupon('FIRST30');
      setCouponError('');
    } else {
      setCouponError('Invalid code! Enter FIRST30 for 30% discount.');
    }
  };

  const handlePlaceCustomerOrder = () => {
    if (!isCustomerLoggedIn) {
      alert('Please login with your mobile number to complete order!');
      return;
    }
    if (customerCart.length === 0) return;

    const targetStore = stores.find(s => s.id === customerCart[0].product.storeId) || stores[0];
    if (!targetStore.isOpen) {
      alert('The store has closed recently. Please remove items from this store.');
      return;
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      storeId: targetStore.id,
      storeName: targetStore.name,
      category: targetStore.category,
      items: customerCart.map(c => ({
        name: c.product.name,
        weight: c.selectedVariant?.weight,
        quantity: c.quantity,
        price: (c.selectedVariant ? c.selectedVariant.price : c.product.price) * c.quantity
      })),
      total: getCartFinalTotal(),
      paymentMethod: paymentMethod,
      status: 'placed',
      customerName: 'Sd Din Mohammad',
      customerPhone: customerPhone || '9876543210',
      customerAddress: 'Main Road, Near Circuit House, Suri',
      otp: generatedOtp,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrders([newOrder, ...orders]);
    setCustomerCart([]);
    if (appliedCoupon === 'FIRST30') {
      setHasUsedFirstOrderCoupon(true);
      setAppliedCoupon(null);
    }
    setCustomerTab('orders');
  };

  const filteredCustomerProducts = products.filter(p => {
    let matchCat = true;
    if (customerCategory === 'Food') matchCat = p.category === 'Restaurant';
    else if (customerCategory === 'Groceries') matchCat = p.category === 'Grocery Shop';
    else if (customerCategory === 'Meat') matchCat = ['Chicken Stall', 'Mutton Stall'].includes(p.category);
    else if (customerCategory === 'Vegetables') matchCat = p.category === 'Vegetables Stall';
    else if (customerCategory === 'Fish') matchCat = p.category === 'Fish Stall';
    
    const matchSearch = p.name.toLowerCase().includes(customerSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Rider Module State
  const [riderLoginPhone, setRiderLoginPhone] = useState('');
  const [riderLoginPassword, setRiderLoginPassword] = useState('');
  const [loggedInRider, setLoggedInRider] = useState<Rider | null>(null);
  const [riderLoginError, setRiderLoginError] = useState('');
  const [riderInputOtps, setRiderInputOtps] = useState<{ [id: string]: string }>({});

  const handleRiderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRiderLoginError('');
    const matched = riders.find(
      r => r.phone.trim() === riderLoginPhone.trim() && r.password.trim() === riderLoginPassword.trim()
    );

    if (matched) {
      setLoggedInRider(matched);
      setRiderLoginPhone('');
      setRiderLoginPassword('');
    } else {
      setRiderLoginError('Invalid Rider ID or Password! Access prohibited until authorized by Super Admin.');
    }
  };

  const handleRiderLogout = () => {
    stopLoopingAlarm();
    setLoggedInRider(null);
  };

  const handleToggleRiderOnline = () => {
    if (!loggedInRider) return;
    const newStatus = !loggedInRider.isOnline;
    setRiders(prev => prev.map(r => r.id === loggedInRider.id ? { ...r, isOnline: newStatus } : r));
    setLoggedInRider({ ...loggedInRider, isOnline: newStatus });
  };

  const riderUnresolved = loggedInRider
    ? orders.filter(o => o.status === 'ready_for_pickup' && o.assignedRiderId === loggedInRider.id)
    : [];

  useEffect(() => {
    if (role === 'rider' && loggedInRider && loggedInRider.isOnline && riderUnresolved.length > 0) {
      startLoopingAlarm();
    } else if (role !== 'merchant') {
      stopLoopingAlarm();
    }
  }, [role, loggedInRider, riderUnresolved.length]);

  const handleRiderReject = (orderId: string) => {
    stopLoopingAlarm();
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedRiderId: undefined, riderName: undefined } : o));
    alert('Task rejected. Dispatched back to system queue.');
  };

  const handleRiderPickupComplete = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'picked_up' } : o));
  };

  const handleRiderDeliverWithOtp = (order: Order) => {
    const entered = riderInputOtps[order.id];
    if (entered !== order.otp) {
      alert('Invalid OTP! Please request correct 4-digit OTP from customer.');
      return;
    }

    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'delivered' } : o));
    alert('Delivery completed successfully! Ready for next dispatched task.');
  };

  const openGoogleMapsLocation = (address: string) => {
    const query = encodeURIComponent(`${address}, Suri, West Bengal`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Merchant Module State
  const [merchantLoginPhone, setMerchantLoginPhone] = useState('');
  const [merchantLoginPassword, setMerchantLoginPassword] = useState('');
  const [loggedInMerchantStore, setLoggedInMerchantStore] = useState<Store | null>(null);
  const [merchantLoginError, setMerchantLoginError] = useState('');

  const [merchantDailyRateInputs, setMerchantDailyRateInputs] = useState<{ [id: number]: string }>({});
  const [showMerchantAddModal, setShowMerchantAddModal] = useState(false);
  const [merchantItemName, setMerchantItemName] = useState('');
  const [merchantItemPrice, setMerchantItemPrice] = useState('');
  const [merchantItemImage, setMerchantItemImage] = useState('');

  const handleMerchantFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMerchantItemImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMerchantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMerchantLoginError('');
    const matchedStore = stores.find(
      s => s.phone.trim() === merchantLoginPhone.trim() && s.password.trim() === merchantLoginPassword.trim()
    );

    if (matchedStore) {
      setLoggedInMerchantStore(matchedStore);
      setMerchantLoginPhone('');
      setMerchantLoginPassword('');
    } else {
      setMerchantLoginError('Invalid Phone Number or Password! Contact Super Admin.');
    }
  };

  const handleMerchantLogout = () => {
    stopLoopingAlarm();
    setLoggedInMerchantStore(null);
  };

  const handleToggleStoreOpen = (storeId: string) => {
    const updated = stores.map(st => st.id === storeId ? { ...st, isOpen: !st.isOpen } : st);
    setStores(updated);
    if (loggedInMerchantStore && loggedInMerchantStore.id === storeId) {
      setLoggedInMerchantStore({ ...loggedInMerchantStore, isOpen: !loggedInMerchantStore.isOpen });
    }
  };

  const merchantUnresolved = loggedInMerchantStore 
    ? orders.filter(o => o.storeId === loggedInMerchantStore.id && o.status === 'placed')
    : [];

  useEffect(() => {
    if (role === 'merchant' && merchantUnresolved.length > 0) {
      startLoopingAlarm();
    } else if (role !== 'rider') {
      stopLoopingAlarm();
    }
  }, [role, merchantUnresolved.length, loggedInMerchantStore]);

  const handleMerchantAccept = (orderId: string) => {
    stopLoopingAlarm();
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'preparing' } : o));
  };

  const handleMerchantReject = (orderId: string) => {
    stopLoopingAlarm();
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'rejected', rejectedBy: 'merchant' } : o));
    alert(`Order ${orderId} has been rejected.`);
  };

  const handleMerchantMarkReady = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'ready_for_pickup' } : o));
    assignOrderFairlyToRider(orderId);
  };

  const handleMerchantUpdateDailyRate = (productId: number) => {
    const newKgPrice = Number(merchantDailyRateInputs[productId]);
    if (!newKgPrice || newKgPrice <= 0) {
      alert('Please enter a valid rate for 1 Kg!');
      return;
    }

    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          price: newKgPrice,
          variants: [
            { weight: '250g', price: Math.round(newKgPrice * 0.25) },
            { weight: '500g', price: Math.round(newKgPrice * 0.50) },
            { weight: '750g', price: Math.round(newKgPrice * 0.75) },
            { weight: '1 kg', price: newKgPrice }
          ]
        };
      }
      return p;
    }));

    setMerchantDailyRateInputs(prev => ({ ...prev, [productId]: '' }));
    alert('Base rate updated! Auto-calculated prices for 250g, 500g, 750g & 1kg.');
  };

  const handleToggleProductStock = (productId: number) => {
    setProducts(products.map(p => p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p));
  };

  const handleMerchantAddNewItem = () => {
    if (!loggedInMerchantStore) return;
    if (!merchantItemName.trim() || !merchantItemPrice) {
      alert('Item name and price are required!');
      return;
    }

    const isDailyRateStore = ['Fish Stall', 'Mutton Stall', 'Chicken Stall', 'Vegetables Stall'].includes(loggedInMerchantStore.category);
    const basePrice = Number(merchantItemPrice);
    const finalImage = merchantItemImage.trim() 
      ? merchantItemImage 
      : getAutoProductImage(merchantItemName, loggedInMerchantStore.category);

    const newProd: Product = {
      id: Date.now(),
      name: merchantItemName.trim(),
      rating: 4.8,
      storeName: loggedInMerchantStore.name,
      storeId: loggedInMerchantStore.id,
      price: basePrice,
      image: finalImage,
      category: loggedInMerchantStore.category,
      isAvailable: true,
      variants: isDailyRateStore ? [
        { weight: '250g', price: Math.round(basePrice * 0.25) },
        { weight: '500g', price: Math.round(basePrice * 0.50) },
        { weight: '750g', price: Math.round(basePrice * 0.75) },
        { weight: '1 kg', price: basePrice }
      ] : undefined
    };

    setProducts([newProd, ...products]);
    setMerchantItemName('');
    setMerchantItemPrice('');
    setMerchantItemImage('');
    setShowMerchantAddModal(false);
    alert('Item added successfully with HD photo!');
  };

  // Super Admin Module State
  const [adminTab, setAdminTab] = useState<'stores' | 'items' | 'riders'>('stores');

  const [adminStoreName, setAdminStoreName] = useState('');
  const [adminStoreCategory, setAdminStoreCategory] = useState<StoreCategory>('Restaurant');
  const [adminStorePhone, setAdminStorePhone] = useState('');
  const [adminStorePassword, setAdminStorePassword] = useState('');
  const [adminStoreAddress, setAdminStoreAddress] = useState('');
  const [adminStoreImage, setAdminStoreImage] = useState('');

  const [adminTargetStoreId, setAdminTargetStoreId] = useState<string>('');
  const [adminProductName, setAdminProductName] = useState('');
  const [adminProductPrice, setAdminProductPrice] = useState('');
  const [adminProductImage, setAdminProductImage] = useState('');

  const [adminRiderName, setAdminRiderName] = useState('');
  const [adminRiderPhone, setAdminRiderPhone] = useState('');
  const [adminRiderPassword, setAdminRiderPassword] = useState('');
  const [adminRiderVehicle, setAdminRiderVehicle] = useState('');
  const [adminRiderArea, setAdminRiderArea] = useState('Suri Town');

  const handleAdminStoreFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAdminStoreImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAdminProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAdminProductImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (stores.length > 0 && !adminTargetStoreId) {
      setAdminTargetStoreId(stores[0].id);
    }
  }, [stores, adminTargetStoreId]);

  const handleAdminCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminStoreName.trim() || !adminStorePhone.trim()) {
      alert('Please enter Store Name and Mobile Number!');
      return;
    }
    const newStoreId = `STORE-${Math.floor(100 + Math.random() * 900)}`;
    const finalStoreImage = adminStoreImage.trim() 
      ? adminStoreImage 
      : getAutoProductImage(adminStoreName, adminStoreCategory);

    const newStore: Store = {
      id: newStoreId,
      name: adminStoreName.trim(),
      category: adminStoreCategory,
      phone: adminStorePhone.trim(),
      password: adminStorePassword.trim() || '123',
      address: adminStoreAddress.trim() || 'Suri, Birbhum',
      image: finalStoreImage,
      isOpen: true
    };
    
    setStores(prev => [newStore, ...prev]);
    setAdminTargetStoreId(newStoreId);
    setAdminStoreName('');
    setAdminStorePhone('');
    setAdminStorePassword('');
    setAdminStoreAddress('');
    setAdminStoreImage('');
    alert(`Success! Store created: "${newStore.name}" (ID: ${newStoreId})`);
  };

  const handleAdminDeleteStore = (storeId: string) => {
    if (window.confirm('Delete this store? Associated products will also be removed.')) {
      setStores(prev => prev.filter(s => s.id !== storeId));
      setProducts(prev => prev.filter(p => p.storeId !== storeId));
      if (loggedInMerchantStore && loggedInMerchantStore.id === storeId) {
        setLoggedInMerchantStore(null);
      }
      alert('Store deleted successfully!');
    }
  };

  const handleAdminAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const store = stores.find(s => s.id === adminTargetStoreId);
    if (!store) {
      alert('Please select a valid store first!');
      return;
    }
    if (!adminProductName.trim() || !adminProductPrice) {
      alert('Please enter Item Name and Price!');
      return;
    }

    const price = Number(adminProductPrice);
    const finalImage = adminProductImage.trim() 
      ? adminProductImage 
      : getAutoProductImage(adminProductName, store.category);

    const newProduct: Product = {
      id: Date.now(),
      name: adminProductName.trim(),
      rating: 4.8,
      storeName: store.name,
      storeId: store.id,
      price: price,
      image: finalImage,
      category: store.category,
      isAvailable: true,
      variants: ['Fish Stall', 'Mutton Stall', 'Chicken Stall', 'Vegetables Stall'].includes(store.category) ? [
        { weight: '250g', price: Math.round(price * 0.25) },
        { weight: '500g', price: Math.round(price * 0.50) },
        { weight: '750g', price: Math.round(price * 0.75) },
        { weight: '1 kg', price: price }
      ] : undefined
    };

    setProducts(prev => [newProduct, ...prev]);
    setAdminProductName('');
    setAdminProductPrice('');
    setAdminProductImage('');
    alert(`Success! "${newProduct.name}" added to ${store.name}`);
  };

  const handleAdminHireRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminRiderName.trim() || !adminRiderPhone.trim() || !adminRiderPassword.trim()) {
      alert('Please enter Rider Name, Mobile Number, and Password!');
      return;
    }
    const newRiderId = `RIDER-${Math.floor(500 + Math.random() * 500)}`;
    const newRider: Rider = {
      id: newRiderId,
      name: adminRiderName.trim(),
      phone: adminRiderPhone.trim(),
      password: adminRiderPassword.trim(),
      vehicleNumber: adminRiderVehicle.trim() || 'WB-54-A-1234',
      area: adminRiderArea.trim() || 'Suri Town',
      isOnline: true,
      assignedOrdersCount: 0
    };
    setRiders(prev => [newRider, ...prev]);
    setAdminRiderName('');
    setAdminRiderPhone('');
    setAdminRiderPassword('');
    setAdminRiderVehicle('');
    alert(`Rider Hired!\nRider Name: ${newRider.name}\nRider ID: ${newRiderId}\nLogin Phone: ${newRider.phone}\nPassword: ${newRider.password}`);
  };

  const handleAdminDeleteRider = (riderId: string) => {
    if (window.confirm('Delete this rider partner account?')) {
      setRiders(prev => prev.filter(r => r.id !== riderId));
      if (loggedInRider && loggedInRider.id === riderId) {
        setLoggedInRider(null);
      }
      alert('Rider account deleted.');
    }
  };

  // =========================================================================
  // AUTHENTIC LOCALO SPLASH SCREEN WITH 3D SCOOTER RIDER & BLACK BACKGROUND
  // =========================================================================
  if (showSplash) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: '#0a0d14', // Premium Deep Black Background (Same as original 3D Localo Logo)
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '30px 16px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Top Location Pill */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
          <div style={{
            background: 'rgba(255, 114, 0, 0.22)',
            border: '1.5px solid #ff7200',
            padding: '8px 14px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '14px' }}>📍</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ff8c00' }}>Suri, West Bengal</span>
          </div>
          <div style={{ fontSize: '11px', opacity: 0.6, letterSpacing: '0.5px' }}>Delivery Hub: Station & Main Road</div>
        </div>

        {/* Center: Real 3D Localo 'L' Pin & Scooter Rider Artwork */}
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '360px' }}>
          
          <div style={{
            width: '100%',
            maxWidth: '280px',
            height: '240px',
            margin: '0 auto 8px auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Embedded 3D Exact Vector Construction of the User Localo Artwork */}
            <svg viewBox="0 0 400 340" width="100%" height="100%">
              <defs>
                {/* 3D Gradients */}
                <linearGradient id="orangeGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffb000" />
                  <stop offset="45%" stopColor="#ff7000" />
                  <stop offset="100%" stopColor="#e04800" />
                </linearGradient>

                <linearGradient id="white3DGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>

                <filter id="glow3D" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#ff7000" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* 1. Motion Speed Streaks behind 'L' */}
              <rect x="25" y="85" width="75" height="15" rx="7.5" fill="#ff9900" opacity="0.95" />
              <rect x="10" y="115" width="80" height="17" rx="8.5" fill="#ff7a00" />
              <rect x="30" y="148" width="65" height="15" rx="7.5" fill="#ff5d00" opacity="0.9" />

              {/* 2. 3D Giant Orange Pin Head with Hole */}
              <path d="M 140 100 C 140 35, 260 35, 260 100 C 260 145, 175 200, 140 200 Z" fill="url(#orangeGrad3D)" filter="url(#glow3D)" />
              <circle cx="200" cy="95" r="28" fill="#0a0d14" />

              {/* 3. Bold White 3D 'L' Pin Structure */}
              {/* L Orange Base Shadow Depth */}
              <path d="M 98 62 L 152 62 L 152 195 L 255 195 L 250 220 L 98 220 Z" fill="#b83c00" />
              {/* L White Front Face */}
              <path d="M 105 55 L 145 55 L 145 185 L 245 185 L 235 210 L 105 210 Z" fill="url(#white3DGrad)" />

              {/* 4. Scooter Rider (Fast Delivery Boy on Scooter) */}
              <g transform="translate(190, 80)">
                {/* Scooter Motion Streaks */}
                <line x1="10" y1="65" x2="35" y2="65" stroke="#ff8c00" strokeWidth="4" strokeLinecap="round" />
                <line x1="0" y1="75" x2="30" y2="75" stroke="#ff8c00" strokeWidth="4" strokeLinecap="round" />

                {/* Scooter Body & Wheels */}
                {/* Back Wheel */}
                <circle cx="50" cy="98" r="15" fill="#1e293b" stroke="#0a0d14" strokeWidth="3" />
                <circle cx="50" cy="98" r="7" fill="#ff7000" />
                {/* Front Wheel */}
                <circle cx="120" cy="98" r="15" fill="#1e293b" stroke="#0a0d14" strokeWidth="3" />
                <circle cx="120" cy="98" r="7" fill="#ff7000" />
                {/* Scooter Frame */}
                <path d="M 45 90 L 75 90 L 95 65 L 115 88 Z" fill="#ff7000" />
                <path d="M 85 88 L 115 50 L 122 50" stroke="#ff9900" strokeWidth="6" strokeLinecap="round" />
                {/* Headlight Beam */}
                <circle cx="118" cy="50" r="5" fill="#fef08a" />

                {/* Delivery Box Backpack */}
                <rect x="36" y="38" width="28" height="28" rx="5" fill="#e05800" stroke="#ffa200" strokeWidth="2" />

                {/* Delivery Boy Rider (White Suit + Yellow Helmet) */}
                {/* Helmet Head */}
                <circle cx="85" cy="28" r="14" fill="#ffb703" />
                <path d="M 88 28 L 97 28 C 97 34, 91 36, 85 36 Z" fill="#1e293b" />
                {/* Body / Arms */}
                <path d="M 68 55 L 85 40 L 105 52" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
                {/* Legs */}
                <path d="M 68 58 L 85 75 L 88 88" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none" />
              </g>
            </svg>
          </div>

          {/* 3D Bold 'Localo' Wordmark with orange 'o' */}
          <div style={{
            fontSize: '48px',
            fontWeight: '900',
            letterSpacing: '-1px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}>
            <span style={{ color: '#ffffff' }}>L</span>
            <span style={{
              color: '#ff7700',
              background: 'radial-gradient(circle, #ffae00 0%, #ff5500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 10px rgba(255,100,0,0.5))'
            }}>o</span>
            <span style={{ color: '#ffffff' }}>calo</span>
          </div>

          {/* Underline Subtitle Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '10px'
          }}>
            <div style={{ width: '22px', height: '3px', background: '#ff7700', borderRadius: '2px' }}></div>
            <div style={{
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '1.8px',
              textTransform: 'uppercase',
              color: '#f8fafc'
            }}>
              Your Local Delivery App
            </div>
            <div style={{ width: '22px', height: '3px', background: '#ff7700', borderRadius: '2px' }}></div>
          </div>
        </div>

        {/* Bottom Loading Status Bar */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '120px',
            height: '3px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#ff7700',
              animation: 'loading 2s infinite'
            }}></div>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px' }}>
            CONNECTING TO SURI MARKETPLACE...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1e293b', position: 'relative' }}>
      
      {/* GLOBAL ROLE SWITCHER */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
          ROLE: <span style={{ color: '#ff6e00' }}>{role.toUpperCase()}</span>
        </div>
        <select 
          value={role} 
          onChange={(e) => {
            stopLoopingAlarm();
            setRole(e.target.value as any);
          }}
          style={{ background: '#1e293b', color: '#ff6e00', border: '1px solid #334155', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: 'bold', outline: 'none' }}
        >
          <option value="customer">Customer App</option>
          <option value="merchant">Merchant Panel {merchantUnresolved.length > 0 ? `🚨 (${merchantUnresolved.length})` : ''}</option>
          <option value="rider">Rider App {riderUnresolved.length > 0 ? `🔔 (${riderUnresolved.length})` : ''}</option>
          <option value="admin">Super Admin Panel</option>
        </select>
      </div>

      {/* CUSTOMER APP */}
      {role === 'customer' && (
        <div style={{ paddingBottom: '75px' }}>
          <div style={{ background: '#0a0d14', color: '#fff', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: '#ff7200', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff', fontSize: '18px' }}>
                L
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px' }}>Localo</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>📍 Main Road, Near Circuit House, Suri</div>
              </div>
            </div>

            {isCustomerLoggedIn ? (
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                ✓ {customerPhone}
              </span>
            ) : (
              <button 
                onClick={() => setCustomerOtpStep(false)}
                style={{ background: '#ff7200', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '14px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Login
              </button>
            )}
          </div>

          {!isCustomerLoggedIn && (
            <div style={{ background: '#fff', margin: '14px 16px', padding: '16px', borderRadius: '16px', border: '1.5px solid #ff7200', boxShadow: '0 4px 16px rgba(255,114,0,0.1)' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>
                {!customerOtpStep ? '📱 Login with Mobile Number' : '🔑 Enter 4-digit OTP'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
                {!customerOtpStep ? 'Enter your 10-digit number to receive an instant OTP.' : `OTP sent to +91 ${customerPhone}`}
              </div>

              {!customerOtpStep ? (
                <form onSubmit={handleSendCustomerOtp}>
                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit Mobile Number" 
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', fontSize: '13px', marginBottom: '10px' }}
                  />
                  <button type="submit" style={{ width: '100%', background: '#ff7200', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                    SEND OTP 🚀
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCustomerOtp}>
                  <input 
                    type="text" 
                    placeholder="Enter 4-digit OTP" 
                    maxLength={4}
                    value={customerOtp}
                    onChange={(e) => setCustomerOtp(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" style={{ flex: 1, background: '#059669', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                      VERIFY & LOGIN ✓
                    </button>
                    <button type="button" onClick={() => setCustomerOtpStep(false)} style={{ background: '#f1f5f9', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                      Edit
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div style={{ background: '#fff', padding: '12px 16px 8px 16px' }}>
            <input 
              type="text" 
              placeholder="Search for biryani, groceries, chicken, veggies..." 
              value={customerSearch} 
              onChange={(e) => setCustomerSearch(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '12px', boxSizing: 'border-box', fontSize: '12px' }} 
            />
          </div>

          {customerTab === 'home' && (
            <div>
              {/* Category Chips Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', padding: '10px 14px', background: '#fff', borderBottom: '1px solid #f2f2f2' }}>
                {customerChips.map(cat => {
                  const isActive = customerCategory === cat.id;
                  return (
                    <div 
                      key={cat.id} 
                      onClick={() => setCustomerCategory(cat.id)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '10px 4px', borderRadius: '16px', cursor: 'pointer',
                        background: isActive ? '#ff7200' : '#f4f5f7',
                        color: isActive ? '#fff' : '#4b5563',
                        transition: '0.2s all'
                      }}
                    >
                      <span style={{ fontSize: '20px', marginBottom: '4px' }}>{cat.icon}</span>
                      <span style={{ fontSize: '10px', fontWeight: '600', textAlign: 'center' }}>{cat.label}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '14px 16px 6px 16px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#374151', textAlign: 'center', fontWeight: 'bold' }}>Popular Near You (Suri)</h3>
              </div>

              {/* Product Listing */}
              <div style={{ padding: '8px 16px' }}>
                {filteredCustomerProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                    No products live right now. Add items from Super Admin Panel!
                  </div>
                ) : (
                  filteredCustomerProducts.map(product => {
                    const storeObj = stores.find(s => s.id === product.storeId);
                    const isStoreOpen = storeObj ? storeObj.isOpen : true;
                    const vIdx = getProductVariantIdx(product.id);
                    const activePrice = product.variants ? product.variants[vIdx].price : product.price;
                    const currentQty = getCartQuantity(product.id);

                    return (
                      <div 
                        key={product.id} 
                        style={{
                          background: '#fff', borderRadius: '18px', padding: '14px', marginBottom: '14px',
                          display: 'flex', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #efefef',
                          opacity: !isStoreOpen ? 0.65 : 1
                        }}
                      >
                        <img src={product.image} alt={product.name} style={{ width: '92px', height: '92px', borderRadius: '14px', objectFit: 'cover' }} />

                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>{product.name}</div>
                          
                          <div style={{ fontSize: '11px', color: '#6b7280', margin: '3px 0' }}>
                            <span style={{ color: '#eab308' }}>★ {product.rating}</span> • {product.storeName}
                          </div>

                          {!isStoreOpen && (
                            <div style={{ display: 'inline-block', background: '#fee2e2', color: '#dc2626', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', marginBottom: '4px' }}>
                              🔴 Store Currently Closed
                            </div>
                          )}

                          {product.variants && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '6px 0 8px 0' }}>
                              {product.variants.map((v, i) => (
                                <button
                                  key={v.weight}
                                  onClick={() => handleSelectProductVariant(product.id, i)}
                                  style={{
                                    padding: '2px 8px', fontSize: '10px', borderRadius: '6px',
                                    border: vIdx === i ? '1.5px solid #ff7200' : '1px solid #d1d5db',
                                    background: vIdx === i ? '#fff7ed' : '#fff',
                                    color: vIdx === i ? '#ea580c' : '#4b5563',
                                    cursor: 'pointer', fontWeight: vIdx === i ? 'bold' : 'normal'
                                  }}
                                >
                                  {v.weight}
                                </button>
                              ))}
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827' }}>₹{activePrice}</span>
                            
                            {!isStoreOpen ? (
                              <button 
                                disabled
                                style={{
                                  background: '#e2e8f0', color: '#94a3b8', border: 'none',
                                  borderRadius: '8px', padding: '5px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'not-allowed'
                                }}
                              >
                                CLOSED
                              </button>
                            ) : currentQty === 0 ? (
                              <button 
                                onClick={() => handleModifyCart(product, 1)}
                                style={{
                                  background: '#fff', color: '#ff7200', border: '1.5px solid #ff7200',
                                  borderRadius: '8px', padding: '5px 18px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
                                  boxShadow: '0 1px 3px rgba(255,114,0,0.1)'
                                }}
                              >
                                ADD
                              </button>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid #059669', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(5,150,105,0.15)' }}>
                                <button onClick={() => handleModifyCart(product, -1)} style={{ background: 'transparent', border: 'none', color: '#059669', padding: '4px 10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>−</button>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', minWidth: '16px', textAlign: 'center' }}>{currentQty}</span>
                                <button onClick={() => handleModifyCart(product, 1)} style={{ background: 'transparent', border: 'none', color: '#059669', padding: '4px 10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>+</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {customerTab === 'cart' && (
            <div style={{ padding: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>My Cart ({customerCart.length})</h4>
              {customerCart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>Your cart is empty.</div>
              ) : (
                <div>
                  {customerCart.map((item, idx) => (
                    <div key={idx} style={{ background: '#fff', padding: '12px', borderRadius: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{item.product.name}</div>
                        {item.selectedVariant && <div style={{ fontSize: '11px', color: '#6b7280' }}>Weight: {item.selectedVariant.weight}</div>}
                        <div style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>
                          ₹{(item.selectedVariant ? item.selectedVariant.price : item.product.price) * item.quantity}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => handleModifyCart(item.product, -1)} style={{ padding: '4px 10px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', fontWeight: 'bold' }}>-</button>
                        <b>{item.quantity}</b>
                        <button onClick={() => handleModifyCart(item.product, 1)} style={{ padding: '4px 10px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', fontWeight: 'bold' }}>+</button>
                      </div>
                    </div>
                  ))}

                  {/* FIRST30 Coupon */}
                  <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', margin: '14px 0', border: '1px dashed #059669' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>🎟️ First Order Coupon (30% OFF)</div>
                    {appliedCoupon ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5', padding: '8px 12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>'FIRST30' Applied! Saved ₹{getCartDiscount()}</span>
                        <button onClick={() => setAppliedCoupon(null)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            type="text" 
                            placeholder="Enter Code: FIRST30"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '12px', textTransform: 'uppercase' }}
                          />
                          <button onClick={handleApplyCoupon} style={{ background: '#059669', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                            Apply
                          </button>
                        </div>
                        {couponError && <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px' }}>{couponError}</div>}
                      </div>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', marginBottom: '14px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>Select Payment Method</div>
                    <div 
                      onClick={() => setPaymentMethod('ONLINE')}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer',
                        border: paymentMethod === 'ONLINE' ? '1.5px solid #059669' : '1px solid #e5e7eb',
                        background: paymentMethod === 'ONLINE' ? '#f0fdf4' : '#fff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                        <span>⚡</span> Online UPI (GPay, PhonePe, Paytm)
                      </div>
                      <input type="radio" checked={paymentMethod === 'ONLINE'} readOnly style={{ accentColor: '#059669' }} />
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('COD')}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                        border: paymentMethod === 'COD' ? '1.5px solid #ff7200' : '1px solid #e5e7eb',
                        background: paymentMethod === 'COD' ? '#fff7ed' : '#fff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                        <span>💵</span> Cash on Delivery (COD)
                      </div>
                      <input type="radio" checked={paymentMethod === 'COD'} readOnly style={{ accentColor: '#ff7200' }} />
                    </div>
                  </div>

                  {/* Bill Details */}
                  <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span>Item Total</span>
                      <span>₹{getCartSubtotal()}</span>
                    </div>
                    {appliedCoupon && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#059669', marginBottom: '6px', fontWeight: 'bold' }}>
                        <span>Discount (FIRST30)</span>
                        <span>- ₹{getCartDiscount()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#059669', marginBottom: '6px' }}>
                      <span>Delivery Fee</span>
                      <span>FREE</span>
                    </div>
                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px' }}>
                      <span>To Pay</span>
                      <span>₹{getCartFinalTotal()}</span>
                    </div>

                    <button 
                      onClick={handlePlaceCustomerOrder}
                      style={{ width: '100%', background: paymentMethod === 'ONLINE' ? '#059669' : '#ea580c', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', marginTop: '12px', cursor: 'pointer' }}
                    >
                      {paymentMethod === 'ONLINE' ? `PAY ONLINE (UPI) ₹${getCartFinalTotal()}` : `CONFIRM COD ORDER ₹${getCartFinalTotal()}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {customerTab === 'orders' && (
            <div style={{ padding: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>Order Tracking</h4>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>No active orders found.</div>
              ) : (
                orders.map(o => (
                  <div key={o.id} style={{ background: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                      <span>{o.id}</span>
                      <span style={{ color: '#ff7200' }}>₹{o.total}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>Store: <b>{o.storeName}</b></div>
                    <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '8px', margin: '10px 0', fontSize: '12px', fontWeight: 'bold', color: o.status === 'rejected' ? '#dc2626' : '#059669' }}>
                      {o.status === 'placed' && '⏳ Order Sent! Ringing store partner...'}
                      {o.status === 'preparing' && '🍳 Store accepted! Preparing order items...'}
                      {o.status === 'ready_for_pickup' && '📦 Order packed & ready! Fairly dispatched to delivery rider...'}
                      {o.status === 'picked_up' && `🚀 ${o.riderName || 'Rider'} picked up order! On the way...`}
                      {o.status === 'delivered' && '✅ Order delivered successfully!'}
                      {o.status === 'rejected' && `❌ Order cancelled by ${o.rejectedBy === 'merchant' ? 'store' : 'rider'}.`}
                    </div>

                    {o.status !== 'delivered' && o.status !== 'rejected' && (
                      <div style={{ background: '#fff7ed', border: '1px dashed #ff7200', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>Share Delivery OTP with Rider:</span>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff7200', letterSpacing: '4px' }}>{o.otp}</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {getTotalCartItemsCount() > 0 && customerTab === 'home' && (
            <div style={{ position: 'fixed', bottom: '60px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '408px', zIndex: 99 }}>
              <div 
                onClick={() => setCustomerTab('cart')}
                style={{ background: '#059669', color: '#fff', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 6px 20px rgba(5,150,105,0.3)', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{getTotalCartItemsCount()} Items added</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>₹{getCartSubtotal()}</div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>View Cart ›</div>
              </div>
            </div>
          )}

          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 100 }}>
            <button onClick={() => setCustomerTab('home')} style={{ background: 'none', border: 'none', color: customerTab === 'home' ? '#ff7200' : '#9ca3af', fontWeight: 'bold', cursor: 'pointer' }}>Home</button>
            <button onClick={() => setCustomerTab('cart')} style={{ background: 'none', border: 'none', color: customerTab === 'cart' ? '#ff7200' : '#9ca3af', fontWeight: 'bold', cursor: 'pointer' }}>Cart ({getTotalCartItemsCount()})</button>
            <button onClick={() => setCustomerTab('orders')} style={{ background: 'none', border: 'none', color: customerTab === 'orders' ? '#ff7200' : '#9ca3af', fontWeight: 'bold', cursor: 'pointer' }}>Orders ({orders.length})</button>
          </div>
        </div>
      )}

      {/* MERCHANT PANEL */}
      {role === 'merchant' && (
        <div style={{ padding: '16px' }}>
          {!loggedInMerchantStore ? (
            <div style={{ background: '#fff', padding: '24px 18px', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <div style={{ fontSize: '36px' }}>🏪</div>
                <h3 style={{ margin: '6px 0 2px 0', fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>Merchant Partner Login</h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Enter your Phone Number & Password set by Admin</div>
              </div>
              {merchantLoginError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px' }}>{merchantLoginError}</div>}
              <form onSubmit={handleMerchantLogin}>
                <input type="text" placeholder="Store Phone Number" value={merchantLoginPhone} onChange={(e) => setMerchantLoginPhone(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                <input type="password" placeholder="Password" value={merchantLoginPassword} onChange={(e) => setMerchantLoginPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', background: '#ff7200', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>LOGIN TO STORE 🚀</button>
              </form>
            </div>
          ) : (
            <div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '14px', marginBottom: '14px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{loggedInMerchantStore.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{loggedInMerchantStore.category}</div>
                </div>
                <button onClick={handleMerchantLogout} style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Logout 🚪</button>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '12px 14px', marginBottom: '14px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Store Status:</span>
                <button onClick={() => handleToggleStoreOpen(loggedInMerchantStore.id)} style={{ background: loggedInMerchantStore.isOpen ? '#059669' : '#dc2626', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}>
                  {loggedInMerchantStore.isOpen ? '🟢 STORE OPEN' : '🔴 STORE CLOSED'}
                </button>
              </div>

              <h4 style={{ margin: '14px 0 10px 0', fontSize: '14px' }}>Store Incoming Orders</h4>
              {orders.filter(o => o.storeId === loggedInMerchantStore.id && o.status !== 'rejected').map(o => (
                <div key={o.id} style={{ background: '#fff', padding: '14px', borderRadius: '12px', marginBottom: '12px', border: o.status === 'placed' ? '2px solid #ef4444' : '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{o.id}</span>
                    <span style={{ color: '#059669' }}>₹{o.total}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', margin: '4px 0' }}>Status: <b>{o.status.toUpperCase()}</b></div>
                  {o.riderName && <div style={{ fontSize: '11px', color: '#0284c7' }}>Dispatched Rider: <b>{o.riderName}</b></div>}
                  {o.status === 'placed' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button onClick={() => handleMerchantAccept(o.id)} style={{ flex: 1, background: '#059669', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>ACCEPT 🍳</button>
                      <button onClick={() => handleMerchantReject(o.id)} style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontWeight: 'bold' }}>REJECT</button>
                    </div>
                  )}
                  {o.status === 'preparing' && (
                    <button onClick={() => handleMerchantMarkReady(o.id)} style={{ width: '100%', background: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>
                      MARK READY FOR PICKUP & DISPATCH TO RIDER 📦
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RIDER APP */}
      {role === 'rider' && (
        <div style={{ padding: '16px' }}>
          {!loggedInRider ? (
            <div style={{ background: '#fff', padding: '24px 18px', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <div style={{ fontSize: '36px' }}>🛵</div>
                <h3 style={{ margin: '6px 0 2px 0', fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>Delivery Partner Login</h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Enter your Phone Number & Password assigned by Admin</div>
              </div>

              {riderLoginError && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', marginBottom: '14px' }}>
                  {riderLoginError}
                </div>
              )}

              <form onSubmit={handleRiderLogin}>
                <input 
                  type="text" 
                  placeholder="e.g. 9832100001"
                  value={riderLoginPhone}
                  onChange={(e) => setRiderLoginPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={riderLoginPassword}
                  onChange={(e) => setRiderLoginPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                />
                <button 
                  type="submit"
                  style={{ width: '100%', background: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  LOGIN AS RIDER 🛵
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div style={{ background: '#fff', borderRadius: '14px', padding: '14px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{loggedInRider.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {loggedInRider.id} • 🏍️️ {loggedInRider.vehicleNumber}</div>
                    <div style={{ fontSize: '10px', color: '#059669', fontWeight: 'bold', marginTop: '2px' }}>
                      Assigned Deliveries: {loggedInRider.assignedOrdersCount} (Equal Queue)
                    </div>
                  </div>
                  <button onClick={handleRiderLogout} style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Logout</button>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Duty Status:</div>
                  <button
                    onClick={handleToggleRiderOnline}
                    style={{
                      background: loggedInRider.isOnline ? '#059669' : '#64748b',
                      color: '#fff',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {loggedInRider.isOnline ? '🟢 DUTY: ONLINE' : '⚪ DUTY: OFFLINE'}
                  </button>
                </div>
              </div>

              {orders
                .filter(o => o.assignedRiderId === loggedInRider.id && ['ready_for_pickup', 'picked_up'].includes(o.status))
                .map(task => (
                  <div key={task.id} style={{ background: '#fff', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: task.status === 'ready_for_pickup' ? '2.5px solid #ff7200' : '2.5px solid #059669' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>{task.id}</span>
                      <span style={{ color: '#059669' }}>₹{task.total}</span>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', margin: '12px 0', fontSize: '12px' }}>
                      <div>📍 <b>Store:</b> {task.storeName}</div>
                      <div style={{ marginTop: '6px' }}>🏠 <b>Drop:</b> {task.customerName} ({task.customerAddress})</div>
                      
                      <button
                        onClick={() => openGoogleMapsLocation(task.customerAddress)}
                        style={{ width: '100%', background: '#0284c7', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', marginTop: '10px', cursor: 'pointer' }}
                      >
                        🗺️ Open Google Maps Navigation to Customer
                      </button>
                    </div>

                    {task.status === 'ready_for_pickup' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleRiderPickupComplete(task.id)} style={{ flex: 1, background: '#059669', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>
                          COLLECTED FROM STORE 📦
                        </button>
                        <button onClick={() => handleRiderReject(task.id)} style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '12px 14px', borderRadius: '10px', fontWeight: 'bold' }}>
                          REJECT
                        </button>
                      </div>
                    )}

                    {task.status === 'picked_up' && (
                      <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '12px', color: '#166534', fontWeight: 'bold', marginBottom: '6px' }}>Enter Delivery OTP:</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            type="text" 
                            placeholder="OTP" 
                            maxLength={4}
                            value={riderInputOtps[task.id] || ''}
                            onChange={(e) => setRiderInputOtps({ ...riderInputOtps, [task.id]: e.target.value })}
                            style={{ flex: 1, padding: '10px', border: '1px solid #86efac', borderRadius: '8px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}
                          />
                          <button onClick={() => handleRiderDeliverWithOtp(task)} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold' }}>
                            DELIVER ✅
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* SUPER ADMIN PANEL */}
      {role === 'admin' && (
        <div style={{ padding: '16px' }}>
          <div style={{ background: '#0f172a', color: '#fff', padding: '14px', borderRadius: '12px', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: '800' }}>MASTER CONTROL</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>🛡️ Super Admin Control Panel</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <button onClick={() => setAdminTab('stores')} style={{ padding: '10px 4px', border: 'none', background: adminTab === 'stores' ? '#ff7200' : 'none', color: adminTab === 'stores' ? '#fff' : '#64748b', fontWeight: 'bold' }}>Add Store</button>
            <button onClick={() => setAdminTab('items')} style={{ padding: '10px 4px', border: 'none', background: adminTab === 'items' ? '#ff7200' : 'none', color: adminTab === 'items' ? '#fff' : '#64748b', fontWeight: 'bold' }}>Add Items</button>
            <button onClick={() => setAdminTab('riders')} style={{ padding: '10px 4px', border: 'none', background: adminTab === 'riders' ? '#ff7200' : 'none', color: adminTab === 'riders' ? '#fff' : '#64748b', fontWeight: 'bold' }}>Hire Rider</button>
          </div>

          {adminTab === 'stores' && (
            <div style={{ background: '#fff', padding: '14px', borderRadius: '12px' }}>
              <form onSubmit={handleAdminCreateStore}>
                <input type="text" placeholder="Shop Name" value={adminStoreName} onChange={(e) => setAdminStoreName(e.target.value)} style={{ width: '100%', padding: '9px', marginBottom: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <select value={adminStoreCategory} onChange={(e) => setAdminStoreCategory(e.target.value as any)} style={{ width: '100%', padding: '9px', marginBottom: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Chicken Stall">Chicken Stall</option>
                  <option value="Mutton Stall">Mutton Stall</option>
                  <option value="Fish Stall">Fish Stall</option>
                  <option value="Vegetables Stall">Vegetables Stall</option>
                  <option value="Grocery Shop">Grocery Shop</option>
                </select>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" placeholder="Merchant Mobile" value={adminStorePhone} onChange={(e) => setAdminStorePhone(e.target.value)} style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  <input type="text" placeholder="Password" value={adminStorePassword} onChange={(e) => setAdminStorePassword(e.target.value)} style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>
                <input type="text" placeholder="Address in Suri" value={adminStoreAddress} onChange={(e) => setAdminStoreAddress(e.target.value)} style={{ width: '100%', padding: '9px', marginBottom: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <button type="submit" style={{ width: '100%', background: '#ff7200', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: 'bold' }}>CREATE STORE & LOGIN 🚀</button>
              </form>

              <div style={{ marginTop: '16px' }}>
                {stores.map(st => (
                  <div key={st.id} style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{st.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Phone: {st.phone} | Pass: {st.password}</div>
                    </div>
                    <button onClick={() => handleAdminDeleteStore(st.id)} style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>DELETE 🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'items' && (
            <div style={{ background: '#fff', padding: '14px', borderRadius: '12px' }}>
              <form onSubmit={handleAdminAddProduct}>
                <select value={adminTargetStoreId} onChange={(e) => setAdminTargetStoreId(e.target.value)} style={{ width: '100%', padding: '9px', marginBottom: '8px', border: '1.5px solid #ff7200', borderRadius: '6px', fontWeight: 'bold' }}>
                  {stores.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.category})</option>
                  ))}
                </select>
                <input type="text" placeholder="Item Name (e.g. Chicken Curry Cut)" value={adminProductName} onChange={(e) => setAdminProductName(e.target.value)} style={{ width: '100%', padding: '9px', marginBottom: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <input type="number" placeholder="Price (₹)" value={adminProductPrice} onChange={(e) => setAdminProductPrice(e.target.value)} style={{ width: '100%', padding: '9px', marginBottom: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <button type="submit" style={{ width: '100%', background: '#059669', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: 'bold' }}>ADD PRODUCT (AUTO HD PHOTO) 📦</button>
              </form>
            </div>
          )}

          {adminTab === 'riders' && (
            <div style={{ background: '#fff', padding: '14px', borderRadius: '12px' }}>
              <form onSubmit={handleAdminHireRider}>
                <input type="text" placeholder="Rider Full Name" value={adminRiderName} onChange={(e) => setAdminRiderName(e.target.value)} style={{ width: '100%', padding: '9px', marginBottom: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" placeholder="Rider Mobile" value={adminRiderPhone} onChange={(e) => setAdminRiderPhone(e.target.value)} style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  <input type="text" placeholder="Password" value={adminRiderPassword} onChange={(e) => setAdminRiderPassword(e.target.value)} style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>
                <input type="text" placeholder="Bike / Vehicle Number" value={adminRiderVehicle} onChange={(e) => setAdminRiderVehicle(e.target.value)} style={{ width: '100%', padding: '9px', marginBottom: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <input type="text" placeholder="Area in Suri" value={adminRiderArea} onChange={(e) => setAdminRiderArea(e.target.value)} style={{ width: '100%', padding: '9px', marginBottom: '12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <button type="submit" style={{ width: '100%', background: '#0284c7', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: 'bold' }}>HIRE RIDER 🛵</button>
              </form>

              <div style={{ marginTop: '16px' }}>
                {riders.map(r => (
                  <div key={r.id} style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{r.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Phone: {r.phone} | Pass: {r.password}</div>
                    </div>
                    <button onClick={() => handleAdminDeleteRider(r.id)} style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>DELETE 🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
