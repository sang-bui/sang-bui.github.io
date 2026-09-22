// Real career milestones, plotted as a SLAM-style pose graph: keyframe
// markers connected by trajectory edges, a supporting ambient point cloud
// for scanned-structure density, and a faint ground grid for spatial
// context, the way real SLAM viewers (RTAB-Map, ORB-SLAM3) layer these.
// The dates and roles are real, taken directly from the resume; the 3D
// layout (the wander in y/z, the ambient point positions) is a
// deterministic, reproducible visual choice, not data.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js";

const MILESTONES = [
  { year: "2023", month: 0, role: "Computer Resource Utilization Research Assistant", org: "CS@Mines", sectionId: "data-science" },
  { year: "2023", month: 2, role: "SLAM & Autonomy Research Assistant", org: "ARIA Lab", sectionId: "autonomy" },
  { year: "2025", month: 17, role: "SLAM Research Contractor", org: "Spexal SARL", sectionId: "autonomy" },
  { year: "2025", month: 21, role: "Climate Data Guide Data Science Intern", org: "NSF NCAR", sectionId: "data-science" },
  { year: "2026", month: 32, role: "Technical Consultant, GenAI Analytics Systems", org: "Qualcomm Field Session", sectionId: "ai-engineering" },
  { year: "2027", month: 45, role: "Satellite Systems Engineer Associate (expected)", org: "Lockheed Martin Space", sectionId: "autonomy" },
];

const GRADIENT_START = new THREE.Color(0x5b93c9); // --accent, steel blue
const GRADIENT_END = new THREE.Color(0x52c2b8); // --accent-2, ice cyan

// Matches pointcloud.js's COLOR_POINTS/size/opacity exactly, so the
// ambient scan points here read as the same material as the hero's.
const HERO_POINT_COLOR = 0xe3ebf1;
const HERO_POINT_SIZE = 0.026;
const HERO_POINT_OPACITY = 0.6;

const X_RANGE = 4.2;
const Y_AMPLITUDE = 0.9;
const Z_AMPLITUDE = 0.7;
const TOTAL_MONTHS = MILESTONES[MILESTONES.length - 1].month;
const AMBIENT_POINT_COUNT = 320;
const CLICK_DRAG_THRESHOLD_PX = 6;

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

function milestonePositions() {
  return MILESTONES.map((m, i) => {
    const x = (m.month / TOTAL_MONTHS) * (X_RANGE * 2) - X_RANGE;
    const y = Y_AMPLITUDE * Math.sin(i * 1.3);
    const z = Z_AMPLITUDE * Math.cos(i * 0.9);
    return new THREE.Vector3(x, y, z);
  });
}

function gradientColorAt(t) {
  return GRADIENT_START.clone().lerp(GRADIENT_END, t);
}

// Pose-graph edges: the smoothed trajectory through the milestones,
// colored along the same time gradient as the markers, not a flat line.
function createTrajectoryEdges(points) {
  const curve = new THREE.CatmullRomCurve3(points);
  const segments = 140;
  const curvePoints = curve.getPoints(segments);

  const positions = new Float32Array(curvePoints.length * 3);
  const colors = new Float32Array(curvePoints.length * 3);
  curvePoints.forEach((p, i) => {
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
    const c = gradientColorAt(i / (curvePoints.length - 1));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 });
  return { line: new THREE.Line(geometry, material), curve };
}

// Keyframe markers: faceted octahedra (reads as a sensor pose, not a
// decorative orb), one per real milestone.
function createMarkers(points) {
  const geometry = new THREE.OctahedronGeometry(0.13, 0);
  return points.map((p, i) => {
    const color = gradientColorAt(i / (points.length - 1));
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(p);
    mesh.userData.milestone = MILESTONES[i];
    mesh.userData.baseColor = color;
    return mesh;
  });
}

// A modest ambient scatter along the curve, suggesting scanned structure
// around the timeline without competing with it (well short of the hero
// point cloud's density; this is a supporting layer). Uses the hero's
// exact color/size/opacity (pointcloud.js's COLOR_POINTS/size/opacity) so
// this reads as literally the same scan material across both scenes; the
// gradient stays reserved for the markers/edges, where it carries real
// signal (time progression) the ambient points don't need to repeat.
function createAmbientPoints(curve) {
  const positions = new Float32Array(AMBIENT_POINT_COUNT * 3);

  for (let i = 0; i < AMBIENT_POINT_COUNT; i++) {
    const t = Math.random();
    const base = curve.getPointAt(t);
    const jitter = 0.55;
    positions[i * 3] = base.x + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 1] = base.y + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 2] = base.z + (Math.random() - 0.5) * jitter;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: HERO_POINT_COLOR,
    size: HERO_POINT_SIZE,
    sizeAttenuation: true,
    transparent: true,
    opacity: HERO_POINT_OPACITY,
  });
  return new THREE.Points(geometry, material);
}

// A faint ground reference grid, gestures at the occupancy-grid maps this
// work actually produces without switching to a literal top-down view.
function createGroundGrid() {
  const grid = new THREE.GridHelper(10, 20, 0x5b93c9, 0x202c35);
  grid.position.y = -1.6;
  grid.material.transparent = true;
  grid.material.opacity = 0.22;
  return grid;
}

export function initCareerTimeline({ canvas, labelsContainer, detailEl, a11yContainer }) {
  try {
    if (!canvas || !labelsContainer || !detailEl || !supportsWebGL()) {
      console.warn("career-timeline.js: missing elements or WebGL unavailable, skipping.");
      return;
    }

    const container = canvas.parentElement || canvas;
    const reducedMotion = prefersReducedMotion();
    const defaultDetail = detailEl.textContent;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.4, 7.5);
    camera.lookAt(0, 0, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      console.warn("career-timeline.js: renderer creation failed, skipping.", e);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const points = milestonePositions();
    const { line, curve } = createTrajectoryEdges(points);
    const markers = createMarkers(points);
    const ambient = createAmbientPoints(curve);
    const grid = createGroundGrid();

    const group = new THREE.Group();
    group.add(grid);
    group.add(ambient);
    group.add(line);
    markers.forEach((m) => group.add(m));
    scene.add(group);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !reducedMotion;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    controls.autoRotate = false;
    controls.target.set(0, 0, 0);
    // One-finger touch scrolls the page normally; only a two-finger drag
    // orbits the scene, the usual pattern for embedded 3D content sitting
    // inline in a scrolling page. OrbitControls' connect() unconditionally
    // sets touch-action:none on the canvas, so it's overridden back to
    // pan-y after construction to let single-finger vertical scroll through.
    controls.touches.ONE = -1;
    controls.touches.TWO = THREE.TOUCH.ROTATE;
    renderer.domElement.style.touchAction = "pan-y";

    const labelEls = MILESTONES.map((m) => {
      const el = document.createElement("span");
      el.className = "timeline-label";
      el.textContent = m.year;
      labelsContainer.appendChild(el);
      return el;
    });

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
      new ResizeObserver(resize).observe(container);
    } else {
      window.addEventListener("resize", resize);
    }

    function updateLabels() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const worldPos = new THREE.Vector3();
      markers.forEach((mesh, i) => {
        mesh.getWorldPosition(worldPos);
        const projected = worldPos.clone().project(camera);
        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-projected.y * 0.5 + 0.5) * height;
        labelEls[i].style.transform = `translate(${x}px, ${y - 22}px)`;
      });
    }

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    let hovered = null;

    function setHovered(mesh) {
      if (hovered === mesh) return;
      if (hovered) hovered.scale.set(1, 1, 1);
      hovered = mesh;
      if (hovered) {
        hovered.scale.set(1.7, 1.7, 1.7);
        const m = hovered.userData.milestone;
        detailEl.textContent = `${m.year} — ${m.role}, ${m.org}`;
        canvas.style.cursor = "pointer";
      } else {
        detailEl.textContent = defaultDetail;
        canvas.style.cursor = "grab";
      }
    }

    function pointerToNDC(event) {
      const rect = canvas.getBoundingClientRect();
      pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function pickMarker() {
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObjects(markers);
      return hits.length ? hits[0].object : null;
    }

    function goToSection(milestone) {
      const target = document.getElementById(milestone.sectionId);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // OrbitControls also listens for pointer events on this canvas (to
    // drag-orbit); distinguish "clicked a marker" from "released after a
    // drag" by movement distance, rather than trusting the native click
    // event, which fires after drags too.
    let downPos = null;
    let lastDragPos = null;

    canvas.style.cursor = "grab";
    canvas.addEventListener("pointermove", (event) => {
      pointerToNDC(event);
      setHovered(pickMarker());

      // While actively dragging to orbit, echo a small nudge to the hero
      // point cloud so the two scenes feel connected, one system, not two
      // unrelated widgets. Only the incremental delta since the last move
      // is sent, not the whole drag distance.
      if (lastDragPos) {
        const deltaX = event.clientX - lastDragPos.x;
        lastDragPos = { x: event.clientX, y: event.clientY };
        window.dispatchEvent(new CustomEvent("slam-orbit-sync", { detail: { deltaX } }));
      }
    });
    canvas.addEventListener("pointerleave", () => setHovered(null));

    canvas.addEventListener("pointerdown", (event) => {
      downPos = { x: event.clientX, y: event.clientY };
      lastDragPos = { x: event.clientX, y: event.clientY };
    });
    canvas.addEventListener("pointerup", (event) => {
      lastDragPos = null;
      if (!downPos) return;
      const dx = event.clientX - downPos.x;
      const dy = event.clientY - downPos.y;
      downPos = null;
      if (Math.hypot(dx, dy) > CLICK_DRAG_THRESHOLD_PX) return;
      pointerToNDC(event);
      const hit = pickMarker();
      if (hit) goToSection(hit.userData.milestone);
    });

    // The 3D scene itself has no keyboard path (a canvas can't expose
    // individual markers to assistive tech), so a real, focusable button
    // per milestone provides the same detail-on-focus / activate-to-scroll
    // behavior, visually hidden but present in the tab order.
    if (a11yContainer) {
      markers.forEach((mesh, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "sr-only";
        const m = MILESTONES[i];
        btn.textContent = `${m.year}: ${m.role}, ${m.org}`;
        btn.addEventListener("focus", () => setHovered(mesh));
        btn.addEventListener("blur", () => setHovered(null));
        btn.addEventListener("click", () => goToSection(m));
        a11yContainer.appendChild(btn);
      });
    }

    function renderOnce() {
      controls.update();
      updateLabels();
      renderer.render(scene, camera);
    }

    renderOnce();

    // Only run a continuous loop while the section is actually visible, a
    // second live WebGL scene is real GPU cost; but keep it running
    // whenever visible since OrbitControls needs continuous frames to
    // respond to drag/zoom input smoothly.
    let rafId = null;
    function animate() {
      rafId = requestAnimationFrame(animate);
      renderOnce();
    }

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries[0].isIntersecting;
          if (visible && rafId === null) {
            animate();
          } else if (!visible && rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(container);
    } else {
      animate();
    }
  } catch (err) {
    console.warn("career-timeline.js: failed to initialize.", err);
  }
}
