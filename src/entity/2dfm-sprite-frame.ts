import _2DFMPalette from '@/entity/2dfm-palette'

export default class _2DFMSpriteFrame {
    // 所属文件的偏移度
    offset: number
    index: number
    width: number
    height: number
    hasPrivatePalette: boolean
    privatePalette: _2DFMPalette | null = null
    size: number

    compressed(): boolean {
        return this.size !== 0
    }

    realSize(): number {
        let size = 0
        if (this.hasPrivatePalette) {
            size += 1024
        }
        size += this.width * this.height
        return size
    }

    unknownFlag1: number
}
