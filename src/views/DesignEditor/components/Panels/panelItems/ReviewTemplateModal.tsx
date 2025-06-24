// Modal.tsx
import React from "react"

interface ModalProps {
  onClose: () => void
  children: React.ReactNode
  width?: string
}

const Modal: React.FC<ModalProps> = ({ onClose, children, width = "900px" }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: 8,
          position: "relative",
          maxWidth: width,
          width: "90%",
          display: "flex",
          gap: "1.5rem",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
