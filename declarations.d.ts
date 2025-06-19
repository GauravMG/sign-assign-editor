declare module 'ag-psd' {
  export interface ReadPsdOptions {
    skipCompositeImageData?: boolean;
  }

  export interface Psd {
    canvas?: HTMLCanvasElement;
    children?: Array<{
      name: string;
      canvas?: HTMLCanvasElement;
    }>;
  }

  export function readPsd(buffer: Uint8Array, options?: ReadPsdOptions): Psd;
}
