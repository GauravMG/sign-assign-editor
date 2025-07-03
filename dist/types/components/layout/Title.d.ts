import { ClickParam } from 'antd/lib/menu';
import React from 'react';
interface IProps {
    onChangeEditor: (param: ClickParam) => void;
    currentEditor: string;
}
declare class Title extends React.Component<IProps> {
    state: {
        visible: boolean;
    };
    componentDidMount(): void;
    handlers: {
        goGithub: () => void;
        goDocs: () => void;
        showHelp: () => void;
    };
    render(): JSX.Element;
}
export default Title;
