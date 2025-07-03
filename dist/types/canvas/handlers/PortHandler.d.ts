import { NodeObject } from '../objects/Node';
import Handler from './Handler';
declare class PortHandler {
    handler?: Handler;
    constructor(handler: Handler);
    /**
     * Create port
     * @param {NodeObject} target
     */
    create: (target: NodeObject) => void;
    /**
     * Set coords port
     * @param {NodeObject} target
     */
    setCoords: (target: NodeObject) => void;
    /**
     * Recreate port
     * @param {NodeObject} target
     */
    recreate: (target: NodeObject) => void;
}
export default PortHandler;
