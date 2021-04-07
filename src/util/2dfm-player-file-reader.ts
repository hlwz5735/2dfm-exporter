import _2DFMPlayer from '@/entity/2dfm-player'
import _2DFMScript from '@/entity/2dfm-script'
import { promises } from 'fs'
import { byteToInt, byteToUShort } from './byte-convert-util'
const fs = promises

export async function read2DFMPlayerFile(path: string): Promise<_2DFMPlayer> {
    const textDecoder = new TextDecoder('gb2312')
    const player = new _2DFMPlayer()

    const fh = await fs.open(path, 'r')
    
    let offset = 0
    let read = await fh.read(new Uint8Array(16), 0, 16, offset)
    offset += 16
    player.signature = read.buffer

    read = await fh.read(new Uint8Array(256), 0, 256, offset)
    offset += 256
    player.name = textDecoder.decode(read.buffer) || '非法内容'

    read = await fh.read(new Uint8Array(4), 0, 4, offset)
    offset += 4
    player.scriptCount = byteToInt(read.buffer)

    const scriptBytes = player.scriptCount * 39
    read = await fh.read(new Uint8Array(scriptBytes), 0, scriptBytes, offset)
    offset += scriptBytes

    for (let i = 0; i < player.scriptCount; i++) {
        const innerOffset = i * 39
        const script = new _2DFMScript()
        script.offset = offset + innerOffset
        const innerBytes = read.buffer.slice(innerOffset, innerOffset + 39)
        script.name = textDecoder.decode(innerBytes.slice(0, 32)) || '非法内容'
        script.itemBeginIndex = byteToUShort(innerBytes, 32)
        script.unknownFlag1 = innerBytes[34]
        script.isDefaultScript = innerBytes[35] === 1
        script.unknownBytes = innerBytes.slice(36, 39)
    }

    return player
}