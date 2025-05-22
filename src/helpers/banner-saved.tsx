
// import * as LZString from "lz-string"

// export const saveDesignToStorage = (designJson: any, preview: string) => {
//   try {
//     const compressed = LZString.compressToUTF16(JSON.stringify(designJson))
//     localStorage.setItem("saved_design", compressed)
//     localStorage.setItem("saved_preview", preview)
//   } catch (err) {
//     console.error("Save error (quota?):", err)
//   }
// }

// export const loadDesignFromStorage = (): { design: any, preview: string } | null => {
//   try {
//     const compressed = localStorage.getItem("saved_design")
//     const preview = localStorage.getItem("saved_preview")
//     if (compressed && preview) {
//       const json = JSON.parse(LZString.decompressFromUTF16(compressed) || "{}")
//       return { design: json, preview }
//     }
//   } catch (err) {
//     console.error("Load error:", err)
//   }
//   return null
// }


export const saveDesignToStorage = (
  designJson: any,
  previewBase64: string,
  frame: { width: number; height: number }
) => {
  try {
    const design = {
      ...designJson,
    }

    const preview = {
      url: previewBase64,
      width: frame.width,
      height: frame.height,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("saved_design", JSON.stringify(design))
    localStorage.setItem("saved_preview", JSON.stringify(preview))
  } catch (err) {
    console.error("Error saving to localStorage:", err)
  }
}

export const loadDesignFromStorage = (): {
  design: any
  preview: { url: string; width: number; height: number; createdAt: string }
} | null => {
  try {
    const savedDesign = localStorage.getItem("saved_design")
    const savedPreview = localStorage.getItem("saved_preview")
    if (savedDesign && savedPreview) {
      return {
        design: JSON.parse(savedDesign),
        preview: JSON.parse(savedPreview),
      }
    }
  } catch (err) {
    console.error("Error loading from localStorage:", err)
  }
  return null
}

