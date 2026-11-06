import React, { useState, useEffect, useMemo } from 'react';
import { sharedStore } from '../../services/sharedStore';
import { categoryService } from '../../services/categoryService';
import { Product, Brand, ProductVariant, ProductSpecGroup } from '../../types/product';
import { ProductSpecsEditor } from '../../components/portal/ProductSpecsEditor';
import { ProductImagesManager } from '../../components/portal/ProductImagesManager';
import { PortalPagination } from '../../components/portal/PortalPagination';
import { formatVND } from '../../components/common/PriceDisplay';
import { 
  Smartphone, 
  Tag, 
  Plus, 
  Trash2, 
  Edit, 
  AlertCircle, 
  ShieldAlert, 
  Search, 
  CheckCircle,
  Eye,
  EyeOff,
  Layers,
  X,
  Camera,
  Upload,
  Image as ImageIcon,
  Check
} from 'lucide-react';

interface DraftVariant {
  sku: string;
  color: string;
  colorHex?: string;
  ramGb: number;
  romGb: number;
  connectionType: string;
  listPrice: number;
  salePrice: number;
  initialStock: number;
  isActive: boolean;
}

export const PortalProductsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'categories' | 'brands'>('products');

  const [products, setProducts] = useState<Product[]>(sharedStore.getProducts());
  const [brands, setBrands] = useState<Brand[]>(sharedStore.getBrands());
  const [categories, setCategories] = useState([
    { id: 1, name: 'Điện thoại', count: 10, isVisible: true },
    { id: 2, name: 'Máy tính bảng', count: 1, isVisible: true },
    { id: 3, name: 'Phụ kiện', count: 1, isVisible: true },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Modal Thêm sản phẩm mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newBrand, setNewBrand] = useState('Apple');
  const [newCategory, setNewCategory] = useState('Điện thoại');
  const [newWarranty, setNewWarranty] = useState('Bảo hành 12 tháng chính hãng. 1 đổi 1 trong 30 ngày nếu lỗi NSX.');
  const [newThumbnail, setNewThumbnail] = useState('https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg');

  // Thư viện ảnh (Product_Images)
  const [newGallery, setNewGallery] = useState<string[]>([
    'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg'
  ]);

  // Thông số kỹ thuật (Product_Specs)
  const [newSpecGroups, setNewSpecGroups] = useState<ProductSpecGroup[]>([
    {
      groupName: 'Màn hình',
      items: [
        { name: 'Công nghệ màn hình', value: 'OLED Super Retina XDR' },
        { name: 'Kích thước màn hình', value: '6.7 inch' }
      ]
    },
    {
      groupName: 'Cấu hình & Bộ nhớ',
      items: [
        { name: 'Hệ điều hành', value: 'iOS' },
        { name: 'Chip xử lý (CPU)', value: 'Apple A17 Pro 6 nhân' }
      ]
    }
  ]);

  // Danh sách biến thể SKU (Product_Variants)
  const [draftVariants, setDraftVariants] = useState<DraftVariant[]>([
    {
      sku: '',
      color: 'Titan Tự Nhiên',
      colorHex: '#C5BDB5',
      ramGb: 8,
      romGb: 256,
      connectionType: '5G',
      listPrice: 28000000,
      salePrice: 25990000,
      initialStock: 15,
      isActive: true
    }
  ]);

  const handleAddDraftVariant = () => {
    setDraftVariants([...draftVariants,
      {
        sku: '',
        color: 'Đen',
        colorHex: '#000000',
        ramGb: 8,
        romGb: 256,
        connectionType: '5G',
        listPrice: 28000000,
        salePrice: 25990000,
        initialStock: 10,
        isActive: true
      }
    ]);
  };

  const handleUpdateDraftVariant = (idx: number, field: keyof DraftVariant, val: any) => {
    const updated = [...draftVariants];
    updated[idx] = {...updated[idx], [field]: val };
    setDraftVariants(updated);
  };

  const handleRemoveDraftVariant = (idx: number) => {
    if (draftVariants.length <= 1) {
      alert('Sản phẩm phải có ít nhất một biến thể SKU!');
      return;
    }
    setDraftVariants(draftVariants.filter((_, i) => i!== idx));
  };

  // Modal Chỉnh sửa Sản phẩm & Thư viện ảnh đã thêm
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('');
  const [editProdBrand, setEditProdBrand] = useState('');
  const [editProdThumbnail, setEditProdThumbnail] = useState('');
  const [editProdGallery, setEditProdGallery] = useState<string[]>([]);
  const [editProdDescription, setEditProdDescription] = useState('');

  // Modal Chỉnh sửa Biến thể SKU đã thêm (Ảnh, Giá, Thuộc tính)
  const [editingVariant, setEditingVariant] = useState<{ prodId: number; variant: ProductVariant } | null>(null);
  const [editVariantImage, setEditVariantImage] = useState('');
  const [editVariantColor, setEditVariantColor] = useState('');
  const [editVariantColorHex, setEditVariantColorHex] = useState('#000000');
  const [editSalePrice, setEditSalePrice] = useState(0);
  const [editListPrice, setEditListPrice] = useState(0);
  const [editVariantActive, setEditVariantActive] = useState(true);

  useEffect(() => {
    const fetchLiveCategories = async () => {
      try {
        const res = await categoryService.getCategories(true);
        if (res.data && Array.isArray(res.data)) {
          const list: Array<{ id: number; name: string; count: number; isVisible: boolean }> = [];
          const traverse = (nodes: any[]) => {
            for (const n of nodes) {
              list.push({
                id: n.categoryId,
                name: n.name,
                count: n.productCount || 0,
                isVisible: n.isVisible,
              });
              if (n.children && n.children.length > 0) {
                traverse(n.children);
              }
            }
          };
          traverse(res.data);
          if (list.length > 0) {
            setCategories(list);
            setNewCategory(prev => (list.some(c => c.name === prev) ? prev : list[0].name));
          }
        }
      } catch {
        const localCats = sharedStore.getCategories();
        if (localCats.length > 0) {
          setCategories(localCats.map(c => ({ id: c.categoryId, name: c.name, count: c.productCount || 0, isVisible: c.isVisible })));
        }
      }
    };

    fetchLiveCategories();

    const unsubscribe = sharedStore.subscribe(() => {
      setProducts([...sharedStore.getProducts()]);
      const localCats = sharedStore.getCategories();
      if (localCats.length > 0) {
        setCategories(localCats.map(c => ({ id: c.categoryId, name: c.name, count: c.productCount || 0, isVisible: c.isVisible })));
      }
    });
    return () => unsubscribe();
  }, []);

  // Xóa danh mục với kiểm tra ràng buộc toàn vẹn dữ liệu
  const handleDeleteCategory = (catName: string) => {
    const hasProducts = (products || []).some(p => p && (p.categoryName || '').toLowerCase() === (catName || '').toLowerCase());
    if (hasProducts) {
      alert(`RÀNG BUỘC TOÀN VẸN: Không thể xóa danh mục "${catName}" vì đang có sản phẩm liên kết! Vui lòng di chuyển hoặc xóa các sản phẩm trực thuộc trước.`);
      return;
    }
    setCategories(categories.filter(c => c.name !== catName));
    alert(`Đã xóa danh mục "${catName}".`);
  };

  // Xóa thương hiệu với kiểm tra ràng buộc
  const handleDeleteBrand = (brandName: string) => {
    const hasProducts = (products || []).some(p => p && (p.brandName || '').toLowerCase() === (brandName || '').toLowerCase());
    if (hasProducts) {
      alert(`RÀNG BUỘC TOÀN VẸN: Không thể xóa thương hiệu "${brandName}" vì đang có sản phẩm kinh doanh thuộc thương hiệu này!`);
      return;
    }
    setBrands(brands.filter(b => b.name !== brandName));
    alert(`Đã xóa thương hiệu "${brandName}".`);
  };

  // Tạo sản phẩm mới kèm danh sách biến thể SKU
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }

    const skus = draftVariants.map(v => v.sku.trim().toUpperCase());
    if (skus.some(s =>!s)) {
      alert('Vui lòng nhập đầy đủ mã SKU cho tất cả các biến thể!');
      return;
    }
    if (new Set(skus).size!== skus.length) {
      alert('Các mã SKU biến thể trong cùng một sản phẩm không được trùng nhau!');
      return;
    }

    const newProdId = Date.now();

    const createdVariants: ProductVariant[] = draftVariants.map((dv, idx) => ({
      variantId: newProdId + idx + 1,
      productId: newProdId,
      sku: dv.sku.trim().toUpperCase(),
      color: dv.color,
      colorHex: dv.colorHex || '#000000',
      ramGb: dv.ramGb,
      romGb: dv.romGb,
      connectionType: dv.connectionType,
      listPrice: dv.listPrice,
      salePrice: dv.salePrice,
      onHandQty: dv.initialStock,
      reservedQty: 0,
      availableQty: dv.initialStock,
      imageUrl: newThumbnail,
      isActive: dv.isActive
    }));

    const newProd: Product = {
      productId: newProdId,
      name: newProdName.trim(),
      brandName: newBrand,
      categoryName: newCategory,
      isInstallment0: true,
      warrantyPolicy: newWarranty,
      thumbnail: newThumbnail,
      gallery: newGallery.length > 0? newGallery: [newThumbnail],
      variants: createdVariants,
      rating: 5.0,
      reviewCount: 0,
      specGroups: newSpecGroups,
      highlights: ['Thiết kế sang trọng, hiệu năng vượt trội', 'Bảo hành chính hãng 12 tháng']
    };

    // Thêm bản ghi tồn kho cho từng biến thể
    const currentInventories = sharedStore.getInventories();
    const newInventoryRecords = createdVariants.map(v => ({
      variantId: v.variantId,
      productId: newProdId,
      productName: newProdName.trim(),
      sku: v.sku,
      color: v.color,
      romGb: v.romGb,
      onHandQty: v.onHandQty,
      reservedQty: 0,
      availableQty: v.availableQty,
      minThreshold: 5,
      status: 'IN_STOCK' as const
    }));
    const updatedInv = [...newInventoryRecords, ...currentInventories];
    localStorage.setItem('np_inventory_v2', JSON.stringify(updatedInv));

    sharedStore.addProduct(newProd);

    sharedStore.addAuditLog({
      performedBy: 'Nguyễn Thế Minh (Admin)',
      action: 'CREATE_PRODUCT',
      entityName: 'Products',
      entityId: String(newProdId),
      oldValue: 'None',
      newValue: `Thêm sản phẩm "${newProdName}" với ${createdVariants.length} biến thể SKU (Tổng tồn: ${createdVariants.reduce((s, v) => s + v.onHandQty, 0)} máy)`
    });

    setProducts([...sharedStore.getProducts()]);
    setShowAddModal(false);
    setNewProdName('');
    alert(`Đã thêm sản phẩm "${newProd.name}" với ${createdVariants.length} biến thể SKU thành công!`);
  };

  const handleDeleteProduct = (p: Product) => {
    if (!p) return;
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}" (ID: ${p.productId})? Thao tác này sẽ xóa toàn bộ các biến thể SKU và tồn kho liên quan.`)) {
      sharedStore.deleteProduct(p.productId);
      sharedStore.addAuditLog({
        performedBy: 'Nguyễn Thế Minh (Admin)',
        action: 'DELETE_PRODUCT',
        entityName: 'Products',
        entityId: String(p.productId),
        oldValue: p.name,
        newValue: 'DELETED'
      });
      setProducts([...sharedStore.getProducts()]);
      alert(`Đã xóa sản phẩm "${p.name}" thành công!`);
    }
  };

  // ================= QUẢN LÝ CHỈNH SỬA SẢN PHẨM & ẢNH ĐÃ THÊM =================
  const handleOpenEditProduct = (p: Product) => {
    if (!p) return;
    setEditingProduct(p);
    setEditProdName(p.name || '');
    setEditProdCategory(p.categoryName || '');
    setEditProdBrand(p.brandName || '');
    setEditProdThumbnail(p.thumbnail || '');
    setEditProdGallery(Array.isArray(p.gallery) && p.gallery.length > 0 ? [...p.gallery] : [p.thumbnail || '']);
    setEditProdDescription(p.warrantyPolicy || '');
  };

  const handleProductThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setEditProdThumbnail(base64Url);
        if (!editProdGallery.includes(base64Url)) {
          setEditProdGallery(prev => [base64Url,...prev]);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProductEdit = () => {
    if (!editingProduct) return;
    if (!editProdName.trim()) {
      alert('Tên sản phẩm không được để trống!');
      return;
    }
    if (!editProdThumbnail.trim()) {
      alert('Vui lòng chọn hoặc thêm ảnh đại diện cho sản phẩm!');
      return;
    }

    const finalGallery = editProdGallery.length > 0? editProdGallery: [editProdThumbnail.trim()];
    const ok = sharedStore.updateProduct(editingProduct.productId, {
      name: editProdName.trim(),
      categoryName: editProdCategory,
      brandName: editProdBrand,
      thumbnail: editProdThumbnail.trim(),
      gallery: finalGallery,
      warrantyPolicy: editProdDescription
    });

    if (ok) {
      sharedStore.addAuditLog({
        performedBy: 'Nguyễn Thế Minh (Admin)',
        action: 'UPDATE_PRODUCT_MEDIA',
        entityName: 'Products',
        entityId: String(editingProduct.productId),
        oldValue: `Ảnh đại diện cũ`,
        newValue: `Cập nhật ảnh đại diện và ${finalGallery.length} ảnh thư viện cho sản phẩm "${editProdName}"`
      });

      setProducts([...sharedStore.getProducts()]);
      alert(`Đã cập nhật ảnh và thông tin cho sản phẩm "${editProdName}" thành công!`);
      setEditingProduct(null);
    }
  };

  // ================= QUẢN LÝ CHỈNH SỬA BIẾN THỂ & ẢNH BIẾN THỂ ĐÃ THÊM =================
  const handleOpenEditVariant = (prodId: number, v: ProductVariant) => {
    if (!v) return;
    const validPrice = (v.salePrice && v.salePrice > 0) ? v.salePrice : (v.listPrice || 0);
    setEditingVariant({ prodId, variant: v });
    setEditVariantImage(v.imageUrl || '');
    setEditVariantColor(v.color || '');
    setEditVariantColorHex(v.colorHex || '#000000');
    setEditSalePrice(validPrice);
    setEditListPrice(v.listPrice || validPrice);
    setEditVariantActive(v.isActive !== false);
  };

  const handleVariantFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setEditVariantImage(base64Url);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveVariantEdit = () => {
    if (!editingVariant) return;
    if (editSalePrice <= 0) {
      alert('Giá bán biến thể phải lớn hơn 0 đồng!');
      return;
    }

    const currentProd = products.find(p => p.productId === editingVariant.prodId);
    const finalImage = editVariantImage.trim() || editingVariant.variant.imageUrl || currentProd?.thumbnail || '';

    const ok = sharedStore.updateVariant(editingVariant.prodId, editingVariant.variant.variantId, {
      imageUrl: finalImage,
      salePrice: editSalePrice,
      listPrice: editListPrice > 0? editListPrice: editSalePrice,
      color: editVariantColor.trim() || editingVariant.variant.color,
      colorHex: editVariantColorHex,
      isActive: editVariantActive
    });

    if (ok) {
      sharedStore.addAuditLog({
        performedBy: 'Nguyễn Thế Minh (Admin)',
        action: 'UPDATE_VARIANT_MEDIA_PRICE',
        entityName: 'ProductVariants',
        entityId: editingVariant.variant.sku,
        oldValue: `Ảnh: ${editingVariant.variant.imageUrl? 'Có': 'Chưa có'} | Giá: ${formatVND(editingVariant.variant.salePrice)}`,
        newValue: `Cập nhật ảnh biến thể và giá bán: ${formatVND(editSalePrice)}`
      });

      setProducts([...sharedStore.getProducts()]);
      alert(`Đã cập nhật ảnh và thông tin cho biến thể SKU ${editingVariant.variant.sku} thành công!`);
      setEditingVariant(null);
    }
  };

  // Phân trang sản phẩm
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Lọc sản phẩm an toàn chống null/undefined
  const filteredProducts = useMemo(() => {
    return (products || []).filter(p => {
      if (!p) return false;
      const name = (p.name || '').toLowerCase();
      const brand = (p.brandName || '').toLowerCase();
      const cat = (p.categoryName || '').toLowerCase();
      const search = (searchTerm || '').toLowerCase().trim();
      if (!search) return true;
      const matchName = name.includes(search);
      const matchBrand = brand.includes(search);
      const matchCat = cat.includes(search);
      const matchSku = Array.isArray(p.variants) && p.variants.some(v => v && (v.sku || '').toLowerCase().includes(search));
      return matchName || matchBrand || matchCat || matchSku;
    });
  }, [products, searchTerm]);

  // Dữ liệu sản phẩm hiển thị trên trang hiện tại
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Reset trang về 1 khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      
      {/* Page Header Clean SaaS Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Sản phẩm & Quản trị Danh mục SKU
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 font-mono">
              Quản lý Catalog
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị thông số kỹ thuật, cấu hình biến thể (Màu / Dung lượng ROM) và dải giá bán hiện hành.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Plus size={14} />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Modern Pills */}
      <div className="flex bg-slate-200/60 p-1 rounded-2xl text-xs font-bold text-slate-600 max-w-md shadow-inner">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'products'? 'bg-white text-slate-900 shadow-xs': 'hover:text-slate-900'
          }`}
        >
          <span>Sản phẩm & SKU</span>
          <span className="px-1.5 py-0.2 rounded-md font-mono text-[10px] bg-slate-100 text-slate-600">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'categories'? 'bg-white text-slate-900 shadow-xs': 'hover:text-slate-900'
          }`}
        >
          <span>Danh mục</span>
          <span className="px-1.5 py-0.2 rounded-md font-mono text-[10px] bg-slate-100 text-slate-600">
            {categories.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('brands')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'brands'? 'bg-white text-slate-900 shadow-xs': 'hover:text-slate-900'
          }`}
        >
          <span>Thương hiệu</span>
          <span className="px-1.5 py-0.2 rounded-md font-mono text-[10px] bg-slate-100 text-slate-600">
            {brands.length}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: QUẢN LÝ SẢN PHẨM & BIẾN THỂ */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-80 relative">
              <input
                type="text"
                placeholder="Tìm theo tên máy, hãng, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:bg-white focus:outline-none focus:border-blue-500 font-medium transition"
              />
              <Search size={14} className="text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Product and Variant Matrix Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Ảnh</th>
                    <th className="p-3.5">Tên sản phẩm</th>
                    <th className="p-3.5">Hãng & Danh mục</th>
                    <th className="p-3.5">Các biến thể SKU (Màu / ROM)</th>
                    <th className="p-3.5">Khoảng giá bán hiện hành</th>
                    <th className="p-3.5 text-center">Trạng thái</th>
                    <th className="p-3.5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map(p => {
                      if (!p) return null;
                      const variants = Array.isArray(p.variants) ? p.variants : [];
                      // Tính khoảng giá bán dựa trên toàn bộ các biến thể SKU hợp lệ
                      const variantPrices = variants
                        .map(v => (v && v.salePrice > 0 ? v.salePrice : (v?.listPrice || 0)))
                        .filter(pr => pr > 0);
                      const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
                      const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : 0;
                      const isRange = minPrice > 0 && maxPrice > minPrice;

                      return (
                        <tr key={p.productId} className="hover:bg-slate-50">
                          <td className="p-3.5 w-16">
                            <div 
                              onClick={() => handleOpenEditProduct(p)}
                              className="relative w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden group cursor-pointer shadow-xs"
                              title="Bấm để đổi ảnh sản phẩm & thư viện ảnh"
                            >
                              <img 
                                src={p.thumbnail || 'https://placehold.co/100x100/f8fafc/64748b?text=Device'} 
                                alt={p.name || 'Sản phẩm'} 
                                className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f8fafc/64748b?text=Device';
                                }}
                              />
                              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                <Camera size={14} />
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <strong className="text-slate-900 block text-xs">{p.name}</strong>
                            <span className="text-[11px] text-slate-400">Đã bán {p.soldCount || 0} máy</span>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-slate-700 block">{p.brandName || 'Chưa phân loại'}</span>
                            <span className="text-[11px] text-slate-400">{p.categoryName || 'Chưa phân loại'}</span>
                          </td>

                          {/* Danh sách biến thể SKU với ảnh riêng và giá chuẩn của từng biến thể */}
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1.5 max-w-sm">
                              {variants.length === 0 ? (
                                <span className="text-slate-400 text-[11px] italic">Chưa có biến thể</span>
                              ) : (
                                variants.map(v => {
                                  if (!v) return null;
                                  const displayPrice = v.salePrice > 0 ? v.salePrice : (v.listPrice || minPrice || 29490000);

                                  return (
                                    <button
                                      key={v.sku || Math.random()} 
                                      onClick={() => handleOpenEditVariant(p.productId, v)}
                                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-[10px] text-slate-700 text-left transition flex items-center gap-1.5"
                                      title="Bấm để chỉnh sửa ảnh & giá cho biến thể SKU này"
                                    >
                                      <div className="w-5 h-5 rounded bg-white border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {v.imageUrl ? (
                                          <img src={v.imageUrl} alt="" className="w-full h-full object-contain" />
                                        ) : (
                                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.colorHex || '#94a3b8' }} />
                                        )}
                                      </div>
                                      <div>
                                        <strong className="block text-slate-900 font-mono">{v.sku}</strong>
                                        <span>{v.color} • {(v.romGb || 0) >= 1024 ? '1TB' : `${v.romGb || 0}GB`} ({formatVND(displayPrice)})</span>
                                      </div>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </td>

                          {/* Khoảng giá bán hiện hành của sản phẩm */}
                          <td className="p-3.5 whitespace-nowrap">
                            {isRange ? (
                              <div>
                                <div className="font-bold text-ink-deep text-xs">
                                  {formatVND(minPrice)} – {formatVND(maxPrice)}
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                  (Tùy phiên bản ROM)
                                </span>
                              </div>
                            ) : (
                              <strong className="font-bold text-ink-deep text-xs">
                                {formatVND(minPrice)}
                              </strong>
                            )}
                          </td>

                          <td className="p-3.5 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ĐANG KINH DOANH
                            </span>
                          </td>

                          <td className="p-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => handleOpenEditProduct(p)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition border border-slate-200"
                                title="Chỉnh sửa ảnh đại diện, thư viện ảnh & thông tin sản phẩm"
                              >
                                <ImageIcon size={13} className="text-blue-600" />
                                <span>Sửa ảnh & SP</span>
                              </button>

                              <button 
                                onClick={() => {
                                  if (variants.length > 0 && variants[0]) {
                                    handleOpenEditVariant(p.productId, variants[0]);
                                  } else {
                                    alert('Sản phẩm này chưa có biến thể SKU nào!');
                                  }
                                }}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                title="Sửa ảnh & giá các biến thể SKU"
                              >
                                <Tag size={14} />
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Xóa sản phẩm"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang danh sách sản phẩm */}
            <PortalPagination
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[5, 8, 12, 20]}
            />
          </div>

        </div>
      )}

      {/* SUB-TAB 2: QUẢN LÝ DANH MỤC */}
      {activeSubTab === 'categories' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Danh mục sản phẩm phân cấp
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ràng buộc toàn vẹn: Không cho phép xóa danh mục nếu đang có sản phẩm liên kết
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {categories.map(c => {
              const currentCount = (products || []).filter(p => p && (p.categoryName || '').toLowerCase() === (c.name || '').toLowerCase()).length;

              return (
                <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-900 block text-sm">{c.name}</strong>
                    <span className="text-slate-400 text-[11px]">Đang có <strong>{currentCount}</strong> sản phẩm trực thuộc</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteCategory(c.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition"
                      title="Xóa danh mục"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: QUẢN LÝ THƯƠNG HIỆU */}
      {activeSubTab === 'brands' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Thương hiệu sản phẩm
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiểm soát ràng buộc toàn vẹn khi ẩn hoặc xóa thương hiệu đang kinh doanh
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {brands.map(b => {
              const prodCount = (products || []).filter(p => p && (p.brandName || '').toLowerCase() === (b.name || '').toLowerCase()).length;

              return (
                <div key={b.brandId} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block text-xs">{b.name}</strong>
                    <span className="text-[10px] text-slate-400">{prodCount} sản phẩm</span>
                  </div>

                  <button
                    onClick={() => handleDeleteBrand(b.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Xóa thương hiệu"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL THÊM SẢN PHẨM MỚI KÈM ĐA BIẾN THỂ, ẢNH & THÔNG SỐ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink-deep/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-canvas border border-hairline-soft rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-xs max-h-[92vh] overflow-y-auto animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-hairline-soft">
              <div>
                <h3 className="text-base font-bold text-ink-deep uppercase tracking-tight flex items-center gap-2">
                  <Smartphone size={18} className="text-primary" />
                  <span>Khai báo Sản phẩm & Ma trận Biến thể SKU</span>
                </h3>
                <p className="text-xs text-steel mt-0.5">
                  Thiết lập thông tin chung, thư viện ảnh đa góc nhìn, cấu hình đa biến thể và thông số kỹ thuật
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-steel hover:text-ink rounded-lg hover:bg-surface-soft"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6">
              {/* 1. THÔNG TIN CƠ BẢN */}
              <div className="space-y-3 bg-surface-soft/40 p-4 rounded-xl border border-hairline-soft">
                <span className="font-bold text-ink-deep text-xs uppercase tracking-wider block">
                  1. Thông tin chung sản phẩm
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-charcoal mb-1">Tên sản phẩm / Model (*):</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: iPhone 16 Pro Max 5G..."
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full h-10 px-3 bg-canvas border border-hairline rounded-lg text-ink text-xs focus:border-2 focus:border-fb-blue focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">Thương hiệu (*):</label>
                    <select
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full h-10 px-3 bg-canvas border border-hairline rounded-lg text-ink text-xs focus:border-2 focus:border-fb-blue focus:outline-none"
                    >
                      {brands.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-charcoal mb-1">Danh mục sản phẩm (*):</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full h-10 px-3 bg-canvas border border-hairline rounded-lg text-ink text-xs focus:border-2 focus:border-fb-blue focus:outline-none"
                    >
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">Chính sách bảo hành:</label>
                    <input
                      type="text"
                      value={newWarranty}
                      onChange={(e) => setNewWarranty(e.target.value)}
                      className="w-full h-10 px-3 bg-canvas border border-hairline rounded-lg text-ink text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. QUẢN LÝ THƯ VIỆN ẢNH (Bảng Product_Images) */}
              <ProductImagesManager
                gallery={newGallery}
                thumbnail={newThumbnail}
                onChangeGallery={setNewGallery}
                onChangeThumbnail={setNewThumbnail}
              />

              {/* 3. QUẢN LÝ ĐA BIẾN THỂ SKU (Bảng Product_Variants) */}
              <div className="space-y-3 bg-surface-soft/40 p-4 rounded-xl border border-hairline-soft">
                <div className="flex items-center justify-between pb-2 border-b border-hairline-soft">
                  <div>
                    <span className="font-bold text-ink-deep text-xs uppercase tracking-wider block">
                      3. Cấu hình các biến thể SKU (Product_Variants)
                    </span>
                    <span className="text-[11px] text-steel">
                      Mỗi dòng là một biến thể vật lý độc lập có SKU, màu sắc, RAM/ROM, kết nối và tồn kho riêng
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddDraftVariant}
                    className="btn-secondary py-1 px-3 text-[11px] font-bold rounded-full flex items-center gap-1 shadow-xs text-primary border-primary/30"
                  >
                    <Plus size={13} />
                    <span>Thêm biến thể SKU</span>
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {draftVariants.map((v, vIdx) => (
                    <div key={vIdx} className="p-3.5 bg-canvas border border-hairline-soft rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary font-mono text-xs">
                          Biến thể #{vIdx + 1}: {v.sku || '(Chưa có SKU)'}
                        </span>

                        {draftVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDraftVariant(vIdx)}
                            className="text-steel hover:text-critical p-1 transition"
                            title="Xóa biến thể này"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold text-steel block mb-0.5">Mã SKU (*):</label>
                          <input
                            type="text"
                            required
                            placeholder="IP16PM-256-NAT"
                            value={v.sku}
                            onChange={(e) => handleUpdateDraftVariant(vIdx, 'sku', e.target.value)}
                            className="w-full h-8 px-2 bg-surface-soft border border-hairline-soft rounded font-mono uppercase text-xs focus:bg-canvas"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-steel block mb-0.5">Màu sắc:</label>
                          <input
                            type="text"
                            required
                            placeholder="Titan Tự Nhiên..."
                            value={v.color}
                            onChange={(e) => handleUpdateDraftVariant(vIdx, 'color', e.target.value)}
                            className="w-full h-8 px-2 bg-canvas border border-hairline-soft rounded text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-steel block mb-0.5">RAM (GB):</label>
                          <input
                            type="number"
                            min={2}
                            value={v.ramGb}
                            onChange={(e) => handleUpdateDraftVariant(vIdx, 'ramGb', Number(e.target.value))}
                            className="w-full h-8 px-2 bg-canvas border border-hairline-soft rounded text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-steel block mb-0.5">ROM / Bộ nhớ (GB):</label>
                          <input
                            type="number"
                            min={16}
                            value={v.romGb}
                            onChange={(e) => handleUpdateDraftVariant(vIdx, 'romGb', Number(e.target.value))}
                            className="w-full h-8 px-2 bg-canvas border border-hairline-soft rounded text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-steel block mb-0.5">Kết nối (connection_type):</label>
                          <select
                            value={v.connectionType}
                            onChange={(e) => handleUpdateDraftVariant(vIdx, 'connectionType', e.target.value)}
                            className="w-full h-8 px-2 bg-canvas border border-hairline-soft rounded text-xs"
                          >
                            <option value="5G">5G + Wifi</option>
                            <option value="Wifi">Wifi Only</option>
                            <option value="LTE">4G / LTE</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-steel block mb-0.5">Giá niêm yết (VNĐ):</label>
                          <input
                            type="number"
                            step={100000}
                            value={v.listPrice}
                            onChange={(e) => handleUpdateDraftVariant(vIdx, 'listPrice', Number(e.target.value))}
                            className="w-full h-8 px-2 bg-canvas border border-hairline-soft rounded text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-steel block mb-0.5">Giá bán (sale_price):</label>
                          <input
                            type="number"
                            step={100000}
                            value={v.salePrice}
                            onChange={(e) => handleUpdateDraftVariant(vIdx, 'salePrice', Number(e.target.value))}
                            className="w-full h-8 px-2 bg-canvas border border-hairline-soft rounded text-xs font-mono font-bold text-primary"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-steel block mb-0.5">Tồn kho ban đầu:</label>
                          <input
                            type="number"
                            min={0}
                            value={v.initialStock}
                            onChange={(e) => handleUpdateDraftVariant(vIdx, 'initialStock', Number(e.target.value))}
                            className="w-full h-8 px-2 bg-canvas border border-hairline-soft rounded text-xs font-mono font-bold text-success"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. QUẢN LÝ THÔNG SỐ KỸ THUẬT (Bảng Product_Specs) */}
              <ProductSpecsEditor
                groups={newSpecGroups}
                onChange={setNewSpecGroups}
              />

              {/* Nút lưu */}
              <div className="flex gap-2.5 justify-end pt-4 border-t border-hairline-soft">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost px-5 py-2.5 font-bold rounded-full text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-marketing px-6 py-2.5 font-bold rounded-full shadow-xs text-xs"
                >
                  Lưu sản phẩm & Đưa vào kinh doanh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CHỈNH SỬA SẢN PHẨM & THƯ VIỆN ẢNH ĐÃ THÊM ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-xs max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                    Chỉnh sửa ảnh & thông tin sản phẩm
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Mã sản phẩm: #{editingProduct.productId}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* 1. ẢNH ĐẠI DIỆN CHÍNH (THUMBNAIL) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                    1. Ảnh đại diện sản phẩm (Thumbnail)
                  </span>
                  <span className="text-[10px] text-slate-500">Hiển thị ngoài trang chủ & danh mục</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white p-1 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                    {editProdThumbnail? (
                      <img 
                        src={editProdThumbnail} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f8fafc/64748b?text=Lỗi+ảnh';
                        }}
                      />
                    ): (
                      <ImageIcon size={24} className="text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="text-[11px] font-bold text-slate-700 block">Đường dẫn ảnh đại diện (URL):</label>
                    <input
                      type="url"
                      placeholder="Dán URL ảnh đại diện (https://...)..."
                      value={editProdThumbnail}
                      onChange={(e) => setEditProdThumbnail(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-blue-600 font-mono"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <label className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition">
                        <Upload size={13} className="text-blue-600" />
                        <span>Tải ảnh từ máy</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductThumbnailUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-slate-400 italic">Hỗ trợ PNG, JPG, WEBP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. QUẢN LÝ THƯ VIỆN ẢNH SẢN PHẨM (PRODUCT_IMAGES) */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                  2. Thư viện ảnh sản phẩm (Product_Images)
                </span>
                <ProductImagesManager
                  gallery={editProdGallery}
                  thumbnail={editProdThumbnail}
                  onChangeGallery={setEditProdGallery}
                  onChangeThumbnail={setEditProdThumbnail}
                />
              </div>

              {/* 3. THÔNG TIN CƠ BẢN CỦA SẢN PHẨM */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                  3. Thông tin sản phẩm
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Tên sản phẩm:</label>
                    <input
                      type="text"
                      value={editProdName}
                      onChange={(e) => setEditProdName(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Danh mục:</label>
                    <select
                      value={editProdCategory}
                      onChange={(e) => setEditProdCategory(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Thương hiệu:</label>
                    <select
                      value={editProdBrand}
                      onChange={(e) => setEditProdBrand(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    >
                      {brands.map(b => (
                        <option key={b.brandId} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Mô tả sản phẩm:</label>
                    <textarea
                      rows={2}
                      value={editProdDescription}
                      onChange={(e) => setEditProdDescription(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-600"
                      placeholder="Mô tả tóm tắt tính năng sản phẩm..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveProductEdit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
              >
                Lưu thay đổi sản phẩm & Ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CHỈNH SỬA BIẾN THỂ SKU (ẢNH & GIÁ) ĐÃ THÊM ================= */}
      {editingVariant && (() => {
        const currentProd = products.find(p => p.productId === editingVariant.prodId);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Tag size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                      Chỉnh sửa biến thể SKU & Ảnh
                    </h3>
                    <span className="text-[11px] font-mono text-indigo-600 font-bold">
                      SKU: {editingVariant.variant.sku}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingVariant(null)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {currentProd && Array.isArray(currentProd.variants) && currentProd.variants.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chuyển sang biến thể SKU khác của sản phẩm này:</label>
                  <select
                    value={editingVariant.variant.sku}
                    onChange={(e) => {
                      const selectedV = currentProd.variants?.find(v => v && v.sku === e.target.value);
                      if (selectedV) {
                        handleOpenEditVariant(currentProd.productId, selectedV);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-mono font-bold text-xs focus:outline-none focus:border-blue-600"
                  >
                    {currentProd.variants.map(v => (
                      <option key={v.sku} value={v.sku}>
                        {v.sku} — {v.color} {(v.romGb || 0) >= 1024? '1TB': `${v.romGb || 0}GB`} ({formatVND(v.salePrice > 0? v.salePrice: v.listPrice || 0)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 1. KHU VỰC CHỈNH SỬA ẢNH BIẾN THỂ */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                    1. Ảnh riêng của biến thể (Màu {editVariantColor || editingVariant.variant.color})
                  </span>
                  <span className="text-[10px] text-slate-500">Hiển thị khi khách bấm chọn màu này</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 rounded-xl border border-slate-300 bg-white p-1 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                    {editVariantImage? (
                      <img 
                        src={editVariantImage} 
                        alt="Variant preview" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f8fafc/64748b?text=Lỗi+ảnh';
                        }}
                      />
                    ): (
                      <ImageIcon size={20} className="text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      placeholder="Dán URL ảnh cho biến thể này..."
                      value={editVariantImage}
                      onChange={(e) => setEditVariantImage(e.target.value)}
                      className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-blue-600 font-mono"
                    />

                    <div className="flex items-center gap-2">
                      <label className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs transition">
                        <Upload size={12} className="text-indigo-600" />
                        <span>Tải từ máy</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleVariantFileUpload}
                          className="hidden"
                        />
                      </label>

                      {currentProd && currentProd.thumbnail && (
                        <button
                          type="button"
                          onClick={() => setEditVariantImage(currentProd.thumbnail)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-600 text-[11px] font-medium transition"
                          title="Sử dụng ảnh đại diện sản phẩm cha cho biến thể này"
                        >
                          Dùng ảnh SP chính
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chọn nhanh từ Thư viện ảnh của sản phẩm cha */}
                {currentProd && currentProd.gallery && currentProd.gallery.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase">
                      Chọn nhanh từ Thư viện ảnh sản phẩm:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {currentProd.gallery.map((imgUrl: string, i: number) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditVariantImage(imgUrl)}
                          className={`w-12 h-12 rounded-lg border-2 p-0.5 overflow-hidden flex-shrink-0 bg-white transition ${
                            editVariantImage === imgUrl? 'border-indigo-600 ring-2 ring-indigo-200': 'border-slate-200 hover:border-slate-400'
                          }`}
                          title="Nhấp để áp dụng ảnh này cho biến thể"
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. KHU VỰC THÔNG SỐ VÀ GIÁ BÁN */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                  2. Giá bán & Thuộc tính biến thể
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Màu sắc:</label>
                    <input
                      type="text"
                      value={editVariantColor}
                      onChange={(e) => setEditVariantColor(e.target.value)}
                      className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Mã màu HEX hiển thị:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editVariantColorHex}
                        onChange={(e) => setEditVariantColorHex(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={editVariantColorHex}
                        onChange={(e) => setEditVariantColorHex(e.target.value)}
                        className="flex-1 h-8 px-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Giá bán hiện hành (VNĐ):</label>
                    <input
                      type="number"
                      step={50000}
                      min={10000}
                      value={editSalePrice}
                      onChange={(e) => setEditSalePrice(parseInt(e.target.value, 10) || 0)}
                      className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-extrabold font-mono focus:outline-none focus:border-blue-600 text-blue-700"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Giá niêm yết gốc (VNĐ):</label>
                    <input
                      type="number"
                      step={50000}
                      min={10000}
                      value={editListPrice}
                      onChange={(e) => setEditListPrice(parseInt(e.target.value, 10) || 0)}
                      className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-600 text-xs font-bold font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Trạng thái kinh doanh biến thể này:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={editVariantActive}
                      onChange={(e) => setEditVariantActive(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                    />
                    <span>{editVariantActive? 'Đang mở bán': 'Tạm dừng bán'}</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingVariant(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveVariantEdit}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                >
                  Lưu thay đổi biến thể & Ảnh
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
