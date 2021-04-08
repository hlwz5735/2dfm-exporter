import _2DFMScriptItem from "./2dfm-script-item"

export default class _2DFMScript {
    // CHAR[32]
    name: string
    // SHORT
    itemBeginIndex: number
    // 脚本项的个数
    itemCount: number
    /** 脚本项 */
    items: Array<_2DFMScriptItem> = []
    /** 是否为默认脚本 */
    isDefaultScript: boolean
    // BYTE
    unknownFlag1: number
    // BYTE[3]
    unknownBytes: Uint8Array
}
