// Audio: every sound is synthesized with WebAudio — no audio files, no
// network. A short pop rewards a find, a low buzz marks a miss, a chime
// answers a hint, and an arpeggio celebrates a cleared level.

let ctx = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, gain, when = 0) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + when;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export const sounds = {
  found() {
    tone(660, 0.12, 'sine', 0.25);
    tone(990, 0.18, 'sine', 0.22, 0.07);
  },
  wrong() {
    tone(160, 0.22, 'sawtooth', 0.1);
  },
  hint() {
    tone(880, 0.15, 'triangle', 0.18);
    tone(1174, 0.2, 'triangle', 0.15, 0.09);
  },
  clear() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.2, i * 0.1));
  },
  click() {
    tone(440, 0.06, 'sine', 0.12);
  },
  timeout() {
    tone(220, 0.4, 'sawtooth', 0.12);
    tone(165, 0.5, 'sawtooth', 0.1, 0.2);
  },
};
