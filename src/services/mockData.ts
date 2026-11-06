import { Product, Brand } from '../types/product';
import { ProductReview } from '../types/review';
import { OrderDetail } from '../types/order';

export const BRANDS: Brand[] = [
  { brandId: 1, name: 'Apple', slug: 'apple' },
  { brandId: 2, name: 'Samsung', slug: 'samsung' },
  { brandId: 3, name: 'Xiaomi', slug: 'xiaomi' },
  { brandId: 4, name: 'OPPO', slug: 'oppo' },
  { brandId: 5, name: 'vivo', slug: 'vivo' },
  { brandId: 6, name: 'Realme', slug: 'realme' },
  { brandId: 7, name: 'ASUS', slug: 'asus' },
  { brandId: 8, name: 'Dell', slug: 'dell' },
  { brandId: 9, name: 'HP', slug: 'hp' },
  { brandId: 10, name: 'Lenovo', slug: 'lenovo' },
  { brandId: 11, name: 'Sony', slug: 'sony' },
  { brandId: 12, name: 'Anker', slug: 'anker' },
  { brandId: 13, name: 'JBL', slug: 'jbl' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    productId: 1,
    name: 'iPhone 15 Pro Max',
    brandName: 'Apple',
    categoryName: 'Điện thoại',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 12 tháng tại các trung tâm ủy quyền Apple Việt Nam. 1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản xuất.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
    gallery: [
      'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-titan-tu-nhien-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-black-1.jpg',
      'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-white-1.jpg',
    ],
    rating: 4.9,
    reviewCount: 248,
    isFlashSale: true,
    soldCount: 850,
    giftDescription: 'Tặng củ sạc nhanh 20W chính hãng & Giảm 20% khi mua ốp lưng MagSafe kèm máy',
    highlights: [
      'Khung viền Titanium chuẩn hàng không vũ trụ siêu nhẹ và bền bỉ',
      'Chip Apple A17 Pro tiến trình 3nm cân mọi tựa game đồ họa AAA',
      'Camera chính 48MP, ống kính tiềm vọng Zoom quang học 5x',
      'Cổng sạc Type-C truyền dữ liệu tốc độ cao USB 3',
      'Màn hình Super Retina XDR OLED 6.7 inch với ProMotion 120Hz'
    ],
    variants: [
      {
        variantId: 101,
        productId: 1,
        sku: 'IP15PM-256-NAT',
        color: 'Titan Tự Nhiên',
        colorHex: '#C5BDB5',
        ramGb: 8,
        romGb: 256,
        listPrice: 34990000,
        salePrice: 29490000,
        onHandQty: 15,
        reservedQty: 3,
        availableQty: 12,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
      },
      {
        variantId: 102,
        productId: 1,
        sku: 'IP15PM-256-BLU',
        color: 'Titan Xanh',
        colorHex: '#394454',
        ramGb: 8,
        romGb: 256,
        listPrice: 34990000,
        salePrice: 29490000,
        onHandQty: 10,
        reservedQty: 2,
        availableQty: 8,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
      },
      {
        variantId: 103,
        productId: 1,
        sku: 'IP15PM-256-BLK',
        color: 'Titan Đen',
        colorHex: '#212122',
        ramGb: 8,
        romGb: 256,
        listPrice: 34990000,
        salePrice: 29490000,
        onHandQty: 6,
        reservedQty: 1,
        availableQty: 5,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
      },
      {
        variantId: 104,
        productId: 1,
        sku: 'IP15PM-512-NAT',
        color: 'Titan Tự Nhiên',
        colorHex: '#C5BDB5',
        ramGb: 8,
        romGb: 512,
        listPrice: 40990000,
        salePrice: 35990000,
        onHandQty: 5,
        reservedQty: 5,
        availableQty: 0,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
      },
      {
        variantId: 105,
        productId: 1,
        sku: 'IP15PM-1TB-NAT',
        color: 'Titan Tự Nhiên',
        colorHex: '#C5BDB5',
        ramGb: 8,
        romGb: 1024,
        listPrice: 47990000,
        salePrice: 42990000,
        onHandQty: 4,
        reservedQty: 1,
        availableQty: 3,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
      }
    ],
    specGroups: [
      {
        groupName: 'Màn hình',
        items: [
          { name: 'Công nghệ màn hình', value: 'Super Retina XDR OLED' },
          { name: 'Độ phân giải', value: '2796 x 1290 Pixels' },
          { name: 'Kích thước màn hình', value: '6.7 inch - Tần số quét 120 Hz ProMotion' },
          { name: 'Độ sáng tối đa', value: '2000 nits ngoài trời' },
          { name: 'Mặt kính cảm ứng', value: 'Ceramic Shield chống trầy xước' }
        ]
      },
      {
        groupName: 'Camera sau',
        items: [
          { name: 'Độ phân giải camera', value: 'Chính 48 MP & Phụ 12 MP, 12 MP (Tele 5x)' },
          { name: 'Quay phim', value: '4K 2160p@60fps, Cinematic Mode 4K HDR, ProRes' },
          { name: 'Tính năng camera', value: 'Chống rung quang học Sensor-shift, Chụp đêm Night mode, Smart HDR 5' }
        ]
      },
      {
        groupName: 'Hệ điều hành & CPU',
        items: [
          { name: 'Hệ điều hành', value: 'iOS 17 (Nâng cấp dài hạn)' },
          { name: 'Chip xử lý (CPU)', value: 'Apple A17 Pro 6 nhân 3nm' },
          { name: 'Tốc độ CPU', value: 'Lên tới 3.78 GHz' },
          { name: 'Chip đồ họa (GPU)', value: 'Apple GPU 6 nhân có Ray Tracing' }
        ]
      },
      {
        groupName: 'Pin & Sạc',
        items: [
          { name: 'Dung lượng pin', value: '4422 mAh' },
          { name: 'Công nghệ sạc', value: 'Sạc nhanh 20W, Sạc không dây MagSafe 15W' },
          { name: 'Cổng kết nối', value: 'Type-C chuẩn USB 3.0 (tốc độ tới 10Gbps)' }
        ]
      }
    ]
  },
  {
    productId: 2,
    name: 'Samsung Galaxy S24 Ultra 5G',
    brandName: 'Samsung',
    categoryName: 'Điện thoại',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 12 tháng tại các trung tâm ủy quyền Samsung toàn quốc. Đổi mới 30 ngày.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-xam-thumb-600x600.jpg',
    gallery: [
      'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-xam-thumb-600x600.jpg',
    ],
    rating: 4.8,
    reviewCount: 162,
    isFlashSale: true,
    soldCount: 620,
    giftDescription: 'Tặng ốp lưng chính hãng & Gói Samsung Care+ 6 tháng rơi vỡ',
    highlights: [
      'Khung viền Titanium cao cấp cùng mặt kính Corning Gorilla Armor chống chói đỉnh cao',
      'Trợ lý ảo Galaxy AI thông minh: Khoanh tròn để tìm kiếm, Dịch trực tiếp cuộc gọi',
      'Bút S-Pen tích hợp ngay trong thân máy ghi chú tức thì',
      'Camera 200MP đột phá cùng khả năng Zoom quang học Quad Tele'
    ],
    variants: [
      {
        variantId: 201,
        productId: 2,
        sku: 'SS-S24U-256-GRY',
        color: 'Xám Titan',
        colorHex: '#6B6C70',
        ramGb: 12,
        romGb: 256,
        listPrice: 33990000,
        salePrice: 28490000,
        onHandQty: 18,
        reservedQty: 2,
        availableQty: 16,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-xam-thumb-600x600.jpg',
      },
      {
        variantId: 202,
        productId: 2,
        sku: 'SS-S24U-256-BLK',
        color: 'Đen Titan',
        colorHex: '#1F2024',
        ramGb: 12,
        romGb: 256,
        listPrice: 33990000,
        salePrice: 28490000,
        onHandQty: 12,
        reservedQty: 1,
        availableQty: 11,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-xam-thumb-600x600.jpg',
      },
      {
        variantId: 203,
        productId: 2,
        sku: 'SS-S24U-512-GRY',
        color: 'Xám Titan',
        colorHex: '#6B6C70',
        ramGb: 12,
        romGb: 512,
        listPrice: 37490000,
        salePrice: 32490000,
        onHandQty: 8,
        reservedQty: 1,
        availableQty: 7,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-xam-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      {
        groupName: 'Màn hình',
        items: [
          { name: 'Công nghệ màn hình', value: 'Dynamic AMOLED 2X' },
          { name: 'Độ phân giải', value: '2K+ (3120 x 1440 Pixels)' },
          { name: 'Kích thước', value: '6.8 inch - 120 Hz thích ứng' },
          { name: 'Độ sáng tối đa', value: '2600 nits' }
        ]
      },
      {
        groupName: 'Cấu hình & Pin',
        items: [
          { name: 'Chip xử lý', value: 'Snapdragon 8 Gen 3 for Galaxy' },
          { name: 'RAM', value: '12 GB LPDDR5X' },
          { name: 'Pin & Sạc', value: '5000 mAh, Sạc nhanh 45W' }
        ]
      }
    ]
  },
  {
    productId: 3,
    name: 'Xiaomi 14 5G',
    brandName: 'Xiaomi',
    categoryName: 'Điện thoại',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 24 tháng tại hệ thống bảo hành Xiaomi Việt Nam.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/313364/xiaomi-14-black-thumb-600x600.jpg',
    gallery: [
      'https://cdn.tgdd.vn/Products/Images/42/313364/xiaomi-14-black-thumb-600x600.jpg',
    ],
    rating: 4.7,
    reviewCount: 94,
    isFlashSale: true,
    soldCount: 310,
    giftDescription: 'Tặng vòng tay thông minh Xiaomi Smart Band 8',
    highlights: [
      'Ống kính quang học Leica Summilux đỉnh cao nhiếp ảnh',
      'Thiết kế nhỏ gọn 6.36 inch cầm nắm đầm tay với viền màn hình siêu mỏng',
      'Vi xử lý Snapdragon 8 Gen 3 hàng đầu phân khúc',
      'Sạc nhanh HyperCharge 90W sạc đầy chỉ trong 31 phút'
    ],
    variants: [
      {
        variantId: 301,
        productId: 3,
        sku: 'MI14-256-BLK',
        color: 'Đen Huyền Bí',
        colorHex: '#1B1C1E',
        ramGb: 12,
        romGb: 256,
        listPrice: 22990000,
        salePrice: 19990000,
        onHandQty: 10,
        reservedQty: 2,
        availableQty: 8,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/313364/xiaomi-14-black-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      {
        groupName: 'Màn hình',
        items: [
          { name: 'Kích thước', value: '6.36 inch OLED 120Hz LTPO' },
          { name: 'Độ sáng', value: '3000 nits đỉnh' }
        ]
      },
      {
        groupName: 'Cấu hình',
        items: [
          { name: 'CPU', value: 'Snapdragon 8 Gen 3' },
          { name: 'Pin', value: '4610 mAh, sạc 90W' }
        ]
      }
    ]
  },
  {
    productId: 4,
    name: 'iPhone 15 128GB',
    brandName: 'Apple',
    categoryName: 'Điện thoại',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành 12 tháng chính hãng Apple.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/281570/iphone-15-pink-thumb-600x600.jpg',
    gallery: [
      'https://cdn.tgdd.vn/Products/Images/42/281570/iphone-15-pink-thumb-600x600.jpg',
    ],
    rating: 4.8,
    reviewCount: 310,
    isFlashSale: false,
    soldCount: 1200,
    giftDescription: 'Giảm ngay 500.000đ khi mở thẻ tín dụng đối tác',
    highlights: [
      'Dynamic Island tương tác thông báo trực quan',
      'Camera chính 48MP chụp ảnh độ phân giải siêu nét',
      'Mặt lưng kính pha màu bền bỉ và cổng USB-C tiện lợi'
    ],
    variants: [
      {
        variantId: 401,
        productId: 4,
        sku: 'IP15-128-PNK',
        color: 'Hồng Pastel',
        colorHex: '#FAD7D9',
        ramGb: 6,
        romGb: 128,
        listPrice: 22990000,
        salePrice: 19490000,
        onHandQty: 25,
        reservedQty: 3,
        availableQty: 22,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/281570/iphone-15-pink-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      {
        groupName: 'Màn hình',
        items: [{ name: 'Kích thước', value: '6.1 inch OLED Super Retina XDR' }]
      },
      {
        groupName: 'Cấu hình',
        items: [{ name: 'CPU', value: 'Apple A16 Bionic 6 nhân' }]
      }
    ]
  },
  {
    productId: 5,
    name: 'OPPO Reno11 F 5G',
    brandName: 'OPPO',
    categoryName: 'Điện thoại',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành 12 tháng chính hãng OPPO.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/320721/oppo-reno-11-f-xanh-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/42/320721/oppo-reno-11-f-xanh-thumb-600x600.jpg'],
    rating: 4.6,
    reviewCount: 78,
    isFlashSale: false,
    soldCount: 430,
    highlights: ['Camera chân dung 64MP siêu nét', 'Sạc siêu nhanh SUPERVOOC 67W'],
    variants: [
      {
        variantId: 501,
        productId: 5,
        sku: 'OPPO-R11F-256-GRN',
        color: 'Xanh Đại Dương',
        colorHex: '#4E7E77',
        ramGb: 8,
        romGb: 256,
        listPrice: 8990000,
        salePrice: 8490000,
        onHandQty: 15,
        reservedQty: 0,
        availableQty: 15,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/320721/oppo-reno-11-f-xanh-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Màn hình', value: 'AMOLED 6.7 inch FHD+ 120Hz' }] },
      { groupName: 'Cấu hình', items: [{ name: 'Chip xử lý', value: 'Dimensity 7050 5G' }, { name: 'Pin', value: '5000 mAh, sạc 67W' }] }
    ]
  },
  {
    productId: 6,
    name: 'Samsung Galaxy A55 5G',
    brandName: 'Samsung',
    categoryName: 'Điện thoại',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành 12 tháng chính hãng.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/322096/samsung-galaxy-a55-5g-xanh-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/42/322096/samsung-galaxy-a55-5g-xanh-thumb-600x600.jpg'],
    rating: 4.7,
    reviewCount: 115,
    isFlashSale: false,
    soldCount: 560,
    highlights: ['Khung viền kim loại cao cấp', 'Kháng nước chuẩn IP67'],
    variants: [
      {
        variantId: 601,
        productId: 6,
        sku: 'SS-A55-128-BLU',
        color: 'Xanh Iceblue',
        colorHex: '#A3B9C9',
        ramGb: 8,
        romGb: 128,
        listPrice: 9990000,
        salePrice: 9190000,
        onHandQty: 20,
        reservedQty: 1,
        availableQty: 19,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/322096/samsung-galaxy-a55-5g-xanh-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Màn hình', value: 'Super AMOLED 6.6 inch 120Hz' }] },
      { groupName: 'Cấu hình', items: [{ name: 'Chip xử lý', value: 'Exynos 1480 8 nhân' }] }
    ]
  },
  {
    productId: 7,
    name: 'vivo V30e 5G',
    brandName: 'vivo',
    categoryName: 'Điện thoại',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 12 tháng.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/323356/vivo-v30e-nau-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/42/323356/vivo-v30e-nau-thumb-600x600.jpg'],
    rating: 4.6,
    reviewCount: 42,
    isFlashSale: false,
    soldCount: 180,
    highlights: ['Đèn Flash Aura 2.0 tùy chỉnh nhiệt độ màu', 'Thiết kế màn hình cong 3D cao cấp'],
    variants: [
      {
        variantId: 701,
        productId: 7,
        sku: 'VIVO-V30E-256-BRN',
        color: 'Nâu Ánh Sao',
        colorHex: '#5C4033',
        ramGb: 8,
        romGb: 256,
        listPrice: 9490000,
        salePrice: 8990000,
        onHandQty: 10,
        reservedQty: 0,
        availableQty: 10,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/323356/vivo-v30e-nau-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Màn hình', value: 'AMOLED 6.78 inch FHD+ 120Hz' }] },
      { groupName: 'Cấu hình', items: [{ name: 'Chip xử lý', value: 'Snapdragon 6 Gen 1' }, { name: 'Pin', value: '5500 mAh' }] }
    ]
  },
  {
    productId: 8,
    name: 'Xiaomi Redmi Note 13',
    brandName: 'Xiaomi',
    categoryName: 'Điện thoại',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành 18 tháng chính hãng Xiaomi.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/309831/xiaomi-redmi-note-13-den-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/42/309831/xiaomi-redmi-note-13-den-thumb-600x600.jpg'],
    rating: 4.5,
    reviewCount: 220,
    isFlashSale: true,
    soldCount: 1540,
    highlights: ['Camera 108MP siêu rõ nét', 'Màn hình viền siêu mỏng 120Hz', 'Sạc nhanh 33W'],
    variants: [
      {
        variantId: 801,
        productId: 8,
        sku: 'RD-N13-128-BLK',
        color: 'Đen Bán Dạ',
        colorHex: '#1C1C1E',
        ramGb: 6,
        romGb: 128,
        listPrice: 4890000,
        salePrice: 4390000,
        onHandQty: 30,
        reservedQty: 4,
        availableQty: 26,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/309831/xiaomi-redmi-note-13-den-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Màn hình', value: 'AMOLED 6.67 inch FHD+ 120Hz' }] },
      { groupName: 'Cấu hình', items: [{ name: 'Chip xử lý', value: 'Snapdragon 685' }, { name: 'Pin', value: '5000 mAh' }] }
    ]
  },
  {
    productId: 9,
    name: 'Realme C67',
    brandName: 'Realme',
    categoryName: 'Điện thoại',
    isInstallment0: false,
    warrantyPolicy: 'Bảo hành 12 tháng chính hãng.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/319409/realme-c67-xanh-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/42/319409/realme-c67-xanh-thumb-600x600.jpg'],
    rating: 4.4,
    reviewCount: 65,
    isFlashSale: false,
    soldCount: 410,
    highlights: ['Camera 108MP zoom 3X trong cảm biến', 'Chip Snapdragon 685 6nm tiết kiệm pin'],
    variants: [
      {
        variantId: 901,
        productId: 9,
        sku: 'REAL-C67-128-GRN',
        color: 'Xanh Nắng Mai',
        colorHex: '#A3D9C9',
        ramGb: 8,
        romGb: 128,
        listPrice: 4790000,
        salePrice: 4290000,
        onHandQty: 18,
        reservedQty: 0,
        availableQty: 18,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/319409/realme-c67-xanh-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Màn hình', value: 'IPS LCD 6.72 inch 90Hz' }] },
      { groupName: 'Cấu hình', items: [{ name: 'Chip xử lý', value: 'Snapdragon 685' }] }
    ]
  },
  {
    productId: 10,
    name: 'Samsung Galaxy A05s',
    brandName: 'Samsung',
    categoryName: 'Điện thoại',
    isInstallment0: false,
    warrantyPolicy: 'Bảo hành chính hãng 12 tháng.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/312015/samsung-galaxy-a05s-bac-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/42/312015/samsung-galaxy-a05s-bac-thumb-600x600.jpg'],
    rating: 4.4,
    reviewCount: 130,
    isFlashSale: false,
    soldCount: 920,
    highlights: ['Màn hình lớn 6.7 inch FHD+', 'Pin lớn 5000 mAh cùng sạc 25W'],
    variants: [
      {
        variantId: 1001,
        productId: 10,
        sku: 'SS-A05S-128-SLV',
        color: 'Bạc Xỉu Quán',
        colorHex: '#D8D9DE',
        ramGb: 4,
        romGb: 128,
        listPrice: 3990000,
        salePrice: 3490000,
        onHandQty: 22,
        reservedQty: 1,
        availableQty: 21,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/312015/samsung-galaxy-a05s-bac-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Màn hình', value: 'PLS LCD 6.7 inch 90Hz' }] },
      { groupName: 'Cấu hình', items: [{ name: 'Chip xử lý', value: 'Snapdragon 680 8 nhân' }] }
    ]
  },
  {
    productId: 11,
    name: 'iPad Air 5 M1 WiFi 64GB',
    brandName: 'Apple',
    categoryName: 'Máy tính bảng',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành 12 tháng Apple Care.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/522/274154/ipad-air-5-m1-wifi-blue-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/522/274154/ipad-air-5-m1-wifi-blue-thumb-600x600.jpg'],
    rating: 4.9,
    reviewCount: 88,
    isFlashSale: false,
    soldCount: 340,
    highlights: ['Sức mạnh bứt phá từ chip Apple M1', 'Màn hình Liquid Retina 10.9 inch sắc nét', 'Hỗ trợ Apple Pencil 2 và Magic Keyboard'],
    variants: [
      {
        variantId: 1101,
        productId: 11,
        sku: 'IPAD-AIR5-64-BLU',
        color: 'Xanh Khí Chất',
        colorHex: '#9BBFD4',
        ramGb: 8,
        romGb: 64,
        listPrice: 15490000,
        salePrice: 13990000,
        onHandQty: 10,
        reservedQty: 1,
        availableQty: 9,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/522/274154/ipad-air-5-m1-wifi-blue-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Màn hình', value: 'Liquid Retina 10.9 inch' }] },
      { groupName: 'Cấu hình', items: [{ name: 'CPU', value: 'Apple M1 8 nhân' }, { name: 'RAM', value: '8 GB' }] }
    ]
  },
  {
    productId: 12,
    name: 'Sạc Anker 30W GaN Nano III Type-C',
    brandName: 'Anker',
    categoryName: 'Phụ kiện',
    isInstallment0: false,
    warrantyPolicy: 'Bảo hành 18 tháng 1 đổi 1.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/9499/308154/adapter-sac-30w-anker-nano-3-511-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/9499/308154/adapter-sac-30w-anker-nano-3-511-thumb-600x600.jpg'],
    rating: 4.9,
    reviewCount: 310,
    isFlashSale: true,
    soldCount: 2400,
    highlights: ['Công nghệ GaN III siêu nhỏ gọn', 'Công suất sạc 30W sạc nhanh cho cả iPhone và iPad'],
    variants: [
      {
        variantId: 1201,
        productId: 12,
        sku: 'ANK-30W-WHT',
        color: 'Trắng Trang Nhã',
        colorHex: '#FFFFFF',
        ramGb: 0,
        romGb: 0,
        listPrice: 450000,
        salePrice: 320000,
        onHandQty: 80,
        reservedQty: 5,
        availableQty: 75,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/9499/308154/adapter-sac-30w-anker-nano-3-511-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Thông số', items: [{ name: 'Công suất', value: '30W Power Delivery' }, { name: 'Cổng cắm', value: '1 x Type-C' }] }
    ]
  },
  {
    productId: 13,
    name: 'MacBook Air 13 inch M3 2024',
    brandName: 'Apple',
    categoryName: 'Laptop',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 12 tháng tại các trung tâm Apple ủy quyền (AASP).',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/44/322615/macbook-air-13-inch-m3-xam-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/44/322615/macbook-air-13-inch-m3-xam-thumb-600x600.jpg'],
    rating: 5.0,
    reviewCount: 42,
    isFlashSale: false,
    soldCount: 156,
    highlights: ['Chip Apple M3 8 nhân GPU 10 nhân đỉnh cao', 'Thiết kế nhôm nguyên khối siêu mỏng 11.3mm', 'Thời lượng pin ấn tượng lên đến 18 giờ'],
    variants: [
      {
        variantId: 1301,
        productId: 13,
        sku: 'MBA-M3-8-256-MID',
        color: 'Xanh Đen Midnight',
        colorHex: '#1E232A',
        ramGb: 8,
        romGb: 256,
        listPrice: 27990000,
        salePrice: 25490000,
        onHandQty: 12,
        reservedQty: 2,
        availableQty: 10,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/44/322615/macbook-air-13-inch-m3-xam-thumb-600x600.jpg',
      },
      {
        variantId: 1302,
        productId: 13,
        sku: 'MBA-M3-16-512-SLV',
        color: 'Bạc Ánh Sao',
        colorHex: '#E2E4E1',
        ramGb: 16,
        romGb: 512,
        listPrice: 35990000,
        salePrice: 32990000,
        onHandQty: 8,
        reservedQty: 1,
        availableQty: 7,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/44/322615/macbook-air-13-inch-m3-xam-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Kích thước', value: '13.6 inch Liquid Retina IPS' }, { name: 'Độ phân giải', value: '2560 x 1664 pixels, 500 nits' }] },
      { groupName: 'Cấu hình & Hiệu năng', items: [{ name: 'CPU', value: 'Apple M3 8 nhân' }, { name: 'GPU', value: '10 nhân đồ họa' }, { name: 'Bộ nhớ RAM', value: '8 GB / 16 GB Unified' }] }
    ]
  },
  {
    productId: 14,
    name: 'Laptop ASUS ROG Strix G16 Gaming',
    brandName: 'ASUS',
    categoryName: 'Laptop',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 24 tháng toàn diện.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/44/309825/asus-rog-strix-g16-g614ju-i7-n4079w-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/44/309825/asus-rog-strix-g16-g614ju-i7-n4079w-thumb-600x600.jpg'],
    rating: 4.8,
    reviewCount: 35,
    isFlashSale: true,
    soldCount: 98,
    highlights: ['Intel Core i7 thế hệ mới cực mạnh', 'Card đồ họa rời NVIDIA GeForce RTX 4050 6GB', 'Màn hình 165Hz chuẩn thể thao điện tử'],
    variants: [
      {
        variantId: 1401,
        productId: 14,
        sku: 'ROG-G16-I7-16-512',
        color: 'Xám Eclipse Gray',
        colorHex: '#3A3D40',
        ramGb: 16,
        romGb: 512,
        listPrice: 34990000,
        salePrice: 29990000,
        onHandQty: 7,
        reservedQty: 1,
        availableQty: 6,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/44/309825/asus-rog-strix-g16-g614ju-i7-n4079w-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Kích thước', value: '16.0 inch FHD+ 165Hz' }] },
      { groupName: 'Cấu hình', items: [{ name: 'CPU', value: 'Intel Core i7-13650HX' }, { name: 'Card đồ họa', value: 'NVIDIA RTX 4050 6GB' }] }
    ]
  },
  {
    productId: 15,
    name: 'Laptop Dell Inspiron 15 3520',
    brandName: 'Dell',
    categoryName: 'Laptop',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành tận nơi 12 tháng từ Dell ProSupport.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/44/285527/dell-inspiron-15-3520-i5-71003264-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/44/285527/dell-inspiron-15-3520-i5-71003264-thumb-600x600.jpg'],
    rating: 4.7,
    reviewCount: 29,
    isFlashSale: false,
    soldCount: 142,
    highlights: ['Intel Core i5 thế hệ 12 mượt mà', 'Màn hình 120Hz chống chói sắc nét', 'Bàn phím full-size tiện lợi nhập số liệu'],
    variants: [
      {
        variantId: 1501,
        productId: 15,
        sku: 'DELL-3520-I5-16-512',
        color: 'Đen Carbon Black',
        colorHex: '#1C1D1F',
        ramGb: 16,
        romGb: 512,
        listPrice: 17990000,
        salePrice: 15490000,
        onHandQty: 14,
        reservedQty: 2,
        availableQty: 12,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/44/285527/dell-inspiron-15-3520-i5-71003264-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Kích thước', value: '15.6 inch FHD 120Hz' }] },
      { groupName: 'Cấu hình', items: [{ name: 'CPU', value: 'Intel Core i5-1235U' }, { name: 'RAM', value: '16 GB DDR4' }] }
    ]
  },
  {
    productId: 16,
    name: 'Laptop Lenovo Legion Pro 5',
    brandName: 'Lenovo',
    categoryName: 'Laptop',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 24 tháng Lenovo Legion Ultimate Support.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/44/313333/lenovo-legion-pro-5-16irx8-i7-82wk0097vn-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/44/313333/lenovo-legion-pro-5-16irx8-i7-82wk0097vn-thumb-600x600.jpg'],
    rating: 4.9,
    reviewCount: 51,
    isFlashSale: true,
    soldCount: 88,
    highlights: ['Chip Intel Core i7-13700HX cực mạnh', 'NVIDIA RTX 4060 8GB TGP 140W', 'Màn hình 2K WQXGA 240Hz chuẩn 100% sRGB'],
    variants: [
      {
        variantId: 1601,
        productId: 16,
        sku: 'LENOVO-LEGION-PRO5-32-1TB',
        color: 'Xám Onyx Grey',
        colorHex: '#4A4C50',
        ramGb: 32,
        romGb: 1024,
        listPrice: 45990000,
        salePrice: 39990000,
        onHandQty: 6,
        reservedQty: 1,
        availableQty: 5,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/44/313333/lenovo-legion-pro-5-16irx8-i7-82wk0097vn-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Kích thước', value: '16.0 inch 2.5K 240Hz 500 nits' }] },
      { groupName: 'Cấu hình', items: [{ name: 'CPU', value: 'Intel Core i7-13700HX' }, { name: 'RAM', value: '32 GB DDR5' }] }
    ]
  },
  {
    productId: 17,
    name: 'Tai nghe Sony WH-1000XM5 Chống ồn',
    brandName: 'Sony',
    categoryName: 'Phụ kiện',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 12 tháng Sony Việt Nam.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/54/282276/tai-nghe-chup-tai-sony-wh-1000xm5-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/54/282276/tai-nghe-chup-tai-sony-wh-1000xm5-thumb-600x600.jpg'],
    rating: 4.9,
    reviewCount: 78,
    isFlashSale: true,
    soldCount: 320,
    highlights: ['Chống ồn đỉnh cao hàng đầu thế giới Auto NC Optimizer', 'Thời lượng pin 30 giờ, sạc 3 phút dùng 3 giờ', 'Chất âm Hi-Res Audio Wireless chuẩn LDAC'],
    variants: [
      {
        variantId: 1701,
        productId: 17,
        sku: 'SONY-XM5-BLK',
        color: 'Đen Huyền Bí',
        colorHex: '#1B1B1B',
        ramGb: 0,
        romGb: 0,
        listPrice: 8990000,
        salePrice: 6990000,
        onHandQty: 25,
        reservedQty: 3,
        availableQty: 22,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/54/282276/tai-nghe-chup-tai-sony-wh-1000xm5-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Thông số', items: [{ name: 'Kết nối', value: 'Bluetooth 5.2, Jack 3.5mm' }, { name: 'Thời lượng pin', value: '30 giờ (bật chống ồn)' }] }
    ]
  },
  {
    productId: 18,
    name: 'iPad Pro 11 inch M4 2024 WiFi 256GB',
    brandName: 'Apple',
    categoryName: 'Máy tính bảng',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 12 tháng Apple Care toàn cầu.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/522/323381/ipad-pro-11-inch-m4-wifi-space-black-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/522/323381/ipad-pro-11-inch-m4-wifi-space-black-thumb-600x600.jpg'],
    rating: 5.0,
    reviewCount: 39,
    isFlashSale: false,
    soldCount: 120,
    highlights: ['Chip Apple M4 thế hệ mới siêu mạnh mẽ', 'Màn hình Ultra Retina XDR Tandem OLED đột phá', 'Thiết kế siêu mỏng nhẹ chỉ 5.3mm'],
    variants: [
      {
        variantId: 1801,
        productId: 18,
        sku: 'IPAD-PRO11-M4-256-BLK',
        color: 'Đen Không Gian',
        colorHex: '#2E2F32',
        ramGb: 8,
        romGb: 256,
        listPrice: 28990000,
        salePrice: 27990000,
        onHandQty: 12,
        reservedQty: 2,
        availableQty: 10,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/522/323381/ipad-pro-11-inch-m4-wifi-space-black-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Kích thước', value: '11.0 inch Ultra Retina XDR Tandem OLED 120Hz' }] },
      { groupName: 'Cấu hình', items: [{ name: 'CPU', value: 'Apple M4 9 nhân' }, { name: 'RAM', value: '8 GB' }] }
    ]
  },
  {
    productId: 19,
    name: 'Tai nghe Apple AirPods Pro 2 Type-C (MagSafe)',
    brandName: 'Apple',
    categoryName: 'Phụ kiện',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 12 tháng tại các trung tâm Apple AASP.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/54/315181/airpods-pro-2nd-gen-type-c-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/54/315181/airpods-pro-2nd-gen-type-c-thumb-600x600.jpg'],
    rating: 4.9,
    reviewCount: 165,
    isFlashSale: false,
    soldCount: 890,
    highlights: ['Chống ồn chủ động gấp 2 lần với chip H2', 'Cổng sạc Type-C tiêu chuẩn & hỗ trợ sạc MagSafe', 'Kháng bụi nước chuẩn IP54 bền bỉ'],
    variants: [
      {
        variantId: 1901,
        productId: 19,
        sku: 'AIRPODS-PRO2-USBC',
        color: 'Trắng Tinh Khiết',
        colorHex: '#FFFFFF',
        ramGb: 0,
        romGb: 0,
        listPrice: 6190000,
        salePrice: 5390000,
        onHandQty: 40,
        reservedQty: 4,
        availableQty: 36,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/54/315181/airpods-pro-2nd-gen-type-c-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Thông số', items: [{ name: 'Chip xử lý', value: 'Apple H2' }, { name: 'Thời lượng pin', value: '6 giờ nghe liên tục (30 giờ kèm hộp)' }] }
    ]
  },
  {
    productId: 20,
    name: 'Laptop HP Envy x360 14 inch OLED 2-in-1',
    brandName: 'HP',
    categoryName: 'Laptop',
    isInstallment0: true,
    warrantyPolicy: 'Bảo hành chính hãng 12 tháng tận nơi từ HP ProSupport.',
    thumbnail: 'https://cdn.tgdd.vn/Products/Images/44/325251/hp-envy-x360-14-fa0046au-r7-a19c1pa-thumb-600x600.jpg',
    gallery: ['https://cdn.tgdd.vn/Products/Images/44/325251/hp-envy-x360-14-fa0046au-r7-a19c1pa-thumb-600x600.jpg'],
    rating: 4.8,
    reviewCount: 22,
    isFlashSale: false,
    soldCount: 64,
    highlights: ['Màn hình cảm ứng OLED 2.8K xoay gập 360 độ', 'Vi xử lý Intel Core Ultra AI thế hệ mới', 'Thiết kế nhôm nguyên khối sang trọng, pin 12h'],
    variants: [
      {
        variantId: 2001,
        productId: 20,
        sku: 'HP-ENVY-X360-14-16-512',
        color: 'Bạc Glacier Silver',
        colorHex: '#D6D8D9',
        ramGb: 16,
        romGb: 512,
        listPrice: 25990000,
        salePrice: 23490000,
        onHandQty: 10,
        reservedQty: 1,
        availableQty: 9,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/44/325251/hp-envy-x360-14-fa0046au-r7-a19c1pa-thumb-600x600.jpg',
      }
    ],
    specGroups: [
      { groupName: 'Màn hình', items: [{ name: 'Kích thước', value: '14.0 inch 2.8K OLED cảm ứng xoay 360' }] },
      { groupName: 'Cấu hình', items: [{ name: 'CPU', value: 'Intel Core Ultra 5-125H AI' }, { name: 'RAM', value: '16 GB LPDDR5X' }] }
    ]
  }
];

// Dữ liệu đánh giá mẫu
export const MOCK_REVIEWS: ProductReview[] = [
  {
    reviewId: 1,
    productId: 1,
    userName: 'Nguyễn Văn Tuấn',
    userPhoneMasked: '0983****12',
    rating: 5,
    comment: 'Máy cầm rất đầm tay, viền titan tự nhiên sang trọng và nhẹ hơn hẳn bản 14 Pro Max cũ của mình. Pin dùng trâu, giao hàng hỏa tốc trong 2 tiếng được kiểm máy ưng ý mới trả tiền!',
    storeReply: 'Dạ NextGen Smart Tech cảm ơn anh Tuấn đã tin tưởng ủng hộ ạ. Chúc anh có trải nghiệm tuyệt vời cùng siêu phẩm iPhone 15 Pro Max!',
    repliedAt: '2026-10-20T10:15:00Z',
    createdAt: '2026-10-19T14:20:00Z',
    isBuyerVerified: true,
  },
  {
    reviewId: 2,
    productId: 1,
    userName: 'Hoàng Minh Ngọc',
    userPhoneMasked: '0912****88',
    rating: 5,
    comment: 'Màu Titan Tự Nhiên ngoài đời đẹp hơn trong ảnh nhiều. Nhân viên tư vấn nhiệt tình, có cơ chế giữ chỗ 30 phút nên không sợ bị hết hàng lúc quét mã QR chuyển khoản.',
    createdAt: '2026-10-21T09:40:00Z',
    isBuyerVerified: true,
  },
  {
    reviewId: 3,
    productId: 2,
    userName: 'Lê Hoàng Nam',
    userPhoneMasked: '0975****99',
    rating: 5,
    comment: 'Galaxy S24 Ultra màn hình phẳng chống chói cực tốt khi ra trời nắng. Tính năng dịch trực tiếp cuộc gọi và khoanh tròn tìm kiếm bằng bút S-Pen rất tiện cho công việc!',
    storeReply: 'Dạ cảm ơn anh Nam đã đánh giá 5 sao. Bên em luôn sẵn sàng hỗ trợ kỹ thuật bảo hành 24/7 ạ!',
    repliedAt: '2026-10-22T11:00:00Z',
    createdAt: '2026-10-21T18:30:00Z',
    isBuyerVerified: true,
  }
];

// Danh sách đơn hàng mẫu cho Tra cứu đơn
export const MOCK_ORDERS_DETAIL: OrderDetail[] = [
  {
    orderId: 1,
    orderCode: 'DH20261015-089',
    status: 'WAITING_CONFIRMATION',
    recipientName: 'Trần Thị Thu Huyền',
    recipientPhone: '0987654321',
    shippingAddress: 'Số 12, Phố Vọng, Phường Đồng Tâm, Quận Hai Bà Trưng, Hà Nội',
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    subtotal: 29490000,
    shippingFee: 0,
    voucherDiscount: 0,
    totalAmount: 29490000,
    createdAt: '2026-10-23T15:10:00Z',
    updatedAt: '2026-10-23T15:10:00Z',
    items: [
      {
        orderItemId: 1,
        variantId: 101,
        productId: 1,
        productNameSnapshot: 'iPhone 15 Pro Max 256GB',
        skuSnapshot: 'IP15PM-256-NAT',
        colorSnapshot: 'Titan Tự Nhiên',
        romSnapshot: '256GB',
        unitPrice: 29490000,
        quantity: 1,
        lineTotal: 29490000,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
      }
    ],
    statusHistory: [
      { status: 'WAITING_CONFIRMATION', time: '15:10 23/10/2026', note: 'Đơn hàng đã được tạo thành công và hệ thống tự động giữ chỗ tồn kho.' }
    ]
  },
  {
    orderId: 2,
    orderCode: 'DH20261015-090',
    status: 'PREPARING',
    recipientName: 'Trần Duy Khôi',
    recipientPhone: '0912345678',
    shippingAddress: 'Số 9, Ngõ 181 Xuân Thủy, Cầu Giấy, Hà Nội',
    paymentMethod: 'SIMULATED_TRANSFER',
    paymentStatus: 'PAID',
    subtotal: 42990000,
    shippingFee: 0,
    voucherDiscount: 200000,
    totalAmount: 42790000,
    createdAt: '2026-10-23T14:40:00Z',
    updatedAt: '2026-10-23T14:55:00Z',
    items: [
      {
        orderItemId: 2,
        variantId: 105,
        productId: 1,
        productNameSnapshot: 'iPhone 15 Pro Max 1TB',
        skuSnapshot: 'IP15PM-1TB-NAT',
        colorSnapshot: 'Titan Tự Nhiên',
        romSnapshot: '1TB',
        unitPrice: 42990000,
        quantity: 1,
        lineTotal: 42990000,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
      }
    ],
    statusHistory: [
      { status: 'PENDING_PAYMENT', time: '14:40 23/10/2026', note: 'Khởi tạo đơn hàng, kích hoạt giữ chỗ 30 phút.' },
      { status: 'CONFIRMED', time: '14:48 23/10/2026', note: 'Nhân viên kế toán xác nhận đã nhận chuyển khoản hợp lệ.' },
      { status: 'PREPARING', time: '14:55 23/10/2026', note: 'Bộ phận kho đang kiểm đếm ngoại quan và đóng gói máy.' }
    ]
  },
  {
    orderId: 3,
    orderCode: 'DH20261015-087',
    status: 'SHIPPING',
    recipientName: 'Lê Thu Trang',
    recipientPhone: '0933999888',
    shippingAddress: 'Số 45, Đường Lê Duẩn, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    carrier: 'Giao Hàng Nhanh 2H (Mô phỏng)',
    trackingCode: 'GHN8829104',
    subtotal: 28490000,
    shippingFee: 0,
    voucherDiscount: 0,
    totalAmount: 28490000,
    createdAt: '2026-10-23T11:20:00Z',
    updatedAt: '2026-10-23T12:00:00Z',
    items: [
      {
        orderItemId: 3,
        variantId: 201,
        productId: 2,
        productNameSnapshot: 'Samsung Galaxy S24 Ultra 256GB',
        skuSnapshot: 'SS-S24U-256-GRY',
        colorSnapshot: 'Xám Titan',
        romSnapshot: '256GB',
        unitPrice: 28490000,
        quantity: 1,
        lineTotal: 28490000,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-xam-thumb-600x600.jpg',
      }
    ],
    statusHistory: [
      { status: 'WAITING_CONFIRMATION', time: '11:20 23/10/2026', note: 'Đơn hàng được tiếp nhận.' },
      { status: 'CONFIRMED', time: '11:35 23/10/2026', note: 'Đã xác nhận đơn hàng qua điện thoại.' },
      { status: 'PREPARING', time: '11:45 23/10/2026', note: 'Đã đóng gói hoàn tất.' },
      { status: 'SHIPPING', time: '12:00 23/10/2026', note: 'Xuất kho vật lý và bàn giao bưu tá giao vận.' }
    ]
  },
  {
    orderId: 4,
    orderCode: 'DH20261026-091',
    status: 'CONFIRMED',
    recipientName: 'Đặng Quốc Anh',
    recipientPhone: '0978112233',
    shippingAddress: 'Số 88, Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội',
    paymentMethod: 'SIMULATED_TRANSFER',
    paymentStatus: 'PAID',
    carrier: 'Giao Hàng Nhanh Express',
    trackingCode: 'GHN-99210291',
    subtotal: 19990000,
    shippingFee: 0,
    voucherDiscount: 0,
    totalAmount: 19990000,
    createdAt: '2026-10-26T09:00:00Z',
    updatedAt: '2026-10-26T09:15:00Z',
    items: [
      {
        orderItemId: 4,
        variantId: 301,
        productId: 3,
        productNameSnapshot: 'Xiaomi 14 5G 256GB',
        skuSnapshot: 'XM14-256-BLK',
        colorSnapshot: 'Đen Cổ Điển',
        romSnapshot: '256GB',
        unitPrice: 19990000,
        quantity: 1,
        lineTotal: 19990000,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/313364/xiaomi-14-black-thumb-600x600.jpg',
      }
    ],
    statusHistory: [
      { status: 'WAITING_CONFIRMATION', time: '09:00 26/10/2026', note: 'Đơn hàng được tiếp nhận.' },
      { status: 'CONFIRMED', time: '09:15 26/10/2026', note: 'Nhân viên đã xác nhận đơn hàng. Hệ thống đã tự động tạo vận đơn GHN-99210291 với trạng thái mặc định: Đang chờ lấy hàng.' }
    ]
  },
  {
    orderId: 5,
    orderCode: 'DH20261025-082',
    status: 'COMPLETED',
    recipientName: 'Vũ Minh Trí',
    recipientPhone: '0911223344',
    shippingAddress: 'Số 45, Đường Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    carrier: 'GHTK Tiết Kiệm',
    trackingCode: 'GHTK-33491820',
    subtotal: 24990000,
    shippingFee: 0,
    voucherDiscount: 500000,
    totalAmount: 24490000,
    createdAt: '2026-10-25T08:00:00Z',
    updatedAt: '2026-10-25T11:45:00Z',
    completedAt: '2026-10-25T11:45:00Z',
    items: [
      {
        orderItemId: 5,
        variantId: 401,
        productId: 4,
        productNameSnapshot: 'OPPO Find N3 Flip 256GB',
        skuSnapshot: 'OP-FN3F-256-GLD',
        colorSnapshot: 'Vàng Ánh Kim',
        romSnapshot: '256GB',
        unitPrice: 24990000,
        quantity: 1,
        lineTotal: 24990000,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/313368/oppo-find-n3-flip-vang-thumb-600x600.jpg',
      }
    ],
    statusHistory: [
      { status: 'WAITING_CONFIRMATION', time: '08:00 25/10/2026', note: 'Đơn hàng được tiếp nhận.' },
      { status: 'CONFIRMED', time: '08:20 25/10/2026', note: 'Đã xác nhận đơn hàng. Khởi tạo vận đơn: Đang chờ lấy hàng.' },
      { status: 'PREPARING', time: '08:40 25/10/2026', note: 'Bưu tá đã lấy hàng từ kho vật lý.' },
      { status: 'SHIPPING', time: '09:30 25/10/2026', note: 'Đang vận chuyển luân chuyển bưu cục.' },
      { status: 'COMPLETED', time: '11:45 25/10/2026', note: 'Khách hàng đã nhận thiết bị thành công (Vận đơn: Đã vận chuyển thành công). Ghi nhận doanh thu thuần.' }
    ]
  },
  {
    orderId: 6,
    orderCode: 'DH20261024-075',
    status: 'CANCELLED',
    recipientName: 'Phạm Quốc Bảo',
    recipientPhone: '0909090909',
    shippingAddress: 'Thôn 3, Xã Ea Kao, TP. Buôn Ma Thuột, Đắk Lắk',
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    carrier: 'Giao Hàng Nhanh Express',
    trackingCode: 'GHN-11029384',
    cancelReason: 'Giao hàng không thành công: Shipper đã liên hệ 3 lần trong 2 ngày nhưng số thuê bao không liên lạc được',
    subtotal: 18490000,
    shippingFee: 0,
    voucherDiscount: 0,
    totalAmount: 18490000,
    createdAt: '2026-10-24T10:00:00Z',
    updatedAt: '2026-10-25T17:00:00Z',
    items: [
      {
        orderItemId: 6,
        variantId: 601,
        productId: 6,
        productNameSnapshot: 'Samsung Galaxy A54 5G 128GB',
        skuSnapshot: 'SS-A54-128-VIO',
        colorSnapshot: 'Tím Khúc Triết',
        romSnapshot: '128GB',
        unitPrice: 8490000,
        quantity: 1,
        lineTotal: 8490000,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/285519/samsung-galaxy-a54-tim-thumb-600x600.jpg',
      }
    ],
    statusHistory: [
      { status: 'CONFIRMED', time: '10:00 24/10/2026', note: 'Đã xác nhận đơn hàng.' },
      { status: 'SHIPPING', time: '14:00 24/10/2026', note: 'Đang vận chuyển giao hàng.' },
      { status: 'CANCELLED', time: '17:00 25/10/2026', note: 'Đơn hàng bị hủy do giao hàng không thành công: Shipper đã liên hệ 3 lần nhưng không liên lạc được. Chuyển hoàn kho.' }
    ]
  },
  {
    orderId: 7,
    orderCode: 'DH20261024-071',
    status: 'CANCELLED',
    recipientName: 'Hoàng Kim Liên',
    recipientPhone: '0945678901',
    shippingAddress: 'Số 102, Phố Huế, Quận Hai Bà Trưng, Hà Nội',
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    carrier: 'ViettelPost Hỏa Tốc',
    trackingCode: 'VTP-55219011',
    cancelReason: 'Lấy hàng không thành công: Kho kiểm tra phát hiện vỏ hộp bị móp nhẹ, nhân viên hủy lệnh bàn giao bưu tá',
    subtotal: 17990000,
    shippingFee: 0,
    voucherDiscount: 0,
    totalAmount: 17990000,
    createdAt: '2026-10-24T13:00:00Z',
    updatedAt: '2026-10-24T15:30:00Z',
    items: [
      {
        orderItemId: 7,
        variantId: 501,
        productId: 5,
        productNameSnapshot: 'iPhone 13 128GB Chính Hãng',
        skuSnapshot: 'IP13-128-PNK',
        colorSnapshot: 'Hồng Nữ Tính',
        romSnapshot: '128GB',
        unitPrice: 17990000,
        quantity: 1,
        lineTotal: 17990000,
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/250258/iphone-13-pink-thumbnew-600x600.jpg',
      }
    ],
    statusHistory: [
      { status: 'CONFIRMED', time: '13:00 24/10/2026', note: 'Đã xác nhận đơn hàng. Tạo vận đơn: Đang chờ lấy hàng.' },
      { status: 'CANCELLED', time: '15:30 24/10/2026', note: 'Đơn hàng bị hủy do lấy hàng không thành công: Vỏ hộp bị móp ngoại quan, hủy lấy hàng để đổi máy mới cho khách. Đã giải phóng giữ chỗ kho.' }
    ]
  }
];

// Danh mục câu hỏi thường gặp FAQ
export const MOCK_FAQS = [
  {
    topic: 'Chính sách bảo hành & Đổi trả ',
    question: 'Chính sách bảo hành và đổi trả 1-1 tại NextGen Smart Tech được áp dụng như thế nào?',
    answer: 'NextGen Smart Tech cam kết 100% sản phẩm là hàng chính hãng. Trong vòng 30 ngày kể từ ngày mua, nếu sản phẩm phát sinh lỗi phần cứng do nhà sản xuất, khách hàng được đổi ngay 1 máy mới nguyên seal cùng model. Sau 30 ngày, sản phẩm được bảo hành chính hãng 12 tháng tại các trung tâm ủy quyền toàn quốc (Apple AASP, Samsung CS, Xiaomi...).'
  },
  {
    topic: 'Cơ chế Giữ chỗ tồn kho',
    question: 'Cơ chế Giữ chỗ tồn kho 30 phút hoạt động ra sao khi tôi đặt mua online?',
    answer: 'Khi bạn bấm đặt hàng với phương thức Chuyển khoản QR, hệ thống tự động khóa 1 suất tồn kho thực tế cho bạn và đếm ngược trong vòng 30 phút. Trong thời gian này, không khách hàng nào khác có thể mua tranh chiếc máy của bạn. Nếu sau 30 phút chưa thanh toán, hệ thống sẽ tự động hủy đơn và hoàn lại số lượng vào tồn kho bán lẻ để tránh chiếm dụng kho.'
  },
  {
    topic: 'Giao hàng & Kiểm hàng COD',
    question: 'Tôi ở tỉnh xa thì thời gian nhận hàng bao lâu và có được bóc máy kiểm tra không?',
    answer: 'Với khu vực nội thành Hà Nội & TP.HCM, NextGen Smart Tech giao hỏa tốc trong 2 giờ. Các tỉnh thành khác thời gian giao từ 1 - 3 ngày qua Viettel Post hoặc GHTK. Bạn hoàn toàn ĐƯỢC PHÉP kiểm tra niêm phong, ngoại quan hộp máy trước khi thanh toán tiền mặt cho shipper.'
  },
  {
    topic: 'Phương thức thanh toán & Voucher',
    question: 'Tôi có thể dùng cùng lúc nhiều mã giảm giá cho 1 đơn hàng không?',
    answer: 'Theo quy định nghiệp vụ hệ thống, mỗi đơn hàng được áp dụng tối đa 01 mã Voucher giảm giá đơn hàng trên tổng tiền sau khi đã trừ giá khuyến mãi Flash Sale trực tiếp của sản phẩm.'
  }
];
