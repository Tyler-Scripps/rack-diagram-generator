import sys
import json
from tkinter.ttk import Style
import svgwrite
import math


def createRack(rackObj):
    rackGroup = dwg.add(dwg.g(id="rack", fill="#252525"))
    rect = dwg.rect(insert=("0in","0in"), size=("20in","1in"))  #top bar
    rackGroup.add(rect)
    height = str(rackObj['size'] * 1.75) + "in"
    rect = dwg.rect(insert=("0in","1in"), size=("1.125in", height))   #left bar
    rackGroup.add(rect)
    rect = dwg.rect(insert=("18.875in","1in"), size=("1.125in",height))  #right bar
    rackGroup.add(rect)
    height = str(rackObj['size'] * 1.75 + 1) + "in"
    rect = dwg.rect(insert=("0in",height), size=("20in","1in")) #bottom bar
    rackGroup.add(rect)
    rackHoles = rackGroup.add(dwg.g(id="holes", fill="white", style="font-size:.5in;"))
    for i in range(rackObj['size']):
        dim1 = str((i*1.75) + 1.0625) + "in"
        rect1 = dwg.rect(insert = (".625in", dim1),size = (".375in",".375in"))  #top let
        rackHoles.add(rect1)
        rect2 = dwg.rect(insert = ("19in", dim1),size = (".375in",".375in"))  #top right
        rackHoles.add(rect2)

        dim2 = str((i*1.75) + 1.6875) + "in"
        rect3 = dwg.rect(insert = (".625in", dim2),size = (".375in",".375in"))  #middle left
        rackHoles.add(rect3)
        rect4 = dwg.rect(insert = ("19in", dim2),size = (".375in",".375in"))  #middle right
        rackHoles.add(rect4)

        dim3 = str((i*1.75) + 2.3125) + "in"
        rect5 = dwg.rect(insert = (".625in", dim3),size = (".375in",".375in"))  #bottom left
        rackHoles.add(rect5)
        rect6 = dwg.rect(insert = ("19in", dim3),size = (".375in",".375in"))  #bottom right
        rackHoles.add(rect6)

        dim4 = str((i*1.75) + 2.0625) + "in"
        rackHoles.add(dwg.text(str(rackObj['size']-i), insert=("0.05in",dim4)))
        rackHoles.add(dwg.text(str(rackObj['size']-i), insert=("19.5in",dim4)))

    for i in range(rackObj['size'] - 1):   #draw lines between Us
        dim5 = str((i*1.75) + 2.75) + "in"
        line1 = dwg.line(start=(".1in", dim5), end=("1.025in", dim5), stroke="white", stroke_width=".025in")
        line2 = dwg.line(start=("18.975in", dim5), end=("19.9in",dim5), stroke="white", stroke_width=".025in")
        rackHoles.add(line1)
        rackHoles.add(line2)

def createEthernet(x, y):
    tempGroup = dwg.add(dwg.g())
    tempGroup.add(dwg.rect(insert=(str(x-0.3149606)+"in", str(y-0.265748)+"in"), size=("16mm","13.5mm"), fill="#444444"))
    tempGroup.add(dwg.rect(insert=(str(x-0.2358268)+"in", str(y-0.1771654)+"in"), size = ("11.6mm", "9mm")))
    tempGroup.add(dwg.rect(insert=(str(x-0.125)+"in", str(y-0.03937008+0.1771654)+"in"), size=("6.35mm", "2mm")))

def createDriveLFF(x,y):
    tempGroup = dwg.add(dwg.g())
    tempGroup.add(dwg.rect(insert=(str(x-2)+"in", str(y-.25)+"in"), size=("4in", "1in"), fill="#666666"))

def createNotes(obj, rackSize):
    height = ((rackSize - obj["position"]) * 1.75) + 1
    text = ""
    if "name" in obj:
        text += "Name: " + obj["name"] + ", "
    if "ip" in obj:
        text += "ip: " + obj["ip"] + ", "
    g=dwg.g(style="font-size: .75in; stroke: white; fill: black; font-family: Arial")
    g.add(dwg.text(text, insert=("20.25in",str(height + 1)+"in")))
    dwg.add(g)

def createSwitch(switchObj, rackSize):
    if switchObj["type"] != "switch":
        return False
    tempGroup = dwg.add(dwg.g(id=switchObj["name"]))
    height = ((rackSize - switchObj["position"]) * 1.75) + 1
    tempGroup.add(dwg.rect(insert=(".5in",str(height)+"in"), size=("19in",str(switchObj["size"]*1.75)+"in")))   #body rectangle
    tempGroup.add(dwg.circle(center=(".8125in",str(height+.25)+"in"), r=".1in", fill="#555555"))    #top left screw
    tempGroup.add(dwg.circle(center=(".8125in",str(height+(1.5 + ((switchObj["size"] - 1) * 1.75)))+"in"), r=".1in", fill="#555555"))    #bottom left screw
    tempGroup.add(dwg.circle(center=("19.1875in",str(height+.25)+"in"), r=".1in", fill="#555555"))  #top right screw
    tempGroup.add(dwg.circle(center=("19.1875in",str(height+(1.5 + ((switchObj["size"] - 1) * 1.75)))+"in"), r=".1in", fill="#555555"))  #bottom right screw
    for i in range(switchObj["ports"]):
        if (i % 2) == 0:    #even
            x = 18 - (.7 * (i/2))
            y = height + .55
            createEthernet(x, y)
        else:   #odd
            x = 18 - (.7 * math.trunc((i/2)))
            y = height + 1.2
            createEthernet(x, y)
    createNotes(switchObj, rackSize)
    return True

def createStorage(storageObj, rackSize):
    if storageObj["type"] != "storage":
        return False
    tempGroup = dwg.add(dwg.g(id=storageObj["name"]))
    height = ((rackSize - storageObj["position"]) * 1.75) + 1
    tempGroup.add(dwg.rect(insert=(".5in",str(height)+"in"), size=("19in",str(storageObj["size"]*1.75)+"in")))   #body rectangle
    tempGroup.add(dwg.circle(center=(".8125in",str(height+.25)+"in"), r=".1in", fill="#555555"))    #top left screw
    tempGroup.add(dwg.circle(center=(".8125in",str(height+(1.5 + ((storageObj["size"] - 1) * 1.75)))+"in"), r=".1in", fill="#555555"))    #bottom left screw
    tempGroup.add(dwg.circle(center=("19.1875in",str(height+.25)+"in"), r=".1in", fill="#555555"))  #top right screw
    tempGroup.add(dwg.circle(center=("19.1875in",str(height+(1.5 + ((storageObj["size"] - 1) * 1.75)))+"in"), r=".1in", fill="#555555"))  #bottom right screw
    if storageObj["driveSize"] == 3.5:
        for i in range(storageObj["drives"]):
            y = height + .375 + (math.trunc(i/4)*1.125)
            if i%4 == 0:
                x = 16.525
                createDriveLFF(x,y)
            elif i%4 == 1:
                x = 12.175
                createDriveLFF(x,y)
            elif i%4 == 2:
                x = 7.825
                createDriveLFF(x,y)
            elif i%4 == 3:
                x = 3.475
                createDriveLFF(x,y)
    elif storageObj["driveSize"] == 2.5:
        pass
    createNotes(storageObj, rackSize)
    return True


if len(sys.argv) != 2:
    print("Wrong number of arguments")
    quit()

f = open(sys.argv[1])
data = json.load(f)
f.close()
# print(data)

# print(data['rack']['size'])

dwg = svgwrite.Drawing(filename="rack.svg", debug=True)

size = 0

if 'rack' in data:
    # print(data["rack"])
    createRack(data["rack"])
    size = data["rack"]["size"]
else:
    if "servers" in  data:
        for server in data["servers"]:
            if (server["position"] + size) > size:
                size = (server["position"] + size)

if "servers" in  data:
    for server in data["servers"]:
        print(server)
        if server["type"] == "switch":
            createSwitch(server, size)
        elif server["type"] == "storage":
            createStorage(server, size)

dwg.save()