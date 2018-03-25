import {Observable} from 'rxjs'
import { pluck } from 'rxjs/operators'
import { get2dCtx, getCV } from '@/ts/main-canvas'
import { inArea } from '@/ts/utils';

export class PluckArea {
  private newTouchStartPosition: Touch | null = null
  private pluckAreaConfig: any[] = []
  constructor (
    public plucks$: Array<Observable<Touch>> | null,
  ) {
  }
  // init 在mounted中调用，为了保证cv和ctx已经存在
  public init () {
    const ctx = get2dCtx()
    const cv = getCV()
    const pluckHeight = cv.height / 20

    // 画出弦区域, 把pluckArea堆叠4份
    const pluckColors = ['#79edeb', '#38a8c9', '#fa9b6b', '#9cdbb9']
    this.pluckAreaConfig = pluckColors.map((color, idx) => {
      return {
        color,
        area: {
          x: 0, y: cv.height - pluckHeight * (idx + 1),
          w: cv.width, h: pluckHeight
        }
      }
    })
    this.pluckAreaConfig.forEach((config, idx) => {
      const { x, y, w, h } = config.area
      const { color } = config
      ctx.fillStyle = color
      ctx.fillRect(x, y, w, h)
    })
    ctx.fillStyle = ''
  }
  public testArea (pt: Point) {
    this.pluckAreaConfig.forEach((config, idx) => {
      if (inArea(pt, config.area)) {
        return idx
      }
    })
  }
}
