// import React, { useEffect, useState } from "react"
// import { useEditor } from "@layerhub-io/react"
// import { Block } from "baseui/block"
// import Scrollable from "~/components/Scrollable"
// import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
// import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
// import useDesignEditorContext from "~/hooks/useDesignEditorContext"
// import { nanoid } from "nanoid"
// import { parsePSDToLayerhubObjects } from "~/utils/psd-parser"
// import { toBase64 } from "~/utils/data"
// import ApiService from "../../../../../../src/services/api"

// const BUILT_IN_PSD_LINKS = [
//   { name: "Shopping Bag Mockup", url: "/assets/templates/shopping-bag-mockup.psd" },
//   { name: "Template", url: "/assets/templates/template.psd" },
// ]

// const DEFAULT_IMAGE_POSITION = { x: 200, y: 200 }

// const Templates = () => {
//   const editor = useEditor()
//   const setIsSidebarOpen = useSetIsSidebarOpen()
//   const { currentScene } = useDesignEditorContext()
//   const [uploads, setUploads] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [apiTemplates, setApiTemplates] = useState<any[]>([])


//   useEffect(() => {
//     const loadFiles = async () => {
//       const newUploads: any[] = []
//       for (const { name, url } of BUILT_IN_PSD_LINKS) {
//         try {
//           const response = await fetch(url)
//           const blob = await response.blob()
//           const file = new File([blob], name, { type: "image/vnd.adobe.photoshop" })
//           const base64 = (await toBase64(file)) as string
//           const layers = await parsePSDToLayerhubObjects(file)

//           if (layers.length > 0) {
//             const upload = {
//               id: nanoid(),
//               src: base64,
//               preview: layers[0].src,
//               type: "PSD",
//               file,
//               name,
//             }
//             newUploads.push(upload)
//           }
//         } catch (err) {
//           console.error(`Failed to load PSD template: ${name}`, err)
//         }
//       }
//       setUploads(newUploads)
//       setLoading(false)
//     }

//     loadFiles()
//   }, [])

//   const addToCanvas = async (upload: any) => {
//     if (!editor) return

//     const canvasSize = { width: 7128, height: 2520 }

//     if (upload.type === "PSD") {
//       const layers = await parsePSDToLayerhubObjects(upload.file)
//       if (layers.length === 0) {
//         alert("No layers found in the PSD file.")
//         return
//       }

//       for (const layer of layers) {
//         await editor.objects.add({
//           ...layer,
//           width: layer.width,
//           height: layer.height,
//           name: layer.name || "Layer",
//         })
//       }

//       editor.frame.resize({ width: canvasSize.width, height: canvasSize.height })
//     }
//   }


//   useEffect(() => {
//     const loadCustomTemplates = async () => {
//       try {
//         const customTemplates = await ApiService.getCustomTemplateList()

//         const parsedUploads = await Promise.all(
//           customTemplates.map(async (template) => {
//             try {
//               const response = await fetch(template.mediaUrl)
//               const blob = await response.blob()
//               const file = new File([blob], `${template.name}.psd`, {
//                 type: "image/vnd.adobe.photoshop",
//               })

//               const base64 = (await toBase64(file)) as string
//               const layers = await parsePSDToLayerhubObjects(file)

//               if (layers.length === 0) return null

//               return {
//                 id: template.templateId || nanoid(),
//                 src: base64,
//                 preview: layers[0].src,
//                 type: "PSD",
//                 file,
//                 name: template.name,
//               }
//             } catch (err) {
//               console.error("Failed to parse custom template PSD:", template.name, err)
//               return null
//             }
//           })
//         )

//         // Filter out failed entries (null)
//         const validTemplates = parsedUploads.filter(Boolean)

//         setUploads((prev) => [...prev, ...validTemplates])
//       } catch (err) {
//         console.error("Failed to load custom templates", err)
//       }
//     }

//     loadCustomTemplates()
//   }, [])


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

//           {/* Custom API PSD Templates */}
//           <h4 style={{ marginTop: "2rem", fontWeight: 600 }}>Uploaded Templates Show Here</h4>
//           <div
//             style={{
//               marginTop: "1rem",
//               display: "grid",
//               gap: "0.5rem",
//               gridTemplateColumns: "1fr 1fr",
//             }}
//           >
//             {apiTemplates?.map((upload) => (
//               <div
//                 key={upload.id}
//                 style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
//                 onClick={() => addToCanvas(upload)}
//               >
//                 <div>
//                   <img
//                     width="100%"
//                     src={upload.preview || "/assets/no-preview.png"}
//                     alt="preview"
//                     style={{ borderRadius: 4, border: "2px dashed #aaa" }}
//                   />
//                   <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>
//                     {upload.name}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Block>
//       </Scrollable>
//     </Block>
//   )
// }

// export default Templates








// Template rendering (inside component)
import React, { useEffect, useState } from "react"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { nanoid } from "nanoid"
import { parsePSDToLayerhubObjects } from "~/utils/psd-parser"
import { toBase64 } from "~/utils/data"
import ApiService from "../../../../../../src/services/api"

const Templates = () => {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { currentScene } = useDesignEditorContext()
  const [uploadedTemplates, setUploadedTemplates] = useState<any[]>([])
  const [defaultTemplates, setDefaultTemplates] = useState<any[]>([])

  const [params, setParams] = useState({
    token: "",
    productId: 0,
    uploadedTemplateUrl: "",
    uploadedTemplatePreviewUrl: "",
    selectedTemplateId: "",
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get("data")
    if (encodedData) {
      const decoded = atob(encodedData)
      const parsed = new URLSearchParams(decoded)

      const token = parsed.get("token") || ""
      const productId = Number(parsed.get("productId")) || 0
      const uploadedTemplateUrl = parsed.get("uploadedTemplateUrl") || ""
      const uploadedTemplatePreviewUrl = parsed.get("uploadedTemplatePreviewUrl") || ""
      const selectedTemplateId = parsed.get("selectedTemplateId") || ""

      setParams({ token, productId, uploadedTemplateUrl, uploadedTemplatePreviewUrl, selectedTemplateId })
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!params.token || !params.productId) return
      const api = new ApiService(params?.token) 
      const templates = await api.getCustomTemplateList(params.productId, params.token)
      const parsed = await Promise.all(
        templates.map(async (template) => {
          try {
            const response = await fetch(template?.mediaUrl)
            const blob = await response.blob()
            const file = new File([blob], `${template.name}.psd`, { type: "image/vnd.adobe.photoshop" })
            const base64 = await toBase64(file)
            const layers = await parsePSDToLayerhubObjects(file)
            if (layers.length === 0) return null
            return {
              id: template.templateId || nanoid(),
              src: base64,
              preview: layers[0].src,
              type: "PSD",
              file,
              name: template.name,
            }
          } catch {
            return null
          }
        })
      )

      const filtered = parsed.filter(Boolean)

      // If selectedTemplateId exists, show that as uploaded
      if (params.selectedTemplateId) {
        const matched = filtered.filter((t) => t.id === params.selectedTemplateId)
        setUploadedTemplates(matched)
      } else if (params.uploadedTemplateUrl && params.uploadedTemplatePreviewUrl) {
        setUploadedTemplates([
          {
            id: "uploaded",
            preview: params.uploadedTemplatePreviewUrl,
            src: params.uploadedTemplateUrl,
            type: "PSD",
            file: null,
            name: "Uploaded Template",
          },
        ])
      }

      setDefaultTemplates(filtered)
    }

    load()
  }, [params])

  const addToCanvas = async (upload: any) => {
    if (!editor) return
    const canvasSize = { width: 7128, height: 2520 }
    const layers = await parsePSDToLayerhubObjects(upload.file)
    for (const layer of layers) {
      await editor.objects.add({ ...layer, width: layer.width, height: layer.height })
    }
    editor.frame.resize(canvasSize)
  }

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
        <Block padding={"0 1.5rem"}>
          <h4 style={{ marginTop: "2rem", fontWeight: 600 }}>Uploaded Templates</h4>
          {uploadedTemplates.length === 0 ? (
            <p>Nothing uploaded yet</p>
          ) : (
            <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr 1fr" }}>
              {uploadedTemplates.map((upload) => (
                <div
                  key={upload.id}
                  style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                  onClick={() => addToCanvas(upload)}
                >
                  <div>
                    <img
                      width="100%"
                      src={upload.preview || "/assets/no-preview.png"}
                      alt="preview"
                      style={{ borderRadius: 4, border: "2px dashed #aaa" }}
                    />
                    <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>{upload.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h4 style={{ marginTop: "2rem", fontWeight: 600 }}>Default Templates</h4>
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr 1fr" }}>
            {defaultTemplates.map((upload) => (
              <div
                key={upload.id}
                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                onClick={() => addToCanvas(upload)}
              >
                <div>
                  <img
                    width="100%"
                    src={upload.preview || "/assets/no-preview.png"}
                    alt="preview"
                    style={{ borderRadius: 4, border: "2px dashed #aaa" }}
                  />
                  <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>{upload.name}</div>
                </div>
              </div>
            ))}
          </div>
        </Block>
      </Scrollable>
    </Block>
  )
}

export default Templates
