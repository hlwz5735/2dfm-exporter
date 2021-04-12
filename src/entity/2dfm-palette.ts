export default class _2DFMPalette {
    /** 是否为私有调色盘 */
    isPrivate = false
    // 调色盘颜色，共256个
    colors: Array<PaletteColor> = []
    // BYTE[32]，只有公共调色盘才有
    unknownGap?: Uint8Array

    pushBGRA(buffer: Uint8Array, index = 0): void {
        const color = new PaletteColor()
        color.rawData[0] = buffer[index + 2]
        color.rawData[1] = buffer[index + 1]
        color.rawData[2] = buffer[index]
        if (this.isPrivate) {
            color.rawData[3] = (color.rawData[0] + color.rawData[1] + color.rawData[2] === 0) ? 0 : 255
        } else {
            color.rawData[3] = buffer[index + 3] === 0 ? 0 : 255
        }
        this.colors.push(color)
    }
}

export class PaletteColor {
    rawData: Uint8Array = new Uint8Array(4)

    intValue(): number {
        return this.rawData[0] << 24 +
            this.rawData[1] << 16 +
            this.rawData[2] << 8 +
            this.rawData[0]
    }

    hexValue(): string {
        const hexStr = this.intValue().toString(16)
        if (hexStr.length < 8) {
            return '0x0' + hexStr
        }
        return '0x' + hexStr
    }

    rgbaValue(): string {
        return `rgba(${this.rawData[0]}, ${this.rawData[1]}, ${this.rawData[2]}, ${this.rawData[3] / 255.0})`
    }
}
