"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminUser = {
  id: string;
  email: string;
  addedBy: string | null;
  createdAt: string;
};

export default function AdminSettingsPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [superAdminEmail, setSuperAdminEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      
      if (res.ok && data.success) {
        setAdminUsers(data.adminUsers || []);
        setSuperAdminEmail(data.superAdminEmail || "");
      } else {
        setError(data.error || "Failed to load admin users");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(data.message);
        setNewEmail("");
        fetchAdminUsers();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.error || "Failed to add admin");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to remove "${email}" from admins?`)) return;

    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(data.message);
        fetchAdminUsers();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.error || "Failed to remove admin");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen pt-24 sm:pt-32 px-4 sm:px-6 bg-black text-white" data-testid="admin-settings-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Admin Settings</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage admin access and permissions</p>
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
              href="/admin/products"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              <span className="material-icons-round text-sm">inventory_2</span>
              <span className="hidden sm:inline">Products</span>
            </Link>
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

        {/* Add Admin Form */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>
          <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:border-primary focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={submitting || !newEmail.trim()}
              className="px-6 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Adding..." : "Add Admin"}
            </button>
          </form>
        </div>

        {/* Super Admin Notice */}
        {superAdminEmail && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-purple-400">admin_panel_settings</span>
              <div>
                <p className="font-semibold text-purple-400">Super Admin</p>
                <p className="text-sm text-gray-400">{superAdminEmail} (cannot be removed)</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Users List */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold">Admin Users</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading admin users...</p>
            </div>
          ) : adminUsers.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-icons-round text-4xl text-gray-600 mb-2 block">group</span>
              <p className="text-gray-400">No additional admin users</p>
              <p className="text-sm text-gray-500 mt-1">Only the super admin has access</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {adminUsers.map((admin) => (
                <div key={admin.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{admin.email}</p>
                    <p className="text-xs text-gray-500">
                      Added by {admin.addedBy || "system"} on{" "}
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin(admin.email)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors flex-shrink-0"
                    title="Remove admin"
                  >
                    <span className="material-icons-round text-sm">person_remove</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
