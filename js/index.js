var mainData;
var selectedId = 0;
var currentSelectedcanvas;

const ppi = 50;


var canvas = oCanvas.create({
	canvas: "#canvas",
	background: "#ccc",
	fps: 60
});

document.getElementById('download').addEventListener('click', function(e) {
    let canvas1 = document.getElementById('canvas');
    let canvasUrl = canvas1.toDataURL("image/png", 0.5);
    console.log(canvasUrl);
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = "download-this-canvas";
    createEl.click();
    createEl.remove();
});

document.getElementById("toggleSelected").addEventListener("click", function(e) {
    currentSelectedcanvas.trigger("toggle");
});

document.getElementById("fileUpload").addEventListener("change", handleUpload())

function inchToPixels(inch) {
    return inch*ppi;
}

function mmToPixels(mm) {
    return mm * (ppi/25.4);
}

function selectItem(itemCanvas, itemObj) {
    // console.log(itemObj.name);
    document.getElementById("notesText").value = itemObj.notes;
    document.getElementById("ipText").value = itemObj.ip;
    document.getElementById("nameText").value = itemObj.name;
    currentSelectedcanvas = itemCanvas;
}

function handleUpload() {
    let file = document.getElementById("fileUpload").files[0];
    // console.log(file);
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        mainData = JSON.parse(reader.result);
        // console.log(mainData);
        for (let key in mainData) {
            if (mainData[key].type == "rack") {
                createRack(mainData[key]);
            }
        }
        canvas.redraw();
    };
}

function createRack(rackObj) {
    canvas.height = (rackObj.size * inchToPixels(1.75)) + inchToPixels(2);
    
    var rack = canvas.display.rectangle({
        x: 0,
        y: 0,
        width: inchToPixels(20.25),
        height: canvas.height,
        opacity: 1
    });

    rack.bind("toggle", function(e) {
        e.stopPropagation();
        this.opacity = !this.opacity;
        canvas.redraw();
    });

    rack.bind("click tap", function(e) {
        e.stopPropagation();
        selectItem(rack, rackObj);
    });
    
    var topRect = canvas.display.rectangle({
        x: 0,
        y: 0,
        width: inchToPixels(20.25),
        height: inchToPixels(1),
        fill: "#252525"
    });

    var bottomRect = canvas.display.rectangle({
        x:0,
        y:(rack.height-inchToPixels(1)),
        width: inchToPixels(20.25),
        height: inchToPixels(1),
        fill: "#252525"
    });

    var leftRect = canvas.display.rectangle({
        x:0,
        y:inchToPixels(1),
        width: inchToPixels(1.125),
        height: canvas.height-inchToPixels(2),
        fill: "#252525"
    });

    var rightRect = canvas.display.rectangle({
        origin:{x:"right", y:"top"},
        x:inchToPixels(20.25),
        y:inchToPixels(1),
        width: inchToPixels(1.125),
        height: canvas.height-inchToPixels(2),
        fill: "#252525"
    });

    rack.addChild(topRect);
    rack.addChild(bottomRect);
    rack.addChild(leftRect);
    rack.addChild(rightRect);

    //create cage nut holes and text
    for (let index = 0; index < rackObj.size; index++) {
        var holeTL = canvas.display.rectangle({
            origin:{x:"center", y:"center"},
            x:inchToPixels(.8125),
            y:inchToPixels((index*1.75)+1.25),
            width:inchToPixels(.375),
            height:inchToPixels(.375),
            fill:"#ffffff"
        });

        var holeTR = canvas.display.rectangle({
            origin:{x:"center", y:"center"},
            x:(rack.width-inchToPixels(.8125)),
            y:inchToPixels((index*1.75)+1.25),
            width:inchToPixels(.375),
            height:inchToPixels(.375),
            fill:"#ffffff"
        });

        var holeML = canvas.display.rectangle({
            origin:{x:"center", y:"center"},
            x:inchToPixels(.8125),
            y:inchToPixels((index*1.75)+1.25+.625),
            width:inchToPixels(.375),
            height:inchToPixels(.375),
            fill:"#ffffff"
        });

        var holeMR = canvas.display.rectangle({
            origin:{x:"center", y:"center"},
            x:(rack.width-inchToPixels(.8125)),
            y:inchToPixels((index*1.75)+1.25+.625),
            width:inchToPixels(.375),
            height:inchToPixels(.375),
            fill:"#ffffff"
        });

        var holeBL = canvas.display.rectangle({
            origin:{x:"center", y:"center"},
            x:inchToPixels(.8125),
            y:inchToPixels((index*1.75)+1.25+1.25),
            width:inchToPixels(.375),
            height:inchToPixels(.375),
            fill:"#ffffff"
        });

        var holeBR = canvas.display.rectangle({
            origin:{x:"center", y:"center"},
            x:(rack.width-inchToPixels(.8125)),
            y:inchToPixels((index*1.75)+1.25+1.25),
            width:inchToPixels(.375),
            height:inchToPixels(.375),
            fill:"#ffffff"
        });

        rack.addChild(holeTL);
        rack.addChild(holeTR);
        rack.addChild(holeML);
        rack.addChild(holeMR);
        rack.addChild(holeBL);
        rack.addChild(holeBR);

        let font = inchToPixels(.5).toString() + "px sans-serif"
        // let font = "sans-serif"

        var textLeft = canvas.display.text({
            origin: { x: "right", y: "center"},
            x:inchToPixels(.6),
            y:inchToPixels((index*1.75)+1.25+.625),
            font: font,
            // size: inchToPixels(1),
            fill: "#ffff",
            text: (rackObj.size-index).toString()
        });

        var textRight = canvas.display.text({
            origin: { x: "left", y: "center"},
            x:(rack.width-inchToPixels(.6)),
            y:inchToPixels((index*1.75)+1.25+.625),
            font: font,
            // size: inchToPixels(1),
            fill: "#ffff",
            text: (rackObj.size-index).toString()
        });

        rack.addChild(textLeft);
        rack.addChild(textRight);
    }

    //create seperating lines
    for (let index = 0; index < rackObj.size-1; index++) {
        let stroke = inchToPixels(.025).toString()+"px white"
        line1 = canvas.display.line({
            start:{x:inchToPixels(.1),y:inchToPixels((index*1.75) + 2.75)},
            end:{x:inchToPixels(1.025),y:inchToPixels((index*1.75) + 2.75)},
            stroke: stroke
        })
        line2 = canvas.display.line({
            start:{x:(rack.width-inchToPixels(1.025)),y:inchToPixels((index*1.75) + 2.75)},
            end:{x:(rack.width-inchToPixels(.1)),y:inchToPixels((index*1.75) + 2.75)},
            stroke: stroke
        })

        rack.addChild(line1);
        rack.addChild(line2);
    }

    if ("servers" in rackObj) {
        for (const key in rackObj["servers"]) {
            if (rackObj["servers"][key].type == "switch") {
                createSwitch(rackObj["servers"][key], rackObj.size, rack);
            } else if (rackObj["servers"][key].type == "storage") {
                createStorage(rackObj["servers"][key], rackObj.size, rack)
            }
        }
    }
    

    canvas.addChild(rack);
    // console.log(canvas.children);
}

/**
 * takes x and y in pixels and places ethernet port child at that location in parentObj
 * @param {object} parentObj 
 * @param {float} x 
 * @param {float} y 
 */
function createEthernet(parentObj, x, y) {
    largeRect = canvas.display.rectangle({
        origin: {x:"center", y:"center"},
        x: x,
        y: y,
        width: mmToPixels(16),
        height: mmToPixels(13.5),
        fill: "#444444"
    });

    largeInner = canvas.display.rectangle({
        origin: {x: "center", y: "center"},
        width: mmToPixels(11.6),
        height: mmToPixels(9),
        x: mmToPixels(0),
        y: mmToPixels(-1),
        fill: "000"
    });

    smallInner = canvas.display.rectangle({
        origin: {x: "center", y: "top"},
        width: mmToPixels(6.35),
        height: mmToPixels(2),
        x: mmToPixels(0),
        y: mmToPixels(3.5),
        fill: "000"
    });

    largeRect.addChild(largeInner);
    largeRect.addChild(smallInner);

    parentObj.addChild(largeRect);
}

/**
 * creates a lff drive at the given x,y pixel coordinates of the given canvas
 * @param {canvas} parentObj 
 * @param {float} x 
 * @param {float} y 
 */
function createDriveLFF(parentObj, x, y) {
    // console.log("adding drive");
    largeRect = canvas.display.rectangle({
        origin: {x:"center", y:"center"},
        x: x,
        y: y,
        width: inchToPixels(4),
        height: inchToPixels(1),
        fill: "#666666"
    });

    parentObj.addChild(largeRect);
}

function createSwitch(switchObj, rackSize, parentCanvas, x=-1, y=-1) {
    if (x == -1 || y == -1) {   //switch is part of rack
        var bodyRect = canvas.display.rectangle({
            x: inchToPixels(.625),
            y: inchToPixels(1+(1.75*(rackSize-switchObj.position))),
            width: inchToPixels(19),
            height: inchToPixels(1.75*switchObj.size),
            fill: "linear-gradient(315deg, black, grey, black)"
        });

        bodyRect.bind("toggle", function(e) {
            e.stopPropagation();
            this.opacity = !this.opacity;
            canvas.redraw();
        });
    
        bodyRect.bind("click tap", function(e) {
            e.stopPropagation();
            selectItem(bodyRect, switchObj);
            // console.log("selected switch");
        });

        var screwTL = canvas.display.ellipse({
            x: inchToPixels(.3125),
            y: inchToPixels(.25),
            radius: inchToPixels(.1),
            fill: "#555555"
        });

        var screwTR = canvas.display.ellipse({
            x: inchToPixels(18.6875),
            y: inchToPixels(.25),
            radius: inchToPixels(.1),
            fill: "#555555"
        });

        var screwBL = canvas.display.ellipse({
            x: inchToPixels(.3125),
            y: (bodyRect.height - inchToPixels(.25)),
            radius: inchToPixels(.1),
            fill: "#555555"
        });

        var screwBR = canvas.display.ellipse({
            x: inchToPixels(18.6875),
            y: (bodyRect.height - inchToPixels(.25)),
            radius: inchToPixels(.1),
            fill: "#555555"
        });

        bodyRect.addChild(screwTL);
        bodyRect.addChild(screwTR);
        bodyRect.addChild(screwBL);
        bodyRect.addChild(screwBR);


        for (let index = 0; index < switchObj.ports; index++) {
            if ((index % 2) == 0) {
                createEthernet(bodyRect, inchToPixels(18-(.7*(index/2))), inchToPixels(.55));
            } else {
                createEthernet(bodyRect, inchToPixels(18-(.7*Math.trunc((index/2)))), inchToPixels(1.2));
            }
        }

        parentCanvas.addChild(bodyRect);

    }
}

function createStorage(storageObj, rackSize, parentCanvas, x=-1, y=-1) {
    if (x == -1 || y == -1) {   //storage is part of rack
        var bodyRect = canvas.display.rectangle({
            x: inchToPixels(.625),
            y: inchToPixels(1+(1.75*(rackSize-storageObj.position))),
            width: inchToPixels(19),
            height: inchToPixels(1.75*storageObj.size),
            fill: "linear-gradient(315deg, black, grey, black)"
        });

        bodyRect.bind("toggle", function(e) {
            e.stopPropagation();
            this.opacity = !this.opacity;
            canvas.redraw();
        });
    
        bodyRect.bind("click tap", function(e) {
            e.stopPropagation();
            selectItem(bodyRect, storageObj);
            // console.log("selected switch");
        });

        var screwTL = canvas.display.ellipse({
            x: inchToPixels(.3125),
            y: inchToPixels(.25),
            radius: inchToPixels(.1),
            fill: "#555555"
        });

        var screwTR = canvas.display.ellipse({
            x: inchToPixels(18.6875),
            y: inchToPixels(.25),
            radius: inchToPixels(.1),
            fill: "#555555"
        });

        var screwBL = canvas.display.ellipse({
            x: inchToPixels(.3125),
            y: (bodyRect.height - inchToPixels(.25)),
            radius: inchToPixels(.1),
            fill: "#555555"
        });

        var screwBR = canvas.display.ellipse({
            x: inchToPixels(18.6875),
            y: (bodyRect.height - inchToPixels(.25)),
            radius: inchToPixels(.1),
            fill: "#555555"
        });

        bodyRect.addChild(screwTL);
        bodyRect.addChild(screwTR);
        bodyRect.addChild(screwBL);
        bodyRect.addChild(screwBR);

        if (storageObj.driveSize == 3.5) {
            for (let index = 0; index < storageObj.drives; index++) {
                y = .625 + (Math.trunc(index/4)*1.125);
                let temp = index % 4;
                switch (temp) {
                    case 0:
                        x = 16.4;
                        break;
                    case 1:
                        x = 11.925;
                        break;
                    case 2:
                        x = 7.45;
                        break;
                    case 3:
                        x = 2.975;
                        break;
                }
                createDriveLFF(bodyRect, inchToPixels(x), inchToPixels(y));
            }
        }

        parentCanvas.addChild(bodyRect);

    }
}