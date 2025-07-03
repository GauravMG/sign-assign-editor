import { Component } from 'react';
import PropTypes from 'prop-types';
interface IProps {
    workflow?: any;
    selectedItem?: any;
}
declare class NodeDescriptor extends Component<IProps> {
    static propTypes: {
        selectedItem: PropTypes.Requireable<object>;
        workflow: PropTypes.Requireable<object>;
    };
    state: {
        loading: boolean;
    };
    shouldComponentUpdate(nextProps: any, nextState: any): boolean;
    handlers: {
        onTrigger: () => Promise<void>;
    };
    render(): JSX.Element;
}
export default NodeDescriptor;
