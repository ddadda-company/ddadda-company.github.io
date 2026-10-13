# dda_com identity | revision 16

## Direction

A bilingual CTF team site built around the supplied team illustration, selected competition honors, and a clear member directory. The English name is `dda_com`; the Korean name is 따따. Use factual copy and modest headings. The introduction is simply “한국 기반 CTF 팀” / “A CTF team based in South Korea”. The user rejected educational copy and conversational slogans. The hero artwork sits directly on a continuous Rose Quartz / Serenity gradient, without a card, window, or frame. Do not add performance charts, employee passes, invented slogans, or oversized decorative typography.

## References

Reviewed on 2026-10-13:

- [TeamH4C](https://h4c.team/), [history](https://h4c.team/en/history), and [members](https://h4c.team/en/members): direct team introduction, year-grouped accomplishments, and a role-first directory. The current implementation groups results by year and links the hero directly to results and members. Unavailable blog, subteam, research, and education content is not invented.
- [idek](https://idek.team/): team illustration, concise introduction, dated records, and clear member navigation.
- [Perfect Blue](https://perfect.blue/): direct member directory, external profiles, and contact information.
- [organizers](https://org.anize.rs/): CTF team content and navigation.

These inform information structure. Their artwork and page designs are not reused. No writeups or biographies are fabricated to fill space.

Earlier visual research included [Oryzo AI / Lusion](https://oryzo.ai/), [Noomo](https://storytelling.noomoagency.com/), and [MindMarket](https://mindmarket.com/). CSS Design Awards social announcements establish recent recognition, not a measured ranking of SNS popularity. Only the material depth and illustration-led direction carry into the current design.

[ToyFight](https://toyfight.co/) and [Cub Studio](https://www.cubstudio.com/) were also reviewed for open compositions and illustration-led brand presentation. Their illustrations are not reused. Member portraits must come from the members; mascot avatars are not used as substitutes.

## Pages

- Home: team introduction and custom mascot artwork, then a small interactive CTF scene. A solid Serenity toy flag, a pastel keyboard, and an open rose padlock form one composition. Pulling up or pressing the flag reveals `dda{y0u_f0und_th3_fl4g}` with a copy button. Records and members have simple links rather than summary lists. No ornamental DD monograms, SVG obstacle courses, striped fabric flags, fake terminal windows, or tiny system captions.
- Achievements: a full-width toy-room diorama with a native horizontally scrolling chronological archive. Each competition has a large rank-number cube and a separate month/day calendar toy on a warm maple floor. The generated pale ivory wall with Serenity clouds stays behind live HTML content. Image width is capped at its native 1774 px. Its top overlaps the introduction by 96 px and dissolves over 260 px; only the final 84 px dissolve at the bottom. There is no colored overlay, full-page image enlargement, or short white stripe across the clouds. Dates progress from oldest on the left to newest on the right; all events share the same object design and scale, with the centered selection in the foreground. There is no separate latest-victory feature. A wooden year plaque, previous/next buttons, and a clickable chronological date rail with one fixed year heading and compact MM.DD labels make time explicit. Podium cube faces use gold, silver, and bronze metallic gradients without laurels. Date selection, touch/trackpad scrolling, arrow keys, Home/End, and year/podium filters stay synchronized. Source notes and the dated annual CTFtime rank remain below the room.
- Members: an open gallery of toy-like portrait blocks with alternating vertical offsets. Every photo is 1:1, including desktop and tablet; source images are cropped with object-fit cover. Light top faces, darker side faces, and inset rims create the block shape. Four columns become two on tablets and one on phones. The name, optional biography and disciplines, and GitHub/email links sit below each block. `8l4nk` (team captain), `sane100400`, `Axii`, and `nobody09` are the user-supplied provisional roster; no invented photo, specialty, or profile URL. Until real photos arrive, a raised first-letter monogram appears against a rose, serenity, or lilac face, never a bear avatar. The captain role sits on a small navy label. Contact controls become links only when real addresses are supplied. Empty biography data leaves no filler copy or empty form-like area.
- Contact: a rose envelope illustration, contact categories, and the verified external profile. The missing email is explicitly marked as pending; entering the real address enables email and copy controls.

All four pages have Korean and English static routes. Language selection preserves the current page and persists for future homepage visits.

## Type, palette, and assets

Writing uses plain sentences and avoids em dashes. Page titles separate the page name and team name with `|`. Korean and English pages each have their own concise sharing description, reused across the standard meta description, Open Graph, and Twitter cards.

The user approved a free font resembling Recoleta. Fraunces ExtraBold (800, optical size 72, SOFT 100, WONK 1) supplies the rounded serif wordmark in the header, hero, and footer, and English page titles. It is not Recoleta. The hero wordmark is capped at 92 px on desktop to keep space beside the illustration. Paperlogy Bold/ExtraBold provides Korean headings; Wanted Sans Variable provides body and interface text. Local WOFF2 files and their OFL licenses live in `public/fonts/`.

`tokens.css` defines Rose Quartz `#F7CAC9`, Serenity `#92A8D1`, pale rose/blue grounds, warm ivory, navy ink, and secondary material colors. Rose and Serenity connect the imagery, text highlights, and major page regions. The homepage uses one continuous layered gradient. Achievements, members, and contact use a plain cream ground, as requested in the latest correction. The header, home sections, and footer are transparent over their page background. Navigation buttons use tactile keycap edges without an enclosing tray. Decorative English kickers, duplicate team captions, and placeholder member subtitles are removed. Necessary dates and source information use readable body sizes rather than micro captions. Navy maintains readable contrast.

The original `theme.png` is preserved. The current hero uses `public/images/team-object-v2.webp`, an imagegen interpretation of the original bears, D emblems, hats, keyboards, and flags with an actual transparent background. The latest revision removes all globes and strengthens glass thickness, beveled edges, sculpted volumes, and contact shadows. It is a derived illustration, not a replacement official logo. Generation notes are in `docs/image-assets.md`. The DD-and-bear favicon is drawn as SVG and exported to PNG/ICO formats. The native vector envelope is `src/components/MailIllustration.astro`.

## Motion and implementation

The artwork enters once and responds subtly to a fine pointer on desktop. The achievement room moves only when a visitor navigates. Content stays visible without JavaScript. Reduced-motion settings disable these effects and cross-document view transitions. There are no perpetual animation loops.

Member blocks use the existing pointer tilt handler, with all three faces moving together. Monogram placeholders shift subtly and actual portraits gently scale on hover. Achievement cubes tilt slightly on hover; scale follows the distance from the viewport center continuously, without restarting a transition at selection boundaries. Geometry is cached until a resize or filter change. Mouse dragging follows the pointer, then settles according to release velocity; drag gestures do not activate result links. Touch and trackpad retain native momentum and snap points. The date rail scrolls smoothly to keep the selected month/day visible, with the year heading outside the scrolling area. Reduced-motion mode uses instant navigation and static toy transforms. A live region announces the selected result. Without JavaScript, all ten links remain in the scrollable archive, and the date rail uses native anchor navigation.

Shared styling is `src/styles/studio.css` and `src/styles/chrome.css`, loaded after `global.css`; the homepage interaction uses `src/components/CaptureFlag.astro`, `src/styles/capture-flag.css`, and `src/scripts/capture-flag.ts`; the achievement room uses `src/styles/playroom.css` and `src/scripts/playroom.ts`. The earlier `identity.css` is preserved but not imported. Previous chart and member-pass components are also unreferenced. Factual data lives in `src/data/team.ts`; common translated copy lives in `src/data/i18n.ts`.

Responsive verification covers 320, 375, 414, 768, 1280, 1440, 1600, and 1920 px. Check all eight language routes, keyboard navigation, result filters, missing contact state, reduced motion, and no-JavaScript navigation when changing the layout.
