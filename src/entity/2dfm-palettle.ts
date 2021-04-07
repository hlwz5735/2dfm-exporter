export default class _2DFMPalettle {
    // 所属文件的偏移度
    offset: number
    /** 是否为私有调色盘 */
    isPrivate = false
    // 调色盘颜色，共256个
    colors = new Array<PalettleColor>(256)
    // BYTE[32]，只有公共调色盘才有
    unknownGap?: Uint8Array
}

class PalettleColor {
    rawData: Uint8Array = new Uint8Array(4)
    
    get intValue() {
        return this.rawData[0] << 24 +
            this.rawData[1] << 16 +
            this.rawData[2] << 8 +
            this.rawData[0]
    }

    get hexValue() {
        const hexStr = this.intValue.toString(16)
        if (hexStr.length < 8) {
            return '0x0' + hexStr
        }
        return '0x' + hexStr
    }

    get rgbaValue() {
        return `rgba(${this.rawData[0]}, ${this.rawData[1]}, ${this.rawData[2]}, ${this.rawData[3] / 255.0})`
    }
}
