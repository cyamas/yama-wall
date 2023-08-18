import sqlite3
from flask import Flask, render_template, request, session, g, jsonify
from image_processor import rotate_hold_image, save_to_json, png_to_svg

app = Flask(__name__)
app.secret_key = "sboofutlsdoefrts69"

@app.route('/')
def home():
    new_hold_id = add_new_hold_id()
    return render_template('/index.html', new_hold_id=new_hold_id)
    

@app.route("/",methods=['POST'])
def hold_data_to_db():
    hold_db = get_db()
    cursor = hold_db.cursor()

    if request.method == "POST":
        hold_form_dict = request.form.to_dict()
        if hold_form_dict['addToWall'] == 'on':
            hold_form_dict['addToWall'] = 1
        else:
            hold_form_dict['addToWall'] = 0
        
        #if size was not adjusted by user, set default pixelation to 24x24 pixels
        if hold_form_dict['imageWidth'] == '':
            hold_form_dict['imageWidth'] = '24'
        if hold_form_dict['imageHeight'] == '':
            hold_form_dict['imageHeight'] = '24'
        
        hold = hold_form_dict["imageURL"]
        rotate_hold_image(hold, hold_form_dict['angle']) #rotates png image to user-specified angle and saves it in place
        #converts hold image png to svg and saves it to final_holds directory
        new_fp = png_to_svg(hold, hold_form_dict['holdId'], hold_form_dict['imageWidth'], hold_form_dict['imageHeight'])
        #saves information to holdLayout.json which will be used to render each hold at it's specified position on the wall
        save_to_json(hold_form_dict['row'], hold_form_dict['column'], new_fp, hold_form_dict['imageWidth'], hold_form_dict['imageHeight'])
        cursor.execute('''
            INSERT INTO holds
            (manufacturer, product_name, hold_type, color, width, depth, incut, texture, angle,
            image_url, is_bolted, row_pos,col_pos)
            VALUES
            (:manufacturer, :productName, :holdType, :color, :width, :depth, :incut, :texture,
            :angle, :imageURL, :addToWall, :row, :column)''', hold_form_dict)
        hold_db.commit()
        cursor.close()
    hold_db.close()
    return render_template('/index.html', new_hold_id=int(hold_form_dict['holdId']) + 1)

@app.route('/edithold')
def render_edit_hold():
    return render_template('//edithold.html')


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('yama.db')
        return db
    
def add_new_hold_id():
    hold_db = get_db()
    cursor = hold_db.cursor()
    new_hold_id = 1 + len(cursor.execute('SELECT * FROM holds').fetchall())
    cursor.close()
    hold_db.close()
    return new_hold_id
    


if __name__ == '__main__':
    app.run(debug=True)