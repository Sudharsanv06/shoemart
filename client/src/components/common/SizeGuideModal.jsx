import { useEffect } from "react";

const SIZE_DATA = [
  { uk: "4",  us_men: "5",    us_women: "6",    eu: "37", cm: "23.0" },
  { uk: "5",  us_men: "6",    us_women: "7",    eu: "38", cm: "23.5" },
  { uk: "6",  us_men: "7",    us_women: "8",    eu: "39", cm: "24.5" },
  { uk: "7",  us_men: "8",    us_women: "9",    eu: "40", cm: "25.0" },
  { uk: "8",  us_men: "9",    us_women: "10",   eu: "41", cm: "26.0" },
  { uk: "9",  us_men: "10",   us_women: "11",   eu: "42", cm: "27.0" },
  { uk: "10", us_men: "11",   us_women: "12",   eu: "43", cm: "27.5" },
  { uk: "11", us_men: "12",   us_women: "13",   eu: "44", cm: "28.5" },
  { uk: "12", us_men: "13",   us_women: "14",   eu: "45", cm: "29.0" },
];

const HOW_TO_MEASURE = [
  {
    step: "1",
    title: "Prepare",
    desc:  "Place a sheet of paper on the floor against a wall. Stand on it with your heel touching the wall.",
  },
  {
    step: "2",
    title: "Mark",
    desc:  "Mark the longest point of your foot (usually the big toe) on the paper.",
  },
  {
    step: "3",
    title: "Measure",
    desc:  "Measure the distance from the wall to the mark in centimeters.",
  },
  {
    step: "4",
    title: "Find your size",
    desc:  "Match your measurement to the CM column in the size chart above.",
  },
];

export default function SizeGuideModal({ isOpen, onClose, gender = "MEN" }) {

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else         document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isMen   = gender === "MEN"   || gender === "UNISEX";
  const isWomen = gender === "WOMEN" || gender === "UNISEX";
  const isKids  = gender === "KIDS";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(13,13,13,0.92)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-carbon border border-white/10 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-carbon z-10">
          <div>
            <h2 className="font-display text-2xl text-ivory">Size Guide</h2>
            <p className="text-muted text-xs mt-0.5">
              {isKids ? "Kids sizing" : "International size conversion chart"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-ivory transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">

          {/* Tip banner */}
          <div className="bg-gold/10 border border-gold/20 rounded-sm px-4 py-3 mb-6 flex items-start gap-3">
            <span className="text-gold text-lg flex-shrink-0">💡</span>
            <p className="text-ivory text-sm leading-relaxed">
              We recommend measuring your foot in the evening as feet tend to
              swell slightly throughout the day. If you're between sizes, go up.
            </p>
          </div>

          {/* Size Chart */}
          <h3 className="font-display text-lg text-ivory mb-4">
            Size Conversion Chart
          </h3>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gold">
                  <th className="text-obsidian font-bold px-4 py-3 text-left text-xs tracking-widest uppercase">
                    UK
                  </th>
                  {!isKids && isMen && (
                    <th className="text-obsidian font-bold px-4 py-3 text-left text-xs tracking-widest uppercase">
                      US (Men)
                    </th>
                  )}
                  {!isKids && isWomen && (
                    <th className="text-obsidian font-bold px-4 py-3 text-left text-xs tracking-widest uppercase">
                      US (Women)
                    </th>
                  )}
                  <th className="text-obsidian font-bold px-4 py-3 text-left text-xs tracking-widest uppercase">
                    EU
                  </th>
                  <th className="text-obsidian font-bold px-4 py-3 text-left text-xs tracking-widest uppercase">
                    Foot Length (cm)
                  </th>
                </tr>
              </thead>
              <tbody>
                {SIZE_DATA.map((row, i) => (
                  <tr
                    key={row.uk}
                    className={`border-b border-white/5 transition-colors hover:bg-white/5
                      ${i % 2 === 0 ? "bg-charcoal/30" : ""}`}
                  >
                    <td className="px-4 py-3 text-gold font-semibold font-mono">
                      UK {row.uk}
                    </td>
                    {!isKids && isMen && (
                      <td className="px-4 py-3 text-ivory">US {row.us_men}</td>
                    )}
                    {!isKids && isWomen && (
                      <td className="px-4 py-3 text-ivory">US {row.us_women}</td>
                    )}
                    <td className="px-4 py-3 text-ivory">EU {row.eu}</td>
                    <td className="px-4 py-3 text-muted">{row.cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kids note */}
          {isKids && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-sm px-4 py-3 mb-6">
              <p className="text-blue-400 text-sm">
                👟 Kids sizes vary more than adults. We strongly recommend
                measuring your child's foot length and matching to the CM column.
              </p>
            </div>
          )}

          {/* How to measure */}
          <h3 className="font-display text-lg text-ivory mb-4">
            How to Measure Your Foot
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {HOW_TO_MEASURE.map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-3 bg-charcoal/40 border border-white/5 rounded-sm p-4"
              >
                <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-obsidian font-bold text-xs flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-ivory text-sm font-semibold mb-1">{item.title}</p>
                  <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Width guide */}
          <h3 className="font-display text-lg text-ivory mb-4">Width Guide</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Narrow",   code: "B/2A", desc: "Slim fit", color: "border-blue-500/30  text-blue-400"  },
              { label: "Standard", code: "D",    desc: "Regular fit (most shoes)", color: "border-gold/30 text-gold"       },
              { label: "Wide",     code: "2E/4E", desc: "Extra room", color: "border-green-500/30 text-green-400" },
            ].map((w) => (
              <div
                key={w.label}
                className={`border rounded-sm p-3 text-center ${w.color}`}
              >
                <p className="font-mono font-bold text-lg">{w.code}</p>
                <p className="text-ivory text-sm font-medium mt-1">{w.label}</p>
                <p className="text-muted text-xs mt-0.5">{w.desc}</p>
              </div>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full btn-gold py-3"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}