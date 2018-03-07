const actx = new AudioContext()

export const getAudioCtx = () => actx

const $$gain = [1, 0.92, 0.2, 0.1, 0.12, 0.03, 0.01] // 提琴音色
const $$k = 2 ** (1 / 12)
const $$baseFreq = 440

export class Chord {
  public amp: GainNode
  public gain: GainNode[] = []
  public oscs: OscillatorNode[] = []
  public $pitch: number = 0
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
  set pitch (pitch: number) {
    this.$pitch = pitch
    this.setPitch(pitch)
  }
  get pitch () { return this.$pitch }
  public setAmp (newGain: number, startTime: number, timeConstant: number) {
    if (newGain > 0.5) { newGain = 0.5 }
    this.amp.gain.setTargetAtTime(newGain, startTime, timeConstant)
  }
  public silent (soft: boolean) {
    const timeConstant = soft ? 0.01 : 0.004
    this.amp.gain.setTargetAtTime(0, actx.currentTime, timeConstant)
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
  private setPitch (pitch: number) {
    for (let i = 0; i < $$gain.length; i++) {
      const freq = $$baseFreq * ($$k ** pitch) * (i + 1)
      this.oscs[i].frequency.setValueAtTime(freq, actx.currentTime)
    }
  }
}
