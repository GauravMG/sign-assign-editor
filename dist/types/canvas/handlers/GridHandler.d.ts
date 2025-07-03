import { fabric } from 'fabric';
import { FabricObject } from '../models';
import AbstractHandler from './AbstractHandler';
declare class GridHandler extends AbstractHandler {
    constructor(handler: any);
    /**
     * Init grid
     *
     */
    initialize: () => void;
    private drawLine;
    private drawDot;
    /**
     * Set coords in grid
     * @param {(FabricObject | fabric.ActiveSelection)} target
     * @returns
     */
    setCoords: (target: FabricObject | fabric.ActiveSelection) => void;
}
export default GridHandler;
