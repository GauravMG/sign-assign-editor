import { AbstractHandler } from '.';
import { LinkObject, NodeObject } from '../objects';
export type LayoutType = 'dagre' | 'elk';
export type LayoutDirection = 'vertical' | 'horizontal';
export interface LayoutOptions {
    type: LayoutType;
    direction?: LayoutDirection;
    nodes: NodeObject[];
    links?: LinkObject[];
}
export default class LayoutHandler extends AbstractHandler {
    runLayout(options: LayoutOptions): Promise<void>;
    private elk;
    private dagre;
}
