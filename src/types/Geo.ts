class Vec2 {
  constructor(public x = 0, public y = 0) {
  }

  /**
   * 直接加另一个2维向量对象
   * @param other 向量对象
   */
  add(other: Vec2): Vec2
  /**
   * 数值方式加2维向量
   * @param x x分量
   * @param y y分量
   */
  add(x: number, y: number): Vec2
  add(p1: number | Vec2, p2?: number): Vec2 {
    if (p1 instanceof Vec2) {
      return new Vec2(this.x + p1.x, this.y + p1.y)
    } else {
      return new Vec2(this.x + p1, this.y + p2!)
    }
  }

  copy(other: Vec2): Vec2 {
    return new Vec2(other.x, other.y)
  }

  static ZERO = new Vec2(0, 0)
}

class Size {
  constructor(public width = 0, public height = 0) {
  }

  area(): number {
    return this.width * this.height
  }

  copy(): Size {
    return new Size(this.width, this.height)
  }
}

class Rect {
  /** 矩形中心点 */
  private originPoint: Vec2
  /** 矩形大小（1单位2像素） */
  private size: Size

  constructor(originPoint: Vec2, size: Size)
  constructor(point1: Vec2, point2: Vec2)
  constructor(x: number, y: number, width: number, height: number)
  constructor(p1: Vec2 | number, p2: Size | Vec2 | number, p3?: number, p4?: number) {
    if (typeof p1 === 'number') {
      this.originPoint = new Vec2((p1 as number), (p2 as number))
      this.size = new Size(p3, p4)
      return
    }
    if (p2 instanceof Vec2) {
      const width = Math.abs(p1.x - p2.x)
      const height = Math.abs(p1.y - p2.y)

      this.size = new Size(width, height)
      this.originPoint = new Vec2(Math.min(p1.x, p2.x) + width / 2, Math.min(p1.y, p2.y) + height / 2)
      return
    }
    this.originPoint = p1
    this.size = p2 as Size
  }
}

export {
  Vec2,
  Size,
  Rect
}
