import { Product } from '../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AuraPulse Pro Noise-Cancelling Headphones',
    slug: 'aurapulse-pro-headphones',
    brand: 'AuraSound',
    category: 'Audio',
    price: 299.99,
    originalPrice: 379.99,
    discountPercent: 21,
    rating: 4.9,
    reviewCount: 428,
    inStock: true,
    stockQuantity: 18,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Experience pure sonic brilliance with hybrid active noise cancellation, custom 45mm titanium drivers, and up to 60 hours of wireless playback.',
    features: [
      'Adaptive Active Noise Cancellation with Transparency Mode',
      'Custom 45mm dynamic titanium biocellulose drivers',
      'Ultra-plush memory foam magnetic ear cushions',
      'Up to 60 hours battery life with quick-charge (15 min = 6 hrs)',
      'Multipoint Bluetooth 5.4 connection with LDAC lossless audio'
    ],
    specs: {
      'Driver Size': '45 mm',
      'Frequency Response': '10 Hz – 40,000 Hz',
      'Weight': '265 grams',
      'Connectivity': 'Bluetooth 5.4 & 3.5mm Aux / USB-C Audio',
      'Battery Life': '60 Hours (ANC Off) / 45 Hours (ANC On)'
    },
    colors: [
      { name: 'Matte Obsidian', hex: '#1e1e24' },
      { name: 'Silver Lunar', hex: '#d1d5db' },
      { name: 'Deep Midnight Navy', hex: '#1e293b' }
    ],
    tags: ['audio', 'wireless', 'noise-cancelling', 'premium'],
    isFeatured: true,
    isTrending: true,
    badge: 'HOT'
  },
  {
    id: 'prod-2',
    name: 'Vanguard Ultra Smartwatch Series X',
    slug: 'vanguard-ultra-smartwatch',
    brand: 'Vanguard',
    category: 'Wearables',
    price: 349.00,
    originalPrice: 429.00,
    discountPercent: 19,
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    stockQuantity: 24,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Precision-engineered titanium aerospace casing with sapphire crystal glass, advanced dual-frequency GPS, and 100m water resistance.',
    features: [
      '2.04" Always-On Super Retina AMOLED display with 3000 nits peak brightness',
      'Grade 5 Aerospace Titanium chassis with ceramic back',
      'BioTrack 4.0: ECG, SpO2, Sleep Stages, and Temperature sensing',
      'Dual-frequency L1/L5 GPS for high-accuracy outdoor trail mapping',
      'Up to 14 days typical battery endurance'
    ],
    specs: {
      'Case Material': 'Grade 5 Titanium',
      'Display': '2.04" AMOLED 480x520 px',
      'Water Resistance': '10 ATM (100 meters)',
      'Sensors': 'Optical Heart, ECG, SpO2, Barometer, Compass',
      'Weight': '52 grams'
    },
    colors: [
      { name: 'Titanium Raw', hex: '#9ca3af' },
      { name: 'Midnight Black', hex: '#111827' },
      { name: 'Alpine Orange', hex: '#ea580c' }
    ],
    tags: ['smartwatch', 'fitness', 'wearables', 'gps'],
    isFeatured: true,
    isTrending: false,
    badge: 'BESTSELLER'
  },
  {
    id: 'prod-3',
    name: 'Lumina Lumos Mirrorless Camera 4K',
    slug: 'lumina-lumos-mirrorless-camera',
    brand: 'Lumina Optics',
    category: 'Photography',
    price: 1199.00,
    originalPrice: 1399.00,
    discountPercent: 14,
    rating: 4.9,
    reviewCount: 185,
    inStock: true,
    stockQuantity: 9,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A creator powerhouse featuring a 33MP Full-Frame Exmor sensor, 4K 120p video recording, 5-axis IBIS, and instant real-time AI eye tracking.',
    features: [
      '33MP BSI Full-Frame CMOS Sensor',
      '4K 60p 10-bit 4:2:2 internal recording with S-Cinetone',
      '759-point phase-detection autofocus with human and animal AI eye-AF',
      '7.0 stops in-body 5-axis optical image stabilization',
      'Dual CFexpress Type A / SD UHS-II card slots'
    ],
    specs: {
      'Sensor': '33 MP Full-Frame BSI CMOS',
      'ISO Range': '100 – 51,200 (Expandable to 204,800)',
      'Video': '4K at 60fps / 1080p at 120fps',
      'Screen': '3.0" Vari-angle Touchscreen LCD',
      'Lens Mount': 'Universal E-Mount'
    },
    colors: [
      { name: 'Carbon Matte', hex: '#18181b' },
      { name: 'Vintage Silver', hex: '#cbd5e1' }
    ],
    tags: ['camera', 'photography', '4k', 'video', 'creator'],
    isFeatured: true,
    isTrending: true,
    badge: 'NEW'
  },
  {
    id: 'prod-4',
    name: 'CyberKey Studio Mechanical Keyboard',
    slug: 'cyberkey-studio-mechanical-keyboard',
    brand: 'CyberKey',
    category: 'Computer & Office',
    price: 169.50,
    originalPrice: 199.00,
    discountPercent: 15,
    rating: 4.7,
    reviewCount: 520,
    inStock: true,
    stockQuantity: 32,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Custom gasket-mounted 75% wireless keyboard with hot-swappable pre-lubed tactile switches, CNC anodized aluminum frame, and south-facing RGB.',
    features: [
      'CNC milled aluminum body with acoustic sound-dampening foam',
      'Pre-lubricated Gateron Pro Oil King switches for smooth keystrokes',
      'Tri-mode connectivity: Bluetooth 5.2, 2.4GHz dongle, and USB-C',
      'Programmable multifunctional rotary volume dial',
      'Compatible with Windows, Mac, iOS, and Android'
    ],
    specs: {
      'Layout': '75% (82 keys)',
      'Switches': 'Hot-swappable 5-pin mechanical',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'Battery': '4,000 mAh Rechargeable (200 hours)',
      'Weight': '1.15 kg'
    },
    colors: [
      { name: 'Retro Industrial', hex: '#374151' },
      { name: 'Frost White', hex: '#f3f4f6' },
      { name: 'Cyber Neon Purple', hex: '#6366f1' }
    ],
    tags: ['keyboard', 'mechanical', 'gaming', 'office', 'wireless'],
    isFeatured: false,
    isTrending: true,
    badge: 'SALE'
  },
  {
    id: 'prod-5',
    name: 'ErgoSphere Executive Ergonomic Mesh Chair',
    slug: 'ergosphere-executive-ergonomic-chair',
    brand: 'ErgoSphere',
    category: 'Computer & Office',
    price: 489.00,
    originalPrice: 599.00,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 240,
    inStock: true,
    stockQuantity: 12,
    images: [
      'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Engineered for all-day comfort, featuring responsive self-adjusting lumbar support, breathable 3D woven mesh, and 4D omni-directional armrests.',
    features: [
      'Dynamic weight-activated synchro-tilt mechanism (90° – 135°)',
      'Adaptive lumbar cushion tracks spine motion in real-time',
      'Breathable temperature-regulating Korean elastomeric mesh',
      'Class 4 heavy-duty pneumatic gas lift rated up to 350 lbs',
      'Smooth-rolling dual PU casters safe for hardwood floors'
    ],
    specs: {
      'Max Load': '350 lbs (158 kg)',
      'Seat Height': '18" to 22.5"',
      'Tilt Range': '90° to 135°',
      'Frame': 'Cast Aluminum Base',
      'Warranty': '10 Years Structural'
    },
    colors: [
      { name: 'Shadow Black', hex: '#1f2937' },
      { name: 'Platinum Grey', hex: '#9ca3af' }
    ],
    tags: ['chair', 'furniture', 'ergonomic', 'office'],
    isFeatured: true,
    isTrending: false
  },
  {
    id: 'prod-6',
    name: 'Apex Horizon Curved Gaming Monitor 34"',
    slug: 'apex-horizon-curved-gaming-monitor',
    brand: 'ApexVision',
    category: 'Computer & Office',
    price: 649.99,
    originalPrice: 799.99,
    discountPercent: 19,
    rating: 4.9,
    reviewCount: 390,
    inStock: true,
    stockQuantity: 15,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse your senses with a 1000R curved QD-OLED display, 175Hz refresh rate, 0.03ms response time, and infinite contrast ratio.',
    features: [
      '34-inch UWQHD (3440 x 1440) 21:9 UltraWide OLED panel',
      '175Hz ultra-fast refresh rate and 0.03ms GtG pixel response',
      'VESA DisplayHDR True Black 400 with 99.3% DCI-P3 color gamut',
      'USB-C 90W Power Delivery Hub with integrated KVM switch',
      'Ambient reactive RGB bias lighting back panel'
    ],
    specs: {
      'Resolution': '3440 x 1440 (UWQHD)',
      'Panel Type': 'QD-OLED',
      'Refresh Rate': '175 Hz',
      'Curve': '1000R',
      'Ports': '2x HDMI 2.1, 1x DP 1.4, 1x USB-C 90W, 3x USB 3.2'
    },
    tags: ['monitor', 'gaming', 'oled', 'ultrawide'],
    isFeatured: false,
    isTrending: true,
    badge: 'HOT'
  },
  {
    id: 'prod-7',
    name: 'AeroGlide Minimalist Sneakers',
    slug: 'aeroglide-minimalist-sneakers',
    brand: 'AeroCraft',
    category: 'Fashion',
    price: 129.00,
    originalPrice: 160.00,
    discountPercent: 20,
    rating: 4.6,
    reviewCount: 215,
    inStock: true,
    stockQuantity: 40,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultralight performance lifestyle footwear crafted from breathable eucalyptus fiber knit and responsive bio-based foam cushioning.',
    features: [
      'Breathable FSC-certified eucalyptus tree fiber knit upper',
      'Supercritical nitrogen-infused EVA midsole for bounce',
      'Anti-microbial and moisture-wicking merino wool insole',
      'Friction-free ergonomic heel counter',
      'Machine-washable on gentle cycle'
    ],
    specs: {
      'Weight': '210 grams per shoe',
      'Material': 'Tree Fiber & Bio-foam',
      'Drop': '7 mm heel-to-toe drop',
      'Origin': 'Sustainably Crafted in Portugal'
    },
    colors: [
      { name: 'Crimson Red', hex: '#dc2626' },
      { name: 'Arctic White', hex: '#f8fafc' },
      { name: 'Charcoal Black', hex: '#18181b' }
    ],
    tags: ['fashion', 'shoes', 'sneakers', 'sustainable'],
    isFeatured: true,
    isTrending: false,
    badge: 'SALE'
  },
  {
    id: 'prod-8',
    name: 'Nordic Artisan Pour-Over Coffee Station',
    slug: 'nordic-artisan-pour-over-coffee-station',
    brand: 'Nordic Living',
    category: 'Home & Kitchen',
    price: 89.99,
    originalPrice: 110.00,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 167,
    inStock: true,
    stockQuantity: 28,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hand-blown thermal shock borosilicate glass dripper mounted on a solid matte walnut hardwood base with precision brass accents.',
    features: [
      'Double-walled insulated borosilicate glass carafe (600ml)',
      'Laser-cut micro-mesh reusable stainless steel filter',
      'Sustainable solid American walnut base with waterproof oil finish',
      'Built-in drip catcher tray with silicone liner'
    ],
    specs: {
      'Capacity': '600 ml (2-4 cups)',
      'Materials': 'Borosilicate Glass, Walnut Wood, Brass, SS304',
      'Dimensions': '24 x 16 x 14 cm',
      'Dishwasher Safe': 'Glass & Filter only'
    },
    tags: ['coffee', 'kitchen', 'home', 'artisan'],
    isFeatured: false,
    isTrending: true
  },
  {
    id: 'prod-9',
    name: 'Solace Horizon Leather Weekender Duffel',
    slug: 'solace-horizon-leather-weekender-duffel',
    brand: 'Solace Goods',
    category: 'Accessories',
    price: 249.00,
    originalPrice: 299.00,
    discountPercent: 17,
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    stockQuantity: 16,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handcrafted from full-grain vegetable-tanned Italian leather with heavy-duty YKK Excella zippers and a padded 16-inch laptop compartment.',
    features: [
      'Full-grain Italian Tuscan leather that patinas beautifully with age',
      'Dedicated ventilated side compartment for footwear or laundry',
      'Shock-absorbing padded sleeve fits up to 16" MacBook Pro',
      'Water-resistant waxed herringbone cotton canvas lining',
      'Detachable padded leather shoulder strap'
    ],
    specs: {
      'Dimensions': '52 x 28 x 25 cm',
      'Volume': '42 Liters (Carry-on compliant)',
      'Weight': '1.8 kg',
      'Hardware': 'Antique Solid Brass'
    },
    colors: [
      { name: 'Cognac Saddle Brown', hex: '#78350f' },
      { name: 'Espresso Dark Brown', hex: '#3b2f2f' },
      { name: 'Onyx Black', hex: '#1c1917' }
    ],
    tags: ['travel', 'bag', 'leather', 'accessories', 'luxury'],
    isFeatured: true,
    isTrending: false,
    badge: 'BESTSELLER'
  },
  {
    id: 'prod-10',
    name: 'EchoGlow Smart Ambient Sound & Light Lamp',
    slug: 'echoglow-smart-ambient-lamp',
    brand: 'Lumina Tech',
    category: 'Smart Home',
    price: 139.99,
    originalPrice: 179.99,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 289,
    inStock: true,
    stockQuantity: 30,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Elevate your sanctuary with 16 million colors, binaural soundscapes, circadian sunrise simulation, and seamless Apple Home & Google Cast support.',
    features: [
      'Circadian rhythm dawn & dusk natural gradual lighting',
      '360° omnidirectional high-fidelity neodymium speaker',
      'Built-in library of 40+ soothing nature soundscapes and white noise',
      'Matter and Thread certified smart home compatibility',
      'Wireless 15W Qi fast charging pad on top surface'
    ],
    specs: {
      'Light Output': '800 Lumens (Adjustable 2200K - 6500K)',
      'Audio Output': '20 Watts RMS',
      'Connectivity': 'Wi-Fi 6, Bluetooth 5.3, Thread',
      'Dimensions': '18 x 18 x 22 cm'
    },
    tags: ['smarthome', 'lighting', 'audio', 'wellness'],
    isFeatured: false,
    isTrending: true,
    badge: 'SALE'
  },
  {
    id: 'prod-11',
    name: 'Precision Barista Touch Espresso Machine',
    slug: 'precision-barista-touch-espresso-machine',
    brand: 'CaféTech',
    category: 'Home & Kitchen',
    price: 749.00,
    originalPrice: 899.00,
    discountPercent: 17,
    rating: 4.9,
    reviewCount: 380,
    inStock: true,
    stockQuantity: 11,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Commercial 58mm stainless steel portafilter, dual thermoblock heating system, PID digital temperature control, and automated microfoam texturing.',
    features: [
      'ThermoJet heating system reaches optimal extraction temp in 3 seconds',
      'Precision conical burr grinder with 30 customizable grind size steps',
      'Automatic microfoam steam wand with adjustable milk temperature',
      'Intuitive color touch screen with one-touch recipe presets',
      '15-bar Italian pressure pump with low-pressure pre-infusion'
    ],
    specs: {
      'Water Tank': '2.0 Liters',
      'Bean Hopper': '250 grams',
      'Pump': '15 Bar Italian Pressure',
      'Body': 'Brushed Stainless Steel',
      'Power': '1650 Watts'
    },
    tags: ['coffee', 'espresso', 'kitchen', 'appliances'],
    isFeatured: true,
    isTrending: true,
    badge: 'HOT'
  },
  {
    id: 'prod-12',
    name: 'SpectraView 4K HDR Drone Navigator',
    slug: 'spectraview-4k-hdr-drone-navigator',
    brand: 'SkyDrone',
    category: 'Photography',
    price: 849.00,
    originalPrice: 999.00,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 210,
    inStock: true,
    stockQuantity: 14,
    images: [
      'https://images.unsplash.com/photo-1507582020432-2a3bc4ff7ac8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Foldable ultralight drone with 4K/60fps HDR video, 3-axis mechanical gimbal, omnidirectional obstacle sensing, and 45-minute flight time.',
    features: [
      '1-inch 20MP CMOS sensor with f/2.8 aperture',
      'O3+ video transmission up to 15 km range with 1080p live feed',
      'APAS 5.0 advanced obstacle detection in all directions',
      'Smart Return-to-Home and MasterShots cinematic flight modes',
      'Level 7 wind resistance (up to 38 km/h)'
    ],
    specs: {
      'Weight': '249 grams (Sub-250g classification)',
      'Max Flight Time': '45 minutes',
      'Range': '15 km',
      'Video Resolution': '4K at 60fps / 5.4K at 30fps',
      'Internal Storage': '64 GB + microSD slot'
    },
    tags: ['drone', 'photography', 'video', 'gadgets'],
    isFeatured: false,
    isTrending: false,
    badge: 'NEW'
  }
];

export const MOCK_REVIEWS: Record<string, import('../models/product.model').Review[]> = {
  'prod-1': [
    {
      id: 'rev-1',
      userName: 'Marcus Sterling',
      rating: 5,
      date: '3 days ago',
      comment: 'The active noise cancellation is otherworldly. I used these on an 11-hour transatlantic flight and heard virtually zero engine hum. Soundstage is wide, lush, and bass is tight without being muddy.',
      verifiedPurchase: true,
      helpfulCount: 47
    },
    {
      id: 'rev-2',
      userName: 'Elena Rostova',
      rating: 5,
      date: '1 week ago',
      comment: 'Build quality is second to none. The aluminum hinges and memory foam pads make wearing these for 8 hours of work completely effortless. Highly recommended for audiophiles.',
      verifiedPurchase: true,
      helpfulCount: 23
    },
    {
      id: 'rev-3',
      userName: 'David Chen',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Superb sound and battery life! The app EQ gives incredible control. Only minor caveat is the carrying case is slightly bulky in a small backpack, but the headphones themselves are phenomenal.',
      verifiedPurchase: true,
      helpfulCount: 12
    }
  ]
};

export const PROMO_CODES: Record<string, number> = {
  'SAVE20': 20,
  'WELCOME10': 10,
  'LUMINA30': 30,
  'FREESHIP': 0 // special handled
};

// Testing override: Set all products price to 1.00 INR for live Razorpay testing
MOCK_PRODUCTS.forEach(p => {
  p.price = 1.00;
  p.originalPrice = 1.00;
  p.discountPercent = 0;
});

