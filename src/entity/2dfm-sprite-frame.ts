export default class _2DFMSpriteFrame {
    // 所属文件的偏移度
    offset: number
    width: number
    height: number
    hasPrivatePalettle: boolean
    size: number
    
    get compressed(): boolean {
        return this.size !== 0
    }
    
    get realSize(): number {
        let size = 0
        if (this.hasPrivatePalettle) {
            size += 1024
        }
        size += this.width * this.height
        return size
    }

    unknownFlag1: number
}