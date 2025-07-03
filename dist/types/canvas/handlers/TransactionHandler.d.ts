/// <reference types="lodash" />
import { FabricObject } from '../models';
import AbstractHandler from './AbstractHandler';
export type TransactionType = 'add' | 'remove' | 'modified' | 'moved' | 'scaled' | 'rotated' | 'skewed' | 'group' | 'ungroup' | 'paste' | 'bringForward' | 'bringToFront' | 'sendBackwards' | 'sendToBack' | 'redo' | 'undo' | 'layout';
export interface TransactionTransform {
    scaleX?: number;
    scaleY?: number;
    skewX?: number;
    skewY?: number;
    angle?: number;
    left?: number;
    top?: number;
    flipX?: number;
    flipY?: number;
    originX?: string;
    originY?: string;
}
export interface TransactionEvent {
    json: string;
    type: TransactionType;
}
declare class TransactionHandler extends AbstractHandler {
    private readonly MAX_HISTORY_SIZE;
    private currentObjects;
    redos: TransactionEvent[];
    undos: TransactionEvent[];
    active: boolean;
    constructor(handler: any);
    /**
     * Initialize transaction handler
     *
     */
    protected initialize: () => void;
    private sortObjects;
    setDefaultObjects: (objects: FabricObject[]) => void;
    /**
     * Save transaction
     *
     * @param {TransactionType} type
     */
    save: (type: TransactionType) => void;
    /**
     * Undo transaction
     *
     */
    undo: import("lodash").DebouncedFuncLeading<() => void>;
    /**
     * Redo transaction
     *
     */
    redo: import("lodash").DebouncedFuncLeading<() => void>;
    /**
     * Replay transaction
     *
     * @param {TransactionEvent} transaction
     */
    replay: (transaction: TransactionEvent) => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
}
export default TransactionHandler;
