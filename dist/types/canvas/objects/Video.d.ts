import 'mediaelement';
import 'mediaelement/build/mediaelementplayer.min.css';
import { FabricElement } from '../models';
export interface VideoObject extends FabricElement {
    setSource: (source: string | File) => void;
    setFile: (file: File) => void;
    setSrc: (src: string) => void;
    file?: File;
    src?: string;
    videoElement?: HTMLVideoElement;
    player?: any;
}
declare const Video: any;
export default Video;
