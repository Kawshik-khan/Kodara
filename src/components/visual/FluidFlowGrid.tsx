import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import "./FluidFlowGrid.css";

export interface FluidFlowGridProps {
  className?: string;
  gridStep?: number;
  lineLength?: number;
}

/**
 * Normalizes an angle difference to the range [-PI, PI] for smooth shortest-path interpolation.
 */
function normalizeAngle(diff: number): number {
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  return diff;
}

function lerpAngle(from: number, to: number, t: number): number {
  const diff = normalizeAngle(to - from);
  return from + diff * t;
}

/**
 * FluidFlowGrid: Background-only interactive vector flow field canvas.
 * Computes multi-harmonic trigonometric wave turbulence across micro-directional lines
 * and applies smooth quadratic repulsion around the user's cursor.
 */
export const FluidFlowGrid: React.FC<FluidFlowGridProps> = ({
  className,
  gridStep = 32,
  lineLength = 13,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse state with smooth dampening
    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;
    let isMouseActive = false;
    let mouseActivityFade = 0;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Handle high-DPI canvas sizing
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (prefersReducedMotion) {
        renderFrame(0);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Track global cursor movement passively across window
    const handlePointerMove = (e: PointerEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isMouseActive = true;
      if (mouseX < -1000) {
        mouseX = targetMouseX;
        mouseY = targetMouseY;
      }
    };

    const handlePointerLeave = () => {
      isMouseActive = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    let lastTime = performance.now();
    let time = 0;

    const repulsionRadius = 170;
    const repulsionRadiusSq = repulsionRadius * repulsionRadius;

    const renderFrame = (now: number) => {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      if (!prefersReducedMotion) {
        time += dt;
      }

      // Smooth mouse lerp
      if (isMouseActive) {
        mouseX += (targetMouseX - mouseX) * 0.14;
        mouseY += (targetMouseY - mouseY) * 0.14;
        mouseActivityFade = Math.min(1, mouseActivityFade + 0.08);
      } else {
        mouseActivityFade = Math.max(0, mouseActivityFade - 0.04);
      }

      ctx.clearRect(0, 0, width, height);

      // Grid loop
      const step = gridStep;
      const cols = Math.ceil(width / step) + 1;
      const rows = Math.ceil(height / step) + 1;

      for (let r = 0; r < rows; r++) {
        const y = r * step;

        for (let c = 0; c < cols; c++) {
          const x = c * step;

          // 1. Multi-harmonic trigonometric wave turbulence
          const wave1 = Math.sin(x * 0.0028 + time * 0.00075) * Math.cos(y * 0.0028 + time * 0.0006);
          const wave2 = Math.sin((x + y) * 0.0018 + time * 0.0009) * 0.45;
          const wave3 = Math.cos((x - y) * 0.0022 + time * 0.0005) * 0.35;
          const baseAngle = (wave1 + wave2 + wave3) * Math.PI;

          // Base wave height intensity for resting alpha
          const waveIntensity = (wave1 + 1) * 0.5; // 0 to 1
          let alpha = 0.16 + waveIntensity * 0.14; // 0.16 to 0.30 resting
          let currentAngle = baseAngle;
          let currentLength = lineLength;
          let lineWidth = 1.35;
          let dispX = 0;
          let dispY = 0;

          // 2. Cursor repulsion physics
          if (mouseActivityFade > 0.01) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < repulsionRadiusSq) {
              const dist = Math.sqrt(distSq) || 0.001;
              const normalizedDist = dist / repulsionRadius;
              const factor = Math.pow(1 - normalizedDist, 2) * mouseActivityFade;

              // Repulsion vector pointing radially outward from cursor
              const repelAngle = Math.atan2(dy, dx);

              // Smoothly blend angle towards outward radial normal
              currentAngle = lerpAngle(baseAngle, repelAngle, factor * 0.92);

              // Push micro-line origin away from cursor
              const pushDistance = factor * 16;
              dispX = (dx / dist) * pushDistance;
              dispY = (dy / dist) * pushDistance;

              // Dynamically heighten line length, stroke width and vibrant orange intensity
              alpha = Math.min(0.80, alpha + factor * 0.58);
              currentLength = lineLength + factor * 6;
              lineWidth = 1.35 + factor * 0.85;
            }
          }

          // 3. Draw micro-directional vector line
          const cx = x + dispX;
          const cy = y + dispY;
          const cosA = Math.cos(currentAngle);
          const sinA = Math.sin(currentAngle);
          const halfLen = currentLength * 0.5;

          const x1 = cx - cosA * halfLen;
          const y1 = cy - sinA * halfLen;
          const x2 = cx + cosA * halfLen;
          const y2 = cy + sinA * halfLen;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = lineWidth;
          ctx.lineCap = "round";
          ctx.strokeStyle = `rgba(255, 94, 30, ${alpha.toFixed(3)})`;
          ctx.stroke();

          // 4. Draw micro directional vector tip for engineering precision
          if (alpha > 0.25) {
            ctx.beginPath();
            ctx.arc(x2, y2, lineWidth * 0.9, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 94, 30, ${Math.min(1, alpha * 1.35).toFixed(3)})`;
            ctx.fill();
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(renderFrame);
    } else {
      renderFrame(0);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [gridStep, lineLength]);

  return (
    <div
      className={clsx("fluid-flow-grid", className)}
      aria-hidden="true"
      data-testid="fluid-flow-grid"
    >
      <canvas ref={canvasRef} className="fluid-flow-grid__canvas" />
    </div>
  );
};
