<template>
  <div>
    <p>{{squareSpeed}}, released: {{released}}, dir: {{pluckInXDir?'x':'y'}}</p>
    <!-- <input type="button" @click="changePluckDir">Change Pluck Direction</input> -->
    <canvas id="cv">
    </canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Observable, Subject} from 'rxjs'

import {getCV, get2dCtx} from '../ts/main-canvas'
import {Chord, getAudioCtx} from '../ts/timbre'
import {genFuncDrawCurve, drawCircle, Tune} from '../ts/utils'

const {sqrt, abs} = Math
const actx = getAudioCtx()

let _tmp: any

// const step = [3,5,7,8,10,12,14]
// -------------[1,2,3,4,5 ,6 ,7 ]
const tuneList = [
  10, 12, 10, 7, 10, 7, 5, 3, -2, 0, 3, 5, 10, 7,
  10, 12, 10, 7, 10, 7, 5, 3, -2, 0, 3, -2, 5, 3,
  -2, 0, 2, 3, 5,
  7, 7, 7, 5, 7, 12, 10, 7, 5, 7, 12, 10,
  12, 14, 15, 10, 7, 10, 12, 10, 7, 5, 3, -2, 5, 3,
]

export default Vue.extend({
  name: 'Main',
  data () {
    return {
      squareSpeed: 'squareSpeed: ' + (0).toFixed(6).padStart(12, '_'),
      released: true,
      pluckInXDir: true,
      tune: new Tune(tuneList),
    }
  },
  methods: {
    changePluckDir () {
      this.pluckInXDir = !this.pluckInXDir
    },
  },
  mounted () {
    const cv = getCV()
    const ctx = get2dCtx()

    cv.width = window.innerWidth * 0.95
    cv.height = window.innerHeight * 0.95

    /**
     * handle chords
     */
    const chordA = new Chord(-12)
    chordA.start()

    /**
     * handle touch event
     */
    const touchEnd$ = Observable.fromEvent(cv, 'touchend')
    touchEnd$.subscribe((e) =>  {
      const event = e as TouchEvent
      this.released = true
    })

    const touchMove$ = Observable.fromEvent(cv, 'touchmove')
    touchMove$.subscribe((e) => {
      const event = e as TouchEvent
      event.preventDefault()
    })
    cv.addEventListener('touchstart', (e) => { e.preventDefault() })

    let newTouchStartPosition: Touch | null
    const deltaMove$ = touchMove$
    .pluck('touches')
    .filter((touches) => {
      // 如果处于释放状态，那么放弃emmit当前位置，并且置于非释放状态
      if (this.released) {
        this.released = false
        newTouchStartPosition = (touches as TouchList)[0]
        return false
      }
      _tmp = (touches as any)[0]
      return true
    })
    .pairwise()
    const velocity$ = deltaMove$.map((touchesX2) => {
      const first = touchesX2[0] as TouchList
      const second = touchesX2[1] as TouchList

      let pluckTouch0 = first[0]
      let pluckTouch1 = second[0]

      if (newTouchStartPosition) {
        pluckTouch0 = newTouchStartPosition
        newTouchStartPosition = null
      }
      
      drawCircle(pluckTouch0.pageX, pluckTouch0.pageY, '#fff')
      drawCircle(pluckTouch1.pageX, pluckTouch1.pageY, '#84c')

      const vx = pluckTouch1.pageX - pluckTouch0.pageX
      const vy = pluckTouch1.pageY - pluckTouch0.pageY

      return {vx, vy}
    })

    let timerID = -1
    const drawCurve = genFuncDrawCurve()
    velocity$.pairwise().subscribe((velocities) => {
      const v0 = velocities[0]
      const v1 = velocities[1]

      let redirect: boolean
      if (this.pluckInXDir) {
        redirect = (v0.vx * v1.vx < 0) || (v1.vx === 0 && v0.vx !== 0)
      } else {
        redirect = (v0.vy * v1.vy < 0) || (v1.vy === 0 && v0.vy !== 0)
      }

      const squareSpeed = this.pluckInXDir ? v1.vx * v1.vx : v1.vy * v1.vy

      let intensity = sqrt(squareSpeed) + 0.1
      let timeConstant = 0.4
      let startTime = actx.currentTime
      let fillStyle = '#48c'

      if (!this.released && redirect) {
        // 来回扯，应力没有释放，音断，音强增加
        intensity = intensity + 1.25 ** (intensity + 1)
        timeConstant = 1 / intensity
        startTime += 0.01
        chordA.silent(false)
        fillStyle = '#c84'

        chordA.pitch = this.tune.nextChord()
        console.log(intensity.toFixed(3), timeConstant.toFixed(3))
      }
      chordA.setAmp(intensity / 100, startTime, timeConstant)
      drawCurve(intensity, fillStyle)

      this.squareSpeed = 'squareSpeed: ' + squareSpeed.toFixed(6).padStart(12, '_')
      // 速度需要回落到0
      window.clearTimeout(timerID)
      timerID = window.setTimeout(() => {
        this.squareSpeed = 'squareSpeed: ' + (0).toFixed(6).padStart(12, '_')
        chordA.silent(true)
        this.released = true
      }, 50)
    })
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
}
p {
  text-align: left;
  font-family: 'menlo';
}
</style>
