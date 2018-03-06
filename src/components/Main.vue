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
import {Chord} from '../ts/timbre'

const {sqrt} = Math

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
    const chordA = new Chord(12)
    chordA.start()

    /**
     * handle touch event
     */
    const touchMove$ = Observable.fromEvent(cv, 'touchmove')
    touchMove$.subscribe((e) => {
      const event = e as TouchEvent
      event.preventDefault()
      this.px = event.touches[0].pageX.toFixed(3)
      this.py = event.touches[0].pageY.toFixed(3)
    })
    cv.addEventListener('touchstart', (e) => { e.preventDefault() })

    const deltaMove$ = touchMove$.pluck('touches').pairwise()
    const moveSpeedSquare$ = deltaMove$.map((touchesX2) => {
      const first = touchesX2[0] as TouchList
      const second = touchesX2[1] as TouchList

      const dx = second[0].pageX - first[0].pageX
      const dy = second[0].pageY - first[0].pageY

      return dx * dx + dy * dy
    })

    let timerID = -1
    moveSpeedSquare$.subscribe((x) => {
      this.speedSquare = x.toFixed(3)
      chordA.setAmp(x / 1000)

      // 速度需要回落到0
      window.clearTimeout(timerID)
      timerID = window.setTimeout(() => {
        this.speedSquare = '0'
        chordA.setAmp(0)
      }, 16)
    })
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
