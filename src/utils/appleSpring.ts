/**
 * Apple Fluid Interface Physics Utilities
 * Distilled from WWDC "Designing Fluid Interfaces" (apple-design skill):
 * - Progressive rubber-banding at boundaries (§9)
 * - Exponential-decay momentum projection (§6)
 * - Pointer velocity tracker for seamless gesture-to-spring handoff (§2, §5)
 * - Critically damped (ζ = 1.0) & momentum (ζ = 0.8) spring parameter conversion (§4)
 */

/**
 * Progressive resistance past a boundary (§9 Rubber-banding).
 * The further past the bound the user drags, the more the surface resists.
 *
 * @param overshoot Distance dragged past the boundary (px, signed)
 * @param dimension Reference container dimension (px, e.g. drawer width)
 * @param constant Resistance constant (Apple default = 0.55)
 */
export function rubberband(
  overshoot: number,
  dimension: number,
  constant = 0.55
): number {
  if (dimension <= 0 || overshoot === 0) return 0
  const sign = overshoot < 0 ? -1 : 1
  const abs = Math.abs(overshoot)
  return (
    sign *
    ((abs * dimension * constant) / (dimension + constant * abs))
  )
}

/**
 * Apple's exponential-decay scroll/gesture projection (§6 Momentum projection).
 * Projects where a flick would naturally come to rest based on release velocity.
 *
 * @param initialVelocity Release velocity in px/s
 * @param decelerationRate 0.998 for normal scroll feel; 0.99–0.994 for snappier drawers/sheets
 */
export function projectMomentum(
  initialVelocity: number,
  decelerationRate = 0.994
): number {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

export interface VelocitySample {
  x: number
  y: number
  t: number
}

/**
 * Computes release velocity (px/s) from a short ring buffer of recent pointer samples (§2, §5).
 * Drops stale samples older than 100ms so pauses before release correctly yield 0 velocity.
 */
export function computeReleaseVelocity(
  samples: VelocitySample[],
  now = performance.now()
): { vx: number; vy: number } {
  const recent = samples.filter(s => now - s.t <= 110)
  if (recent.length < 2) return { vx: 0, vy: 0 }

  const first = recent[0]
  const last = recent[recent.length - 1]
  const dtMs = last.t - first.t
  if (dtMs <= 1) return { vx: 0, vy: 0 }

  return {
    vx: ((last.x - first.x) / dtMs) * 1000,
    vy: ((last.y - first.y) / dtMs) * 1000,
  }
}

/**
 * Converts Apple's designer-friendly (dampingRatio, response) parameters
 * into physical (stiffness, damping) coefficients for unit mass = 1 (§4).
 *
 * - Default UI spring: dampingRatio = 1.0, response = 0.35 (critically damped, zero bounce)
 * - Momentum / flick spring: dampingRatio = 0.82, response = 0.35
 */
export function appleSpringParams(dampingRatio = 1.0, response = 0.35) {
  const omega = (2 * Math.PI) / Math.max(response, 0.05)
  const stiffness = omega * omega
  const damping = 2 * dampingRatio * omega
  return { stiffness, damping }
}

/**
 * Frame-rate-independent 1D spring integrator using 250Hz (4ms) fixed substeps.
 * Ensures identical physical behavior across 60Hz, 120Hz ProMotion, and throttled frames.
 */
export function stepSpring1D(
  x: number,
  vx: number,
  target: number,
  elapsedSec: number,
  stiffness: number,
  damping: number
): { x: number; vx: number } {
  const clampedElapsed = Math.min(Math.max(elapsedSec, 0), 0.5)
  const SUBSTEP = 0.004
  let remaining = clampedElapsed
  let currX = x
  let currV = vx

  while (remaining > 0) {
    const dt = Math.min(remaining, SUBSTEP)
    const accel = -stiffness * (currX - target) - damping * currV
    currV += accel * dt
    currX += currV * dt
    remaining -= dt
  }

  return { x: currX, vx: currV }
}
