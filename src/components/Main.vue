<template>
  <div>
    <p>{{eventCount}}, {{touchList}}</p>
    <canvas id="cv">
    </canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {getCV, get2dCtx} from '../ts/main-canvas'
let a = 0
export default Vue.extend({
  name: 'Main',
  data () {
    return {
      eventCount: a,
      touchList: 'none',
    }
  },
  mounted () {
    const cv = getCV()
    const ctx = get2dCtx()

    cv.width = window.innerWidth * 0.95
    cv.height = window.innerHeight * 0.95

    /**
     * let {Astr, Dstr, Gstr, Cstr} = createString()
     */
    cv.addEventListener('touchstart', (e) => { e.preventDefault() })
    cv.addEventListener('touchmove', (e) => {
      e.preventDefault() // 阻止浏览器手势，页面不会被撸来撸去
      this.eventCount = a++
      this.touchList = JSON.stringify(e.touches, null, 2)
    })
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
