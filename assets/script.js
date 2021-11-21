const canvas = new fabric.Canvas('canvas', {
    preserveObjectStacking: true,
    backgroundColor: "#ffffff",
    stateful: true,

});
fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: "white",
    cornerStrokeColor: "black",
    borderColor: "black",
    cornerSize: 5,
    padding: 0,
    cornerStyle: "circle",
    borderDashArray: [5, 5],
    borderScaleFactor: 1.3,
});
// canvas.selection = false;
canvas.controlsAboveOverlay = true;

var artboard;
var a_width = 5400;
var a_height = 1080;
var isDragging = false;
var lastPosX = 0;
var lastPosY = 0;
var activeObject;
var croppableImage;
var cropleft;
var croptop;
var cropscalex;
var cropscaley;

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

makeArtboard();
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
function overlay(){
    canvas.add(new fabric.Rect({
        left: artboard.left,
        top: artboard.top,
        originX: "left",
        originY: "top",
        width: artboard.width,
        height: artboard.height,
        fill: "rgba(0,0,0,0.5)",
        selectable: false,
        id: "overlay"
    }));
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
    canvas.add(object).setActiveObject(object);
}
function addImage(src) {
    fabric.Image.fromURL(src, function (img) {
        img.set({
            originX: "center",
            originY: "center",
            scaleX: parseFloat(img.get("scaleX").toFixed(2)),
            scaleY: parseFloat(img.get("scaleY").toFixed(2)),
            ogWidth: img.get("width"),
            ogHeight: img.get("height")
        });
            centerObject(img);
        },
        { crossOrigin: 'anonymous'}
    );
}

function cropImage(){
    croppableImage = activeObject;
    canvas.uniformScaling = false;
    activeObject.setCoords();
    let left = activeObject.get("left")-((activeObject.get("width")*activeObject.get("scaleX"))/2);
    let top = activeObject.get("top")-((activeObject.get("height")*activeObject.get("scaleY"))/2);
    let cropx = activeObject.get("cropX");
    let cropy = activeObject.get("cropY");
    let cropUI = new fabric.Rect({
        left: activeObject.get("left"),
        top: activeObject.get("top"),
        width: (activeObject.get("width")*activeObject.get("scaleX"))-5,
        height: (activeObject.get("height")*activeObject.get("scaleY"))-5,
        originX: "center",
        originY: "center",
        id: "crop",
        fill: "rgba(0,0,0,0)",
        shadow: {
            color: "black",
            offsetX: 0,
            offsetY: 0,
            blur: 0,
            opacity: 0
        }
    })
    activeObject.clone(function(cloned) {
        cloned.set({
            id: "cropped",
            selectable: false,
            originX: "center",
            originY: "center"
        })
        canvas.add(cloned);
        canvas.bringToFront(cloned);
        canvas.bringToFront(cropUI);
        canvas.renderAll();
    });
    activeObject.set({
        cropX: 0,
        cropY: 0,
        width: activeObject.get("ogWidth"),
        height: activeObject.get("ogHeight")
    }).setCoords();
    canvas.renderAll();
    activeObject.set({
        left: left+((activeObject.get("width")*activeObject.get("scaleX"))/2)-(cropx*activeObject.get("scaleX")),
        top: top+((activeObject.get("height")*activeObject.get("scaleY"))/2)-(cropy*activeObject.get("scaleY"))
    })
    cropUI.setControlsVisibility({
        mt: true,
        mb: true,
        ml: true,
        mr: true,
        bl: true,
        br: true,
        tl: true,
        tr: true,
        mtr: false,
    })
    canvas.add(cropUI).setActiveObject(cropUI).renderAll();
    cropleft = cropUI.get("left");
    croptop = cropUI.get("top");
    cropscalex = cropUI.get("scaleX")-0.03;
    cropscaley = cropUI.get("scaleY")-0.03;
    overlay();
}
function crop(obj){
    let crop = canvas.getItemById("crop");
    croppableImage.setCoords();
    crop.setCoords();
    let cleft = crop.get("left")-((crop.get("width")*crop.get("scaleX"))/2);
    let ctop = crop.get("top")-((crop.get("height")*crop.get("scaleY"))/2);
    let height = (crop.get("height")/croppableImage.get("scaleY"))*crop.get("scaleY");
    let width = (crop.get("width")/croppableImage.get("scaleX"))*crop.get("scaleX");
    let left = cleft-(croppableImage.get("left")-((croppableImage.get("width")*croppableImage.get("scaleX"))/2));
    let top = ctop-(croppableImage.get("top")-((croppableImage.get("height")*croppableImage.get("scaleY"))/2));
    if (left < 0 && top > 0) {
        obj.set({cropY:top/croppableImage.get("scaleY"),height:height}).setCoords();
        canvas.renderAll();
        obj.set({
            top: ctop+((obj.get("height")*obj.get("scaleY"))/2)
        })
    } else if (top < 0 && left > 0) {
        obj.set({cropX:left/croppableImage.get("scaleX"),width:width}).setCoords();
        canvas.renderAll();
        obj.set({
            left: cleft+((obj.get("width")*obj.get("scaleX"))/2)
        })
    } else if (top > 0 && left > 0) {
        obj.set({cropX:left/croppableImage.get("scaleX"),cropY:top/croppableImage.get("scaleY"),height:height,width:width}).setCoords();
        canvas.renderAll();
        obj.set({
            left: cleft+((obj.get("width")*obj.get("scaleX"))/2),
            top: ctop+((obj.get("height")*obj.get("scaleY"))/2)
        })
    }
    canvas.renderAll();
    if (obj.get("id") != "cropped") {
        canvas.remove(crop);
        canvas.remove(canvas.getItemById("overlay"));
        canvas.remove(canvas.getItemById("cropped"));
        canvas.uniformScaling = true;
    }
    canvas.renderAll();
}
function checkCrop(obj){
    if (obj.isContainedWithinObject(croppableImage)) {
        croptop = obj.get("top");
        cropleft = obj.get("left");
        cropscalex = obj.get("scaleX");
        cropscaley = obj.get("scaleY");
    } else {
        obj.top = croptop;
        obj.left = cropleft;
        obj.scaleX = cropscalex;
        obj.scaleY = cropscaley;
        obj.setCoords();
        obj.saveState();
    }
    obj.set({
        borderColor: '#51B9F9',
    });
    canvas.renderAll();
    crop(canvas.getItemById("cropped"));
}

function limitRectScaling() {

    activeObject.width = activeObject.width * activeObject.scaleX;
    activeObject.height = activeObject.height * activeObject.scaleY;
    activeObject.scaleX = 1;
    activeObject.scaleY = 1;
    activeObject.dirty =true;

    activeObject.setCoords();

    if(activeObject.aCoords.tr.x > croppableImage.left+croppableImage.getScaledWidth()){
        activeObject.set('width',croppableImage.getScaledWidth());
        activeObject.set('left',croppableImage.left-10);
    }
    if(activeObject.aCoords.tl.x < croppableImage.left){
        activeObject.set('left',croppableImage.left);
    }
    if(activeObject.aCoords.tl.y < croppableImage.top){
        activeObject.set('top',croppableImage.top);
    }
    if(activeObject.aCoords.br.y > croppableImage.top+croppableImage.getScaledHeight()){
        activeObject.set('height',croppableImage.getScaledHeight());
        activeObject.set('top',croppableImage.top);
    }
}
function limitRectMoving(){
    let top = activeObject.top;
    let bottom = top + activeObject.getScaledHeight();
    let left = activeObject.left;
    let right = left + activeObject.getScaledWidth();

    // let topBound = croppableImage.getBoundingRect().top;
    let topBound = croppableImage.top;
    let bottomBound = topBound +  croppableImage.getScaledHeight();
    // let leftBound = croppableImage.getBoundingRect().left;
    let leftBound = croppableImage.left;
    let rightBound = leftBound +  croppableImage.getScaledWidth();

    activeObject.set('left',Math.min(Math.max(left, leftBound), rightBound - activeObject.getScaledWidth()));
    activeObject.set('top', Math.min(Math.max(top, topBound), bottomBound - activeObject.getScaledHeight()));
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
function canvasToDataUrl(){
    let data={
        width:canvas.canvasWidth*canvas.getZoom(),
        height:canvas.canvasHeight*canvas.getZoom(),
        left:canvas.viewportTransform[4],
        top:canvas.viewportTransform[5]
    };
    return canvas.toDataURL(data);
}
function dataURItoBlob(dataURI) {
    let mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: mime});
}
function downloadBlob(blob, filename){
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    let clickHandler = () => {
        setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener('click', clickHandler);
        }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
}


function addSeparator(id) {
    // console.log('addSeparator called :'+id);
}
function observe(eventName) {
    canvas.on(eventName, function(e){
        // console.log('observe called event :'+eventName);


    });
}
function observeObj(eventName) {
    // console.log('observeObj called event :'+eventName);
    canvas.getObjects().forEach(function(o) {
        o.on(eventName, function(e){


        });
    });
}


window.addEventListener('resize', resizeCanvas, false);
// Zoom in/out of the canvas

// Start: Button Clicks
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
$("#add-random-image").on("click",function(){
    addImage('https://picsum.photos/800/600');
});
$("#add-image").on("click",function(){
    addImage('assets/images/beautiful.jpg');
});
$("#crop-image").on("click",function(){
    cropImage();
});
$("#crop-done").on("click",function(){
    if(activeObject && activeObject.id == 'crop'){
        crop(croppableImage);
    }
});
$("#download").on("click",function(){

    downloadBlob(dataURItoBlob(canvasToDataUrl()), 'mudassirali.com.png');

});
// End: Button Clicks

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

canvas.on('object:modified', function(e){
    activeObject = e.target;
    if (activeObject.id == 'crop') {
        checkCrop(activeObject);
        return;
    }

});
canvas.on('object:moving', function(e){
    activeObject = e.target;
    if (activeObject.id == 'crop') {
        // limitRectMoving();
        if (activeObject.isContainedWithinObject(croppableImage)) {
            cropleft = activeObject.get("left");
            croptop = activeObject.get("top");
            cropscalex = activeObject.get("scaleX");
            cropscaley = activeObject.get("scaleY");
        }
        crop(canvas.getItemById("cropped"));
        return;
    }
    let evt = e.e;
    let {offsetX,offsetY} = evt;
    // console.log(offsetX,offsetY ,e)
    if( offsetX + 10 > canvas.getWidth()){
        canvas.relativePan(new fabric.Point(-10,-0))
    }
    if(offsetX < 10){
        canvas.relativePan(new fabric.Point(+10,-0))
    }
    if(offsetY + 10 > canvas.getHeight()){
        canvas.relativePan(new fabric.Point(-0,-10))
    }
    if(offsetY < 10){
        canvas.relativePan(new fabric.Point(-0,+10))
    }

});
canvas.on('object:scaling', function(e){
    activeObject = e.target;
    if (activeObject.id == 'crop') {
        // limitRectScaling();
        if (activeObject.isContainedWithinObject(croppableImage)) {
            cropleft = activeObject.get("left");
            croptop = activeObject.get("top");
            cropscalex = activeObject.get("scaleX");
            cropscaley = activeObject.get("scaleY");
        }
        crop(canvas.getItemById("cropped"));
        return;
    }
});

canvas.on('selection:created', function(e){
    activeObject = e.target;
    if(activeObject.type == 'image'){
        $("#image-params").show();
        $("#crop-done").hide();
        $("#crop-image").show();
    }
    if(activeObject.id == 'crop'){
        $("#image-params").show();
        $("#crop-done").show();
        $("#crop-image").hide();
    }
    $("#canvas-functionality").hide();
});
canvas.on('selection:updated', function(e){
    activeObject = e.target;
    if(e.deselected && e.deselected[0].id == 'crop'){
        canvas.remove(e.deselected[0]).renderAll();
        $("#crop-done").hide();
        $("#crop-image").show();
    }
    if(activeObject.type == 'image'){
        $("#image-params").show();
        $("#crop-done").hide();
        $("#crop-image").show();
    }
    if(activeObject.id == 'crop'){
        $("#image-params").show();
        $("#crop-done").show();
        $("#crop-image").hide();
    }
});
canvas.on('before:selection:cleared', function(e){
    // activeObject = e.target;
    // if(activeObject.id == 'crop'){
    //  canvas.remove(activeObject).renderAll();
    //     $("#crop-done").hide();
    //     $("#crop-image").show();
    //     crop(activeObject);
    // }
    // $("#image-params").hide();
    // $("#canvas-functionality").show();
});
canvas.on('selection:cleared', function(e){
    activeObject = e.target;
    $("#image-params").hide();
    $("#canvas-functionality").show();
    if(e.deselected && e.deselected[0].id == 'crop'){
        crop(croppableImage);
    }

});

// window.addEventListener("gesturechange", gestureChange, false);




/*observe('object:modified');
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
observeObj('dragleave');*/
