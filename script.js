const canvas = new fabric.Canvas('canvas', {
    preserveObjectStacking: true,
    backgroundColor: "#ffffff",
    stateful: true
});
canvas.selection = false;
canvas.controlsAboveOverlay = true;

var artboard;
var a_width = 5400;
var a_height = 1080;
var isDragging = false;
var lastPosX = 0;
var lastPosY = 0;
canvas.canvasWidth = Math.ceil(a_width);
canvas.canvasHeight = Math.ceil(a_height);
canvas.manual_zoom = getFitToScreenZoom();


// Get any object by ID
fabric.Canvas.prototype.getItemById = function(name) {
    var object = null,
        objects = this.getObjects();
    for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i].get("type") == "group") {
            if (objects[i].get("id") && objects[i].get("id") === name) {
                object = objects[i];
                break;
            }
            var wip = i;
            for (var o = 0; o < objects[i]._objects.length; o++) {
                if (objects[wip]._objects[o].id && objects[wip]._objects[o].id === name) {
                    object = objects[wip]._objects[o];
                    break;
                }
            }
        } else if (objects[i].id && objects[i].id === name) {
            object = objects[i];
            break;
        }
    }
    return object;
};

// Resize the canvas

makeArtboard()
resizeCanvas();
setZoomElement();
createAddButtonElement()
createSubtractButtonElement()


function makeArtboard() {
    artboard = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas.canvasWidth,
        height: canvas.canvasHeight,
        absolutePositioned: true,
        rx: 0,
        ry: 0,
        fill: "#FFF",
        hasControls: true,
        transparentCorners: false,
        borderColor: '#0E98FC',
        cornerColor: '#0E98FC',
        cursorWidth: 1,
        cursorDuration: 1,
        cursorDelay: 250,
        id: "overlay"
    });
    canvas.clipPath = artboard;
    canvas.renderAll();
}
function resizeCanvas() {
    canvas.discardActiveObject();
    fitCanvasToContainer()

    // artboard.set({left:(canvas.get("width")/2)-(artboard.get("width")/2),top:(canvas.get("height")/2)-(artboard.get("height")/2)})
    canvas.renderAll();
    // animate(false, currenttime);
    // initLines();
}
function setZoomElement(){
    $("#zoom-level span").html((canvas.manual_zoom*100).toFixed(0)+"%");
}
function getFitToScreenZoom(){
  let domEl = document.querySelector('#canvasview');
  let zoom = 1;
  if (domEl) {
    let {offsetWidth, offsetHeight} = domEl;
    let canvasWidth = parseInt(canvas.canvasWidth);
    let canvasHeight = parseInt(canvas.canvasHeight);
      canvasWidth += 5;
      canvasHeight += 5;
      let incrementFactor = 0.05;
      if (canvasWidth < offsetWidth && canvasHeight < offsetHeight) {
          do {
              zoom = zoom + incrementFactor;
          } while (zoom * canvasWidth < offsetWidth && zoom * canvasHeight < offsetHeight)
          zoom -= incrementFactor;
      } else {
        while (zoom * canvasWidth > offsetWidth || zoom * canvasHeight > offsetHeight) {
          zoom = zoom - incrementFactor;
        }
        zoom = zoom - incrementFactor;

      }
  }
  return zoom;
}
function fitCanvasToContainer(){
  let {clientWidth,clientHeight} = document.querySelector('#canvasview')
  canvas.setHeight(clientHeight)
  canvas.setWidth(clientWidth)
    setZoomToPoint()
    setAbsolutePan()
}
function setZoomToPoint(points = new fabric.Point(0, 0)) {
    canvas.zoomToPoint(points, canvas.manual_zoom);
}
function setAbsolutePan() {
    let panX = canvas.width/2 - (canvas.canvasWidth*canvas.manual_zoom)/2,
        panY = canvas.height/2 - (canvas.canvasHeight*canvas.manual_zoom)/2;
    canvas.absolutePan(new fabric.Point(-panX,-panY));
}

function createAddButtonElement(){
    let btnLeft = canvas.width/2 + (canvas.canvasWidth*canvas.manual_zoom)/2,
        btnTop = canvas.height/2 - (canvas.canvasHeight*canvas.manual_zoom)/2;
    // let addButton = '<button id="addButton" style="position:absolute;top:'+btnTop+'px;left:'+btnLeft+'px;cursor:pointer;width:20px;height:20px;">Add</button>'
    // $(".canvas-container").append(addButton);
    // document.querySelector('.canvas-container').innerHTML = addButton
    let button = document.createElement('button');
    button.style.position = 'absolute'
    button.style.left = `${btnLeft}px`
    button.style.top = `${btnTop}px`
    button.style.cursor = 'pointer'
    // button.style.width = '20px'
    // button.style.height = '20px'
    button.id = 'addButton'
    button.innerText="Add"
    document.querySelector('.canvas-container').appendChild(button)
    document.querySelector("#addButton").addEventListener("click",function(e){
        canvas.canvasWidth+=1080
        makeArtboard()
        // canvas.setWidth(document.querySelector('#canvasview').clientWidth+document.querySelector('#canvasview').clientWidth/4)
        // buttonPosition()
    },false);
}
function createSubtractButtonElement(){
    let btnLeft = canvas.width/2 + (canvas.canvasWidth*canvas.manual_zoom)/2,
        btnTop = canvas.height/2 + (canvas.canvasHeight*canvas.manual_zoom)/2;
    let subtractButton = '<button id="subtractButton" style="position:absolute;top:'+btnTop+'px;left:'+btnLeft+'px;cursor:pointer;width:20px;height:20px;">Add</button>'
    let button = document.createElement('button');
    button.style.position = 'absolute'
    button.style.left = `${btnLeft}px`
    button.style.top = `${btnTop}px`
    button.style.cursor = 'pointer'
    // button.style.width = '20px'
    // button.style.height = '20px'
    button.id = 'subtractButton'
    button.innerText="Subtract"
    document.querySelector('.canvas-container').appendChild(button)
    document.querySelector("#subtractButton").addEventListener("click",function(e){
        canvas.canvasWidth-=1080
        makeArtboard()
        // canvas.setWidth(document.querySelector('#canvasview').clientWidth-document.querySelector('#canvasview').clientWidth/4)
        // buttonPosition()
    },false);

}
function buttonPosition(){
    let panX = canvas.width/2 + (canvas.canvasWidth*canvas.manual_zoom)/2,
        panY = canvas.height/2 - (canvas.canvasHeight*canvas.manual_zoom)/2;

    document.querySelector('#addButton').style.left = `${panX}px`
    document.querySelector('#addButton').style.top = `${panY}px`


    panX = canvas.width/2 + (canvas.canvasWidth*canvas.manual_zoom)/2,
        panY = canvas.height/2 - (canvas.canvasHeight*canvas.manual_zoom)/2 + 60;

    document.querySelector('#subtractButton').style.left = `${panX}px`
    document.querySelector('#subtractButton').style.top = `${panY}px`
}


function centerObject(object) {
    object.set('left',artboard.width/2+artboard.left-object.width/2);
    object.set('top',artboard.height/2+artboard.top-object.height/2);
    canvas.add(object).renderAll();
    observeObj('mousemove')
    observeObj('mousedown')

    observeObj('drop');
    observeObj('dragover');
    observeObj('dragenter');
    observeObj('dragleave');
    observeObj('moving');
}
function loadFromJson(json) {
    canvas.clear()
    canvas.canvasWidth = Math.ceil(json.width?json.width:1000);
    canvas.canvasHeight = Math.ceil(json.height?json.height:1000);
    canvas.manual_zoom = getFitToScreenZoom();
    makeArtboard()
    canvas.loadFromJSON(json, function(){
        fitCanvasToContainer()
    })

}


function addSeparator(id) {
    // console.log('addSeparator called :'+id);
}
function observe(eventName) {

    canvas.on(eventName, function(e){
        // console.log('observe called event :'+eventName);
        if(eventName == 'object:moving'){
            let evt = e.e
            let {offsetX,offsetY} = evt
            // console.log(offsetX)
            if( offsetX + 10 > canvas.getWidth()){
                canvas.relativePan(new fabric.Point(-5,-0))
            }
            if(offsetX < 10){
                canvas.relativePan(new fabric.Point(+5,-0))
            }
            if(offsetY + 10 > canvas.getHeight()){
                canvas.relativePan(new fabric.Point(-0,-5))
            }
            if(offsetY < 10){
                canvas.relativePan(new fabric.Point(-0,+5))
            }

        }
        if(eventName == 'mouse:over'){
            // console.log(e.e.clientX,e.e.offsetX,e.target)


        }

    });
}
function observeObj(eventName) {
    // console.log('observeObj called event :'+eventName);
    canvas.getObjects().forEach(function(o) {
        o.on(eventName, function(e){
            if(eventName == 'mousemove'){
                let evt = e.e
                let obj = e.target
                let {offsetX,offsetY} = evt

                // if((obj.width/6) + offsetX > canvas.getWidth()){
                //     canvas.relativePan(new fabric.Point(-10,-0))
                // }
                // if((obj.width/6) > offsetX){
                //     canvas.relativePan(new fabric.Point(+10,-0))
                // }
                // if((obj.height/6) + offsetY > canvas.getHeight()){
                //     canvas.relativePan(new fabric.Point(-0,-10))
                // }
                // if((obj.height/6) > offsetY){
                //     canvas.relativePan(new fabric.Point(-0,+10))
                // }

            }
            /* if(eventName == 'mousedown'){
                 console.log('mousedown')
             }
             if(eventName == 'drop'){
                 console.log('drop')
             }
             if(eventName == 'dragover'){
                 console.log('dragover')
             }
             if(eventName == 'dragenter'){
                 console.log('dragenter')
             }
             if(eventName == 'dragleave'){
                 console.log('dragleave')
             }
             if(eventName == 'moving'){
                 console.log('moving')
                 console.log(e.transform.target.left)
             }*/


        });
    });
}


window.addEventListener('resize', resizeCanvas, false);
// Zoom in/out of the canvas

/*Start: Button Clicks*/
$("#grab-canvas").on("click",function(){

    if(document.querySelector('#grab-canvas').textContent === 'Grab Canvas' ){
        canvas.defaultCursor = 'grab';
        document.querySelector('#grab-canvas').textContent = 'UnGrab Canvas'
    } else {
        canvas.defaultCursor = 'default';
        document.querySelector('#grab-canvas').textContent = 'Grab Canvas'
    }
    canvas.renderAll()
});
$("#add-rect").on("click",function(){
    const rect = new fabric.Rect({
        width: 300,
        height: 300,
        fill: '#000000',
        rx: 0,
        ry: 0,
        objectCaching: false,
    });
    centerObject(rect)
});
/*End: Button Clicks*/

canvas.on('mouse:wheel', function(opt) {
    let evt = opt.e
    if (evt.ctrlKey === true) {
        let delta = evt.deltaY;
        setZoomElement();
        if (canvas.manual_zoom > 1) canvas.manual_zoom = 1;
        if (canvas.manual_zoom < 0.01) canvas.manual_zoom = 0.01;
        canvas.manual_zoom *= 0.999 ** delta + (delta > 0?-0.25:0.25);
        // console.log(canvas.manual_zoom,delta)
        setZoomToPoint(new fabric.Point(evt.offsetX,evt.offsetY));
    }else{
        let {deltaX,deltaY} = evt
        // allow only 1 axis to scroll H or V
        if(Math.abs(deltaX) > Math.abs(deltaY)){
            deltaY=0
        } else {
            deltaX=0
        }
        canvas.relativePan(new fabric.Point(-deltaX,-deltaY))
    }
    canvas.renderAll()
    // buttonPosition()
    evt.preventDefault();
    evt.stopPropagation();
});

// Start panning if space is down or hand tool is enabled
canvas.on('mouse:down', function(opt) {
    let evt = opt.e;
    // if(evt.altKey === true) //to grab by alt button clicked
    if (this.defaultCursor === 'grab') {
        this.defaultCursor  = 'grabbing'
        isDragging = true;
        this.selection = false;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;

    }
});
    
// Pan while dragging mouse
canvas.on('mouse:move', function(opt) {
    let e = opt.e;
    if (isDragging) {
        let vpt = this.viewportTransform;
        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;
        this.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
    }
});

// Stop panning
canvas.on('mouse:up', function(opt) {
    if(isDragging){
        this.setViewportTransform(this.viewportTransform);
        isDragging = false;
        this.selection = true;
        this.defaultCursor = 'grab'
        this.renderAll()
    }
});
    
// Detect mouse over canvas (for dragging objects from the library)
canvas.on('mouse:over', function(e){

    });
canvas.on('mouse:out', function(e){

});

// window.addEventListener("gesturechange", gestureChange, false);




observe('object:modified');
addSeparator('observing-events-log');

observe('object:moving');
observe('object:scaling');
observe('object:rotating');
observe('object:skewing');
observe('object:moved');
observe('object:scaled');
observe('object:rotated');
observe('object:skewed');
addSeparator('observing-events-log');

observe('before:transform');
observe('before:selection:cleared');
observe('selection:cleared');
observe('selection:created');
observe('selection:updated');
addSeparator('observing-events-log');

observe('mouse:up');
observe('mouse:down');
observe('mouse:move');
observe('mouse:up:before');
observe('mouse:down:before');
observe('mouse:move:before');
observe('mouse:dblclick');
observe('mouse:wheel');
observe('mouse:over');
observe('mouse:out');
addSeparator('observing-events-log');

observe('drop');
observe('dragover');
observe('dragenter');
observe('dragleave');
addSeparator('observing-events-log');

observe('after:render');
addSeparator('observing-events-log');

observeObj('moving');
observeObj('scaling');
observeObj('rotating');
observeObj('skewing');
observeObj('moved');
observeObj('scaled');
observeObj('rotated');
observeObj('skewed');
addSeparator('observing-events-log-obj');

observeObj('mouseup');
observeObj('mousedown');
observeObj('mousemove');
observeObj('mouseup:before');
observeObj('mousedown:before');
observeObj('mousemove:before');
observeObj('mousedblclick');
observeObj('mousewheel');
observeObj('mouseover');
observeObj('mouseout');
addSeparator('observing-events-log-obj');

observeObj('drop');
observeObj('dragover');
observeObj('dragenter');
observeObj('dragleave');
