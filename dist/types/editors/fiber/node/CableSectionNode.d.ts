import { fabric } from 'fabric';
import { FabricObject } from '../../../canvas';
export declare const CableColorCode: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
};
export interface CableSectionNodeOptions {
    coreCount: number;
    /**
     * Created direction of ports
     *
     * @type {('left' | 'right')}
     * @default 'right'
     */
    portDirection?: 'left' | 'right';
}
export interface CableSectionNodeObject extends FabricObject<fabric.Group> {
    createPort(): any;
}
declare const CableSectionNode: any;
export default CableSectionNode;
