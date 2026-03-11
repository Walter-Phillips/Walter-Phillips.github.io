"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type ShapeType = "sphere" | "cube" | "torus";

type Point3D = [number, number, number];

function generateSphere(count: number): Point3D[] {
  const points: Point3D[] = [];
  const phi = (1 + Math.sqrt(5)) / 2; // golden ratio for even distribution
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = (2 * Math.PI * i) / phi;
    points.push([
      Math.cos(theta) * radiusAtY,
      y,
      Math.sin(theta) * radiusAtY,
    ]);
  }
  return points;
}

function generateCube(count: number): Point3D[] {
  const points: Point3D[] = [];
  const side = Math.max(2, Math.ceil(Math.sqrt(count / 6)));
  const perFace = side * side;
  // Each face: fixed axis (0=x,1=y,2=z), fixed value (+1 or -1)
  const faces: { axis: number; val: number }[] = [
    { axis: 0, val: 1 },
    { axis: 0, val: -1 },
    { axis: 1, val: 1 },
    { axis: 1, val: -1 },
    { axis: 2, val: 1 },
    { axis: 2, val: -1 },
  ];
  for (const face of faces) {
    const otherAxes = [0, 1, 2].filter((a) => a !== face.axis);
    for (let i = 0; i < perFace; i++) {
      const p: number[] = [0, 0, 0];
      p[face.axis] = face.val;
      p[otherAxes[0]] = ((i % side) / Math.max(side - 1, 1)) * 2 - 1;
      p[otherAxes[1]] =
        (Math.floor(i / side) / Math.max(side - 1, 1)) * 2 - 1;
      points.push(p as Point3D);
    }
  }
  return points;
}

function generateTorus(count: number): Point3D[] {
  const points: Point3D[] = [];
  const R = 0.7; // major radius
  const r = 0.35; // minor radius
  const rings = Math.ceil(Math.sqrt(count));
  const perRing = Math.ceil(count / rings);
  for (let i = 0; i < rings; i++) {
    const theta = (i / rings) * Math.PI * 2;
    for (let j = 0; j < perRing && points.length < count; j++) {
      const phi = (j / perRing) * Math.PI * 2;
      points.push([
        (R + r * Math.cos(phi)) * Math.cos(theta),
        (R + r * Math.cos(phi)) * Math.sin(theta),
        r * Math.sin(phi),
      ]);
    }
  }
  return points.slice(0, count);
}

function rotateY(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [p[0] * cos + p[2] * sin, p[1], -p[0] * sin + p[2] * cos];
}

function rotateX(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [p[0], p[1] * cos - p[2] * sin, p[1] * sin + p[2] * cos];
}

function project(
  p: Point3D,
  size: number,
  fov: number
): { x: number; y: number; z: number; scale: number } {
  const distance = fov;
  const z = p[2] + distance;
  const scale = fov / z;
  return {
    x: p[0] * scale * (size / 3) + size / 2,
    y: p[1] * scale * (size / 3) + size / 2,
    z: p[2],
    scale,
  };
}

const generators: Record<ShapeType, (n: number) => Point3D[]> = {
  sphere: generateSphere,
  cube: generateCube,
  torus: generateTorus,
};

const POINT_COUNT = 500;
const SIZE = 48;
const FOV = 3.5;
const DOT_RADIUS = 0.7;

export function AnimatedShape({
  shape,
  isHovered,
  size = SIZE,
}: {
  shape: ShapeType;
  isHovered: boolean;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const angleRef = useRef(0);
  const progressRef = useRef(0); // raw linear progress 0..1
  const targetExpand = isHovered ? 1 : 0;
  const lastTimeRef = useRef<number | null>(null);

  const [points] = useState<Point3D[]>(() => generators[shape](POINT_COUNT));

  const draw = useCallback(function drawFrame() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const now = performance.now();
    const dt = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0.016;
    lastTimeRef.current = now;

    // Animate progress linearly, then apply easing curve
    const duration = 0.45; // seconds for full transition
    const step = dt / duration;
    if (targetExpand > progressRef.current) {
      progressRef.current = Math.min(progressRef.current + step, 1);
    } else {
      progressRef.current = Math.max(progressRef.current - step, 0);
    }

    // Ease in-out cubic: smooth acceleration and deceleration
    const t = progressRef.current;
    const expand = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Rotate when visible
    if (expand > 0.01) {
      angleRef.current += 0.015;
    }
    const angle = angleRef.current;

    ctx.clearRect(0, 0, size * 2, size * 2);

    const shapeScale = shape === "cube" ? 0.88 : 1;
    const dotRadius = shape === "cube" ? DOT_RADIUS * 1.2 : DOT_RADIUS;

    // Sort by z for depth ordering
    const projected = points.map((p) => {
      // Keep the cube slightly denser so its faces read as closed.
      const scaled: Point3D = [
        p[0] * expand * shapeScale,
        p[1] * expand * shapeScale,
        p[2] * expand * shapeScale,
      ];
      const rotated = rotateY(rotateX(scaled, 0.4), angle);
      return project(rotated, size * 2, FOV);
    });
    projected.sort((a, b) => a.z - b.z);

    for (const pt of projected) {
      const depthNorm = (pt.z + 1.5) / 3; // normalize depth roughly 0..1
      const alpha = (0.35 + 0.65 * depthNorm) * expand;
      const r = dotRadius * pt.scale * (0.5 + 0.5 * depthNorm);
      const brightness = Math.round(200 + 55 * depthNorm); // 200–255 white

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(r * 2, 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
      ctx.fill();
    }

    // Keep animating if expanding/collapsing or hovered
    if (progressRef.current > 0.001 || targetExpand > 0) {
      animationRef.current = requestAnimationFrame(drawFrame);
    } else {
      lastTimeRef.current = null;
    }
  }, [points, shape, size, targetExpand]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={size * 2}
      height={size * 2}
      className="shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export const shapes: ShapeType[] = ["sphere", "cube", "torus"];
