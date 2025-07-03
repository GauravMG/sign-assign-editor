import React from 'react';
import { FabricObject } from '../../canvas';
import { CanvasInstance } from '../../canvas/Canvas';
interface IState {
    loading: boolean;
    zoomRatio: number;
    workflow: any;
    selectedItem: any;
    descriptors: any;
    editing: boolean;
}
declare class WorkflowEditor extends React.Component {
    state: IState;
    canvasRef: CanvasInstance;
    nodeConfigurationRef: any;
    container: any;
    componentDidMount(): void;
    canvasHandlers: {
        onZoom: (zoom: any) => void;
        onAdd: (target: FabricObject) => void;
        onSelect: (target: any) => void;
        onRemove: () => void;
        onModified: (target: any) => void;
    };
    handlers: {
        onImport: (files: any) => void;
        onUpload: () => void;
        onDownload: () => void;
        exportJsonCode: () => any;
        onChange: (selectedItem: any, changedValues: any, allValues: any) => void;
    };
    showLoading: () => void;
    hideLoading: () => void;
    changeEditing: (editing: any) => void;
    render(): JSX.Element;
}
export default WorkflowEditor;
