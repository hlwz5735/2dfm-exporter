import Vue, { VNode } from 'vue'
import { IpcRenderer, Remote } from 'electron'
import fs from 'fs'

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
    remote: Remote;
    fs: fs.promises;
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
