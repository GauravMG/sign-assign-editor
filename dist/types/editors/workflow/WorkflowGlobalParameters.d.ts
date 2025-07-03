import React, { Component } from 'react';
interface IProps {
    workflow?: any;
    onChange?: any;
}
interface IState {
    types: string[];
    vars: Record<string, any>;
    selectedVar: any;
    visible: boolean;
    isEdit: boolean;
    errors: any;
}
declare class WorkflowGlobalParameters extends Component<IProps, IState> {
    formRef: React.RefObject<any>;
    constructor(props: IProps);
    getComponentByType: (type: string) => JSX.Element;
    getType: (variable: any) => "text" | "number" | "boolean" | "json";
    handlers: {
        onModalVisible: (visible: boolean) => void;
        onAdd: () => void;
        onClear: () => void;
        onDelete: (key: string) => void;
        onEdit: (variable: any) => void;
        onOk: () => Promise<void>;
        onCancel: () => void;
        onChange: (value: string) => void;
        onValidate: (errors: any) => void;
        keyValidator: (_: any, value: string) => Promise<void>;
        valueValidator: (_: any, value: any) => Promise<void>;
    };
    render(): JSX.Element;
}
export default WorkflowGlobalParameters;
