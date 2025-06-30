import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { Select, InputNumber, ColorPicker, Button, Space } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";

const fonts = ["Arial", "Noto Sans", "Roboto", "Pacifico", "Open Sans"];

interface Props {
  canvas: fabric.Canvas | null;
}

const TextToolbar: React.FC<Props> = ({ canvas }) => {
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontSize, setFontSize] = useState<number>(32);
  const [fill, setFill] = useState<string>("#000000");
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);
  const [underline, setUnderline] = useState<boolean>(false);
  const [hasActiveTextbox, setHasActiveTextbox] = useState(false);

  useEffect(() => {
    if (!canvas) return;

    const updateToolbar = () => {
      const active = canvas.getActiveObject();
      if (active && (active.type === "textbox" || active.type === "text")) {
        const textObj = active as fabric.Textbox;
        setFontFamily(textObj.fontFamily || "Arial");
        setFontSize(textObj.fontSize || 32);
        setFill((textObj.fill as string) || "#000000");
        setBold(textObj.fontWeight === "bold");
        setItalic(textObj.fontStyle === "italic");
        setUnderline(!!textObj.underline);
        setHasActiveTextbox(true);
      } else {
        setHasActiveTextbox(false);
      }
    };

    canvas.on("selection:created", updateToolbar);
    canvas.on("selection:updated", updateToolbar);
    canvas.on("selection:cleared", updateToolbar);
    canvas.on("object:modified", updateToolbar);

    return () => {
      canvas.off("selection:created", updateToolbar);
      canvas.off("selection:updated", updateToolbar);
      canvas.off("selection:cleared", updateToolbar);
      canvas.off("object:modified", updateToolbar);
    };
  }, [canvas]);

  const applyStyle = (prop: keyof fabric.Textbox, value: any) => {
    if (!canvas) return;

    const active = canvas.getActiveObject() as fabric.Textbox;
    if (active && (active.type === "textbox" || active.type === "text")) {
      active.set(prop, value);
      canvas.requestRenderAll();
    }
  };

  const toggleStyle = (prop: keyof fabric.Textbox, current: boolean) => {
    if (!canvas) return;

    const active = canvas.getActiveObject() as fabric.Textbox;
    if (active && (active.type === "textbox" || active.type === "text")) {
      let value: any;

      switch (prop) {
        case "fontWeight":
          value = current ? "normal" : "bold";
          setBold(!current);
          break;
        case "fontStyle":
          value = current ? "normal" : "italic";
          setItalic(!current);
          break;
        case "underline":
          value = !current;
          setUnderline(!current);
          break;
        default:
          return;
      }

      active.set(prop, value);
      canvas.requestRenderAll();
    }
  };

  return (
    <Space wrap>
      <Select
        value={fontFamily}
        onChange={(val) => {
          setFontFamily(val);
          applyStyle("fontFamily", val);
        }}
        style={{ width: 150 }}
        options={fonts.map((f) => ({ label: f, value: f }))}
        disabled={!hasActiveTextbox}
      />

      <InputNumber
        value={fontSize}
        min={8}
        max={200}
        onChange={(val) => {
          if (val !== null) {
            setFontSize(val);
            applyStyle("fontSize", val);
          }
        }}
        disabled={!hasActiveTextbox}
      />

      <ColorPicker
        value={fill}
        onChange={(color) => {
          const hex = color.toHexString();
          setFill(hex);
          applyStyle("fill", hex);
        }}
        disabled={!hasActiveTextbox}
      />

      <Button
        type={bold ? "primary" : "default"}
        icon={<BoldOutlined />}
        onClick={() => toggleStyle("fontWeight", bold)}
        disabled={!hasActiveTextbox}
      />

      <Button
        type={italic ? "primary" : "default"}
        icon={<ItalicOutlined />}
        onClick={() => toggleStyle("fontStyle", italic)}
        disabled={!hasActiveTextbox}
      />

      <Button
        type={underline ? "primary" : "default"}
        icon={<UnderlineOutlined />}
        onClick={() => toggleStyle("underline", underline)}
        disabled={!hasActiveTextbox}
      />
    </Space>
  );
};

export default TextToolbar;
