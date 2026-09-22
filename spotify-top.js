// Reads spotify-top-artists.json, a small file a scheduled GitHub Action
// (.github/workflows/spotify-stats.yml) generates from the real Spotify Web
// API and commits into this repo. No API key ever lives in this file or
// runs in the browser; this just renders whatever that workflow produced.
// Until the workflow has run at least once, the file won't exist yet, that
// 404 is expected and handled quietly, the card just stays hidden.

// Spotify's genre data is sparse (often missing per-artist), so it's left
// out of the rendered list entirely rather than showing up for some
// artists and not others.
function formatUpdatedAt(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export async function initTopArtists({ section, label, list } = {}) {
  if (!section || !label || !list) return;

  try {
    const res = await fetch("spotify-top-artists.json", { cache: "no-store" });
    if (!res.ok) return;

    const data = await res.json();
    const artists = Array.isArray(data.artists) ? data.artists : [];
    if (artists.length === 0) return;

    artists.forEach((artist) => {
      const li = document.createElement("li");
      li.className = "top-artists-item";

      if (artist.image) {
        const img = document.createElement("img");
        img.className = "top-artists-avatar";
        img.src = artist.image;
        img.alt = "";
        li.appendChild(img);
      }

      const name = document.createElement("span");
      name.className = "top-artists-name";
      name.textContent = artist.name;
      li.appendChild(name);

      list.appendChild(li);
    });

    // Spotify's time_range=medium_term (set server-side in the workflow)
    // means "roughly the last 6 months," made explicit here so this
    // doesn't read as an all-time or instant-live ranking.
    const updated = formatUpdatedAt(data.updated_at);
    label.textContent = updated
      ? `Top artists, last 6 months · updated ${updated}`
      : "Top artists, last 6 months";

    section.hidden = false;
  } catch (err) {
    // Network hiccup, malformed file, whatever, the section just stays
    // hidden rather than showing broken or stale content.
    console.warn("spotify-top.js: could not load top artists.", err);
  }
}
