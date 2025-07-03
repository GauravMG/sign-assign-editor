import React from "react";
interface CanvasSizePanelProps {
    onApplySize: (width: number, height: number) => void;
    maxWidth: number;
    maxHeight: number;
}
declare const CanvasSizePanel: React.FC<CanvasSizePanelProps>;
export default CanvasSizePanel;
