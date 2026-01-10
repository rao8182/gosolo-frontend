"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  indications: string;
  benefits: string;
  price: number;
  discountPercent: number;
  stock: number;
  category: string;
  imageUrl: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  _count?: {
    orderItems: number;
  };
};

type ProductForm = {
  name: string;
  description: string;
  indications: string;
  benefits: string;
  price: string;
  stock: string;
  category: string;
  imageUrl: string;
  images: string[];
  discountPercent: string;
  isActive: boolean;
};

const CATEGORIES = ["Gummies", "Slim Shake", "Fat Burner"];

const initialFormState: ProductForm = {
  name: "",
  description: "",
  indications: "",
  benefits: "",
  price: "",
  stock: "",
  category: "Gummies",
  imageUrl: "",
  images: [],
  discountPercent: "0",
  isActive: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductForm>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        setError("Failed to load products");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      indications: product.indications || "",
      benefits: product.benefits || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || "Gummies",
      imageUrl: product.imageUrl,
      images: product.images || [],
      discountPercent: product.discountPercent.toString(),
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialFormState);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadingIndex(index);
    setError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (index === 0) {
          setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        } else {
          const newImages = [...formData.images];
          newImages[index - 1] = data.imageUrl;
          setFormData((prev) => ({ ...prev, images: newImages }));
        }
        setSuccessMessage("Image uploaded successfully");
        setTimeout(() => setSuccessMessage(null), 2000);
      } else {
        setError(data.error || "Failed to upload image");
      }
    } catch {
      setError("Network error. Failed to upload image.");
    } finally {
      setUploading(false);
      setUploadingIndex(null);
    }
  };

  const removeImage = (index: number) => {
    if (index === 0) {
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    } else {
      const newImages = formData.images.filter((_, i) => i !== index - 1);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      setError("Please upload at least one product image (main image required)");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    
    setSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name,
      description: formData.description,
      indications: formData.indications,
      benefits: formData.benefits,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      imageUrl: formData.imageUrl,
      images: formData.images.filter(Boolean),
      discountPercent: parseInt(formData.discountPercent) || 0,
      isActive: formData.isActive,
    };

    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      
      const res = await fetch(url, {
        method: editingProduct ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(editingProduct ? "Product updated successfully" : "Product created successfully");
        closeModal();
        fetchProducts();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.error || "Failed to save product");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message || "Product deleted successfully");
        fetchProducts();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.error || "Failed to delete product");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const handleQuickStockUpdate = async (product: Product, newStock: number) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });

      if (res.ok) fetchProducts();
      else {
        const data = await res.json();
        setError(data.error || "Failed to update stock");
      }
    } catch {
      setError("Network error");
    }
  };

  const getDiscountedPrice = (price: number, discountPercent: number) => {
    return Math.round(price * (1 - discountPercent / 100));
  };

  const allImages = [formData.imageUrl, ...formData.images].filter(Boolean);

  return (
    <main className="min-h-screen pt-24 sm:pt-32 px-4 sm:px-6 bg-black text-white" data-testid="admin-products-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Product Management</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Add, edit, and manage your products</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              <span className="material-icons-round text-sm">receipt_long</span>
              <span className="hidden sm:inline">Orders</span>
            </Link>
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              <span className="material-icons-round text-sm">settings</span>
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors text-sm"
              data-testid="add-product-btn"
            >
              <span className="material-icons-round text-sm">add</span>
              Add Product
            </button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-2 text-sm">
            <span className="material-icons-round">check_circle</span>
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-2 text-sm">
            <span className="material-icons-round">error</span>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="hover:text-white">
              <span className="material-icons-round text-sm">close</span>
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xl sm:text-2xl font-bold">{products.length}</p>
            <p className="text-xs sm:text-sm text-gray-400">Total Products</p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xl sm:text-2xl font-bold">{products.filter(p => p.isActive).length}</p>
            <p className="text-xs sm:text-sm text-gray-400">Active</p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xl sm:text-2xl font-bold">{products.filter(p => p.stock === 0).length}</p>
            <p className="text-xs sm:text-sm text-gray-400">Out of Stock</p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xl sm:text-2xl font-bold">{products.filter(p => p.discountPercent > 0).length}</p>
            <p className="text-xs sm:text-sm text-gray-400">On Discount</p>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-icons-round text-6xl text-gray-600 mb-4 block">inventory_2</span>
            <p className="text-gray-400 mb-4">No products yet</p>
            <button onClick={openAddModal} className="px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors">
              Add Your First Product
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Product</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Category</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Price</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Stock</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-contain rounded bg-white/5" />
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded bg-white/10 text-xs">{product.category}</span>
                      </td>
                      <td className="py-4 px-4">
                        {product.discountPercent > 0 ? (
                          <div>
                            <p className="text-gray-500 line-through text-sm">₹{product.price}</p>
                            <p className="font-semibold text-green-400">₹{getDiscountedPrice(product.price, product.discountPercent)}</p>
                            <span className="text-xs text-green-400">{product.discountPercent}% OFF</span>
                          </div>
                        ) : (
                          <p className="font-semibold">₹{product.price}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleQuickStockUpdate(product, Math.max(0, product.stock - 1))} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center" disabled={product.stock === 0}>-</button>
                          <span className={`font-mono min-w-[40px] text-center ${product.stock === 0 ? "text-red-400" : product.stock < 10 ? "text-yellow-400" : ""}`}>{product.stock}</span>
                          <button onClick={() => handleQuickStockUpdate(product, product.stock + 1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center">+</button>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(product)} className="p-2 rounded hover:bg-white/10 transition-colors" title="Edit">
                            <span className="material-icons-round text-sm">edit</span>
                          </button>
                          <button onClick={() => handleDelete(product)} className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors" title="Delete">
                            <span className="material-icons-round text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {products.map((product) => (
                <div key={product.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex gap-4">
                    <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-contain rounded bg-white/5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold truncate">{product.name}</p>
                          <span className="text-xs px-2 py-0.5 rounded bg-white/10 inline-block mt-1">{product.category}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        {product.discountPercent > 0 ? (
                          <div>
                            <span className="text-gray-500 line-through text-sm mr-2">₹{product.price}</span>
                            <span className="font-semibold text-green-400">₹{getDiscountedPrice(product.price, product.discountPercent)}</span>
                          </div>
                        ) : (
                          <span className="font-semibold">₹{product.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Stock:</span>
                      <button onClick={() => handleQuickStockUpdate(product, Math.max(0, product.stock - 1))} className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center">-</button>
                      <span className={`font-mono min-w-[40px] text-center ${product.stock === 0 ? "text-red-400" : product.stock < 10 ? "text-yellow-400" : ""}`}>{product.stock}</span>
                      <button onClick={() => handleQuickStockUpdate(product, product.stock + 1)} className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center">+</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(product)} className="p-2 rounded bg-white/10 hover:bg-white/20 transition-colors">
                        <span className="material-icons-round text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDelete(product)} className="p-2 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors">
                        <span className="material-icons-round text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1a1a1a]">
                <h2 className="text-lg sm:text-xl font-semibold">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                <button onClick={closeModal} className="p-2 rounded hover:bg-white/10 transition-colors">
                  <span className="material-icons-round">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                {/* Images Upload */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Product Images * (1 required, up to 4)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    {[0, 1, 2, 3].map((index) => {
                      const imageUrl = index === 0 ? formData.imageUrl : formData.images[index - 1];
                      return (
                        <div key={index} className="relative aspect-square rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                            <>
                              <img src={imageUrl} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 hover:bg-red-500 text-white">
                                <span className="material-icons-round text-xs">close</span>
                              </button>
                            </>
                          ) : (
                            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-400">
                              {uploading && uploadingIndex === index ? (
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <span className="material-icons-round text-2xl">{index === 0 ? "add_photo_alternate" : "add"}</span>
                                  <span className="text-xs mt-1">{index === 0 ? "Main*" : "Optional"}</span>
                                </>
                              )}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, index)} disabled={uploading} />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Product Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none" required />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none min-h-[80px]" required />
                </div>

                {/* Indications For Use */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Indications For Use</label>
                  <textarea 
                    value={formData.indications} 
                    onChange={(e) => setFormData({ ...formData, indications: e.target.value })} 
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none min-h-[80px]" 
                    placeholder="Enter each indication on a new line..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate each point with a new line</p>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Benefits</label>
                  <textarea 
                    value={formData.benefits} 
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} 
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none min-h-[80px]" 
                    placeholder="Enter each benefit on a new line..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate each point with a new line</p>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Price (₹) *</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none" min="1" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Stock *</label>
                    <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none" min="0" required />
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Discount (%)</label>
                  <input type="number" value={formData.discountPercent} onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none" min="0" max="100" />
                  {parseInt(formData.discountPercent) > 0 && formData.price && (
                    <p className="text-sm text-green-400 mt-1">Final price: ₹{getDiscountedPrice(parseFloat(formData.price), parseInt(formData.discountPercent))}</p>
                  )}
                </div>

                {/* Active */}
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded" />
                  <label htmlFor="isActive" className="text-sm text-gray-400">Product is active (visible in shop)</label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting || uploading || !formData.imageUrl} className="flex-1 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
