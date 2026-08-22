# Logo masters

The four files every other branded image on this site is generated from.

| File | What it is |
|---|---|
| `mark-dark.png` | The globe in white, the rising arrow in brand orange. For dark surfaces. |
| `mark-light.png` | Identical geometry, globe in near-black. For light surfaces. |
| `lockup-dark.png` | Mark + wordmark + `Work Beyond Borders.`, for dark surfaces. |
| `lockup-light.png` | The same lockup, for light surfaces. |

**Do not hand-edit anything generated from these.** Change a master, then run:

```
python3 make-brand-assets.py
```

That rebuilds the favicons, the app icons, the iOS tile, the nav marks, the two
PWA install screenshots and every social card. Editing a derived file directly
is how a brand ends up with five slightly different logos and nobody able to
say which one is right.

The light and dark variants are the same geometry on purpose — they swap in
place on a theme toggle, so any difference in outline or padding would read as
the logo twitching. Keep them registered.

## The oceans are holes, not white paint

This mark is negative space. The globe's oceans, the gap between the ring and
the arrow, and the counters in the wordmark are all fully transparent — what
you read as "ocean" is the page showing through. That is why the light and dark
variants are tonal inverses of each other rather than two colourways of one
solid shape, and why neither variant can be placed on a mid-tone or orange
surface: on orange the arrow vanishes into the background. The mark goes on the
near-black page, on paper, or on the white app tile. Nowhere else.
