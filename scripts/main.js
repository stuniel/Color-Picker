(function() {
var panel = {
  elm: {
    hue: Object.create(null),
    color: Object.create(null),
    alpha: Object.create(null)
  },
  mouse: Object.create(null),
  elements: Object.create(null),
  r: 90,
  g: 207,
  b: 142,
  a: 1,
  hex: "#5ACF8E",
  hue:[0,255,114],
  h: 147,
  huePickerFlag: false,
  colorPickerFlag: false,
  alphaPickerFlag: false,
  createHueCanvas: function () {
    this.elm.hue.x = 0;
    this.elm.hue.y = 0;
    this.elm.hue.width = this.elements.hueWrapper.getBoundingClientRect().width;
    this.elm.hue.height = this.elements.hueWrapper.getBoundingClientRect().height;
    var hueCanvas = this.createElm("canvas", this.elements.hueWrapper, "hue-canvas");
    hueCanvas.width = this.elm.hue.width;
    hueCanvas.height = this.elm.hue.height;
    this.drawHueCanvas(hueCanvas, hueCanvas);
    return hueCanvas;
  },
  createColorCanvas: function () {
    var colorCanvas = this.createElm("canvas", this.elements.colorWrapper, "color-canvas");
    colorCanvas.width = this.elements.colorWrapper.getBoundingClientRect().width;
    colorCanvas.height = this.elements.colorWrapper.getBoundingClientRect().height;
    this.drawColorCanvas(colorCanvas, colorCanvas);
    this.elm.color.x = colorCanvas.width;
    this.elm.color.y = 0;
    return colorCanvas;
  },
  createAlphaCanvas: function () {
    var alphaCanvas = this.createElm("canvas", this.elements.alphaWrapper, "alpha-canvas");
    alphaCanvas.width = this.elements.alphaWrapper.getBoundingClientRect().width;
    alphaCanvas.height = this.elements.alphaWrapper.getBoundingClientRect().height;
    this.drawAlphaCanvas(alphaCanvas, alphaCanvas);
    this.elm.alpha.x = alphaCanvas.width;
    this.elm.alpha.y = 0;
    return alphaCanvas;
  },
  drawHueCanvas: function (parent, elm) {
    var ctx = elm.getContext("2d");
    var imgdata = ctx.getImageData(0, 0, parent.width, parent.height);
    var imgdatalength = imgdata.data.length;
    for (var i = 0; i < imgdatalength / 4; i++) {
      var x = i % parent.width;
      var y = Math.floor(i / parent.width);
      imgdata.data[4*i] = this.hueGradient(parent, x, y, 0);
      imgdata.data[4*i+1] = this.hueGradient(parent, x, y, 2);
      imgdata.data[4*i+2] = this.hueGradient(parent, x, y, 4);
      imgdata.data[4*i+3] = 255;
    }
    ctx.putImageData(imgdata, 0, 0);
  },
  drawColorCanvas: function (parent, elm) {
    var ctx = elm.getContext("2d");
    var imgdata = ctx.getImageData(0, 0, parent.width, parent.height);
    var imgdatalength = imgdata.data.length;
    for(var i=0; i<imgdatalength/4; i++) {
      var x = i % parent.width;
      var y = Math.floor(i / parent.width);
      imgdata.data[4*i] = this.colorGradient(this.hue[0], parent, x, y);
      imgdata.data[4*i+1] = this.colorGradient(this.hue[1], parent, x, y);
      imgdata.data[4*i+2] = this.colorGradient(this.hue[2], parent, x, y);
      imgdata.data[4*i+3] = 255;
    }
    ctx.putImageData(imgdata, 0, 0);
  },
  drawAlphaCanvas: function (parent, elm) {
    var ctx = elm.getContext("2d");
    var imgdata = ctx.getImageData(0, 0, parent.width, parent.height);
    var imgdatalength = imgdata.data.length;
    for (var i = 0; i < imgdatalength / 4; i++) {
      var x = i % parent.width;
      var y = Math.floor(i / parent.width);
      imgdata.data[4*i] = this.r;
      imgdata.data[4*i+1] = this.g;
      imgdata.data[4*i+2] = this.b;
      imgdata.data[4*i+3] = y/parent.height * 255;
    }
    ctx.putImageData(imgdata, 0, 0);
  },
  hueGradient: function (parent, x, y, hue) {
    var colorValue;
    var segment = (parent.width/6);
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
  },
  colorGradient: function (color, parent, x, y) {
    return Math.floor((255-(255-color)*(x/parent.width))*((parent.height-y)/parent.height));
  },
  createElm: function (elem, parent, className) {
    var elm = document.createElement(elem);
    elm.className = className;
    parent.appendChild(elm);
    return elm
  },
  getMouse: function (e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  },
  getElm: function (elm, type) {
    var a = this.elm[type];
    a.elm = elm;
    a.rect = elm.getBoundingClientRect();
    a.x = this.mouse.x - a.rect.left + a.elm.scrollLeft;
    a.y = this.mouse.y - a.rect.top + a.elm.scrollTop;
    if(a.x < 0) { a.x = a.elm.scrollLeft };
    if(a.x > a.rect.width) { a.x = a.elm.scrollLeft + a.rect.width };
    if(a.y > a.rect.height) { a.y = a.elm.scrollTop + a.rect.height };
    if(a.y < 0) { a.y = a.elm.scrollTop};
    a.width = a.rect.width;
    a.height = a.rect.height;
    a.xPer = a.x / a.width;
    a.yPer = a.y / a.height;
    this.xPer = 1 - this.elm.color.xPer;
    this.yPer = 1 - this.elm.color.yPer;
  },
  updateRGBA: function (parent) {
    var x = Math.floor(this.elm.color.x);
    var y = Math.floor(this.elm.color.y);
    this.r = Math.min(Math.floor((255-(255-this.hue[0])*(x/parent.width))*((parent.height-y)/parent.height)),255);
    this.g = Math.min(Math.floor((255-(255-this.hue[1])*(x/parent.width))*((parent.height-y)/parent.height)),255);
    this.b = Math.min(Math.floor((255-(255-this.hue[2])*(x/parent.width))*((parent.height-y)/parent.height)),255);
    this.a = this.elm.alpha.y/this.elements.alphaCanvas.height;
  },
  updateHue: function (parent) {
    this.hue[0] = Math.floor(this.hueGradient(parent, this.elm.hue.x, this.elm.hue.y, 0));
    this.hue[1] = Math.floor(this.hueGradient(parent, this.elm.hue.x, this.elm.hue.y, 2));
    this.hue[2] = Math.floor(this.hueGradient(parent, this.elm.hue.x, this.elm.hue.y, 4));
  },
  updatePicker: function (type) {
    if(type === "hue") {
      this.elm[type].picker.style.left = this.elm[type].x-(this.elm[type].pickerRect.width/2)+"px";
    } else if(type === "alpha") {
      this.elm[type].picker.style.top = this.elm[type].y-(this.elm[type].pickerRect.height/2)+"px";
    } else {
      this.elm[type].picker.style.left = this.elm[type].x-(this.elm[type].pickerRect.width/2)+"px";
      this.elm[type].picker.style.top = this.elm[type].y-(this.elm[type].pickerRect.height/2)+"px";
    }
  },
  updatePickerCoords: function () {
    this.elm.color.x = (this.xPer === 0 && this.yPer === 0) ? 0 :this.elements.colorCanvas.getBoundingClientRect().width * (1 - this.xPer);
    this.elm.color.y = this.elements.colorCanvas.getBoundingClientRect().height * (1 - this.yPer);
    this.elm.hue.x = this.elements.hueCanvas.getBoundingClientRect().width * (this.h/360);
    this.elm.alpha.y = this.elements.alphaCanvas.getBoundingClientRect().height * this.a;
  },
  updateInputValues: function () {
    this.elements.hexInput.value = this.rgbToHex(this.r, this.g, this.b);
    this.elements.rInput.value = this.r;
    this.elements.gInput.value = this.g;
    this.elements.bInput.value = this.b;
    this.elements.aInput.value = this.a;
    this.elements.rgbaValue.innerText = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a.toFixed(2)})`;
  },
  updateBackgroundColor: function () {
    this.elements.headerContainer.style.background = this.mixWhiteRgba(this.r, this.g, this.b, this.a);
    this.elements.footerContainer.style.background = this.mixWhiteRgba(this.r, this.g, this.b, this.a);
    this.elm.hue.picker.style.backgroundColor = `rgb(${this.hue[0]}, ${this.hue[1]}, ${this.hue[2]})`;
    this.elm.color.picker.style.backgroundColor = `rgb(${this.r}, ${this.g}, ${this.b})`;
    this.elm.alpha.picker.style.backgroundColor = this.mixWhiteRgba(this.r, this.g, this.b, this.a);
  },
  textColorCheck: function () {
    if(this.yPer>0.8 || this.a < 0.5) {
      this.elements.headerTitle.classList.add("darken");
      this.elements.rgbaValue.classList.add("darken");
    } else {
      this.elements.headerTitle.classList.remove("darken");
      this.elements.rgbaValue.classList.remove("darken");
    }
  },
  getHueAndCoords: function () {
    this.min = Math.min(this.r, this.g, this.b);
    this.max = Math.max(this.r, this.g, this.b);
    this.xPer = this.min/this.max;
    this.yPer = this.max/255;

    function getHue(obj, color) {
      return Math.floor(((obj.max*obj.xPer - color)/(obj.xPer - 1))/obj.yPer)
    }

    switch (this.max) {
      case this.r:
        (this.g === this.b) ? this.hue[1] = this.hue[2] = 0 : ((this.g > this.b) ? (this.hue[1] = getHue(this, this.g), this.hue[2] = 0) : (this.hue[2] = getHue(this, this.b), this.hue[1] = 0));
        this.hue[0] = 255;
        break;
      case this.g:
        (this.r === this.b) ? this.hue[0] = this.hue[2] = 0 : ((this.r > this.b) ? (this.hue[0] = getHue(this, this.r), this.hue[2] = 0) : (this.hue[2] = getHue(this, this.b), this.hue[0] = 0));
        this.hue[1] = 255;
        break;
      case this.b:
        (this.r === this.g) ? this.hue[0] = this.hue[1] = 0 : ((this.r > this.g) ? (this.hue[0] = getHue(this, this.r), this.hue[1] = 0) : (this.hue[1] = getHue(this, this.g), this.hue[0] = 0));
        this.hue[2] = 255;
        break;
    }

    if(this.max === this.min) {
      this.hue[1] = this.hue[2] = 0;
      this.xPer = 1;
    }
  },
  hueToH: function () {
    var h;
    var r = this.hue[0]/255;
    var g = this.hue[1]/255;
    var b = this.hue[2]/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var d = max - min;
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = h/6;
    this.h = h*360;
  },
  inputCheck: function (elm, n, color) {
    if(elm.dataset.color === "r" || elm.dataset.color === "g" || elm.dataset.color === "b" || elm.dataset.color === "a") {
      n = Number(n)
      if(isNaN(n) || n<0 || n>255) {
        alert("Insert a valid number value!")
        return this[color]
      }
      else if(color === "a" && n>1) return 1
      else if(color === "a") return n.toFixed(2)
      else return Math.floor(n)
    } else if(elm.dataset.color === "hex") {
      if(n.indexOf("#") !== 0) n = n.replace(/^/,'#');
      if(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(n)) return n;
      else return this.hex;
    }
  },
  rgbToHex: function (r,g,b) {
    return "#" + this.toHex(r)+this.toHex(g)+this.toHex(b)
  },
  toHex: function (n) {
   n = parseInt(n,10);
   if (isNaN(n)) return "00";
   n = Math.max(0,Math.min(n,255));
   return "0123456789ABCDEF".charAt((n-n%16)/16)
        + "0123456789ABCDEF".charAt(n%16);
  },
  hexToRgb: function(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    panel.r = parseInt(result[1], 16);
    panel.g = parseInt(result[2], 16);
    panel.b = parseInt(result[3], 16);
},
  mixWhiteRgba: function(r, g, b, a) {
    var base = [255, 255, 255, 1];
    var color = [r, g, b, a];
    var mix = [];
    mix[3] = 1-(1-color[3])*(1-base[3]);
    mix[0] = Math.round((color[0]*color[3]/mix[3])+(base[0]*base[3]*(1-color[3])/mix[3]));
    mix[1] = Math.round((color[1]*color[3]/mix[3])+(base[1]*base[3]*(1-color[3])/mix[3]));
    mix[2] = Math.round((color[2]*color[3]/mix[3])+(base[2]*base[3]*(1-color[3])/mix[3]));
    return `rgba(${mix[0]}, ${mix[1]}, ${mix[2]}, ${mix[3]})`
  },
  debounce: function(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	}
  },
};

(function buildApp() {
  var elm = panel.elements;
  var wrapper = document.querySelector(".color-picker-container");

  elm.headerContainer = panel.createElm("div", wrapper, "header-container");
  elm.mainContainer = panel.createElm("div", wrapper, "main-container");
  elm.footerContainer = panel.createElm("div", wrapper, "footer-container");

  elm.huePanel = panel.createElm("div", elm.mainContainer, "hue-panel");
  elm.colorPanel = panel.createElm("div", elm.mainContainer, "color-panel");
  elm.hexPanel = panel.createElm("div", elm.mainContainer, "hex-panel");
  elm.rgbaPanel = panel.createElm("div", elm.mainContainer, "rgba-panel");

  elm.hueWrapper = panel.createElm("div", elm.huePanel, "hue-wrapper");
  elm.colorWrapper = panel.createElm("div", elm.colorPanel, "color-wrapper");
  elm.alphaWrapper = panel.createElm("div", elm.colorPanel, "alpha-wrapper");
  elm.hexWrapper = panel.createElm("div", elm.hexPanel, "hex-wrapper");
  elm.rWrapper = panel.createElm("div", elm.rgbaPanel, "r-wrapper");
  elm.gWrapper = panel.createElm("div", elm.rgbaPanel, "g-wrapper");
  elm.bWrapper = panel.createElm("div", elm.rgbaPanel, "b-wrapper");
  elm.aWrapper = panel.createElm("div", elm.rgbaPanel, "a-wrapper");

  elm.hueCanvas = panel.createHueCanvas();
  elm.huePicker = panel.elm.hue.picker = panel.createElm("div", elm.hueWrapper, "hue-picker picker");
  panel.elm.hue.pickerRect = panel.elm.hue.picker.getBoundingClientRect();
  elm.colorCanvas = panel.createColorCanvas();
  elm.colorPicker = panel.elm.color.picker = panel.createElm("div", elm.colorWrapper, "color-picker picker");
  panel.elm.color.pickerRect = panel.elm.color.picker.getBoundingClientRect();
  elm.alphaCanvas = panel.createAlphaCanvas();
  elm.alphaPicker = panel.elm.alpha.picker = panel.createElm("div", elm.alphaWrapper, "alpha-picker picker");
  panel.elm.alpha.pickerRect = panel.elm.alpha.picker.getBoundingClientRect();
  elm.hexInput = panel.createElm("input", elm.hexWrapper, "hex-input");
  elm.hexInput.dataset.color = "hex";
  elm.rInput = panel.createElm("input", elm.rWrapper, "r-input");
  elm.rInput.dataset.color = "r";
  elm.gInput = panel.createElm("input", elm.gWrapper, "g-input");
  elm.gInput.dataset.color = "g";
  elm.bInput = panel.createElm("input", elm.bWrapper, "b-input");
  elm.bInput.dataset.color = "b";
  elm.aInput = panel.createElm("input", elm.aWrapper, "a-input");
  elm.aInput.dataset.color = "a";
  elm.input = Array.from(document.querySelectorAll('input'));

  elm.headerTitle = panel.createElm("p", elm.headerContainer, "header-title");
  elm.headerTitle.innerText = "color picker";
  elm.rgbaValue = panel.createElm("p", elm.footerContainer, "rgba-value");
})()

function resize() {
  panel.getHueAndCoords();
  panel.updatePickerCoords();
  panel.updatePicker("hue");
  panel.updatePicker("color");
  panel.updatePicker("alpha");

  panel.elm.hue.width = panel.elements.hueWrapper.getBoundingClientRect().width;
  panel.elm.hue.height = panel.elements.hueWrapper.getBoundingClientRect().height;
  panel.elements.hueCanvas.width = panel.elm.hue.width;
  panel.elements.hueCanvas.height = panel.elm.hue.height;
  panel.drawHueCanvas(panel.elements.hueCanvas, panel.elements.hueCanvas);

  panel.elements.colorCanvas.width = panel.elements.colorWrapper.getBoundingClientRect().width;
  panel.elements.colorCanvas.height = panel.elements.colorWrapper.getBoundingClientRect().height;
  panel.drawColorCanvas(panel.elements.colorCanvas, panel.elements.colorCanvas);

  panel.elements.alphaCanvas.width = panel.elements.alphaWrapper.getBoundingClientRect().width;
  panel.elements.alphaCanvas.height = panel.elements.alphaWrapper.getBoundingClientRect().height;
  panel.drawAlphaCanvas(panel.elements.alphaCanvas, panel.elements.alphaCanvas);
}
window.addEventListener("resize", function() {
  panel.debounce(resize(), 50);
},true)

panel.elements.hueWrapper.addEventListener("mousedown", function(e) {
  panel.huePickerFlag = true;
  startHueUpdate(e, this);

  var hueMove = panel.debounce(function(event) {
    if(panel.huePickerFlag) {
      startHueUpdate(event, panel.elements.hueWrapper);
    }
  }, 1);

  document.addEventListener("mousemove", hueMove);
  document.addEventListener("mouseup", function() { panel.huePickerFlag = false });

  function startHueUpdate(e, elem) {
    panel.getMouse(e);
    panel.getElm(elem, "hue");
    panel.updateHue(panel.elements.hueCanvas);
    panel.updateRGBA(panel.elements.colorCanvas);
    panel.updatePicker("hue");
    panel.drawColorCanvas(panel.elements.colorCanvas, panel.elements.colorCanvas);
    panel.drawAlphaCanvas(panel.elements.alphaCanvas, panel.elements.alphaCanvas);
    panel.updateInputValues();
    panel.updateBackgroundColor();
  }
})

panel.elements.colorWrapper.addEventListener("mousedown", function(e) {
  panel.colorPickerFlag = true;
  startColorUpdate(e, this);

  document.addEventListener("mousemove", function(event) {
    if(panel.colorPickerFlag) {
      startColorUpdate(event, panel.elements.colorWrapper);
    }
  });

  document.addEventListener("mouseup", function() { panel.colorPickerFlag = false });

  function startColorUpdate(e, elem) {
    panel.getMouse(e);
    panel.getElm(elem, "color");
    panel.updateRGBA(panel.elements.colorCanvas);
    panel.updatePicker("color");
    panel.drawAlphaCanvas(panel.elements.alphaCanvas, panel.elements.alphaCanvas);
    panel.updateInputValues();
    panel.updateBackgroundColor();
    panel.textColorCheck();
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
    panel.getMouse(e);
    panel.getElm(elm, "alpha");
    panel.updateRGBA(panel.elements.colorCanvas);
    panel.updatePicker("alpha");
    panel.updateInputValues();
    panel.updateBackgroundColor();
    panel.textColorCheck();
  }
})

panel.elements.input.forEach(input => input.addEventListener("change", function(e) {
  input.value = panel.inputCheck(this, this.value, this.dataset.color);

  if(this.dataset.color === "hex") {
    panel.hexToRgb(this.value);
    panel[this.dataset.color] = input.value;
  } else panel[this.dataset.color] = input.value;

  panel.updateInputValues();
  panel.getHueAndCoords();
  panel.hueToH();
  panel.updatePickerCoords();
  panel.updatePicker("hue");
  panel.updatePicker("color");
  panel.updatePicker("alpha");
  panel.drawColorCanvas(panel.elements.colorCanvas, panel.elements.colorCanvas);
  panel.drawAlphaCanvas(panel.elements.alphaCanvas, panel.elements.alphaCanvas);
  panel.updateBackgroundColor();
  panel.textColorCheck();
}))

panel.getHueAndCoords();
panel.updateInputValues();
panel.updatePickerCoords();
panel.updatePicker("hue");
panel.updatePicker("color");
panel.updatePicker("alpha");
panel.updateBackgroundColor();
})()
