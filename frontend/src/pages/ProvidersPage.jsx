import { useState, useEffect, useCallback } from "react";
import { getProviders, createProvider, updateProvider, deleteProvider } from "../services/api";
import { Toast, useToast } from "../components/Toast";
import { ConfirmDialog } from "../components/ConfirmDialog";

const emptyForm = { name: "", address: "", phone: "", email: "", description: "", status: "active" };

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { toast, show, hide } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.name = search;
      const res = await getProviders(params);
      setProviders(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      show("Error loading providers", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(p) {
    setEditing(p._id);
    setForm({ name: p.name, address: p.address || "", phone: p.phone || "", email: p.email || "", description: p.description || "", status: p.status || "active" });
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!form.name) return show("Name is required", "error");
    try {
      if (editing) {
        await updateProvider(editing, form);
        show("Provider updated");
      } else {
        await createProvider(form);
        show("Provider created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      show(err.response?.data?.error?.message || "Error saving", "error");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProvider(id);
      show("Provider deleted");
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
          message="Delete this provider?"
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>Providers</h1>
        <button onClick={openCreate} style={primaryBtn}>+ New Provider</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search by name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={inputStyle}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>Loading...</p>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  {["Name", "Email", "Phone", "Address", "Status", "Actions"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>No providers found</td></tr>
                ) : providers.map(p => (
                  <tr key={p._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={tdStyle}>{p.name}</td>
                    <td style={tdStyle}>{p.email || "—"}</td>
                    <td style={tdStyle}>{p.phone || "—"}</td>
                    <td style={tdStyle}>{p.address || "—"}</td>
                    <td style={tdStyle}>
                      <span style={{
                        background: p.status === "active" ? "#dcfce7" : "#fee2e2",
                        color: p.status === "active" ? "#16a34a" : "#dc2626",
                        padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => openEdit(p)} style={editBtn}>Edit</button>
                      <button onClick={() => setConfirmId(p._id)} style={deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ margin: "0 0 20px", fontWeight: 700 }}>{editing ? "Edit Provider" : "New Provider"}</h2>
            {[
              { label: "Name *", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone", key: "phone", type: "text" },
              { label: "Address", key: "address", type: "text" },
              { label: "Description", key: "description", type: "text" },
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
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
