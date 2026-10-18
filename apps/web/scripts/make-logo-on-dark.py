from PIL import Image

src = r"D:\jobautomation\app\apps\web\public\logo.png"
out = r"D:\jobautomation\app\apps\web\public\logo-on-dark.png"

im = Image.open(src).convert("RGBA")
pixels = im.load()
w, h = im.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # black background -> transparent
        if r < 28 and g < 28 and b < 28:
            pixels[x, y] = (0, 0, 0, 0)
            continue
        # brand dark-green wordmark -> white for dark nav/footer
        if g > 40 and g < 95 and r < 40 and b < 70 and g > r + 20:
            pixels[x, y] = (255, 255, 255, a if a else 255)
            continue
        # gray tagline -> soft white
        if abs(r - g) < 12 and abs(g - b) < 12 and 40 < r < 120:
            pixels[x, y] = (220, 220, 220, a if a else 255)

im.save(out, "PNG")
print(f"saved {out} size={w}x{h}")
