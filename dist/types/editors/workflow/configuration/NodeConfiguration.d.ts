import PropTypes from 'prop-types';
import { Component } from 'react';
import { CanvasInstance } from '../../../canvas';
export declare const getNode: (nodeClazz: any) => any;
export declare const getConfiguration: (clazz: any) => any;
export declare const getEllipsis: (text: any, length: any) => any;
interface IProps {
    canvasRef?: CanvasInstance;
    selectedItem?: any;
    form?: any;
    workflow?: any;
}
export default class NodeConfiguration extends Component<IProps> {
    static propTypes: {
        canvasRef: PropTypes.Requireable<any>;
        selectedItem: PropTypes.Requireable<object>;
        form: PropTypes.Requireable<object>;
        workflow: PropTypes.Requireable<object>;
    };
    state: {
        errors: null;
    };
    UNSAFE_componentWillReceiveProps(nextProps: any): void;
    getForm(form: any, configuration: any, key: any, formConfig: any): JSX.Element;
    createForm(canvasRef: any, form: any, selectedItem: any): JSX.Element[] | null;
    handlers: {
        onValidate: (errors: any) => void;
        aceEditorValidator: (rule: any, value: any, callback: any) => void;
    };
    render(): JSX.Element[] | null;
}
export {};
