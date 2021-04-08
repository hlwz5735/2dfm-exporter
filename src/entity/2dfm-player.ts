import _2DFMPalette from './2dfm-palette'
import _2DFMScript from './2dfm-script'
import _2DFMSound from './2dfm-sound'
import _2DFMSpriteFrame from './2dfm-sprite-frame'

export default class _2DFMPlayer {
    // BYTE[16]
    signature: Uint8Array
    // CHAR[256]
    name: string

    // int
    scriptCount: number
    // _2DFMScript[scriptCount]
    scripts: Array<_2DFMScript> = []

    // int
    scriptItemCount: number

    // int
    spriteFrameCount: number
    // _2DFMSpriteFrame[spriteFrameCount]
    spriteFrames: Array<_2DFMSpriteFrame> = []

    // 8个公共调色盘
    publicPalettes: Array<_2DFMPalette> = []

    soundCount: number
    sounds: Array<_2DFMSound> = []
}
