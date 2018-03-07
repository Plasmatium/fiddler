import { get2dCtx, getCV } from '@/ts/main-canvas'

const {log, floor, PI} = Math

export function genFuncDrawCurve () {
  const cv = getCV()
  const ctx = get2dCtx()

  let barCount = 0
  const barWidth = 6
  const barInterval = 8
  const barTotal = floor(cv.width / barInterval)
  return function drawCurve (val: number, fillStyle: string) {
    const x = barCount * barInterval
    const y = cv.height - (log(val) * 50 + 200)
    const h = 1000
    const w = barWidth
    ctx.fillStyle = fillStyle
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = '#fff'
    ctx.fillRect(x + barInterval, 130, w, h)
    barCount++
    if (barCount > barTotal) { barCount = 0 }
  }
}

export function drawCircle (x: number, y: number, color: string) {
  const cv = getCV()
  const ctx = get2dCtx()

  const r = 20
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 5
  ctx.arc(x, y, r, 0, 2 * PI)
  ctx.stroke()
}

export class Tune {
  private position = 0
  constructor (private chordList: number[]) {
  }
  public nextChord () {
    if (this.position === this.chordList.length) {
      this.position = 0
    }
    const next = this.chordList[this.position]
    this.position++
    return next
  }
}
