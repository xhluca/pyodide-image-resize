import base64
from io import BytesIO
from PIL import Image

def decode_image(data_url):
    _, im_b64 = data_url.split(',', 1)
    im_bytes = base64.b64decode(im_b64)
    im = Image.open(BytesIO(im_bytes))
    return im

def encode_image(im, format="jpeg"):
    buff = BytesIO()
    im.save(buff, format=format)
    img_str = base64.b64encode(buff.getvalue()).decode()
    data_url = f"data:image/{format.lower()};base64," + img_str
    return data_url

def process_image(data_url, ratio, format="jpeg"):
    im = decode_image(data_url)
    w, h = im.size
    new_w = int(w * ratio)
    new_h = int(h * ratio)

    if format.lower() == "jpeg" and im.mode in ("RGBA", "P"):
        im = im.convert("RGB")

    im = im.resize((new_w, new_h))
    return encode_image(im, format)

def main():
    im = Image.new(mode="RGB", size=(400, 200))
    return encode_image(im)

    


main()