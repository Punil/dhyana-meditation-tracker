import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple audio context wrapper for synthesized sounds if needed, 
// or just HTMLAudioElement helpers.
export const playSound = (type: 'om' | 'bell' | 'shankh' | 'chorus-bell') => {
  // In a real app, these would be actual audio files. 
  // For this demo, we'll try to use some online free assets or synthesized sounds.
  // Since we can't guarantee external URL availability, we'll use a simple oscillator for the bell
  // and a placeholder for the complex sounds if possible, or just visual feedback + simple tone.
  
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();

  if (type === 'chorus-bell') {
    // 1. Play Bell (Bright, clear start)
    const bellOsc = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bellOsc.connect(bellGain);
    bellGain.connect(ctx.destination);
    
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    
    // Envelope: Instant attack, long exponential decay
    bellGain.gain.setValueAtTime(0, ctx.currentTime);
    bellGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
    bellGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4);
    
    bellOsc.start();
    bellOsc.stop(ctx.currentTime + 4);

    // 2. Play "Om" Chorus (Deep, layered drone)
    const baseFreq = 130.81; // C3
    const oscCount = 3; // Number of voices for chorus
    
    for(let i = 0; i < oscCount; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Lowpass filter to make it warmer/softer
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth'; // Sawtooth has more harmonics, filtered down it sounds vocal-ish
        
        // Detune each oscillator slightly to create the chorus/beating effect
        const detuneAmount = 6; // cents
        const detune = (i - 1) * detuneAmount; // -6, 0, +6
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        osc.detune.setValueAtTime(detune, ctx.currentTime);

        // Envelope: Slow swell (attack), sustain, slow release
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1.5); // Swell in
        gain.gain.setValueAtTime(0.1, ctx.currentTime + 3.5); // Sustain
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 6); // Fade out

        osc.start();
        osc.stop(ctx.currentTime + 6);
    }
    return;
  }

  if (type === 'bell') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

    osc.start();
    osc.stop(ctx.currentTime + 2);
  } else if (type === 'om') {
    // Simulating a low drone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6);

    osc.start();
    osc.stop(ctx.currentTime + 6);
  } else if (type === 'shankh') {
     // Simulating a high pitch rising sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);

    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  }
};
