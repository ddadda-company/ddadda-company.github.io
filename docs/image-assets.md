# Team illustration and icon assets

Created on 2026-10-13. The supplied official reference is `theme.png`; it is preserved unchanged.

## Hero illustration

Method: built-in imagegen, using the supplied reference for a stylized 3D interpretation. The intermediate composition preserves the three bears, rose/serenity D letters, hats, flags, and keyboards. The final imagegen edit removes the room to produce actual alpha transparency. Sharp only resizes and encodes the generated output to WebP; it is not used to synthesize or edit illustration content.

- Intermediate scene: `public/images/team-scene.webp` (retained, not rendered).
- First cutout: `public/images/team-object.webp` (retained, not rendered).
- Final generated PNG: `generated_images/exec-4cce2545-b512-432e-b253-899bdd120113.png`.
- Output: 1600 px wide WebP, quality 88, alpha quality 95.

Exact final edit prompt:

> Use case: background-extraction. Edit the supplied 3D illustration into a clean transparent-background website foreground asset. Keep the complete central DDADDA sculptural installation exactly as shown: the two rose quartz and serenity glass D letters, the three bears and their exact faces and poses, both fabric hats, flags and poles, the three blue-and-cream globes behind them, both keyboards with their coiled cables, and the oval stone plinth. Remove the entire studio room, wall, desk surface, vase, plants, notebook, pen, scattered foreground keycaps, and all other surroundings. Preserve the object's colors, shape, detail, photographic lighting and material textures; do not redraw or restyle it. Keep a very subtle soft contact shadow immediately beneath the stone plinth on transparency. Tight but uncropped framing, small transparent margins all around the installation, no text, no added graphics. The background must be actually transparent with alpha, not white, not a checkerboard.

## Hero revision: no globes, stronger 3D materials

Current output: `public/images/team-object-v2.webp`, 1600 × 900 with alpha, generated with the built-in imagegen edit tool. It replaces the first cutout on the site; the earlier asset remains preserved. The source PNG is `generated_images/exec-2742ebb2-e2b1-436a-847a-64c9ba7a327b.png`.

Exact revision prompt:

> Use case: precise-object-edit and style-transfer. Edit the supplied transparent-background website mascot illustration.
> PRIMARY CHANGE: completely remove ALL three blue-and-cream globes behind the letters and characters. Remove every globe, map sphere, planet, and their remnants/reflections. The space behind and through the two D letter holes must become clean alpha transparency wherever not occupied by a kept object. Do not replace the globes with anything.
> KEEP the recognizable team identity and arrangement: two large rose quartz pink and serenity blue uppercase D sculptures, the same three cute bears with the same faces and poses (cream bear hugging in center, small blue bear on left, small pink bear on right), two navy fabric fedoras on the D letters, both flagpoles and fabric flags, both mechanical keyboards and coiled cables, the low oval ivory stone plinth. No text or extra marks.
> SECONDARY CHANGE: make this a more convincingly dimensional, premium 3D collectible sculpture. Give the D letters clearly visible thick extruded sides, rounded bevels, layered translucent resin/glass, physically plausible internal refraction and clean controlled highlights. Increase sculpted volume on the bears through soft subsurface shading, detailed rounded paws, glossy glass eyes, gentle contact occlusion where they hug the letters. Give the keyboards deep individual keycaps, the hats woven fabric and clear thickness, the plinth a substantial visible front edge and convincing contact shadows. Refine materials and depth rather than increasing saturation or adding busy glitter. Use a mild three-quarter camera angle, large soft upper-left studio key light and cool rim light, crisp local shadows in crevices, high-end Octane/Cycles-like product rendering.
> Preserve the rose quartz / serenity / cream palette and the friendly original mascot character. Preserve complete uncropped object silhouettes with small transparent margins. Actual transparent background with alpha, only a subtle contact shadow under the plinth. No room, backdrop, floor plane, gradient background, frame, pedestal enlargement, globes, spheres, new objects, or typography. Wide composition with the sculpture centered.

## Favicon

`public/favicon.svg` is a native vector simplification of the supplied double-D and bear identity. It uses the rose and serenity pair, a cream bear face, and a pale background that remains visible on light and dark browser tabs. This icon is drawn directly as SVG rather than generated as a bitmap.

The SVG is also exported at 32 px to `favicon-32.png`, 96 px to `favicon-96.png`, 180 px to `apple-touch-icon.png`, and 16/32/48 px in `favicon.ico`. The layout explicitly links the PNG and ICO files for search engines, alongside the SVG for browsers. Icon URLs are stable and have no version query. Header and footer share the same mark. Member photo placeholders use the nickname's first letter on a CSS block face, not the team mascot. Real portraits use a 1:1 photo area (recommended source 600×600).

## Achievements playroom

Created on 2026-10-13. Method: built-in imagegen, new stylized-concept generation without image references. This is a decorative room background inspired by the toy-room atmosphere requested by the user. Rank cubes, dates, event names, and navigation are HTML/CSS; the image contains no records or text.

- Original PNG (preserved): `generated_images/exec-748970aa-97cd-4290-8cdc-82151fbeafcc.png`.
- Site asset: `public/images/achievements-playroom.webp`, 1774 × 887, WebP quality 88, approximately 68 KB.
- Sharp was used only to encode the generated image as WebP; no content was edited.

Exact generation prompt:

> Use case: stylized-concept.
> Asset type: wide background illustration for a CTF achievements website. The foreground competition names, rank-number toys and calendar toys will be added separately in HTML, so this image must have NO text, digits, letters or UI.
> Scene: a premium 3D animated-film children's playroom, Toy Story-inspired tactile miniature world. Camera at a low toy-level three-quarter viewpoint, looking across a spacious pale warm maple floor toward a soft serenity-blue wall with a few simple ivory cloud shapes. A cream baseboard joins wall and floor roughly one third down the image. Warm late-afternoon window light from the upper left creates broad gentle sun patches and soft ambient shadows, not hard high-contrast stripes.
> Composition: panoramic landscape, approximately 2:1. Keep the entire central 85% and all foreground floor completely empty and uncluttered as a usable stage for three website content objects. Any physical toys are small and limited to far back corners: a rose-quartz wooden stacking arch and a tiny blue wooden toy rocket on the extreme right edge, and two plain cream/rose wooden cubes on the extreme left edge. No furniture blocking the floor. Floor perspective lines very subtle.
> Palette: rose quartz #F7CAC9, serenity blue #92A8D1, ivory, light maple. Fine painted wood grain, rounded handcrafted bevels, satin plastic and warm soft shadows. Cinematic global illumination, detailed but calm, convincing dimensional materials. Friendly, polished, nostalgic, not photorealistic.
> Constraints: no people, no humanoid characters, no bears, no recognizable movie characters, no posters, no logos, no written text or numbers, no banners, no borders, no empty cards, no trophies. The background is a real coherent 3D room, not an abstract gradient. Large quiet center is essential.
## CTF toy flag — 2026-10-13

- Final asset: `public/images/capture-toy-flag.webp`.
- Preserved generation source: `generated_images/exec-035d106f-9eae-48b7-bfa8-b02551244c46.png`.
- Method: Built-in imagegen, new stylized-concept generation. Sharp only resized to 720 × 960 and encoded WebP with alpha.
- Exact final prompt:

> Use case: stylized-concept.
> Asset: one isolated CTF toy flag for a playful pastel team website.
> A charming chunky miniature toy flag, NOT realistic fabric. Solid single-color serenity blue #92A8D1 triangular pennant with a gentle sculpted wave, thick softly beveled edges, matte molded rubber / soft vinyl. One short sturdy cream painted wooden pole, rounded ends, and a tiny rose-quartz pink spherical finial at top. Flag is entirely BLUE: no stripes, no color bands, no white band, no other colors on the pennant. Exaggerated friendly toy proportions, tactile high-end 3D animated film prop, simple and substantial. Soft ambient studio lighting, soft highlights, no photographic silk texture, no shiny thin metal. Three-quarter view, slight perspective, complete object, 3:4 portrait composition, generous transparent margins. No base, no pedestal, no other toys, no scenery. No letters, no logo, no DD, no symbols. True transparent background.
## Pale playroom background — 2026-10-13

- Final asset: `public/images/achievements-playroom-v2.webp`.
- Preserved generation source: `generated_images/exec-2c0b2058-a7dd-4eb9-9661-40675fbf7bf3.png`.
- Method: Built-in imagegen edit, referencing the original achievements-playroom.webp. Sharp only encoded the 1774 × 887 result as WebP.
- Exact final prompt:

> Use case: lighting-weather / precise-object-edit.
> Input image 1 is the edit target, a toy-room website backdrop.
> Keep: panoramic 2:1 composition, low viewpoint, empty center stage, warm maple floor, small pastel toys only in far back corners, a few complete cloud motifs, tactile premium 3D materials.
> Change: integrate this room naturally with a light cream #F8F7F3 website. Replace dark blue wallpaper with very pale warm ivory painted wall and delicate serenity-blue cloud motifs, all cloud shapes fully within the frame with generous upper margin. Remove the prominent cropped window and curtains at left; light comes from an unseen window. Soft neutral daylight, not golden sunset. Floor should be very pale whitewashed maple with subtle grain, almost ivory in the near foreground. Uppermost 12% of the image is a clean featureless warm ivory wall matching #F8F7F3; lowermost 8% has extremely subtle floor texture in the same cream. This continuity comes from actual pale materials and neutral studio lighting, NOT an airbrushed vignette, NOT a white overlay, NOT blurring, NOT artificial gradient fades. Preserve spatial depth at the wall-floor baseboard. Room stays crisp. No cropped clouds, no borders, no text, no UI, no additional large foreground objects. Output wide detailed image, approximately 2:1.
## CTF scene props — 2026-10-13

- Final asset: `public/images/capture-props.webp`.
- Preserved original: `generated_images/exec-c5da7f72-1ca4-46e3-b416-c075de6404b5.png`.
- Method: built-in imagegen; new stylized-concept generation. Sharp resized to 1200 px width and encoded WebP, preserving alpha. The separate flag remains interactive HTML.
- Exact final prompt:

> Use case: stylized-concept.
> Asset: transparent supporting illustration for an interactive CTF flag playground on a pastel website. A single cohesive arrangement of two large tactile toy objects and one connecting cable, on an invisible tabletop. A compact chunky mechanical keyboard in the lower-left foreground, diagonally positioned in a gentle three-quarter view, with ivory keycaps, a few rose-quartz and serenity-blue keycaps, and a softly rounded serenity-blue case. A substantial open rose-quartz toy padlock sits at far right, its curved ivory shackle visibly open. One short coiled pastel blue keyboard cable rests naturally on the tabletop between the keyboard and lock. Keep top half and upper center mostly empty because a separate interactive flag will be placed there by the website. All objects occupy the bottom half of this wide 3:2 composition. The keyboard overlaps slightly in front of the cable; believable unified perspective and soft contact shadows. High-end animated film toy props, rounded matte vinyl and painted wood, soft large studio lights. Friendly, polished, detailed but simple. Keycaps are BLANK, no text at all. No flag, no flagpole, no pedestal, no base/platform, no floor surface, no background scenery, no decorative rings or geometric confetti, no letters, no DD, no logos, no numbers, no characters. True transparent background. Objects fully visible with generous margins, no cropping.
