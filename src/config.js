// ─── EDIT ME ─────────────────────────────────────────────────
// Page texts (English + French) live in src/i18n.jsx.

export const CONFIG = {
  discord: "https://discord.com/users/313660403483934720", // your Discord profile
  email: "contact@luro.lol",
};

// Your posters: just drop the image files in src/assets/works/ (see LISEZ-MOI.txt there).
// 'name.jpg' -> title 'Name'; 'name__Photoshop.jpg' -> title 'Name' + tag 'Photoshop'.
// While the folder is empty, demo placeholders are shown.
const files = import.meta.glob("./assets/works/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const nice = (s) => {
  const t = s.replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export const WORKS = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, img]) => {
    const base = path.split("/").pop().replace(/\.[^.]+$/, "");
    const [name, tag = ""] = base.split("__");
    return { title: nice(name), tag: tag.replace(/[-_]+/g, " "), img };
  });
