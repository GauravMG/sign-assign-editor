import React from 'react';
import Handler, { HandlerOptions } from './handlers/Handler';
import { FabricCanvas } from './models';
import './styles/canvas.less';
import './styles/contextmenu.less';
import './styles/fabricjs.less';
import './styles/tooltip.less';
export interface CanvasInstance {
    handler: Handler;
    canvas: FabricCanvas;
    container: HTMLDivElement;
}
export type CanvasProps = HandlerOptions & {
    responsive?: boolean;
    style?: React.CSSProperties;
};
declare const Canvas: React.FC<CanvasProps>;
export default Canvas;
