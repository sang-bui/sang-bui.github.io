// NOTE: The point cloud and trajectory below are synthetically generated
// (random jitter + a random-walk path) purely as a visual stand-in for the
// kind of output SLAM (simultaneous localization and mapping) research
// produces. This is NOT real scan or research data.

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

const DESKTOP_POINT_COUNT = 1800;
const MOBILE_POINT_COUNT = 700;
const MOBILE_BREAKPOINT_PX = 600;

const COLOR_POINTS = 0xe8e2d8; // warm off-white
const COLOR_TRAJECTORY = 0xc9834f; // muted copper/amber

const ROOM_WIDTH = 6;
const ROOM_HEIGHT = 3.2;
const ROOM_DEPTH = 14;

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function supportsWebGL() {
  try {
    const testCanvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

// Scatters points around a box/corridor-like volume with jitter, so the
// result reads as a "scanned space" rather than a uniform random blob.
function createPointCloud(pointCount) {
  const positions = new Float32Array(pointCount * 3);

  for (let i = 0; i < pointCount; i++) {
    const t = Math.random();
    // Bias points toward the walls/floor/ceiling of a corridor volume,
    // like a noisy scan of surfaces rather than a solid filled cube.
    const side = Math.floor(Math.random() * 4);
    let x, y, z;

    z = (Math.random() - 0.5) * ROOM_DEPTH;

    if (side === 0) {
      // floor
      x = (Math.random() - 0.5) * ROOM_WIDTH;
      y = -ROOM_HEIGHT / 2;
    } else if (side === 1) {
      // ceiling
      x = (Math.random() - 0.5) * ROOM_WIDTH;
      y = ROOM_HEIGHT / 2;
    } else if (side === 2) {
      // left wall
      x = -ROOM_WIDTH / 2;
      y = (Math.random() - 0.5) * ROOM_HEIGHT;
    } else {
      // right wall
      x = ROOM_WIDTH / 2;
      y = (Math.random() - 0.5) * ROOM_HEIGHT;
    }

    // Jitter/noise so surfaces look scanned, not perfectly flat.
    const jitter = 0.35;
    x += (Math.random() - 0.5) * jitter;
    y += (Math.random() - 0.5) * jitter;
    z += (Math.random() - 0.5) * jitter;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    void t;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: COLOR_POINTS,
    size: 0.026,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.6,
  });

  return new THREE.Points(geometry, material);
}

// A smooth-ish random walk through the volume, used as a stand-in for a
// SLAM trajectory trace.
function createTrajectory() {
  const segmentCount = 60;
  const rawPoints = [];
  let x = 0;
  let y = 0;

  for (let i = 0; i <= segmentCount; i++) {
    const z = -ROOM_DEPTH / 2 + (ROOM_DEPTH * i) / segmentCount;
    x += (Math.random() - 0.5) * 0.5;
    y += (Math.random() - 0.5) * 0.3;
    x = THREE.MathUtils.clamp(x, -ROOM_WIDTH / 2 + 0.5, ROOM_WIDTH / 2 - 0.5);
    y = THREE.MathUtils.clamp(y, -ROOM_HEIGHT / 2 + 0.3, ROOM_HEIGHT / 2 - 0.3);
    rawPoints.push(new THREE.Vector3(x, y, z));
  }

  // Smooth the random walk with a CatmullRom curve so it reads as a
  // plausible traced path rather than a jagged zigzag.
  const curve = new THREE.CatmullRomCurve3(rawPoints);
  const smoothPoints = curve.getPoints(segmentCount * 4);

  const geometry = new THREE.BufferGeometry().setFromPoints(smoothPoints);
  const material = new THREE.LineBasicMaterial({
    color: COLOR_TRAJECTORY,
    transparent: true,
    opacity: 0.9,
  });

  return new THREE.Line(geometry, material);
}

export function initPointCloud(canvas) {
  try {
    if (!canvas || !supportsWebGL()) {
      console.warn("pointcloud.js: WebGL unavailable, skipping point cloud init.");
      return;
    }

    const container = canvas.parentElement || canvas;
    const reducedMotion = prefersReducedMotion();

    const scene = new THREE.Scene();
    scene.background = null;

    // A narrower FOV and a step back keep the scene visually quieter and
    // less dominant, more like a detail in the corner than the whole hero.
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      console.warn("pointcloud.js: renderer creation failed, skipping point cloud init.", e);
      return;
    }
    // Cap pixel ratio so high-DPI phones aren't forced to render at full
    // native resolution, which would tank frame rate for little visible gain.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const initialWidth = container.clientWidth || window.innerWidth;
    const pointCount = initialWidth < MOBILE_BREAKPOINT_PX ? MOBILE_POINT_COUNT : DESKTOP_POINT_COUNT;

    const group = new THREE.Group();
    group.add(createPointCloud(pointCount));
    group.add(createTrajectory());
    scene.add(group);

    function resize() {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    resize();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", resize);
    }

    if (reducedMotion) {
      // Render a single static frame and skip the animation loop and
      // pointer parallax entirely, per prefers-reduced-motion.
      renderer.render(scene, camera);
      return;
    }

    const pointer = { x: 0, y: 0 };
    const maxParallax = 0.15;

    function onPointerMove(event) {
      const rect = container.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      pointer.x = THREE.MathUtils.clamp(nx, -0.5, 0.5);
      pointer.y = THREE.MathUtils.clamp(ny, -0.5, 0.5);
    }

    window.addEventListener("pointermove", onPointerMove);

    function animate() {
      requestAnimationFrame(animate);

      group.rotation.y += 0.0003;

      const targetX = pointer.x * maxParallax;
      const targetY = -pointer.y * maxParallax;
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (targetY - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();
  } catch (err) {
    console.warn("pointcloud.js: failed to initialize point cloud scene.", err);
  }
}
