import { useState, useEffect } from "react";

export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === "success" ? "#22c55e" : "#ef4444";

  return (
    <div style={{
      position: "fixed", bottom: "24px", right: "24px",
      background: bg, color: "#fff", padding: "12px 20px",
      borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      zIndex: 9999, fontWeight: 500
    }}>
      {message}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, type = "success") => setToast({ message, type });
  const hide = () => setToast(null);
  return { toast, show, hide };
}
