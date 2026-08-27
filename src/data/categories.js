export const CATEGORIES = [
  {
    id: 'mobiles',
    name: 'Mobiles & Tablets',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    subcategories: ['Flagship Phones', '5G Mobiles', 'Budget Smartphones', 'iPads & Tablets', 'Mobile Accessories', 'Power Banks'],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        searchable: true,
        options: ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Realme', 'Nothing', 'Motorola']
      },
      {
        id: 'ram',
        name: 'RAM',
        type: 'checkbox',
        options: ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB']
      },
      {
        id: 'storage',
        name: 'Internal Storage',
        type: 'checkbox',
        options: ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB']
      },
      {
        id: 'network',
        name: 'Network Type',
        type: 'checkbox',
        options: ['5G', '4G VoLTE']
      },
      {
        id: 'battery',
        name: 'Battery Capacity',
        type: 'checkbox',
        options: ['4000 - 4999 mAh', '5000 - 5999 mAh', '6000 mAh & Above']
      },
      {
        id: 'screenSize',
        name: 'Screen Size',
        type: 'checkbox',
        options: ['Below 6.1 inch', '6.1 - 6.5 inch', '6.6 - 6.8 inch']
      }
    ]
  },
  {
    id: 'electronics',
    name: 'Laptops & Computers',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
    subcategories: ['Gaming Laptops', 'Thin & Light Laptops', 'MacBooks', 'Monitors', 'PC Components', 'Printers & Inks'],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        options: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI']
      },
      {
        id: 'processor',
        name: 'Processor Brand',
        type: 'checkbox',
        options: ['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M3 Pro']
      },
      {
        id: 'ram',
        name: 'RAM',
        type: 'checkbox',
        options: ['8 GB', '16 GB', '32 GB', '64 GB']
      },
      {
        id: 'ssd',
        name: 'SSD Capacity',
        type: 'checkbox',
        options: ['512 GB', '1 TB', '2 TB']
      },
      {
        id: 'graphics',
        name: 'Graphics Card',
        type: 'checkbox',
        options: ['NVIDIA RTX 4060', 'NVIDIA RTX 4070', 'NVIDIA RTX 4080', 'Integrated Graphics']
      }
    ]
  },
  {
    id: 'audio',
    name: 'Audio & Sound',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80',
    subcategories: ['TWS Earbuds', 'Over-Ear Headphones', 'Bluetooth Speakers', 'Soundbars', 'Neckbands'],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        options: ['Sony', 'Bose', 'Sennheiser', 'JBL', 'boAt', 'Noise', 'Apple']
      },
      {
        id: 'headphoneType',
        name: 'Headphone Form Factor',
        type: 'checkbox',
        options: ['True Wireless (TWS)', 'Over-Ear', 'On-Ear', 'In-Ear Neckband']
      },
      {
        id: 'anc',
        name: 'Noise Cancellation',
        type: 'checkbox',
        options: ['Active Noise Cancellation (ANC)', 'Environmental Noise Cancellation (ENC)']
      },
      {
        id: 'connectivity',
        name: 'Connectivity',
        type: 'checkbox',
        options: ['Bluetooth 5.3', 'Bluetooth 5.2', 'Wired 3.5mm']
      },
      {
        id: 'batteryLife',
        name: 'Battery Life',
        type: 'checkbox',
        options: ['Up to 24 Hours', '25 to 40 Hours', 'Above 40 Hours']
      }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    subcategories: ["Men's Shirts", "Men's Jeans", "Women's Kurtas", "Women's Dresses", "T-Shirts", "Jackets & Hoodies"],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        options: ["Levi's", 'Allen Solly', 'Van Heusen', 'Puma', 'US Polo Assn', 'Roadster', 'W for Woman']
      },
      {
        id: 'gender',
        name: 'Gender',
        type: 'checkbox',
        options: ['Men', 'Women', 'Unisex', 'Kids']
      },
      {
        id: 'size',
        name: 'Size',
        type: 'checkbox',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
      },
      {
        id: 'fabric',
        name: 'Fabric',
        type: 'checkbox',
        options: ['100% Pure Cotton', 'Linen', 'Denim', 'Polyester Blend', 'Silk']
      },
      {
        id: 'fit',
        name: 'Fit',
        type: 'checkbox',
        options: ['Slim Fit', 'Regular Fit', 'Oversized', 'Relaxed Fit']
      }
    ]
  },
  {
    id: 'footwear',
    name: 'Footwear & Shoes',
    icon: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&q=80',
    subcategories: ['Running Shoes', 'Sneakers', 'Casual Shoes', 'Formal Shoes', 'Sandals & Slippers', 'Sports Shoes'],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        options: ['Nike', 'Adidas', 'Puma', 'Asics', 'Skechers', 'Red Tape', 'Woodland']
      },
      {
        id: 'shoeSize',
        name: 'Size (UK/India)',
        type: 'checkbox',
        options: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12']
      },
      {
        id: 'sportsType',
        name: 'Activity / Type',
        type: 'checkbox',
        options: ['Running', 'Lifestyle Sneakers', 'Training & Gym', 'Walking', 'Formal Dress']
      },
      {
        id: 'material',
        name: 'Upper Material',
        type: 'checkbox',
        options: ['Breathable Mesh', 'Genuine Leather', 'Synthetic Canvas', 'Knit Fabric']
      }
    ]
  },
  {
    id: 'appliances',
    name: 'TVs & Appliances',
    icon: 'Tv',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80',
    subcategories: ['Smart 4K TVs', 'Air Conditioners', 'Refrigerators', 'Washing Machines', 'Microwaves', 'Air Purifiers'],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        options: ['LG', 'Samsung', 'Sony', 'Daikin', 'Voltas', 'IFB', 'Whirlpool', 'Dyson']
      },
      {
        id: 'energyRating',
        name: 'Energy Efficiency',
        type: 'checkbox',
        options: ['5 Star', '4 Star', '3 Star']
      },
      {
        id: 'screenSize',
        name: 'TV Display Size',
        type: 'checkbox',
        options: ['43 inch', '55 inch', '65 inch', '75 inch & Above']
      },
      {
        id: 'inverter',
        name: 'Inverter Technology',
        type: 'checkbox',
        options: ['Dual Inverter', 'Digital Inverter', 'Standard']
      }
    ]
  },
  {
    id: 'watches',
    name: 'Smartwatches & Accessories',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&q=80',
    subcategories: ['Smart Watches', 'Luxury Analog Watches', 'Fitness Bands', 'Straps & Protectors', 'Travel Backpacks'],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        options: ['Apple', 'Samsung', 'Fossil', 'Titan', 'Garmin', 'Amazfit', 'Noise', 'Fastrack']
      },
      {
        id: 'displayType',
        name: 'Display Type',
        type: 'checkbox',
        options: ['AMOLED Always-On', 'Retina LTPO', 'HD IPS LCD']
      },
      {
        id: 'strapMaterial',
        name: 'Strap Material',
        type: 'checkbox',
        options: ['Fluoroelastomer / Silicone', 'Stainless Steel Mesh', 'Genuine Italian Leather']
      },
      {
        id: 'gps',
        name: 'Built-in GPS',
        type: 'checkbox',
        options: ['Dual Frequency GPS', 'Standard GPS', 'No GPS']
      }
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty & Grooming',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
    subcategories: ['Skincare Serums', 'Hair Dryers & Stylers', 'Luxury Perfumes', "Men's Trimmers", 'Makeup Kits'],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        options: ["L'Oreal Paris", 'Philips', 'Dyson', 'The Ordinary', 'Forest Essentials', 'Minimalist', 'Nykaa']
      },
      {
        id: 'skinType',
        name: 'Skin Type',
        type: 'checkbox',
        options: ['All Skin Types', 'Oily / Acne Prone', 'Dry Skin', 'Sensitive Skin']
      },
      {
        id: 'formulation',
        name: 'Formulation',
        type: 'checkbox',
        options: ['Serum', 'Cream / Lotion', 'Gel', 'Oil']
      }
    ]
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
    subcategories: ['Cookware Sets', 'Coffee Makers', 'Robotic Vacuums', 'Bedsheets & Curtains', 'Ergonomic Chairs'],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        options: ['Prestige', 'Milton', 'Wonderchef', 'Philips', 'ECOVACS', 'SleepyCat', 'Wakefit']
      },
      {
        id: 'material',
        name: 'Material',
        type: 'checkbox',
        options: ['Tri-Ply Stainless Steel', 'Hard Anodized Aluminum', 'Memory Foam', '100% Cotton 400TC']
      }
    ]
  },
  {
    id: 'grocery',
    name: 'Grocery & Gourmet',
    icon: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=1200&q=80',
    subcategories: ['Organic Staples', 'Dry Fruits & Nuts', 'Exotic Teas & Coffee', 'Breakfast Cereals', 'Cold Pressed Oils'],
    filterGroups: [
      {
        id: 'brand',
        name: 'Brand',
        type: 'checkbox',
        options: ['Tata Sampann', 'Nutraj', 'Blue Tokai', 'Organic India', 'Kellogg\'s', 'Saffola']
      },
      {
        id: 'dietType',
        name: 'Dietary Preference',
        type: 'checkbox',
        options: ['100% Vegetarian', 'Organic Certified', 'Gluten Free', 'Sugar Free']
      }
    ]
  }
];

export const UNIVERSAL_FILTERS = [
  {
    id: 'price',
    name: 'Price Range',
    type: 'range',
    min: 0,
    max: 200000,
    step: 500
  },
  {
    id: 'rating',
    name: 'Customer Rating',
    type: 'radio',
    options: [
      { label: '4★ & above', value: 4 },
      { label: '3★ & above', value: 3 },
      { label: '2★ & above', value: 2 }
    ]
  },
  {
    id: 'discount',
    name: 'Discount',
    type: 'radio',
    options: [
      { label: '50% or more', value: 50 },
      { label: '40% or more', value: 40 },
      { label: '30% or more', value: 30 },
      { label: '20% or more', value: 20 },
      { label: '10% or more', value: 10 }
    ]
  },
  {
    id: 'deliverySpeed',
    name: 'Delivery Speed',
    type: 'checkbox',
    options: ['Express Next Day Delivery', '2-Day Delivery', 'Free Standard Delivery']
  },
  {
    id: 'availability',
    name: 'Availability',
    type: 'checkbox',
    options: ['In Stock Only', 'Exclude Out of Stock']
  },
  {
    id: 'assured',
    name: 'Avero Assured',
    type: 'toggle',
    description: 'Quality tested, genuine products with fast dispatch'
  }
];
