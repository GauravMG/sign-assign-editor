import React from 'react';
type EditorType = 'imagemap' | 'workflow' | 'hexgrid' | 'fiber' | 'graphics';
interface IState {
    activeEditor?: EditorType;
}
declare class App extends React.Component<any, IState> {
    state: IState;
    handleChangeEditor: ({ key }: {
        key: any;
    }) => void;
    renderEditor: (activeEditor: EditorType) => JSX.Element;
    render(): JSX.Element;
}
export default App;
