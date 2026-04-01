import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System – Flo Lenormand",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "sand-50", hex: "#faf8f5", textClass: "text-sand-900" },
  { name: "sand-100", hex: "#f3efe8", textClass: "text-sand-900" },
  { name: "sand-200", hex: "#e8e0d4", textClass: "text-sand-900" },
  { name: "sand-300", hex: "#d4c8b4", textClass: "text-sand-900" },
  { name: "sand-400", hex: "#b8a68a", textClass: "text-sand-900" },
  { name: "sand-500", hex: "#9a8568", textClass: "text-sand-50" },
  { name: "sand-600", hex: "#7a6a52", textClass: "text-sand-50" },
  { name: "sand-700", hex: "#5c4f3d", textClass: "text-sand-50" },
  { name: "sand-800", hex: "#3d342a", textClass: "text-sand-50" },
  { name: "sand-900", hex: "#1f1a14", textClass: "text-sand-50" },
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
    <section className="py-12 border-b border-sand-200 last:border-b-0">
      <div className="flex items-baseline gap-4 mb-8">
        <h2 className="text-xs font-medium tracking-widest uppercase text-sand-400">
          {title}
        </h2>
        {note && <span className="text-xs text-sand-300">{note}</span>}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-sand-400 font-mono mt-2">{children}</p>
  );
}

export default function DesignSystem() {
  return (
    <div className="pt-8 pb-24">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-sand-900 mb-2">
          Design System
        </h1>
        <p className="text-sm text-sand-400">
          Living reference. Unlisted — accessible at /design-system.
        </p>
      </div>

      {/* ─── Colors ─────────────────────────────────────────── */}
      <Section title="Colors" note="Sand palette — 10 steps">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((c) => (
            <div key={c.name}>
              <div
                className={`h-16 rounded flex items-end p-2 ${c.textClass}`}
                style={{ backgroundColor: c.hex }}
              >
                <span className="text-xs font-mono leading-none">{c.hex}</span>
              </div>
              <Label>{c.name}</Label>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-xs text-sand-400 font-mono mb-4">— Semantic usage</p>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-sand-50 border border-sand-200" />
            <span className="text-xs font-mono text-sand-500">bg-sand-50</span>
            <span className="text-xs text-sand-400">Page background</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-sand-900" />
            <span className="text-xs font-mono text-sand-500">text-sand-900</span>
            <span className="text-xs text-sand-400">Primary text, headings</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-sand-800" />
            <span className="text-xs font-mono text-sand-500">text-sand-800</span>
            <span className="text-xs text-sand-400">Body prose text</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-sand-700" />
            <span className="text-xs font-mono text-sand-500">text-sand-700</span>
            <span className="text-xs text-sand-400">Intro text, prose links</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-sand-600" />
            <span className="text-xs font-mono text-sand-500">text-sand-600</span>
            <span className="text-xs text-sand-400">Hover states, blockquote text</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-sand-500" />
            <span className="text-xs font-mono text-sand-500">text-sand-500</span>
            <span className="text-xs text-sand-400">Nav links, secondary text</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-sand-400" />
            <span className="text-xs font-mono text-sand-500">text-sand-400</span>
            <span className="text-xs text-sand-400">Dates, footer links, meta</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-sand-300" />
            <span className="text-xs font-mono text-sand-500">border-sand-300 / decoration-sand-300</span>
            <span className="text-xs text-sand-400">Link underlines, blockquote border</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-sm bg-sand-200 border border-sand-200" />
            <span className="text-xs font-mono text-sand-500">border-sand-200</span>
            <span className="text-xs text-sand-400">Dividers, footer border, ::selection</span>
          </div>
        </div>
      </Section>

      {/* ─── Typography Scale ────────────────────────────────── */}
      <Section title="Typography" note="Inter — all sizes in use">
        <div className="space-y-6">
          <div>
            <p className="text-2xl font-semibold text-sand-900 leading-tight">
              About / Article title — text-2xl font-semibold
            </p>
            <Label>text-2xl · font-semibold · leading-tight · text-sand-900</Label>
          </div>

          <div>
            <p className="text-lg text-sand-700 leading-relaxed">
              Product Designer at Meta, designing AI agents.
            </p>
            <Label>text-lg · font-normal · leading-relaxed · text-sand-700</Label>
          </div>

          <div>
            <p className="text-base text-sand-900 leading-snug">
              Article title on home listing — text-base
            </p>
            <Label>text-base · font-normal · leading-snug · text-sand-900</Label>
          </div>

          <div>
            <p className="text-sm text-sand-500 leading-relaxed">
              Article description — secondary text used below titles
            </p>
            <Label>text-sm · font-normal · leading-relaxed · text-sand-500</Label>
          </div>

          <div>
            <p className="text-sm text-sand-400">
              Date / metadata — April 2025
            </p>
            <Label>text-sm · text-sand-400</Label>
          </div>

          <div>
            <p className="text-sm text-sand-500">
              Nav links — Writing · About
            </p>
            <Label>text-sm · text-sand-500</Label>
          </div>

          <div>
            <p className="text-xs text-sand-400 tracking-widest uppercase font-medium">
              Section label — tracking-widest uppercase
            </p>
            <Label>text-xs · font-medium · tracking-widest · uppercase · text-sand-400</Label>
          </div>
        </div>

        <div className="mt-10 space-y-3">
          <p className="text-xs text-sand-400 font-mono mb-4">— Font features</p>
          <div className="flex gap-12">
            <div>
              <p className="text-base text-sand-800" style={{ fontFeatureSettings: '"kern" 1, "liga" 1' }}>
                Waffle → efficient
              </p>
              <Label>kern + liga on (default)</Label>
            </div>
            <div>
              <p className="text-base text-sand-800" style={{ fontFeatureSettings: '"kern" 0, "liga" 0' }}>
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
            <p className="text-sm text-sand-400 font-mono mb-3">— Nav link (header)</p>
            <div className="flex gap-6 text-sm text-sand-500">
              <a href="#" className="hover:text-sand-800 transition-colors">Writing</a>
              <a href="#" className="hover:text-sand-800 transition-colors">About</a>
            </div>
            <Label>text-sm · text-sand-500 → hover:text-sand-800 · transition-colors</Label>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Logo / name link (header)</p>
            <a href="#" className="text-sand-900 font-medium hover:text-sand-600 transition-colors">
              Flo Lenormand
            </a>
            <Label>text-sand-900 · font-medium → hover:text-sand-600 · transition-colors</Label>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Footer link</p>
            <div className="flex gap-6 text-sm text-sand-400">
              <a href="#" className="hover:text-sand-600 transition-colors">Substack</a>
              <a href="#" className="hover:text-sand-600 transition-colors">Threads</a>
              <a href="#" className="hover:text-sand-600 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-sand-600 transition-colors">Email</a>
            </div>
            <Label>text-sm · text-sand-400 → hover:text-sand-600 · transition-colors</Label>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Inline body link (About page)</p>
            <p className="text-sand-800 leading-relaxed">
              If you want to talk about any of this, I&apos;m{" "}
              <a href="#" className="underline decoration-sand-300 underline-offset-2 hover:decoration-sand-500 transition-colors">
                @flo_lenormand on Threads
              </a>{" "}
              or you can{" "}
              <a href="#" className="underline decoration-sand-300 underline-offset-2 hover:decoration-sand-500 transition-colors">
                email me
              </a>
              .
            </p>
            <Label>underline · decoration-sand-300 · underline-offset-2 → hover:decoration-sand-500</Label>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Prose link (inside articles)</p>
            <p className="text-sand-800 leading-relaxed">
              Read more about{" "}
              <a href="#" style={{
                color: 'var(--color-sand-700)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--color-sand-300)',
                textUnderlineOffset: '3px',
                transition: 'text-decoration-color 0.2s',
              }}>
                the design process
              </a>{" "}
              in the full article.
            </p>
            <Label>color: sand-700 · decoration: sand-300 → sand-700 · underline-offset: 3px</Label>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Back navigation link</p>
            <a href="#" className="text-sm text-sand-400 hover:text-sand-600 transition-colors inline-block">
              ← Back
            </a>
            <Label>text-sm · text-sand-400 → hover:text-sand-600</Label>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— External article link (home listing)</p>
            <a href="#" className="block group">
              <h2 className="text-base text-sand-900 group-hover:text-sand-600 transition-colors leading-snug">
                The thing about designing for AI
                <span className="text-sand-400 text-sm ml-1">↗</span>
              </h2>
            </a>
            <Label>group-hover:text-sand-600 · external glyph: text-sand-400 text-sm</Label>
          </div>
        </div>
      </Section>

      {/* ─── Prose ───────────────────────────────────────────── */}
      <Section title="Prose" note="Article body styling — .prose class">
        <div className="prose">
          <h2>This is a second-level heading</h2>
          <p>
            Body text sits at sand-800 with a line-height of 1.8 — generous enough
            for long-form reading without feeling airy. The measure is constrained
            to max-w-2xl by the outer layout, keeping lines around 65–70 characters.
          </p>

          <h3>Third-level heading</h3>
          <p>
            A second paragraph. Links inside prose look like{" "}
            <a href="#">this link here</a> — underlined with sand-300 decoration
            that darkens to sand-700 on hover.
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
            Inline <strong>strong text</strong> uses font-weight 600 at sand-900,
            making it pop against the sand-800 body color.
          </p>

          <hr />

          <p>
            After a horizontal rule. The rule is 1px solid sand-200 — a whisper,
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
                  <h2 className="text-base text-sand-900 group-hover:text-sand-600 transition-colors leading-snug">
                    {item.title}
                    {item.external && (
                      <span className="text-sand-400 text-sm ml-1">↗</span>
                    )}
                  </h2>
                  <time className="text-sm text-sand-400 whitespace-nowrap shrink-0">
                    {item.date}
                  </time>
                </div>
                {item.description && (
                  <p className="text-sm text-sand-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </a>
            </article>
          ))}
        </div>
        <Label>group · group-hover:text-sand-600 · date: text-sm text-sand-400 · desc: text-sm text-sand-500 mt-1</Label>
      </Section>

      {/* ─── Article Header ──────────────────────────────────── */}
      <Section title="Article Header" note="Writing page — title + date">
        <div className="pt-4">
          <span className="text-sm text-sand-400 hover:text-sand-600 transition-colors inline-block mb-8 cursor-default">
            ← Back
          </span>
          <header className="mb-10">
            <h1 className="text-2xl font-semibold text-sand-900 leading-tight mb-3">
              Why I stopped using design systems
            </h1>
            <time className="text-sm text-sand-400">March 15, 2025</time>
          </header>
        </div>
        <Label>h1: text-2xl font-semibold leading-tight mb-3 · time: text-sm text-sand-400</Label>
      </Section>

      {/* ─── Layout Chrome ───────────────────────────────────── */}
      <Section title="Layout Chrome" note="Header and footer — exact markup">
        <p className="text-sm text-sand-400 font-mono mb-4">— Header</p>
        <div className="border border-sand-200 rounded overflow-hidden">
          <div className="w-full px-6 pt-12 pb-6 bg-sand-50">
            <nav className="flex items-baseline justify-between max-w-2xl">
              <a href="#" className="text-sand-900 font-medium hover:text-sand-600 transition-colors">
                Flo Lenormand
              </a>
              <div className="flex gap-6 text-sm text-sand-500">
                <a href="#" className="hover:text-sand-800 transition-colors">Writing</a>
                <a href="#" className="hover:text-sand-800 transition-colors">About</a>
              </div>
            </nav>
          </div>
        </div>
        <Label>pt-12 pb-6 · justify-between · items-baseline · logo: font-medium sand-900 · nav: text-sm sand-500</Label>

        <p className="text-sm text-sand-400 font-mono mt-8 mb-4">— Footer</p>
        <div className="border border-sand-200 rounded overflow-hidden">
          <div className="px-6 py-8 border-t border-sand-200 bg-sand-50">
            <div className="flex gap-6 text-sm text-sand-400">
              {["Substack", "Threads", "LinkedIn", "Email"].map((l) => (
                <a key={l} href="#" className="hover:text-sand-600 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
        <Label>py-8 · border-t border-sand-200 · text-sm text-sand-400 → hover:text-sand-600</Label>
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
              className="bg-sand-200 shrink-0"
              style={{ width: s.px ? `${Math.min(s.px * 2, 160)}px` : "80px", height: "16px" }}
            />
            <span className="text-xs font-mono text-sand-500 w-32 shrink-0">{s.label}{s.px ? ` (${s.px}px)` : ""}</span>
            <span className="text-xs text-sand-400">{s.note}</span>
          </div>
        ))}
      </Section>

      {/* ─── Selection & Misc ────────────────────────────────── */}
      <Section title="Details" note="Micro-decisions">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Text selection</p>
            <p className="text-sand-800 leading-relaxed">
              Try selecting this sentence — the highlight is sand-200,
              keeping the warm palette consistent even in browser-native UI.
            </p>
            <Label>::selection background: sand-200 (#e8e0d4)</Label>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Transition duration</p>
            <p className="text-xs text-sand-500">
              All interactive elements use Tailwind&apos;s default{" "}
              <span className="font-mono">transition-colors</span> — 150ms ease.
              Prose link decoration uses an explicit{" "}
              <span className="font-mono">transition: 0.2s</span>.
            </p>
            <Label>transition-colors (150ms) · prose link decoration: 0.2s ease</Label>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Antialiasing</p>
            <p className="text-xs text-sand-500">
              <span className="font-mono">-webkit-font-smoothing: antialiased</span> is
              set on body — renders Inter at subpixel clarity on Mac/retina.
            </p>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Scroll behavior</p>
            <p className="text-xs text-sand-500">
              <span className="font-mono">scroll-behavior: smooth</span> on html.
              Affects anchor navigation.
            </p>
          </div>

          <div>
            <p className="text-sm text-sand-400 font-mono mb-3">— Max width / container</p>
            <p className="text-xs text-sand-500">
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
