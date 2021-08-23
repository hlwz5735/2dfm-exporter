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
    const buffer = await fs.readFile(path)
    let offset = 0

    const player = new _2DFMPlayer()

    let size = 16
    player.signature = Uint8Array.from(buffer.slice(offset, offset + size))
    offset += size

    size = 256
    player.name = decodeToGb2312(Uint8Array.from(buffer.slice(offset, offset + size))) || '非法内容'
    offset += size

    size = 4
    player.scriptCount = byteToInt(Uint8Array.from(buffer.slice(offset, offset + size)))
    offset += size

    size = player.scriptCount * 39
    let read = buffer.slice(offset, offset + size)
    offset += size

    // 读取脚本表信息，第一遍只获取脚本表的数据，不获取格子数据
    for (let i = 0; i < player.scriptCount; i++) {
        const script = new _2DFMScript()

        const innerOffset = i * 39
        const innerBytes = read.slice(innerOffset, innerOffset + 39)

        script.name = decodeToGb2312(innerBytes.slice(0, 32)) || '非法内容'
        script.itemBeginIndex = byteToUShort(innerBytes, 32)
        script.unknownFlag1 = innerBytes[34]
        script.isDefaultScript = innerBytes[35] === 1
        script.unknownBytes = innerBytes.slice(36, 39)

        player.scripts.push(script)
    }

    size = 4
    player.scriptItemCount = byteToInt(Uint8Array.from(buffer.slice(offset, offset + size)))
    offset += size

    // 每个脚本格子16字节
    size = player.scriptItemCount * 16
    read = buffer.slice(offset, offset + size)
    offset += size
    const scriptItems: Array<_2DFMScriptItem> = []
    // 读取脚本格子信息
    for (let i = 0; i < player.scriptItemCount; i++) {
        const scriptItem = new _2DFMScriptItem()

        const innerOffset = i * 16
        const innerBytes = Uint8Array.from(read.slice(innerOffset, innerOffset + 16))

        scriptItem.type = innerBytes[0]
        scriptItem.parameters = innerBytes.slice(1)

        scriptItems.push(scriptItem)
    }

    player.scriptItems = scriptItems
    // 将格子信息分配给脚本
    for (let i = 0; i < player.scriptCount; i++) {
        const script = player.scripts[i]
        if (i < player.scriptCount - 1) {
            script.itemCount = player.scripts[i + 1].itemBeginIndex - script.itemBeginIndex
        } else {
            script.itemCount = player.scriptItemCount - script.itemBeginIndex
        }
        script.items = scriptItems.slice(script.itemBeginIndex, script.itemBeginIndex + script.itemCount)
    }

    // 精灵帧的读取
    size = 4
    player.spriteFrameCount = byteToInt(Uint8Array.from(buffer.slice(offset, offset + size)))
    offset += size
    for (let i = 0; i < player.spriteFrameCount; i++) {
        const frame = new _2DFMSpriteFrame()
        frame.offset = offset
        frame.index = i

        size = 20
        const headBytes = Uint8Array.from(buffer.slice(offset, offset + size))
        offset += size

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
    size = publicPaletteLength * 8
    const paletteBuffer = Uint8Array.from(buffer.slice(offset, offset + size))
    offset += size
    for (let i = 0; i < 8; i++) {
        player.publicPalettes.push(
          readPalette(paletteBuffer.slice(i * publicPaletteLength, (i + 1) * publicPaletteLength), false)
        )
    }

    // 声音信息的读取
    size = 4
    player.soundCount = byteToInt(Uint8Array.from(buffer.slice(offset, offset + size)))
    offset += size
    for (let i = 0; i < player.soundCount; i++) {
        const sound = new _2DFMSound()
        sound.offset = offset
        size = 42
        read = buffer.slice(offset, offset + size)
        offset += size
        sound.unknownFlag = byteToInt(read)
        sound.name = decodeToGb2312(read.slice(4, 36)) || '非法内容'
        sound.size = byteToInt(read, 36)
        sound.unknownFlag2 = byteToUShort(read, 40)

        offset += sound.size

        player.sounds.push(sound)
    }

    player.bytes = buffer
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
