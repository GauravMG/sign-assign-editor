// import React from "react"
// import { Block } from "baseui/block"
// import { useEditor } from "@layerhub-io/react"

// const Graphic = () => {
//   const editor = useEditor()
//   const [loading, setLoading] = React.useState(true)
//   const [state, setState] = React.useState({
//     image: "",
//   })
  

//   const makePreview = React.useCallback(async () => {
//     if (editor) {
//       const template = editor.scene.exportToJSON()
//       const image = (await editor.renderer.render(template)) as string
//       setState({ image })
//       setLoading(false)
//     }
//   }, [editor])

//   React.useEffect(() => {
//     makePreview()
//   }, [editor])

//   return (
//     <Block $style={{ flex: 1, alignItems: "center", justifyContent: "center", display: "flex", padding: "5rem" }}>
//       {!loading && <img width="auto" height="100%" src={state.image} />}
//     </Block>
//   )
// }

// export default Graphic





import React from "react"
import { Block } from "baseui/block"
import { useEditor } from "@layerhub-io/react"

const Graphic = () => {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  const [state, setState] = React.useState<{ image: string }>({
    image: "",
  })

  const makePreview = React.useCallback(async () => {
    if (editor) {
      const template = editor.scene.exportToJSON()
      const image = (await editor.renderer.render(template)) as string
      setState({ image })
      setLoading(false)
    }
  }, [editor])

  React.useEffect(() => {
    const loadSavedDesign = async () => {
      const savedDesign = localStorage.getItem("saved_design")
      const savedPreview = localStorage.getItem("saved_preview")

      if (editor && savedDesign && savedPreview) {
        try {
          const json = JSON.parse(savedDesign)
          await editor.scene.importFromJSON(json)
          setState({ image: savedPreview })
          setLoading(false)
        } catch (error) {
          console.error("Failed to load saved design", error)
          makePreview()
        }
      } else {
        makePreview()
      }
    }

    if (editor) {
      loadSavedDesign()
    }
  }, [editor, makePreview])

  return (
    <Block
      $style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        padding: "5rem",
      }}
    >
      {!loading && state.image && (
        <img width="auto" height="100%" src={state.image} alt="Saved Design Preview" />
      )}
    </Block>
  )
}

export default Graphic
