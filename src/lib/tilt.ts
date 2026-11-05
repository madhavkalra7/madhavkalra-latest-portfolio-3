/**
 * Phone tilt (gyroscope / device orientation) as a lean of −1…1 on both axes, for the ability card.
 * x: tilted right is positive. y: the top tipped towards you past the usual ~45° holding angle is positive.
 * Same scale on every card: a 28° side tilt or a 30° forward tilt is a full lean.
 */
export interface Tilt { x: number; y: number }

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function readTilt(e: DeviceOrientationEvent): Tilt | null {
  if (e.gamma == null || e.beta == null) return null;
  // the sensor's axes are fixed to the device; turn them with the screen so "right" stays right in landscape
  const angle = screen.orientation?.angle ?? 0;
  let side = e.gamma, fwd = e.beta;
  if (angle === 90) { side = e.beta; fwd = -e.gamma; }
  else if (angle === 270 || angle === -90) { side = -e.beta; fwd = e.gamma; }
  else if (angle === 180) { side = -e.gamma; fwd = -e.beta; }
  return { x: clamp(side / 28), y: clamp((fwd - 45) / 30) };
}

type PermissionApi = { requestPermission?: () => Promise<'granted' | 'denied'> };

/** iOS (13+) only delivers orientation after the visitor allows it, and the request must come from a tap. */
export function requestTiltPermission(): void {
  const api = (window.DeviceOrientationEvent as unknown as PermissionApi | undefined);
  if (typeof api?.requestPermission === 'function') api.requestPermission().catch(() => { /* declined: no tilt */ });
}
