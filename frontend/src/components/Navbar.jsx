import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const { pathname } = useLocation();

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: pathname.startsWith(path) ? "#6366f1" : "#374151",
    fontWeight: pathname.startsWith(path) ? 700 : 500,
    padding: "8px 16px",
    borderRadius: "8px",
    background: pathname.startsWith(path) ? "#eef2ff" : "transparent",
  });

  return (
    <nav style={{
      background: "#fff", borderBottom: "1px solid #e5e7eb",
      padding: "14px 32px", display: "flex", alignItems: "center", gap: "24px"
    }}>
      <span style={{ fontWeight: 800, fontSize: "18px", color: "#111" }}>
        🛒 Products Manager
      </span>
      <Link to="/products" style={linkStyle("/products")}>Products</Link>
      <Link to="/providers" style={linkStyle("/providers")}>Providers</Link>
    </nav>
  );
}
