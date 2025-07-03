import React, { Component } from 'react';
import PropTypes from 'prop-types';
interface IProps {
    title?: React.ReactNode;
    leftSider?: React.ReactNode;
    content?: React.ReactNode;
    rightSider?: React.ReactNode;
    className?: string;
    loading?: boolean;
}
declare class Content extends Component<IProps> {
    static propTypes: {
        title: PropTypes.Requireable<any>;
        leftSider: PropTypes.Requireable<any>;
        content: PropTypes.Requireable<any>;
        rightSider: PropTypes.Requireable<any>;
        className: PropTypes.Requireable<string>;
        loading: PropTypes.Requireable<boolean>;
    };
    static defaultProps: {
        className: string;
        loading: boolean;
    };
    render(): JSX.Element;
}
export default Content;
