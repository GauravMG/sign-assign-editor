import { fabric } from "fabric";

export interface ShapeConfig {
  name: string;
  previewColor: string;
  create: () => fabric.Object;
}

export const shapesCatalog: ShapeConfig[] = [
  {
    name: "Rectangle",
    previewColor: "#1890ff",
    create: () =>
      new fabric.Rect({
        width: 150,
        height: 100,
        fill: "#1890ff",
        stroke: "#333",
        strokeWidth: 2,
        left: 100,
        top: 100,
      }),
  },
  {
    name: "Circle",
    previewColor: "#f5222d",
    create: () =>
      new fabric.Circle({
        radius: 50,
        fill: "#f5222d",
        stroke: "#333",
        strokeWidth: 2,
        left: 150,
        top: 150,
      }),
  },
  {
    name: "Triangle",
    previewColor: "#52c41a",
    create: () =>
      new fabric.Triangle({
        width: 100,
        height: 100,
        fill: "#52c41a",
        stroke: "#333",
        strokeWidth: 2,
        left: 200,
        top: 200,
      }),
  },
  {
    name: "Star",
    previewColor: "#faad14",
    create: () => {
      const starPath =
        "M170,250 L220,150 L270,250 L150,200 L290,200 z";
      return new fabric.Path(starPath, {
        fill: "#faad14",
        stroke: "#333",
        strokeWidth: 2,
        scaleX: 0.5,
        scaleY: 0.5,
        left: 200,
        top: 200,
      });
    },
  },
  {
    name: "Arrow",
    previewColor: "#722ed1",
    create: () => {
      const arrowPath =
        "M0,10 L50,10 L50,0 L80,20 L50,40 L50,30 L0,30 z";
      return new fabric.Path(arrowPath, {
        fill: "#722ed1",
        stroke: "#333",
        strokeWidth: 2,
        left: 200,
        top: 200,
        scaleX: 2,
        scaleY: 2,
      });
    },
  },
];