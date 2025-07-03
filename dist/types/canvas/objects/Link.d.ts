import { fabric } from 'fabric';
import { FabricObject } from '../models';
import { NodeObject } from './Node';
import { PortObject } from './Port';
export interface LinkedNodePropeties {
    left: number;
    top: number;
    width?: number;
    height?: number;
}
export interface LinkObject extends FabricObject<fabric.Path> {
    fromNode?: NodeObject;
    toNode?: NodeObject;
    fromPort?: PortObject;
    toPort?: PortObject;
    fromPortIndex?: number;
    isPointNear: (pointer: fabric.Point, tolerance?: number) => boolean;
    setPort?: (fromNode: NodeObject, fromPort: PortObject, toNode: NodeObject, toPort: PortObject) => void;
    setPortEnabled?: (node: NodeObject, port: PortObject, enabled: boolean) => void;
    update?: (fromPort: Partial<PortObject>, toPort: Partial<PortObject>) => void;
}
declare const Link: any;
export default Link;
