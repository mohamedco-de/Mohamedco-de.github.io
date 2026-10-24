#!/usr/bin/env python3
"""يجمع كل الأجزاء في partials/ (مرتبة بالرقم) ويطلع index.html.
التشغيل:  python3 build.py
عدّل أي جزء داخل partials/ وبعدها شغّل السكربت."""
import glob, os
root = os.path.dirname(os.path.abspath(__file__))
parts = sorted(glob.glob(os.path.join(root, "partials", "*.html")))
html = "\n".join(open(p, encoding="utf8").read().rstrip("\n") + "\n" for p in parts)
open(os.path.join(root, "index.html"), "w", encoding="utf8").write(html)
print(f"index.html built from {len(parts)} parts ({len(html):,} bytes)")
