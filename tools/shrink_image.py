"""
shrink_image.py - make a photo small enough for the website (target: under 300 KB).

HOW TO USE (in a terminal opened in the portfolio folder):

    python tools/shrink_image.py  "C:/path/to/big-photo.jpg"  assets/img/my-new-project.jpg

    - 1st argument: the original photo (any size; PNG, JPG, HEIC-exported JPG ...)
    - 2nd argument: where to save the small copy (use lowercase-with-dashes names, end in .jpg)
    - optional 3rd argument: max width in pixels (default 1400). Use 600 for a profile photo.

The original file is never changed. Needs Python + Pillow (install once with: pip install pillow).
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

TARGET_KB = 300  # keep every image under this size so pages load fast on mobile data


def shrink(src, dst, max_width=1400):
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)  # respect the phone's rotation info
    img = img.convert("RGB")            # JPG has no transparency; flatten it
    if img.width > max_width:
        new_height = round(img.height * max_width / img.width)
        img = img.resize((max_width, new_height), Image.LANCZOS)

    Path(dst).parent.mkdir(parents=True, exist_ok=True)
    # Try decreasing quality until the file is small enough.
    for quality in (85, 80, 75, 70, 65, 60, 50):
        img.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
        size_kb = Path(dst).stat().st_size / 1024
        if size_kb <= TARGET_KB:
            break
    print(f"Saved {dst}  ({img.width}x{img.height}, {size_kb:.0f} KB, quality {quality})")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    width = int(sys.argv[3]) if len(sys.argv) > 3 else 1400
    shrink(sys.argv[1], sys.argv[2], width)
