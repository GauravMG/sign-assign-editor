import { fabric } from 'fabric';
import { FabricObject } from '../models';
import { NodeObject } from './Node';
import { PortObject } from './Port';
export interface LineLinkObject extends FabricObject<fabric.Line> {
    fromNode?: NodeObject;
    toNode?: NodeObject;
    fromPort?: PortObject;
    toPort?: PortObject;
    fromPortIndex?: number;
    setPort?: (fromNode: NodeObject, fromPort: PortObject, toNode: NodeObject, toPort: PortObject) => void;
    setPortEnabled?: (node: NodeObject, port: PortObject, enabled: boolean) => void;
}
declare const LineLink: any;
export default LineLink;
