import PropTypes from 'prop-types';
import React from 'react';
import { CanvasInstance, FabricObject } from '../../canvas';
interface IProps {
    instance: CanvasInstance;
    descriptors: any[];
    selectedItem?: FabricObject;
}
declare class WorkflowItems extends React.Component<IProps> {
    static propTypes: {
        canvasRef: PropTypes.Requireable<any>;
        descriptors: PropTypes.Requireable<object>;
    };
    state: {
        activeKey: never[];
        collapse: boolean;
        textSearch: string;
        descriptors: never[];
        filteredDescriptors: never[];
    };
    private item;
    private intersectedLink?;
    private links;
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: any): void;
    shouldComponentUpdate(nextProps: any, nextState: any): boolean;
    componentWillUnmount(): void;
    handlers: {
        addItem: (item: any, centered?: boolean) => void;
        onChangeActiveKey: (activeKey: any) => void;
        onCollapse: () => void;
        onSearchNode: (e: any) => void;
    };
    events: {
        onDragStart: (e: any, item: any) => void;
        onDragOver: (e: any) => boolean;
        onDragEnter: (e: any) => void;
        onDragLeave: (e: any) => void;
        onDrop: (e: any) => boolean;
        onDragEnd: (e: any, item?: any) => void;
    };
    waitForCanvasRender: (canvas: any) => void;
    attachEventListener: (canvasRef: any) => void;
    detachEventListener: (canvasRef: any) => void;
    renderItems: (items: any) => JSX.Element;
    render(): JSX.Element;
}
export default WorkflowItems;
