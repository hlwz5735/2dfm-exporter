import { promises } from 'fs'
import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMScript from '@/entity/2dfm-script'
import _2DFMScriptItem from '@/entity/2dfm-script-item'
import _2DFMSpriteFrame from '@/entity/2dfm-sprite-frame'
import _2DFMSound from '@/entity/2dfm-sound'
import { readPalette } from '@/util/2dfm-palette-reader'
import { byteToInt, byteToUShort } from './byte-convert-util'
const fs = promises

export async function read2DFMPlayerFile(path: string): Promise<_2DFMPlayer> {
    const player = new _2DFMPlayer()

    const fh = await fs.open(path, 'r')

    let offset = 0
    let read = await fh.read(new Uint8Array(16), 0, 16, offset)
    offset += 16
    player.signature = read.buffer

    read = await fh.read(new Uint8Array(256), 0, 256, offset)
    offset += 256
    player.name = decodeToGb2312(read.buffer) || '非法内容'

    read = await fh.read(new Uint8Array(4), 0, 4, offset)
    offset += 4
    player.scriptCount = byteToInt(read.buffer)

    const scriptBytes = player.scriptCount * 39
    read = await fh.read(new Uint8Array(scriptBytes), 0, scriptBytes, offset)
    offset += scriptBytes

    // 读取脚本表信息，第一遍只获取脚本表的数据，不获取格子数据
    for (let i = 0; i < player.scriptCount; i++) {
        const script = new _2DFMScript()

        const innerOffset = i * 39
        const innerBytes = read.buffer.slice(innerOffset, innerOffset + 39)

        script.name = decodeToGb2312(innerBytes.slice(0, 32)) || '非法内容'
        script.itemBeginIndex = byteToUShort(innerBytes, 32)
        script.unknownFlag1 = innerBytes[34]
        script.isDefaultScript = innerBytes[35] === 1
        script.unknownBytes = innerBytes.slice(36, 39)

        player.scripts.push(script)
    }

    read = await fh.read(new Uint8Array(4), 0, 4, offset)
    offset += 4
    player.scriptItemCount = byteToInt(read.buffer)

    // 每个脚本格子16字节
    const scriptItemBytes = player.scriptItemCount * 16
    read = await fh.read(new Uint8Array(scriptBytes), 0, scriptBytes, offset)
    offset += scriptItemBytes
    const scriptItems: Array<_2DFMScriptItem> = []
    // 读取脚本格子信息
    for (let i = 0; i < player.scriptItemCount; i++) {
        const scriptItem = new _2DFMScriptItem()

        const innerOffset = i * 16
        const innerBytes = read.buffer.slice(innerOffset, innerOffset + 16)

        scriptItem.type = innerBytes[0]
        scriptItem.parameters = innerBytes.slice(1)

        scriptItems.push(scriptItem)
    }
    // 将格子信息分配给脚本
    for (let i = 0; i < player.scriptCount; i++) {
        const script = player.scripts[i]
        script.items = scriptItems.slice(script.itemBeginIndex, script.itemBeginIndex + script.itemCount)
    }

    // 精灵帧的读取
    read = await fh.read(new Uint8Array(4), 0, 4, offset)
    offset += 4
    player.spriteFrameCount = byteToInt(read.buffer)
    for (let i = 0; i < player.spriteFrameCount; i++) {
        const frame = new _2DFMSpriteFrame()
        frame.offset = offset
        frame.index = i

        read = await fh.read(new Uint8Array(20), 0, 20, offset)
        offset += 20
        const headBytes = read.buffer

        frame.unknownFlag1 = byteToInt(headBytes, 0)
        frame.width = byteToInt(headBytes, 4)
        frame.height = byteToInt(headBytes, 8)
        frame.hasPrivatePalette = byteToInt(headBytes, 12) === 1
        frame.size = byteToInt(headBytes, 16)

        if (frame.size !== 0) {
            offset += frame.size
        } else {
            if (frame.width * frame.height !== 0) {
                offset += frame.width * frame.height
                if (frame.hasPrivatePalette) {
                    offset += 1024
                }
            }
        }

        player.spriteFrames.push(frame)
    }

    // 公共调色盘的读取，一共8个公共调色盘
    const publicPaletteLength = 1024 + 32
    const paletteLength = publicPaletteLength * 8
    read = await fh.read(new Uint8Array(paletteLength), 0, paletteLength, offset)
    offset += paletteLength
    const paletteBuffer = read.buffer
    for (let i = 0; i < 8; i++) {
        player.publicPalettes.push(
          readPalette(paletteBuffer.slice(i * publicPaletteLength, (i + 1) * publicPaletteLength), false)
        )
    }

    // 声音信息的读取
    read = await fh.read(new Uint8Array(4), 0, 4, offset)
    offset += 4
    player.soundCount = byteToInt(read.buffer)
    for (let i = 0; i < player.soundCount; i++) {
        const sound = new _2DFMSound()
        sound.offset = offset
        const headLength = 42
        read = await fh.read(new Uint8Array(headLength), 0, headLength, offset)
        offset += headLength
        const buffer = read.buffer
        sound.unknownFlag = byteToInt(buffer)
        sound.name = decodeToGb2312(buffer.slice(4, 36)) || '非法内容'
        sound.size = byteToInt(buffer, 36)
        sound.unknownFlag2 = byteToUShort(buffer, 40)

        offset += sound.size

        player.sounds.push(sound)
    }

    fh.close()
    return player
}

const textDecoder = new TextDecoder('gb2312')
function decodeToGb2312(buffer: Uint8Array) {
    const rawStr = textDecoder.decode(buffer)
    const endIdx = rawStr.indexOf('\u0000')
    if (endIdx !== -1) {
        return rawStr.substr(0, endIdx)
    }
    return rawStr
}
