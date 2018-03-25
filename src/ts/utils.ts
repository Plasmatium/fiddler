/**
 * color defination:
 * https://palettable.io/FF8800-FAF3B4-A8845B-5E485D-7155D9
 * https://palettable.io/C5CFA9-9CDBB9-79EDEB-38A8C9-FA9B6B
 */

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
    const y = cv.height - 50 - (log(val) / log(10) + 3) * 150
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
  constructor (private chordList: number[], private octave = 0) {
  }
  public nextChord () {
    if (this.position === this.chordList.length) {
      this.position = 0
    }
    const next = this.chordList[this.position] + this.octave * 12
    this.position++
    return next
  }
}

export function inArea (pt: Point, area: Square) {
  if (pt.x <= area.x || pt.x >= area.x + area.w) {
    return false
  }
  if (pt.y <= area.y || pt.y >= area.y + area.h) {
    return false
  }
  return true
}