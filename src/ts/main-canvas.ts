/**
 * main-canvas.ts
 */

export function getCV () {
  const cv = document.querySelector('#cv') as HTMLCanvasElement
  if (!cv) { throw Error('canvas not supported') }
  return cv
}

export function get2dCtx () {
  const ctx = getCV()
  if (!ctx) { throw Error('can not get 2d context') }
  return ctx
}


