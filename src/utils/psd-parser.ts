// utils/psd-parser.ts
import { readPsd } from "ag-psd"

export async function parsePSDToLayerhubObjects(file: File): Promise<any[]> {
  const buffer = await file.arrayBuffer()
  const psd = readPsd(new Uint8Array(buffer), { skipCompositeImageData: false })

  const objects: any[] = []

  // Fallback: flat PSD (no children, just canvas)
  if (psd.canvas) {
    const base64 = psd.canvas.toDataURL()
    objects.push({
      type: "StaticImage",
      src: base64,
      width: psd.canvas.width,
      height: psd.canvas.height,
      name: "PSD Background",
    })
    return objects
  }

  if (!psd.children || psd.children.length === 0) {
    return []
  }

  for (const layer of psd.children) {
    if (!layer.canvas) continue

    try {
      const base64 = layer.canvas.toDataURL()
      objects.push({
        type: "StaticImage", // ✅ Important: required by Layerhub
        src: base64,
        width: layer.canvas.width,
        height: layer.canvas.height,
        name: layer.name || "Layer",
      })
    } catch (err) {
      console.error("Failed to convert PSD layer to base64:", err)
    }
  }

  return objects
}
