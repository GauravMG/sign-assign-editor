import React from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import { Button, SIZE } from "baseui/button"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { useEditor } from "@layerhub-io/react"

const Icons = () => {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const addIcon = async () => {
    if (!editor) return
    await editor.objects.add({
      type: "StaticImage", // safe type
      src: "https://www.svgrepo.com/show/13668/star.svg",
      width: 200,
      height: 200,
      name: "Star Icon",
    })
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
        <Block>Icons</Block>
        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding="0 1.5rem">
          <Button
            onClick={addIcon}
            size={SIZE.compact}
            overrides={{ Root: { style: { width: "100%" } } }}
          >
            Add Sample Icon
          </Button>
        </Block>
      </Scrollable>
    </Block>
  )
}

export default Icons
