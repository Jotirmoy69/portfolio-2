export type MotionState = {
  time: number;
  dt: number;
  pointer: { x: number; y: number; vx: number; vy: number };
  scroll: number;
  scrollProgress: number;
  reducedMotion: boolean;
  motionPaused: boolean;
};

type Listener = (state: MotionState) => void;

const state: MotionState = {
  time: 0,
  dt: 0,
  pointer: { x: 0, y: 0, vx: 0, vy: 0 },
  scroll: 0,
  scrollProgress: 0,
  reducedMotion: false,
  motionPaused: false,
};

let raf = 0;
let last = 0;
let lastPx = 0;
let lastPy = 0;
let started = false;
const listeners = new Set<Listener>();

function tick(now: number) {
  const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
  last = now;
  state.time += dt;
  state.dt = dt;

  const px = state.pointer.x;
  const py = state.pointer.y;
  state.pointer.vx = (px - lastPx) / Math.max(dt, 0.001);
  state.pointer.vy = (py - lastPy) / Math.max(dt, 0.001);
  lastPx = px;
  lastPy = py;

  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  state.scroll = window.scrollY || window.pageYOffset || 0;
  state.scrollProgress = Math.min(1, Math.max(0, state.scroll / maxScroll));

  listeners.forEach((fn) => fn(state));
  raf = requestAnimationFrame(tick);
}

function onPointer(e: PointerEvent) {
  state.pointer.x = e.clientX;
  state.pointer.y = e.clientY;
}

export const MotionEngine = {
  getState: () => state,
  setReducedMotion(value: boolean) {
    state.reducedMotion = value;
  },
  setMotionPaused(value: boolean) {
    state.motionPaused = value;
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  start() {
    if (started || typeof window === "undefined") return;
    started = true;
    last = 0;
    lastPx = state.pointer.x;
    lastPy = state.pointer.y;
    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(tick);
  },
  stop() {
    if (!started) return;
    started = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onPointer);
  },
};
