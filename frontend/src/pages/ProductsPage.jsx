import { useState, useEffect, useCallback } from "react";
import {
  getProducts, getProviders, createProduct,
  updateProduct, deleteProduct
} from "../services/api";
import { Toast, useToast } from "../components/Toast";
import { ConfirmDialog } from "../components/ConfirmDialog";

const emptyForm = { name: "", price: "", description: "", category: "", stock_quantity: "", provider_id: "" };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const { toast, show, hide } = useToast();

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.name = search;
      if (sortField) params.sort = sortField;
      const res = await getProducts(params);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      show("Error loading products", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, sortField]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    getProviders({ limit: 100 }).then(r => setProviders(r.data.data)).catch(() => {});
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(p) {
    setEditing(p._id);
    setForm({
      name: p.name,
      price: p.price,
      description: p.description || "",
      category: p.category || "",
      stock_quantity: p.stock_quantity ?? "",
      provider_id: p.provider_id?._id || p.provider_id || "",
    });
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.name || form.price === "") return show("Name and price are required", "error");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock_quantity: form.stock_quantity !== "" ? Number(form.stock_quantity) : undefined,
        provider_id: form.provider_id || undefined,
      };
      if (editing) {
        await updateProduct(editing, payload);
        show("Product updated");
      } else {
        await createProduct(payload);
        show("Product created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      show(err.response?.data?.error?.message || "Error saving", "error");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      show("Product deleted");
      setConfirmId(null);
      load();
    } catch {
      show("Error deleting", "error");
    }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
      {confirmId && (
        <ConfirmDialog
          message="Delete this product?"
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>Products</h1>
        <button onClick={openCreate} style={primaryBtn}>+ New Product</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          placeholder="Search by name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={inputStyle}
        />
        <select value={sortField} onChange={e => setSortField(e.target.value)} style={inputStyle}>
          <option value="">Sort by...</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
          <option value="price">Price ↑</option>
          <option value="-price">Price ↓</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>Loading...</p>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  {["Name", "Price", "Category", "Stock", "Provider", "Actions"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>No products found</td></tr>
                ) : products.map(p => (
                  <tr key={p._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={tdStyle}>{p.name}</td>
                    <td style={tdStyle}>${Number(p.price).toFixed(2)}</td>
                    <td style={tdStyle}>{p.category || "—"}</td>
                    <td style={tdStyle}>{p.stock_quantity ?? "—"}</td>
                    <td style={tdStyle}>{p.provider_id?.name || "—"}</td>
                    <td style={tdStyle}>
                      <button onClick={() => openEdit(p)} style={editBtn}>Edit</button>
                      <button onClick={() => setConfirmId(p._id)} style={deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "20px" }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={pageBtn}>‹ Prev</button>
              <span style={{ padding: "8px 16px", color: "#374151" }}>
                Page {pagination.page} of {pagination.total_pages}
              </span>
              <button disabled={page === pagination.total_pages} onClick={() => setPage(p => p + 1)} style={pageBtn}>Next ›</button>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ margin: "0 0 20px", fontWeight: 700 }}>{editing ? "Edit Product" : "New Product"}</h2>
            {[
              { label: "Name *", key: "name", type: "text" },
              { label: "Price *", key: "price", type: "number" },
              { label: "Description", key: "description", type: "text" },
              { label: "Stock Quantity", key: "stock_quantity", type: "number" },
            ].map(({ label, key, type }) => (
              <div key={key} style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                />
              </div>
            ))}
            <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
            >
              <option value="">No category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Books">Books</option>
              <option value="Toys">Toys</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Automotive">Automotive</option>
              <option value="Other">Other</option>
            </select>
          </div>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Provider</label>
              <select
                value={form.provider_id}
                onChange={e => setForm(f => ({ ...f, provider_id: e.target.value }))}
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
              >
                <option value="">No provider</option>
                {providers.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={cancelBtn}>Cancel</button>
              <button onClick={handleSubmit} style={primaryBtn}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const primaryBtn = { background: "#6366f1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 };
const cancelBtn = { background: "#e5e7eb", color: "#374151", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 };
const editBtn = { background: "#dbeafe", color: "#1d4ed8", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontWeight: 500 };
const deleteBtn = { background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: 500 };
const pageBtn = { background: "#f3f4f6", color: "#374151", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" };
const inputStyle = { padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" };
const labelStyle = { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" };
const thStyle = { padding: "12px 16px", fontWeight: 600, color: "#6b7280", fontSize: "13px", borderBottom: "2px solid #e5e7eb" };
const tdStyle = { padding: "12px 16px", color: "#111827" };
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalBox = { background: "#fff", borderRadius: "16px", padding: "32px", width: "480px", maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" };
