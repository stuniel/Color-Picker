var wrapper = document.querySelector(".color-picker-container");
var pickerFlag = false;
var huePickerFlag = false;

var panel = {
  elm: Object.create(null),
  mouse: Object.create(null),
  width:300,
  height:300,
  hue:[255,255,0],
  mouseY: 0,
  mouseX: 0
};

panel.r = 222;
panel.g = 104;
panel.b = 78;
panel.a = 0;

// UZYSKANIE WSPOLRZEDNYCH I HUE Z WPISANYCH RGB

function buildApp() {
  var headerContainer = createElm("div", wrapper, "header-container");
  var mainContainer = createElm("div", wrapper, "main-container");
  var footerContainer = createElm("div", wrapper, "footer-container");

  var huePanel = createElm("div", mainContainer, "hue-panel");
  var colorPanel = createElm("div", mainContainer, "color-panel");
  var hexPanel = createElm("div", mainContainer, "hex-panel");
  var rgbaPanel = createElm("div", mainContainer, "rgba-panel");

  var hueWrapper = createElm("div", huePanel, "hue-wrapper");
  var colorWrapper = createElm("div", colorPanel, "color-wrapper");
  var alphaWrapper = createElm("div", colorPanel, "alpha-wrapper");
  var hexWrapper = createElm("div", hexPanel, "hex-wrapper");
  var rWrapper = createElm("div", rgbaPanel, "r-wrapper");
  var gWrapper = createElm("div", rgbaPanel, "g-wrapper");
  var bWrapper = createElm("div", rgbaPanel, "b-wrapper");
  var aWrapper = createElm("div", rgbaPanel, "a-wrapper");
}
buildApp()

function getCordsAndHue(panel) {

panel.min = Math.min(panel.r, panel.g, panel.b);
panel.max = Math.max(panel.r, panel.g, panel.b);

panel.xPer = panel.min/panel.max;
panel.yPer = panel.max/255;

//panel.saturation = 255 - (255 - color) * panel.xPer;
//panel.color = panel.saturation * (1 - panel.yPer)


panel.hue = [];
  if (panel.r == panel.max) {
    panel.hue[0] = 255;
    if (panel.g == panel.min) {
      panel.hue[1] = 0;
      panel.hue[2] = Math.floor(((panel.max*panel.xPer - panel.b)/(panel.xPer - 1))/panel.yPer);
    } else {
      panel.hue[1] = Math.floor(((panel.max*panel.xPer - panel.g)/(panel.xPer - 1))/panel.yPer);
      panel.hue[2] = 0;
    }
  } else if (panel.r == panel.min) {
    panel.hue[0] = 0
    if (panel.g == panel.max) {
      panel.hue[1] = 255;
      panel.hue[2] = Math.floor(((panel.max*panel.xPer - panel.b)/(panel.xPer - 1))/panel.yPer);
    } else {
      panel.hue[1] = Math.floor(((panel.max*panel.xPer - panel.g)/(panel.xPer - 1))/panel.yPer);
      panel.hue[2] = 255;
    }
  } else {
    panel.hue[0] = Math.floor(((panel.max*panel.xPer - panel.r)/(panel.xPer - 1))/panel.yPer);
    if (panel.hue[1] == panel.max) {
      panel.hue[1] = 255;
      panel.hue[2] = 0;
    } else {
      panel.hue[1] = 0;
      panel.hue[2] = 255;
    }
  }
}

// KONIEC

// MOUSEDOWN

function createElm(elem, parent, className) {
  var elm = document.createElement(elem);
  elm.className = className;
  parent.appendChild(elm);
  return elm
}

function createColorCanvas() {
  var colorCanvas = createElm("canvas", colorWrapper, "color-canvas");
  colorCanvas.width = colorWrapper.width;
  colorCanvas.height = colorWrapper.height;
  drawColorCanvas(colorCanvas, colorCanvas, panel);
}


function getElm(elm) {
  panel.elm.elm = elm;
  panel.elm.rect = elm.getBoundingClientRect();
  panel.elm.picker = elm.querySelector(".picker");
  panel.elm.x = panel.mouse.x - panel.elm.rect.left + panel.elm.elm.scrollLeft;
  panel.elm.y = panel.mouse.y - panel.elm.rect.top + panel.elm.elm.scrollTop;
  panel.elm.xPer = panel.elm.x / panel.elm.rect.width;
  panel.elm.yPer = panel.elm.y / panel.elm.rect.height;
  console.log(panel.elm);
}

function getMouse(e) {
  panel.mouse.x = e.clientX;
  panel.mouse.y = e.clientY;
  console.log(panel.mouse);
}

function updatePicker() {
  panel.elm.picker.style.top = panel.elm.y;
  panel.elm.picker.style.left = panel.elm.x;
}

// MOUSEDOWN HUE WRAPPER

function drawHueCanvas(parent, elm, panel) {
  var ctx = colorCanvas.getContext("2d");
  var imgdata = ctx.getImageData(0, 0, parent.width, parent.height);
  var imgdatalength = imgdata.data.length;
  for (var i = 0; i < imgdatalength / 4; i++) {
    var x = i % parent.width;
    var y = Math.floor(i / parent.width);
    imgdata.data[4*i] = hueGradient(panel, panel.r, x, y, 0);
    imgdata.data[4*i+1] = hueGradient(panel, panel.g, x, y, 2);
    imgdata.data[4*i+2] = hueGradient(panel, panel.b, x, y, 4);
    imgdata.data[4*i+3] = 255;
  }
  ctx.putImageData(imgdata, 0, 0);
}

function hueGradient(panel, color, x, y, hue) {
  var segment = (parent.width/6)
  var range = (x/parent.width)*6;
  var z = (x/segment);
  var perc = Math.floor(x % segment)/segment;
  var invertedPerc = ((parent.width-x) % segment)/segment;

  switch(true) {
    case z <= hue + 1 && z >= hue - 1 || z >= hue + 5:
      colorValue = 255;
      break;
    case z <= hue - 2 || z >= hue + 2 && z <= hue + 4:
      colorValue = 0;
      break;
    case z > hue + 1 && z < hue + 2:
      colorValue = Math.ceil(invertedPerc*25500)/100;
      break;
    case z > hue + 4 && z < hue + 5 || z > hue - 2 && z < hue - 1:
      colorValue = Math.ceil(perc*25500)/100;
      break;
  }
  return colorValue;
}

// MOUSEDOWN COLOR WRAPPER

function drawColorCanvas(parent, elm, panel) {
  var ctx = colorCanvas.getContext("2d");
  var imgdata = ctx.getImageData(0, 0, parent.width, parent.height);
  var imgdatalength = imgdata.data.length;
  for(var i=0; i<imgdatalength/4; i++) {
    var x = i % parent.width;
    var y = Math.floor(i / parent.width);
    imgdata.data[4*i] = colorGradient(panel.r, parent, x, y);
    imgdata.data[4*i+1] = colorGradient(panel.g, parent, x, y);
    imgdata.data[4*i+2] = colorGradient(panel.b, parent, x, y);
    imgdata.data[4*i+3] = 255;
  }
  ctx.putImageData(imgdata, 0, 0);
}

function colorGradient(color, parent, x, y) {
  return Math.floor((255-(255-color)*(x/parent.width))*((parent.height-y)/parent.height));
}

//MOUSEDOWN APLHA WRAPPER


wrapper.addEventListener("mousedown", function(e) {
  getMouse(e);
  getElm(this);
  updatePicker();
  var colorCanvas = this.querySelector("canvas");
  drawColorCanvas(this, colorCanvas, panel);
})


var picker = createElm("div", wrapper, "picker");
