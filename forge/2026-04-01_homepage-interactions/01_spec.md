# Homepage Interaction Spec
Date: 2026-04-01
Status: Ready to build

---

## 1. Layout

- Title + paragraph sit near the top with generous padding above (around 20vh feels right to try)
- No vertical centering - avoids the jump problem when articles unfold
- Articles live below, hidden on load

---

## 2. Title reveal animation

On page load, the three lines of the title reveal sequentially.

**Sequence:**
1. "I made message bubbles" fades/slides in
2. Short pause (~400ms)
3. "then expressive" fades/slides in
4. Short pause (~400ms)
5. "now smart" fades/slides in
6. Short pause (~300ms)
7. Paragraph fades in
8. "Writing" toggle fades in

**Motion style:**
- Same spring already used on the site: `y: spring, duration 0.4, bounce 0` + `opacity duration 0.7`
- Each line starts at `y: 8, opacity: 0, filter: blur(4px)` - same as existing item variant
- Stagger driven by `transition.delay` on each line, not a parent `staggerChildren` (so we can control exact timing)

---

## 3. Writing unfold

A "Writing" label with a small down arrow sits below the paragraph.
On click:
- Arrow rotates 180deg (smooth, spring)
- Article list expands below with the existing stagger animation
- Nothing above moves
- On click again: list collapses back up (optional - could be one-way only, TBD)

**Toggle label:**
- Text: "Writing" in `text-sm text-gray-400`
- Arrow: "↓" or a chevron SVG, rotates on open
- No underline, no border - just the text + icon, subtle

---

## 4. What does NOT animate

- Nav header - always visible, no entrance animation
- Footer - always visible
- Title does NOT move when articles unfold

---

## 5. Decisions

- List is a toggle - click Writing to open, click again to close
- State resets on every load - fresh reveal each time
- Initial delay: 150ms before title sequence starts - gives browser time to paint so first frame never gets clipped

---

## 6. Files to touch

- `src/app/home-content.tsx` - all changes live here
- No new files needed
