import Vue, { VNode } from 'vue'
import { IpcRenderer, Remote } from 'electron'

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
    remote: Remote;
    fs: any;
    TextDecoder: any;
    zlib: any;
  }

  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
