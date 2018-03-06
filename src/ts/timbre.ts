const actx = new AudioContext()

const $$gain = [1, 0.92, 0.2, 0.1, 0.12, 0.03, 0.01] // 提琴音色
const $$k = 2 ** (1 / 12)
const $$baseFreq = 440

export class Chord {
  public amp: GainNode
  public gain: GainNode[] = []
  public oscs: OscillatorNode[] = []
  public $pitch: number = 0
  constructor (public pitch: number) {
    this.amp = actx.createGain()
    this.amp.gain.value = 0
    // this.envelope = actx.createGain()
    // this.envelope.gain.value = 0

    for (let i = 0; i < $$gain.length; i++) {
      const freq = $$baseFreq * ($$k ** pitch) * (i + 1)

      this.oscs[i] = actx.createOscillator()
      this.oscs[i].frequency.value = freq

      this.gain[i] = actx.createGain()
      this.gain[i].gain.value = $$gain[i]

      this.oscs[i].connect(this.gain[i])
      this.gain[i].connect(this.amp)
      this.amp.connect(actx.destination)
    }
  }
  set detune (pitch: number) {
    this.$pitch = pitch
    this.setChord(pitch)
  }
  public setChord (pitch: number) {
    for (let i = 0; i < $$gain.length; i++) {
      const freq = $$baseFreq * ($$k ** pitch)
      this.oscs[i].frequency.value = freq
    }
  }
  public setAmp (newGain: number) {
    // this.amp.gain.setTargetAtTime(newGain, actx.currentTime, 0.016)
    this.amp.gain.value = newGain
  }
  public start () {
    this.oscs.forEach((osc) => {
      osc.start(actx.currentTime + 0.5)
    })
  }
  public stop () {
    this.oscs.forEach((osc) => {
      osc.stop(actx.currentTime)
    })
  }
}
