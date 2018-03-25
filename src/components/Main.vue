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

import {PluckArea} from '@/ts/pluck'

const {sqrt, abs, log} = Math
const actx = getAudioCtx()

let _tmp: any


export default Vue.extend({
  name: 'Main',
  data () {
    return {
      oscStarted: false,
      squareSpeed: 'squareSpeed: ' + (0).toFixed(6).padStart(12, '_'),
      released: true,
      pluckInXDir: true,
      tune: new Tune(tunes['bach1'], 0),
      chordA: new Chord(-12)
    }
  },
  methods: {
  },
  mounted () {
    const cv = getCV()
    const ctx = get2dCtx()

    // 0 点击启动振荡器
    cv.addEventListener('click', (e) => {
      // start osc here
      this.oscStarted = true
    })

    // 1 禁用默认touch事件
    cv.addEventListener('touchstart', (e) => {
      this.oscStarted && e.preventDefault()
    })
    cv.addEventListener('touchmove', (e) => { e.preventDefault() })

    // 2 初始化弦区
    cv.width = window.innerWidth
    cv.height = window.innerHeight
    const pluckArea = new PluckArea(null)
    pluckArea.init()

    // 3 分离finger和pluck
    const fingers: any[] = []
    const plucks: any[] = []

    const touchmove$ = Observable.fromEvent(cv, 'touchmove')
    touchmove$.subscribe((e) => {
      const touchList = (e as TouchEvent).touches
      Array.prototype.forEach.call(touchList, (touch: Touch) => {
        
      })
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
