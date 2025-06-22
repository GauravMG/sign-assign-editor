// import React, { useState } from "react"
// import { useEditor } from "@layerhub-io/react"
// import { Block } from "baseui/block"
// import { loadFonts } from "~/utils/fonts"
// import Scrollable from "~/components/Scrollable"
// import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
// import { useStyletron } from "baseui"
// import { SAMPLE_TEMPLATES } from "~/constants/editor"
// import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
// import useDesignEditorContext from "~/hooks/useDesignEditorContext"
// import useEditorType from "~/hooks/useEditorType"
// import { loadVideoEditorAssets } from "~/utils/video"

// const Templates = () => {
//   const editor = useEditor()
//   const setIsSidebarOpen = useSetIsSidebarOpen()
//   const { setCurrentScene, currentScene } = useDesignEditorContext()
//   const inputFileRef = React.useRef<HTMLInputElement>(null)
//   const [uploads, setUploads] = React.useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   const loadTemplate = React.useCallback(
//     async (template: any) => {
//       if (editor) {
//         const fonts: any[] = []
//         template.layers.forEach((object: any) => {
//           if (object.type === "StaticText" || object.type === "DynamicText") {
//             fonts.push({
//               name: object.fontFamily,
//               url: object.fontURL,
//               options: { style: "normal", weight: 400 },
//             })
//           }
//         })
//         const filteredFonts = fonts.filter((f) => !!f.url)
//         if (filteredFonts.length > 0) {
//           await loadFonts(filteredFonts)
//         }

//         setCurrentScene({ ...template, id: currentScene?.id })
//       }
//     },
//     [editor, currentScene]
//   )

//    useEffect(() => {
//       const loadFiles = async () => {
//         for (const { name, url } of BUILT_IN_PSD_LINKS) {
//           try {
//             const response = await fetch(url)
//             const blob = await response.blob()
//             const file = new File([blob], name, { type: "image/vnd.adobe.photoshop" })
//             const base64 = (await toBase64(file)) as string
//             const layers = await parsePSDToLayerhubObjects(file)
  
//             if (layers.length > 0) {
//               const upload = {
//                 id: nanoid(),
//                 src: base64,
//                 preview: layers[0].src,
//                 type: "PSD",
//                 file,
//                 name,
//               }
//               setUploads((prev) => [...prev, upload])
//             }
//           } catch (err) {
//             console.error(`Failed to load built-in PSD: ${name}`, err)
//           }
//         }
//         setLoading(false)
//       }
  
//       loadFiles()
//     }, [])
  
//     const handleDropFiles = async (files: FileList) => {
//       const file = files[0]
//       if (!file) return
  
//       const isVideo = file.type.includes("video")
//       const isPSD = file.name.endsWith(".psd")
  
//       let base64 = (await toBase64(file)) as string
//       let preview = base64
//       let type = "StaticImage"
  
//       if (isVideo) {
//         const video = await loadVideoResource(base64)
//         preview = await captureFrame(video)
//         type = "StaticVideo"
//       } else if (isPSD) {
//         const layers = await parsePSDToLayerhubObjects(file)
//         if (layers.length > 0) {
//           preview = layers[0].src
//           type = "PSD"
//         } else {
//           alert("No layers found in the PSD file.")
//           return
//         }
//       }
  
//       const upload = {
//         id: nanoid(),
//         src: base64,
//         preview,
//         type,
//         file,
//       }
  
//       setUploads((prev) => [...prev, upload])
//     }
  
//     const handleInputFileRefClick = () => {
//       inputFileRef.current?.click()
//     }
  
//     const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//       if (e.target.files) {
//         handleDropFiles(e.target.files)
//       }
//     }
  
//     const addToCanvas = async (upload: any) => {
//       if (!editor) return
  
//       const canvasSize = { width: 7128, height: 2520 }
  
//       if (upload.type === "PSD") {
//         const layers = await parsePSDToLayerhubObjects(upload.file)
//         if (layers.length === 0) {
//           alert("No layers found in the PSD file.")
//           return
//         }
  
//         for (const layer of layers) {
//           await editor.objects.add({
//             ...layer,
//             width: layer.width,
//             height: layer.height,
//             name: layer.name || "Layer",
//           })
//         }
  
//         editor.frame.resize({ width: canvasSize.width, height: canvasSize.height })
//       } else {
//         const img = new Image()
//         img.onload = async () => {
//           const { width, height } = getScaledDimensions(img.width, img.height)
//           await editor.objects.add({
//             type: "StaticImage",
//             src: upload.src,
//             width,
//             height,
//             name: "Upload",
//             ...DEFAULT_IMAGE_POSITION,
//           })
//         }
//         img.src = upload.src
//       }
//     }

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
//       {/* <Scrollable>
//         <div style={{ padding: "0 1.5rem" }}>
//         </div>
//       </Scrollable> */}
//       <Scrollable>
//         <Block padding={"0 1.5rem"}>
//           <h4 style={{ marginTop: "1rem", fontWeight: 600 }}>Default Templates</h4>

//           <div
//             style={{
//               marginTop: "1rem",
//               display: "grid",
//               gap: "0.5rem",
//               gridTemplateColumns: "1fr 1fr",
//             }}
//           >
//             {loading ? (
//               <div style={{ padding: "2rem", textAlign: "center" }}>Loading PSD files...</div>
//             ) : (
//               <div
//                 style={{
//                   marginTop: "1rem",
//                   display: "grid",
//                   gap: "0.5rem",
//                   gridTemplateColumns: "1fr 1fr",
//                 }}
//               >
//                 {uploads?.map((upload) => (
//                   <div
//                     key={upload.id}
//                     style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
//                     onClick={() => addToCanvas(upload)}
//                   >
//                     <div>
//                       <img
//                         width="100%"
//                         src={upload.preview || upload.url}
//                         alt="preview"
//                         style={{ borderRadius: 4, border: upload.type === "PSD" ? "2px dashed #aaa" : "none" }}
//                       />
//                       <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>
//                         {upload.name || (upload.type === "PSD" ? "PSD File" : upload.type === "StaticVideo" ? "Video" : "Image")}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </Block>
//       </Scrollable>
//     </Block>
//   )
// }

// const ImageItem = ({ preview, onClick }: { preview: any; onClick?: (option: any) => void }) => {
//   const [css] = useStyletron()
//   return (
//     <div
//       onClick={onClick}
//       className={css({
//         position: "relative",
//         background: "#f8f8fb",
//         cursor: "pointer",
//         borderRadius: "8px",
//         overflow: "hidden",
//         "::before:hover": {
//           opacity: 1,
//         },
//       })}
//     >
//       <div
//         className={css({
//           backgroundImage: `linear-gradient(to bottom,
//           rgba(0, 0, 0, 0) 0,
//           rgba(0, 0, 0, 0.006) 8.1%,
//           rgba(0, 0, 0, 0.022) 15.5%,
//           rgba(0, 0, 0, 0.047) 22.5%,
//           rgba(0, 0, 0, 0.079) 29%,
//           rgba(0, 0, 0, 0.117) 35.3%,
//           rgba(0, 0, 0, 0.158) 41.2%,
//           rgba(0, 0, 0, 0.203) 47.1%,
//           rgba(0, 0, 0, 0.247) 52.9%,
//           rgba(0, 0, 0, 0.292) 58.8%,
//           rgba(0, 0, 0, 0.333) 64.7%,
//           rgba(0, 0, 0, 0.371) 71%,
//           rgba(0, 0, 0, 0.403) 77.5%,
//           rgba(0, 0, 0, 0.428) 84.5%,
//           rgba(0, 0, 0, 0.444) 91.9%,
//           rgba(0, 0, 0, 0.45) 100%)`,
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           opacity: 0,
//           transition: "opacity 0.3s ease-in-out",
//           height: "100%",
//           width: "100%",
//           ":hover": {
//             opacity: 1,
//           },
//         })}
//       />
//       <img
//         src={preview}
//         className={css({
//           width: "100%",
//           height: "100%",
//           objectFit: "contain",
//           pointerEvents: "none",
//           verticalAlign: "middle",
//         })}
//       />
//     </div>
//   )
// }

// export default Templates



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

const BUILT_IN_PSD_LINKS = [
  { name: "Shopping Bag Mockup", url: "/assets/templates/shopping-bag-mockup.psd" },
  { name: "Template", url: "/assets/templates/template.psd" },
]

const DEFAULT_IMAGE_POSITION = { x: 200, y: 200 }

const Templates = () => {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { currentScene } = useDesignEditorContext()
  const [uploads, setUploads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFiles = async () => {
      const newUploads: any[] = []
      for (const { name, url } of BUILT_IN_PSD_LINKS) {
        try {
          const response = await fetch(url)
          const blob = await response.blob()
          const file = new File([blob], name, { type: "image/vnd.adobe.photoshop" })
          const base64 = (await toBase64(file)) as string
          const layers = await parsePSDToLayerhubObjects(file)

          if (layers.length > 0) {
            const upload = {
              id: nanoid(),
              src: base64,
              preview: layers[0].src,
              type: "PSD",
              file,
              name,
            }
            newUploads.push(upload)
          }
        } catch (err) {
          console.error(`Failed to load PSD template: ${name}`, err)
        }
      }
      setUploads(newUploads)
      setLoading(false)
    }

    loadFiles()
  }, [])

  const addToCanvas = async (upload: any) => {
    if (!editor) return

    const canvasSize = { width: 7128, height: 2520 }

    if (upload.type === "PSD") {
      const layers = await parsePSDToLayerhubObjects(upload.file)
      if (layers.length === 0) {
        alert("No layers found in the PSD file.")
        return
      }

      for (const layer of layers) {
        await editor.objects.add({
          ...layer,
          width: layer.width,
          height: layer.height,
          name: layer.name || "Layer",
        })
      }

      editor.frame.resize({ width: canvasSize.width, height: canvasSize.height })
    }
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
          <h4 style={{ marginTop: "1rem", fontWeight: 600 }}> Uploaded Files</h4>

          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>Loading Files...</div>
          ) : (
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                  onClick={() => addToCanvas(upload)}
                >
                  <div>
                    <img
                      width="100%"
                      src={upload.preview}
                      alt="preview"
                      style={{ borderRadius: 4, border: "2px dashed #aaa" }}
                    />
                    <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>
                      {upload.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Block>
      </Scrollable>
    </Block>
  )
}

export default Templates
