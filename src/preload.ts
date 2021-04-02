import { ipcRenderer, remote } from 'electron'
import * as fs from 'fs'
import * as zlib from 'zlib'
import { TextDecoder } from 'util'

window.ipcRenderer = ipcRenderer
window.remote = remote
window.fs = fs.promises
window.TextDecoder = TextDecoder
window.zlib = zlib
