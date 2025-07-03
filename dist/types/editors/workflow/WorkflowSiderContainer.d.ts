import React, { Component } from 'react';
import PropTypes from 'prop-types';
interface IProps {
    title?: React.ReactNode;
    content?: React.ReactNode;
    icon?: string;
    extra?: React.ReactNode;
    titleStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
}
declare class WorkflowSiderContainer extends Component<IProps> {
    static propTypes: {
        children: PropTypes.Requireable<any>;
        title: PropTypes.Requireable<string>;
        icon: PropTypes.Requireable<string>;
        content: PropTypes.Requireable<any>;
        extra: PropTypes.Requireable<any>;
        titleStyle: PropTypes.Requireable<object>;
        contentStyle: PropTypes.Requireable<object>;
    };
    render(): JSX.Element;
}
export default WorkflowSiderContainer;
