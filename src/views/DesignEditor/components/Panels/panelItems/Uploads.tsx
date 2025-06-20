// import React from "react"
// import { Block } from "baseui/block"
// import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
// import Scrollable from "~/components/Scrollable"
// import { Button, SIZE } from "baseui/button"
// import DropZone from "~/components/Dropzone"
// import { useEditor } from "@layerhub-io/react"
// import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
// import { nanoid } from "nanoid"
// import { captureFrame, loadVideoResource } from "~/utils/video"
// import { ILayer } from "@layerhub-io/types"
// import { toBase64 } from "~/utils/data"

// export default function () {
//   const inputFileRef = React.useRef<HTMLInputElement>(null)
//   const [uploads, setUploads] = React.useState<any[]>([])
//   const editor = useEditor()
//   const setIsSidebarOpen = useSetIsSidebarOpen()

//   const handleDropFiles = async (files: FileList) => {
//     const file = files[0]

//     const isVideo = file.type.includes("video")
//     const base64 = (await toBase64(file)) as string
//     let preview = base64
//     if (isVideo) {
//       const video = await loadVideoResource(base64)
//       const frame = await captureFrame(video)
//       preview = frame
//     }

//     const type = isVideo ? "StaticVideo" : "StaticImage"

//     const upload = {
//       id: nanoid(),
//       src: base64,
//       preview: preview,
//       type: type,
//     }

//     setUploads([...uploads, upload])
//   }

//   const handleInputFileRefClick = () => {
//     inputFileRef.current?.click()
//   }

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     handleDropFiles(e.target.files!)
//   }

//   const addImageToCanvas = (props: Partial<ILayer>) => {
//     editor.objects.add(props)
//   }
//   return (
//     <DropZone handleDropFiles={handleDropFiles}>
//       <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Block
//           $style={{
//             display: "flex",
//             alignItems: "center",
//             fontWeight: 500,
//             justifyContent: "space-between",
//             padding: "1.5rem",
//           }}
//         >
//           <Block>Uploads</Block>

//           <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
//             <AngleDoubleLeft size={18} />
//           </Block>
//         </Block>
//         <Scrollable>
//           <Block padding={"0 1.5rem"}>
//             <Button
//               onClick={handleInputFileRefClick}
//               size={SIZE.compact}
//               overrides={{
//                 Root: {
//                   style: {
//                     width: "100%",
//                   },
//                 },
//               }}
//             >
//               Computer
//             </Button>
//             <input onChange={handleFileInput} type="file" id="file" ref={inputFileRef} style={{ display: "none" }} />

//             <div
//               style={{
//                 marginTop: "1rem",
//                 display: "grid",
//                 gap: "0.5rem",
//                 gridTemplateColumns: "1fr 1fr",
//               }}
//             >
//               {uploads.map((upload) => (
//                 <div
//                   key={upload.id}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => addImageToCanvas(upload)}
//                 >
//                   <div>
//                     <img width="100%" src={upload.preview ? upload.preview : upload.url} alt="preview" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Block>
//         </Scrollable>
//       </Block>
//     </DropZone>
//   )
// }





import React, { useEffect, useState } from "react"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { Button, SIZE } from "baseui/button"
import DropZone from "~/components/Dropzone"
import { useEditor } from "@layerhub-io/react"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { nanoid } from "nanoid"
import { captureFrame, loadVideoResource } from "~/utils/video"
import { ILayer } from "@layerhub-io/types"
import { toBase64 } from "~/utils/data"
import { parsePSDToLayerhubObjects } from "~/utils/psd-parser"
import { Input } from "baseui/input"


const BUILT_IN_PSD_LINKS = [
  { name: "Shopping Bag Mockup", url: "/assets/templates/shopping-bag-mockup.psd" },
  { name: "Template", url: "/assets/templates/template.psd" },
]

export default function UploadPanel() {
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = React.useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()


  const [searchTerm, setSearchTerm] = useState("")
  const [searchImages, setSearchImages] = useState<string[]>([])

  const handleSearchImages = async () => {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=20`, {
      headers: {
        Authorization: "mkR9Y49LLcVDGXa4MvmqolNVWgggS5YDCYE4Z9lt4dES10N3P5YlJLeb",
      },
    })

    const data = await res.json()
    const urls = data?.photos?.map((p: any) => p.src.large2x)
    setSearchImages(urls)
  }

  useEffect(() => {
    const loadFiles = async () => {
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
            setUploads((prev) => [...prev, upload])
          }
        } catch (err) {
          console.error(`Failed to load built-in PSD: ${name}`, err)
        }
      }
      setLoading(false)
    }

    loadFiles()
  }, [])

  const handleDropFiles = async (files: FileList) => {
    const file = files[0]
    if (!file) return

    const isVideo = file.type.includes("video")
    const isPSD = file.name.endsWith(".psd")

    let base64 = (await toBase64(file)) as string
    let preview = base64
    let type = "StaticImage"

    if (isVideo) {
      const video = await loadVideoResource(base64)
      preview = await captureFrame(video)
      type = "StaticVideo"
    } else if (isPSD) {
      const layers = await parsePSDToLayerhubObjects(file)
      if (layers.length > 0) {
        preview = layers[0].src
        type = "PSD"
      } else {
        alert("No layers found in the PSD file.")
        return
      }
    }

    const upload = {
      id: nanoid(),
      src: base64,
      preview,
      type,
      file,
    }

    setUploads((prev) => [...prev, upload])
  }

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleDropFiles(e.target.files)
    }
  }

  const addToCanvas = async (upload: any) => {
    if (!editor) return

    const canvasSize = { width: 7128, height: 2520 } // 99 inch x 35 inch at 72 DPI

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
    } else {
      await editor.objects.add({
        type: "StaticImage",
        src: upload.src,
        width: 700,
        height: 700,
        name: "Upload",
      })
    }
  }

  return (
    <DropZone handleDropFiles={handleDropFiles}>
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
          <Block>Uploads</Block>
          <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
            <AngleDoubleLeft size={18} />
          </Block>
        </Block>

        <Scrollable>
          <Block padding={"0 1.5rem"}>
            <Button
              onClick={handleInputFileRefClick}
              size={SIZE.compact}
              overrides={{ Root: { style: { width: "100%" } } }}
            >
              Computer
            </Button>
            <input onChange={handleFileInput} type="file" ref={inputFileRef} style={{ display: "none" }} />

            <h4 style={{ marginTop: "1.5rem", fontWeight: 600 }}>Inbuilt PSD Files</h4>

            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>Loading PSD files...</div>
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
                        src={upload.preview || upload.url}
                        alt="preview"
                        style={{ borderRadius: 4, border: upload.type === "PSD" ? "2px dashed #aaa" : "none" }}
                      />
                      <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>
                        {upload.name || (upload.type === "PSD" ? "PSD File" : upload.type === "StaticVideo" ? "Video" : "Image")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}


            <h4 style={{ marginTop: "1.5rem", fontWeight: 600 }}>Search Backgrounds Imgaes</h4>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
                placeholder="e.g. birthday, party, cake..."
              />
              <Button size={SIZE.compact} onClick={handleSearchImages}>
                Search
              </Button>
            </div>

            {searchImages.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gap: "0.75rem",
                  gridTemplateColumns: "1fr 1fr",
                  marginBottom: "2rem",
                }}
              >
                {searchImages.map((src, idx) => (
                  <div
                    key={idx}
                    style={{ cursor: "pointer", borderRadius: 6, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
                    onClick={() =>
                      editor?.objects.add({
                        type: "StaticImage",
                        src,
                        width: 1200,
                        height: 800,
                        name: `Search: ${searchTerm}`,
                      })
                    }
                  >
                    <img
                      src={src}
                      alt={searchTerm}
                      loading="lazy"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

          </Block>
        </Scrollable>
      </Block>
    </DropZone>
  )
}
