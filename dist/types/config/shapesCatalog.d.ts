import { fabric } from "fabric";
export interface ShapeConfig {
    name: string;
    previewColor: string;
    create: () => fabric.Object;
}
export declare const shapesCatalog: ShapeConfig[];
