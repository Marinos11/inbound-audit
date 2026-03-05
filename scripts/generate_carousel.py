#!/usr/bin/env python3
"""
Instagram Carousel Generator – Twitter/X Card Style
Format: 4:5 (1080 x 1350px)
"""

import json
import sys
import textwrap
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow nicht installiert. Bitte ausführen: pip3 install Pillow")
    sys.exit(1)

# ── Konstanten ──────────────────────────────────────────────────────────────

CANVAS_W = 1080
CANVAS_H = 1350

THEMES = {
    "dark": {
        "bg":                 (15, 15, 20),
        "card_bg":            (22, 22, 30),
        "text":               (236, 236, 241),
        "subtext":            (120, 120, 135),
        "handle":             (100, 116, 139),
        "divider":            (45, 45, 58),
        "verified":           (29, 155, 240),
        "placeholder_bg":     (32, 32, 42),
        "placeholder_border": (60, 60, 78),
        "placeholder_text":   (90, 90, 110),
        "dot":                (60, 60, 75),
        "dot_active":         (29, 155, 240),
    },
    "light": {
        "bg":                 (255, 255, 255),
        "card_bg":            (255, 255, 255),
        "text":               (13, 17, 23),
        "subtext":            (110, 118, 125),
        "handle":             (110, 118, 125),
        "divider":            (207, 217, 222),
        "verified":           (29, 155, 240),
        "placeholder_bg":     (239, 243, 244),
        "placeholder_border": (196, 207, 214),
        "placeholder_text":   (130, 140, 150),
        "dot":                (196, 207, 214),
        "dot_active":         (15, 20, 25),
    }
}

PAD_X       = 64    # Seiten-Padding
PAD_TOP     = 56    # Oben
AVATAR_SIZE = 52    # Avatar-Durchmesser
GAP         = 20    # Abstand zwischen Elementen
FONT_DIR    = Path("/System/Library/Fonts")


# ── Fonts ─────────────────────────────────────────────────────────────────────

def load_font(size: int, bold: bool = False, italic: bool = False) -> ImageFont.FreeTypeFont:
    if bold:
        candidates = [
            FONT_DIR / "Supplemental/HelveticaNeueBold.ttf",
            Path("/Library/Fonts/Arial Bold.ttf"),
            Path("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"),
        ]
    else:
        candidates = [
            FONT_DIR / "Supplemental/HelveticaNeue.ttf",
            Path("/Library/Fonts/Arial.ttf"),
            Path("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"),
        ]
    for p in candidates:
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size)
            except Exception:
                continue
    return ImageFont.load_default()


# ── Avatar ────────────────────────────────────────────────────────────────────

def make_circle_avatar(size: int, color: tuple, initial: str = "D") -> Image.Image:
    img  = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([0, 0, size - 1, size - 1], fill=color)
    font = load_font(size // 2, bold=True)
    draw.text((size // 2, size // 2), initial, font=font,
              fill=(255, 255, 255), anchor="mm")
    return img


def load_avatar(path, size: int, colors: dict) -> Image.Image:
    if path and Path(path).exists():
        try:
            img  = Image.open(path).convert("RGBA")
            img  = img.resize((size, size), Image.LANCZOS)
            mask = Image.new("L", (size, size), 0)
            ImageDraw.Draw(mask).ellipse([0, 0, size - 1, size - 1], fill=255)
            img.putalpha(mask)
            return img
        except Exception:
            pass
    return make_circle_avatar(size, colors["verified"])


# ── Verified Badge ────────────────────────────────────────────────────────────

def draw_badge(draw: ImageDraw.Draw, x: int, y: int, size: int, color: tuple):
    draw.ellipse([x, y, x + size, y + size], fill=color)
    pad = size // 5
    pts = [
        (x + pad,           y + size // 2),
        (x + size // 2 - 1, y + size - pad - 2),
        (x + size - pad,    y + pad + 1),
    ]
    draw.line(pts, fill=(255, 255, 255), width=max(2, size // 8))


# ── Text-Wrapper ──────────────────────────────────────────────────────────────

def wrap_text(text: str, font, draw: ImageDraw.Draw, max_w: int) -> list:
    """Wraps text respecting existing newlines."""
    result = []
    for paragraph in text.split("\n"):
        if paragraph.strip() == "":
            result.append("")
            continue
        words   = paragraph.split()
        current = ""
        for word in words:
            test = (current + " " + word).strip()
            if draw.textbbox((0, 0), test, font=font)[2] > max_w and current:
                result.append(current)
                current = word
            else:
                current = test
        if current:
            result.append(current)
    return result


def text_block_height(lines: list, font, line_gap: int = 10) -> int:
    if not lines:
        return 0
    sample_h = font.getbbox("Ag")[3]
    return len(lines) * (sample_h + line_gap) - line_gap


# ── Placeholder ───────────────────────────────────────────────────────────────

def draw_placeholder(draw: ImageDraw.Draw, x1: int, y1: int,
                     x2: int, y2: int, colors: dict, desc: str = ""):
    draw.rounded_rectangle([x1, y1, x2, y2], radius=20,
                            fill=colors["placeholder_bg"])
    # dashed border
    bc = colors["placeholder_border"]
    dash, gap = 16, 8
    step = dash + gap
    for x in range(x1 + 20, x2 - 20, step):
        e = min(x + dash, x2 - 20)
        draw.line([(x, y1 + 2), (e, y1 + 2)], fill=bc, width=2)
        draw.line([(x, y2 - 2), (e, y2 - 2)], fill=bc, width=2)
    for y in range(y1 + 20, y2 - 20, step):
        e = min(y + dash, y2 - 20)
        draw.line([(x1 + 2, y), (x1 + 2, e)], fill=bc, width=2)
        draw.line([(x2 - 2, y), (x2 - 2, e)], fill=bc, width=2)
    cx = (x1 + x2) // 2
    cy = (y1 + y2) // 2
    draw.text((cx, cy - 24), "📷", font=load_font(32), fill=colors["placeholder_text"], anchor="mm")
    draw.text((cx, cy + 16), "Bild hier einfügen", font=load_font(20),
              fill=colors["placeholder_text"], anchor="mm")
    if desc:
        for i, ln in enumerate(textwrap.wrap(desc, 48)[:2]):
            draw.text((cx, cy + 44 + i * 22), ln, font=load_font(16),
                      fill=colors["placeholder_text"], anchor="mm")


# ── Slide-Dots ────────────────────────────────────────────────────────────────

def draw_dots(draw: ImageDraw.Draw, current: int, total: int, colors: dict):
    if total <= 1:
        return
    dot_r    = 5
    dot_gap  = 14
    visible  = min(total, 7)
    total_w  = visible * (dot_r * 2) + (visible - 1) * dot_gap
    start_x  = (CANVAS_W - total_w) // 2
    y        = CANVAS_H - 44
    for i in range(visible):
        idx   = i
        color = colors["dot_active"] if idx == (current - 1) % visible else colors["dot"]
        cx    = start_x + i * (dot_r * 2 + dot_gap) + dot_r
        draw.ellipse([cx - dot_r, y - dot_r, cx + dot_r, y + dot_r], fill=color)


# ── Header ────────────────────────────────────────────────────────────────────

def draw_header(img: Image.Image, draw: ImageDraw.Draw,
                profile: dict, colors: dict) -> int:
    """Draws avatar + name + handle. Returns y position after header."""
    avatar = load_avatar(profile.get("headshot_path"), AVATAR_SIZE, colors)
    img.paste(avatar, (PAD_X, PAD_TOP), avatar)

    name_font   = load_font(28, bold=True)
    handle_font = load_font(22)

    tx     = PAD_X + AVATAR_SIZE + 16
    name   = profile.get("name", "Name")
    handle = profile.get("handle", "@handle")

    # vertically center name+handle next to avatar
    name_h   = name_font.getbbox("Ag")[3]
    handle_h = handle_font.getbbox("Ag")[3]
    total_th = name_h + 6 + handle_h
    name_y   = PAD_TOP + (AVATAR_SIZE - total_th) // 2

    draw.text((tx, name_y), name, font=name_font, fill=colors["text"])

    if profile.get("verified"):
        nb = draw.textbbox((tx, name_y), name, font=name_font)
        bx = nb[2] + 7
        by = name_y + (name_h - 20) // 2
        draw_badge(draw, bx, by, 20, colors["verified"])

    handle_y = name_y + name_h + 6
    draw.text((tx, handle_y), handle, font=handle_font, fill=colors["handle"])

    header_bottom = PAD_TOP + AVATAR_SIZE + GAP
    return header_bottom


# ── Render Tweet Block ────────────────────────────────────────────────────────

def draw_tweet_block(draw: ImageDraw.Draw, tweets: list, colors: dict,
                     y_start: int, area_h: int, content_w: int,
                     font_size: int = 38, line_gap: int = 14,
                     align: str = "left") -> int:
    """
    Draws tweet text left-aligned (like real tweets).
    Returns total height used.
    """
    font = load_font(font_size)
    all_lines = []
    for i, tweet in enumerate(tweets):
        lines = wrap_text(tweet, font, draw, content_w)
        all_lines.extend(lines)
        if i < len(tweets) - 1:
            all_lines.append("")  # blank line between tweets

    sample_h = font.getbbox("Ag")[3]
    lh       = sample_h + line_gap
    total_h  = len(all_lines) * lh

    # vertically center block in area
    y = y_start + max(0, (area_h - total_h) // 2)

    for line in all_lines:
        if align == "left":
            draw.text((PAD_X, y), line, font=font, fill=colors["text"])
        else:
            draw.text((CANVAS_W // 2, y), line, font=font,
                      fill=colors["text"], anchor="mt")
        y += lh

    return total_h


# ── Main Render ───────────────────────────────────────────────────────────────

def render_slide(slide: dict, profile: dict, colors: dict,
                 slide_num: int, total: int, out_path: Path):
    img  = Image.new("RGB", (CANVAS_W, CANVAS_H), colors["bg"])
    draw = ImageDraw.Draw(img)

    content_top = draw_header(img, draw, profile, colors)

    tweets      = slide.get("tweets", [])
    has_img     = slide.get("image_placeholder", False)
    img_desc    = slide.get("image_description", "")
    content_w   = CANVAS_W - PAD_X * 2

    dots_h      = 56  # space reserved at bottom for dots
    content_bot = CANVAS_H - dots_h
    content_h   = content_bot - content_top

    if has_img:
        # Image takes up ~42% of height, text gets the rest
        img_h    = int(content_h * 0.42)
        text_h   = content_h - img_h - GAP * 2

        # Text first (top)
        draw_tweet_block(draw, tweets, colors,
                         y_start=content_top, area_h=text_h,
                         content_w=content_w, font_size=36, line_gap=14)

        # Placeholder below text
        ph_y1 = content_top + text_h + GAP
        ph_y2 = ph_y1 + img_h
        draw_placeholder(draw, PAD_X, ph_y1, CANVAS_W - PAD_X, ph_y2,
                         colors, img_desc)

    elif len(tweets) == 2:
        # Two tweets with a subtle divider line
        half = (content_h - 32) // 2
        draw_tweet_block(draw, [tweets[0]], colors,
                         y_start=content_top, area_h=half,
                         content_w=content_w, font_size=34)
        div_y = content_top + half + 16
        draw.line([(PAD_X, div_y), (CANVAS_W - PAD_X, div_y)],
                  fill=colors["divider"], width=1)
        draw_tweet_block(draw, [tweets[1]], colors,
                         y_start=div_y + 16, area_h=half,
                         content_w=content_w, font_size=34)
    else:
        draw_tweet_block(draw, tweets, colors,
                         y_start=content_top, area_h=content_h,
                         content_w=content_w, font_size=40)

    draw_dots(draw, slide_num, total, colors)

    img.save(str(out_path), "PNG", optimize=True)
    print(f"  ✓ Slide {slide_num:02d}: {out_path.name}")


# ── Entry Point ───────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Verwendung: python3 generate_carousel.py <config.json>")
        sys.exit(1)

    config_path = Path(sys.argv[1])
    if not config_path.exists():
        print(f"Fehler: {config_path} nicht gefunden.")
        sys.exit(1)

    with open(config_path, encoding="utf-8") as f:
        config = json.load(f)

    profile    = config.get("profile", {})
    theme      = profile.get("theme", "dark")
    colors     = THEMES.get(theme, THEMES["dark"])
    slides     = config.get("slides", [])
    output_dir = config_path.parent
    total      = len(slides)

    print(f"\n🎨 Carousel Generator")
    print(f"   Theme: {theme} | Slides: {total} | Format: 1080×1350 (4:5)\n")

    for i, slide in enumerate(slides, start=1):
        out_file = output_dir / f"slide_{i:02d}.png"
        render_slide(slide, profile, colors, i, total, out_file)

    print(f"\n✅ {total} Slides → {output_dir}")


if __name__ == "__main__":
    main()
