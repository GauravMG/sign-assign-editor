export declare function buildAdjustedText(adjustedLines: string[]): string;
export declare function getCharacterWidth(context: CanvasRenderingContext2D, char: string, fontSize: number, fontFamily: string): number;
export declare function adjustCharactersToFitWidth(context: CanvasRenderingContext2D, text: string, fontSize: number, fontFamily: string, rectWidth: number): string[];
export declare function fitTextToRect(context: CanvasRenderingContext2D, text: string, fontSize: number, fontFamily: string, rectWidth: number, rectHeight: number): {
    text: string;
    fontSize: number;
    height: number;
};
