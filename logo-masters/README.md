# Logo masters

The four files every other branded image on this site is generated from.

| File | What it is |
|---|---|
| `mark-dark.png` | The figure in white, arc and star in brand orange. For dark surfaces. |
| `mark-light.png` | Identical geometry, figure in near-black. For light surfaces. |
| `lockup-dark.png` | Mark + wordmark + strapline, for dark surfaces. |
| `lockup-light.png` | The same lockup, for light surfaces. |

**Do not hand-edit anything generated from these.** Change a master, then run:

```
python3 make-brand-assets.py
```

That rebuilds the favicons, the app icons, the iOS tile, the nav marks and
every social card. Editing a derived file directly is how a brand ends up with
five slightly different logos and nobody able to say which one is right.

The light and dark variants are the same geometry on purpose — they swap in
place on a theme toggle, so any difference in outline or padding would read as
the logo twitching. Keep them registered.
