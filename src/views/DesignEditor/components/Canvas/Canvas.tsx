// import React from "react"
// import { Canvas as LayerhubCanvas } from "@layerhub-io/react"
// import Playback from "../Playback"
// import useDesignEditorContext from "~/hooks/useDesignEditorContext"
// import ContextMenu from "../ContextMenu"

// const Canvas = () => {
//   const { displayPlayback } = useDesignEditorContext()
//   return (
//     <div style={{ flex: 1, display: "flex", position: "relative" }}>
//       {displayPlayback && <Playback />}
//       <ContextMenu />
//       <LayerhubCanvas
//         config={{
//           background: "#f1f2f6",
//           controlsPosition: {
//             rotation: "BOTTOM",
//           },
//           shadow: {
//             blur: 4,
//             color: "#fcfcfc",
//             offsetX: 0,
//             offsetY: 0,
//           },
//         }}
//       />
//     </div>
//   )
// }

// export default Canvas
















// Canvas.tsx
import React from "react"
import { Canvas as LayerhubCanvas } from "@layerhub-io/react"
import Playback from "../Playback"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import ContextMenu from "../ContextMenu"
import ReviewModal from "../Panels/panelItems/ReviewTemplateModal"

const Canvas = () => {
  const { displayPlayback } = useDesignEditorContext()

  const [showContinue, setShowContinue] = React.useState(true)
  const [showModal, setShowModal] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<any>(null)

  const handleContinue = () => {
    const canvasThumbnail = document.querySelector('canvas')?.toDataURL() || "https://via.placeholder.com/300x200.png?text=No+Preview"
    setSelectedTemplate({
      preview: canvasThumbnail,
      name: "Generated from Canvas"
    })
    setShowModal(true)
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, position: "relative", display: "flex" }}>
        {displayPlayback && <Playback />}
        <ContextMenu />
        <LayerhubCanvas
          config={{
            background: "#f1f2f6",
            controlsPosition: {
              rotation: "BOTTOM",
            },
            shadow: {
              blur: 4,
              color: "#fcfcfc",
              offsetX: 0,
              offsetY: 0,
            },
          }}
        />
      </div>

      {/* Footer bar */}
      <div
        style={{
          height: "64px",
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 0px",
          background: "#ffffff",
          borderTop: "1px solid #e0e0e0",
          boxShadow: "0 -2px 6px rgba(0,0,0,0.04)",
        }}
      >
        {showContinue && (
          <button
            onClick={handleContinue}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "15px",
              fontWeight: 600,
              backgroundColor: "#ff7b00",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            Continue
          </button>
        )}
      </div>

      {showModal && selectedTemplate && (
        <ReviewModal onClose={() => setShowModal(false)} width="1000px">
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", justifyContent: "space-between" }}>
            {/* Left: Image + Edit Button */}
            <div style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <img
                src={selectedTemplate.preview}
                alt="Selected Template"
                style={{
                  maxWidth: "100%",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  maxHeight: "320px",
                  marginBottom: "1rem",
                }}
              />
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "14px",
                  fontWeight: 600,
                  backgroundColor: "#fff",
                  color: "#ff7b00",
                  border: "2px solid #ff7b00",
                  borderRadius: 6,
                  cursor: "pointer",
                  alignSelf: "center",
                }}
              >
                Edit Template
              </button>
            </div>

            {/* Right: Design Review Content + Proceed to Cart */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "20px", marginBottom: "0.5rem" }}>Review Your Design</h3>
                <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "0.5rem" }}>Collector Cards</p>
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600 }}>
                    🔍 Zero design errors with Zero-cost Design Proofs
                  </p>
                  <p style={{ fontSize: "13px", color: "#555" }}>
                    Once you place the order, our team will verify the design placement and image resolution free of cost.
                  </p>
                  <label style={{ display: "flex", alignItems: "center", marginTop: "0.75rem" }}>
                    <input type="checkbox" style={{ marginRight: "0.5rem" }} /> I want free design proof
                  </label>
                </div>
                <p style={{ fontSize: "12px", color: "#888", marginTop: "1rem" }}>
                  🤔 Not sure if your design is appealing enough?{" "}
                  <span style={{ color: "#ff7b00", fontWeight: 600, cursor: "pointer" }}>
                    Hire a Designer @ just £9.99
                  </span>
                </p>
              </div>

              <button
                style={{
                  marginTop: "5.3rem",
                  alignSelf: "flex-end",
                  padding: "0.75rem 1.5rem",
                  fontSize: "16px",
                  fontWeight: 600,
                  backgroundColor: "#ff7b00",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Proceed to Cart
              </button>
            </div>
          </div>
        </ReviewModal>
      )}
    </div>
  )
}

export default Canvas