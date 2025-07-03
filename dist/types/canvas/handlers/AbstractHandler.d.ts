import { Handler } from '.';
import { FabricCanvas } from '../models';
export default abstract class AbstractHandler {
    protected handler: Handler;
    protected canvas: FabricCanvas;
    constructor(handler: Handler);
    protected initialize(): void;
}
