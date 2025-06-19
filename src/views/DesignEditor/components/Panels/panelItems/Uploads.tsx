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







import React from "react"
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

export default function UploadPanel() {
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = React.useState<any[]>([])
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()

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
  
    if (upload.type === "PSD") {
      const layers = await parsePSDToLayerhubObjects(upload.file)
      if (layers.length === 0) {
        alert("No layers found in the PSD file.")
        return
      }
  
      for (const layer of layers) {
        await editor.objects.add({
          type: "StaticImage",
          src: layer.src,
          width: layer.width,
          height: layer.height,
          name: layer.name,
        })
      }
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
                      {upload.type === "PSD" ? "PSD File" : upload.type === "StaticVideo" ? "Video" : "Image"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Block>
        </Scrollable>
      </Block>
    </DropZone>
  )
}