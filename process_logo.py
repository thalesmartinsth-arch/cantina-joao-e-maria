from PIL import Image
import os

source_path = r"C:\Users\thales.martins\.gemini\antigravity\brain\3d8b20e4-4856-455f-b0e6-f74605b0f17f\media__1771179565350.png"
dest_path = r"c:\Users\thales.martins\Documents\Antigravity\Lanchonete\src\assets\logo.png"

try:
    print(f"Opening {source_path}...")
    img = Image.open(source_path).convert("RGBA")
    datas = img.getdata()

    print("Processing pixels...")
    newData = []
    for item in datas:
        # Threshold for white background
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(dest_path, "PNG")
    print(f"Success! Logo saved to {dest_path}")

except Exception as e:
    print(f"Error processing image: {e}")
