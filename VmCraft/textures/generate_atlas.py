#!/usr/bin/env python3
# pip install Pillow

import PIL.Image
import os
import sys
import re

atlas_source = "atlas"
atlas_output = "atlas.png"
atlas_size_x = 16
atlas_size_y = 16
image_res_x = 32
image_res_y = 32
atlas_size_res_x = atlas_size_x * image_res_x
atlas_size_res_y = atlas_size_y * image_res_y

color_mode = "RGBA"

atlas = PIL.Image.new(color_mode, (atlas_size_res_x, atlas_size_res_y), color=(0, 0, 0, 0))

def add_image_to_atlas(atlas_slot_x, atlas_slot_y, path):
    offset_x = atlas_slot_x * image_res_x
    offset_y = atlas_slot_y * image_res_y

    with PIL.Image.open(path) as image:
        image = image.convert(color_mode)
        image = image.resize((image_res_x, image_res_y), PIL.Image.LANCZOS)
        atlas.paste(image, (offset_x, offset_y))

current_x = 0
current_y = 0

def fail(err):
    print(err, file=sys.stderr)
    exit(1)

def iterate_atlas():
    global current_x
    global current_y

    current_x += 1
    if current_x >= atlas_size_x:
        current_x = 0
        current_y += 1
        if current_y >= atlas_size_y:
            return True

    return False

def sort_number(name):
    arr = re.split(r"[_.]", name)

    try:
        return int(arr[0])
    except ValueError:
        fail(f"the texture \"{name}\" is not numbered")

not_first = False
for name in sorted(os.listdir(atlas_source), key=sort_number):
    path = os.path.join(atlas_source, name)
    if os.path.isfile(path):
        if not_first:
            if iterate_atlas():
                fail(f"atlas overflows by \"{name}\". max images count: {atlas_size_x * atlas_size_y}")
        print(f"adding image ({current_x}, {current_y}): {path}")
        add_image_to_atlas(current_x, current_y, path)
        not_first = True

print(f"saving atlas to \"{atlas_output}\"...")
atlas.save(atlas_output)
atlas.close()
print("done!")
