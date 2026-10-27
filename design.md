# dda_com identity | revision 29

## Direction

A bilingual CTF team site built around the supplied team illustration, selected competition honors, and a clear member directory. The English name is `dda_com`; the Korean name is 따따. Use factual copy and modest headings. The user-supplied introduction is “a.k.a 이성민남친구함” in both languages. The user rejected educational copy and invented conversational slogans. The hero artwork sits directly on a continuous Rose Quartz / Serenity gradient, without a card, window, or frame. Do not add performance charts, employee passes, invented slogans, or oversized decorative typography.

## References

Reviewed on 2026-10-13:

- [TeamH4C](https://h4c.team/), [history](https://h4c.team/en/history), and [members](https://h4c.team/en/members): direct team introduction, year-grouped accomplishments, and a role-first directory. The current implementation groups results by year and links the hero directly to results and members. Unavailable blog, subteam, research, and education content is not invented.
- [idek](https://idek.team/): team illustration, concise introduction, dated records, and clear member navigation.
- [Perfect Blue](https://perfect.blue/): direct member directory, external profiles, and contact information.
- [organizers](https://org.anize.rs/): CTF team content and navigation.

These inform information structure. Their artwork and page designs are not reused. No writeups or biographies are fabricated to fill space.

Earlier visual research included [Oryzo AI / Lusion](https://oryzo.ai/), [Noomo](https://storytelling.noomoagency.com/), and [MindMarket](https://mindmarket.com/). CSS Design Awards social announcements establish recent recognition, not a measured ranking of SNS popularity. Only the material depth and illustration-led direction carry into the current design.

[ToyFight](https://toyfight.co/) and [Cub Studio](https://www.cubstudio.com/) were also reviewed for open compositions and illustration-led brand presentation. Their illustrations are not reused. Member portraits must come from the members; mascot avatars are not used as substitutes.

## Component variant: Axii’s hwatu table

The Seotda dialog uses a compact green felt playing surface, dark wood rails, ivory cards and vermilion backs, as requested. Retain Paperlogy / Wanted Sans. Keep hands, pot, current dialogue and actions within the viewport; on short landscape screens arrange all seats side by side. Rules, the optional free-play tutorial, match history and the meme album open in a separate dismissible panel. Ordinary rounds stay quiet. As the guest joins, the felt darkens and individual cards land with finite motion. At the accusation, a large original film still and blunt typography take over the dialog in a user-dismissed cut. The final card gets a separate, user-controlled flip with the original Hwatu SVG. Preserve image aspect ratios. Short procedural card/chip/impact sounds have a persistent mute control, stop on close or tab hiding, and never loop. Reduced motion keeps the same beats with static cuts. Other members and the surrounding site retain Rose Quartz / Serenity.

## Pages

- Home: team introduction and custom mascot artwork, then a small interactive CTF scene. A solid Serenity toy flag, a pastel keyboard, and an open rose padlock form one composition. The objects open analytical challenges. A separate flag uses genuinely transparent selectable text with no explicit clue. Text selection reveals it, including native mobile selection; keyboard focus is an accessible alternative. The found state remains visible and exposes its own copy button. CSS selection styling also works without JavaScript. Records and members have simple links rather than summary lists. No ornamental DD monograms, SVG obstacle courses, striped fabric flags, fake terminal windows, or tiny system captions.
- Achievements: retain the horizontal toy-room diorama, wallpaper, maple floor, rank-number cubes and calendar toys. The centered block moves forward with native touch/trackpad scrolling, mouse dragging, previous/next controls and keyboard navigation. Only the compact date navigator below the room wraps into a winding sequence. Date rows use 5, 4, 3 or 2 columns according to viewport width, alternate left-to-right and right-to-left, and join with rounded SVG turns. Each date includes the compact event name, round and placement. Verified qualifiers also show “본선 진출” / “Qualified for finals” in both the toy caption and date navigator, using the same data flag. DiceCTF, CODEGATE, DEF CON, SAS CTF and Black Hat MEA carry this status; Midnight Sun’s 11th place remains a qualifier result without a confirmed finals invitation. HackTheon divisions, ENKI entrant handles and ACTF’s XCTF seed remain distinguishable. Text wraps without clipping; phones use two columns for readable labels. Dates never need an internal scrollbar. DOM and keyboard order stay chronological; filtering recalculates visible dates and their connectors. Keep the year plaque, podium metal faces, all event sources and the annual CTFtime snapshot. A confirmed finalist without a known numerical rank uses a `본선` / `FINAL` cube and is excluded from podium filtering.
- Members: an open gallery of toy-like portrait blocks with alternating vertical offsets. Every photo is 1:1, including desktop and tablet; source images are cropped with object-fit cover. Light top faces, darker side faces, and inset rims create the block shape. The seven members form a row of four and a centered row of three on desktop, two columns with a centered final member on both tablets and phones. Phone rows have no alternating vertical offset; smaller square portraits, wrapped contacts and compact spacing keep the seven-person roster easy to scan. All portraits retain equal widths at each breakpoint. The name, optional biography and disciplines, and GitHub/email links sit below each block. `8l4nk` (team captain), `sane100400`, `Axii`, `nobody09`, `Dbi`, `love09010224`, and `snowball` are the user-supplied roster; no invented photo, specialty, or profile URL. Until real photos arrive, a raised first-letter monogram appears on each block, never a bear avatar. The seven faces use serenity blue, rose pink, lilac, mint, butter yellow, peach, and teal in roster order, with matching shaded edges. Each member has a different color, arranged outside rainbow order. The captain role sits on a small navy label. Contact controls become links only when real addresses are supplied. Empty biography data leaves no filler copy or empty form-like area.
- Contact: a rose envelope illustration, contact categories, and the verified external profile. The official team address is `ddacom77@gmail.com`, with email links and an address-copy button in both languages.

On mobile, language and menu controls have at least 44 × 44 px hit areas. The menu expands into two columns, and the masthead wraps if enlarged text needs more room. Keep native page and language links. Reduce empty vertical space on home and the footer; on contact, use a small envelope alongside the introduction so the address, mail link and copy action fit in the first screen. Respect device safe areas and keep select/input text at 16 px or larger.

All four pages have Korean and English static routes. Language selection preserves the current page and persists for future homepage visits.

Seven optional flags remain embedded in the existing objects. The transparent-text discovery has no visible clue or explanatory hint. The other six require analysis and flag submission: JWT algorithm handling, a stateful C checker, RSA public keys, Git object recovery, DNS log reconstruction, and a prefix-MAC extension. All source code and evidence are displayed inline using native disclosures and scrollable code blocks with copy controls. There are no downloads, external challenge endpoints, fake terminals, word games, memory matching, or click-to-win flag rewards. Only SHA-256 answer digests are embedded for the six analytical challenges. The deliberately vulnerable sample code is inert text, never executed by the site.

The shared native dialog keeps a readable heading, source material, and a flag submission form. Inputs have a bounded alphabet and size, and stored answers are revalidated before display. User-controlled values are rendered as text. Only the unchanged invisible flag migrates from the earlier edition. Seven verified discoveries trigger a one-shot vault-door opening, rising flag, and Rose Quartz / Serenity confetti. A replay control is available in the completed collection. Reduced motion produces a static completion scene. The page art, backgrounds, member photos, achievement navigation, and team contact details remain the existing design.

## Type, palette, and assets

Writing uses plain sentences and avoids em dashes. Page titles separate the page name and team name with `|`. Korean and English pages each have their own concise sharing description, reused across the standard meta description, Open Graph, and Twitter cards.

The user approved a free font resembling Recoleta. Fraunces ExtraBold (800, optical size 72, SOFT 100, WONK 1) supplies the rounded serif wordmark in the header, hero, and footer, and English page titles. It is not Recoleta. The hero wordmark is capped at 92 px on desktop to keep space beside the illustration. Paperlogy Bold/ExtraBold provides Korean headings; Wanted Sans Variable provides body and interface text. Local WOFF2 files and their OFL licenses live in `public/fonts/`.

`tokens.css` defines Rose Quartz `#F7CAC9`, Serenity `#92A8D1`, pale rose/blue grounds, warm ivory, navy ink, and secondary material colors. Rose and Serenity connect the imagery, text highlights, and major page regions. The homepage uses one continuous layered gradient. Achievements, members, and contact use a plain cream ground, as requested in the latest correction. The header, home sections, and footer are transparent over their page background. Navigation buttons use tactile keycap edges without an enclosing tray. Decorative English kickers, duplicate team captions, and placeholder member subtitles are removed. Necessary dates and source information use readable body sizes rather than micro captions. Navy maintains readable contrast.

The original `theme.png` is preserved. The current hero uses `public/images/team-object-v2.webp`, an imagegen interpretation of the original bears, D emblems, hats, keyboards, and flags with an actual transparent background. The latest revision removes all globes and strengthens glass thickness, beveled edges, sculpted volumes, and contact shadows. It is a derived illustration, not a replacement official logo. Generation notes are in `docs/image-assets.md`. The DD-and-bear favicon is drawn as SVG and exported to PNG/ICO formats. The native vector envelope is `src/components/MailIllustration.astro`.

## Motion and implementation

The artwork enters once and responds subtly to a fine pointer on desktop. The achievement room moves only when a visitor navigates; the wrapped date rows below it follow normal page scrolling. Content stays visible without JavaScript. Reduced-motion settings disable these effects and cross-document view transitions. There are no perpetual animation loops.

Member blocks use the existing pointer tilt handler, with all three faces moving together. Monogram placeholders shift subtly and actual portraits gently scale on hover. Achievement cubes retain the existing hover tilt and scroll-position-based foreground scale. Native touch momentum and velocity-aware mouse dragging stay in the room only. Date rows below the room are measured on resize, font loading and filtering, with no continuous animation; each date selects the matching competition. Reduced motion uses instant navigation and static toy transforms. Without JavaScript, all twenty-two result links and date anchors remain usable, and dates wrap as a simple grid. Descriptions identify coalition and alternate team names, individual entrants and divisions. ACTF remains the existing Azure Assassin Alliance CTF record and includes its 10th XCTF Finals seed. Seven added results cover HCTF, ENKI’s two individual placements, HackTheon’s beginner runner-up, DiceCTF Finals, the Black Hat MEA qualifier win and TFC CTF 10th as seojin fan club. TFC’s alternate team name appears in both the block caption and date navigator. README.md distinguishes public results from team-provided records. Additional records do not alter the separate CTFtime rating snapshot.

Shared styling is `src/styles/studio.css` and `src/styles/chrome.css`, loaded after `global.css`; `src/styles/mobile.css` follows with mobile layout and safe-area rules; the homepage interaction uses `src/components/CaptureFlag.astro`, `src/styles/capture-flag.css`, and `src/scripts/capture-flag.ts`; the achievement room uses `src/styles/playroom.css` and `src/scripts/playroom.ts`. The earlier `identity.css` is preserved but not imported. Previous chart and member-pass components are also unreferenced. Factual data lives in `src/data/team.ts`; common translated copy lives in `src/data/i18n.ts`.

Achievement blocks with supplied scoreboards open a native dialog, using `AchievementGallery.astro`, `achievement-gallery.css`, and `achievement-gallery.ts`. The action row has a gallery icon and a separate external-result-link icon, with localized accessible names and tooltips. Do not display photo-count or format captions under the blocks. Clicking the main block still opens its gallery; both gallery triggers share one sequence entry. Fifteen team-supplied result images serve fourteen records, including SCTF's two views and separate individual rank captures for ENKI's 8l4nk and nobody09. Group portraits are excluded. At the user’s explicit request, SCAN additionally uses the hello team’s runner-up award photo from Digital Asset’s October 1 report, with the photographer credit, article link and ceremony date. The competition date stays September 28. This makes sixteen images across fifteen blocks. SUCTF and both CODEGATE rounds use a clipped viewport around the team's standings, defined in original pixel coordinates by image metadata. Scale without distortion; keep the source files intact and the full-size links available. Other photos retain their full aspect ratio. Keep each competition's external result source. The cream dialog, navy text and simple circular controls reuse existing material tokens. The gallery starts at the clicked block and follows all photos of the currently visible competitions in chronological order, wrapping after the last photo. Next/previous buttons, arrow keys, horizontal mouse dragging and touch swipes cross competition boundaries; title, result summary, credits and links update together. Vertical scrolling, pinch zoom and small taps keep their native behavior. On phones and short landscape screens, the image and caption scroll in a keyboard-focusable region while the heading, close button, pager and external links remain visible. Reset that region to the top on every photo change. Escape, backdrop dismissal and the close button return focus to the original block. Inert templates and rendering only the selected image avoid loading other images before selection. Dragging the toy room does not open a dialog. No-JavaScript links still open images and result sources. The winding timeline and puzzle plaque behavior remain intact. Scoreboard metadata and bilingual captions live in `src/data/achievement-images.ts`; a caption explicitly distinguishes the supplied CODEGATE qualifier capture's 13th place from the existing final record of 12th.

Responsive verification covers 320, 375, 390, 414, 639, 640, 768, 844, 960, 1440, and 1920 px, plus the existing timeline checks at 1280 and 1600 px. Include 568 × 320 and 844 × 390 landscape dialogs, all sixteen photos, real touch swipes and native vertical panning. Check all eight language routes, keyboard navigation, result filters, missing contact state, reduced motion, and no-JavaScript navigation when changing the layout.

## Exports

The complete source of truth remains `tokens.css`. These portable excerpts cover the puzzle additions and the existing colors and fonts they use. They are documentation, not extra runtime stylesheets.

CSS custom properties:

```css
:root {
  --color-paper: oklch(97.56% 0.0057 88);
  --color-ink: oklch(25% 0.063 270);
  --color-rose: oklch(87.7667% 0.05122 19.669);
  --color-serenity: oklch(72.9335% 0.06473 262.745);
  --color-puzzle-backdrop: oklch(25% 0.03 270 / 0.4);
  --font-display: 'Paperlogy', 'Wanted Sans', sans-serif;
  --font-body: 'Wanted Sans', 'Apple SD Gothic Neo', sans-serif;
  --font-code: ui-monospace, 'SFMono-Regular', Consolas, monospace;
}
```

Tailwind v4:

```css
@theme {
  --color-paper: oklch(97.56% 0.0057 88);
  --color-ink: oklch(25% 0.063 270);
  --color-rose: oklch(87.7667% 0.05122 19.669);
  --color-serenity: oklch(72.9335% 0.06473 262.745);
  --color-puzzle-backdrop: oklch(25% 0.03 270 / 0.4);
  --font-display: 'Paperlogy', 'Wanted Sans', sans-serif;
  --font-body: 'Wanted Sans', 'Apple SD Gothic Neo', sans-serif;
  --font-code: ui-monospace, 'SFMono-Regular', Consolas, monospace;
}
```

DTCG token excerpt:

```json
{
  "color": {
    "paper": { "$type": "color", "$value": "oklch(97.56% 0.0057 88)" },
    "ink": { "$type": "color", "$value": "oklch(25% 0.063 270)" },
    "rose": { "$type": "color", "$value": "oklch(87.7667% 0.05122 19.669)" },
    "serenity": { "$type": "color", "$value": "oklch(72.9335% 0.06473 262.745)" },
    "puzzle-backdrop": { "$type": "color", "$value": "oklch(25% 0.03 270 / 0.4)" }
  },
  "font": {
    "display": { "$type": "fontFamily", "$value": ["Paperlogy", "Wanted Sans", "sans-serif"] },
    "body": { "$type": "fontFamily", "$value": ["Wanted Sans", "Apple SD Gothic Neo", "sans-serif"] },
    "code": { "$type": "fontFamily", "$value": ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"] }
  }
}
```

shadcn/ui semantic color mapping, with the same imported `tokens.css`:

```css
:root {
  --background: var(--color-paper);
  --foreground: var(--color-ink);
  --popover: var(--color-paper);
  --popover-foreground: var(--color-ink);
  --primary: var(--color-ink);
  --primary-foreground: var(--color-on-ink);
  --secondary: var(--color-blue-light);
  --secondary-foreground: var(--color-ink);
  --accent: var(--color-rose);
  --accent-foreground: var(--color-ink);
  --border: var(--color-line-strong);
  --input: var(--color-line-strong);
  --ring: var(--color-focus);
}
```

### Hwatu component variant exports (revision 28)

CSS / Tailwind v4 (append inside `:root` / `@theme` respectively):

```css
  --color-table-felt: #275545;
  --color-table-felt-dark: #1c4035;
  --color-table-stitch: #638575;
  --color-table-wood: #392b25;
  --color-table-wood-edge: #6d5140;
  --color-table-cream: #fff2cf;
  --color-table-muted: #c7d9c9;
  --color-hwatu-red: #ac2d24;
  --color-hwatu-black: #211d19;
```

DTCG color tokens:

```json
{
  "color": {
    "table-felt": {
      "$type": "color",
      "$value": "#275545"
    },
    "table-felt-dark": {
      "$type": "color",
      "$value": "#1c4035"
    },
    "table-stitch": {
      "$type": "color",
      "$value": "#638575"
    },
    "table-wood": {
      "$type": "color",
      "$value": "#392b25"
    },
    "table-wood-edge": {
      "$type": "color",
      "$value": "#6d5140"
    },
    "table-cream": {
      "$type": "color",
      "$value": "#fff2cf"
    },
    "table-muted": {
      "$type": "color",
      "$value": "#c7d9c9"
    },
    "hwatu-red": {
      "$type": "color",
      "$value": "#ac2d24"
    },
    "hwatu-black": {
      "$type": "color",
      "$value": "#211d19"
    }
  }
}
```

Scoped shadcn/ui mapping:

```css
.seotda {
  --background: var(--color-table-felt-dark);
  --foreground: var(--color-table-cream);
  --primary: var(--color-hwatu-red);
  --primary-foreground: var(--color-table-cream);
  --border: var(--color-table-stitch);
}
```
