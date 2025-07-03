import PropTypes from 'prop-types';
import { Component } from 'react';
import { CanvasInstance } from '../../canvas';
interface IProps {
    instance: CanvasInstance;
    zoomRatio: number;
    debugEnabled?: boolean;
    setDebugEnabled?: any;
}
declare class WorkflowToolbar extends Component<IProps> {
    static propTypes: {
        instance: PropTypes.Requireable<any>;
        selectedItem: PropTypes.Requireable<object>;
        zoomRatio: PropTypes.Requireable<number>;
    };
    state: {
        interactionMode: string;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    handlers: {
        selection: () => void;
        grab: () => void;
    };
    events: {
        keydown: (e: any) => false | undefined;
    };
    waitForCanvasRender: (canvas: any) => void;
    attachEventListener: (instance: any) => void;
    detachEventListener: (instance: any) => void;
    render(): JSX.Element;
}
export default WorkflowToolbar;
