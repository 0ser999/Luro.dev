// Soft white clouds built from overlapping radial gradients (see .cloud in styles.css).
// l/r/t/b = position, w = width in vw, d = drift distance in px.
const LAYOUTS = {
  hero: [
    { l: "-9%", t: "5%", w: 34, o: 0.9, dur: 30, d: 30 },
    { r: "-11%", t: "1%", w: 40, o: 0.95, dur: 34, d: -26 },
    { l: "4%", b: "13%", w: 30, o: 1, dur: 28, d: 24 },
    { r: "3%", b: "15%", w: 32, o: 1, dur: 32, d: -30 },
    { l: "31%", b: "-5%", w: 40, o: 1, dur: 36, d: 20 },
    { l: "-12%", b: "-4%", w: 38, o: 1, dur: 40, d: 26 },
    { r: "-13%", b: "-5%", w: 42, o: 1, dur: 38, d: -24 },
  ],
  cta: [
    { l: "-8%", b: "-12%", w: 30, o: 1, dur: 32, d: 24 },
    { l: "32%", b: "-15%", w: 34, o: 1, dur: 38, d: -22 },
    { r: "-9%", b: "-12%", w: 32, o: 1, dur: 34, d: 20 },
    { l: "-7%", t: "4%", w: 16, o: 0.6, dur: 30, d: 20 },
  ],
};

export default function Clouds({ layout = "hero" }) {
  return (
    <>
      {LAYOUTS[layout].map((c, i) => (
        <i
          key={i}
          className="cloud"
          aria-hidden="true"
          style={{
            left: c.l,
            right: c.r,
            top: c.t,
            bottom: c.b,
            width: `${c.w}vw`,
            opacity: c.o,
            "--dur": `${c.dur}s`,
            "--dx": `${c.d}px`,
            "--delay": `${-i * 4}s`,
          }}
        />
      ))}
    </>
  );
}
