var mainData;
var currentSelectedcanvas;
var currentSelectedItem;
var network = {};
var currentNets = [];

const highlightColor = "#f00"
const dragOptions = {changeZindex: true, bubble: false};

const ppi = 50;

window.addEventListener("load", function(e) {
    // console.log("loaded");
    const event1 = new Event('input');
    document.getElementById("zoomRange").dispatchEvent(event1);
});

//iif there is still a file from before page was (presumably) reloaded then start with that
if (document.getElementById("fileUpload").files.length > 0) {
    // console.log(document.getElementById("fileUpload").files.length);
    handleUpload();
}

var canvas = oCanvas.create({
	canvas: "#canvas",
	background: "#fff",
	fps: 60
});

var backRect = canvas.display.rectangle({
    origin: {x:"center",y:"center"},
    x: 0,
    y: 0,
    width: 20000,
    height: 20000,
    fill: "#ccc"
});
canvas.addChild(backRect);
backRect.dragAndDrop();

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

document.getElementById("fileUpload").addEventListener("change", handleUpload);

document.getElementById("applyChanges").addEventListener("click", function() {
    currentSelectedItem.ip = document.getElementById("ipText").value;
    currentSelectedItem.name = document.getElementById("nameText").value;
    currentSelectedItem.notes = document.getElementById("notesText").value;
    // console.log(mainData);
});

document.getElementById("zoomRange").addEventListener("input", function(e) {
    // console.log(e);
    console.log(document.getElementById("zoomRange").valueAsNumber);
    canvas.width = document.getElementById("zoomRange").valueAsNumber;
    let tempPPI = canvas.width/document.getElementById("canvas").offsetWidth;
    // console.log(tempPPI);
    canvas.height = tempPPI * document.getElementById("canvas").offsetHeight;
});

function inchToPixels(inch) {
    return inch*ppi;
}

function mmToPixels(mm) {
    return mm * (ppi/25.4);
}

function registerNetDevice(deviceCanvas, netNames){

    for (const net in netNames) {
        if (netNames[net] in network) {   //net already exists
            network[netNames[net]].push(deviceCanvas);
        } else {    //net does not exist
            network[netNames[net]] = [deviceCanvas];
        }
    }
    deviceCanvas.bind("click tap", function(e) {
        e.stopPropagation();
        // console.log(netNames);
        lowlightNetwork();

        //checks if netNames of device is equal to currentNets
        let result =
            netNames.length === currentNets.length &&
            netNames.every(function (element) {
                return currentNets.includes(element);
            });
        
        if (result) {   //netNames and currentNets are equal
            currentNets = [];
            console.log("arrays equal");
        } else {    //netNames and currentNets are different
            currentNets = netNames;
            for (const net in netNames) {
                // console.log(netNames[net]);
                highlightNet(netNames[net]);
            }
        }
        canvas.redraw();
    });
    // console.log(network);
}

function lowlightNetwork() {
    for (const net in network) {
        // console.log(name);
        for (let index = 0; index < network[net].length; index++) {
            // console.log(index);
            network[net][index].trigger("lowlight");
            // console.log(network[name][index]);
        }
    }
}

function highlightNet(netName) {
    console.log(netName);
    currentNet = netName;
    for (let index = 0; index < network[netName].length; index++) {
        network[netName][index].trigger("highlight");
    }
}

function selectItem(itemCanvas, itemObj) {
    // console.log(itemObj.name);
    document.getElementById("notesText").value = itemObj.notes;
    document.getElementById("ipText").value = itemObj.ip;
    document.getElementById("nameText").value = itemObj.name;
    currentSelectedcanvas = itemCanvas;
    currentSelectedItem = itemObj;
}

function handleUpload() {
    // console.log("handling upload");
    let file = document.getElementById("fileUpload").files[0];
    // console.log(file);
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        clearChildren(backRect);
        mainData = JSON.parse(reader.result);
        // console.log(mainData);
        for (let key in mainData) {
            if (mainData[key].type == "rack") {
                createRack(mainData[key]);
            } else if (mainData[key].type == "storage") {
                createStorage(mainData[key], backRect, true, 0, 0);
            } else if (mainData[key].type == "compute") {
                createCompute(mainData[key], backRect, true, 0, 0);
            }
        }
        canvas.redraw();
    };
}

function clearChildren(canvasObj) {
    while (canvasObj.children.length > 0) {
        canvasObj.removeChildAt(0);
    }
}

function createRack(rackObj) {
    // canvas.height = (rackObj.size * inchToPixels(1.75)) + inchToPixels(2);
    
    var rack = canvas.display.rectangle({
        x: 0,
        y: 0,
        width: inchToPixels(20.25),
        height: inchToPixels(2+(1.75*rackObj.size)),
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
        height: rack.height-inchToPixels(2),
        fill: "#252525"
    });

    var rightRect = canvas.display.rectangle({
        origin:{x:"right", y:"top"},
        x:inchToPixels(20.25),
        y:inchToPixels(1),
        width: inchToPixels(1.125),
        height: rack.height-inchToPixels(2),
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
                createStorage(rackObj["servers"][key], rack, false, inchToPixels(.625), inchToPixels(1+(1.75*(rackObj.size-rackObj["servers"][key].position))));
            } else if (rackObj["servers"][key].type == "compute") {
                createCompute(rackObj["servers"][key], rack, false, inchToPixels(.625), inchToPixels(1+(1.75*(rackObj.size-rackObj["servers"][key].position))));
            }
        }
    }
    

    backRect.addChild(rack);
    rack.dragAndDrop(dragOptions);
    // console.log(canvas.children);
}

/**
 * takes x and y in pixels and places ethernet port child at that location in parentObj
 * @param {object} parentObj 
 * @param {float} x 
 * @param {float} y 
 */
function createEthernet(parentObj, x, y, labelText="", netName = "") {
    // console.log(netName);
    var largeRect = canvas.display.rectangle({
        origin: {x:"center", y:"center"},
        x: x,
        y: y,
        width: mmToPixels(16),
        height: mmToPixels(13.5),
        fill: "#444444"
    });

    if (netName.length == 0) {
        netName = "unconnected"
    }

    registerNetDevice(largeRect, [netName]);

    var largeInner = canvas.display.rectangle({
        origin: {x: "center", y: "center"},
        width: mmToPixels(11.6),
        height: mmToPixels(9),
        x: mmToPixels(0),
        y: mmToPixels(-1),
        fill: "000"
    });

    var smallInner = canvas.display.rectangle({
        origin: {x: "center", y: "top"},
        width: mmToPixels(6.35),
        height: mmToPixels(2),
        x: mmToPixels(0),
        y: mmToPixels(3.5),
        fill: "000"
    });

    var label = canvas.display.text({
        origin: { x: "center", y: "center"},
        x:inchToPixels(0),
        y:inchToPixels(0),
        font: inchToPixels(.25).toString() + "px sans-serif",
        // size: inchToPixels(1),
        fill: "#ffff",
        text: labelText
    });

    largeRect.addChild(largeInner);
    largeRect.addChild(smallInner);
    largeRect.addChild(label);

    largeRect.bind("highlight", function(e) {
        e.stopPropagation();
        largeRect.children[0].fill = highlightColor;
        largeRect.children[1].fill = highlightColor;
        // console.log(largeRect);
    });

    largeRect.bind("lowlight", function(e) {
        e.stopPropagation();
        largeRect.children[0].fill = "#000";
        largeRect.children[1].fill = "#000";
        // console.log(largeRect);
    });

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
            let tempConn = "";
            if (("connections" in switchObj) && ((switchObj.ports-index) in switchObj.connections)) {
                tempConn = switchObj.connections[(switchObj.ports-index)];
            }
            if ((index % 2) == 0) {
                createEthernet(bodyRect, inchToPixels(18-(.7*(index/2))), inchToPixels(1.2), labelText=(switchObj.ports-index).toString(), netName=tempConn);
            } else {
                createEthernet(bodyRect, inchToPixels(18-(.7*Math.trunc((index/2)))), inchToPixels(.55), labelText=(switchObj.ports-index).toString(), netName=tempConn);
            }
        }

        parentCanvas.addChild(bodyRect);

    }
}

function createStorage(storageObj, parentCanvas, draggable=false, x=-1, y=-1) {
    var bodyRect = canvas.display.rectangle({
        x: x,
        y: y,
        width: inchToPixels(19),
        height: inchToPixels(1.75*storageObj.size),
        fill: "linear-gradient(315deg, black, grey, black)",
        strokeWidth: inchToPixels(.125),
        strokeColor: "transparent"
    });

    if (draggable) {
        bodyRect.dragAndDrop(dragOptions);
    }

    bodyRect.bind("toggle", function(e) {
        e.stopPropagation();
        this.opacity = !this.opacity;
        canvas.redraw();
    });

    bodyRect.bind("click tap", function(e) {
        e.stopPropagation();
        selectItem(bodyRect, storageObj);
    });

    bodyRect.bind("highlight", function(e){
        e.stopPropagation();
        bodyRect.strokeColor = highlightColor;
    });

    bodyRect.bind("lowlight", function(e){
        e.stopPropagation();
        bodyRect.strokeColor = "transparent";
    });

    if ("connections" in storageObj) {
        // console.log(storageObj.connections);
        let connList = [];
        for (const conn in storageObj.connections) {
            connList.push(storageObj.connections[conn]);
        }
        registerNetDevice(bodyRect, connList);
    }

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
            let y = .625 + (Math.trunc(index/4)*1.125);
            let temp = index % 4;
            let x = 0;
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

function createCompute(computeObj, parentCanvas, draggable=false, x=-1, y=-1) {
    var bodyRect = canvas.display.rectangle({
        x: x,
        y: y,
        width: inchToPixels(19),
        height: inchToPixels(1.75*computeObj.size),
        fill: "linear-gradient(315deg, dimgray, darkgray, dimgray)",
        strokeWidth: inchToPixels(.125),
        strokeColor: "transparent"
    });

    if (draggable) {
        bodyRect.dragAndDrop(dragOptions);
    }

    bodyRect.bind("toggle", function(e) {
        e.stopPropagation();
        this.opacity = !this.opacity;
        canvas.redraw();
    });

    bodyRect.bind("click tap", function(e) {
        e.stopPropagation();
        selectItem(bodyRect, computeObj);
    });

    bodyRect.bind("highlight", function(e){
        e.stopPropagation();
        bodyRect.strokeColor = highlightColor;
    });

    bodyRect.bind("lowlight", function(e){
        e.stopPropagation();
        bodyRect.strokeColor = "transparent";
    });

    if ("connections" in computeObj) {
        // console.log(storageObj.connections);
        let connList = [];
        for (const conn in computeObj.connections) {
            connList.push(computeObj.connections[conn]);
        }
        registerNetDevice(bodyRect, connList);
    }

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

    //grill holes
    for (let i = 0; i < 40; i++) {
        for (let j = 0; j < (5 * computeObj.size); j++) {
            var tempCir = canvas.display.ellipse({
                fill: "#000",
                radius: inchToPixels(.075),
                x: inchToPixels(.625 + ((17.75/40)/2) + ((17.75/40)*i)),
                y: inchToPixels(.175 + (.35*j))
            });
            bodyRect.addChild(tempCir);
        }
    }

    var centerCir = canvas.display.ellipse({
        radius: inchToPixels(.75),
        x: inchToPixels(9.5),
        y: inchToPixels((computeObj.size * 1.75) / 2),
        fill: "silver"
    });
    bodyRect.addChild(centerCir);

    bodyRect.addChild(screwTL);
    bodyRect.addChild(screwTR);
    bodyRect.addChild(screwBL);
    bodyRect.addChild(screwBR);

    parentCanvas.addChild(bodyRect);
}