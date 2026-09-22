// NOTE: This point cloud is synthetically generated (random jitter, no real
// scan or research data) purely as a quiet ambient backdrop for the sidebar,
// evoking the kind of output SLAM (simultaneous localization and mapping)
// research produces, behind the real career trajectory in the boxed scene
// above it.

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

const DESKTOP_POINT_COUNT = 500;
const MOBILE_POINT_COUNT = 220;
const MOBILE_BREAKPOINT_PX = 600;

const COLOR_POINTS = 0xe3ebf1; // cool ice white

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
    const side = Math.floor(Math.random() * 4);
    let x, y, z;

    z = (Math.random() - 0.5) * ROOM_DEPTH;

    if (side === 0) {
      x = (Math.random() - 0.5) * ROOM_WIDTH;
      y = -ROOM_HEIGHT / 2;
    } else if (side === 1) {
      x = (Math.random() - 0.5) * ROOM_WIDTH;
      y = ROOM_HEIGHT / 2;
    } else if (side === 2) {
      x = -ROOM_WIDTH / 2;
      y = (Math.random() - 0.5) * ROOM_HEIGHT;
    } else {
      x = ROOM_WIDTH / 2;
      y = (Math.random() - 0.5) * ROOM_HEIGHT;
    }

    const jitter = 0.35;
    x += (Math.random() - 0.5) * jitter;
    y += (Math.random() - 0.5) * jitter;
    z += (Math.random() - 0.5) * jitter;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: COLOR_POINTS,
    size: 0.022,
    sizeAttenuation: true,
    transparent: true,
    // Fainter than the old hero's 0.6, so this stays a quiet backdrop
    // behind the boxed trajectory rather than competing with it.
    opacity: 0.4,
  });

  return new THREE.Points(geometry, material);
}

export function initAmbientPointCloud(canvas) {
  try {
    if (!canvas || !supportsWebGL()) {
      console.warn("ambient-pointcloud.js: WebGL unavailable, skipping init.");
      return;
    }

    const container = canvas.parentElement || canvas;
    const reducedMotion = prefersReducedMotion();

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      console.warn("ambient-pointcloud.js: renderer creation failed, skipping init.", e);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const initialWidth = container.clientWidth || window.innerWidth;
    const pointCount = initialWidth < MOBILE_BREAKPOINT_PX ? MOBILE_POINT_COUNT : DESKTOP_POINT_COUNT;

    const group = new THREE.Group();
    group.add(createPointCloud(pointCount));
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
      renderer.render(scene, camera);
      return;
    }

    const pointer = { x: 0, y: 0 };
    const maxParallax = 0.3;

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

      group.rotation.y += 0.0015;

      const targetX = pointer.x * maxParallax;
      const targetY = -pointer.y * maxParallax;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();
  } catch (err) {
    console.warn("ambient-pointcloud.js: failed to initialize ambient point cloud.", err);
  }
}
