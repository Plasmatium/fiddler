const $W = window as any
const actx = new ($W.AudioContext || $W.webkitAudioContext)()

export const getAudioCtx = () => actx

// const $$gain = [1, 0.92, 0.04, 0.1, 0.12, 0.03, 0.01] // 提琴音色 (0+, 1+)
const $$gain = [1, 0.92, 0.04, 0.1, 0.03, 0.03, 0.01] // 提琴音色 (-2+, 1+, 2+) OK!!!
const $$k = 2 ** (1 / 12)
const $$baseFreq = 440

export class Chord {
  public amp: GainNode
  public gain: GainNode[] = []
  public oscs: OscillatorNode[] = []
  public $pitch = 0
  public started = false
  constructor (private basePtich: number) {
    this.amp = actx.createGain()
    this.amp.gain.setValueAtTime(0, actx.currentTime)
    // this.envelope = actx.createGain()
    // this.envelope.gain.value = 0

    for (let i = 0; i < $$gain.length; i++) {
      const freq = $$baseFreq * ($$k ** basePtich) * (i + 1)

      this.oscs[i] = actx.createOscillator()
      this.oscs[i].frequency.setValueAtTime(freq, actx.currentTime)

      this.gain[i] = actx.createGain()
      this.gain[i].gain.setValueAtTime($$gain[i], actx.currentTime)

      this.oscs[i].connect(this.gain[i])
      this.gain[i].connect(this.amp)
      this.amp.connect(actx.destination)
    }
  }
  public setAmp (newGain: number, startTime: number, timeConstant: number) {
    if (newGain > 0.5) {
      newGain = 0.5
    }
    if (timeConstant < 0) { timeConstant = 0 }
    this.amp.gain.setTargetAtTime(newGain, startTime, timeConstant)
  }
  public silent (soft: number) {
    if (soft < 0) { soft = 0 }
    this.amp.gain.setTargetAtTime(0, actx.currentTime, soft)
  }
  public start () {
    if (this.started) { return }
    this.started = true
    this.oscs.forEach((osc) => {
      osc.start(actx.currentTime + 0.5)
    })
  }
  public stop () {
    this.oscs.forEach((osc) => {
      osc.stop(actx.currentTime)
    })
  }
  public setPitch (pitch: number, soft = 0) {
    for (let i = 0; i < $$gain.length; i++) {
      const freq = $$baseFreq * ($$k ** pitch) * (i + 1)
      if (soft < 0) { soft = 0 }
      this.oscs[i].frequency.setTargetAtTime(freq, actx.currentTime, soft)
    }
  }
}
