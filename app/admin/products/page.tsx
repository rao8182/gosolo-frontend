"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    orderItems: number;
  };
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  discountPercent: string;
  isActive: boolean;
};

const initialFormState: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  discountPercent: "0",
  isActive: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductForm>(initialFormState);
  const [submitting, setSubmitting] = useState(false);

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
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl,
      discountPercent: product.discountPercent.toString(),
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      imageUrl: formData.imageUrl,
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
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

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

      if (res.ok) {
        fetchProducts();
      } else {
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

  return (
    <main className="min-h-screen pt-32 px-6 bg-black text-white" data-testid="admin-products-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold" data-testid="admin-products-title">Product Management</h1>
            <p className="text-gray-500 mt-1">Add, edit, and manage your products</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span className="material-icons-round text-sm">receipt_long</span>
              Orders
            </Link>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors"
              data-testid="add-product-btn"
            >
              <span className="material-icons-round text-sm">add</span>
              Add Product
            </button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-2">
            <span className="material-icons-round">check_circle</span>
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-2">
            <span className="material-icons-round">error</span>
            {error}
            <button onClick={() => setError(null)} className="ml-auto hover:text-white">
              <span className="material-icons-round text-sm">close</span>
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-sm text-gray-400">Total Products</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold">{products.filter(p => p.isActive).length}</p>
            <p className="text-sm text-gray-400">Active</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold">{products.filter(p => p.stock === 0).length}</p>
            <p className="text-sm text-gray-400">Out of Stock</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-2xl font-bold">{products.filter(p => p.discountPercent > 0).length}</p>
            <p className="text-sm text-gray-400">On Discount</p>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-icons-round text-6xl text-gray-600 mb-4 block">inventory_2</span>
            <p className="text-gray-400 mb-4">No products yet</p>
            <button
              onClick={openAddModal}
              className="px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-orange-600 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Product</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Price</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Discount</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Stock</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Orders</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    data-testid={`product-row-${product.id}`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-contain rounded bg-white/5"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {product.discountPercent > 0 ? (
                        <div>
                          <p className="text-gray-500 line-through text-sm">₹{product.price}</p>
                          <p className="font-semibold text-green-400">
                            ₹{getDiscountedPrice(product.price, product.discountPercent)}
                          </p>
                        </div>
                      ) : (
                        <p className="font-semibold">₹{product.price}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {product.discountPercent > 0 ? (
                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-sm font-medium">
                          {product.discountPercent}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuickStockUpdate(product, Math.max(0, product.stock - 1))}
                          className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center"
                          disabled={product.stock === 0}
                        >
                          -
                        </button>
                        <span className={`font-mono min-w-[40px] text-center ${product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-yellow-400' : ''}`}>
                          {product.stock}
                        </span>
                        <button
                          onClick={() => handleQuickStockUpdate(product, product.stock + 1)}
                          className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        product.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-400">{product._count?.orderItems || 0}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded hover:bg-white/10 transition-colors"
                          title="Edit"
                          data-testid={`edit-product-${product.id}`}
                        >
                          <span className="material-icons-round text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete"
                          data-testid={`delete-product-${product.id}`}
                        >
                          <span className="material-icons-round text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" data-testid="product-modal">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                >
                  <span className="material-icons-round">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                    required
                    data-testid="product-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none min-h-[80px]"
                    required
                    data-testid="product-description-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                      min="1"
                      required
                      data-testid="product-price-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                      min="0"
                      required
                      data-testid="product-stock-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Image URL *</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                    required
                    data-testid="product-image-input"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2 p-2 rounded bg-white/5">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-20 h-20 object-contain mx-auto"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                    min="0"
                    max="100"
                    data-testid="product-discount-input"
                  />
                  {parseInt(formData.discountPercent) > 0 && formData.price && (
                    <p className="text-sm text-green-400 mt-1">
                      Final price: ₹{getDiscountedPrice(parseFloat(formData.price), parseInt(formData.discountPercent))}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded"
                    data-testid="product-active-checkbox"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-400">Product is active (visible in shop)</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                    data-testid="save-product-btn"
                  >
                    {submitting ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}
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
