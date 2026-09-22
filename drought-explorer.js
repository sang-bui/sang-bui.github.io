// Real PDSI (Palmer Drought Severity Index) values, computed by Sang's own
// reimplementation of PDSI (see the article above this widget). Not
// synthetic, not illustrative — these are actual outputs, typed in here
// directly from the notebook's printed results.
const LOCATIONS = [
  {
    id: "denver",
    label: "Denver, CO, USA",
    points: [
      { date: "Jan 1934", pdsi: 1.124 },
      { date: "Jul 1988", pdsi: 1.217 },
      { date: "Jun 2023", pdsi: 3.117 },
    ],
  },
  {
    id: "mawsynram",
    label: "Mawsynram, India",
    points: [
      { date: "Jan 1934", pdsi: -1.403 },
      { date: "Jul 1988", pdsi: 5.869 },
      { date: "Jun 2023", pdsi: -0.411 },
    ],
  },
  {
    id: "alice-springs",
    label: "Alice Springs, Australia",
    points: [
      { date: "Jan 1934", pdsi: -2.812 },
      { date: "Jul 1988", pdsi: 1.564 },
      { date: "Jun 2023", pdsi: 1.009 },
    ],
  },
];

const SCALE_MIN = -4;
const SCALE_MAX = 6;
const CHART_W = 340;
const CHART_H = 180;
const BAR_W = 64;
const GAP = 40;

function yFor(value) {
  const t = (value - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
  return CHART_H - t * CHART_H;
}

function renderChart(location) {
  const zeroY = yFor(0);
  const startX = (CHART_W - (BAR_W * 3 + GAP * 2)) / 2;

  const bars = location.points
    .map((p, i) => {
      const x = startX + i * (BAR_W + GAP);
      const y = yFor(p.pdsi);
      const positive = p.pdsi >= 0;
      const barY = Math.min(y, zeroY);
      const barH = Math.max(Math.abs(y - zeroY), 1);
      return `
        <rect x="${x}" y="${barY}" width="${BAR_W}" height="${barH}"
              class="${positive ? "drought-bar-wet" : "drought-bar-dry"}" rx="3"/>
        <text x="${x + BAR_W / 2}" y="${positive ? barY - 8 : barY + barH + 16}"
              text-anchor="middle" class="drought-bar-value">${p.pdsi.toFixed(2)}</text>
        <text x="${x + BAR_W / 2}" y="${CHART_H + 18}" text-anchor="middle" class="drought-bar-date">${p.date}</text>
      `;
    })
    .join("");

  return `
    <svg class="drought-chart" viewBox="0 0 ${CHART_W} ${CHART_H + 32}" role="img"
         aria-label="PDSI at ${location.label}: ${location.points
           .map((p) => `${p.date} ${p.pdsi.toFixed(2)}`)
           .join(", ")}">
      <line x1="0" y1="${zeroY}" x2="${CHART_W}" y2="${zeroY}" class="drought-zero-line"/>
      ${bars}
    </svg>
  `;
}

export function initDroughtExplorer(container) {
  try {
    if (!container) return;
    let active = LOCATIONS[0];

    function draw() {
      container.innerHTML = "";

      const buttons = document.createElement("div");
      buttons.className = "drought-buttons";
      LOCATIONS.forEach((loc) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = loc.label;
        btn.setAttribute("aria-pressed", String(loc.id === active.id));
        if (loc.id === active.id) btn.classList.add("is-active");
        btn.addEventListener("click", () => {
          active = loc;
          draw();
        });
        buttons.appendChild(btn);
      });
      container.appendChild(buttons);

      const chartWrap = document.createElement("div");
      chartWrap.className = "drought-chart-wrap";
      chartWrap.innerHTML = renderChart(active);
      container.appendChild(chartWrap);
    }

    draw();
  } catch (err) {
    console.warn("drought-explorer.js: failed to initialize.", err);
  }
}
