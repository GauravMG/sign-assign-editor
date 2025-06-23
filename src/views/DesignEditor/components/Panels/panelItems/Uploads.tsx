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
import { toBase64 } from "~/utils/data"
import { Input } from "baseui/input"

const DEFAULT_IMAGE_POSITION = { x: 200, y: 200 }

export default function UploadPanel() {
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = React.useState<any[]>([])
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const [searchTerm, setSearchTerm] = useState("")
  const [searchImages, setSearchImages] = useState<string[]>([])
  const [emojiSearch, setEmojiSearch] = useState("")
  const [emojiIcons, setEmojiIcons] = useState<string[]>([])

  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const debouncedEmojiSearch = useDebounce(emojiSearch, 500)

  function useDebounce<T>(value: T, delay: number = 500): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
      const handler = setTimeout(() => setDebounced(value), delay)
      return () => clearTimeout(handler)
    }, [value, delay])
    return debounced
  }

  useEffect(() => {
    const handleSearchImages = async () => {
      if (!debouncedSearchTerm.trim()) return;
      try {
        const res = await fetch(`/pexels/search?query=${encodeURIComponent(debouncedSearchTerm)}&per_page=20`, {
          headers: {
            Authorization: "mkR9Y49LLcVDGXa4MvmqolNVWgggS5YDCYE4Z9lt4dES10N3P5YlJLeb",
          },
        });
        const data = await res.json();
        const urls = data?.photos?.map((p: any) => p.src.large2x);
        setSearchImages(urls);
      } catch (err) {
        console.error("Image search failed", err);
      }
    };
    handleSearchImages();
  }, [debouncedSearchTerm]);

  const handleDropFiles = async (files: FileList) => {
    const file = files[0]
    if (!file) return

    const base64 = (await toBase64(file)) as string
    const type = file.type.includes("video") ? "StaticVideo" : "StaticImage"

    const image = new Image()
    image.onload = () => {
      const upload = {
        id: nanoid(),
        src: base64,
        preview: base64,
        type,
        file,
        width: image.naturalWidth,
        height: image.naturalHeight,
      }
      setUploads((prev) => [...prev, upload])
    }
    image.src = base64
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
    if (!editor) return;
  
    const image = new Image();
    image.crossOrigin = "anonymous";
  
    image.onload = async () => {
      const imgWidth = image.naturalWidth;
      const imgHeight = image.naturalHeight;
  
      const canvasWidth = (editor as any).frame?.width || 1200;
      const canvasHeight = (editor as any).frame?.height || 800;
  
      // Smart scaling logic
      const aspectRatio = imgWidth / imgHeight;
      const isPortrait = aspectRatio < 1;
  
      const scaleFactor = 0.85; // Fill up to 85% of target dimension
  
      let targetWidth = imgWidth;
      let targetHeight = imgHeight;
  
      if (isPortrait) {
        // Fill height for vertical images
        const maxHeight = canvasHeight * scaleFactor;
        const scale = maxHeight / imgHeight;
        targetHeight = maxHeight;
        targetWidth = imgWidth * scale;
      } else {
        // Fill width for horizontal images
        const maxWidth = canvasWidth * scaleFactor;
        const scale = maxWidth / imgWidth;
        targetWidth = maxWidth;
        targetHeight = imgHeight * scale;
      }
  
      await editor.objects.add({
        type: "StaticImage",
        src: upload.src,
        width: targetWidth,
        height: targetHeight,
        name: "Upload",
        left: (canvasWidth - targetWidth) / 2,
        top: (canvasHeight - targetHeight) / 2,
      });
    };
  
    image.src = upload.src;
  };  

  useEffect(() => {
    const handleSearchEmojis = async () => {
      if (!debouncedEmojiSearch.trim()) return;
      const keyword = encodeURIComponent(debouncedEmojiSearch);
      const sources = ["noto", "twemoji"];
      let allIcons: string[] = [];

      for (const prefix of sources) {
        const res = await fetch(`https://api.iconify.design/search?query=${keyword}&prefix=${prefix}&limit=20`);
        const data = await res.json();

        if (Array.isArray(data.icons)) {
          for (const iconName of data.icons) {
            const iconId = iconName;
            const check = await fetch(`https://api.iconify.design/${iconId}.svg`);
            if (check.ok) {
              allIcons.push(iconId);
            }
            if (allIcons.length === 20) break;
          }
        }
        if (allIcons.length === 20) break;
      }

      setEmojiIcons(allIcons.slice(0, 20));
    };

    handleSearchEmojis();
  }, [debouncedEmojiSearch])


  // Load uploads from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("uploaded_images")
    if (saved) {
      setUploads(JSON.parse(saved))
    }
  }, [])

  // Save uploads to localStorage whenever changed
  useEffect(() => {
    if (uploads.length) {
      localStorage.setItem("uploaded_images", JSON.stringify(uploads))
    }
  }, [uploads])

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
              Upload
            </Button>
            <h4 style={{ marginTop: "1rem", fontWeight: 600 }}> Uploaded Files</h4>

            <input onChange={handleFileInput} type="file" ref={inputFileRef} style={{ display: "none" }} />

            {uploads.length > 0 ? (
              <div
                style={{
                  marginTop: "1rem",
                  display: "grid",
                  gap: "0.5rem",
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                {uploads?.map((upload) => (
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
                        style={{ borderRadius: 4 }}
                      />
                      <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>
                        {upload?.name || (upload?.type === "StaticVideo" ? "Video" : "Image")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  marginTop: "1rem",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#666",
                  textAlign: "center",
                }}
              >
                Nothing uploaded yet.
              </div>
            )}

            <h4 style={{ marginTop: "1.5rem", fontWeight: 600 }}>Search Images</h4>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
                placeholder="Search..."
              />
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
                {searchImages?.map((src, idx) => (
                  <div
                    key={idx}
                    style={{
                      cursor: "pointer",
                      borderRadius: 6,
                      overflow: "hidden",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                    onClick={() =>
                      editor?.objects.add({
                        type: "StaticImage",
                        src,
                        width: 1200,
                        height: 800,
                        name: `Search: ${searchTerm}`,
                        ...DEFAULT_IMAGE_POSITION,
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

            {/* search emoji  */}
            <h4 style={{ marginTop: "1.5rem", fontWeight: 600 }}>Search Emojis / Icons</h4>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <Input
                value={emojiSearch}
                onChange={(e) => setEmojiSearch((e.target as HTMLInputElement).value)}
                placeholder="Search..."
              />
            </div>
            {emojiIcons.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gap: "0.75rem",
                  gridTemplateColumns: "1fr 1fr",
                  marginBottom: "2rem",
                }}
              >
                {emojiIcons?.map((icon, idx) => {
                  const src = `https://api.iconify.design/${icon}.svg`
                  return (
                    <div
                      key={idx}
                      style={{
                        cursor: "pointer",
                        borderRadius: 6,
                        overflow: "hidden",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }}
                      onClick={async () => {
                        try {
                          const svgText = await fetch(src).then((res) => res.text())
                          const svgBlob = new Blob([svgText], { type: "image/svg+xml" })
                          const url = URL.createObjectURL(svgBlob)

                          const image = new Image()
                          image.onload = async () => {
                            const canvas = document.createElement("canvas")
                            canvas.width = 800
                            canvas.height = 800
                            const ctx = canvas.getContext("2d")
                            if (ctx) {
                              ctx.clearRect(0, 0, canvas.width, canvas.height)
                              ctx.drawImage(image, 0, 0, 800, 800)
                              const base64 = canvas.toDataURL("image/png")

                              await editor?.objects.add({
                                type: "StaticImage",
                                src: base64,
                                width: 800,
                                height: 800,
                                name: `Emoji: ${icon}`,
                                ...DEFAULT_IMAGE_POSITION,
                              })
                            }
                            URL.revokeObjectURL(url)
                          }
                          image.src = url
                        } catch (error) {
                          console.error("Emoji add failed", error)
                        }
                      }}
                    >
                      <img
                        src={src}
                        alt={icon}
                        loading="lazy"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100px",
                          objectFit: "contain",
                          padding: "10px",
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </Block>
        </Scrollable>
      </Block>
    </DropZone>
  )
}
