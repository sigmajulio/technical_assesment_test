export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998
    }}>
      <div style={{
        background: "#fff", borderRadius: "12px", padding: "28px",
        maxWidth: "380px", width: "90%", textAlign: "center"
      }}>
        <p style={{ marginBottom: "20px", fontSize: "16px" }}>{message}</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button onClick={onCancel} style={btnStyle("#6b7280")}>Cancel</button>
          <button onClick={onConfirm} style={btnStyle("#ef4444")}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function btnStyle(bg) {
  return {
    background: bg, color: "#fff", border: "none", padding: "10px 24px",
    borderRadius: "8px", cursor: "pointer", fontWeight: 600
  };
}
