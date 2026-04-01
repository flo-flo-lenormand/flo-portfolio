import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System – Flo Lenormand",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "gray-50",  hex: "#fafafa", role: "Page background",               textClass: "text-gray-900" },
  { name: "gray-100", hex: "#f4f4f5", role: "Subtle surface",                textClass: "text-gray-900" },
  { name: "gray-200", hex: "#e4e4e7", role: "Borders · dividers · selection · underlines", textClass: "text-gray-900" },
  { name: "gray-400", hex: "#a1a1aa", role: "Muted · metadata · dates",      textClass: "text-gray-900" },
  { name: "gray-500", hex: "#71717a", role: "Secondary text · nav · footer", textClass: "text-gray-50" },
  { name: "gray-600", hex: "#52525b", role: "Hover · intro text · blockquote", textClass: "text-gray-50" },
  { name: "gray-800", hex: "#27272a", role: "Body · prose text",             textClass: "text-gray-50" },
  { name: "gray-900", hex: "#18181b", role: "Headings · primary text",       textClass: "text-gray-50" },
];

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-12 border-b border-gray-200 last:border-b-0">
      <div className="flex items-baseline gap-4 mb-8">
        <h2 className="text-xs font-medium tracking-widest uppercase text-gray-400">
          {title}
        </h2>
        {note && <span className="text-xs text-gray-200">{note}</span>}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-gray-400 font-mono mt-2">{children}</p>
  );
}

export default function DesignSystem() {
  return (
    <div className="pt-8 pb-24">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Design System
        </h1>
        <p className="text-sm text-gray-400">
          Living reference. Unlisted — accessible at /design-system.
        </p>
      </div>

      {/* ─── Type Direction ─────────────────────────────────── */}
      <Section title="Type Direction" note="✓ Locked — Geist everything · weight creates hierarchy">
        <div className="flex gap-8 text-xs font-mono text-gray-400 mb-8">
          <span>Headings → Geist · extrabold · 36px</span>
          <span>Body / prose → Geist · regular · 18px</span>
        </div>

        <h2 className="text-[36px] font-extrabold text-gray-900 leading-tight tracking-tight mb-3">
          I built a dashboard with AI agents, then deleted everything
        </h2>
        <time className="text-sm text-gray-400 block mb-8">March 16, 2026</time>

        <p className="text-lg text-gray-800 leading-[1.8] mb-5">
          I spent weeks building a personal productivity dashboard with Claude Code.
          It had everything: a background agent scanning my Google Chat every five minutes,
          a morning briefing system, a calendar integration, a creative assistant scraping
          design inspiration, a content agent drafting Threads posts. It looked impressive.
          Multiple agent pages, each with their own personality and avatar. Animated breathing
          dots. Mood indicators.
        </p>
        <p className="text-lg text-gray-800 leading-[1.8] mb-5">
          Then I started actually using it. The draft replies sat there unreviewed because
          I&apos;d already replied in GChat directly. The calendar section told me things I
          already knew from looking at my phone. The morning briefing was interesting but not
          actionable. So I deleted it. All of it.
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          The paradox of building with AI is that you can build so fast that you outrun your actual needs.
        </p>

        <div className="mt-8 space-y-1">
          <Label>h1/h2/h3 — Geist · font-sans = font-body · one font family</Label>
          <Label>title — text-[36px] · font-extrabold · leading-tight · tracking-tight</Label>
          <Label>prose body — text-lg (18px) · leading-[1.8]</Label>
        </div>
      </Section>

      {/* ─── Color Exploration ──────────────────────────────── */}
      <Section title="Color Exploration" note="Three gray directions — pick one">

        {[
          {
            label: "A — Neutral",
            note: "Pure, temperature-free gray. No warmth, no cool. Maximum flexibility — works with any accent.",
            steps: [
              { hex: "#fafafa", label: "50" },
              { hex: "#f5f5f5", label: "100" },
              { hex: "#e5e5e5", label: "200" },
              { hex: "#d4d4d4", label: "300" },
              { hex: "#a3a3a3", label: "400" },
              { hex: "#737373", label: "500" },
              { hex: "#525252", label: "600" },
              { hex: "#404040", label: "700" },
              { hex: "#262626", label: "800" },
              { hex: "#171717", label: "900" },
            ],
          },
          {
            label: "B — Cool / Zinc",
            note: "Slight blue-gray tint. Modern, technical, precise. What Linear, Vercel, and Notion use.",
            steps: [
              { hex: "#fafafa", label: "50" },
              { hex: "#f4f4f5", label: "100" },
              { hex: "#e4e4e7", label: "200" },
              { hex: "#d1d1d6", label: "300" },
              { hex: "#a1a1aa", label: "400" },
              { hex: "#71717a", label: "500" },
              { hex: "#52525b", label: "600" },
              { hex: "#3f3f46", label: "700" },
              { hex: "#27272a", label: "800" },
              { hex: "#18181b", label: "900" },
            ],
          },
          {
            label: "C — Warm Neutral / Stone",
            note: "Faintest warmth — not sand, not beige, but not cold either. More editorial, more human.",
            steps: [
              { hex: "#fafaf9", label: "50" },
              { hex: "#f5f5f4", label: "100" },
              { hex: "#e7e5e4", label: "200" },
              { hex: "#d6d3d1", label: "300" },
              { hex: "#a8a29e", label: "400" },
              { hex: "#78716c", label: "500" },
              { hex: "#57534e", label: "600" },
              { hex: "#44403c", label: "700" },
              { hex: "#292524", label: "800" },
              { hex: "#1c1917", label: "900" },
            ],
          },
        ].map((palette) => (
          <div key={palette.label} className="mb-10 last:mb-0">
            <p className="text-xs font-mono text-gray-500 mb-1">{palette.label}</p>
            <p className="text-xs text-gray-400 mb-4">{palette.note}</p>
            <div className="grid grid-cols-10 gap-1 mb-3">
              {palette.steps.map((s) => (
                <div key={s.label}>
                  <div
                    className="h-10 rounded-sm"
                    style={{ backgroundColor: s.hex }}
                  />
                  <p className="text-xs font-mono mt-1 text-gray-400" style={{ fontSize: "10px" }}>{s.label}</p>
                </div>
              ))}
            </div>
            {/* Live text preview */}
            <div className="mt-4 p-4 rounded" style={{ backgroundColor: palette.steps[0].hex }}>
              <p className="font-semibold mb-1" style={{ color: palette.steps[9].hex, fontSize: "15px" }}>
                Heading — {palette.label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: palette.steps[7].hex }}>
                Body text reads here. The quick brown fox. Notice how the temperature of the gray affects the reading feel.
              </p>
              <p className="text-xs mt-2" style={{ color: palette.steps[4].hex }}>
                Metadata · April 2026
              </p>
            </div>
          </div>
        ))}

      </Section>

      {/* ─── Colors ─────────────────────────────────────────── */}
      <Section title="Colors" note="✓ Locked — Zinc gray · 8 steps · each with one role">
        <div className="space-y-2">
          {colors.map((c) => (
            <div key={c.name} className="flex items-center gap-4">
              <div
                className={`w-12 h-8 rounded-sm shrink-0 flex items-center justify-center ${c.textClass}`}
                style={{ backgroundColor: c.hex }}
              >
                <span style={{ fontSize: "9px" }} className="font-mono">{c.name.split("-")[1]}</span>
              </div>
              <span className="text-xs font-mono text-gray-500 w-20 shrink-0">{c.name}</span>
              <span className="text-xs font-mono text-gray-400 w-16 shrink-0">{c.hex}</span>
              <span className="text-xs text-gray-400">{c.role}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Typography Scale ────────────────────────────────── */}
      <Section title="Typography" note="Inter — all sizes in use">
        <div className="space-y-6">
          <div>
            <p className="text-2xl font-semibold text-gray-900 leading-tight">
              About / Article title — text-2xl font-semibold
            </p>
            <Label>text-2xl · font-semibold · leading-tight · text-gray-900</Label>
          </div>

          <div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Product Designer at Meta, designing AI agents.
            </p>
            <Label>text-lg · font-normal · leading-relaxed · text-gray-600</Label>
          </div>

          <div>
            <p className="text-base text-gray-900 leading-snug">
              Article title on home listing — text-base
            </p>
            <Label>text-base · font-normal · leading-snug · text-gray-900</Label>
          </div>

          <div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Article description — secondary text used below titles
            </p>
            <Label>text-sm · font-normal · leading-relaxed · text-gray-500</Label>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Date / metadata — April 2025
            </p>
            <Label>text-sm · text-gray-400</Label>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Nav links — Writing · About
            </p>
            <Label>text-sm · text-gray-500</Label>
          </div>

          <div>
            <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">
              Section label — tracking-widest uppercase
            </p>
            <Label>text-xs · font-medium · tracking-widest · uppercase · text-gray-400</Label>
          </div>
        </div>

        <div className="mt-10 space-y-3">
          <p className="text-xs text-gray-400 font-mono mb-4">— Font features</p>
          <div className="flex gap-12">
            <div>
              <p className="text-base text-gray-800" style={{ fontFeatureSettings: '"kern" 1, "liga" 1' }}>
                Waffle → efficient
              </p>
              <Label>kern + liga on (default)</Label>
            </div>
            <div>
              <p className="text-base text-gray-800" style={{ fontFeatureSettings: '"kern" 0, "liga" 0' }}>
                Waffle → efficient
              </p>
              <Label>kern + liga off</Label>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Links ───────────────────────────────────────────── */}
      <Section title="Links" note="All interactive text states">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Nav link (header)</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-800 transition-colors">Writing</a>
              <a href="#" className="hover:text-gray-800 transition-colors">About</a>
            </div>
            <Label>text-sm · text-gray-500 → hover:text-gray-800 · transition-colors</Label>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Logo / name link (header)</p>
            <a href="#" className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
              Flo Lenormand
            </a>
            <Label>text-gray-900 · font-medium → hover:text-gray-600 · transition-colors</Label>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Footer link</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Substack</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Threads</a>
              <a href="#" className="hover:text-gray-600 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Email</a>
            </div>
            <Label>text-sm · text-gray-400 → hover:text-gray-600 · transition-colors</Label>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Inline body link (About page)</p>
            <p className="text-gray-800 leading-relaxed">
              If you want to talk about any of this, I&apos;m{" "}
              <a href="#" className="underline decoration-gray-200 underline-offset-2 hover:decoration-gray-500 transition-colors">
                @flo_lenormand on Threads
              </a>{" "}
              or you can{" "}
              <a href="#" className="underline decoration-gray-200 underline-offset-2 hover:decoration-gray-500 transition-colors">
                email me
              </a>
              .
            </p>
            <Label>underline · decoration-gray-200 · underline-offset-2 → hover:decoration-gray-500</Label>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Prose link (inside articles)</p>
            <p className="text-gray-800 leading-relaxed">
              Read more about{" "}
              <a href="#" style={{
                color: 'var(--color-gray-600)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--color-gray-200)',
                textUnderlineOffset: '3px',
                transition: 'text-decoration-color 0.2s',
              }}>
                the design process
              </a>{" "}
              in the full article.
            </p>
            <Label>color: gray-600 · decoration: gray-200 → gray-600 · underline-offset: 3px</Label>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Back navigation link</p>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors inline-block">
              ← Back
            </a>
            <Label>text-sm · text-gray-400 → hover:text-gray-600</Label>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— External article link (home listing)</p>
            <a href="#" className="block group">
              <h2 className="text-base text-gray-900 group-hover:text-gray-600 transition-colors leading-snug">
                The thing about designing for AI
                <span className="text-gray-400 text-sm ml-1">↗</span>
              </h2>
            </a>
            <Label>group-hover:text-gray-600 · external glyph: text-gray-400 text-sm</Label>
          </div>
        </div>
      </Section>

      {/* ─── Prose ───────────────────────────────────────────── */}
      <Section title="Prose" note="Article body styling — .prose class">
        <div className="prose">
          <h2>This is a second-level heading</h2>
          <p>
            Body text sits at gray-800 with a line-height of 1.8 — generous enough
            for long-form reading without feeling airy. The measure is constrained
            to max-w-2xl by the outer layout, keeping lines around 65–70 characters.
          </p>

          <h3>Third-level heading</h3>
          <p>
            A second paragraph. Links inside prose look like{" "}
            <a href="#">this link here</a> — underlined with gray-200 decoration
            that darkens to gray-600 on hover.
          </p>

          <blockquote>
            The best design is invisible. You notice it only when it&apos;s absent.
          </blockquote>

          <p>
            After a blockquote. Lists follow:
          </p>

          <ul>
            <li>Unordered list item — disc marker</li>
            <li>Line height 1.7, slightly tighter than body</li>
            <li>Spacing between items: 0.5rem</li>
          </ul>

          <ol>
            <li>Ordered list item — decimal marker</li>
            <li>Same sizing and spacing as unordered</li>
          </ol>

          <p>
            Inline <strong>strong text</strong> uses font-weight 600 at gray-900,
            making it pop against the gray-800 body color.
          </p>

          <hr />

          <p>
            After a horizontal rule. The rule is 1px solid gray-200 — a whisper,
            not a wall.
          </p>
        </div>
      </Section>

      {/* ─── Article Card ────────────────────────────────────── */}
      <Section title="Article Card" note="Home page listing pattern">
        <div className="space-y-6">
          {[
            {
              title: "Why I stopped using design systems",
              date: "March 2025",
              description: "On the tension between consistency and craft, and what gets lost when you over-systemize.",
              external: false,
            },
            {
              title: "The thing about designing for AI",
              date: "January 2025",
              description: undefined,
              external: true,
            },
            {
              title: "What Messenger taught me about edge cases",
              date: "November 2024",
              description: "Safety systems surface the strangest human behavior. Here's what six years of it looked like.",
              external: false,
            },
          ].map((item) => (
            <article key={item.title} className="group">
              <a href="#" className="block">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-base text-gray-900 group-hover:text-gray-600 transition-colors leading-snug">
                    {item.title}
                    {item.external && (
                      <span className="text-gray-400 text-sm ml-1">↗</span>
                    )}
                  </h2>
                  <time className="text-sm text-gray-400 whitespace-nowrap shrink-0">
                    {item.date}
                  </time>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </a>
            </article>
          ))}
        </div>
        <Label>group · group-hover:text-gray-600 · date: text-sm text-gray-400 · desc: text-sm text-gray-500 mt-1</Label>
      </Section>

      {/* ─── Article Header ──────────────────────────────────── */}
      <Section title="Article Header" note="Writing page — title + date">
        <div className="pt-4">
          <span className="text-sm text-gray-400 hover:text-gray-600 transition-colors inline-block mb-8 cursor-default">
            ← Back
          </span>
          <header className="mb-10">
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight mb-3">
              Why I stopped using design systems
            </h1>
            <time className="text-sm text-gray-400">March 15, 2025</time>
          </header>
        </div>
        <Label>h1: text-2xl font-semibold leading-tight mb-3 · time: text-sm text-gray-400</Label>
      </Section>

      {/* ─── Layout Chrome ───────────────────────────────────── */}
      <Section title="Layout Chrome" note="Header and footer — exact markup">
        <p className="text-sm text-gray-400 font-mono mb-4">— Header</p>
        <div className="border border-gray-200 rounded overflow-hidden">
          <div className="w-full px-6 pt-12 pb-6 bg-gray-50">
            <nav className="flex items-baseline justify-between max-w-2xl">
              <a href="#" className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
                Flo Lenormand
              </a>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-800 transition-colors">Writing</a>
                <a href="#" className="hover:text-gray-800 transition-colors">About</a>
              </div>
            </nav>
          </div>
        </div>
        <Label>pt-12 pb-6 · justify-between · items-baseline · logo: font-medium gray-900 · nav: text-sm gray-500</Label>

        <p className="text-sm text-gray-400 font-mono mt-8 mb-4">— Footer</p>
        <div className="border border-gray-200 rounded overflow-hidden">
          <div className="px-6 py-8 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-6 text-sm text-gray-400">
              {["Substack", "Threads", "LinkedIn", "Email"].map((l) => (
                <a key={l} href="#" className="hover:text-gray-600 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
        <Label>py-8 · border-t border-gray-200 · text-sm text-gray-400 → hover:text-gray-600</Label>
      </Section>

      {/* ─── Spacing ─────────────────────────────────────────── */}
      <Section title="Spacing" note="Key vertical rhythm values in use">
        {[
          { label: "pt-8", px: 32, note: "Page top padding (all pages)" },
          { label: "mb-16", px: 64, note: "Intro section bottom margin" },
          { label: "mb-10", px: 40, note: "Article header bottom margin" },
          { label: "mb-8", px: 32, note: "About h1, back link bottom margin" },
          { label: "space-y-6", px: 24, note: "Article list gap" },
          { label: "space-y-5", px: 20, note: "About body paragraphs gap" },
          { label: "pb-20", px: 80, note: "Main content bottom padding" },
          { label: "py-8 / pt-12 pb-6", px: null, note: "Footer / header vertical padding" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-4 mb-3">
            <div
              className="bg-gray-200 shrink-0"
              style={{ width: s.px ? `${Math.min(s.px * 2, 160)}px` : "80px", height: "16px" }}
            />
            <span className="text-xs font-mono text-gray-500 w-32 shrink-0">{s.label}{s.px ? ` (${s.px}px)` : ""}</span>
            <span className="text-xs text-gray-400">{s.note}</span>
          </div>
        ))}
      </Section>

      {/* ─── Selection & Misc ────────────────────────────────── */}
      <Section title="Details" note="Micro-decisions">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Text selection</p>
            <p className="text-gray-800 leading-relaxed">
              Try selecting this sentence — the highlight is gray-200,
              keeping the warm palette consistent even in browser-native UI.
            </p>
            <Label>::selection background: gray-200 (#e8e0d4)</Label>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Transition duration</p>
            <p className="text-xs text-gray-500">
              All interactive elements use Tailwind&apos;s default{" "}
              <span className="font-mono">transition-colors</span> — 150ms ease.
              Prose link decoration uses an explicit{" "}
              <span className="font-mono">transition: 0.2s</span>.
            </p>
            <Label>transition-colors (150ms) · prose link decoration: 0.2s ease</Label>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Antialiasing</p>
            <p className="text-xs text-gray-500">
              <span className="font-mono">-webkit-font-smoothing: antialiased</span> is
              set on body — renders Inter at subpixel clarity on Mac/retina.
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Scroll behavior</p>
            <p className="text-xs text-gray-500">
              <span className="font-mono">scroll-behavior: smooth</span> on html.
              Affects anchor navigation.
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 font-mono mb-3">— Max width / container</p>
            <p className="text-xs text-gray-500">
              Header, main, and footer are all capped at{" "}
              <span className="font-mono">max-w-2xl (672px)</span>, centered with{" "}
              <span className="font-mono">mx-auto</span>. Side padding:{" "}
              <span className="font-mono">px-6 (24px)</span>.
            </p>
            <Label>max-w-2xl · mx-auto · px-6</Label>
          </div>
        </div>
      </Section>
    </div>
  );
}
