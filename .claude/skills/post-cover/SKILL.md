---
name: post-cover
description: Draw a custom cover picture for a blog post on roaldnefs.com as a hand-written SVG about the post's topic, in the site's long-exposure "drawn in light" style, and wire it into the post. Use this whenever the user asks for a cover, header image, hero image, thumbnail, card picture or artwork for a post, wants to replace or redo a post's automatic picture, says a post's picture is generic or doesn't fit, or has just written a new post that should get its own image.
---

# Post cover

Every post gets a picture automatically: `layouts/partials/cover.html` builds an
abstract scene from the post title. Those are fine as a fallback but say nothing
about the post. This skill replaces the automatic picture for one post with a
drawing about what the post covers.

The result is one SVG file, written by hand, plus one line of front matter.

## How a cover reaches the page

- The file goes next to the post's other images: `static/images/posts/YYYY/MM/DD/cover.svg`,
  using the post's date. Create the folder if the post has no images yet.
- The post names it in front matter: `cover: /images/posts/YYYY/MM/DD/cover.svg`.
- `layouts/partials/post-cover.html` returns that path when it is set and the
  generated picture otherwise. Nothing else needs to change.

## The style

The site's pictures look like long-exposure photographs taken at dusk: a dark,
hazy blue backdrop with a horizon, and the subject made of light. Keep to that,
so a custom cover sits comfortably beside the generated ones in the blog grid.

Draw the subject as **traces of light**: thin luminous lines, as if someone
painted the outline in the air with a torch while the shutter was open. No
filled shapes, no flat-colour illustration, no text, no logos.

- **Warm light for the main form:** `#fff6e6` (hottest points), `#ffe2b8`,
  `#ffb56b`, `#ff8a45`, `#ff5a36`.
- **Cool light for secondary detail:** `#d9ebff`, `#8fc8ff`, `#3f8fe0`.
- **Backdrop:** the blues in the template. Shifting the horizon or the tones a
  little between covers is good; leaving the blue family is not.
- Line widths between 2 and 6 at the 1600 by 900 canvas. Thinner lines vanish at
  card size; thicker ones stop reading as light.
- One brightest point, where the eye should land. Put a small near-white dot or
  a short hot segment there.

Start from `assets/template.svg`. It carries the backdrop, the glow, the streaks
and the finishing layers (darkened edges, grain), and it shows the trick that
makes lines glow: the drawing sits in the group with the id `subject` and is
painted three times, as a wide glow, a tight halo and a sharp line. Replace the
contents of that group. The square wave in it is a placeholder for the
technique, not a subject to reuse.

The horizon can move a little from cover to cover so the subject has something
to rest on. Move the two middle stops of the `sky` gradient, then shift the
atmosphere group (the glow and the streaks) by the same amount using its
`transform`, so they stay on the horizon.

## Choosing what to draw

Read the post first. Pick **one concrete object or moment** from it that a
reader would recognise, and draw that. A post about spoofing pet microchips is a
glass capsule with a coil inside, not "security". A post about Git
branching is lines that split and rejoin. If the post already contains photos or
diagrams, they are the best source for what the subject really looks like.

Simplify hard. A cover is seen at 394 pixels wide in the blog grid, so aim for a
shape that still reads as a silhouette with ten to thirty strokes. Suggest
detail (a row of pins, a few ticks on a dial) rather than drawing all of it.

## Where things can go

The same file is shown three ways, and each one covers part of it:

- **Blog card** (16:9, small): labels sit in the top-right corner.
- **Featured card** (about 1.9:1): the top and bottom are trimmed.
- **Top of the post page** (wide and tall): the title sits bottom-left, and the
  lower half fades to the page background.

In canvas coordinates (1600 by 900), that leaves these areas to avoid:

- **Labels:** x above 1270, y from 65 to 245.
- **Title:** x below 850, y above about 580 for a two-line title. A long title
  wraps to three lines and then reaches up to about y 510.
- **Edges:** the top and bottom 80 or so are trimmed in the featured card.

So keep the subject in the **middle band of the canvas, leaning right**: roughly
x from 500 to 1270 and y from 150 to 540. Check how long the post's title is
first. For a long one, keep the left part of the subject above y 480 or start it
further right.

The post page also lays a dark tint over the whole picture, so the main outline
needs to be at or near full opacity to still read as light there. Dim only the
secondary detail.

## Check it by looking

SVG written blind is usually off: proportions drift, lines miss each other, the
subject lands under the title. Render it and look before calling it done.

```bash
.claude/skills/post-cover/scripts/preview.sh static/images/posts/YYYY/MM/DD/cover.svg <somewhere temporary>/cover-preview.png "The post title"
```

Pass the post's real title, because its length decides how much room the title
takes. Open the PNG it writes. It shows the card, the featured card and the post
page top with the real overlays and the title in place. Ask of it:

- Can you tell what the subject is in the small card, without knowing the post?
- Is the subject clear of the title and of the labels?
- Does it look like light, with a glow, rather than a diagram?
- Is there one obvious brightest point?

Expect to revise two or three times. Fix what you see and render again.

Then build the site once (`hugo`) to confirm the front matter path resolves, and
tell the user which object you chose to draw and where the file is, so they can
ask for a different subject if it is not the one they had in mind.

## Things that go wrong

- **Filters clip the glow.** A blur on a shape near the canvas edge gets cut off
  in a hard line. Keep glowing things away from the edges or widen the filter's
  `x`, `y`, `width` and `height`.
- **Everything is equally bright.** Then nothing glows. Keep the main outline
  bright, let secondary detail sit at 60 to 80 percent opacity, and save the
  near-white for the one brightest point.
- **A streak runs through the title.** The template's streaks reach into the
  bottom-left. Shorten or move any that cross where the title sits.
- **The drawing floats.** Tie it to the scene: rest it on the horizon, let a
  streak pass behind it, or put the warm glow under it.
- **`mix-blend-mode` and the grain.** The grain layer must stay last and keep its
  overlay blend, or the picture turns flat grey.
