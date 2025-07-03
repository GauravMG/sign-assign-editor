import React from 'react';
export interface ItemProps extends React.HTMLAttributes<any> {
    alignSelf?: 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'stretch';
    order?: number;
    flexGrow?: number | string;
    flexShrink?: number | string;
    flexBasis?: number | string;
    flex?: number | string;
}
declare const Item: React.SFC<ItemProps>;
export default Item;
