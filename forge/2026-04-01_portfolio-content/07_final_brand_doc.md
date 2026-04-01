# Flo Lenormand - Portfolio Brand & Content

A complete reference for the portfolio site rewrite. Every piece of content, the brand logic behind it, and the About page conversation format.

---

## Brand Positioning

### The line
> I made message bubbles safe, then expressive, now smart.

### The story
Flo has spent his career designing what happens inside message bubbles. Each chapter deepened the work:

- **Safe:** Three years on Messenger and Instagram safety. Sextortion, harassment, scams, teen protection. Designing systems that prevent the worst before someone lives through it. The most important design work is the kind nobody ever sees.

- **Expressive:** Media experiences on Messenger. How photos and videos show up in conversations. Craft as respect for people's content. The emoji physics animation that made leadership care about an entire project.

- **Smart:** MSL. AI agents entering conversations. A new kind of message that does things in the real world. Still figuring out what it should feel like.

### Brand pillars
1. **Craft as respect** - not decoration, not polish. Craft means treating people's content and conversations with care. Aspiration, not claim.
2. **Thinking before building** - every article is about this tension. Build fast, then ask if it mattered.
3. **AI as collaborator** - uses AI constantly, writes critically about its limits, built a tool to make AI disagree with him.

### Voice
Calm confidence. Thoughtful, not loud. Human, never corporate. Kind but honest. Slightly self-deprecating but never uncertain. No em dashes. No triple-adjective lists. No selling. If it reads like a LinkedIn post, rewrite it.

---

## Homepage

### Intro

**Visual treatment:** The brand line renders as a single pinned message bubble - the same blue bubble format from the About page chat, but pinned at the top of the homepage like a saved message. One visual hint at the bubble brand. The About page is where the full chat lives; the homepage gets just a taste.

> I made message bubbles safe, then expressive, now smart.

One line. No bridge. The article list below speaks for itself.

The pinned message format does two things:
1. Seeds the bubble brand on the first page the reader lands on
2. Makes the About page feel like a payoff - "oh, that's where the bubbles go"

### Meta description (SEO / OpenGraph)
> Flo Lenormand - Product Designer. I made message bubbles safe, then expressive, now smart. Writing about craft, AI, and what I learn along the way.

### Article list (newest first)

**1. I get so addicted to vibecoding that I forget to think**
March 2026
"I built 18 features for an app nobody needed. Then I built something to make sure it never happens again."

**2. AI made everyone a designer. It didn't teach anyone taste.**
March 2026
"Anyone can make a Figma mock now. Almost nobody can tell you if it's good."

**3. I ran a design sprint with AI and I've never felt that lonely**
March 2026
"AI was faster and more exhaustive than any team I've worked with. I still missed the people."

**4. How I made $240 in one week with OpenClaw**
March 2026
"I gave an AI agent a real job: sell my family's clothes online. It made $240, negotiated in Italian, and ordered its own shipping supplies."

**5. An inclusive team for non-native English speakers**
June 2021
"What I learned about contribution when English isn't your first language."

**6. When a designer is taking care of customer support**
October 2019
"A week on support taught me more about our product than a year of design reviews."

**7. How design principles helped me stop bad design behavior**
August 2019
"Principles don't prevent bad design. They make you notice it sooner."

**8. I asked the President for an internship in design**
March 2019
"I emailed the French presidency asking for a design job. They said yes."

---

## About Page: The Conversation

### Format
The About page is a two-sided chat conversation between Flo and his mum. She asks him questions the same way she always has - not quite getting what he does, but genuinely curious. The reader eavesdrops.

### Why this format
- The format IS the brand. Flo designs message bubbles. His bio is message bubbles.
- It forces tight, human writing. No room for resume bloat.
- Mum's reactions create rhythm, humor, and pacing in a way an anonymous friend can't.
- The conversation is real - adapted from actual texts she sent when asked what she doesn't understand about his work.
- Message reactions (hearts, emphasis) add emotion without extra words.
- Nobody else's portfolio does this.
- It signals craft. The hardest format to pull off well.

### Why mum specifically
An anonymous friend asking "what does that even mean though" reads as mildly dumb. A mum asking the same question is instantly warm, universal, and funny. Everyone has explained their job to their mum. The confusion is relatable. The love behind it isn't.

There's also a joke baked in: Flo designs the product his mum uses to contact him every day. She still doesn't really know what he does.

### Design details
- Two-sided bubbles: mum (gray, left), Flo (blue, right)
- Message reactions on specific messages (mum reacting to Flo's messages)
- Responsive: on mobile it should feel native, like reading a real chat
- Accessibility: screen readers must read it as content, not decoration
- No avatar for mum. No name label. The relationship becomes clear from context.
- **If the mobile experience doesn't feel native, the concept fails. Render it like Messages, not like a styled div.**

### The conversation

---

**Mum:** funny that you're my son and i still don't understand one bit of what you do. at least when I garden, I can see what I'm doing. With you I can't.

**Flo:** i design message bubbles mum.

**Mum:** what do you mean?

**Flo:** well, i started with safety. my job was to make sure conversations stay safe on Messenger and Instagram Direct. i designed systems that stop the worst from happening before someone has to live through it.

**Mum:** I always tell people you protect them on Amstragram

**Flo:** then i designed media on Messenger. how photos and videos live inside a conversation. the way you react to an image. the way a video feels when you open it.

[Mum reacted 👍 to this message]

**Flo:** funny, i once built a physics engine for emoji reactions. SpriteKit on iOS, Metal shaders on long press. the prototype made the whole project get approved. craft is the fastest way to make people care.

**Mum:** i have no idea what you're talking about

**Mum:** but now you work on AI.. what does design have to do with any of that?

**Flo:** yeah that's a great question. robots are entering the chat and they can do impressive things. i'm working hard to make sure they solve actual problems.

**Flo:** honestly.. what design means in this space keeps changing. and i love that

**Mum:** funny to see where you ended up when I remember being so worried about you at school..

**Flo:** yeah.. i remember. but i guess i needed some time to find what i cared about. art school did that, i graduated top of my class.

**Mum:** yeah and after an art school you went to fix parking.. i never really understood why

**Flo:** it was such a great opportunity. it got me to San Francisco, i was solo designer and Apple featured us three times!

**Mum:** featured? i thought they were going to buy you

[Flo reacted 😂 to "i thought they were going to buy you"]

**Mum:** anyways, let me know when you, Emma and Michelle are around, we have so many vegetables in the garden to eat!

---

*Contact: plain email link here, outside the chat UI.*

---

### Conversation design notes

- **Mum's lines are real.** Adapted from actual text messages she sent on Messenger. The conversation is not invented - it's edited. That's what makes it land.
- **The opener** is her real answer to "what don't you understand about my work?" The garden image is hers. Don't rewrite it.
- **"Amstragram"** is her real word for Instagram. Don't correct it in the UI.
- **The 👍 on the media line** is her boomer reaction - no words, just a thumbs up. More real than any text response.
- **The SpriteKit/Metal shader line** shows Flo codes and thinks strategically. Mum's "i have no idea what you're talking about" is her honest register with technical things - she moves straight on without waiting for an explanation, which is funnier than any follow-up.
- **The 😂 reaction** is Flo reacting to mum thinking Apple was buying SpotAngels. More in character than a text response.
- **"featured? i thought they were going to buy you"** is real. She genuinely believed it.
- **The vegetables closer** is real and is the best line in the document. She didn't quite follow any of it but she loves him and she's feeding people. Don't add anything after it.
- **Contact lives outside the bubbles.** Plain email link below the conversation. The chat ends at the vegetables.
- **Flo's voice in chat:** lowercase i, ".." not "...", "well" and "honestly" as openers, slightly self-deprecating. Never corporate.
- **Mum's voice in chat:** natural capitalization, ".." for trailing thoughts, warm but slightly resigned. She texts like a mum.
- **No avatar, no name label for mum.** The relationship becomes clear immediately from context.

---

## Domain

flolenormand.com

---

## What's NOT changing
- Article body content (the actual essays) - out of scope
- Site structure (homepage + about + writing/[slug]) - stays the same
- Nav labels ("Writing", "About") - stays the same
- Footer links (Substack, Threads, LinkedIn, Email) - stays the same
- Visual design of the site - out of scope for this content pass (except the About page chat format)

## What needs to be built
- Two new article pages: vibecoding piece and lonely sprint piece (content from Google Docs)
- About page: chat conversation UI component
- Homepage intro update (pinned bubble visual treatment)
- Meta description update
- All article descriptions updated
- Dashboard article removed from site
