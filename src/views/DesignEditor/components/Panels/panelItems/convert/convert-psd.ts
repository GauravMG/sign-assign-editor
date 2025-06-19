// @ts-ignore
import PSD from "psd"
import fs from "fs"
import path from "path"

interface LayerhubTextLayer {
  id: string
  name: string
  type: "StaticText"
  text: string
  fontSize: number
  fontFamily: string
  fill: string
  left: number
  top: number
  width: number
  height: number
  opacity: number
  textAlign: string
}

interface LayerhubImageLayer {
  id: string
  name: string
  type: "StaticImage"
  src: string
  left: number
  top: number
  width: number
  height: number
  opacity: number
}

type LayerhubLayer = LayerhubTextLayer | LayerhubImageLayer

interface LayerhubTemplate {
  id: string
  name: string
  frame: {
    width: number
    height: number
  }
  preview: string
  layers: LayerhubLayer[]
  metadata: Record<string, any>
}

const inputPath = path.resolve(__dirname, "../src/constants/templates/template1.psd")
const outputPath = path.resolve(__dirname, "../src/constants/templates/generated-template.json")

async function convert() {
  const psd = await PSD.open(inputPath)
  psd.parse()

  const tree = psd.tree().export()
  const layers: LayerhubLayer[] = []

  const walk = (node: any) => {
    if (node.type === "layer") {
      if (node.text && node.text.value) {
        layers.push({
          id: `${node.name}-${Date.now()}`,
          name: node.name,
          type: "StaticText",
          text: node.text.value,
          fontSize: 32,
          fontFamily: "Arial",
          fill: "#000000",
          left: node.left ?? 0,
          top: node.top ?? 0,
          width: node.width ?? 200,
          height: node.height ?? 50,
          opacity: 1,
          textAlign: "left",
        })
      } else {
        try {
          const pngBuffer = node.toPng?.()?.toBuffer?.()
          if (pngBuffer) {
            const dataUri = `data:image/png;base64,${pngBuffer.toString("base64")}`
            layers.push({
              id: `${node.name}-${Date.now()}`,
              name: node.name,
              type: "StaticImage",
              src: dataUri,
              left: node.left ?? 0,
              top: node.top ?? 0,
              width: node.width ?? 200,
              height: node.height ?? 200,
              opacity: 1,
            })
          }
        } catch (err) {
          console.warn(`Could not render image for layer "${node.name}"`)
        }
      }
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(walk)
    }
  }

  tree.children.forEach(walk)

  // ⛔ If preview image can't be extracted, fallback to placeholder
  let preview = ""
  try {
    const fallbackPng = fs.readFileSync(path.resolve(__dirname, "../src/assets/template-preview.png"))
    preview = `data:image/png;base64,${fallbackPng.toString("base64")}`
  } catch (err) {
    console.warn("⚠ No fallback preview available")
  }

  const template: LayerhubTemplate = {
    id: `psd-template-${Date.now()}`,
    name: "PSD Imported Template",
    frame: {
      width: psd.image.width() ?? 1200,
      height: psd.image.height() ?? 1200,
    },
    preview,
    layers,
    metadata: {},
  }

  fs.writeFileSync(outputPath, JSON.stringify(template, null, 2), "utf-8")
  console.log("✅ Template JSON generated with preview ✅")
}

convert()