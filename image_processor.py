from rembg import remove
from PIL import Image
import os
import json
import convertapi
import svgutils.transform as sg

#Uses convertapi to convert png files to svg files and resizes them to user-specified pixelation
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

# It also rotates the hold to the user-specified angle and saves it as a .png file
def rotate_hold_image(hold, angle):
    image = Image.open(hold)
    rotated = image.rotate(int(angle) * -1)
    rotated.save(hold, quality=98)
    return

def save_to_json(row, col, image, width, height):

    data = {
        'row': row,
        'col': col,
        'image': image,
        'width': width,
        'height': height
    }
    with open('static/holdLayout.json') as fp:
        wall_set = json.load(fp)
    wall_set.append(data)

    with open('static/holdLayout.json', 'w') as json_file:
        json.dump(wall_set, json_file, indent=4)

    return 


def remove_hold_bg(image):
    input_path = 'static/raw_holds/' + image
    output_path = input_path.replace('raw_holds', 'rembg_holds')

    with open(input_path, 'rb') as i:
        with open(output_path, 'wb') as o:
            input = i.read()
            output = remove(input)
            o.write(output)
    
    return

'''for image in os.listdir('static/rembg_holds'):
    if image != '.DS_Store':
        resize_image('static/rembg_holds/' + image)'''
        