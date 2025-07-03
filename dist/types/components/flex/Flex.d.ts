import React, { Component } from 'react';
import Item from './Item';
export interface BoxProps extends React.HTMLAttributes<any> {
    display?: 'flex' | 'inline-flex';
    flexDirection?: 'column-reverse' | 'column' | 'row-reverse' | 'row';
    flexWrap?: 'nowrap' | 'wrap-reverse' | 'wrap';
    flexFlow?: string;
    justifyContent?: 'center' | 'flex-end' | 'flex-start' | 'space-around' | 'space-between' | 'space-evenly';
    alignItems?: 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch';
    alignContent?: 'center' | 'flex-end' | 'flex-start' | 'space-around' | 'space-between' | 'stretch';
    alignSelf?: 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch';
    order?: number;
    flexGrow?: number | string;
    flexShrink?: number | string;
    flexBasis?: number | string;
    flex?: number | string;
}
declare class Flex extends Component<BoxProps> {
    static Item: typeof Item;
    render(): JSX.Element;
}
export default Flex;
