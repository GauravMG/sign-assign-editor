import { FabricGroup, FabricObject, FabricObjectOption } from '../models';
export type SvgObject = (FabricGroup | FabricObject) & {
    loadSvg(option: SvgOption): Promise<SvgObject>;
    setFill(value: string, filter?: (obj: FabricObject) => boolean): SvgObject;
    setStroke(value: string, filter?: (obj: FabricObject) => boolean): SvgObject;
};
export interface SvgOption extends FabricObjectOption {
    src?: string;
    /**
     *
     * @deprecated
     * @type {*}
     */
    svg?: any;
    loadType?: 'file' | 'svg';
    keepSize?: boolean;
}
declare const Svg: any;
export default Svg;
