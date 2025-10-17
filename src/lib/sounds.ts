// Sound effects utility for notifications

type SoundType = 'message' | 'match' | 'notification';

const soundFiles: Record<SoundType, string> = {
  message: '/sounds/message.mp3',
  match: '/sounds/match.mp3',
  notification: '/sounds/notification.mp3',
};

let audioContext: AudioContext | null = null;
let isMuted = false;

// Initialize audio context on first user interaction
export const initAudio = () => {
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

export const playSound = (type: SoundType, volume: number = 0.5) => {
  if (isMuted) return;
  
  try {
    initAudio();
    const audio = new Audio(soundFiles[type]);
    audio.volume = Math.min(Math.max(volume, 0), 1);
    audio.play().catch(err => console.log('Sound play failed:', err));
  } catch (error) {
    console.log('Sound playback error:', error);
  }
};

export const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};

export const isSoundMuted = () => isMuted;
