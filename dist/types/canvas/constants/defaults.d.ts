import { CanvasOption, FabricObjectOption, GridOption, WorkareaObject } from '../models';
export declare const canvasOption: CanvasOption;
export declare const keyEvent: {
    move: boolean;
    all: boolean;
    copy: boolean;
    paste: boolean;
    esc: boolean;
    del: boolean;
    clipboard: boolean;
    transaction: boolean;
    zoom: boolean;
    cut: boolean;
    grab: boolean;
};
export declare const gridOption: GridOption;
export declare const workareaOption: Partial<WorkareaObject>;
export declare const objectOption: Partial<FabricObjectOption>;
export declare const guidelineOption: {
    enabled: boolean;
};
export declare const activeSelectionOption: {
    hasControls: boolean;
};
export declare const propertiesToInclude: string[];
