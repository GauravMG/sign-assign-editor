import React, { Component } from 'react';
interface IProps {
    workflow?: any;
    onChange?: (selected: any, changedValues: any, allValues: any) => void;
}
interface IState {
    isEdit: boolean;
}
declare class WorkflowInfo extends Component<IProps, IState> {
    formRef: React.RefObject<any>;
    constructor(props: IProps);
    handlers: {
        onClick: () => Promise<void>;
    };
    render(): JSX.Element;
}
export default WorkflowInfo;
