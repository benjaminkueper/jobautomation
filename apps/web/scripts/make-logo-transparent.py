from PIL import Image

src = r"D:\jobautomation\app\apps\web\public\logo.png"
out = r"D:\jobautomation\app\apps\web\public\logo-transparent.png"

im = Image.open(src).convert("RGBA")
pixels = im.load()
w, h = im.size
removed = 0

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r < 28 and g < 28 and b < 28:
            pixels[x, y] = (r, g, b, 0)
            removed += 1
        elif r < 45 and g < 45 and b < 45:
            bright = max(r, g, b)
            alpha = min(255, int((bright / 45) * 255))
            pixels[x, y] = (r, g, b, alpha)

im.save(out, "PNG")
print(f"saved {out} size={w}x{h} cleared~={removed}")
