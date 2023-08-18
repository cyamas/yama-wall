import json
import convertapi
import re
import os
import svgutils.transform as sg
import sys
from PIL import Image


'''def png_to_svg():
    convertapi.api_secret = 'q0dys7quA82OYFXu'
    f = open('static/holdLayout.json')
    data = json.load(f)
    for hold in data:
        if hold["image"] == 'static/final_holds/73.png':
            image = hold["image"]
            convertapi.convert('svg', {
                'File': image 
                }, from_format = 'png').save_files(image[:-3] + 'svg')
    return'''

#png_to_svg()

def adjust_json_images():
    f = open('static/holdLayout.json')
    data = json.load(f)
    for hold in data:
        fig = sg.fromfile(hold["image"])
        fig.set_size((hold["width"],hold["height"]))
        fig.save(hold["image"])
    
    return

def rotate_hold_image(hold, angle):
    image = Image.open(hold)
    rotated = image.rotate(int(angle) * -1)
    rotated.save(hold, quality=98)
    return

def png_to_svg(image, hold_id, width, height):
    convertapi.api_secret = 'q0dys7quA82OYFXu'
    svg_fp = 'static/final_holds/' + hold_id + '.svg'
    convertapi.convert('svg', {
        'File': image 
        }, from_format = 'png').save_files(svg_fp)
    fig = sg.fromfile(svg_fp)
    fig.set_size((width, height))
    fig.save(svg_fp)        
    return svg_fp

rotate_hold_image('static/rembg_holds/IMG_0222 Background Removed.png', '-40')
png_to_svg('static/rembg_holds/IMG_0222 Background Removed.png', '93', '24', '24')

#adjust_json_images()