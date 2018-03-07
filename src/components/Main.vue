<template>
  <div>
    <p>{{speedSquare}}</p>
    <div>{{px}}</div>
    <div>{{py}}</div>
    <canvas id="cv">
    </canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Observable, Subject} from 'rxjs'

import {getCV, get2dCtx} from '../ts/main-canvas'
import {Chord, getAudioCtx} from '../ts/timbre'

const {sqrt} = Math
const actx = getAudioCtx()

export default Vue.extend({
  name: 'Main',
  data () {
    return {
      px: '0.000',
      py: '0.000',
      speedSquare: '0',
    }
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
    let released = true
    const touchEnd$ = Observable.fromEvent(cv, 'touchend')
    touchEnd$.subscribe((e) =>  {
      const event = e as TouchEvent
      released = true
    })

    const touchMove$ = Observable.fromEvent(cv, 'touchmove')
    touchMove$.subscribe((e) => {
      const event = e as TouchEvent
      event.preventDefault()
      this.px = event.touches[0].pageX.toFixed(3)
      this.py = event.touches[0].pageY.toFixed(3)
      released = false
    })
    cv.addEventListener('touchstart', (e) => { e.preventDefault() })

    const deltaMove$ = touchMove$.pluck('touches').pairwise()
    const velocity$ = deltaMove$.map((touchesX2) => {
      const first = touchesX2[0] as TouchList
      const second = touchesX2[1] as TouchList

      const vx = second[0].pageX - first[0].pageX
      const vy = second[0].pageY - first[0].pageY

      return {vx, vy}
    })


    let timerID = -1
    velocity$.pairwise().subscribe((velocities) => {
      const v0 = velocities[0]
      const v1 = velocities[1]

      const dvx = v1.vx - v0.vx
      const dvy = v1.vy - v0.vy
      const aspect = v1.vx * v0.vx + v1.vy * v1.vx

      const squareSpeed = dvx * dvx + dvy * dvy
      let intensity = sqrt(squareSpeed) + 0.1
      let timeConstant = 0.05
      let startTime = actx.currentTime
      if (!released && aspect <= 0) {
        // 来回扯，应力没有释放，音断，音强增加
        intensity = intensity ** 1.25
        timeConstant = 0.06
        startTime += 0.01
        chordA.silent(false)
      } 
      chordA.setAmp(intensity / 100, startTime, timeConstant)
      console.log(intensity)

      this.speedSquare = JSON.stringify(squareSpeed)
      // 速度需要回落到0
      window.clearTimeout(timerID)
      timerID = window.setTimeout(() => {
        this.speedSquare = '0'
        chordA.silent(true)
        released = true
      }, 50)
    })
    // moveSpeedSquare$.subscribe((x) => {
    //   this.speedSquare = x.toFixed(3)
    //   // chordA.setAmp(x / 1000)
    //   chordA.setAmp(0.3, sqrt(x / 1000))

    //   // 速度需要回落到0
    //   window.clearTimeout(timerID)
    //   timerID = window.setTimeout(() => {
    //     this.speedSquare = '0'
    //     chordA.silent()
    //   }, 50)
    // })
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
