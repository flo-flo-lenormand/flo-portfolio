# PRD - Flo's Portfolio v2

## Vision

A portfolio that feels like a piece of art, not a website. This is a carte de visite, not a hiring tool. Flo's actual work lives in a separate presentation. This site is personal, expressive, and exploratory.

One page. One text. Hidden interactions embedded in the words. No navigation bar, no routes, no menus. The entire portfolio is a single centered paragraph with interactive words that open floating panels of content.

The portfolio has Flo's voice. It's personal, confident, slightly irreverent. The about section is literally a chat with his mum.

---

## Architecture

**Single page.** Everything lives on one URL (`/`). The home text is always visible and centered. Content opens in side panels that slide in from the edges:

- **"My mum"** (stabilo highlighted) -> left panel with mum conversation
- **"I write"** (handwritten font) -> right panel with article list
- **Article click** from the right panel -> full-page article detail (separate route `/writing/[slug]`)

Clicking one panel closes the other (only one panel open at a time). Panels have a torn-paper edge texture on the side facing the home text.

---

## The Home Text

### Content

Centered on the page, vertically and horizontally. No other UI elements.

```
I made conversations safe on [Instagram logo].
Then expressive on [Messenger logo]. Now I'm making
them smart, designing AI agents at [MSL logo].

[stabilo]My mum[/stabilo] says I design message bubbles
and honestly she's not wrong.

[handwritten]I write[/handwritten] about design on flat days.
```

### Typography

- Font: Geist Medium, 22px, black
- 28px gap between paragraphs
- Content width: 460px
- Vertically and horizontally centered in viewport

### Interactive Elements

**App logos (inline, not clickable):**
- Instagram, Messenger, and MSL logos replace the company names in the first paragraph
- Sized to match the x-height of the surrounding text (~22px)
- On hover: a handwritten label appears above/beside the logo with the company name (e.g. "Instagram", "Messenger", "MSL (Meta Superintelligence Labs)")
- Hover labels use a handwritten font, positioned as annotations
- Logos are NOT clickable - they're decorative with hover context

**"My mum" (stabilo highlight):**
- "My mum" text has a yellow highlighter/stabilo effect behind it
- Highlighter color: yellow (#FFEB3B or similar bright yellow, slightly imprecise like a real marker)
- Clickable: opens the left panel with mum conversation
- Cursor: pointer on hover

**"I write" (handwritten):**
- "I write" rendered in a handwritten font (distinct from Geist)
- Clickable: opens the right panel with article list
- Cursor: pointer on hover

**Word hover effects (easter eggs, same as before):**
- "safe" - goes blurry on hover
- "expressive" - goes multicolor on hover
- "smart," - shimmers with AI-thinking animation on hover (left-to-right, 3.5s, subtle)

---

## Left Panel: Mum Conversation

Opens when "My mum" is clicked. Slides in from the left edge of the screen.

### Layout

- Width: ~40% of viewport (or fixed ~400px, whichever feels right)
- Height: full viewport
- Background: white
- Right edge: torn paper texture (a ripped/torn edge visual, not a clean line)
- Close button: X in the top-right corner of the panel
- Content scrolls vertically within the panel

### Content

Same conversation as current about-view. See "Conversation Content" section below.

### Mum's Bubbles

- Background: #F2F4F7
- Border radius: top-left 4px, top-right 18px, bottom-left 4px, bottom-right 18px
- Padding: 18px left/right, 8px top/bottom
- Font: Geist Regular, 17px, black (#080809), line-height 22px
- Max width: 294px
- "Mum" label: Geist Regular, 12px, rgba(0,0,0,0.42), 18px left margin, 0px above first bubble (appears once at top)

Consecutive mum messages: 4px gap.

### Flo's Answers

- Font: Geist Medium, 24px, black
- Multiple paragraphs within one answer: 28px gap
- Full panel content width

### Spacing

- 20px between mum bubble group and Flo's answer
- 62px between exchanges

### Animation

- Panel slides in from left: translateX(-100%) -> translateX(0)
- Duration: 300ms, easing: cubic-bezier(0.2, 0, 0, 1)
- Exit: translateX(0) -> translateX(-100%), 150ms, ease-in
- Home text stays in place (does not shift)

---

## Right Panel: Article List

Opens when "I write" is clicked. Slides in from the right edge of the screen.

### Layout

- Width: ~35% of viewport (or fixed ~380px)
- Height: full viewport
- Background: white
- Left edge: torn paper texture (mirrored version of the mum panel edge)
- Close button: X in the top-left corner of the panel (mirrored from mum panel)
- Content scrolls vertically within the panel

### Content

A list of published articles. Each entry shows:
1. **Title** - Geist Medium, font size TBD for panel (likely 18-20px), black
2. **Description** - Geist Regular, 14px, rgba(0,0,0,0.6), single line truncated with ellipsis at panel edge

Articles are clickable - clicking navigates to `/writing/[slug]` (full page).
External articles open in a new tab (shown with arrow icon).

### Published Articles (as of now)

| Title | Description | Type |
|-------|-------------|------|
| AI made everyone a designer. It didn't teach anyone taste. | Anyone can make a Figma mock now. Almost nobody can tell you if it's good. | Internal |
| How I made $240 in one week with OpenClaw | I gave an AI agent a real job: sell my family's clothes online. It made $240, negotiated in Italian, and ordered its own shipping supplies. | Internal |
| An inclusive team for non-native English speakers | What I learned about contribution when English isn't your first language. | External |
| When a designer is taking care of customer support | A week on support taught me more about our product than a year of design reviews. | External |
| How design principles helped me stop bad design behavior | Principles don't prevent bad design. They make you notice it sooner. | External |
| I asked the President for an internship in design | I emailed the French presidency asking for a design job. They said yes. | External |

### Animation

- Panel slides in from right: translateX(100%) -> translateX(0)
- Duration: 300ms, easing: cubic-bezier(0.2, 0, 0, 1)
- Exit: translateX(0) -> translateX(100%), 150ms, ease-in

---

## Article Detail (Full Page)

When clicking an article from the right panel, navigates to `/writing/[slug]`.

### Content

- Title: Geist ExtraBold, 48px, black
- Body: Geist Regular, 22px, black, line-height 1.7
- 28px gap between paragraphs
- Content width: 670px max, centered
- No date displayed
- No navigation bar

### Returning Home

- Pressing Esc key navigates back to `/#home`
- A single `[esc]` key visual at the bottom (macOS style, 76x50px)
- Bottom gradient overlay (209px, rgba(255,255,255,0.64) -> white)
- Browser back button also returns to home

### Esc Key Specs

- Font: Geist Regular, 11.5px, rgba(0,0,0,0.6), bottom-left aligned
- Same macOS key styling: white bg, 0.2px inside stroke #DCDCDC, drop shadow 0 1 1 rgba(0,0,0,0.25), border-radius 8.5px
- Pressed state: drop shadow becomes inner shadow
- Centered horizontally, 80px from bottom

---

## Conversation Content

Full mum conversation (appears in left panel):

**Block 1:**
> Mum: Flo, you're my son and I still don't understand what you do...

Flo: I'm a product designer, meaning businesses pay me (way more than they should) to think and draw

**Block 2:**
> Mum: I'm not sure this help, honestly

Flo: So remember, I started with safety. My job was to make sure conversations stay safe on Instagram. I designed systems that stop the worst from happening before someone has to live through it.

**Block 3:**
> Mum: I told people you were working on Amstragram

Flo: Haha, well I did. Then I designed media on Messenger. How photos and videos live inside a conversation, the way you react to an image, the way a video feels when you open it.

It's funny, once I built a physics engine for emoji reactions. SpriteKit on iOS, Metal shaders on long press. The prototype made the whole project get approved. I really think that craft is the fastest way to make people care.

**Block 4:**
> Mum: I told people you were working on Amstragram
> Mum: But now you work on AI.. What does design have to do with any of that?

Flo: yeah that's a great question. robots are entering the chat and they can do impressive things. i'm working hard to make sure they solve actual problems.

honestly.. what design means in this space keeps changing. and i love that

**Block 5:**
> Mum: It's funny to see where you ended up when I remember being so worried about you at school.

Flo: I guess I needed some time to find what I cared about. Art school did that! I graduated top of my class.

**Block 6:**
> Mum: And after an art school you went to fix parking.. i never really understood why

Flo: it was such a great opportunity. it got me to San Francisco, i was solo designer and Apple featured us three times!

**Block 7:**
> Mum: Featured? I always thought they were going to buy you
> Mum: Anyways, let me know when you, Emma and Michelle are around, we have so many vegetables in the garden to eat together!

*(No Flo reply - conversation ends on mum's warmth)*

---

## Easter Eggs Summary

1. **"safe" hover** - word goes blurry
2. **"expressive" hover** - word goes multicolor
3. **"smart," hover** - word shimmers like AI thinking (left-to-right, 3.5s, subtle)
4. **Logo hover** - handwritten label appears with company name
5. **"My mum" click** - left panel tears open with mum conversation
6. **"I write" click** - right panel tears open with article list
7. **Torn paper edges** - panels feel physical, not digital

---

## Design Tokens

### Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Home text | Geist | 22px | Medium (500) | #000000 |
| Flo answers (mum panel) | Geist | 24px | Medium (500) | #000000 |
| Article list title | Geist | ~18-20px | Medium (500) | #000000 |
| Article list description | Geist | 14px | Regular (400) | rgba(0,0,0,0.6) |
| Article detail title | Geist | 48px | ExtraBold (800) | #000000 |
| Article detail body | Geist | 22px | Regular (400) | #000000 |
| Mum bubble text | Geist | 17px | Regular (400) | #080809 |
| Mum label | Geist | 12px | Regular (400) | rgba(0,0,0,0.42) |
| Esc key label | Geist | 11.5px | Regular (400) | rgba(0,0,0,0.6) |
| "I write" | Handwritten font | ~22px | - | #000000 |
| Logo hover labels | Handwritten font | ~14px | - | rgba(0,0,0,0.6) |

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Background | #FFFFFF | All surfaces |
| Text primary | #000000 | Main text |
| Text secondary | rgba(0,0,0,0.6) | Descriptions, labels |
| Mum label | rgba(0,0,0,0.42) | "Mum" label |
| Bubble background | #F2F4F7 | Mum's chat bubbles |
| Stabilo highlight | ~#FFEB3B | "My mum" background |
| Key border | #DCDCDC | Esc key border |
| Key shadow | rgba(0,0,0,0.25) | Esc key drop shadow |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Home paragraph gap | 28px | Between paragraphs |
| Exchange gap | 62px | Between conversation blocks |
| Bubble-to-answer | 20px | Mum bubble to Flo's answer |
| Consecutive bubbles | 4px | Stacked mum messages |
| Home content width | 460px | Main text column |
| Article detail width | 670px | Article reading width |
| Mum label left margin | 18px | "Mum" label offset |
| Bubble padding H | 18px | Left/right in bubbles |
| Bubble padding V | 8px | Top/bottom in bubbles |

### Animation Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Panel enter duration | 300ms | Side panel slide in |
| Panel exit duration | 150ms | Side panel slide out |
| Panel easing (enter) | cubic-bezier(0.2, 0, 0, 1) | Panel enter |
| Panel easing (exit) | ease-in | Panel exit |
| Hover duration | 200ms | All hover transitions |
| Shimmer duration | 3.5s | "smart" shimmer loop |
| Key press duration | 150ms | Esc key pressed state |

---

## Social Links

Available on "Flo" hover (hidden for now, can be re-added later):
- LinkedIn: https://www.linkedin.com/in/florent-lenormand/
- Substack: https://substack.com/@flolenormand
- X: https://x.com/Flo_lenormand
- Instagram: https://www.instagram.com/flo_lenormand/

---

## Tech Stack

- **Framework:** Next.js (existing)
- **Font:** Geist (already loaded) + handwritten font TBD
- **Styling:** Tailwind CSS v4 (existing)
- **Content:** Markdown articles (existing pipeline)
- **Animations:** CSS transitions (interruptible) + motion/react for panel animations
- **Torn paper edge:** CSS mask-image or SVG path

---

## Open Questions

1. **Handwritten font choice:** Which handwritten/script font for "I write" and logo hover labels? Needs to feel personal but legible.
2. **Torn paper texture:** CSS mask with an SVG path? Or a PNG image mask? Need to decide on implementation approach.
3. **Panel widths on small screens:** At what viewport width do the panels become full-width overlays instead of side panels?
4. **Logo assets:** Need Instagram, Messenger, and MSL logos as inline SVGs or small images. Sized to x-height (~22px).
5. **Stabilo highlight style:** Clean rectangle or slightly rough/organic shape to mimic a real highlighter stroke?

---

## Out of Scope (v1 Desktop)

- Mobile experience (separate document - tilt to navigate)
- SEO optimization beyond basics
- Analytics
- Dark mode
- "Flo" social icon hover (hidden for now, re-add later)
- 404 page
- RSS feed
