var wrapper = document.querySelector(".color-picker-container");
var huePickerFlag = false;

var panel = {
  elm: {
    hue: Object.create(null),
    color: Object.create(null),
    alpha: Object.create(null)
  },
  mouse: Object.create(null),
  elements: Object.create(null),
  width:300,
  height:300,
  hue:[255,0,0],
  mouseY: 0,
  mouseX: 0,
  huePickerFlag: false,
  colorPickerFlag: false,
  alphaPickerFlag: false,
  r: 250,
  g: 0,
  b: 0,
  a: 1
};

// UZYSKANIE WSPOLRZEDNYCH I HUE Z WPISANYCH RGB

function buildApp() {
  var elm = panel.elements;

  elm.headerContainer = createElm("div", wrapper, "header-container");
  elm.mainContainer = createElm("div", wrapper, "main-container");
  elm.footerContainer = createElm("div", wrapper, "footer-container");

  elm.huePanel = createElm("div", elm.mainContainer, "hue-panel");
  elm.colorPanel = createElm("div", elm.mainContainer, "color-panel");
  elm.hexPanel = createElm("div", elm.mainContainer, "hex-panel");
  elm.rgbaPanel = createElm("div", elm.mainContainer, "rgba-panel");

  elm.hueWrapper = createElm("div", elm.huePanel, "hue-wrapper");
  elm.colorWrapper = createElm("div", elm.colorPanel, "color-wrapper");
  elm.alphaWrapper = createElm("div", elm.colorPanel, "alpha-wrapper");
  elm.hexWrapper = createElm("div", elm.hexPanel, "hex-wrapper");
  elm.rWrapper = createElm("div", elm.rgbaPanel, "r-wrapper");
  elm.gWrapper = createElm("div", elm.rgbaPanel, "g-wrapper");
  elm.bWrapper = createElm("div", elm.rgbaPanel, "b-wrapper");
  elm.aWrapper = createElm("div", elm.rgbaPanel, "a-wrapper");

  elm.hueCanvas = createHueCanvas();
  elm.huePicker = panel.elm.hue.picker = createElm("div", elm.hueWrapper, "hue-picker picker");
  elm.colorCanvas = createColorCanvas();
  elm.colorPicker = panel.elm.color.picker = createElm("div", elm.colorWrapper, "color-picker picker");
  elm.rgbaValue = createElm("p", elm.colorWrapper, "rgba-value");
  elm.alphaCanvas = createAlphaCanvas();
  elm.alphaPicker = panel.elm.alpha.picker = createElm("div", elm.alphaWrapper, "alpha-picker picker");
  elm.hexInput = createElm("input", elm.hexWrapper, "hex-input");
  elm.rInput = createElm("input", elm.rWrapper, "r-input");
  elm.gInput = createElm("input", elm.gWrapper, "g-input");
  elm.bInput = createElm("input", elm.bWrapper, "b-input");
  elm.aInput = createElm("input", elm.aWrapper, "a-input");
}
buildApp()

function getCordsAndHue(panel) {

panel.min = Math.min(panel.r, panel.g, panel.b);
panel.max = Math.max(panel.r, panel.g, panel.b);

panel.xPer = panel.min/panel.max;
panel.yPer = panel.max/255;

//panel.saturation = 255 - (255 - color) * panel.xPer;
//panel.color = panel.saturation * (1 - panel.yPer)


panel.hue = [];p
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

function createHueCanvas() {
  panel.elm.hue.x = 0;
  panel.elm.hue.y = 0;
  panel.elm.hue.width = panel.elements.hueWrapper.getBoundingClientRect().width;
  panel.elm.hue.height = panel.elements.hueWrapper.getBoundingClientRect().height;
  var hueCanvas = createElm("canvas", panel.elements.hueWrapper, "hue-canvas");
  hueCanvas.width = panel.elm.hue.width;
  hueCanvas.height = panel.elm.hue.height;
  drawHueCanvas(panel.elm.hue, hueCanvas, panel);
  window.addEventListener("resize", function() {
    panel.elm.hue.width = panel.elements.hueWrapper.getBoundingClientRect().width;
    panel.elm.hue.height = panel.elements.hueWrapper.getBoundingClientRect().height;
    hueCanvas.width = panel.elm.hue.width;
    hueCanvas.height = panel.elm.hue.height;
    drawHueCanvas(panel.elm.hue, hueCanvas, panel);
  })
  return hueCanvas;
}

function createColorCanvas() {
  var colorCanvas = createElm("canvas", panel.elements.colorWrapper, "color-canvas");
  colorCanvas.width = panel.elements.colorWrapper.clientWidth;
  colorCanvas.height = panel.elements.colorWrapper.clientHeight;
  drawColorCanvas(colorCanvas, colorCanvas, panel);
  window.addEventListener("resize", function() {
    colorCanvas.width = panel.elements.colorWrapper.clientWidth;
    colorCanvas.height = panel.elements.colorWrapper.clientHeight;
    drawColorCanvas(colorCanvas, colorCanvas, panel)
  }, true);
  panel.elm.color.x = panel.elements.colorWrapper.clientWidth;
  panel.elm.color.y = 0;
  return colorCanvas;
}

function createAlphaCanvas() {
  var alphaCanvas = createElm("canvas", panel.elements.alphaWrapper, "alpha-canvas");
  alphaCanvas.width = panel.elements.alphaWrapper.clientWidth;
  alphaCanvas.height = panel.elements.alphaWrapper.clientHeight;
  drawAlphaCanvas(alphaCanvas, alphaCanvas, panel);
  window.addEventListener("resize", function() {
    alphaCanvas.width = panel.elements.alphaWrapper.clientWidth;
    alphaCanvas.height = panel.elements.alphaWrapper.clientHeight;
    drawAlphaCanvas(alphaCanvas, alphaCanvas, panel)
  }, true);
  panel.elm.alpha.x = panel.elements.alphaWrapper.clientWidth;
  panel.elm.alpha.y = 0;
  return alphaCanvas;
}

function getElm(elm, type) {
  var a = panel.elm[type];
  a.elm = elm;
  a.rect = elm.getBoundingClientRect();
  a.picker = elm.querySelector(".picker");
  a.pickerRect = a.picker.getBoundingClientRect();
  a.x = panel.mouse.x - a.rect.left + a.elm.scrollLeft;
  a.y = panel.mouse.y - a.rect.top + a.elm.scrollTop;
  if(a.x < 0) { a.x = a.elm.scrollLeft };
  if(a.x > a.rect.width) { a.x = a.elm.scrollLeft + a.rect.width };
  if(a.y > a.rect.height) { a.y = a.elm.scrollTop + a.rect.height };
  if(a.y < 0) { a.y = a.elm.scrollTop};
  a.width = a.rect.width;
  a.height = a.rect.height;
  a.xPer = a.x / a.width;
  a.yPer = a.y / a.height;
}

function updatePanelHue(parent) {
  panel.hue[0] = Math.floor(hueGradient(parent, panel, panel.elm.hue.x, panel.elm.hue.y, 0));
  panel.hue[1] = Math.floor(hueGradient(parent, panel, panel.elm.hue.x, panel.elm.hue.y, 2));
  panel.hue[2] = Math.floor(hueGradient(parent, panel, panel.elm.hue.x, panel.elm.hue.y, 4));
}

function updatePanelColor(parent) {
  panel.r = colorGradient(panel.hue[0], parent, panel.elm.color.x, panel.elm.color.y);
  panel.g = colorGradient(panel.hue[1], parent, panel.elm.color.x, panel.elm.color.y);
  panel.b = colorGradient(panel.hue[2], parent, panel.elm.color.x, panel.elm.color.y);
  panel.a = panel.alphaPickerFlag ? panel.elm.alpha.y/panel.elements.alphaCanvas.height : 1;
}

function getMouse(e) {
  panel.mouse.x = e.clientX;
  panel.mouse.y = e.clientY;
}

function updatePicker(type) {
  if(type == "hue") {
    panel.elm[type].picker.style.left = panel.elm[type].x - (panel.elm[type].pickerRect.width/2) + "px";
  } else if(type == "alpha") {
    panel.elm[type].picker.style.top = panel.elm[type].y - (panel.elm[type].pickerRect.height/2) + "px";
  } else {
    panel.elm[type].picker.style.left = panel.elm[type].x - (panel.elm[type].pickerRect.width/2) + "px";
    panel.elm[type].picker.style.top = panel.elm[type].y - (panel.elm[type].pickerRect.height/2) + "px";
  }
}

// MOUSEDOWN HUE WRAPPER

function drawHueCanvas(parent, elm, panel) {
  var ctx = elm.getContext("2d");
  var imgdata = ctx.getImageData(0, 0, parent.width, parent.height);
  var imgdatalength = imgdata.data.length;
  for (var i = 0; i < imgdatalength / 4; i++) {
    var x = i % parent.width;
    var y = Math.floor(i / parent.width);
    imgdata.data[4*i] = hueGradient(parent, panel, x, y, 0);
    imgdata.data[4*i+1] = hueGradient(parent, panel, x, y, 2);
    imgdata.data[4*i+2] = hueGradient(parent, panel, x, y, 4);
    imgdata.data[4*i+3] = 255;
  }
  ctx.putImageData(imgdata, 0, 0);
}

function hueGradient(parent, panel, x, y, hue) {
  var colorValue;
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
  var ctx = elm.getContext("2d");
  var imgdata = ctx.getImageData(0, 0, parent.width, parent.height);
  var imgdatalength = imgdata.data.length;
  for(var i=0; i<imgdatalength/4; i++) {
    var x = i % parent.width;
    var y = Math.floor(i / parent.width);
    imgdata.data[4*i] = colorGradient(panel.hue[0], parent, x, y);
    imgdata.data[4*i+1] = colorGradient(panel.hue[1], parent, x, y);
    imgdata.data[4*i+2] = colorGradient(panel.hue[2], parent, x, y);
    imgdata.data[4*i+3] = 255;
  }
  ctx.putImageData(imgdata, 0, 0);
}

function colorGradient(color, parent, x, y) {
  return Math.ceil((255-(255-color)*(x/parent.width))*((parent.height-y)/parent.height));
}

//MOUSEDOWN APLHA WRAPPER

function drawAlphaCanvas(parent, elm, panel) {
  var ctx = elm.getContext("2d");
  var imgdata = ctx.getImageData(0, 0, parent.width, parent.height);
  var imgdatalength = imgdata.data.length;
  for (var i = 0; i < imgdatalength / 4; i++) {
    var x = i % parent.width;
    var y = Math.floor(i / parent.width);
    imgdata.data[4*i] = panel.r
    imgdata.data[4*i+1] = panel.g
    imgdata.data[4*i+2] = panel.b
    imgdata.data[4*i+3] = y/parent.height * 255;
  }
  ctx.putImageData(imgdata, 0, 0);
}

function rgbToHex(r,g,b) {return toHex(r)+toHex(g)+toHex(b)}
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}

function updateColor() {
  panel.elements.headerContainer.style.background = `rgba(${panel.r}, ${panel.g}, ${panel.b}, ${panel.a})`
  panel.elements.footerContainer.style.background = `rgba(${panel.r}, ${panel.g}, ${panel.b}, ${panel.a})`
  panel.elm.hue.picker.style.backgroundColor = `rgb(${panel.hue[0]}, ${panel.hue[1]}, ${panel.hue[2]})`;
  panel.elm.color.picker.style.backgroundColor = `rgb(${panel.r}, ${panel.g}, ${panel.b})`;
  panel.elm.alpha.picker.style.backgroundColor = `rgba(${panel.r}, ${panel.g}, ${panel.b}, ${panel.a})`;
  panel.elements.hexInput.value = "#" + rgbToHex(panel.r, panel.g, panel.b);
  panel.elements.rInput.value = `${panel.r}`;
  panel.elements.gInput.value = `${panel.g}`;
  panel.elements.bInput.value = `${panel.b}`;
  panel.elements.aInput.value = `${(panel.a).toFixed(2)}`;
  panel.elements.rgbaValue.innerText = `rgba(${panel.r}, ${panel.g}, ${panel.b}, ${(panel.a).toFixed(2)})`
}

panel.elements.hueWrapper.addEventListener("mousedown", function(e) {
  panel.huePickerFlag = true;
  startHueUpdate(e, this);
  document.addEventListener("mousemove", function(event) {
    if(panel.huePickerFlag) {
      startHueUpdate(event, panel.elements.hueWrapper);
    }
  });
  document.addEventListener("mouseup", function() { panel.huePickerFlag = false });
  function startHueUpdate(e, elem) {
    getMouse(e);
    getElm(elem, "hue");
    updatePanelHue(panel.elements.hueCanvas);
    updatePanelColor(panel.elements.colorCanvas);
    updatePicker("hue");
    drawColorCanvas(panel.elements.colorCanvas, panel.elements.colorCanvas, panel);
    drawAlphaCanvas(panel.elements.alphaCanvas, panel.elements.alphaCanvas, panel);
    updateColor()
  }
})

panel.elements.colorWrapper.addEventListener("mousedown", function(e) {
  panel.colorPickerFlag = true;
  startColorUpdate(e, this);
  document.addEventListener("mousemove", function(event) {
    if(panel.colorPickerFlag) {
      startColorUpdate(event, panel.elements.colorWrapper);
    }
  })
  document.addEventListener("mouseup", function() { panel.colorPickerFlag = false });
  function startColorUpdate(e, elem) {
    getMouse(e);
    getElm(elem, "color");
    updatePanelColor(panel.elements.colorCanvas);
    updatePicker("color");
    drawAlphaCanvas(panel.elements.alphaCanvas, panel.elements.alphaCanvas, panel);
    updateColor()
  }
})

panel.elements.alphaWrapper.addEventListener("mousedown", function(e) {
  panel.alphaPickerFlag = true;
  startAlphaUpdate(e, this);
  document.addEventListener("mousemove", function(event) {
    if(panel.alphaPickerFlag) {
      startAlphaUpdate(event, panel.elements.alphaWrapper);
    }
  });
  document.addEventListener("mouseup", function() { panel.alphaPickerFlag = false });
  function startAlphaUpdate(e, elm) {
    getMouse(e);
    getElm(elm, "alpha");
    updatePanelColor(panel.elements.colorCanvas);
    updatePicker("alpha");
    updateColor();
  }
})

updateColor();
