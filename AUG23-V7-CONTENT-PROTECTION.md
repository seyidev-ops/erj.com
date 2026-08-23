# ERJ V7 · Content Protection Layer · 23 August 2026

Implemented for the current static GitHub Pages architecture:

- Public ownership metadata and copyright notices.
- Terms of Use and Privacy Policy pages.
- Participant Terms/Privacy links now resolve correctly.
- Private pages strengthened with noindex, nofollow, noarchive, nosnippet, noimageindex.
- Private pages removed from service-worker precache and bypass service-worker caching.
- Participant dashboard and CV builder use a participant-specific visible watermark/licence identifier.
- Protected external resource links show a one-time personal-use licence acknowledgement.
- Participant materials carry an explicit non-transferable licence notice.
- Misleading cross-device persistence language corrected: current participant state remains browser-local until a server-side account system is introduced.
- Existing static blog articles now carry ownership metadata and rights notices; generators were updated for future builds.
- Obsolete members-only Private Job Board copy in the scam article/source was replaced with the current free job channel + Done-For-You Application structure.

Important limit: browser-delivered HTML/JS and Google Docs that are shared publicly cannot be made cryptographically uncopyable. The next real security step is server-side authentication plus restricted/signed resource delivery. Google Drive/Docs permissions should also be reviewed so paid workbooks are not accessible to anyone who merely receives a copied link.
