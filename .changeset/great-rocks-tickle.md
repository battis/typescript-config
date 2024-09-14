---
'@battis/webpack': patch
---

Fixed types

Rather than exporting a non-module and/or confusing TS, types should now be both cleanly broken up into separate files for understandability and also importable into source. I hope.
