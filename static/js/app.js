
const board = document.querySelector('#board');
const rows = 24;
const cols = 24;
const boltMatrix = [];

//Creates wall UI
//Also creates boltMatrix array of arrays to access specific bolt positions on the wall UI
function loadWall(id) {
    const wall = document.createElement('div');
    wall.classList.add('wall');
    wall.id = id;
    board.append(wall);
    
    for (let row = 0; row < rows; row++) {
        const rowList = [];
        for (let col = 0; col < cols; col++) {
            const bolt = document.createElement('div');
            bolt.classList.add('bolt');
            bolt.id = `${row}-${col}`;
            const boltHole = document.createElement('div');
            boltHole.classList.add('bolt-hole');
            boltHole.id = 'bh';
            bolt.append(boltHole);
            wall.append(bolt);
            rowList.push(bolt);
        }
        boltMatrix.push(rowList);
    }
}

function loadHolds() {
    fetch("static/holdLayout.json")
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        var numHolds = data.length;
        for(i=0; i < numHolds; i++) {
            const hold = document.createElement('img');
            hold.id = i + 1;
            hold.setAttribute("src", data[i].image);
            hold.style.width = (data[i].width).toString() + 'px';
            hold.style.height = 'auto';
            boltMatrix[data[i].row][data[i].col].appendChild(hold);
        }
        })
}
loadWall('yama');
loadHolds();

//Adds a hold image to a specified bolt position on the wall UI 
function addHold(hold, matrix, row, col) {
    var position = matrix[row][col];
    var holdImage = document.createElement('img');
    holdImage.setAttribute("src", hold.image);
    holdImage.id = `${hold.id}`;

    position.appendChild(holdImage);

    const rotateHold = document.getElementById(`${hold.id}`);
    rotateHold.style.transform = `rotate(${hold.angle}deg)`;
    
}

function toggleForm(form) {
    if (form.style.getPropertyValue('display') === "inline-block") {
        form.style.display = "none";
    } else {
        form.style.display = "inline-block";
    }
}



//Allows drag and drop of hold image into create hold form
const dropZone = document.querySelector(".drop-zone");

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
})

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const holdFile = e.dataTransfer.files;
    if (holdFile.length === 1 && (holdFile[0].type === 'image/jpeg' || holdFile[0].type === 'image/png' || holdFile[0].type === 'image/svg')) {
        const holdPic = document.createElement('img');
        const holdFilePath = "static/rembg_holds/" + holdFile[0].name
        holdPic.setAttribute("src", holdFilePath);
        document.getElementById("hold-image-url").value = holdFilePath;
        holdPic.id = 'hold-preview';
        holdPic.style.width = '24px';
        holdPic.style.height = 'auto';
        holdPic.style.zIndex = '20';
        dropZone.appendChild(holdPic);
    }
})

//This function allows the user to customize the size of the hold inside the Create New Hold Form
function adjustSize(twoPix) {
    const holdPreview = document.getElementById("hold-preview");
    if (holdPreview !== null) {
        var newWidth = (holdPreview.clientWidth + twoPix).toString();
        var newHeight = (holdPreview.clientHeight + twoPix).toString();
        document.getElementById("image-width").value = newWidth;
        document.getElementById("image-height").value = newHeight;
    }
    
    holdPreview.style.width = newWidth+ 'px';
    holdPreview.style.height = newHeight + 'px';
}
//This function allows the user to adjust the angle of the hold to be set on the wall
function changeAngle(hold,angle) {
    hold.style.transform = `rotate(${angle}deg)`
}
//This function adds the hold from the Create New Hold form to a specific bolt position on the wall
function boltHold() {
    const wall = document.getElementById("board");
    wall.style.zIndex = "10"; //brings wall to front of page for setting mode
    wall.style.cursor = "url('/static/drill.png'), auto"; //makes cursor a drill image to indicate to user they are in setting mode
    const bolts = document.querySelectorAll(".bolt");
    
    //This for loop adds a click event listener to each bolt and adds the hold image to the wall
    bolts.forEach((bolt) => {
        bolt.addEventListener("click", () => {
            const hold = document.getElementById("hold-preview");
            if (bolt.childElementCount === 1) {
                bolt.appendChild(hold);
                holdCopy = hold.cloneNode()
                holdCopy.id = "hold-copy";

            //This block sets the cursor back to normal from the drill cursor, brings the form back to the front,
            //and updates the column and row values on the form 
            } else if (bolt.contains(hold)) {
                wall.style.cursor = "auto";
                wall.style.zIndex = "0";
                const holdPos = bolt.id;
                holdRow = holdPos.match(/.+?(?=-)/)
                holdCol = holdPos.match(/-(.*)/)[1];
                const formRow = document.getElementById("rowRead");
                const formCol = document.getElementById("colRead");
                formRow.value = holdRow;
                formCol.value = holdCol;
                dropZone.appendChild(hold);
                bolt.appendChild(holdCopy);
                

            }
                  
        })
    })
}

function selectHoldToEdit() {
    document.body.style.backgroundColor = '#EAEAEA';
    document.body.style.cursor = "url('/static/drill.png'), auto";
    const bolts = document.querySelectorAll(".bolt");
    const selectedBolt = [];
    const prevImage = []
    bolts.forEach((bolt) => {
        if (bolt.getElementsByTagName('img').length > 0) {
            bolt.addEventListener("mouseenter", function() {
                bolt.style.outline = '2px solid white';
            })
            bolt.addEventListener("mouseleave", function() {
                bolt.style.outline = '0px';
            })

            bolt.addEventListener("click", function() {
                if (bolt.style.backgroundColor === 'rgb(157, 252, 23)') {
                    console.log(bolt.getElementsByTagName('img')[0].id);
                }
                if (selectedBolt.length > 0) {
                    selectedBolt[0].style.backgroundColor = "";
                    selectedBolt.pop();
                }
                highlightHold(bolt);
                selectedBolt.push(bolt);
                editHoldButton = document.getElementById('edit-hold-button');
                editHoldButton.style.display = 'inline-block';
            });
        }
    })
}
function highlightHold(bolt) {
    bolt.style.backgroundColor = '#9dfc17';
}


