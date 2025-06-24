// import React, { useEffect, useState } from "react"
// import { useEditor } from "@layerhub-io/react"
// import { Block } from "baseui/block"
// import Scrollable from "~/components/Scrollable"
// import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
// import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
// import { parsePSDToLayerhubObjects } from "~/utils/psd-parser"
// import { toBase64 } from "~/utils/data"
// import ApiService from "../../../../../../src/services/api"

// const Templates = () => {
//   const editor = useEditor()
//   const setIsSidebarOpen = useSetIsSidebarOpen()
//   const [loading, setLoading] = useState(false)
//   const [uploadedTemplates, setUploadedTemplates] = useState<any[]>([])
//   const [defaultTemplates, setDefaultTemplates] = useState<any[]>([])

//   useEffect(() => {
//     const loadTemplates = async () => {
//       const urlParams = new URLSearchParams(window.location.search)
//       const encodedData = urlParams.get("data")
//       if (!encodedData) return

//       const decoded = atob(encodedData)
//       const parsed = new URLSearchParams(decoded)

//       const token = parsed.get("token") || ""
//       const productId = Number(parsed.get("productId")) || 0
//       const uploadedTemplateUrl = parsed.get("uploadedTemplateUrl") || ""
//       const uploadedTemplatePreviewUrl = parsed.get("uploadedTemplatePreviewUrl") || ""
//       const selectedTemplateId = parsed.get("selectedTemplateId") || ""

//       if (!token || !productId) return

//       setLoading(true)
//       const api = new ApiService(token)
//       const templates = await api.getCustomTemplateList(productId, token)

//       // const parsedTemplates = await Promise.all(
//       //   templates.map(async (template) => {
//       //     try {
//       //       const response = await fetch(template?.mediaUrl)
//       //       const blob = await response.blob()
//       //       const file = new File([blob], `${template.name}.psd`, { type: "image/vnd.adobe.photoshop" })
//       //       // const base64 = await toBase64(file)
//       //       // const layers = await parsePSDToLayerhubObjects(file)
//       //       const layers = await parsePSDToLayerhubObjects(file)
//       //       if (layers.length === 0) return null
//       //       // return {
//       //       //   id: Number(template.templateId),
//       //       //   src: base64,
//       //       //   preview: layers[0]?.src || base64,
//       //       //   type: "PSD",
//       //       //   file,
//       //       //   name: template.name,
//       //       // }
//       //       return {
//       //         id: Number(template.templateId),
//       //         preview: template.previewUrl,
//       //         type: "PSD",
//       //         file,
//       //         name: template.name,
//       //       }
//       //     } catch {
//       //       return null
//       //     }
//       //   })
//       // )


//       const parsedTemplates = await Promise.all(
//         templates.map(async (template) => {
//           try {
//             const response = await fetch(template?.mediaUrl)
//             const blob = await response.blob()
//             const file = new File([blob], `${template.name}.psd`, {
//               type: template.mediaType,
//             })
      
//             const layers = await parsePSDToLayerhubObjects(file)
      
//             if (layers.length === 0) return null
      
//             return {
//               id: Number(template.templateId),
//               preview: template.previewUrl,
//               type: "PSD",
//               file,
//               name: template.name,
//             }
//           } catch (err) {
//             console.error("Failed to load template:", err)
//             return null
//           }
//         })
//       )
      

//       const filtered = parsedTemplates.filter(Boolean)

//       // Select template if ID is matched
//       if (selectedTemplateId) {
//         const matched = filtered.filter((t) => Number(t.id) === Number(selectedTemplateId))
//         setUploadedTemplates(matched)
//         if (matched.length > 0) {
//           try {
//             await addToCanvas(matched[0])
//           } catch (err) {
//             console.error("Failed to add to canvas", err)
//           }
//         }
//       } else if (uploadedTemplateUrl && uploadedTemplatePreviewUrl) {
//         setUploadedTemplates([
//           {
//             id: "uploaded",
//             preview: uploadedTemplatePreviewUrl,
//             src: uploadedTemplateUrl,
//             type: "PSD",
//             file: null,
//             name: "Uploaded Template",
//           },
//         ])
//       }

//       setDefaultTemplates(filtered)
//       setLoading(false)
//     }

//     loadTemplates()
//   }, [])

//   // const addToCanvas = async (upload: any) => {
//   //   if (!editor) return
//   //   await editor.objects.clear()
//   //   const layers = await parsePSDToLayerhubObjects(upload.file)

//   //   for (const layer of layers) {
//   //     await editor.objects.add({
//   //       ...layer,
//   //       width: layer.width,
//   //       height: layer.height,
//   //     })
//   //   }

//   //   editor.frame.resize({ width: 7128, height: 2520 })
//   // }
//   const addToCanvas = async (upload: any) => {
//     if (!editor || !upload?.file) return
  
//     await editor.objects.clear()
  
//     const layers = await parsePSDToLayerhubObjects(upload.file)
  
//     for (const layer of layers) {
//       await editor.objects.add({
//         ...layer,
//         width: layer.width,
//         height: layer.height,
//       })
//     }
  
//     editor.frame.resize({ width: 7128, height: 2520 })
//   }
  
//   // const addToCanvas = async (upload: any) => {
//   //   if (!editor || !upload?.file) return

//   //   await editor.objects.clear()
//   //   const layers = await parsePSDToLayerhubObjects(upload.file)

//   //   for (const layer of layers) {
//   //     await editor.objects.add({
//   //       ...layer,
//   //       width: layer.width,
//   //       height: layer.height,
//   //     })
//   //   }

//   //   editor.frame.resize({ width: 7128, height: 2520 })
//   // }


//   return (
//     <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//       <Block
//         $style={{
//           display: "flex",
//           alignItems: "center",
//           fontWeight: 500,
//           justifyContent: "space-between",
//           padding: "1.5rem",
//         }}
//       >
//         <Block>Templates</Block>
//         <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
//           <AngleDoubleLeft size={18} />
//         </Block>
//       </Block>

//       <Scrollable>
//         <Block padding={"0 1.5rem"}>
//           <h4 style={{ marginTop: "2rem", fontWeight: 600 }}>Default Templates</h4>

//           {loading ? (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
//               <div className="spinner" />
//               <div style={{ marginTop: "1rem", fontSize: "16px", fontWeight: 500 }}>Loading Template...</div>
//               <style>
//                 {`
//                   .spinner {
//                     width: 30px;
//                     height: 30px;
//                     border: 4px solid #ccc;
//                     border-top: 4px solid #000;
//                     border-radius: 50%;
//                     animation: spin 1s linear infinite;
//                   }
//                   @keyframes spin {
//                     0% { transform: rotate(0deg); }
//                     100% { transform: rotate(360deg); }
//                   }
//                 `}
//               </style>
//             </div>
//           ) : (
//             <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr 1fr" }}>
//               {defaultTemplates.map((upload) => (
//                 <div
//                   key={upload.id}
//                   style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
//                   onClick={() => addToCanvas(upload)}
//                 >
//                   <div>
//                     <img
//                       width="100%"
//                       src={upload.preview || "/assets/no-preview.png"}
//                       alt="preview"
//                       style={{ borderRadius: 4, border: "2px dashed #aaa" }}
//                     />
//                     <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>{upload.name}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Block>
//       </Scrollable>
//     </Block>
//   )
// }

// export default Templates










import React, { useEffect, useState } from "react"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { parsePSDToLayerhubObjects } from "~/utils/psd-parser"
import ApiService from "../../../../../../src/services/api"
import Modal from "./ReviewTemplateModal"

const Templates = () => {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const [loading, setLoading] = useState(false)
  const [defaultTemplates, setDefaultTemplates] = useState<any[]>([])
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const addToCanvas = async (upload: any) => {
    if (!editor || !upload?.file) return
    await editor.objects.clear()
    const layers = await parsePSDToLayerhubObjects(upload.file)
    for (const layer of layers) {
      await editor.objects.add({ ...layer, width: layer.width, height: layer.height })
    }
    editor.frame.resize({ width: 7128, height: 2520 })
  }

  useEffect(() => {
    const loadTemplates = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const encodedData = urlParams.get("data")
      if (!encodedData) return

      const decoded = atob(encodedData)
      const parsed = new URLSearchParams(decoded)

      const token = parsed.get("token") || ""
      const productId = Number(parsed.get("productId")) || 0
      if (!token || !productId) return

      setLoading(true)
      const api = new ApiService(token)
      const templates = await api.getCustomTemplateList(productId, token)

      const parsedTemplates = await Promise.all(
        templates.map(async (template) => {
          try {
            const response = await fetch(template?.mediaUrl)
            const blob = await response.blob()
            const file = new File([blob], `${template.name}.psd`, { type: template.mediaType })
            const layers = await parsePSDToLayerhubObjects(file)
            if (layers.length === 0) return null
            return {
              id: Number(template.templateId),
              preview: template.previewUrl,
              type: "PSD",
              file,
              name: template.name,
            }
          } catch (err) {
            console.error("Failed to load template:", err)
            return null
          }
        })
      )

      setDefaultTemplates(parsedTemplates.filter(Boolean))
      setLoading(false)
    }

    loadTemplates()
  }, [])

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Templates</Block>
        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>

      <Scrollable>
        <Block padding="0 1.5rem">
          <h4 style={{ marginTop: "2rem", fontWeight: 600 }}>Default Templates</h4>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
              <div className="spinner" />
              <div style={{ marginTop: "1rem", fontSize: "16px", fontWeight: 500 }}>Loading Template...</div>
              <style>
                {`
                  .spinner {
                    width: 30px;
                    height: 30px;
                    border: 4px solid #ccc;
                    border-top: 4px solid #000;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                  }
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          ) : (
            <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr 1fr" }}>
              {defaultTemplates.map((upload) => (
                <div
                  key={upload.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    padding: "0.5rem",
                    background: "#fff",
                    cursor: "pointer"
                  }}
                  onClick={async () => {
                    await addToCanvas(upload)
                    setSelectedTemplate(upload)
                  }}
                >
                  <img
                    width="100%"
                    src={upload.preview || "/assets/no-preview.png"}
                    alt="preview"
                    style={{ borderRadius: 4, border: "2px dashed #aaa" }}
                  />
                  <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>{upload.name}</div>
                </div>
              ))}
            </div>
          )}
        </Block>
      </Scrollable>

      {/* Modal View */}
      {showPreviewModal && selectedTemplate && (
        <Modal onClose={() => setShowPreviewModal(false)}>
          <div style={{ flex: 1 }}>
            <img
              src={selectedTemplate.preview}
              alt="Selected Template"
              style={{ maxWidth: "100%", borderRadius: 6, border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3>Review Your Design</h3>
              <p>Zero design errors with Zero-cost Design Proofs</p>
              <p>Our team will verify the design placement and image resolution free of cost.</p>
            </div>
            <button
              onClick={async () => {
                await addToCanvas(selectedTemplate)
                setShowPreviewModal(false)
              }}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                fontWeight: 600,
                backgroundColor: "#333",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Edit Template
            </button>
          </div>
        </Modal>
      )}
    </Block>
  )
}

export default Templates
