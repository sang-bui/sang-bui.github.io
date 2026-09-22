// Reads spotify-top-artists.json, a small file a scheduled GitHub Action
// (.github/workflows/spotify-stats.yml) generates from the real Spotify Web
// API and commits into this repo. No API key ever lives in this file or
// runs in the browser; this just renders whatever that workflow produced.
// Until the workflow has run at least once, the file won't exist yet, that
// 404 is expected and handled quietly, the card just stays hidden.

export async function initTopArtists({ card, list }) {
  if (!card || !list) return;

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

      if (artist.genre) {
        const genre = document.createElement("span");
        genre.className = "top-artists-genre";
        genre.textContent = artist.genre;
        li.appendChild(genre);
      }

      list.appendChild(li);
    });

    card.hidden = false;
  } catch (err) {
    // Network hiccup, malformed file, whatever, the card just stays
    // hidden rather than showing broken or stale content.
    console.warn("spotify-top.js: could not load top artists.", err);
  }
}
