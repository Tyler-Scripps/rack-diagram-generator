import sys
import json
from tkinter.ttk import Style
import svgwrite
# from svgwrite import inch


if len(sys.argv) != 2:
    print("Wrong number of arguments")
    quit()

f = open(sys.argv[1])
data = json.load(f)
f.close()
print(data)

# print(data['rack']['size'])

dwg = svgwrite.Drawing(filename="rack.svg", debug=True)
rackGroup = dwg.add(dwg.g(id="rack", fill="#252525"))
rect = dwg.rect(insert=("0in","0in"), size=("20in","1in"))  #top bar
rackGroup.add(rect)
height = str(data['rack']['size'] * 1.75) + "in"
rect = dwg.rect(insert=("0in","1in"), size=("1.125in", height))   #left bar
rackGroup.add(rect)
rect = dwg.rect(insert=("18.875in","1in"), size=("1.125in",height))  #right bar
rackGroup.add(rect)
height = str(data['rack']['size'] * 1.75 + 1) + "in"
rect = dwg.rect(insert=("0in",height), size=("20in","1in")) #bottom bar
rackGroup.add(rect)
rackHoles = rackGroup.add(dwg.g(id="holes", fill="white", style="font-size:.5in;"))
for i in range(data['rack']['size']):
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
    rackHoles.add(dwg.text(str(data['rack']['size']-i), insert=("0.05in",dim4)))
    rackHoles.add(dwg.text(str(data['rack']['size']-i), insert=("19.5in",dim4)))

for i in range(data['rack']['size'] - 1):   #draw lines between Us
    dim5 = str((i*1.75) + 2.75) + "in"
    line1 = dwg.line(start = (".1in", dim5), end=("1.025in", dim5), stroke="white", stroke_width=".025in")
    rackHoles.add(line1)

dwg.save()